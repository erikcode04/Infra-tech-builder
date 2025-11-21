import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Infra Express Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        architecture: 'Controller/Services pattern',
        documentation: `http://localhost:${port}/openapi`,
        endpoints: {
            users: `http://localhost:${port}/api/users`,
            health: `http://localhost:${port}/health`,
            test: `http://localhost:${port}/api/test`
        }
    });
});// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// OpenAPI route (as requested) - Simple API documentation
app.get('/openapi', (req: Request, res: Response) => {
    res.json({
        openapi: '3.0.0',
        info: {
            title: 'Infra Tech Builder API',
            version: '1.0.0',
            description: 'Controller/Services architecture with admin middleware'
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server'
            }
        ],
        paths: {
            '/': {
                get: {
                    summary: 'Server information',
                    responses: {
                        '200': { description: 'Server status and endpoints' }
                    }
                }
            },
            '/health': {
                get: {
                    summary: 'Health check',
                    responses: {
                        '200': { description: 'Server health status' }
                    }
                }
            },
            '/api/users': {
                post: {
                    summary: 'Create user',
                    description: 'Create a new user account',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['username', 'email', 'password'],
                                    properties: {
                                        username: { type: 'string', example: 'john_doe' },
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        password: { type: 'string', minimum: 6, example: 'SecurePass123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'User created successfully' },
                        '400': { description: 'Invalid input or user exists' }
                    }
                },
                get: {
                    summary: 'Get all users (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'header',
                            name: 'Authorization',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Bearer token'
                        },
                        {
                            in: 'header',
                            name: 'x-user-role',
                            required: true,
                            schema: { type: 'string', enum: ['admin'] },
                            description: 'Must be admin'
                        }
                    ],
                    responses: {
                        '200': { description: 'Users retrieved successfully' },
                        '401': { description: 'Unauthorized' },
                        '403': { description: 'Admin access required' }
                    }
                }
            },
            '/api/users/{userId}': {
                delete: {
                    summary: 'Delete user (Admin only)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'userId',
                            required: true,
                            schema: { type: 'string' },
                            description: 'User ID to delete'
                        },
                        {
                            in: 'header',
                            name: 'Authorization',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            in: 'header',
                            name: 'x-user-role',
                            required: true,
                            schema: { type: 'string', enum: ['admin'] }
                        }
                    ],
                    responses: {
                        '200': { description: 'User deleted successfully' },
                        '400': { description: 'Invalid user ID' },
                        '401': { description: 'Unauthorized' },
                        '403': { description: 'Admin access required' }
                    }
                }
            },
            '/api/users/email/{email}': {
                get: {
                    summary: 'Get user by email',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'email',
                            required: true,
                            schema: { type: 'string', format: 'email' }
                        },
                        {
                            in: 'header',
                            name: 'Authorization',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        '200': { description: 'User found' },
                        '403': { description: 'Access denied' },
                        '404': { description: 'User not found' }
                    }
                }
            }
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    });
});

// API routes
app.use('/api/users', userRoutes);

// Legacy API test route
app.get('/api/test', (req: Request, res: Response) => {
    res.json({
        message: 'API endpoint working',
        data: {
            server: 'Express',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            architecture: 'Controller/Services pattern',
            features: ['OpenAPI Documentation', 'Admin Middleware', 'User Management']
        }
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Infra Express Server is running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Server URL: http://localhost:${port}`);
    console.log(`💊 Health check: http://localhost:${port}/health`);
    console.log(`📖 API Documentation: http://localhost:${port}/openapi`);
    console.log(`🏗️  Architecture: Controller/Services pattern with admin middleware`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   POST   /api/users           - Create user`);
    console.log(`   GET    /api/users           - Get all users (Admin only)`);
    console.log(`   DELETE /api/users/:userId   - Delete user (Admin only)`);
    console.log(`   GET    /api/users/email/:email - Get user by email`);
});

export default app;