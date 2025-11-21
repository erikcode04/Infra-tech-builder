import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/utils/db";
import axios from "axios";
export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();
        const db = await getDb();
        const collection = db.collection("documents");
        const documents = await collection.find({ content: { $regex: query, $options: 'i' } }).toArray();
        return NextResponse.json({ success: true, data: documents });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ success: false, message: "Error fetching documents" }, { status: 500 });
    }
}