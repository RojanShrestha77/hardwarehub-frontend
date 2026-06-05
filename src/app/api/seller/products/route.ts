import { getAuthToken } from "@/lib/cookies";
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function getToken() {
    const token = await getAuthToken();
    if (!token) return null;
    return token;
}

// GET  /api/seller/products  →  list seller products
export async function GET() {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/seller/products`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}

// POST /api/seller/products  →  create product (multipart forwarded as-is)
export async function POST(req: NextRequest) {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();

    const res = await fetch(`${BACKEND}/api/seller/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
