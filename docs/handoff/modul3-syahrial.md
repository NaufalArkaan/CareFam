# Handoff Modul 3 — Syahrial (Promise, `.then()`, `resolve()`, dan `reject()`)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Syahrial (Anggota 2)
- **Modul:** Modul 3 — Promise Constructor, `resolve()`, `reject()`, dan Method `.then()`
- **Tanggung Jawab:**
  1. Membuat fungsi kustom yang mengembalikan Promise bertipe `Promise<WeatherData>` menggunakan konstruktor `new Promise<WeatherData>((resolve, reject) => { ... })`.
  2. Menerapkan pemanggilan `resolve(data)` ketika pengambilan data dan pemetaan berhasil.
  3. Menerapkan pemanggilan `reject(error)` ketika request jaringan atau parsing data mengalami kegagalan.
  4. Menerapkan penanganan hasil Promise menggunakan `.then()` untuk memperbarui UI cuaca, `.catch()` untuk penanganan error ramah pengguna, dan `.finally()` untuk mengakhiri indikator loading.
  5. Mengintegrasikan handler Promise ke komponen `WeatherCard` pada aksi tombol "Perbarui Cuaca" (Refresh) dan "Coba Lagi" tanpa menimbulkan request ganda (*double fetch*) dengan alur `async/await` milik Naufal.

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
|---|:---:|---|
| `services/weatherPromise.ts` | **Baru** | Service utama Syahrial yang berisi `getWeatherWithPromise(): Promise<WeatherData>` dengan konstruktor `new Promise`, `resolve()`, dan `reject()`. |
| `components/cards/WeatherCard.tsx` | **Diubah** | Mengintegrasikan `handleRefreshWithPromise()` yang mengonsumsi `getWeatherWithPromise()` via `.then()`, `.catch()`, dan `.finally()` pada tombol refresh dan tombol coba lagi. |
| `docs/handoff/modul3-syahrial.md` | **Baru** | Dokumen handoff dan penjelasan materi untuk demo praktikum. |

---

## 3. Penjelasan Asynchronous Programming: Promise, `resolve`, `reject`, dan `.then()`

### A. Konstruktor Promise (`new Promise<T>`)
- Didefinisikan di `services/weatherPromise.ts`:
  ```typescript
  export function getWeatherWithPromise(): Promise<WeatherData> {
    return new Promise<WeatherData>((resolve, reject) => {
      fetchCurrentWeather()
        .then((data: WeatherData) => {
          resolve(data);
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error('Terjadi kesalahan yang tidak terduga saat memuat cuaca'));
          }
        });
    });
  }
  ```
- Konstruktor `new Promise` menerima satu parameter berupa fungsi *executor* `(resolve, reject) => void` yang langsung dijalankan secara sinkron untuk memulai operasi asynchronous di dalamnya.
- Generic type `<WeatherData>` menjamin *type safety* sehingga konsumen Promise tahu pasti tipe data yang akan diterima.

### B. Peran `resolve()` dan `reject()`
1. **`resolve(value)`:**
   - Dipanggil saat operasi asynchronous berhasil menyelesaikan tugasnya.
   - Mengubah status internal Promise dari **pending** menjadi **fulfilled**.
   - Meneruskan nilai `data` (bertipe `WeatherData`) ke callback pertama pada `.then()`.
2. **`reject(reason)`:**
   - Dipanggil saat operasi asynchronous menemui kegagalan atau melempar exception.
   - Mengubah status internal Promise dari **pending** menjadi **rejected**.
   - Meneruskan objek error ke callback pada `.catch()`.
3. **Aturan Mutlak:** Status Promise hanya dapat bertransisi satu kali (sekali *settled*, nilainya *immutable*). `resolve` dan `reject` tidak pernah dipanggil bersamaan untuk operasi yang sama.

