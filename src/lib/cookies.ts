"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_KEY)?.value ?? null;
}

export async function getUserData(): Promise<any | null> {
  const store = await cookies();
  const raw = store.get(USER_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setAuthCookies(token: string, user: any) {
  const store = await cookies();
  store.set(TOKEN_KEY, token, cookieOpts);
  store.set(USER_KEY, JSON.stringify(user), cookieOpts);
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(TOKEN_KEY);
  store.delete(USER_KEY);
}
