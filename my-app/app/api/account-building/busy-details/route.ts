import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/utils/db';

export async function GET(request: NextRequest) {
    console.log('🚀 Busy details request received');
    const { searchParams } = new URL(request.url);
    console.log('🔍 Extracting parameters from request URL', request.url);

    // Extract individual parameters directly from searchParams
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    // Also check for array-style parameters (details[username], details[email])
    const usernameFromArray = searchParams.get('details[username]');
    const emailFromArray = searchParams.get('details[email]');

    // Use whichever format was provided
    const finalUsername = username || usernameFromArray;
    const finalEmail = email || emailFromArray;

    console.log(`📋 Extracted parameters:`);
    console.log(`  - username: ${finalUsername}`);
    console.log(`  - email: ${finalEmail}`);

    // Check if at least one parameter is provided
    if (!finalUsername && !finalEmail) {
        return NextResponse.json({
            busy: false,
            message: "No username or email provided for checking",
            details: {}
        });
    }
    // Check database for existing username and email
    const db = await getDb("appinfra");
    const users = db.collection("users");

    const isUsernameTaken = finalUsername
        ? await users.findOne({ username: finalUsername }) !== null
        : false;
    const isEmailTaken = finalEmail
        ? await users.findOne({ email: finalEmail.toLowerCase() }) !== null
        : false;

    console.log(`🔍 Database check results:`);
    console.log(`  - Username "${finalUsername}" taken: ${isUsernameTaken}`);
    console.log(`  - Email "${finalEmail}" taken: ${isEmailTaken}`);
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