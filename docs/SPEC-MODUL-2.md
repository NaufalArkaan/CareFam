# CareFam — SPEC Modul 2: Family Management

> **Versi:** 2.0  
> **Scope:** Modul 2 React Native — State, Hooks, Navigasi, dan Layout pada halaman Family Management sisi User.  
> **Status Modul 1:** Selesai. `docs/SPEC.md`, `docs/ANTIGRAVITY.md` (atau nama file dokumentasi Antigravity yang sudah ada), halaman Modul 1, dan konfigurasi yang sudah berjalan adalah hasil Modul 1. Jangan menulis ulang atau menggantinya.  
> **Catatan:** Jika nama/path dokumentasi Antigravity aktual berbeda, periksa repository dan gunakan nama yang benar.

## 1. Tujuan

Melanjutkan aplikasi CareFam yang sudah ada dengan mengimplementasikan halaman **Family Management** untuk pengguna. Jangan membuat repository atau aplikasi baru.

Berdasarkan dokumen konsep CareFam, halaman ini digunakan untuk:
- Menampilkan beberapa anggota keluarga dalam satu akun.
- Menambahkan anggota keluarga.
- Mengisi nama, tanggal lahir, dan hubungan keluarga.
- Memilih profil anggota yang ingin dipantau.
- Menyediakan kontak darurat per anggota jika berbeda.

Implementasi adalah prototype praktikum: gunakan data dummy/state lokal. Jangan menambahkan backend, Supabase, autentikasi baru, atau penyimpanan permanen kecuali memang sudah ada dan secara eksplisit disetujui.

## 2. Kriteria demo wajib

1. Menggunakan `useState` untuk state yang nyata.
2. Menggunakan `useEffect` dengan tujuan yang jelas dan dependency yang benar.
3. Menggunakan `router.push()` pada alur navigasi yang benar-benar berjalan.
4. Menggunakan `router.back()` pada alur navigasi yang benar-benar berjalan.
5. Menggunakan satu fungsi Expo Router lain yang benar-benar dijelaskan dalam materi Modul 2. **Jangan menebak fungsi ketiga.** Baca materi praktikum yang tersedia. Jika tidak tersedia atau fungsi yang diminta belum jelas, laporkan dan tanyakan sebelum implementasi.
6. Mengatur layout/rute menggunakan `_layout.tsx` dan `<Stack.Screen>` sesuai struktur aktual.
7. Aplikasi dapat dijalankan; periksa TypeScript dan uji alur utama.
8. Mahasiswa mampu menjelaskan dan memodifikasi kode saat demo.

## 3. Aturan kesinambungan Modul 1

- Pertahankan aplikasi, repository, dependency, theme, komponen, routing, dan halaman Modul 1 yang sudah berfungsi.
- Jangan membuat ulang `docs/SPEC.md` atau dokumentasi Modul 1.
- Baca dokumentasi Modul 1 untuk memahami keputusan yang sudah dibuat, tetapi jangan mengubahnya tanpa kebutuhan yang jelas dan persetujuan.
- Periksa status Git sebelum bekerja. Jangan menimpa perubahan pengguna atau anggota lain.
- Jangan menjalankan `git commit`, `git push`, merge, atau mengganti branch secara otomatis.
- Jangan menambah library.
- Jangan mengubah halaman Login/Dashboard Admin atau file milik anggota lain di luar pembagian tugas.
- Gunakan TypeScript dan pola kode yang sudah dipakai repository. Jangan memaksakan arsitektur baru.

## 4. Perilaku minimum halaman

Halaman daftar Family Management:
- Judul seperti “Keluarga Saya”.
- Deskripsi singkat untuk mengelola profil anggota keluarga.
- Daftar anggota menampilkan nama, tanggal lahir, hubungan, dan indikator profil terpilih.
- Aksi untuk memilih profil yang dipantau.
- Tombol “Tambah Anggota”.
- Aksi untuk membuka detail anggota bila diperlukan untuk mendemonstrasikan navigasi.
- ScrollView jika konten dapat melebihi tinggi layar.
- Empty state sederhana bila daftar kosong.

Form tambah anggota:
- Nama lengkap.
- Tanggal lahir.
- Hubungan keluarga.
- Kontak darurat opsional.
- Validasi sederhana agar nama dan field wajib tidak kosong.
- Tombol simpan dan kembali/batal.
- Anggota baru harus tetap terlihat setelah kembali ke daftar selama sesi aplikasi. Jangan mengklaim penyimpanan permanen.

Detail anggota, bila diperlukan:
- Menampilkan informasi anggota.
- Tombol kembali menggunakan `router.back()`.

## 5. State, effect, dan alur data

