# CareFam — SPEC Modul 4: Database & Autentikasi

> **Versi:** 4.0  
> **Sumber:** Modul 4 Pemrograman Mobile versi 3.0, Agustus 2026, khususnya materi halaman 4–25 dan Tugas Minggu Demo halaman 33–34.  
> **Project:** CareFam — melanjutkan project Modul 1, Modul 2, dan Modul 3.

## 1. Tujuan

Mengintegrasikan autentikasi Supabase ke aplikasi CareFam dengan penyimpanan sesi yang aman, status autentikasi global, dan perlindungan navigasi menggunakan Expo Router.

Assignment yang menjadi fokus:
1. Secure Token Storage menggunakan `expo-secure-store`.
2. Supabase Auth Flow: Sign Up, Sign In, Sign Out, loading/error states.
3. Global `AuthContext` dan real-time session subscription.
4. Route Protection Guards menggunakan Expo Router.

Codelab 1–5 tetap harus dikerjakan dan diverifikasi terpisah sesuai modul.

## 2. Kesinambungan project

1. Lanjutkan repository CareFam yang sudah digunakan pada Modul 1–3. Jangan membuat project baru.
2. Pertahankan fitur, halaman, routing, komponen, dan dependency Modul 1–3.
3. Baca SPEC Modul 1–3, dokumentasi Antigravity, dan handoff sebelumnya sebelum mengubah kode.
4. Jangan mengasumsikan struktur folder, nama route group, versi Expo, atau dependency. Inspeksi repository terlebih dahulu.
5. PDF menyebut Expo SDK 54 sebagai konteks persiapan. Project CareFam yang sudah berjalan harus dipertahankan pada versi SDK/dependency aktualnya. Jangan downgrade/upgrade SDK hanya untuk menyamakan contoh PDF tanpa persetujuan.
6. Jangan menimpa template yang tersedia. Lengkapi bagian yang belum ada.
7. Jangan commit, push, merge, atau mengganti branch otomatis.
8. Jangan menambahkan dependency yang tidak diperlukan.
9. Jangan meminta AI membuat Supabase URL, anon key, password, atau credential. Nilai Supabase harus berasal dari project pengguna.

## 3. Arsitektur autentikasi

```text
Aplikasi dibuka
    |
    v
Root Layout / AuthProvider
    |
    v
Supabase memulihkan sesi
(dengan storage adapter SecureStore)
    |
    v
AuthContext menerima status sesi
    |
    +---- isLoading = true ----> tampilkan loading/splash
    |
    +---- session tersedia ----> area aplikasi privat
    |
    +---- session tidak ada ---> area autentikasi
```

Perubahan sesi selanjutnya disiarkan melalui `supabase.auth.onAuthStateChange()`. Ketiga anggota menggunakan satu Supabase client dan satu sumber status autentikasi.

## 4. Supabase dan environment

Gunakan Supabase project milik pengguna. Environment variable sesuai Codelab 2:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Ketentuan:
- Isi URL dan anon key dari Supabase Dashboard milik pengguna.
- Jangan hardcode URL/key ke source code.
- Jangan meminta AI menebak atau membuat credential.
- Jangan memasukkan `.env` ke Git; periksa `.gitignore`.
- Nilai `EXPO_PUBLIC_` dapat disertakan dalam bundle aplikasi. Anon key bukan pengganti keamanan database.
- Jangan pernah memasukkan `service_role` key ke aplikasi mobile.
- Buat satu Supabase client terpusat, misalnya `lib/supabase.ts`, mengikuti struktur repository. Jangan membuat client kedua.

## 5. Secure Token Storage

Tujuan: menyimpan dan mengambil sesi/token autentikasi menggunakan `expo-secure-store`, bukan AsyncStorage.

