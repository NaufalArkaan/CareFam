# CareFam — Spesifikasi Implementasi Modul 1 (untuk Antigravity)

> **Versi:** 1.1 | **Scope:** Modul 1 saja (Login User, Login Admin, Dashboard User, Dashboard Admin)
> **Turunan dari:** *CareFam System Blueprint v1* + gambar konsep "Konsep utama CareFam" dan "Alur kerja Admin"
> **Fungsi dokumen:** *single source of truth* yang WAJIB dibaca AI (Antigravity) sebelum menulis kode.
> Simpan di repo sebagai `docs/SPEC.md`.
> **Lanjutan:** Modul 2–6 akan punya dokumen spesifikasi sendiri yang melanjutkan dokumen ini. Dokumen ini hanya membahas Modul 1.

---

## 0. Pembagian Tugas Tim

| Anggota | Peran di Modul 1 | Urutan | Branch |
|---|---|---|---|
| **Naufal** (Anggota 1) | Fondasi proyek + Login User + Login Admin | 1 | `feat/foundation-login` |
| **Syahrial** (Anggota 2) | Dashboard User | 2 | `feat/dashboard-user` |
| **Robi** (Anggota 3) | Dashboard Admin + pengecekan integrasi akhir | 3 | `feat/dashboard-admin` |

Setiap anggota bekerja di **laptop dan akun GitHub masing-masing**, bergiliran (hanya satu orang aktif pada satu waktu). Detail alur Git ada di §10.

---

## 1. Ringkasan & Alur Aplikasi

CareFam (*Integrated Family Health Companion*) adalah aplikasi untuk mengelola kesehatan keluarga dalam satu tempat. Aplikasi ini **bukan** pengganti diagnosis atau keputusan tenaga kesehatan.

**Tujuan Modul 1:** prototype UI statis berdata dummy yang rapi dan konsisten, dengan kode yang bisa dijelaskan baris per baris saat demo tanpa bantuan AI.

### Alur User (dari gambar "Konsep utama CareFam")

```
Login User  ->  Dashboard User
                 |- Header CareFam ("Satu aplikasi untuk mengelola kesehatan keluarga")
                 |- Akun dan profil pengguna
                 |- 5 kartu layanan:
                      1. Family Management
                      2. Medical Records
                      3. Hospital Finder
                      4. Emergency SOS
                      5. Health Reminder & Monitoring
```

### Alur Admin (dari gambar "Alur kerja Admin")

```
Login Admin  ->  Dashboard Admin ("Ringkasan dan statistik aplikasi")
                  |- 6 kartu menu:
                       1. User Management
                       2. Hospital Management
                       3. Health Education
                       4. Report Management
                       5. SOS Monitoring
                       6. System Settings
```

> Gambar konsep berlatar hitam hanyalah **diagram alur**, bukan desain UI. Tampilan mengikuti design system di §7 (tema terang dari blueprint).

---

## 2. Keputusan Scope (WAJIB DIPATUHI)

| # | Keputusan | Alasan |
|---|---|---|
| D1 | Modul 1 hanya berisi **4 halaman**: Login User, Login Admin, Dashboard User, Dashboard Admin. | Sesuai arahan tim. |
| D2 | **Login hanya UI.** Tidak ada validasi kredensial, token, database, atau registrasi. | Auth sungguhan masuk modul berikutnya. |
| D3 | **Tidak memakai hooks** (`useState`, `useEffect`, dll.). Semua halaman statis. | Fokus Modul 1: sintaks, function, loop, type, style. |
| D4 | Login User dan Login Admin adalah **dua halaman terpisah** yang memakai satu komponen `LoginForm`. Tombol "Masuk" berupa `<Link>` ke rute hasil `getHomeRoute(role)`. | Sesuai gambar: "Admin Login" adalah langkah tersendiri. |
| D5 | Kartu dashboard **belum menavigasi** ke mana pun. Semua bertanda `status: 'soon'` dan menampilkan badge teks "Segera hadir". Field `route` pada data adalah **rencana** rute modul berikutnya; file rute-nya **tidak dibuat** sekarang. | Halaman fitur baru dibuat di modul lanjutan. |
| D6 | Ikon memakai **emoji** + label teks. Tidak ada library ikon. | Kesederhanaan, tanpa dependensi baru. |
| D7 | **Tanpa library baru** dan tanpa Supabase. Folder `services/` dibiarkan kosong. | Blueprint §12 dan §10. |
| D8 | Data dummy netral. Tidak ada data medis nyata, dosis, atau saran medis. | Aplikasi bukan alat diagnosis. |
| D9 | Folder `utils/` ditambahkan (belum ada di blueprint) untuk custom function. | Memisahkan logika dari UI agar mudah dijelaskan. |
| D10 | **Perubahan dari blueprint:** halaman MotherCare/ElderGuard **tidak lagi** menjadi isi Modul 1. Dashboard user kini memuat 5 layanan sesuai gambar konsep. | Konsep terbaru tim. |
| D11 | Jika `typedRoutes` aktif di `app.json` dan membuat `href` bertipe `string` error, **minta persetujuan** untuk menonaktifkannya (`experiments.typedRoutes: false`). | Template Expo bisa mengaktifkannya; rute rencana (D5) belum ada. |

