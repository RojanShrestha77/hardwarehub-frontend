import axiosInstance from "../axios";
import { API } from "../endpoints";

export const getMyProducts = async () => {
    try {
        const response = await axiosInstance.get(API.SELLER.PRODUCTS);
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to fetch seller products"
        );
    }
};

export const createProduct = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.SELLER.PRODUCTS, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to create product"
        );
    }
};

export const updateProduct = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.patch(API.SELLER.PRODUCT(id), data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to update product"
        );
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.SELLER.PRODUCT(id));
        return response.data;
    } catch (err: any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to delete product"
        );
    }
};
