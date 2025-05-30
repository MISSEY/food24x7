# Tech Context: Food24x7

## Technologies Used
### Backend API (Phase 1)
- **Runtime:** Node.js with Express.js framework
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi for request validation
- **Security:** bcrypt for password hashing, helmet for security headers
- **Real-time:** Socket.io for order tracking
- **Documentation:** Swagger/OpenAPI for API documentation
- **Testing:** Jest for unit testing
- **Environment:** dotenv for configuration management

### Future Frontend Technologies (Phase 2)
- **Web:** React.js with TypeScript
- **Mobile:** React Native or Flutter
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS or Material-UI

## Development Setup
- Operating System: Linux 5.15
- Shell: /bin/bash
- Working Directory: /mnt/c/personal/food24x7
- Node.js: Latest LTS version
- Package Manager: npm
- Database: MongoDB (local or cloud)

## Technical Constraints
- RESTful API design principles
- Stateless authentication with JWT
- Scalable architecture for multiple restaurants
- Real-time capabilities for order tracking
- Mobile-responsive design requirements
- Cross-platform compatibility

## Dependencies
### Core Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- joi: Request validation
- helmet: Security middleware
- cors: Cross-origin resource sharing
- dotenv: Environment configuration
- socket.io: Real-time communication

### Development Dependencies
- nodemon: Development server
- jest: Testing framework
- supertest: API testing
- swagger-jsdoc: API documentation
- swagger-ui-express: API documentation UI

## Tool Usage Patterns
- **API Development:** Express.js with middleware pattern
- **Database:** MongoDB with schema-based modeling
- **Authentication:** JWT-based stateless authentication
- **Validation:** Centralized request validation with Joi
- **Error Handling:** Global error handling middleware
- **Logging:** Structured logging for debugging and monitoring

## Environment Configuration
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/food24x7
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## Build and Deployment
- **Development:** nodemon for auto-restart
- **Production:** PM2 for process management
- **Database:** MongoDB Atlas for cloud deployment
- **API Documentation:** Swagger UI for interactive documentation
- **Testing:** Jest with coverage reporting

---
*This document defines the technology stack and development environment for Food24x7.*
