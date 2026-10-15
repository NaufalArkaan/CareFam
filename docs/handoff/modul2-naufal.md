# Handoff Modul 2 — Naufal (Family Management: Layout & Stack.Screen)

## 1. Ringkasan Tugas
Pada Modul 2 ini, Naufal bertanggung jawab atas arsitektur layout dan konfigurasi `<Stack.Screen>` pada fitur **Family Management** sisi User serta memastikan kesinambungan rute Modul 1:
1. **Audit Layout & Keputusan Ekstensi:**
   - Memeriksa struktur layout aktual dan mengonfirmasi penggunaan file `_layout.tsx` (bukan `_layout.ts`) karena adanya penggunaan sintaks JSX.
   - Menganalisis kebutuhan layout root vs nested, memutuskan penggunaan Root Stack tunggal untuk menghindari overhead *nested navigator* dan menjaga integritas navigasi tim.
2. **Konfigurasi `<Stack.Screen>`:**
   - Mendefinisikan rute Family Management (`family/index`, `family/add`, `family/[id]`) secara eksplisit di dalam `<Stack>` dengan metadata judul (*title*) yang sesuai.
   - Mempertahankan `screenOptions={{ headerShown: false }}` di root level agar komponen kustom `<Header />` dari Modul 1 tetap seragam dan estetis.
3. **Preservasi Rute Modul 1 & Integrasi Tim:**
   - Mendaftarkan rute Modul 1 (`index`, `login`, `dashboard`, `admin/login`, `admin/dashboard`) secara deklaratif.
   - Menyelaraskan rute dengan navigasi imperatif Robi (`router.push`, `router.back`, `router.replace`) dan state store Syahrial.

---

## 2. File yang Dibuat dan Diubah

| File | Status | Keterangan |
|---|---|---|
| `app/_layout.tsx` | Diubah | Mendaftarkan elemen `<Stack.Screen>` secara eksplisit untuk rute Family Management (`family/index`, `family/add`, `family/[id]`) dan rute Modul 1 dengan metadata judul yang tepat. |
| `docs/handoff/modul2-naufal.md` | Baru | Dokumentasi handoff pengerjaan tugas Modul 2 oleh Naufal. |

---

## 3. Detail Konfigurasi Layout & `<Stack.Screen>`

### A. Kode Konfigurasi pada `app/_layout.tsx`
```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Rute Utama & Autentikasi (Modul 1) */}
      <Stack.Screen name="index" options={{ title: 'CareFam' }} />
      <Stack.Screen name="login" options={{ title: 'Masuk' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />

      {/* RUBRIK Modul 2: Konfigurasi <Stack.Screen> untuk Fitur Family Management (Naufal) */}
      <Stack.Screen
        name="family/index"
        options={{
          title: 'Keluarga Saya',
        }}
      />
      <Stack.Screen
        name="family/add"
        options={{
          title: 'Tambah Anggota',
        }}
      />
      <Stack.Screen
        name="family/[id]"
        options={{
          title: 'Detail Anggota',
        }}
      />

      {/* Rute Admin (Modul 1) */}
      <Stack.Screen name="admin/login" options={{ title: 'Masuk Admin' }} />
      <Stack.Screen name="admin/dashboard" options={{ title: 'Panel Admin' }} />
    </Stack>
  );
}
```

### B. Keputusan Desain & Landasan Teori
1. **Mengapa Harus `.tsx` dan Bukan `.ts`?**
   - Komponen layout mengembalikan markup JSX/TSX (`<Stack>` dan `<Stack.Screen>`).
   - Dalam standar TypeScript, file dengan sintaks tag JSX wajib memiliki ekstensi `.tsx`. Jika dipaksakan berekstensi `.ts`, compiler TypeScript akan melempar error kompilasi JSX.
2. **Mengapa Memilih Single Root Stack daripada Nested Layout (`app/family/_layout.tsx`)?**
   - **Mencegah Duplikasi Stack Navigator:** Menggunakan layout bersarang akan menciptakan Stack di dalam Stack yang memicu *double transition animation* dan memori berlebih.
   - **Kelancaran Alur Back Stack:** Tombol kembali pada halaman detail (`router.back()`) dan tombol `← Kembali ke Dashboard` pada daftar keluarga dapat bergerak bebas dalam satu hierarki tumpukan tanpa batas sub-navigator.
   - **Kepatuhan Rubrik:** Rubrik praktikum menginstruksikan untuk menghindari layout bersarang tanpa kebutuhan mendesak.
3. **Pemberian Metadata Judul (`options={{ title: ... }}`):**
   - Meskipun header native disembunyikan (`headerShown: false`) demi estetika custom header CareFam, atribut `title` tetap disematkan untuk aksesibilitas, label tab browser, serta kesiapan jika platform tertentu membutuhkan native header.

---

## 4. Matriks Integrasi Rute Proyek CareFam

