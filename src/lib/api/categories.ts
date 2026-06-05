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
