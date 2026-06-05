"use server";

import { getAuthToken } from "@/lib/cookies";

const BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function authedFetch(path: string, init: RequestInit = {}) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(init.headers ?? {}),
        },
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
    return json;
}

export async function getSellerProductsAction() {
    const json = await authedFetch("/api/seller/products");
    return json.data ?? [];
}

export async function createProductAction(formData: FormData) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE}/api/seller/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || `Failed to create product (${res.status})`);
    return json.data;
}

export async function updateProductAction(id: string, formData: FormData) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE}/api/seller/products/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || `Failed to update product (${res.status})`);
    return json.data;
}

export async function deleteProductAction(id: string) {
    const json = await authedFetch(`/api/seller/products/${id}`, { method: "DELETE" });
    return json;
}
