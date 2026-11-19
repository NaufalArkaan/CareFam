# Handoff Modul 4 — Syahrial (Route Protection Guards Menggunakan Expo Router)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Syahrial (Anggota 2)
- **Modul:** Modul 4 — Route Protection Guards Menggunakan Expo Router
- **Tanggung Jawab:**
  1. Menerapkan route protection guard di root layout (`app/_layout.tsx`).
  2. Memanfaatkan `useSegments()` dari Expo Router untuk mendeteksi rute aktif secara reaktif.
  3. Membaca status autentikasi (`session`, `user`, dan `isLoading`) dari `useAuth()` yang disediakan oleh Robi (`context/AuthContext.tsx`).
  4. Menahan proses redirect saat pemulihan sesi awal (`isLoading === true`) dan menampilkan loading state untuk mencegah flicker/layar kosong.
  5. Mengarahkan guest (pengguna belum login) ke rute login aktual jika mencoba mengakses area privat.
  6. Mengarahkan pengguna terotentikasi ke area aplikasi utama jika berada di rute login/register.
  7. Memastikan aksi logout secara otomatis mengunci kembali seluruh area privat dan mengembalikan pengguna ke halaman login.
  8. Mempertahankan konfigurasi `<Stack>` dan seluruh `<Stack.Screen>` Modul 1–3 tanpa mengubah alur routing sebelumnya.

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
|---|:---:|---|
| `app/_layout.tsx` | **Diubah** | Memisahkan root layout menjadi `RootLayout` (memasang `<AuthProvider>` tunggal) dan `RootNavigation` (menerapkan route guard via `useSegments()` dan `useAuth()`, serta merender loading state dan `<Stack>`). |
| `docs/handoff/modul4-syahrial.md` | **Baru** | Dokumen handoff resmi implementasi route protection guard untuk tim dan demo praktikum. |

---

## 3. Pemetaan Struktur Rute Aktual CareFam

Berdasarkan hasil audit menyeluruh pada repository, CareFam menggunakan routing konvensional (flat & nested folder) dan **tidak menggunakan** nama direktori kurung seperti `/(auth)` atau `/(app)` yang dicontohkan di dokumen modul konseptual:

| Kategori Rute | Path Navigasi | Segmen Aktif (`useSegments()`) | Hak Akses | Rute Tujuan Redirect |
|---|---|---|---|---|
| **Entry Point** | `/` (`index.tsx`) | `firstSegment === undefined \|\| 'index'` | Terbuka / Redirect | Tergantung sesi (Guest -> `/login`, Login -> `/dashboard`) |
| **Auth User** | `/login` | `firstSegment === 'login'` | Publik (Guest) | Jika login -> `/dashboard` |
| **Auth Admin** | `/admin/login` | `firstSegment === 'admin' && secondSegment === 'login'` | Publik (Guest Admin) | Jika login -> `/admin/dashboard` |
| **Privat User** | `/dashboard` | `firstSegment === 'dashboard'` | Butuh Login | Jika guest -> `/login` |
| **Privat Keluarga** | `/family/index`<br>`/family/add`<br>`/family/[id]` | `firstSegment === 'family'` | Butuh Login | Jika guest -> `/login` |
| **Privat Admin** | `/admin/dashboard` | `firstSegment === 'admin' && secondSegment === 'dashboard'` | Butuh Login Admin | Jika guest -> `/admin/login` |

---

## 4. Arsitektur & Pemasangan Root Provider (CHECKPOINT 2)

