import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

// Client-side (axios) — for use inside React components / seller page
export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get(API.CATEGORIES.GET_ALL);
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to fetch categories"
        );
    }
};

// Server-side (fetch) — for use in Next.js Server Components
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}${API.CATEGORIES.GET_ALL}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data : [];
}
