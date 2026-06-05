"use server";

import {
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/lib/api/seller/product";

export async function getMyProductsAction() {
    try {
        const result = await getMyProducts();
        if (result.success) {
            return { success: true, message: "Products fetched successfully", data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch products" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch products" };
    }
}

export async function handleCreateProduct(formData: FormData) {
    try {
        const result = await createProduct(formData);
        if (result.success) {
            return { success: true, message: "Product created successfully", data: result.data };
        }
        return { success: false, message: result.message || "Failed to create product" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create product" };
    }
}

export async function handleUpdateProduct(id: string, formData: FormData) {
    try {
        const result = await updateProduct(id, formData);
        if (result.success) {
            return { success: true, message: "Product updated successfully", data: result.data };
        }
        return { success: false, message: result.message || "Failed to update product" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update product" };
    }
}

export async function deleteProductAction(id: string) {
    try {
        const result = await deleteProduct(id);
        if (result.success) {
            return { success: true, message: "Product deleted successfully" };
        }
        return { success: false, message: result.message || "Failed to delete product" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete product" };
    }
}