> Jika AI merasa perlu melanggar keputusan di atas, **berhenti dan tanyakan dulu**.

---

## 3. Tech Stack

| Teknologi | Status |
|---|---|
| React Native + Expo | Ya |
| TypeScript (`strict: true`) | Ya |
| Expo Router | Ya (layout + `Link` saja) |
| Supabase | Target arsitektur, belum diimplementasikan |

---

## 4. Pemetaan Rubrik Modul 1 → Kode

Tiga rubrik wajib terlihat jelas. Tandai baris kuncinya dengan komentar `// RUBRIK: ...`.

| Rubrik | Wujud di kode | Aturan |
|---|---|---|
| **Custom Function & Loop** | Function bertujuan nyata di `utils/` + `map()` untuk render + `for...of` di dalam minimal satu function | Function harus benar-benar dipakai. Tipe parameter dan return eksplisit. |
| **Type & Array of Objects** | `interface`/`type` di `types/`, data list berupa array objek bertipe di `data/` | Dilarang `any`. |
| **Inline & External Styles** | Gaya utama di `StyleSheet.create()` pada `styles/*.styles.ts`; inline style untuk nilai dinamis | **Minimal 1 inline style per halaman**, diberi komentar alasan. |

### Peta rubrik per bagian

| Bagian | Custom function (+loop) | Array of objects | Inline style (alasan) |
|---|---|---|---|
| Login User & Admin (Naufal) | `getHomeRoute`, `getRoleLabel`, `getLoginContent` (for...of), `getAccountsByRole` (for...of) | `LOGIN_CONTENT`, `DEMO_ACCOUNTS` | Warna tombol "Masuk" dari `content.accentColor` |
| Dashboard User (Syahrial) | `getGreeting`, `countByStatus` (for...of), `getSummaryText`, `isFullWidthCard` | `USER_FEATURES`, `PROFILE_INFO` | Lebar pembungkus kartu (`'100%'` atau `'48%'`) dari hasil `isFullWidthCard` |
| Dashboard Admin (Robi) | `formatStatValue` (+ reuse `countByStatus`, `getSummaryText`, `isFullWidthCard`) | `ADMIN_STATS`, `ADMIN_MENUS` | Warna aksen `StatCard` dari `stat.color` |

---

## 5. Peta Route & Kepemilikan File

`[P1]` = Naufal, `[P2]` = Syahrial, `[P3]` = Robi.

