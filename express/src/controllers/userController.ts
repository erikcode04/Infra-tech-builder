import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserRequest, AuthenticatedRequest } from '../types';

/**
 * User Controller - Handles HTTP requests and responses
 * Contains admin checks and delegates business logic to services
 */
export class UserController {

    /**
     * Create a new user - Public endpoint
     */
    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: CreateUserRequest = req.body;

            // Delegate to service
            const result = await UserService.createUser(userData);

            const statusCode = result.success ? 201 : 400;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('UserController.createUser error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Get all users - Admin only (admin check handled by middleware)
     */
    static async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // Admin check is handled by middleware, so we know user is admin here
            console.log('Admin user requesting all users:', req.adminCheck?.userId);

            // Delegate to service
            const result = await UserService.getAllUsers();

            const statusCode = result.success ? 200 : 400;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('UserController.getAllUsers error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Delete user - Admin only (admin check handled by middleware)
     */
    static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            // Admin check is handled by middleware
            console.log('Admin user deleting user:', {
                adminId: req.adminCheck?.userId,
                targetUserId: userId
            });

            // Delegate to service
            const result = await UserService.deleteUser(userId);

            const statusCode = result.success ? 200 : 400;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('UserController.deleteUser error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Get user by email - Can be used by both admin and regular users
     */
    static async getUserByEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { email } = req.params;

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            // Check if user is admin or requesting their own data
            const isAdmin = req.adminCheck?.isAdmin;
            const isOwnData = req.user?.email === email;

            if (!isAdmin && !isOwnData) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only access your own data or be an admin',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            // Delegate to service
            const result = await UserService.findUserByEmail(email);

            const statusCode = result.success ? 200 : 404;
            res.status(statusCode).json(result);
        } catch (error) {
            console.error('UserController.getUserByEmail error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }
}