Persyaratan:
- Pasang `expo-secure-store` dengan perintah yang kompatibel dengan SDK project saat ini jika belum ada.
- Buat adapter async dengan `getItem`, `setItem`, dan `removeItem` yang memanggil API SecureStore.
- Hubungkan adapter tersebut ke konfigurasi `createClient` Supabase.
- Gunakan API async SecureStore.
- Aktifkan persistensi sesi dan auto refresh sesuai pola Supabase React Native yang kompatibel dengan versi package project.
- Jangan menyimpan password secara manual.
- Jangan menulis token ke log atau menampilkannya di UI.
- Jangan menyimpan token autentikasi di AsyncStorage.

Contoh bentuk adapter konseptual (sesuaikan dengan versi package aktual):

```ts
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
```

Adapter harus benar-benar dipakai oleh Supabase client.

## 6. Supabase Auth Flow

### Sign Up
- Gunakan `supabase.auth.signUp()`.
- Form pendaftaran menggunakan email, password, dan `callsign` sesuai template Codelab 3 jika field tersedia.
- Trim email dan callsign.
- Kirim callsign sebagai metadata user, misalnya `options.data.callsign`.
- Tangani error dan kondisi konfirmasi email.
- Jangan menganggap sign up selalu langsung menghasilkan sesi; hasil bergantung pada konfigurasi email confirmation Supabase.
- Jangan menyimpan password secara manual.

### Sign In
- Gunakan `supabase.auth.signInWithPassword()`.
- Trim email sebelum request.
- Tangani kredensial salah, koneksi gagal, dan error Supabase tanpa membuat aplikasi crash.
- Jangan mengubah password secara diam-diam.
- Session dikelola Supabase dan disinkronkan ke AuthContext.

### Sign Out
- Gunakan `supabase.auth.signOut()`.
- Tangani hasil/error.
- Perubahan sesi harus diterima AuthContext dan membuat route guard mengunci area privat.
- Jangan hanya menghapus token lokal secara manual sementara sesi Supabase masih aktif.

### Loading, error, dan UX
- Tampilkan loading/ActivityIndicator selama request.
- Nonaktifkan tombol submit selama loading agar tidak terjadi multiple submission.
- Tampilkan pesan error yang mudah dipahami.
- Validasi input dasar sebelum request.
- Untuk email gunakan `keyboardType="email-address"`, `autoCapitalize="none"`, dan `autoCorrect={false}` jika komponen mendukung.
- Pertahankan UI/template auth yang tersedia; jangan mengganti seluruh halaman tanpa alasan dan persetujuan.

## 7. Global AuthContext & Real-time Session Subscription

AuthContext menyediakan status global minimal:
- `session` atau null.
- `user` atau null.
- `isLoading` untuk proses pemulihan sesi awal.

Perilaku wajib:
1. Saat aplikasi mulai, periksa sesi awal dari Supabase.
2. Selama status awal belum diketahui, `isLoading` tetap true.
3. Berlangganan `supabase.auth.onAuthStateChange()` untuk menerima event seperti `INITIAL_SESSION`, `SIGNED_IN`, `SIGNED_OUT`, dan `TOKEN_REFRESHED`.
4. Perbarui session/user global sesuai event.
5. Hentikan subscription saat provider unmount dengan `subscription.unsubscribe()`.
6. Pastikan loading awal selesai baik ketika sesi ditemukan maupun tidak.
7. Hindari race condition antara pemeriksaan sesi awal dan listener. Gunakan pola yang kompatibel dengan versi Supabase aktual.
8. Jangan membuat listener berulang setiap render.
9. Hindari operasi Supabase berat/rekursif di callback auth; callback cukup memperbarui state yang diperlukan.

Provider membungkus aplikasi dari root layout sesuai arsitektur Expo Router aktual.

## 8. Route Protection Guards

Gunakan `useSegments()` dari Expo Router di root `app/_layout.tsx` (atau root layout aktual).

