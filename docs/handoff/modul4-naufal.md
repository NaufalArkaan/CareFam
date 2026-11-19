# Handoff Modul 4 — Naufal (Secure Token Storage & Supabase Auth Flow)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Naufal (Anggota 1)
- **Modul:** Modul 4 — Database & Autentikasi (Secure Token Storage & Supabase Auth Flow)
- **Tanggung Jawab:**
  1. Mengonfigurasi Secure Token Storage menggunakan `expo-secure-store`.
  2. Menyediakan singleton Supabase client terpusat di `lib/supabase.ts`.
  3. Mengimplementasikan Supabase Auth Flow: Sign Up, Sign In, dan Sign Out di `services/authService.ts`.
  4. Melengkapi UI/template form autentikasi pada `components/common/LoginForm.tsx` dengan state form (`email`, `password`, `callsign`, `isRegistering`, `isLoading`, `errorMessage`, `successMessage`).
  5. Menangani loading state, validasi input, pencegahan multiple submission, dan error handling yang ramah.
  6. Menyiapkan kontrak autentikasi yang siap dikonsumsi oleh Robi (AuthContext & Session Subscription) dan Syahrial (Route Protection Guards).

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
|---|:---:|---|
| `package.json` | **Diubah** | Menambahkan dependency `expo-secure-store: ~58.0.2` dan `@supabase/supabase-js: ^2.119.2`. |
| `.env.example` | **Baru** | Template variabel environment publik (`EXPO_PUBLIC_SUPABASE_URL` dan `EXPO_PUBLIC_SUPABASE_ANON_KEY`). |
| `lib/supabase.ts` | **Baru** | Singleton Supabase Client dengan konfigurasi SecureStore storage adapter, validasi env, auto-refresh token, dan persistensi sesi. |
| `services/authService.ts` | **Baru** | Service resmi alur autentikasi Supabase (`signUpUser`, `signInUser`, `signOutUser`). |
| `styles/login.styles.ts` | **Diubah** | Menambahkan styles untuk tab toggle mode (Masuk/Daftar), banner error, banner sukses, dan state disabled tombol. |
| `components/common/LoginForm.tsx` | **Diubah** | Form login dan registrasi interaktif dengan toggle mode, field callsign dinamis, input props teroptimasi, loading state, dan feedback alert. |
| `app/dashboard.tsx` | **Diubah** | Menghubungkan tombol "Keluar" ke fungsi `signOutUser()` sebelum navigasi. |
| `docs/handoff/modul4-naufal.md` | **Baru** | Dokumen handoff resmi pengerjaan Naufal untuk Robi dan Syahrial. |

---

## 3. Detail Implementasi & Kontrak untuk Robi

