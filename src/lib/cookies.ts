"use server";

import { cookies} from "next/headers";

// backends create jwt while logging in
// frontends receives jwt
// frontends store it (set) = setAuthToken
// frontends read it (get) = getAuthToken

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token });
};

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
};

export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "user_data", value: JSON.stringify(userData)});
    if(userData.role === "seller") {
        cookieStore.set({ name: "userRole", value:userData.role });
    }
    if (userData.id) {
        cookieStore.set({name: "userId", value: userData.id });
    }
};

export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    return userData ? JSON.parse(userData) : null;
};

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
    cookieStore.delete("userRole");
    cookieStore.delete("userId");
};