### C. Penanganan Hasil dengan `.then()`, `.catch()`, dan `.finally()`
- Diterapkan pada `components/cards/WeatherCard.tsx`:
  ```typescript
  const handleRefreshWithPromise = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);

    const promiseSource = onCustomFetch
      ? onCustomFetch()
      : getWeatherWithPromise();

    promiseSource
      .then((data: WeatherData) => {
        // .then() menerima nilai yang dikirimkan oleh resolve(data)
        setWeather(data);
        const now = new Date();
        setLastUpdated(
          `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        );
      })
      .catch((err: unknown) => {
        // .catch() menangkap error yang dikirimkan oleh reject(error)
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal terhubung ke layanan cuaca. Periksa koneksi internet Anda.';
        setErrorMessage(message);
      })
      .finally(() => {
        // .finally() selalu dipanggil di akhir (sukses maupun gagal)
        setIsLoading(false);
      });
  }, [onCustomFetch]);
  ```
- **Mengapa `.then()` menghasilkan Promise baru?**
  Method `.then()` selalu mengembalikan Promise baru (*chainable*). Jika callback di dalam `.then()` mengembalikan suatu nilai atau melempar error, nilai tersebut otomatis dibungkus ke dalam Promise baru yang berstatus fulfilled atau rejected.

---

## 4. Alur Integrasi Bersama Robi & Naufal

1. **Robi (External API & Interface):**
   - Menyediakan `WeatherData` di `types/weather.ts`.
   - Menyediakan `fetchCurrentWeather()` di `services/weatherService.ts` yang memanggil API Open-Meteo Malang.
   - Syahrial mengonsumsi service ini di `services/weatherPromise.ts` tanpa menduplikasi pemanggilan HTTP mentah atau tipe data.
2. **Naufal (Custom Async Function & Dashboard UI):**
   - Menangani pemuatan awal (*initial mount*) kartu cuaca menggunakan alur `async/await` (`loadCurrentWeather()`) tepat 1 kali saat halaman dibuka.
3. **Syahrial (Promise Constructor & `.then()` Handler):**
   - Menangani alur interaktif pengguna: tombol **"🔄 Perbarui Cuaca"** dan tombol **"Coba Lagi"** ketika terjadi kegagalan.
   - **Hasil Integrasi:** Tidak terjadi tabrakan state atau pemanggilan API ganda saat aplikasi dibuka, dan kedua kompetensi inti Modul 3 (async/await dan Promise `.then()`) terbukti berjalan nyata pada aplikasi.

---

## 5. Hasil Verifikasi & Pengujian Aktual

1. **TypeScript Static Analysis:**
   - Perintah: `npx tsc --noEmit`
   - Hasil: **Exit code 0** (Tidak ada error, type-safe, tanpa `any` atau `@ts-ignore`).
2. **Pengujian Pemanggilan API & Status Promise:**
   - Endpoint Open-Meteo Malang (`latitude=-7.98`, `longitude=112.63`) berhasil diakses via HTTP GET.
   - Status Promise berhasil berganti ke *fulfilled*, memicu `.then()` dan memperbarui state `weather`.
   - Callback `.finally()` sukses mematikan indikator `ActivityIndicator` (loading).
3. **Pencegahan Double Fetch:**
   - Initial load: 1 request via Naufal `loadCurrentWeather()`.
   - Refresh manual: 1 request via Syahrial `getWeatherWithPromise()`.

---

## 6. Latihan Modifikasi untuk Demo Penguji Lab

Saat penguji meminta demonstrasi pemahaman kode:

1. **Menguji Eksekusi Jalur `reject()` dan `.catch()`:**
   - Buka `services/weatherPromise.ts`.
   - Ubah isi fungsi untuk mensimulasikan penolakan (reject) secara sengaja:
     ```typescript
     export function getWeatherWithPromise(): Promise<WeatherData> {
       return new Promise<WeatherData>((resolve, reject) => {
         // Simulasi reject untuk pengujian lab:
         reject(new Error('Koneksi simulasi ditolak oleh server'));
       });
     }
     ```
   - Tekan tombol **"🔄 Perbarui Cuaca"** di aplikasi.
   - **Hasil:** Muncul kotak peringatan merah *"Gagal Memuat Cuaca: Koneksi simulasi ditolak oleh server"* dan tombol *"Coba Lagi"*. Hal ini membuktikan alur `reject` diteruskan ke `.catch()`.

2. **Menguji Manipulasi Data pada `.then()`:**
   - Pada `components/cards/WeatherCard.tsx`, di dalam blok `.then()`:
     ```typescript
     .then((data: WeatherData) => {
       // Modifikasi demo: bulatkan suhu atau tambahkan offset demo
       setWeather({
         ...data,
         temperature: data.temperature + 5, // simulasi kenaikan suhu
       });
     })
     ```
   - Saat tombol refresh ditekan, suhu di layar akan langsung bertambah 5°C, membuktikan data dari `resolve()` diproses di dalam callback `.then()`.
