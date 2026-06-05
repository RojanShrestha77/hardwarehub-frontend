import axiosInstance from "./axios"
import { API } from "./endpoints"

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || err.message || "Registraion failed");

    }
};

export const login = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || err.message || "Login failed");
    }
};