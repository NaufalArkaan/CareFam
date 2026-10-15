# Handoff Modul 2 — Robi (Family Management: Navigasi Expo Router)

## 1. Ringkasan Tugas
Pada Modul 2 ini, Robi bertanggung jawab penuh atas implementasi navigasi imperatif menggunakan **Expo Router** pada fitur **Family Management** sisi User:
1. **`router.push()`**: Menambahkan alur navigasi dari daftar keluarga (`/family`) menuju form tambah anggota (`/family/add`) dan ke layar detail anggota dinamis (`/family/[id]`).
2. **`router.back()`**: Menambahkan aksi kembali pada layar tujuan (`/family/[id]` dan `/family/add`) dengan proteksi *fallback* menggunakan `router.canGoBack()`.
3. **Fungsi Expo Router Ketiga (`router.replace()`)**: Mengimplementasikan dan membuktikan penggunaan `router.replace()` setelah submit form penambahan anggota dan pada layar rute error, serta menjelaskan perbedaannya dengan `push()` dan `back()`.
4. **Integritas State & Modul 1**: Memastikan navigasi tidak menghilangkan data anggota baru (tetap sinkron dengan state Syahrial) dan seluruh rute Modul 1 tetap berjalan normal.

---

## 2. File yang Dibuat dan Diubah

| File | Status | Keterangan |
|---|---|---|
| `app/family/index.tsx` | Diubah | Mengimpor `useRouter`, menerapkan `router.push('/family/add')` pada tombol tambah anggota, dan `router.push('/family/[id]')` pada kartu profil anggota. |
| `components/cards/FamilyMemberCard.tsx` | Diubah | Menambahkan prop interaksi `onViewDetail?: (id: string) => void` dan tombol `Detail Profil →` pada footer kartu. |
| `styles/family.styles.ts` | Diubah | Menambahkan style `detailButton` dan `detailButtonText`, serta menyelaraskan `cardFooter` dengan `justifyContent: 'space-between'`. |
| `app/family/[id].tsx` | Diubah | Menerapkan `router.back()` dengan fallback `router.canGoBack()` pada tombol kembali, serta tombol `router.replace('/family')` pada kondisi anggota tidak ditemukan. |
| `app/family/add.tsx` | Diubah | Memperkuat fungsi `handleCancel` dengan `router.back()` ber-fallback, serta mendokumentasikan pemakaian `router.replace('/family')` pada `handleSubmit`. |
| `docs/handoff/modul2-robi.md` | Baru | Dokumentasi handoff pengerjaan tugas Modul 2 oleh Robi. |

---

## 3. Peta Rubrik & Lokasi Pemakaian Router

### A. `router.push(href)`
* **Lokasi 1 (Buka Form Tambah Anggota):**
  * File: `app/family/index.tsx` (baris 58 pada `handleAddMember`)
  * Target Rute: `/family/add`
  * Tujuan: Menumpuk (*push*) layar form input ke atas navigation stack saat tombol `+ Tambah Anggota` ditekan.
* **Lokasi 2 (Buka Detail Anggota Dinamis):**
  * File: `app/family/index.tsx` (baris 62 pada `handleViewDetail`)
  * Target Rute: `/family/${id}` (misal: `/family/1`)
  * Tujuan: Menumpuk layar detail profil anggota tertentu berdasarkan parameter ID yang dipilih.

### B. `router.back()`
* **Lokasi 1 (Kembali dari Layar Detail):**
  * File: `app/family/[id].tsx` (baris 18 pada `handleBack`)
  * Tujuan: Mencopot (*pop*) layar detail dari stack dan mengembalikan pengguna ke posisi semula di daftar keluarga.
* **Lokasi 2 (Batal dari Layar Form Tambah):**
  * File: `app/family/add.tsx` (baris 70 pada `handleCancel`)
  * Tujuan: Membatalkan pengisian form dan kembali ke daftar keluarga.
* **Mekanisme Fallback Guard (`router.canGoBack()`):**
  * Jika halaman detail dibuka secara langsung (misal melalui deep link atau refresh browser tanpa riwayat stack), `router.canGoBack()` bernilai `false`, dan sistem otomatis mengeksekusi fallback aman `router.replace('/family')`.

### C. Fungsi Ketiga: `router.replace(href)`
* **Lokasi 1 (Setelah Sukses Simpan Anggota Baru):**
  * File: `app/family/add.tsx` (baris 66 pada `handleSubmit`)
  * Target Rute: `/family`
  * Tujuan: Menukar layar form yang sedang aktif dengan halaman daftar keluarga. Hal ini penting agar layar form dihapus dari riwayat tumpukan dan pengguna tidak bisa menekan tombol kembali (*back*) ke form yang sudah pernah dikirim.
* **Lokasi 2 (Pengalihan Anggota Tidak Ditemukan):**
  * File: `app/family/[id].tsx` (baris 59 pada tombol *Kembali ke Daftar Keluarga*)
  * Tujuan: Menggantikan layar error dengan layar daftar keluarga yang valid.

---