Aturan:
- Jika `isLoading === true`, jangan redirect. Tampilkan loading/splash agar tidak terjadi flicker.
- Jika pengguna belum login dan mencoba area privat, arahkan ke route login yang benar-benar ada.
- Jika pengguna sudah login tetapi berada di halaman login/register, arahkan ke area aplikasi.
- Setelah logout, area privat harus terkunci dan pengguna diarahkan ke login.
- Nama route group mengikuti struktur aktual. PDF memberi contoh `/(auth)/login` dan `/(app)`, tetapi jangan mengasumsikan nama tersebut jika repository berbeda.
- Pastikan `AuthProvider` membungkus komponen yang menggunakan context.
- Pertahankan konfigurasi `Stack` dan `Stack.Screen`; tambahkan seperlunya tanpa merusak navigasi Modul 1–3.

## 9. Pembagian tugas anggota

### Naufal — Secure Token Storage & Supabase Auth Flow
Fokus:
- Memeriksa dependency `expo-secure-store`.
- Membuat adapter SecureStore untuk Supabase.
- Menyiapkan satu Supabase client terpusat dan konfigurasi environment jika belum ada.
- Melengkapi Sign Up, Sign In, Sign Out pada template auth.
- Mengirim `callsign` sebagai metadata saat sign up jika field tersedia.
- Menangani loading, error, validasi, dan multiple submission.

Usulan file (sesuaikan struktur aktual):
- `lib/supabase.ts`
- `lib/secureStorage.ts` bila pemisahan diperlukan
- `app/(auth)/login.tsx` atau halaman auth aktual
- konfigurasi environment dan `.gitignore` bila diperlukan.

**Handoff ke Robi:** ekspor satu Supabase client yang stabil dan jelaskan konfigurasi SecureStore. Jangan membuat AuthContext.

### Robi — Global AuthContext & Real-time Session Subscription
Fokus:
- Membuat `AuthContext` dan `AuthProvider`.
- Menginisialisasi session/user saat aplikasi dibuka.
- Berlangganan `supabase.auth.onAuthStateChange()`.
- Memperbarui status global saat sign in, sign out, atau token refresh.
- Membersihkan subscription saat provider unmount.
- Menyediakan hook `useAuth()` bertipe jelas.

Usulan file: `context/AuthContext.tsx` atau lokasi context aktual.

**Handoff ke Syahrial:** jelaskan import `AuthProvider`, `useAuth()`, bentuk context (`session`, `user`, `isLoading`), dan cara memasang provider. Jangan mengimplementasikan route redirect.

### Syahrial — Route Protection Guards
Fokus:
- Memeriksa segment aktif menggunakan `useSegments()`.
- Membaca `user` dan `isLoading` dari `useAuth()`.
- Menambahkan guard di root `_layout.tsx`.
- Menahan redirect selama loading.
- Mengarahkan guest ke login dan authenticated user ke area aplikasi.
- Memastikan logout mengunci kembali route privat.

Usulan file: `app/_layout.tsx` atau root layout aktual.

**Handoff:** gunakan AuthProvider dan hook Robi. Jangan membuat state autentikasi lokal atau Supabase client baru.

## 10. Urutan implementasi dan koordinasi

1. **Naufal:** audit project, SecureStore adapter, Supabase client, dan Auth Flow.
2. **Robi:** gunakan client Naufal untuk membangun AuthContext dan subscription.
3. **Syahrial:** gunakan AuthProvider/useAuth Robi untuk menerapkan guard di root layout.
4. **Integrasi:** uji sign up, sign in, cold start, session persistence, sign out, dan redirect.
5. **Audit:** jalankan TypeScript check dan uji pada target runtime.

Setiap anggota wajib membaca SPEC/handoff, memeriksa Git, menyajikan rencana file, menunggu persetujuan `SETUJU`, bekerja per checkpoint, dan melaporkan hasil. Jangan mengedit file anggota lain tanpa koordinasi. Jangan commit/push/merge otomatis.

## 11. Verifikasi

