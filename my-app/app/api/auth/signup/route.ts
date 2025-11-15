import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { username, email, password } = await request.json();
    // Here you would typically add user creation logic, e.g., saving to your database
    if (username && email && password) {
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    }
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
}