| Rute URL | Berkas Fisik | `<Stack.Screen name="..." />` | Judul Layar | Modul / Pemilik | Fungsi / Alur |
|---|---|---|---|---|---|
| `/` | `app/index.tsx` | `index` | CareFam | Modul 1 (Naufal) | Redirect otomatis ke `/login` |
| `/login` | `app/login.tsx` | `login` | Masuk | Modul 1 (Naufal) | Form login pengguna umum |
| `/dashboard` | `app/dashboard.tsx` | `dashboard` | Dashboard | Modul 1 (Syahrial) | Dashboard ringkasan profil & menu fitur |
| `/family` | `app/family/index.tsx` | `family/index` | Keluarga Saya | Modul 2 (Syahrial/Robi) | Daftar profil keluarga & seleksi pemantauan |
| `/family/add` | `app/family/add.tsx` | `family/add` | Tambah Anggota | Modul 2 (Syahrial/Robi) | Form input penambahan anggota baru |
| `/family/[id]` | `app/family/[id].tsx` | `family/[id]` | Detail Anggota | Modul 2 (Robi) | Layar rute dinamis profil anggota |
| `/admin/login` | `app/admin/login.tsx` | `admin/login` | Masuk Admin | Modul 1 (Naufal) | Form login khusus administrator |
| `/admin/dashboard` | `app/admin/dashboard.tsx` | `admin/dashboard` | Panel Admin | Modul 1 (Robi) | Dashboard metrik & statistik admin |

---

## 5. Hasil Pengujian yang Sebenarnya

* **Pemeriksaan Kompilasi TypeScript (`npx tsc --noEmit`):**
  - **Hasil:** `Exit code 0` (100% bersih, tanpa error tipe, `strict: true` terpenuhi).
* **Pemeriksaan Bundler & Static Route Generator (`npx expo export -p web`):**
  - **Hasil:** `Exit code 0`.
  - Berhasil membundel seluruh modul dan mengekspor 10 rute statis secara sempurna:
    - `/` (index)
    - `/login`
    - `/dashboard`
    - `/family`
    - `/family/add`
    - `/family/[id]`
    - `/admin/login`
    - `/admin/dashboard`
    - `/_sitemap` & `+not-found`
* **Verifikasi Fungsionalitas Alur Navigasi:**
  - [x] Alur Login Pengguna (`/login` -> `/dashboard`) tetap berjalan normal.
  - [x] Alur Login Admin (`/admin/login` -> `/admin/dashboard`) tetap berjalan normal.
  - [x] Kartu Family Management pada Dashboard berhasil membuka `/family`.
  - [x] Tombol Tambah Anggota membuka `/family/add` dan tombol Batal kembali ke `/family`.
  - [x] Tombol Detail Profil membuka `/family/[id]` dan tombol kembali berfungsi mulus.
  - [x] Anggota baru yang disimpan di form langsung muncul di daftar keluarga tanpa hilang.
  - [x] Tombol Kembali ke Dashboard dari `/family` berhasil kembali ke `/dashboard`.

---

## 6. Masalah Tersisa
* **Nihil.** Seluruh konfigurasi layout dan `<Stack.Screen>` telah terintegrasi sempurna, tidak ada error TypeScript, dan tidak ada konflik antaranggota tim.

---

## 7. Cara Menjalankan Aplikasi
1. Buka terminal di direktori proyek:
   ```bash
   npx expo start
   ```
2. Tekan `w` untuk membuka di web browser atau pindai QR code dengan aplikasi Expo Go di smartphone.
3. Alur demo pengujian:
   - Dari `/login`, klik tombol **Masuk** (User).
   - Pada Dashboard User, klik kartu **Family Management**.
   - Halaman **Keluarga Saya** (`/family`) terbuka menampilkan daftar anggota.
   - Klik **+ Tambah Anggota** -> masuk ke `/family/add`.
   - Isi data -> klik **Simpan Anggota** -> diarahkan kembali ke `/family` dengan data baru tersimpan.
   - Klik **Detail Profil →** pada anggota baru -> terbuka layar dinamis `/family/[id]`.
   - Klik **← Kembali ke Daftar** -> kembali ke `/family`.
   - Klik **← Kembali ke Dashboard** -> kembali ke `/dashboard`.
   - Klik **Keluar** -> kembali ke `/login`.

---

## 8. Latihan Modifikasi untuk Mahasiswa (Persiapan Demo)
Saat demo di hadapan dosen atau asisten lab, mahasiswa dapat mendemonstrasikan penguasaan materi layout dengan modifikasi manual berikut:

1. **Ubah Judul Rute pada `<Stack.Screen>`:**
   - Buka `app/_layout.tsx`.
   - Ubah `title` pada `family/index`:
     ```tsx
     <Stack.Screen
       name="family/index"
       options={{
         title: 'Manajemen Keluarga CareFam',
       }}
     />
     ```
2. **Tambahkan Opsi Tampilan Modal:**
   - Buka `app/_layout.tsx`.
   - Tambahkan properti `presentation: 'modal'` pada layar form tambah anggota:
     ```tsx
     <Stack.Screen
       name="family/add"
       options={{
         title: 'Tambah Anggota',
         presentation: 'modal',
       }}
     />
     ```
3. **Eksplorasi Transisi Animasi Layar:**
   - Buka `app/_layout.tsx`.
   - Tambahkan animasi transisi native:
     ```tsx
     <Stack.Screen
       name="family/[id]"
       options={{
         title: 'Detail Anggota',
         animation: 'slide_from_right',
       }}
     />
     ```
