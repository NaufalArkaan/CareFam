# Handoff — Syahrial (Dashboard User)

## Yang Selesai
- Membuat file data `data/userDashboard.ts` yang berisi `USER_FEATURES: FeatureItem[]` (5 item layanan bertanda status 'soon') dan `PROFILE_INFO: InfoItem[]` (3 informasi profil akun demo).
- Membuat fungsi utilitas `utils/features.ts` (`countByStatus`, `getSummaryText`, `isFullWidthCard`) dan `utils/userDashboard.ts` (`getGreeting`).
- Membuat file style `styles/userDashboard.styles.ts` menggunakan token dari `constants/theme.ts`.
- Menimpa stub `app/dashboard.tsx` dengan tampilan Dashboard User yang responsif dan bisa di-scroll.
- Menghubungkan alur navigasi dari `/login` -> `/dashboard` -> `/login`.

## Peta Rubrik (File -> Function/Variabel)
- **Custom function & loop:**
  - `utils/features.ts` -> `countByStatus(items)` (menggunakan loop `for...of` untuk menghitung status item 'active' dan 'soon').
  - `utils/features.ts` -> `getSummaryText(items, unit)` (menggunakan hasil `countByStatus` untuk menghasilkan teks ringkasan).
  - `utils/features.ts` -> `isFullWidthCard(index, total)` (menentukan apakah kartu pada index tertentu harus selebar 100%).
  - `utils/userDashboard.ts` -> `getGreeting(name)` (menghasilkan sapaan pengguna).
  - `app/dashboard.tsx` -> `PROFILE_INFO.map()` & `USER_FEATURES.map()` untuk merender kartu-kartu.
- **Type & array of objects:**
  - `data/userDashboard.ts` -> `USER_FEATURES: FeatureItem[]` & `PROFILE_INFO: InfoItem[]`.
  - `types/index.ts` -> Memanfaatkan `FeatureItem`, `InfoItem`, dan `FeatureStatus`.
- **Inline & external style:**
  - `styles/userDashboard.styles.ts` -> `StyleSheet.create()` untuk kontainer, scroll, header seksi, grid, disclaimer, dan tautan keluar.
  - `app/dashboard.tsx` -> Inline style `{ width: isFullWidthCard(index, total) ? '100%' : '48%' }` pada pembungkus kartu grid (agar kartu ke-5 ganjil otomatis selebar penuh 100%, sedangkan kartu lainnya 48% dalam grid 2 kolom).

## Cara Modifikasi Cepat (Untuk Demo)
- **Ubah Teks Sapaan Pengguna:** Buka `utils/userDashboard.ts`, ubah return string pada `getGreeting(name)` (misal tambah emoji atau ubah kata "Halo").
- **Ubah Layanan & Icon Emoji:** Buka `data/userDashboard.ts`, ubah properti `title`, `description`, atau `icon` pada `USER_FEATURES`.
- **Ubah Teks Ringkasan Layanan:** Buka `utils/features.ts`, ubah format string di `getSummaryText`.
- **Ubah Status Layanan jadi 'active' (Uji Coba Navigasi):** Buka `data/userDashboard.ts`, ubah salah satu item `status: 'soon'` menjadi `'active'`. Card tersebut akan mengaktifkan pembungkus `<Link href={item.route}>`.

## Perubahan pada File Shared
- Tidak ada perubahan pada file shared (`components/common/*`, `components/cards/*`, `constants/theme.ts`, `types/index.ts`). Semua komponen shared Naufal dipakai secara langsung tanpa modifikasi.

## Masalah yang Ditemukan di File Milik Orang Lain
- Tidak ada. Semua file dan utilitas milik Naufal bekerja dengan sangat baik.

## Catatan untuk Anggota Berikutnya (Robi - Dashboard Admin)
1. **Fungsi Reusable di `utils/features.ts`:**
   - Robi dapat langsung mengimpor `countByStatus`, `getSummaryText`, dan `isFullWidthCard` dari `utils/features.ts` untuk digunakan di Dashboard Admin (`app/admin/dashboard.tsx`).
2. **Penggunaan Grid FeatureCard:**
   - Untuk 6 menu `ADMIN_MENUS`, Robi bisa memakai `<View style={{ width: isFullWidthCard(index, total) ? '100%' : '48%' }}>` dan `FeatureCard` seperti yang digunakan di Dashboard User.
3. **Penambahan File milik Robi:**
   - Buat `components/cards/StatCard.tsx`, `data/adminDashboard.ts`, `utils/adminDashboard.ts`, dan `styles/adminDashboard.styles.ts` sesuai SPEC §5.
