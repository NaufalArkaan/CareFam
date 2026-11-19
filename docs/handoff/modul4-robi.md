# Handoff Modul 4 — Robi (Global AuthContext & Real-time Session Subscription)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Robi (Anggota 3)
- **Modul:** Modul 4 — Global AuthContext & Real-time Session Subscription
- **Tanggung Jawab:**
  1. Membuat `AuthContext` dan `AuthProvider` untuk status autentikasi global.
  2. Memulihkan sesi pengguna (*rehydration*) saat aplikasi pertama kali dijalankan menggunakan `supabase.auth.getSession()`.
  3. Berlangganan event status sesi secara real-time menggunakan `supabase.auth.onAuthStateChange()`.
  4. Memasang `AuthProvider` di root layout (`app/_layout.tsx`) membungkus stack aplikasi.
  5. Menjamin Syahrial dapat mengonsumsi `useAuth()` tanpa perlu membuat client Supabase atau state auth lokal baru.

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
|---|:---:|---|
| `context/AuthContext.tsx` | **Baru** | Definisi `AuthContextType`, komponen `AuthProvider`, inisialisasi sesi awal, real-time listener, dan hook `useAuth()`. |
| `lib/supabase.ts` | **Dari Naufal** | Client tunggal Supabase dengan `ExpoSecureStoreAdapter` (Kontrak Naufal). |
| `app/_layout.tsx` | **Diubah** | Membungkus `<Stack>` utama dengan `<AuthProvider>` di root level. |
| `docs/handoff/modul4-robi.md` | **Baru** | Dokumen kontrak handoff ini. |

---

## 3. Kontrak Integrasi untuk Syahrial (Route Guard)

### A. Lokasi File & Path Import
- **Path Import `useAuth`:**
  ```typescript
  import { useAuth } from '../context/AuthContext'; // atau '@/context/AuthContext'
  ```
- **Path Import `AuthProvider` (sudah dipasang di root layout):**
  ```typescript
  import { AuthProvider } from '../context/AuthContext';
  ```

### B. Bentuk Context (`AuthContextType`)
```typescript
import type { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;  // Objek session Supabase aktif (berisi access_token, refresh_token, dll)
  user: User | null;        // Objek user Supabase (id, email, user_metadata, dll)
  isLoading: boolean;       // Status pengecekan sesi awal (rehydration)
}
```

### C. Perilaku `isLoading` saat Startup
1. Saat aplikasi pertama kali dimulai, `isLoading` bernilai **`true`**.
2. Aplikasi membaca storage lokal melalui `supabase.auth.getSession()`.
3. Setelah pengecekan selesai (baik ditemukan sesi login tersimpan maupun `null`), `isLoading` otomatis menjadi **`false`**.
4. Jika terjadi error jaringan/storage, `isLoading` tetap diubah menjadi **`false`** di blok `finally` agar aplikasi tidak terjebak dalam *infinite loading*.

> **Panduan Syahrial:**  
> Selama `isLoading === true`, tampilkan indikator loading / splash screen dan **JANGAN** lakukan redirect rute terlebih dahulu agar tidak terjadi *flicker* atau redirect prematur.

### D. Event Auth Real-time yang Memperbarui Context
`AuthContext` mendengarkan `supabase.auth.onAuthStateChange()` untuk event berikut:
- **`INITIAL_SESSION`**: Menetapkan sesi awal yang tersimpan.
- **`SIGNED_IN`**: Pengguna berhasil login (dari form Naufal). `session` dan `user` langsung terisi otomatis.
- **`SIGNED_OUT`**: Pengguna logout. `session` dan `user` langsung direset menjadi `null`.
- **`TOKEN_REFRESHED`**: Token sesi diperbarui di latar belakang oleh Supabase.
- **`USER_UPDATED`**: Metadata profil pengguna diperbarui.

Semua perubahan sesi langsung disebarkan ke seluruh aplikasi secara reaktif.

---

## 4. Cara Mengonsumsi di Route Guard (Tugas Syahrial)

Syahrial dapat membuat proteksi rute di `app/_layout.tsx` atau komponen guard turunan:

```tsx
import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function RouteGuardLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Tunggu hingga pemulihan sesi awal selesai
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'admin';

    // 2. Jika belum login dan mengakses area terproteksi -> arahkan ke login
    if (!session && !inAuthGroup) {
      router.replace('/login');
    }

    // 3. Jika sudah login dan masih di halaman login -> arahkan ke dashboard
    if (session && inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <Slot />;
}
```

---

## 5. Pemasangan Provider di Root Layout Aktual

Pada [app/_layout.tsx](file:///d:/CareFam/app/_layout.tsx), `<AuthProvider>` telah membungkus seluruh hierarki rute:

```tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Rute-rute aplikasi tetap utuh */}
        <Stack.Screen name="index" options={{ title: 'CareFam' }} />
        <Stack.Screen name="login" options={{ title: 'Masuk' }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        ...
      </Stack>
    </AuthProvider>
  );
}
```

---

## 6. Hasil Verifikasi & Pengujian Aktual

1. **TypeScript Compilation:**
   - Perintah: `npx tsc --noEmit`
   - Hasil: `Exit code 0` (0 error, tanpa `any` dan tanpa `@ts-ignore`).
2. **Ketiadaan Client Kedua:**
   - Seluruh project hanya mengonsumsi client tunggal dari `lib/supabase.ts` (Naufal).
3. **Pembersihan Listener (*Cleanup*):**
   - Menggunakan `subscription.unsubscribe()` dan flag `isMounted = false` pada return fungsi `useEffect` di `AuthProvider` untuk mencegah *memory leak*.
4. **Keamanan:**
   - Tidak ada token, refresh token, atau kredensial sensitif yang dicetak ke console.
