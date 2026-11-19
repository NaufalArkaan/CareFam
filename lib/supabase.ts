// RUBRIK: Modul 4 — Secure Token Storage & Supabase Auth Flow (Naufal)

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * CHECKPOINT 1: SecureStore Adapter untuk Supabase Auth
 *
 * Mengimplementasikan interface storage asynchronous (getItem, setItem, removeItem)
 * menggunakan expo-secure-store pada platform native (Android & iOS)
 * serta menyediakan fallback aman ke localStorage pada platform web.
 */
export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Menangani kemungkinan limit penyimpanan native secara silent tanpa crash
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Menangani error penghapusan token secara silent
    }
  },
};

/**
 * CHECKPOINT 2: Validasi Environment Variables
 * Memastikan URL dan Anon Key Supabase tersedia dari process.env tanpa hardcode.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Kredensial Supabase tidak ditemukan. Pastikan variabel EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY telah diatur di file .env'
  );
}

/**
 * Singleton Supabase Client terpusat untuk aplikasi CareFam.
 *
 * Mengonfigurasi:
 * - storage: ExpoSecureStoreAdapter (Secure Token Storage)
 * - autoRefreshToken: true (Refresh token otomatis saat kadaluarsa)
 * - persistSession: true (Menjaga sesi pengguna saat aplikasi dimuat ulang)
 * - detectSessionInUrl: false (Nonaktifkan deteksi URL web hash untuk mobile)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
