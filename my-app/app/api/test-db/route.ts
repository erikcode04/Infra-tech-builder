import { NextResponse } from 'next/server';
import { testConnection } from '@/utils/db';

export async function GET() {
    try {
        // Use the efficient connection from db.ts
        const result = await testConnection();

        return NextResponse.json(result, {
            status: result.success ? 200 : 500
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to test MongoDB connection",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}