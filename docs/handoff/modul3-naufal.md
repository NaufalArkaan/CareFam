# Handoff Modul 3 — Naufal (Custom & Pre-built Async Function)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Naufal (Anggota 1)
- **Modul:** Modul 3 — Custom & Pre-built Async Function pada Fitur Weather Information CareFam
- **Tanggung Jawab:**
  1. Menggunakan pre-built asynchronous function `fetch()` melalui service API.
  2. Mengimplementasikan custom async function `loadCurrentWeather()` dengan sintaks modern `async/await`.
  3. Mengembangkan komponen `WeatherCard` pada halaman User Dashboard CareFam (`app/dashboard.tsx`).
  4. Menangani state secara lengkap: `loading` (indikator progress), `success` (tampilan metrik cuaca), `error` (pesan kegagalan & tombol coba lagi), dan `refresh`.
  5. Mengoordinasikan alur integrasi dengan Syahrial agar tidak terjadi *double request* otomatis.

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
|---|:---:|---|
| `services/weatherAsync.ts` | **Baru** | Berisi custom async function `loadCurrentWeather()` yang mengonsumsi `fetchCurrentWeather()` dari Robi menggunakan `async/await`. |
| `utils/weather.ts` | **Baru** | Utility fungsi murni pemetaan WMO weather code ke deskripsi bahasa Indonesia dan emoji ikon cuaca. |
| `components/cards/WeatherCard.tsx` | **Baru** | Komponen UI Weather Card CareFam dengan penanganan state lengkap (`weather`, `isLoading`, `errorMessage`, `lastUpdated`), render metrik cuaca Malang, indikator loading, pesan error, dan tombol perbarui. |
| `app/dashboard.tsx` | **Diubah** | Menyematkan `<WeatherCard />` di antara seksi Profil Pengguna dan Layanan Keluarga. |
| `docs/handoff/modul3-naufal.md` | **Baru** | Dokumentasi handoff pengerjaan tugas Modul 3 oleh Naufal. |

---

## 3. Penjelasan Asynchronous Programming

### A. Pre-built Async Function (`fetch()`)
- `fetch()` merupakan fungsi bawaan runtime JavaScript (browser, Node 18+, dan React Native hermes/jsc) untuk melakukan request HTTP berbasis Promise secara asynchronous.
- Pada project ini, `fetch()` dipanggil di dalam `services/weatherService.ts` untuk mengambil payload cuaca dari endpoint Open-Meteo Malang:
  `https://api.open-meteo.com/v1/forecast?latitude=-7.98&longitude=112.63&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code`
- Operasi ini berjalan di background thread tanpa memblokir thread UI React Native.

### B. Custom Async Function (`loadCurrentWeather()`)
- Didefinisikan di `services/weatherAsync.ts`:
  ```typescript
  export async function loadCurrentWeather(): Promise<WeatherData> {
    const weatherData: WeatherData = await fetchCurrentWeather();
    return weatherData;
  }
  ```
- Fungsi dideklarasikan dengan kata kunci `async`, yang menjamin bahwa fungsi selalu mengembalikan sebuah `Promise`.
- Kata kunci `await` menghentikan eksekusi di dalam fungsi tersebut secara asynchronous hingga Promise dari `fetchCurrentWeather()` berstatus *fulfilled*, lalu mengembalikan data bertipe `WeatherData`.

---

## 4. Struktur Komponen Weather Card & Penanganan State

