import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface SellerProductData {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    category: string;
    brand: string;
    stock: number;
    badge?: string;
    imageUrl?: string;
    specs?: Record<string, string>;
}

export interface Product {
    id: string;
    sellerId: string;
    name: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    category: string;
    brand: string;
    stock: number;
    rating: string;
    reviewCount: number;
    badge: string | null;
    imageUrl: string | null;
    specs: Record<string, string> | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get all products for the authenticated seller
 */
export const getSellerProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get(API.SELLER.PRODUCTS);
        return response.data.data || [];
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to fetch seller products");
    }
};

/**
 * Create a new product
 */
export const createProduct = async (data: SellerProductData | FormData): Promise<Product> => {
    try {
        const response = await axiosInstance.post(API.SELLER.PRODUCTS, data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
        });
        return response.data.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to create product");
    }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, data: Partial<SellerProductData> | FormData): Promise<Product> => {
    try {
        const response = await axiosInstance.patch(API.SELLER.PRODUCT(id), data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
        });
        return response.data.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update product");
    }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(API.SELLER.PRODUCT(id));
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to delete product");
    }
};