```
CareFam/
├── app/
│   ├── _layout.tsx                 [P1]  Stack, headerShown: false
│   ├── index.tsx                   [P1]  Redirect ke /login
│   ├── login.tsx                   [P1]  Login User   -> <LoginForm role="user" />
│   ├── dashboard.tsx               [P2]  Dashboard User   (stub dari P1 sampai ditimpa)
│   └── admin/
│       ├── login.tsx               [P1]  Login Admin  -> <LoginForm role="admin" />
│       └── dashboard.tsx           [P3]  Dashboard Admin  (stub dari P1 sampai ditimpa)
├── components/
│   ├── common/
│   │   ├── Header.tsx              [P1]  shared
│   │   ├── PrimaryButton.tsx       [P1]  shared (berbasis Pressable, meneruskan props sisa)
│   │   ├── LoginForm.tsx           [P1]  shared oleh 2 halaman login
│   │   └── PlaceholderScreen.tsx   [P1]  sementara
│   └── cards/
│       ├── FeatureCard.tsx         [P1]  shared oleh 2 dashboard
│       ├── InfoCard.tsx            [P1]  shared
│       └── StatCard.tsx            [P3]
├── data/
│   ├── accounts.ts                 [P1]  DEMO_ACCOUNTS
│   ├── loginContent.ts             [P1]  LOGIN_CONTENT
│   ├── userDashboard.ts            [P2]  USER_FEATURES, PROFILE_INFO
│   └── adminDashboard.ts           [P3]  ADMIN_STATS, ADMIN_MENUS
├── types/
│   └── index.ts                    [P1]  kontrak tipe (append-only setelah P1)
├── utils/
│   ├── roleRoute.ts                [P1]  getHomeRoute, getRoleLabel
│   ├── login.ts                    [P1]  getLoginContent, getAccountsByRole
│   ├── features.ts                 [P2]  countByStatus, getSummaryText, isFullWidthCard
│   ├── userDashboard.ts            [P2]  getGreeting
│   └── adminDashboard.ts           [P3]  formatStatValue
├── styles/
│   ├── login.styles.ts             [P1]
│   ├── userDashboard.styles.ts     [P2]
│   └── adminDashboard.styles.ts    [P3]
├── constants/
│   └── theme.ts                    [P1]
├── services/.gitkeep               [P1]  disiapkan untuk Supabase
├── docs/
│   ├── SPEC.md
│   └── handoff/                    01-naufal.md, 02-syahrial.md, 03-robi.md
└── assets/
```

**Aturan kepemilikan:**
1. Edit hanya file milikmu. File shared milik P1 hanya boleh diubah dengan **menambah prop opsional** yang tidak mengubah perilaku lama, dan harus dicatat di handoff.
2. `types/index.ts` **append-only** setelah P1 selesai: boleh menambah tipe di bawah, dilarang mengubah atau menghapus yang ada.
3. P1 membuat **stub** (`PlaceholderScreen`) untuk `app/dashboard.tsx` dan `app/admin/dashboard.tsx` agar tombol "Masuk" bisa diuji sejak awal. Pemilik halaman cukup menimpa isi file stub-nya.
4. Bila menemukan masalah di file milik orang lain, **laporkan** (catat di handoff atau beri tahu pemiliknya), jangan memperbaiki diam-diam.

---

## 6. Kontrak Tipe & Data

### `types/index.ts` (dibuat P1)

```ts
// ===== Role & Akun =====
export type UserRole = 'user' | 'admin';

export interface DemoAccount {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// ===== Konten Halaman Login =====
export interface LoginContent {
  id: number;
  role: UserRole;
  title: string;
  subtitle: string;
  buttonLabel: string;
  accentColor: string;   // hex, dipakai sebagai inline style tombol
  altLabel: string;      // teks tautan ke login role lain
  altRoute: string;      // path tautan tersebut
}

// ===== Kartu Layanan / Menu =====
export type FeatureStatus = 'active' | 'soon';

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;          // emoji
  route: string;         // RENCANA rute modul berikutnya (belum dibuat)
  status: FeatureStatus; // Modul 1: semua 'soon'
}

// ===== Info & Statistik =====
export interface InfoItem {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface AdminStat {
  id: number;
  label: string;
  value: number;
  icon: string;
  color: string;         // hex aksen, dipakai sebagai inline style
}
```

### Data acuan

```ts
// data/accounts.ts [P1]
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: 1, name: 'Keluarga Demo',  email: 'user@carefam.test',  role: 'user'  },
  { id: 2, name: 'Admin CareFam',  email: 'admin@carefam.test', role: 'admin' },
];

// data/loginContent.ts [P1]
export const LOGIN_CONTENT: LoginContent[] = [
  { id: 1, role: 'user',  title: 'Masuk ke CareFam',
    subtitle: 'Kelola kesehatan seluruh keluarga dalam satu aplikasi',
    buttonLabel: 'Masuk', accentColor: '#2F6F73',
    altLabel: 'Masuk sebagai admin', altRoute: '/admin/login' },
  { id: 2, role: 'admin', title: 'Admin Login',
    subtitle: 'Masuk menggunakan akun admin',
    buttonLabel: 'Masuk sebagai Admin', accentColor: '#263238',
    altLabel: 'Kembali ke login pengguna', altRoute: '/login' },
];
```