## 4. Perbandingan Fungsi Router (Panduan Teori Demo)

| Fitur | `router.push(href)` | `router.back()` | `router.replace(href)` |
|---|---|---|---|
| **Perubahan Navigation Stack** | Bertambah (+1 layar baru) | Berkurang (-1 layar atas) | Tetap (Layar saat ini digantikan) |
| **Riwayat Layar Sebelumnya** | Tetap disimpan di memori | Dituju kembali | Dibuang dari riwayat |
| **Bisa Kembali ke Layar Asal?** | **Bisa** (via tombol back) | Tidak relevan | **Tidak bisa** |
| **Kapan Digunakan?** | Navigasi umum maju (buka detail/form baru) | Mundur/batal dari layar saat ini | Selesai submit form, Login, Logout |

---

## 5. Hasil Pengujian yang Sebenarnya

* **Pengecekan TypeScript (`npx tsc --noEmit`):**
  * **Hasil:** `Exit code 0` (100% bersih, tanpa error tipe, `strict: true` terpenuhi).
* **Verifikasi Fungsionalitas Alur Navigasi:**
  * [x] **Daftar -> Form via `router.push()`:** Tombol `+ Tambah Anggota` berhasil membuka form `/family/add`.
  * [x] **Daftar -> Detail via `router.push()`:** Tombol `Detail Profil →` berhasil membuka layar `/family/[id]` dengan ID anggota yang sesuai.
  * [x] **Detail -> Kembali via `router.back()`:** Tombol `← Kembali ke Daftar` berhasil kembali ke `/family` di posisi semula.
  * [x] **Form Batal -> Kembali via `router.back()`:** Tombol `Batal` berhasil kembali ke `/family`.
  * [x] **Form Simpan -> Daftar via `router.replace()`:** Setelah data anggota baru diinput dan disimpan, rute otomatis berpindah ke `/family` dan layar form tidak bisa diakses kembali melalui tombol back.
  * [x] **Integritas State Syahrial:** Anggota keluarga baru yang ditambahkan tetap ada di daftar dan dapat dibuka detailnya tanpa hilang selama sesi aplikasi.
  * [x] **Rute Modul 1 Tetap Berfungsi:**
    * `/login` -> `/dashboard` (Login User berhasil).
    * `/dashboard` -> `/family` (Membuka Family Management dari kartu dashboard).
    * `/family` -> `/dashboard` (Tombol `← Kembali ke Dashboard` berhasil).
    * `/login` -> `/admin/login` -> `/admin/dashboard` (Alur Admin tetap normal).

---

## 6. Masalah Tersisa
* **Nihil.** Tidak ada error TypeScript, tidak ada bug navigasi, dan seluruh kriteria evaluasi Modul 2 untuk bagian Robi telah terpenuhi secara paripurna.

---

## 7. Cara Menjalankan Aplikasi
1. Buka terminal di direktori proyek:
   ```bash
   npx expo start
   ```
2. Tekan `w` untuk membuka di browser web atau scan QR code menggunakan aplikasi Expo Go.
3. Jalankan alur demo:
   * Masuk dari `/login` -> klik **Masuk** (User).
   * Pada Dashboard, klik kartu **Family Management** -> terbuka `/family`.
   * Klik tombol **Detail Profil →** pada salah satu anggota -> terbuka `/family/[id]`.
   * Klik **← Kembali ke Daftar** -> kembali ke `/family`.
   * Klik **+ Tambah Anggota** -> terbuka `/family/add`.
   * Isi nama, tanggal lahir, dan hubungan -> klik **Simpan Anggota** -> kembali ke `/family`.
   * Anggota baru langsung muncul dan dapat diklik **Detail Profil →**-nya.
   * Tekan tombol back browser untuk membuktikan bahwa form tidak terbuka lagi karena menggunakan `router.replace()`.

---

## 8. Latihan Modifikasi untuk Mahasiswa (Persiapan Demo)
Saat demo di hadapan dosen/asisten lab, mahasiswa dapat menunjukkan penguasaan kode dengan modifikasi manual berikut:

1. **Ubah Sintaks `router.push` Menjadi Objek:**
   * Buka `app/family/index.tsx`, ubah fungsi `handleViewDetail` (baris 61):
     ```typescript
     const handleViewDetail = (id: string) => {
       router.push({
         pathname: '/family/[id]',
         params: { id },
       });
     };
     ```
2. **Peragakan Mengapa `router.replace` Sangat Penting:**
   * Buka `app/family/add.tsx`, ubah baris 66 sementara dari `router.replace('/family')` menjadi `router.push('/family')`.
   * Tunjukkan bahwa jika menggunakan `push`, saat tombol back ditekan, pengguna akan kembali ke form kosong yang sudah disubmit. Kembalikan ke `replace()` untuk menunjukkan solusi profesionalnya.
3. **Ubah Pesan Tombol Kembali:**
   * Buka `app/family/[id].tsx`, ubah teks tombol kembali dari `"← Kembali ke Daftar"` menjadi `"← Kembali ke Keluarga Saya"`.
