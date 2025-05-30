# Food24x7 API Documentation

## Overview

Food24x7 is a comprehensive food delivery platform API built with Node.js, Express.js, and MongoDB. The API provides complete functionality for customers, restaurants, and administrators to manage food delivery operations.

**Base URL:** `http://localhost:3000/api/v1`
**Health Check:** `http://localhost:3000/health`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Customer**: Can browse restaurants, place orders, track deliveries
- **Restaurant**: Can manage their restaurant profile, menu items, and orders
- **Admin**: Can manage all users, restaurants, and view analytics

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
```
*Requires Authentication*

#### Update User Details
```http
PUT /api/v1/auth/updatedetails
```
*Requires Authentication*

#### Update Password
```http
PUT /api/v1/auth/updatepassword
```
*Requires Authentication*

#### Forgot Password
```http
POST /api/v1/auth/forgotpassword
```

#### Reset Password
```http
PUT /api/v1/auth/resetpassword/:resettoken
```

### Restaurant Endpoints

#### Get All Restaurants
```http
GET /api/v1/restaurants
```

**Query Parameters:**
- `cuisine`: Filter by cuisine type
- `city`: Filter by city
- `rating`: Minimum rating filter
- `isOpen`: Filter by open status
- `page`: Page number for pagination
- `limit`: Number of results per page

**Response:**
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "next": { "page": 2, "limit": 10 }
  },
  "data": [
    {
      "id": "restaurant-id",
      "name": "Restaurant Name",
      "cuisine": ["Indian", "Chinese"],
      "rating": 4.5,
      "deliveryTime": "30-45 mins",
      "deliveryFee": 30,
      "minimumOrder": 100
    }
  ]
}
```

#### Create Restaurant
```http
POST /api/v1/restaurants
```
*Requires Authentication (Restaurant Role)*

**Request Body:**
```json
{
  "name": "My Restaurant",
  "description": "Delicious food delivered fast",
  "cuisine": ["Indian", "Chinese"],
  "address": {
    "street": "456 Restaurant Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  },
  "phone": "9876543212",
  "email": "contact@myrestaurant.com",
  "openingHours": {
    "monday": { "open": "09:00", "close": "22:00" },
    "tuesday": { "open": "09:00", "close": "22:00" }
  },
  "deliveryRadius": 15,
  "minimumOrder": 100,
  "deliveryFee": 30
}
```

#### Get Single Restaurant
```http
GET /api/v1/restaurants/:id
```

#### Update Restaurant
```http
PUT /api/v1/restaurants/:id
```
*Requires Authentication (Restaurant Owner or Admin)*

#### Delete Restaurant
```http
DELETE /api/v1/restaurants/:id
```
*Requires Authentication (Restaurant Owner or Admin)*

#### Search Restaurants
```http
GET /api/v1/restaurants/search?q=pizza&location=mumbai
```