```ts
// data/userDashboard.ts [P2]   USER_FEATURES (semua status 'soon')
// 1 Family Management            | Kelola profil keluarga                                      | 👨‍👩‍👧 | /family
// 2 Medical Records              | Riwayat diagnosis dan dokumen                               | 📋 | /medical-records
// 3 Hospital Finder              | Pencarian rumah sakit                                       | 🏥 | /hospital-finder
// 4 Emergency SOS                | Bantuan darurat                                             | 🚨 | /emergency-sos
// 5 Health Reminder & Monitoring | Pengingat dan pencatatan kesehatan seluruh anggota keluarga | ⏰ | /health-reminder
//
// PROFILE_INFO: InfoItem[]  -> Email (user@carefam.test), Anggota keluarga (3 orang), Status akun (Aktif)
```

```ts
// data/adminDashboard.ts [P3]
// ADMIN_STATS: Total Pengguna 128 (👥) | Anggota Keluarga 342 (👨‍👩‍👧) | Fasilitas Kesehatan 24 (🏥) | Laporan Masuk 5 (📝)
//   color: berturut-turut '#2F6F73', '#A8C3B0', '#E89B8A', '#263238'
//
// ADMIN_MENUS (semua status 'soon'):
// 1 User Management      | Kelola akun pengguna dan status akun                       | 👥 | /admin/users
// 2 Hospital Management  | Tambah, ubah, dan nonaktifkan data rumah sakit atau klinik | 🏥 | /admin/hospitals
// 3 Health Education     | Kelola artikel dan informasi edukasi kesehatan             | 📖 | /admin/education
// 4 Report Management    | Tangani laporan data, penyalahgunaan, dan keluhan          | 📝 | /admin/reports
// 5 SOS Monitoring       | Pantau status teknis pengiriman SOS                        | 📡 | /admin/sos
// 6 System Settings      | Atur konfigurasi aplikasi dan hak akses admin              | ⚙️ | /admin/settings
```

---

## 7. Design System

Sumber: Blueprint §9. Dibuat P1 di `constants/theme.ts`. Semua halaman wajib mengimpor token dari sana; dilarang hardcode hex di luar data yang memang membawa warna (`accentColor`, `color`).

| Token | Nilai | Peran |
|---|---|---|
| `primary` | `#2F6F73` | Header user, tombol utama, aksen |
| `secondary` | `#A8C3B0` | Elemen pendukung |
| `background` | `#F8F7F3` | Latar layar |
| `accent` | `#E89B8A` | Highlight / peringatan ringan |
| `text` | `#263238` | Teks utama; juga warna header tema admin |
| `surface` *(turunan)* | `#FFFFFF` | Latar kartu |
| `muted` *(turunan)* | `#5F6B70` | Teks sekunder |
| `border` *(turunan)* | `#E3E1DA` | Garis tipis kartu |

**Prinsip UI:**
- Teks isi ≥ 16 px; judul ≥ 20 px; deskripsi/caption di dalam kartu grid ≥ 14 px.
- Touch target ≥ 48 px. Input dan tombol diberi `accessibilityLabel`.
- Emoji selalu disertai label teks. Warna bukan satu-satunya penanda (badge "Segera hadir" berupa teks).
- Kartu putih, sudut membulat (radius 16), bayangan halus, padding ≥ 16, jarak antar-kartu ≥ 12.
- **Pembeda role:** header Dashboard User berwarna `primary`; header Admin (Login dan Dashboard) berwarna `text` (gelap), sehingga role langsung terlihat berbeda.

---

## 8. Spesifikasi Halaman

### 8.1 Login User — `app/login.tsx` — Naufal
### 8.2 Login Admin — `app/admin/login.tsx` — Naufal

Kedua file hanya merender `<LoginForm role="user" />` / `<LoginForm role="admin" />`. Semua isi ada di `components/common/LoginForm.tsx` dan `styles/login.styles.ts`.

