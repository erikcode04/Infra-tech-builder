import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { checkAdminRole, addUserInfo } from '../middleware/adminMiddleware';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minimum: 6
 *                 example: SecurePass123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/', UserController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           enum: [admin]
 *         required: true
 *         description: User role (must be admin)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Authorization required
 *       403:
 *         description: Admin access required
 */
router.get('/', checkAdminRole, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           enum: [admin]
 *         required: true
 *         description: User role (must be admin)
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authorization required
 *       403:
 *         description: Admin access required
 */
router.delete('/:userId', checkAdminRole, UserController.deleteUser);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User email
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         description: User role
 *     responses:
 *       200:
 *         description: User found
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.get('/email/:email', addUserInfo, UserController.getUserByEmail);

export default router;