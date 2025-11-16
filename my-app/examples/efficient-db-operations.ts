// Example API routes showing efficient database patterns

// ===== CREATING DATA (POST) =====
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, email, password } = body;

        // Get database instance (uses efficient connection)
        const db = await getDb("appinfra");
        const users = db.collection("users");

        // Insert new user
        const result = await users.insertOne({
            username,
            email,
            password, // Remember to hash this in real app!
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            userId: result.insertedId,
            message: "User created successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// ===== READING DATA (GET) =====
export async function GET() {
    try {
        const db = await getDb("appinfra");
        const users = db.collection("users");

        // Find all users (limit for performance)
        const userList = await users
            .find({})
            .limit(50) // Always limit results
            .sort({ createdAt: -1 }) // Sort by newest first
            .toArray();

        return NextResponse.json({
            success: true,
            users: userList,
            count: userList.length
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// ===== UPDATING DATA (PUT) =====
// app/api/users/[id]/route.ts
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { username, email } = body;

        const db = await getDb("appinfra");
        const users = db.collection("users");

        // Update specific user
        const result = await users.updateOne(
            { _id: new ObjectId(params.id) }, // Filter
            {
                $set: {
                    username,
                    email,
                    updatedAt: new Date()
                }
            } // Update
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// ===== DELETING DATA (DELETE) =====
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = await getDb("appinfra");
        const users = db.collection("users");

        const result = await users.deleteOne({
            _id: new ObjectId(params.id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}