**Isi `LoginForm` (atas → bawah):**
1. Teks logo "CareFam" (warna sesuai role) dan `content.title` + `content.subtitle` (dari `getLoginContent(role)`).
2. Field **Email** (`keyboardType="email-address"`, `autoCapitalize="none"`) dan **Kata sandi** (`secureTextEntry`). `TextInput` biasa, **tanpa state**, hanya tampilan.
3. Tombol `content.buttonLabel`: `<Link href={getHomeRoute(role)} asChild>` membungkus `PrimaryButton`. Warna latar tombol = `content.accentColor` (**inline style**).
4. Tautan teks `content.altLabel` menuju `content.altRoute`.
5. Kartu **"Akun demo"**: `getAccountsByRole(role)` di-`map()` menjadi nama, email, dan `getRoleLabel(role)`.
6. Catatan kecil: *"Prototype — belum terhubung ke server."*

**Custom function:**
```ts
// utils/roleRoute.ts
getHomeRoute(role: UserRole): string        // 'user' -> '/dashboard', 'admin' -> '/admin/dashboard'
getRoleLabel(role: UserRole): string        // 'user' -> 'Pengguna', 'admin' -> 'Admin'
// utils/login.ts
getLoginContent(role: UserRole): LoginContent        // loop for...of pada LOGIN_CONTENT
getAccountsByRole(role: UserRole): DemoAccount[]     // loop for...of pada DEMO_ACCOUNTS
```
**Dilarang:** hooks, validasi, penyimpanan sandi, library form, tombol/tautan "Daftar".

**Acceptance:** `/login` dan `/admin/login` tampil berbeda (judul, warna tombol, header); "Masuk" di user → `/dashboard`, di admin → `/admin/dashboard`; tautan silang antar-login berfungsi; akun demo tampil sesuai role; `tsc` bersih.

---

### 8.3 Dashboard User — `app/dashboard.tsx` — Syahrial

**Isi (atas → bawah):**
1. `Header` berwarna `primary`: judul "CareFam", subjudul *"Satu aplikasi untuk mengelola kesehatan keluarga"*, dan sapaan `getGreeting(nama)` (contoh *"Halo, Keluarga Demo 👋"*). Nama diambil dari `getAccountsByRole('user')[0]`.
2. Kartu **"Akun dan profil pengguna"** berisi `PROFILE_INFO` yang di-`map()` menjadi `InfoCard`.
3. Seksi **"Layanan Keluarga"** dengan ringkasan `getSummaryText(USER_FEATURES, 'layanan')`.
4. Grid 5 `FeatureCard` dari `USER_FEATURES` via `map()`. Tata letak dua kolom; kartu ke-5 selebar penuh. Pembungkus tiap kartu memakai **inline style** `{ width: isFullWidthCard(i, total) ? '100%' : '48%' }`.
   - `status: 'soon'`: kartu tidak bisa ditekan, menampilkan badge teks "Segera hadir".
   - `status: 'active'`: dibungkus `<Link href={item.route}>` (jalur ini disiapkan untuk modul berikutnya, belum terpakai).
5. Disclaimer kecil: *"CareFam adalah pendamping informasi dan bukan pengganti saran tenaga kesehatan."*
6. Tautan **"Keluar"** → `/login`.

**Custom function:**
```ts
// utils/features.ts
countByStatus(items: FeatureItem[]): { active: number; soon: number }   // WAJIB for...of
getSummaryText(items: FeatureItem[], unit: string): string
   // contoh: "5 layanan • akan dibuka bertahap"; jika ada yang active: "5 layanan • 2 siap dipakai"
isFullWidthCard(index: number, total: number): boolean
   // true hanya jika total ganjil DAN index adalah item terakhir
// utils/userDashboard.ts
getGreeting(name: string): string
```

**Acceptance:** 5 kartu sesuai urutan gambar konsep, kartu terakhir selebar penuh; tidak ada navigasi dari kartu; "Keluar" kembali ke `/login`; `tsc` bersih.

---

### 8.4 Dashboard Admin — `app/admin/dashboard.tsx` — Robi

