import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/db';
import { validateEmail } from '@/utils/email-validation';
import { validateUsername } from '@/utils/username-validation';
import { validatePassword } from '@/utils/password-validation';
import bcrypt from 'bcryptjs';

interface CreateAccountRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 Account creation request received');

        // Parse request body
        const body: CreateAccountRequest = await request.json();
        const { username, email, password, confirmPassword } = body;

        // Input validation
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields',
                errors: ['Username, email, password, and password confirmation are required']
            }, { status: 400 });
        }

        // Password confirmation check
        if (password !== confirmPassword) {
            return NextResponse.json({
                success: false,
                message: 'Password confirmation failed',
                errors: ['Passwords do not match']
            }, { status: 400 });
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Username validation failed',
                errors: usernameValidation.errors
            }, { status: 400 });
        }

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Email validation failed',
                errors: emailValidation.errors
            }, { status: 400 });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Password validation failed',
                errors: passwordValidation.errors
            }, { status: 400 });
        }

        // Connect to database
        const db = await getDb("appinfra");
        const users = db.collection("users");

        // Check if username already exists
        const existingUsername = await users.findOne({ username: username });
        if (existingUsername) {
            return NextResponse.json({
                success: false,
                message: 'Username already exists',
                errors: ['This username is already taken']
            }, { status: 409 });
        }

        // Check if email already exists
        const existingEmail = await users.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return NextResponse.json({
                success: false,
                message: 'Email already exists',
                errors: ['This email is already registered']
            }, { status: 409 });
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user document
        const newUser = {
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            emailVerified: false,
            profile: {
                firstName: null,
                lastName: null,
                avatar: null
            },
            settings: {
                theme: 'dark',
                notifications: true
            }
        };

        // Insert user into database
        console.log('💾 Creating user account...');
        const result = await users.insertOne(newUser);

        if (!result.insertedId) {
            throw new Error('Failed to create user account');
        }

        console.log('✅ User account created successfully:', result.insertedId);

        // Return success response (don't include sensitive data)
        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            data: {
                userId: result.insertedId,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('❌ Account creation failed:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to create account',
            errors: ['Internal server error. Please try again later.']
        }, { status: 500 });
    }
}