### A. Secure Token Storage
- [ ] SecureStore terpasang sesuai SDK.
- [ ] Supabase client menggunakan adapter SecureStore.
- [ ] Session dipersistenkan dan dipulihkan setelah aplikasi dimuat ulang.
- [ ] Token tidak disimpan di AsyncStorage.
- [ ] Password/token tidak ditulis ke log.
- [ ] Tidak ada service role key di aplikasi.

### B. Auth Flow
- [ ] Sign Up berhasil dengan input valid.
- [ ] Callsign dikirim sebagai metadata.
- [ ] Perilaku konfirmasi email ditangani.
- [ ] Sign In berhasil dengan kredensial valid.
- [ ] Kredensial salah menampilkan error tanpa crash.
- [ ] Sign Out mengakhiri sesi.
- [ ] Loading tampil dan tombol submit dinonaktifkan.
- [ ] Multiple submission dicegah.

### C. AuthContext
- [ ] AuthProvider membungkus aplikasi.
- [ ] Sesi awal dipulihkan saat cold start.
- [ ] `isLoading` mencegah redirect sebelum status sesi diketahui.
- [ ] `onAuthStateChange()` memperbarui user/session.
- [ ] Token refresh dan sign out tersinkronisasi.
- [ ] Subscription dibersihkan saat unmount.

### D. Route Guards
- [ ] Guest diarahkan ke login saat mengakses area privat.
- [ ] User login dapat masuk ke area aplikasi.
- [ ] User login tidak tertahan di login/register.
- [ ] Tidak ada flicker/redirect loop saat startup.
- [ ] Logout mengunci area privat dan mengarahkan ke login.

### E. Regresi
- [ ] Modul 1 tetap berjalan.
- [ ] Modul 2 tetap berjalan.
- [ ] Modul 3 tetap berjalan, termasuk fitur cuaca jika sudah ada.
- [ ] Routing dan layout lama tidak rusak.

## 12. Rubrik penilaian Modul 4

| Kriteria | Bobot | Bukti implementasi |
|---|---:|---|
| Codelab 1–5 | 40% | Kelima Codelab dikerjakan sesuai instruksi modul |
| Secure Token Storage | 5% | Supabase session storage menggunakan Expo SecureStore |
| Supabase Auth Flow (Sign Up, Sign In, Sign Out, Loading States) | 10% | Alur autentikasi, validasi, loading, dan error |
| Global AuthContext & Real-time Session Subscription | 5% | Provider global, pemulihan sesi, `onAuthStateChange()` |
| Route Protection Guards | 5% | `useSegments()`, redirect sesuai status autentikasi |
| Answer Question | 15% | Mampu menjelaskan implementasi dan alasan teknis |
| Completing Challenge (live code 5-min) | 20% | Mampu memodifikasi kode langsung dalam 5 menit |
| **TOTAL** | **100%** | |

Catatan: tiga bagian assignment yang dibagi ke anggota memiliki bobot total 20% (5% + 10% + 5%). Answer Question 15% dan Completing Challenge 20% dinilai terpisah.

## 13. Definition of Done

- [ ] Satu Supabase client digunakan di seluruh aplikasi.
- [ ] Supabase URL dan anon key berasal dari environment.
- [ ] SecureStore digunakan untuk persistensi sesi.
- [ ] Sign Up, Sign In, dan Sign Out berfungsi.
- [ ] Loading/error states dan pencegahan submit ganda diterapkan.
- [ ] Callsign dikirim sebagai metadata saat pendaftaran jika sesuai template.
- [ ] AuthContext memulihkan dan menyebarkan session.
- [ ] Real-time auth subscription dibersihkan dengan benar.
- [ ] Route guard menunggu status auth awal sebelum redirect.
- [ ] Guest tidak dapat mengakses area privat.
- [ ] Authenticated user tidak diarahkan kembali ke login.
- [ ] Logout mengunci kembali area privat.
- [ ] Modul 1–3 tidak mengalami regresi.
- [ ] TypeScript check dan pengujian manual dilakukan dan dilaporkan jujur.
- [ ] Setiap anggota dapat menjelaskan dan memodifikasi kontribusinya.
