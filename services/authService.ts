// RUBRIK: Modul 4 — Secure Token Storage & Supabase Auth Flow (Naufal)

import { supabase } from '../lib/supabase';
import type { AuthTokenResponsePassword, AuthResponse } from '@supabase/supabase-js';

export interface SignUpParams {
  email: string;
  password: string;
  callsign?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * CHECKPOINT 3: Sign Up Handler
 *
 * Mendaftarkan akun pengguna baru ke Supabase Auth:
 * - Melakukan sanitasi (trim) pada input email dan callsign.
 * - Menyematkan callsign sebagai user_metadata melalui options.data.callsign.
 * - Mengembalikan data respons Supabase tanpa mengasumsikan otomatis mendapatkan sesi
 *   (bergantung pada konfigurasi konfirmasi email di Supabase).
 * - Tidak menyimpan password secara manual.
 *
 * @param params Object berisi email, password, dan callsign opsional
 * @returns Promise<AuthResponse['data']>
 */
export async function signUpUser({
  email,
  password,
  callsign,
}: SignUpParams): Promise<AuthResponse['data']> {
  const cleanEmail = email.trim();
  const cleanCallsign = callsign ? callsign.trim() : '';

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        callsign: cleanCallsign || undefined,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * CHECKPOINT 4: Sign In Handler
 *
 * Mengotentikasi pengguna menggunakan email dan password:
 * - Melakukan sanitasi (trim) pada input email.
 * - Menggunakan method resmi supabase.auth.signInWithPassword().
 * - Sesi dan token ditangani secara otomatis oleh Supabase dan SecureStore adapter.
 *
 * @param params Object berisi email dan password
 * @returns Promise<AuthTokenResponsePassword['data']>
 */
export async function signInUser({
  email,
  password,
}: SignInParams): Promise<AuthTokenResponsePassword['data']> {
  const cleanEmail = email.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * CHECKPOINT 5: Sign Out Handler
 *
 * Mengakhiri sesi aktif pengguna di Supabase:
 * - Menggunakan method resmi supabase.auth.signOut().
 * - Dilengkapi fallback ke scope: 'local' jika terjadi kendala jaringan/token kedaluwarsa,
 *   sehingga token lokal di SecureStore dijamin selalu terhapus.
 * - Memastikan event SIGNED_OUT disiarkan ke AuthContext.
 */
export async function signOutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[authService] Supabase global signOut error, falling back to local signOut:', error.message);
      await supabase.auth.signOut({ scope: 'local' });
    }
  } catch (err) {
    console.warn('[authService] Unexpected error during signOut, fallback to local signOut:', err);
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // Abaikan error fallback
    }
  }
}
