# Food24x7 - Food Delivery Platform API

A comprehensive food delivery platform backend API built with Node.js, Express.js, and MongoDB. This API provides complete functionality for customers, restaurants, and administrators to manage food delivery operations.

## 🚀 Features

### For Customers
- User registration and authentication
- Browse restaurants by location, cuisine, and ratings
- Search for restaurants and menu items
- Place and track orders in real-time
- Rate and review restaurants and orders
- Manage delivery addresses and payment methods

### For Restaurants
- Restaurant profile management
- Menu item management with categories and pricing
- Order management and status updates
- Analytics and reporting
- Customer feedback and ratings

### For Administrators
- User and restaurant management
- System analytics and reporting
- Order monitoring and management
- Platform configuration and settings

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, cors
- **Validation**: express-validator
- **Development**: nodemon, dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food24x7
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/food24x7
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   API_VERSION=v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify installation**
   
   Visit `http://localhost:3000/health` to check if the API is running.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```
GET http://localhost:3000/health
```

### Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/updatedetails` - Update user details
- `PUT /auth/updatepassword` - Update password

#### Restaurants
- `GET /restaurants` - Get all restaurants (with filtering)
- `POST /restaurants` - Create restaurant (restaurant owners)
- `GET /restaurants/:id` - Get single restaurant
- `PUT /restaurants/:id` - Update restaurant
- `GET /restaurants/search` - Search restaurants

#### Menu Items
- `GET /menus/restaurant/:restaurantId` - Get restaurant menu
- `POST /menus` - Create menu item
- `GET /menus/:id` - Get single menu item
- `PUT /menus/:id` - Update menu item
- `GET /menus/search` - Search menu items

#### Orders
- `GET /orders` - Get orders (role-based access)
- `POST /orders` - Create new order
- `GET /orders/:id` - Get single order
- `PUT /orders/:id/status` - Update order status
- `PUT /orders/:id/cancel` - Cancel order
- `PUT /orders/:id/rate` - Rate order

#### Admin
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/restaurants` - Get all restaurants
- `GET /admin/orders` - Get all orders
- `GET /admin/analytics` - Get analytics data

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

### Basic Health Check
```bash
node simple-test.js
```

### Comprehensive API Testing
```bash
node test-api.js
```

## 📁 Project Structure

```
food24x7/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/           # Route controllers
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── menus.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── menus.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── services/              # Business logic services
│   └── utils/                 # Utility functions
├── memory-bank/               # Project documentation
├── tests/                     # Test files
├── .env                       # Environment variables
├── package.json
├── API_DOCUMENTATION.md       # Complete API documentation
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access Control**: Different permissions for customers, restaurants, and admins
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Cross-origin resource sharing setup
- **Security Headers**: Helmet.js for security headers
- **Rate Limiting**: Protection against abuse

## 🚦 API Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Order Status Flow

1. **pending** - Order placed, awaiting confirmation
2. **confirmed** - Order confirmed by restaurant
3. **preparing** - Food is being prepared
4. **ready** - Food ready for pickup/delivery
5. **out_for_delivery** - Order is being delivered
6. **delivered** - Order successfully delivered
7. **cancelled** - Order cancelled

## 👥 User Roles

### Customer
- Browse and search restaurants
- Place and track orders
- Rate restaurants and orders
- Manage profile and addresses

### Restaurant
- Manage restaurant profile
- Create and update menu items
- Process orders and update status
- View analytics and reports

### Admin
- Manage all users and restaurants
- View system analytics
- Monitor all orders
- Platform administration

## 🌟 Key Features

### Advanced Search & Filtering
- Search restaurants by name, cuisine, location
- Filter by ratings, delivery time, price range
- Search menu items across all restaurants

### Real-time Order Tracking
- Live order status updates
- Estimated delivery time calculation
- Order history and tracking

### Analytics & Reporting
- Restaurant performance metrics
- Order trends and statistics
- Revenue analytics
- User engagement metrics

### Flexible Menu Management
- Categories and subcategories
- Pricing with offers and discounts
- Availability management
- Nutritional information

## 🚀 Deployment

### Environment Setup
1. Set up production MongoDB database
2. Configure environment variables for production
3. Set up proper JWT secrets
4. Configure CORS for your domain

### Production Considerations
- Use a process manager like PM2
- Set up proper logging
- Configure SSL/HTTPS
- Set up monitoring and alerts
- Implement backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review the project structure and code comments
- Create an issue in the repository

## 🔮 Future Enhancements

- Real-time notifications with Socket.io
- Payment gateway integration
- Mobile app API extensions
- Advanced analytics dashboard
- Multi-language support
- Delivery tracking with GPS
- Loyalty program features

---

**Food24x7** - Delivering great food, powered by great technology! 🍕🚀
