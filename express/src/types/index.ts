export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminCheck {
    isAdmin: boolean;
    userId: string;
    role: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: User;
    adminCheck?: AdminCheck;
}