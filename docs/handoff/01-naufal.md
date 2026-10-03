# Handoff — Naufal (Fondasi Proyek + Login User & Admin)

## Yang Selesai
- Penataan struktur proyek sesuai SPEC §5 dan penyesuaian `app.json` (`typedRoutes: false`) & `tsconfig.json` (`strict: true`).
- Kontrak bersama `constants/theme.ts`, `types/index.ts`, `data/accounts.ts`, `data/loginContent.ts`.
- Fungsi utilitas `utils/roleRoute.ts` dan `utils/login.ts` (menggunakan `for...of`).
- Komponen shared `Header`, `PrimaryButton`, `FeatureCard`, `InfoCard`, `PlaceholderScreen`.
- Komponen `LoginForm` dan halaman `app/login.tsx` (User Login), `app/admin/login.tsx` (Admin Login), `app/_layout.tsx`, `app/index.tsx` (Redirect to `/login`).
- Stub sementara `app/dashboard.tsx` dan `app/admin/dashboard.tsx` menggunakan `PlaceholderScreen`.

## Peta Rubrik (File -> Function/Variabel)
- **Custom function & loop:**
  - `utils/roleRoute.ts` -> `getHomeRoute(role)` & `getRoleLabel(role)`
  - `utils/login.ts` -> `getLoginContent(role)` (menggunakan `for...of`)
  - `utils/login.ts` -> `getAccountsByRole(role)` (menggunakan `for...of`)
  - `components/common/LoginForm.tsx` -> `demoAccounts.map()` untuk render kartu akun demo.
- **Type & array of objects:**
  - `types/index.ts` -> `UserRole`, `DemoAccount`, `LoginContent`, `FeatureStatus`, `FeatureItem`, `InfoItem`, `AdminStat`.
  - `data/accounts.ts` -> `DEMO_ACCOUNTS: DemoAccount[]`
  - `data/loginContent.ts` -> `LOGIN_CONTENT: LoginContent[]`
  - `constants/theme.ts` -> Token `colors`, `spacing`, `radius`, `typography`.
- **Inline & external style:**
  - `styles/login.styles.ts` -> `StyleSheet.create()` untuk seluruh tampilan form login.
  - `components/common/Header.tsx` -> Inline style `{ backgroundColor }` untuk warna header dinamis sesuai peran.
  - `components/common/PrimaryButton.tsx` -> Inline style `{ backgroundColor: color }` untuk warna tombol dinamis.
  - `components/cards/FeatureCard.tsx` -> Inline style `{ opacity: isSoon ? 0.7 : 1.0 }` untuk status `'soon'`.
  - `components/common/LoginForm.tsx` -> Inline style `{ color: content.accentColor }` pada tombol utama.

## Cara Modifikasi Cepat (Untuk Demo)
- **Ubah Judul Login User:** Buka `data/loginContent.ts`, ubah `title` pada objek `role: 'user'` (baris 5).
- **Ubah Warna Tombol Admin Login:** Buka `data/loginContent.ts`, ubah `accentColor` pada objek `role: 'admin'` (baris 11).
- **Ubah Nama Akun Demo:** Buka `data/accounts.ts`, ubah properti `name` pada elemen pertama.

## Perubahan pada File Shared
- Tidak ada perubahan merusak. Seluruh komponen shared dibuat baru dan siap digunakan oleh Anggota 2 (Syahrial) dan Anggota 3 (Robi).

## Masalah yang Ditemukan di File Milik Orang Lain
- Tidak ada.

## Catatan untuk Anggota Berikutnya (Syahrial - Dashboard User & Robi - Dashboard Admin)
1. **Syahrial (Anggota 2):** Cukup timpa isi `app/dashboard.tsx` dengan tampilan Dashboard User. Gunakan komponen `Header`, `InfoCard`, dan `FeatureCard` dari `components/`.
2. **Robi (Anggota 3):** Cukup timpa isi `app/admin/dashboard.tsx` dengan tampilan Dashboard Admin. Buat `StatCard.tsx` di `components/cards/StatCard.tsx`.
3. Seluruh komponen shared tidak memerlukan instalasi library tambahan (hanya React Native dasar + Expo Router).