#### Rate Restaurant
```http
PUT /api/v1/restaurants/:id/rating
```
*Requires Authentication*

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent food and service!"
}
```

### Menu Endpoints

#### Get Restaurant Menu
```http
GET /api/v1/menus/restaurant/:restaurantId
```

**Query Parameters:**
- `category`: Filter by category
- `isAvailable`: Filter by availability
- `maxPrice`: Maximum price filter

#### Create Menu Item
```http
POST /api/v1/menus
```
*Requires Authentication (Restaurant Owner)*

**Request Body:**
```json
{
  "name": "Chicken Biryani",
  "description": "Aromatic basmati rice with tender chicken",
  "price": 250,
  "category": "Main Course",
  "isVegetarian": false,
  "isVegan": false,
  "spiceLevel": "medium",
  "preparationTime": 25,
  "ingredients": ["chicken", "rice", "spices"],
  "allergens": ["none"],
  "nutritionalInfo": {
    "calories": 450,
    "protein": 25,
    "carbs": 55,
    "fat": 12
  }
}
```

#### Get Single Menu Item
```http
GET /api/v1/menus/:id
```

#### Update Menu Item
```http
PUT /api/v1/menus/:id
```
*Requires Authentication (Restaurant Owner)*

#### Delete Menu Item
```http
DELETE /api/v1/menus/:id
```
*Requires Authentication (Restaurant Owner)*

#### Search Menu Items
```http
GET /api/v1/menus/search?q=biryani&vegetarian=true
```

### Order Endpoints

#### Get Orders
```http
GET /api/v1/orders
```
*Requires Authentication*
- Customers see their own orders
- Restaurant owners see their restaurant's orders
- Admins see all orders

#### Create Order
```http
POST /api/v1/orders
```
*Requires Authentication (Customer)*

**Request Body:**
```json
{
  "restaurant": "restaurant-id",
  "items": [
    {
      "menuItem": "menu-item-id",
      "quantity": 2,
      "specialInstructions": "Extra spicy"
    }
  ],
  "deliveryAddress": {
    "street": "123 Delivery Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "paymentMethod": "card",
  "specialInstructions": "Ring the bell twice"
}
```

#### Get Single Order
```http
GET /api/v1/orders/:id
```
*Requires Authentication*

#### Update Order Status
```http
PUT /api/v1/orders/:id/status
```
*Requires Authentication (Restaurant Owner or Admin)*

**Request Body:**
```json
{
  "status": "preparing",
  "estimatedDeliveryTime": "2024-01-15T14:30:00Z"
}
```

**Order Status Values:**
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by restaurant
- `preparing` - Food is being prepared
- `ready` - Food ready for pickup/delivery
- `out_for_delivery` - Order is being delivered
- `delivered` - Order successfully delivered
- `cancelled` - Order cancelled

#### Cancel Order
```http
PUT /api/v1/orders/:id/cancel
```
*Requires Authentication*

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

#### Rate Order
```http
PUT /api/v1/orders/:id/rate
```
*Requires Authentication (Customer)*

**Request Body:**
```json
{
  "overall": 5,
  "food": 5,
  "delivery": 4,
  "comment": "Great food, fast delivery!"
}
```

#### Get My Orders
```http
GET /api/v1/orders/my-orders
```
*Requires Authentication (Customer)*

#### Get Restaurant Orders
```http
GET /api/v1/orders/restaurant/:restaurantId
```
*Requires Authentication (Restaurant Owner or Admin)*

### User Management Endpoints

#### Get All Users
```http
GET /api/v1/users
```
*Requires Authentication (Admin)*

#### Get Single User
```http
GET /api/v1/users/:id
```
*Requires Authentication*

#### Update User
```http
PUT /api/v1/users/:id
```
*Requires Authentication*

#### Delete User
```http
DELETE /api/v1/users/:id
```
*Requires Authentication (Admin)*

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/v1/admin/dashboard
```
*Requires Authentication (Admin)*

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalRestaurants": 85,
      "totalOrders": 5420,
      "totalMenuItems": 2150
    },
    "recentOrders": [...],
    "orderStats": [...],
    "revenue": {
      "totalRevenue": 125000,
      "averageOrderValue": 350
    },
    "monthlyTrends": [...]
  }
}
```

#### Get All Users (Admin)
```http
GET /api/v1/admin/users
```
*Requires Authentication (Admin)*

#### Get All Restaurants (Admin)
```http
GET /api/v1/admin/restaurants
```
*Requires Authentication (Admin)*

#### Get All Orders (Admin)
```http
GET /api/v1/admin/orders
```
*Requires Authentication (Admin)*

**Query Parameters:**
- `page`: Page number
- `limit`: Results per page

#### Verify Restaurant
```http
PUT /api/v1/admin/restaurants/:id/verify
```
*Requires Authentication (Admin)*

#### Deactivate User
```http
PUT /api/v1/admin/users/:id/deactivate
```
*Requires Authentication (Admin)*

#### Get Analytics
```http
GET /api/v1/admin/analytics
```
*Requires Authentication (Admin)*

**Query Parameters:**
- `period`: Number of days (default: 30)

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Error stack trace (development only)"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits:
- 100 requests per 15 minutes per IP address
- Higher limits for authenticated users

## Data Validation

All endpoints include comprehensive input validation:
- Required fields validation
- Data type validation
- Format validation (email, phone, etc.)
- Business logic validation

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start development server: `npm run dev`
5. API will be available at `http://localhost:3000`

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
API_VERSION=v1
```

## Testing

Use the provided test scripts:
- `node simple-test.js` - Basic health check
- `node test-api.js` - Comprehensive API testing

## Support

For API support and questions, please refer to the project documentation or contact the development team.

---

*API Version: v1*
*Last Updated: 2025-05-23*
