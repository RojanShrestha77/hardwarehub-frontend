// Type definitions for the seller domain.
// API functions live in lib/api/seller/product.ts
// Server actions live in lib/actions/seller/product.action.ts

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
    description?: string;
    price: number;
    originalPrice?: number;
    category: string;
    brand: string;
    stock: number;
    rating: string;
    reviewCount: number;
    badge?: string;
    imageUrl?: string;
    specs?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}
