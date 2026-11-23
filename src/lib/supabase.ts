import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Custom storage adapter connecting Supabase Auth directly to hardware-encrypted
 * SecureStore on iOS/Android, with a safe localStorage fallback on Web.
 */
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return Promise.resolve(
        typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
      );
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Kredensial Supabase (EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY) belum diatur di .env!"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Isolated non-persisting Supabase client used by initial data/account migration
 * so provisioning starter UMKM owner accounts does not overwrite the active user session.
 */
export function createIsolatedSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Formats Supabase PostgREST errors into clear Indonesian UI error messages.
 */
export function formatSupabaseError(error: any, fallbackMessage: string): Error {
  if (!error) return new Error(fallbackMessage);
  if (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    (typeof error.message === "string" && error.message.includes("does not exist"))
  ) {
    return new Error(
      "Tabel database Supabase belum dibuat. Salin & jalankan 001_create_tables_and_rls.sql di Supabase SQL Editor terlebih dahulu."
    );
  }
  return new Error(error.message || fallbackMessage);
}
