# Handoff Modul 2 — Syahrial (Family Management: State & Effect)

## 1. Ringkasan Tugas
Pada Modul 2 ini, Syahrial bertanggung jawab atas implementasi antarmuka, pengelolaan `useState`, dan `useEffect` pada fitur **Family Management** sisi User (`/family` dan `/family/add`).

Fitur yang berhasil diimplementasikan:
1. **Daftar Anggota Keluarga (`/family`)**:
   - Menampilkan daftar anggota keluarga dengan nama, tanggal lahir, hubungan keluarga, dan kontak darurat.
   - Menampilkan status profil yang sedang aktif dipantau.
   - Memilih anggota lain untuk dipantau kesehatannya.
   - *Empty state* yang ramah jika daftar anggota kosong.
   - Tombol bantuan simulasi pengujian demo (kosongkan / pulihkan data seketika).
2. **Form Tambah Anggota (`/family/add`)**:
   - Input terkontrol untuk: Nama Lengkap (wajib), Tanggal Lahir (wajib), Hubungan Keluarga (wajib dengan tombol chip cepat), dan Kontak Darurat (opsional).
   - Validasi field wajib dengan pesan peringatan interaktif jika ada yang kosong.
   - Penyimpanan data anggota baru ke dalam *in-memory session store* sehingga data tetap bertahan saat berpindah halaman selama sesi aplikasi berjalan.

---

## 2. File yang Dibuat dan Diubah

| File | Status | Keterangan |
|---|---|---|
| `types/index.ts` | Diubah (*append-only*) | Menambahkan kontrak `FamilyMember` (id, name, birthDate, relationship, emergencyContact?). |
| `data/familyMembers.ts` | Baru | Data dummy awal (`INITIAL_FAMILY_MEMBERS`) dan modul store in-memory (`getStoredFamilyMembers`, `addStoredFamilyMember`, `subscribeFamilyMembers`, `resetStoredFamilyMembers`). |
| `styles/family.styles.ts` | Baru | Kumpulan style untuk kartu anggota, form input, error box, badge, dan empty state berbasis token `constants/theme.ts`. |
| `components/cards/FamilyMemberCard.tsx` | Baru | Komponen kartu presentasi profil anggota keluarga beserta tombol pemilihan profil dipantau. |
| `app/family/index.tsx` | Baru | Layar utama Family Management (`/family`) mengelola state `members`, `selectedMemberId`, dan efek sinkronisasi data. |
| `app/family/add.tsx` | Baru | Layar form tambah anggota keluarga (`/family/add`) dengan input terkontrol dan validasi. |
| `data/userDashboard.ts` | Diubah | Mengaktifkan `status: 'active'` pada kartu Family Management agar dapat diklik dari Dashboard User. |
| `app/dashboard.tsx` | Diubah | Membungkus kartu aktif dengan `Pressable` agar kompatibel menerima klik dari `Link asChild`. |
| `components/cards/FeatureCard.tsx` | Diubah | Menambahkan `React.forwardRef` dan menyalurkan props interaksi agar kompatibel penuh dengan Expo Router `Link asChild`. |
| `docs/handoff/modul2-syahrial.md` | Baru | Dokumentasi handoff pengerjaan Modul 2 oleh Syahrial. |

---

## 3. Cara Kerja State & Effect

### A. State (`useState`)
1. **Di `app/family/index.tsx`**:
   - `members`: Menyimpan daftar array anggota keluarga yang sedang ditampilkan.
   - `selectedMemberId`: Menyimpan ID anggota yang sedang aktif dipantau (default otomatis ke anggota pertama).
2. **Di `app/family/add.tsx`**:
   - `name`, `birthDate`, `relationship`, `emergencyContact`: Menyimpan nilai teks input dari pengguna.
   - `errorMessage`: Menyimpan pesan validasi jika field wajib belum diisi saat simpan ditekan.

### B. Effect (`useEffect`)
1. **Sinkronisasi Store Antar-Layar (`app/family/index.tsx`)**:
   ```typescript
   useEffect(() => {
     const unsubscribe = subscribeFamilyMembers(() => {
       setMembers(getStoredFamilyMembers());
     });
     return () => unsubscribe();
   }, []);
   ```
   *Mengapa dibutuhkan:* Ketika form tambah anggota menyimpan data di `/family/add`, listener ini secara otomatis memicu pembaruan state `members` di halaman daftar tanpa perlu me-reload aplikasi.