**Isi (atas → bawah):**
1. `Header` berwarna `text` (gelap): judul "Panel Admin CareFam", subjudul *"Ringkasan dan statistik aplikasi"*.
2. Seksi **"Ringkasan"**: 4 `StatCard` dari `ADMIN_STATS` via `map()` dalam grid 2 kolom. Nilai ditampilkan lewat `formatStatValue(value)`. Warna aksen `StatCard` dari `stat.color` (**inline style**).
3. Seksi **"Menu Pengelolaan"** dengan ringkasan `getSummaryText(ADMIN_MENUS, 'menu')`.
4. Grid 6 `FeatureCard` dari `ADMIN_MENUS` via `map()`, dua kolom, semua `soon` (tanpa navigasi, ada badge "Segera hadir"). Gunakan `isFullWidthCard` untuk lebar pembungkus agar konsisten dengan Dashboard User.
5. Tautan **"Keluar"** → `/admin/login`.

**Custom function:**
```ts
// utils/adminDashboard.ts
formatStatValue(value: number): string   // 1200 -> "1.200" (pemisah ribuan; tidak boleh crash di perangkat mana pun)
// reuse dari utils/features.ts: countByStatus, getSummaryText, isFullWidthCard
```

**Acceptance:** 4 statistik dan 6 menu sesuai gambar "Alur kerja Admin"; tampilan jelas berbeda dari Dashboard User; "Keluar" menuju `/admin/login`; `tsc` bersih.

---

## 9. Konvensi Kode

1. Identifier dan nama file dalam Inggris; teks UI dalam Bahasa Indonesia; komentar boleh Indonesia.
2. Komponen `PascalCase.tsx`; util/data `camelCase.ts`; konstanta `UPPER_SNAKE_CASE`; file style `nama.styles.ts`.
3. Function component dengan `interface XxxProps`. Tanpa class component.
4. Gaya di `styles/` memakai `StyleSheet.create()` + token `constants/theme.ts`. *Pengecualian:* komponen shared milik P1 boleh menaruh `StyleSheet.create()` di file komponennya.
5. Satu file satu tanggung jawab; function pendek (≤ 20 baris); tanpa abstraksi berlebih.
6. Komentar `// RUBRIK: ...` pada baris kunci (function, map, type, inline style).
7. Dilarang: `any`, `@ts-ignore`, `console.log` tertinggal, kode mati, import tak terpakai.

---

## 10. Workflow Git (3 Laptop, 3 Akun, Bergiliran)

### 10.1 Persiapan (sekali)

| Siapa | Langkah |
|---|---|
| Semua | Pasang Git, Node.js LTS, Antigravity, dan Expo Go di HP. Atur identitas Git: `git config --global user.name "Nama"` dan `git config --global user.email "email-akun-GitHub-kamu"`. **Email wajib sama dengan email akun GitHub masing-masing** agar kontribusi terhitung. |
| Naufal | Buat repo GitHub `CareFam` (kosong, tanpa README). Tambahkan Syahrial dan Robi lewat *Settings → Collaborators → Add people* (**izin Write**). |
| Syahrial & Robi | Terima undangan collaborator (cek email atau notifikasi GitHub). Tanpa ini `git push` akan ditolak. |

### 10.2 Tahap 0 — Inisialisasi (Naufal, sekali)

```bash
npx create-expo-app@latest CareFam
cd CareFam
git init                       # lewati bila folder .git sudah ada
git remote add origin <url-repo>
git branch -M main
git add . && git commit -m "chore: init expo project"
git push -u origin main
# salin SPEC.md ke docs/SPEC.md
git add docs/SPEC.md && git commit -m "docs: add module 1 spec" && git push
```

### 10.3 Estafet

| # | Siapa | Awal sesi | Prompt | Akhir sesi |
|---|---|---|---|---|
| 1 | **Naufal** | `git checkout -b feat/foundation-login` | Prompt 1 | push, PR, merge, beri tahu Syahrial |
| 2 | **Syahrial** | `git clone <url>` → `cd CareFam` → `npm install` → `git checkout -b feat/dashboard-user` | Prompt 2 | push, PR, merge, beri tahu Robi |
| 3 | **Robi** | `git clone <url>` → `cd CareFam` → `npm install` → `git checkout -b feat/dashboard-admin` | Prompt 3 | push, PR, merge |

Jika repo sudah pernah di-clone, cukup `git checkout main && git pull` sebelum membuat branch.

**Akhir sesi tiap anggota:**
```bash
npx tsc --noEmit                       # harus bersih
npx expo start                         # pastikan berjalan
git push -u origin <nama-branch>
# di GitHub: Open Pull Request -> merge dengan "Create a merge commit"
# (JANGAN squash agar semua commit kecil tetap tercatat sebagai kontribusi)
```