### A. Penempatan
Komponen disematkan pada [app/dashboard.tsx](file:///c:/Pelajaran-Kuliah-UMM/Pemrograman%20Mobile/Praktikum/CareFam/app/dashboard.tsx) pada seksi tersendiri:
```tsx
{/* RUBRIK Modul 3: Weather Card (Custom & Pre-built Async Function - Naufal) */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Kondisi Cuaca Hari Ini</Text>
  <WeatherCard />
</View>
```

### B. State Management
1. **`isLoading: boolean`**: Menandakan apakah request jaringan sedang berlangsung. Ditampilkan dalam bentuk `<ActivityIndicator size="small" color={colors.primary} />` dengan teks informatif.
2. **`weather: WeatherData | null`**: Menyimpan objek data cuaca aktual dari Open-Meteo jika request berhasil.
3. **`errorMessage: string | null`**: Menyimpan pesan kesalahan jika HTTP status gagal atau terjadi masalah koneksi.
4. **`lastUpdated: string | null`**: Menampilkan jam dan menit terakhir kali data cuaca berhasil diperbarui (WIB).

### C. Jaminan Siklus Hidup (Lifecycle & Pencegahan Memory Leak)
- Di dalam `useEffect`, flag `isMounted` disiapkan untuk mencegah pembaruan state pada komponen yang sudah di-unmount:
  ```typescript
  useEffect(() => {
    let isMounted = true;
    async function initialLoad() {
      if (isMounted) {
        await handleFetchWeather();
      }
    }
    initialLoad();
    return () => {
      isMounted = false;
    };
  }, [handleFetchWeather]);
  ```
- Blok `finally` memastikan `setIsLoading(false)` selalu dieksekusi, sehingga kartu tidak akan *stuck* dalam keadaan loading saat terjadi error.

---

## 5. Koordinasi Integrasi dengan Syahrial (Promise `.then()`)

Untuk menyelaraskan alur dengan Syahrial tanpa duplikasi pemanggilan request:
1. **Alur Pemuatan Awal (Default Mount):**
   - Halaman `dashboard.tsx` menjalankan jalur `async/await` milik Naufal (`loadCurrentWeather()`) tepat 1 kali saat komponen pertama kali dibuka.
2. **Alur Demonstrasi / Refresh (Jalur Promise Syahrial):**
   - Komponen `WeatherCard` menyediakan prop opsional:
     ```typescript
     export interface WeatherCardProps {
       onCustomFetch?: () => Promise<WeatherData>;
     }
     ```
   - Ketika Syahrial menyelesaikan service Promise berbasis `.then()`/`.catch()`, fungsinya dapat di-pass ke `WeatherCard` atau dipanggil pada tombol refresh untuk demonstrasi pengujian di hadapan penguji lab.
   - Tidak ada dua request otomatis yang berjalan serentak saat layar dimuat.

---

## 6. Hasil Verifikasi & Pengujian Aktual

1. **TypeScript Static Analysis (`npx tsc --noEmit`):**
   - **Hasil:** `Exit code 0`.
   - 100% type-safe, tidak menggunakan `any`, `@ts-ignore`, atau *type casting* sembarangan.
2. **UI / Styling Consistency:**
   - Menggunakan token design CareFam (`colors.primary`, `colors.surface`, `colors.border`, `spacing`, `radius`, `typography`).
   - Tampilan responsif dengan hierarki:
     - Header: Kota "Malang, Jawa Timur" + Badge Waktu (WIB).
     - Metrik Utama: Suhu terkini (°C) dan Kondisi Cuaca (WMO).
     - Metrik Sekunder: Suhu Terasa (°C) dan Kelembapan (%).
     - Aksi: Tombol Perbarui Cuaca (Refresh).

---

## 7. Latihan Modifikasi untuk Demo Praktikum

Untuk mendemonstrasikan pemahaman kode di hadapan dosen/asisten:
1. **Menguji Error State Secara Manual:**
   - Buka `services/weatherService.ts`, ganti URL endpoint dengan URL yang salah (misal tambahkan karakter acak di domain).
   - Simpan dan refresh aplikasi.
   - **Hasil:** Muncul kotak merah bertanda ⚠️ *"Gagal Memuat Cuaca"* beserta pesan error dan tombol *"Coba Lagi"*.
2. **Mengubah Label atau Icon Cuaca:**
   - Buka `utils/weather.ts`.
   - Ubah string kembalian pada fungsi `getWeatherDescription()` atau emoji pada `getWeatherIcon()`.
   - **Hasil:** Komponen Weather Card akan langsung menampilkan ikon dan label yang telah disesuaikan.

