# Infra Tech Builder - Express Server

## Architecture Overview

This Express.js server implements a **Controller/Services** pattern with admin middleware for role-based access control.

## 🏗️ Project Structure

```
express/
├── src/
│   ├── controllers/        # HTTP request handlers
│   │   └── userController.ts
│   ├── services/          # Business logic layer
│   │   └── userService.ts
│   ├── routes/            # Route definitions
│   │   └── userRoutes.ts
│   ├── middleware/        # Custom middleware
│   │   └── adminMiddleware.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── server.ts          # Main server file
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env
```

## 🔄 Request Flow

1. **Route** → Defines endpoint and applies middleware
2. **Middleware** → Checks admin role (for protected routes)
3. **Controller** → Handles HTTP request/response, validates input
4. **Service** → Contains business logic and data operations
5. **Response** → Structured JSON response

## 🛡️ Admin Middleware System

The admin middleware system provides role-based access control:

### How it Works
- **`checkAdminRole`**: Strict admin-only access (401/403 on failure)
- **`addUserInfo`**: Adds user context without blocking (optional auth)

### Mock Authentication
Currently uses mock authentication for demonstration:
- **Authorization header**: Required for protected routes
- **x-user-role header**: Must be "admin" for admin endpoints
- **Mock admin token**: Use "admin-token" in Authorization header

### Example Headers for Admin Access:
```bash
Authorization: Bearer admin-token
x-user-role: admin
```

## 📡 API Endpoints

### Public Endpoints
- `GET /` - Server information
- `GET /health` - Health check
- `GET /openapi` - API documentation
- `POST /api/users` - Create user account

### Admin-Only Endpoints
- `GET /api/users` - List all users
- `DELETE /api/users/:userId` - Delete user

### User Endpoints (Context-Aware)
- `GET /api/users/email/:email` - Get user by email (admin or own data)

## 🧪 Testing the API

### 1. Start the Server
```bash
npm run dev
```

### 2. Test User Creation (Public)
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"secure123"}'
```

### 3. Test Admin Endpoint (Protected)
```bash
# This will fail (401 Unauthorized)
curl http://localhost:3001/api/users

# This will succeed
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer admin-token" \
  -H "x-user-role: admin"
```

### 4. Test User Deletion (Admin Only)
```bash
curl -X DELETE http://localhost:3001/api/users/user123 \
  -H "Authorization: Bearer admin-token" \
  -H "x-user-role: admin"
```

## 🔧 Development Features

- **Hot Reload**: Nodemon watches for TypeScript changes
- **Type Safety**: Full TypeScript support with proper interfaces
- **Logging**: Morgan HTTP request logging
- **Security**: Helmet for security headers, CORS enabled
- **Environment**: Dotenv for configuration management

## 📚 OpenAPI Documentation

Access interactive API documentation at:
- `http://localhost:3001/openapi`

The documentation includes:
- All endpoint specifications
- Request/response schemas
- Authentication requirements
- Example requests

## 🚀 Next Steps

1. **Replace Mock Auth**: Implement JWT token verification
2. **Database Integration**: Connect to MongoDB/PostgreSQL
3. **Validation**: Add request validation with Joi or Yup
4. **Testing**: Add unit tests with Jest
5. **Rate Limiting**: Implement API rate limiting
6. **Logging**: Enhanced logging with Winston

## 🔐 Security Notes

- Current implementation uses **mock authentication**
- In production, replace with proper JWT verification
- Add proper password hashing (bcrypt)
- Implement secure session management
- Add input validation and sanitization

## 🏃‍♂️ Running in Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file:
```env
PORT=3001
NODE_ENV=development
# Add your database URLs, JWT secrets, etc.
```

This architecture provides a solid foundation for building scalable APIs with proper separation of concerns and role-based access control.