### 10.4 Aturan commit

- Format: `tipe(scope): deskripsi`, contoh `feat(login): add LoginForm shared component`. Tipe: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.
- **Commit kecil dan bermakna**, target 5–10 commit per anggota (satu commit per checkpoint), bukan satu commit raksasa.
- Kontribusi muncul di grafik profil GitHub setelah commit berada di branch `main` dan email commit terhubung ke akun. Cek lewat *Insights → Contributors*.
- Jangan `git push --force`. Jangan commit `node_modules`, `.env`, `.expo`.
- Bila terjadi konflik (jarang, karena file dipisah): hentikan, jangan asal pilih; selesaikan bersama pemilik file.

---

## 11. Aturan untuk AI (Vibe Coding Rules)

1. **Baca dulu** `docs/SPEC.md` dan semua `docs/handoff/*` sebelum mengubah apa pun.
2. **Rencana dulu, kode kemudian.** Tampilkan rencana singkat per checkpoint dan **tunggu persetujuan** ("SETUJU") sebelum menulis kode.
3. **Sentuh hanya file milik anggota yang sedang bekerja** (§5).
4. Kerjakan bertahap dan berhenti di setiap checkpoint untuk ditinjau.
5. **Jangan menambah library**, folder, atau pola arsitektur baru tanpa persetujuan.
6. **Patuhi D1–D11**, terutama tanpa hooks, tanpa validasi login, tanpa halaman di luar 4 halaman.
7. **Jelaskan, jangan hanya menulis.** Setelah selesai, ringkas di mana rubrik diterapkan (file + nama function/variabel) dan satu cara memodifikasinya secara manual.
8. Bila spesifikasi ambigu atau bertentangan, ajukan pertanyaan singkat; jangan menebak.
9. Jalankan `npx tsc --noEmit` dan laporkan hasilnya jujur, termasuk hal yang belum bisa diuji.

---

## 12. Definition of Done

### Per halaman
- [ ] Tampil benar di Expo Go atau emulator, tanpa error atau warning kritis.
- [ ] Memenuhi ketiga rubrik sesuai peta §4.
- [ ] Data dari array bertipe; tidak ada `any`.
- [ ] Memakai token `constants/theme.ts`; touch target ≥ 48 px; ukuran teks sesuai §7.
- [ ] Ada komentar `// RUBRIK:` pada baris kunci.
- [ ] `npx tsc --noEmit` bersih.
- [ ] Pemilik halaman dapat menjelaskan setiap function dan mengubah satu hal (teks, warna, atau data) **tanpa AI**.

### Proyek (akhir Modul 1)
- [ ] Alur `/login → /dashboard → Keluar → /login` berjalan.
- [ ] Alur `/admin/login → /admin/dashboard → Keluar → /admin/login` berjalan.
- [ ] Tautan silang antar-login berfungsi.
- [ ] Tidak ada `PlaceholderScreen` tersisa pada rute mana pun.
- [ ] Ketiga anggota punya commit bermakna di riwayat `main`.
- [ ] Code walkthrough silang sudah dilakukan.

### Template handoff (`docs/handoff/<nomor>-<nama>.md`)
```md
# Handoff — <Nama> (<bagian>)
## Yang selesai
- ...
## Peta rubrik (file -> function/variabel)
- Custom function & loop: ...
- Type & array of objects: ...
- Inline & external style: ...
## Cara modifikasi cepat (untuk demo)
- Ubah teks ...: file ..., baris ...
- Ubah warna ...: ...
## Perubahan pada file shared (jika ada)
- ...
## Masalah yang ditemukan di file milik orang lain (jika ada)
- ...
## Catatan untuk anggota berikutnya
- ...
```

### Jejak untuk Modul Berikutnya (sudah disiapkan, jangan dikerjakan sekarang)
- `FeatureItem.status` dan `FeatureItem.route`: modul lanjutan cukup mengubah status menjadi `'active'` dan membuat file rute yang direncanakan.
- `services/`: tempat integrasi Supabase.
- `types/index.ts`: bersifat append-only, tinggal ditambah tipe baru.
- Login: nanti dapat diberi state dan validasi tanpa mengubah struktur halaman.