### A. Lokasi dan Export Supabase Client
Supabase client diekspor sebagai singleton dari [lib/supabase.ts](file:///c:/Pelajaran-Kuliah-UMM/Pemrograman%20Mobile/Praktikum/CareFam/lib/supabase.ts):
```typescript
import { supabase } from '../lib/supabase'; // atau '@/lib/supabase'
```
**Penting:** Seluruh aplikasi hanya boleh menggunakan satu instance client ini. Robi tidak perlu menginisialisasi `createClient` kedua.

### B. Konfigurasi SecureStore Adapter
Adapter dibuat mengikuti interface async storage Supabase:
```typescript
export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => { ... },
  setItem: async (key: string, value: string): Promise<void> => { ... },
  removeItem: async (key: string): Promise<void> => { ... },
};
```
Adapter ini telah disuntikkan ke opsi autentikasi client:
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```
- Token autentikasi disimpan secara terenkripsi menggunakan SecureStore bawaan platform native (iOS/Android).
- Dilengkapi fallback adaptif ke `localStorage` pada platform web agar Expo web tetap stabil saat pengujian browser.
- Tidak menggunakan AsyncStorage.

### C. Nama dan Signature Fungsi Auth
Fungsi tersedia di [services/authService.ts](file:///c:/Pelajaran-Kuliah-UMM/Pemrograman%20Mobile/Praktikum/CareFam/services/authService.ts):

1. **Sign Up:**
   ```typescript
   export async function signUpUser({ email, password, callsign }: SignUpParams): Promise<AuthResponse['data']>
   ```
   - Input `email` dan `callsign` di-trim sebelum dikirim.
   - Password tidak pernah disimpan atau dicatat secara manual.

2. **Sign In:**
   ```typescript
   export async function signInUser({ email, password }: SignInParams): Promise<AuthTokenResponsePassword['data']>
   ```
   - Menggunakan `supabase.auth.signInWithPassword()`.
   - Mengembalikan data sesi dan user.

3. **Sign Out:**
   ```typescript
   export async function signOutUser(): Promise<void>
   ```
   - Menggunakan `supabase.auth.signOut()`.
   - Menghapus sesi secara menyeluruh dari Supabase dan memicu event `SIGNED_OUT`.

### D. Bentuk Metadata Callsign
Pada fungsi `signUpUser`, nama panggilan (`callsign`) dikirim ke Supabase melalui opsi `options.data.callsign`:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: cleanEmail,
  password,
  options: {
    data: {
      callsign: cleanCallsign || undefined,
    },
  },
});
```
Robi dapat mengakses nilai ini melalui objek user: `user.user_metadata.callsign`.

### E. Penanganan Loading, Error, dan Pencegahan Multiple Submission
- **Loading:** State `isLoading: boolean` mengaktifkan teks `"Memproses..."`, menampilkan `<ActivityIndicator />`, dan mendisable tombol submit.
- **Multiple Submission Guard:** Pengecekan `if (isLoading) return;` di awal handler submit mencegah request ganda jika tombol ditekan berulang kali.
- **Validasi Input Dasar:**
  - Email kosong atau tanpa karakter `@` / `.` ditolak sebelum memicu network request.
  - Kata sandi kurang dari 6 karakter ditolak di sisi client.
  - Nama panggilan (callsign) wajib diisi saat mode pendaftaran (`isRegistering === true`).
- **Pesan Kesalahan Deskriptif:** Pesan umum Supabase (seperti `invalid login credentials`, `user already registered`) diterjemahkan ke bahasa Indonesia yang ramah pengguna.
- **Konfirmasi Email:** Jika email confirmation aktif di Supabase Dashboard pengguna (user terbuat namun `session === null`), aplikasi menampilkan notifikasi sukses hijau yang meminta pengguna memeriksa kotak masuk emailnya.

### F. Event Auth yang Diharapkan Diterima oleh AuthContext Robi
Ketika Robi mengimplementasikan `supabase.auth.onAuthStateChange((event, session) => ...)` di `AuthContext`:
1. `INITIAL_SESSION`: Saat startup aplikasi, memulihkan sesi tersimpan dari SecureStore.
2. `SIGNED_IN`: Terpicu otomatis saat pengguna sukses memanggil `signInUser` atau pendaftaran langsung aktif.
3. `SIGNED_OUT`: Terpicu saat pengguna menekan tombol "Keluar" (`signOutUser()`), sehingga AuthContext dapat mengosongkan state user dan Syahrial dapat mengunci kembali route privat.
4. `TOKEN_REFRESHED`: Terpicu saat token disegarkan secara periodik di background.

---

## 4. Hasil Verifikasi & Pengujian Aktual

1. **Pemeriksaan Kompilasi TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   **Hasil:** `Exit code 0` (100% lolos tanpa kesalahan tipe, tanpa `any`, dan tanpa `@ts-ignore`).
2. **Integritas Versi SDK:**
   - Expo SDK tetap berada di `^58.0.22`. Tidak ada downgrade ke SDK 54.
3. **Keamanan Kredensial:**
   - File `.env` milik pengguna terlindungi oleh `.gitignore` dan tidak ter-commit ke Git.
   - Tidak ada hardcode secret key atau penggunaan `service_role` key.
4. **Preservasi Modul 1, 2, & 3:**
   - Navigasi Family Management (Modul 2) dan Weather Card Open-Meteo (Modul 3) pada dashboard tetap utuh dan berfungsi.

---

## 5. Latihan Modifikasi untuk Demo Praktikum (Tugas Pekan Demo)
Jika penguji meminta demonstrasi langsung:
1. **Menguji Validasi Form Client-side:**
   - Masukkan password kurang dari 6 karakter di form login/daftar.
   - Klik tombol submit -> langsung muncul banner merah: *"Kata sandi minimal 6 karakter."* tanpa mengirim request ke server.
2. **Menguji Pencegahan Multiple Submission:**
   - Klik tombol submit saat jaringan lambat -> tombol langsung beralih ke state nonaktif dengan indikator loading berputar, mencegah klik kedua.
3. **Mengubah Format Metadata Callsign:**
   - Buka `services/authService.ts`.
   - Ubah `options.data` untuk menambahkan field kustom baru (misalnya `role_preference: 'family_head'`).
