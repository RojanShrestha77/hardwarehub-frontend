"use server";

import { getAllCategories } from "@/lib/api/categories";

export async function handleGetCategories() {
    try {
        const result = await getAllCategories();
        if (result.success) {
            return { success: true, message: "Categories fetched successfully", data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch categories" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch categories" };
    }
}
