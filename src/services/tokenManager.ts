import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const JWT_TOKEN_KEY = "user_jwt_access_token";

/**
 * Persistent Token Manager menggunakan Expo SecureStore
 * Menyediakan fungsi simpan, ambil, dan hapus JWT access token
 * dengan fallback aman ke localStorage pada platform Web.
 */
export const TokenManager = {
  /**
   * Menyimpan JWT access token ke hardware-encrypted SecureStore
   */
  async saveToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(JWT_TOKEN_KEY, token);
      }
      return;
    }
    await SecureStore.setItemAsync(JWT_TOKEN_KEY, token);
  },

  /**
   * Mengambil JWT access token yang tersimpan di SecureStore
   */
  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(JWT_TOKEN_KEY);
      }
      return null;
    }
    return await SecureStore.getItemAsync(JWT_TOKEN_KEY);
  },

  /**
   * Menghapus JWT access token dari SecureStore (misal saat logout)
   */
  async deleteToken(): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(JWT_TOKEN_KEY);
      }
      return;
    }
    await SecureStore.deleteItemAsync(JWT_TOKEN_KEY);
  },
};
