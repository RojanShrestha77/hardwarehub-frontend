"use server";

import { login, register } from "../api/auth";
import { setAuthToken, setUserData } from "../cookies";

export const handleRegister = async (formData: any) => {
    try {
        const result = await register(formData);
        if (result.success) {
            return { success: true,  message: "Registration successful", data: result.data}
        }
        return { success:false, message: result.message || "Registration failed"};

    } catch (error: any) {
        return { success: false, message: error.message };
    }
    
};

export const handleLogin = async (formData: any) => {
    try {
        const res = await login(formData);
        if (res.success) {
            const { token, user } = res.data;
            await setAuthToken(token);
            await setUserData(user);
            return { success: true, message: "Login successful", data: user };
        }
        return { success: false,  message: res.message || "Login failed"};
    } catch (error: any) {
        return { success: false,message: error.message ||"Login failed"};
    }
}