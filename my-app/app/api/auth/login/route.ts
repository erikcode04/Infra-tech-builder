import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { username, email, password } = await request.json();
    // Here you would typically validate the input and check against your database
    if (username === "testuser" && password === "password123") {
        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
}