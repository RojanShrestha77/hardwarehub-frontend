"use server";

import { login, register } from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/cookies";

export async function handleLogin(data: { email: string; password: string }) {
  try {
    const response = await login(data);
    const token = response.token ?? response.access_token ?? response.data?.token;
    const user  = response.user  ?? response.data?.user   ?? response.data;
    if (token) await setAuthCookies(token, user);
    return { success: true, message: "Login successful" };
  } catch (err: any) {
    return { success: false, message: err.message || "Login failed" };
  }
}

export async function handleRegister(data: any) {
  try {
    await register(data);
    return { success: true, message: "Registration successful" };
  } catch (err: any) {
    return { success: false, message: err.message || "Registration failed" };
  }
}
