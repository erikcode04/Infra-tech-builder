import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const email = searchParams.get('email');


    // Here you would typically check your database
    // For now, let's simulate the check
    const isUsernameTaken = username === 'admin' || username === 'test';
    const isEmailTaken = email === 'admin@test.com';

    const busy = isUsernameTaken || isEmailTaken;



    return NextResponse.json({
        busy,
        message: busy
            ? "Username or email is already taken"
            : "Username and email are available",
        details: {
            usernameTaken: isUsernameTaken,
            emailTaken: isEmailTaken
        }
    });
}