- Gunakan `useState` untuk data anggota, nilai input form, dan profil terpilih.
- `useEffect` hanya digunakan untuk efek yang memang diperlukan. Jangan menambahkan effect kosong atau yang hanya menyalin state tanpa alasan.
- Sebelum coding, periksa struktur aktual dan rencanakan mekanisme paling sederhana agar anggota baru tidak hilang ketika navigasi. Jelaskan jika mekanisme tersebut membutuhkan perubahan layout/shared state atau kontrak antaranggota, lalu tunggu persetujuan.
- Jangan memakai global state library atau storage tambahan.

## 6. Layout dan navigasi

- Gunakan Expo Router sesuai konvensi yang sudah ada.
- Gunakan `router.push()` untuk membuka form atau detail.
- Gunakan `router.back()` untuk kembali.
- Fungsi Router ketiga harus dibuktikan berasal dari materi Modul 2.
- Periksa `_layout.tsx` yang ada sebelum memutuskan apakah perlu membuat layout baru.
- Gunakan `<Stack.Screen>` pada lokasi yang tepat untuk judul/header atau opsi layar.
- Hindari duplikasi konfigurasi Stack dan jangan merusak rute Modul 1.

## 7. Gaya dan kualitas kode

- Gunakan TypeScript strict sesuai konfigurasi proyek.
- Hindari `any`, `@ts-ignore`, `as any`, import tak terpakai, kode mati, dan `console.log` yang tertinggal.
- Ikuti theme dan komponen yang sudah ada.
- Gunakan `StyleSheet.create()` untuk style utama jika konsisten dengan proyek.
- Gunakan identifier berbahasa Inggris dan teks UI Bahasa Indonesia.
- Buat kode sederhana, pendek, dan mudah dijelaskan.
- Jangan menambahkan fitur di luar Family Management.

## 8. Pembagian tugas

### Syahrial
Fokus: `useState` dan `useEffect`, daftar keluarga, form tambah anggota, dan pemilihan profil. Jangan mengubah layout global atau mengerjakan navigasi yang menjadi tanggung jawab Robi kecuali telah disepakati.

### Robi
Fokus: `router.push()`, `router.back()`, dan satu fungsi Expo Router tambahan yang sesuai materi. Jangan membuat ulang state management Syahrial.

### Naufal
Fokus: audit dan konfigurasi `_layout.tsx` serta `<Stack.Screen>` untuk rute Family Management. Pertahankan konfigurasi dan halaman Modul 1 yang sudah selesai.

Koordinasikan nama rute dan kontrak data sebelum mengubah file yang saling berkaitan. Jangan mengedit file yang sedang dimiliki anggota lain tanpa persetujuan.

## 9. Protokol kerja Antigravity

1. Baca dokumen ini, dokumentasi Modul 1 yang sudah ada, dan handoff Modul 2 yang tersedia.
2. Periksa struktur file, dependency, konfigurasi, branch, dan status Git.
3. Jangan menulis kode pada langkah pertama.
4. Laporkan ringkasan scope, file yang akan disentuh, rencana checkpoint, risiko, dan pertanyaan.
5. Tunggu pengguna mengetik `SETUJU`.
6. Kerjakan satu checkpoint saja, lalu berhenti untuk review.
7. Jalankan `npx tsc --noEmit` jika tersedia dan laporkan hasil sebenarnya. Jalankan aplikasi serta uji alur utama jika lingkungan memungkinkan.
8. Jangan menyatakan pengujian berhasil bila belum dijalankan.
9. Jangan melakukan commit/push.
10. Akhiri dengan handoff: file berubah, fitur/rubrik yang terpenuhi, hasil tes, masalah tersisa, cara menjalankan, dan satu modifikasi manual untuk latihan demo.

## 10. Definition of Done

- [ ] Daftar anggota keluarga tampil.
- [ ] Pengguna dapat menambahkan anggota dengan nama, tanggal lahir, dan hubungan.
- [ ] Pengguna dapat memilih profil yang dipantau.
- [ ] Kontak darurat per anggota dapat diisi jika diimplementasikan dalam form.
- [ ] `useState` dipakai untuk state yang nyata.
- [ ] `useEffect` dipakai untuk efek yang relevan.
- [ ] `router.push()` bekerja.
- [ ] `router.back()` bekerja.
- [ ] Fungsi Expo Router ketiga berasal dari materi dan bekerja.
- [ ] `_layout.tsx` dan `<Stack.Screen>` dikonfigurasi sesuai struktur aktual.
- [ ] Anggota baru tidak hilang saat kembali ke daftar.
- [ ] Alur Modul 1 tetap berfungsi.
- [ ] TypeScript dan uji alur utama diperiksa, dengan hasil dilaporkan secara jujur.
- [ ] Mahasiswa dapat menjelaskan dan memodifikasi kode tanpa AI.
