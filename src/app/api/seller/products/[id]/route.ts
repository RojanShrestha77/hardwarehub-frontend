import { getAuthToken } from "@/lib/cookies";
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function getToken() {
    const token = await getAuthToken();
    if (!token) return null;
    return token;
}

// PATCH /api/seller/products/[id]  →  update product
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();

    const res = await fetch(`${BACKEND}/api/seller/products/${params.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}

// DELETE /api/seller/products/[id]  →  delete product
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/seller/products/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