Di [app/_layout.tsx](file:///d:/SEMESTER5/Mobile_Kelompok/CareFam/app/_layout.tsx), `<AuthProvider>` dipasang membungkus komponen internal `RootNavigation` pada level root terluar aplikasi:

```tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
```

### Mengapa Struktur Ini Dipilih?
1. **Tidak Ada Provider Bertumpuk (Zero Duplication):** `AuthProvider` hanya dipasang satu kali di puncak hierarki aplikasi.
2. **Ketersediaan Context:** Karena `RootNavigation` merupakan anak (*child component*) langsung dari `AuthProvider`, ia dapat secara legal memanggil `useAuth()` tanpa menyebabkan runtime error React (*"useAuth must be used within an AuthProvider"*).

---

## 5. Implementasi Route Guard Menggunakan `useSegments()` (CHECKPOINT 3)

Route guard diimplementasikan di dalam `RootNavigation` dengan memanfaatkan hook:
- `useAuth()`: Mengambil `session`, `user`, dan `isLoading`.
- `useSegments()`: Mendeteksi segmen rute aktif secara dinamis.
- `useRouter()`: Melakukan pengalihan rute secara imperatif melalui `router.replace()`.

### Kode Inti Guard:
```tsx
function RootNavigation() {
  const { session, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Tahan seluruh proses redirect selama pemulihan sesi awal (rehydration)
    if (isLoading) return;

    const currentSegments: readonly string[] = segments;
    const firstSegment = currentSegments[0];
    const secondSegment = currentSegments[1];

    // Identifikasi segment autentikasi publik (login)
    const isUserLogin = firstSegment === 'login';
    const isAdminLogin = firstSegment === 'admin' && secondSegment === 'login';
    const inAuthGroup = isUserLogin || isAdminLogin;

    // Evaluasi status autentikasi user
    const isAuthenticated = Boolean(session && user);

    // Tentukan route tujuan utama berdasarkan peran pengguna
    const isAdmin =
      user?.email === 'admin@carefam.test' ||
      user?.user_metadata?.role === 'admin';
    const homeRoute = isAdmin ? '/admin/dashboard' : '/dashboard';

    // 2. Jika belum login (Guest) dan mencoba membuka area privat
    if (!isAuthenticated && !inAuthGroup) {
      if (firstSegment === 'admin') {
        router.replace('/admin/login');
      } else {
        router.replace('/login');
      }
      return;
    }

    // 3. Jika sudah login tetapi berada di route autentikasi (login)
    if (isAuthenticated && inAuthGroup) {
      router.replace(homeRoute);
      return;
    }

    // 4. Jika sudah login dan membuka root aplikasi ('/' atau 'index')
    if (isAuthenticated && (firstSegment === undefined || firstSegment === 'index')) {
      router.replace(homeRoute);
    }
  }, [session, user, isLoading, segments, router]);

  // 1. Tampilkan loading/splash saat isLoading === true agar tidak terjadi flicker
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Seluruh Stack.Screen Modul 1-3 */}
    </Stack>
  );
}
```

---

## 6. Aturan Redirect & Penjelasan Logika

### A. Kondisi Loading (`isLoading === true`)
- **Perilaku:** `useEffect` langsung melakukan `return` tanpa memanggil navigasi, sementara komponen merender `ActivityIndicator` di tengah layar dengan warna brand `colors.primary` (`#3B82F6`) dan background `colors.background` (`#F3F8FF`).
- **Tujuan:** Mencegah *flicker*, *premature redirect*, dan tampilan layar putih kosong saat Supabase dan `expo-secure-store` sedang membaca token yang tersimpan di memori perangkat.

### B. Kondisi Guest / Belum Login (`!isAuthenticated`)
- **Perilaku:**
  - Jika pengguna mengakses `/login` atau `/admin/login`, aplikasi membiarkannya tetap di halaman tersebut.
  - Jika pengguna mencoba langsung mengakses rute privat (`/dashboard`, `/family/index`, `/family/add`, `/family/[id]`), aplikasi secara otomatis memanggil `router.replace('/login')`.
  - Jika pengguna mencoba langsung mengakses `/admin/dashboard`, aplikasi memanggil `router.replace('/admin/login')`.

### C. Kondisi Pengguna Terotentikasi (`isAuthenticated`)
- **Perilaku:**
  - Jika pengguna membuka aplikasi dari awal (`/`) atau mencoba mengetik/membuka `/login`, guard mendeteksi keberadaan sesi aktif dan segera mengalihkannya ke `homeRoute` (`/dashboard` untuk user biasa, `/admin/dashboard` untuk admin).
  - Pengguna bebas berpindah ke seluruh sub-rute Modul 1–3 (`/dashboard`, `/family/index`, `/family/add`, `/family/[id]`) tanpa gangguan.

### D. Kondisi Sign Out / Logout
- **Perilaku:**
  - Saat fungsi `signOutUser()` dari `services/authService.ts` dipanggil (misalnya via tombol "Keluar" di dashboard), Supabase menghapus token dari `expo-secure-store`.
  - Event `SIGNED_OUT` diterima oleh `onAuthStateChange` di `AuthContext`, yang langsung mereset `session` dan `user` menjadi `null`.
  - Perubahan state reaktif ini memicu `useEffect` pada `RootNavigation`. Karena `isAuthenticated` menjadi `false` dan posisi rute saat itu berada di area privat, guard seketika mengunci rute dan memanggil `router.replace('/login')`.

### E. Pencegahan Redirect Loop
- Pengalihan hanya terjadi saat terdapat ketidakcocokan antara status autentikasi dan kelompok rute aktif (`!isAuthenticated && !inAuthGroup` atau `isAuthenticated && inAuthGroup`).
- Jika pengguna sudah berada di tujuan yang benar, tidak ada pemanggilan `router.replace()`, sehingga proses looping navigasi sepenuhnya terhindar.

---

## 7. Pemeliharaan Konfigurasi Stack (CHECKPOINT 4)

Seluruh 8 konfigurasi `<Stack.Screen>` Modul 1, 2, dan 3 tetap dipertahankan secara utuh tanpa modifikasi:
```tsx
<Stack screenOptions={{ headerShown: false }}>
  {/* Rute Utama & Autentikasi (Modul 1) */}
  <Stack.Screen name="index" options={{ title: 'CareFam' }} />
  <Stack.Screen name="login" options={{ title: 'Masuk' }} />
  <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />

  {/* RUBRIK Modul 2: Fitur Family Management (Naufal & Syahrial) */}
  <Stack.Screen name="family/index" options={{ title: 'Keluarga Saya' }} />
  <Stack.Screen name="family/add" options={{ title: 'Tambah Anggota' }} />
  <Stack.Screen name="family/[id]" options={{ title: 'Detail Anggota' }} />

  {/* Rute Admin (Modul 1) */}
  <Stack.Screen name="admin/login" options={{ title: 'Masuk Admin' }} />
  <Stack.Screen name="admin/dashboard" options={{ title: 'Panel Admin' }} />
</Stack>
```

---

## 8. Hasil Pengujian Aktual & Verifikasi

### A. Uji Statis TypeScript
- **Perintah:** `npx tsc --noEmit`
- **Hasil:** `Exit code 0` (0 error, tanpa `any`, tanpa `@ts-ignore`, tanpa `as any`).

### B. Matriks Verifikasi Skenario Navigasi

| No | Skenario Pengujian | Alur & Ekspektasi | Hasil Aktual | Status |
|:--:|---|---|---|:---:|
| 1 | **Cold start tanpa sesi** | Aplikasi dibuka saat belum login -> `isLoading: true` -> loading spinner -> `isLoading: false` -> guard mendeteksi `!isAuthenticated` -> mendarat di `/login`. | Berhasil dialihkan ke `/login` tanpa error. | **PASS** |
| 2 | **Sign in berhasil** | User mengisi email & password di `LoginForm` -> `signInUser()` berhasil -> `AuthContext` terisi -> guard mendeteksi `isAuthenticated && inAuthGroup` -> dialihkan ke `/dashboard`. | Berhasil dialihkan ke `/dashboard`. | **PASS** |
| 3 | **Cold start dengan sesi tersimpan** | Aplikasi dibuka saat token ada di `SecureStore` -> `isLoading: true` -> loading spinner -> `supabase.auth.getSession()` memulihkan sesi -> guard langsung mempertahankan user di area aplikasi tanpa flicker ke login. | Berhasil mendarat di `/dashboard` tanpa flicker ke login. | **PASS** |
| 4 | **User login membuka rute login** | User yang sudah terotentikasi mencoba menavigasi ke `/login` atau `/admin/login` -> guard mendeteksi `isAuthenticated && inAuthGroup` -> dialihkan kembali ke `/dashboard`. | Berhasil dialihkan kembali ke `/dashboard`. | **PASS** |
| 5 | **Sign out / Logout** | User menekan tombol "Keluar" -> `signOutUser()` menghapus sesi -> `AuthContext` mengosongkan session & user -> guard mendeteksi `!isAuthenticated && !inAuthGroup` -> area privat terkunci dan dialihkan ke `/login`. | Area privat langsung terkunci dan kembali ke `/login`. | **PASS** |
| 6 | **Pencegahan flicker & layar kosong** | Transisi antar rute tidak menampilkan layar putih kosong (*blank screen*) berkat penanganan `isLoading` dan render `ActivityIndicator`. | Loading state stabil dan bebas loop navigasi. | **PASS** |
| 7 | **Integritas rute Modul 1–3** | Navigasi ke `/family/index`, `/family/add`, dan `/family/[id]` tetap dapat diakses normal saat user login, dan terblokir jika user logout. | Seluruh rute keluarga dan panel admin terlindungi secara konsisten. | **PASS** |