2. **Penjaga Konsistensi Profil Terpilih (`app/family/index.tsx`)**:
   ```typescript
   useEffect(() => {
     if (members.length === 0) {
       if (selectedMemberId !== '') setSelectedMemberId('');
     } else {
       const isValid = members.some((m) => m.id === selectedMemberId);
       if (!isValid) setSelectedMemberId(members[0].id);
     }
   }, [members, selectedMemberId]);
   ```
   *Mengapa dibutuhkan:* Mencegah terjadinya profil "hantu" (*dangling/ghost ID*). Jika daftar anggota kosong, profil terpilih direset; jika anggota terpilih tidak lagi ditemukan, sistem otomatis memilih anggota pertama yang tersedia.

---

## 4. Cara Menjalankan Aplikasi
1. Buka terminal di direktori proyek:
   ```bash
   npx expo start
   ```
2. Tekan `w` untuk membuka di browser web atau scan QR code menggunakan aplikasi Expo Go di smartphone.
3. Alur pengujian:
   - Dari halaman Login Pengguna (`/login`), tekan **Masuk**.
   - Pada Dashboard Pengguna (`/dashboard`), klik kartu **Family Management**.
   - Halaman **Keluarga Saya** (`/family`) akan terbuka dan menampilkan 3 anggota keluarga awal.
   - Klik tombol **Pilih untuk Dipantau** pada anggota lain untuk melihat perubahan badge aktif.
   - Klik tombol **+ Tambah Anggota** untuk masuk ke form (`/family/add`).
   - Coba tekan **Simpan Anggota** saat field kosong untuk melihat pesan validasi error.
   - Isi form lengkap, lalu tekan **Simpan Anggota**. Anda akan diarahkan kembali ke daftar dan anggota baru langsung terlihat di layar.
   - Tekan tombol **Simulasi Pengujian: Kosongkan Daftar** di bagian bawah untuk melihat tampilan *Empty State*.

---

## 5. Hasil Pengujian yang Sebenarnya
- **TypeScript Check (`npx tsc --noEmit`)**:
  - Hasil: `Exit code 0` (100% bersih, tidak ada error tipe, tidak ada `any`, `strict: true` terpenuhi).
- **Verifikasi Fungsionalitas**:
  - [x] Daftar anggota keluarga tampil dengan nama, tanggal lahir, hubungan, dan kontak darurat.
  - [x] Memilih profil anggota berhasil mengubah indikator profil terpilih/dipantau.
  - [x] Tombol Tambah Anggota membuka form input.
  - [x] Validasi form berhasil mencegah pengiriman data kosong dan memunculkan pesan error.
  - [x] Anggota baru yang disimpan tetap terlihat setelah kembali ke halaman daftar.
  - [x] Empty state tampil dengan benar jika daftar anggota kosong.

---

## 6. Masalah Tersisa
- Tidak ada masalah tersisa pada bagian state dan effect milik Syahrial.
- Penyesuaian konfigurasi navigasi header (`_layout.tsx` / `<Stack.Screen>`) dan pengujian routing (`router.push` / `router.back` / fungsi Expo Router ketiga) siap dilanjutkan oleh rekan tim (Naufal dan Robi).

---

## 7. Latihan Modifikasi untuk Mahasiswa (Persiapan Demo)
Saat demo di depan dosen/asisten lab, mahasiswa dapat mendemonstrasikan pemahaman kode dengan modifikasi manual berikut:

1. **Ubah Anggota Terpilih Default**:
   - Buka `app/family/index.tsx`, ubah nilai default `selectedMemberId`:
     ```typescript
     // Ganti initial ID ke '2' untuk memilih anggota kedua secara default saat aplikasi dibuka
     const [selectedMemberId, setSelectedMemberId] = useState<string>('2');
     ```
2. **Tambah Pilihan Cepat Hubungan Keluarga di Form**:
   - Buka `app/family/add.tsx`, tambahkan entri pada `RELATIONSHIP_OPTIONS`:
     ```typescript
     const RELATIONSHIP_OPTIONS = [..., 'Sepupu', 'Keponakan'];
     ```
3. **Ubah Logika Auto-Select pada `useEffect`**:
   - Buka `app/family/index.tsx`, ubah target auto-select saat profil tidak valid menjadi anggota terakhir:
     ```typescript
     setSelectedMemberId(members[members.length - 1].id);
     ```
