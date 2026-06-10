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

export const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || err.message || "Request failed");
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD, { token, newPassword });
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || err.message || "Reset failed");
    }
};