# CareFam — SPEC Modul 3: Asynchronous Programming & Weather API

> **Versi:** 3.0  
> **Scope:** Modul 3 Pemrograman Mobile — Asynchronous Programming, Promise, API Call, dan integrasi Weather Card pada sisi User CareFam.  
> **Sumber utama:** Modul 3 Pemrograman Mobile versi 2.1 (Agustus 2026), terutama Praktik halaman 18–22, Tugas Pekan Demo halaman 23, dan Kriteria Penilaian halaman 24.  
> **Status project:** Modul 1 dan Modul 2 sudah selesai. Modul 3 melanjutkan aplikasi CareFam yang sama.

---

## 1. Tujuan

Menambahkan fitur **Weather Information** pada aplikasi CareFam menggunakan API publik Open-Meteo untuk menampilkan kondisi cuaca terkini di Malang, Jawa Timur.

Fitur ini menjadi tempat penerapan materi Modul 3:
- Mengambil data dari External API.
- Mengubah response JSON menjadi object TypeScript menggunakan `interface`.
- Menggunakan custom dan pre-built async function.
- Menggunakan Promise dengan `resolve()` dan `reject()`.
- Menggunakan method `.then()` untuk menangani hasil Promise.
- Menampilkan loading, data, dan error state secara benar.

## 2. Ketentuan kesinambungan Modul 1 dan Modul 2

1. Lanjutkan repository dan aplikasi CareFam yang sudah ada. Jangan membuat project baru.
2. Modul 1 dan Modul 2 dianggap selesai. Pertahankan fitur, halaman, routing, layout, komponen, dan dependency yang sudah berjalan.
3. Baca dokumentasi `docs/SPEC.md`, dokumentasi Antigravity Modul 1, `docs/SPEC-MODUL-2.md`, dan handoff yang tersedia sebelum mengubah kode.
4. Jangan menulis ulang dokumentasi Modul 1 atau Modul 2.
5. Periksa struktur project dan status Git sebelum coding. Jangan menimpa perubahan anggota lain.
6. Jangan commit, push, merge, atau mengganti branch otomatis.
7. Jangan menambah library jika kemampuan yang dibutuhkan sudah tersedia melalui React Native, Expo, TypeScript, dan `fetch`.
8. Scope fitur baru hanya Weather Information. Jangan menambahkan fitur medis, diagnosis, atau rekomendasi kesehatan berdasarkan cuaca.

## 3. API yang digunakan

**Provider:** Open-Meteo  
**Lokasi:** Malang, Jawa Timur  
**Latitude:** `-7.98`  
**Longitude:** `112.63`  
**HTTP method:** `GET`

```text
https://api.open-meteo.com/v1/forecast?latitude=-7.98&longitude=112.63&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code
```

API key tidak diperlukan untuk endpoint publik ini.

Field `current` yang digunakan:
- `temperature_2m`
- `relative_humidity_2m`
- `apparent_temperature`
- `weather_code`

Response juga dapat memiliki metadata seperti `current_units`, `latitude`, `longitude`, dan `timezone`. Gunakan hanya field yang dibutuhkan UI.

**Penting:** jangan mengarang data cuaca atau mengisi nilai aktual dengan angka hardcoded. Data dummy hanya boleh dipakai untuk pengembangan UI/test terisolasi, bukan ditampilkan sebagai data API aktual.

## 4. Rancangan UI Weather Card

Tambahkan Weather Card pada halaman utama User CareFam yang paling sesuai dengan struktur aktual project. Jangan membuat halaman terpisah kecuali memang lebih konsisten dengan navigasi yang sudah ada.

Weather Card minimal menampilkan:
- Lokasi: Malang, Jawa Timur.
- Suhu saat ini dalam °C.
- Kondisi cuaca berdasarkan `weather_code`.
- Suhu terasa dalam °C.
- Kelembapan dalam persen.
- Tombol untuk memuat ulang data.

Keadaan UI:
1. **Loading:** indikator loading dan teks singkat ketika request berjalan.
2. **Success:** data cuaca dari API.
3. **Error:** pesan ramah jika koneksi/API gagal, serta tombol coba lagi.
4. **Refresh:** pengguna dapat meminta data terbaru tanpa menutup aplikasi.

Gunakan desain rapi, ringkas, responsif, dan konsisten dengan theme CareFam. Gunakan komponen yang sudah ada bila sesuai. Hindari redesign halaman lain.

Untuk `weather_code`, buat pemetaan label sederhana berdasarkan WMO weather interpretation codes. Minimal tangani kode umum dan sediakan label fallback seperti “Kondisi cuaca lainnya” untuk kode yang belum dipetakan. Jangan menyimpulkan prakiraan atau kondisi kesehatan dari kode tersebut.

## 5. Kontrak data dan Interface

Buat interface TypeScript berdasarkan struktur JSON Open-Meteo. Pisahkan response API mentah dari model ringkas yang dipakai UI bila membuat kode lebih jelas.

Contoh bentuk interface (sesuaikan setelah memeriksa response aktual):

```ts
export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };
  current_units?: {
    temperature_2m?: string;
    relative_humidity_2m?: string;
    apparent_temperature?: string;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  weatherCode: number;
  time: string;
}
```

Jangan menyalin contoh interface secara membabi buta. Cocokkan dengan response API yang benar dan validasi minimal field yang dipakai.

## 6. Materi asynchronous yang wajib diterapkan

### 6.1 Pre-built async function
Gunakan `fetch()` sebagai API bawaan JavaScript untuk melakukan HTTP GET. Tangani `response.ok` karena `fetch()` tidak otomatis melempar error untuk semua HTTP status gagal.

### 6.2 Custom async function
Buat fungsi async milik project, misalnya `getCurrentWeather()`, untuk mengambil data, memeriksa response, mem-parsing JSON, dan mengembalikan data bertipe `WeatherData` atau response interface yang disepakati.

Gunakan `async/await` pada implementasi yang menjadi tanggung jawab Naufal. Jangan membuat fungsi async kosong atau sekadar menambahkan kata `async` tanpa kebutuhan.

### 6.3 Promise, resolve, dan reject
Buat satu fungsi Promise eksplisit menggunakan `new Promise<WeatherData>((resolve, reject) => ...)` atau tipe Promise yang disepakati.
- `resolve(value)` dipanggil saat proses berhasil.
- `reject(error)` dipanggil saat proses gagal.
- Jangan memanggil keduanya untuk satu hasil yang sama.
- Jangan membuat Promise constructor yang tidak diperlukan atau hanya membungkus nilai sinkron.

### 6.4 `.then()`
Gunakan `.then()` untuk menangani nilai sukses Promise secara nyata pada alur Weather Card. Tambahkan `.catch()` untuk error dan `.finally()` bila diperlukan untuk mengakhiri loading. Pastikan state loading tidak tertinggal ketika request gagal.

**Koordinasi penting:** ketiga anggota harus menggunakan satu kontrak data dan satu endpoint yang sama. Hindari tiga implementasi request yang saling menduplikasi.

## 7. State UI

Gunakan state yang sesuai dengan pola project, minimal:
- `weather`: data cuaca atau `null`.
- `isLoading`: status request.
- `error`: pesan error atau `null`.

Cegah request ganda yang tidak disengaja. Pastikan refresh dapat dilakukan. Jika memakai `useEffect` untuk mengambil data saat halaman dimuat, sertakan dependency yang tepat dan hindari loop request.

Jangan menambahkan state management library.

## 8. Pembagian tugas dan kontrak antaranggota

### Robi — External API dan Interface
Fokus pada interface response Open-Meteo dan model data cuaca, fungsi request GET menggunakan `fetch()`, pemeriksaan HTTP status dan parsing JSON, serta konversi response ke object bertipe yang siap dipakai UI.

Usulan file: `types/weather.ts` dan `services/weatherApi.ts` (sesuaikan dengan konvensi repository).

Kontrak hasil: fungsi service mengembalikan data cuaca bertipe, bukan `any`.

### Naufal — Custom & Pre-built Async Function
Fokus pada penggunaan pre-built async function `fetch()` dalam alur yang sesuai, implementasi custom async function dengan `async/await`, integrasi pemanggilan data cuaca ke Weather Card, serta loading, error, success, dan refresh state.

Usulan file: `services/weatherAsync.ts` atau lokasi service yang disepakati serta komponen Weather Card/halaman User yang relevan.

Kontrak hasil: gunakan interface dan service Robi; jangan membuat endpoint atau tipe duplikat.

### Syahrial — `.then()`, `.resolve()`, `.reject()`
Fokus pada Promise constructor, pemanggilan `resolve()` saat pengambilan data berhasil, `reject()` saat terjadi kegagalan, penanganan hasil dengan `.then()`, error dengan `.catch()`, dan integrasi alur Promise ke pemuatan/refresh Weather Card tanpa request duplikat.

Usulan file: `services/weatherPromise.ts` dan integrasi handler pada lokasi yang disepakati.

Kontrak hasil: gunakan fungsi/type dari Robi. Jangan menyalin ulang endpoint, interface, atau keseluruhan logic fetch tanpa koordinasi.

### Aturan integrasi
- Sebelum coding, ketiga anggota menyepakati nama interface, bentuk `WeatherData`, nama fungsi, dan file yang dimiliki.
- Jangan mengedit file yang sedang dikerjakan anggota lain.
- Satu alur UI utama harus menggunakan hasil service yang disepakati. Demonstrasi `.then()` dan async/await boleh berada pada handler/metode yang berbeda selama keduanya benar-benar terpakai dan tidak menimbulkan dua request otomatis saat halaman dibuka.
- Pilih satu jalur default untuk pemuatan awal. Jalur lain dapat digunakan untuk tombol refresh atau demonstrasi terkontrol, dengan penjelasan yang jelas.
- Jangan menggabungkan perubahan anggota secara otomatis atau melakukan commit/push.

## 9. Struktur file usulan

Ini hanya usulan. Periksa struktur aktual dan gunakan pola repository yang sudah ada.

```text
CareFam/
├── app/
│   └── ...                         # halaman User yang sudah ada
├── components/
│   └── WeatherCard.tsx             # card cuaca
├── services/
│   ├── weatherApi.ts               # Robi: fetch + mapping
│   ├── weatherAsync.ts              # Naufal: custom async flow
│   └── weatherPromise.ts            # Syahrial: Promise + then
├── types/
│   └── weather.ts                  # Robi: interfaces
└── docs/
    ├── SPEC.md                     # Modul 1, tetap
    ├── SPEC-MODUL-2.md             # Modul 2, tetap
    └── SPEC-MODUL-3.md             # dokumen ini
```

Jangan membuat seluruh file tersebut otomatis jika struktur project memiliki pola lain atau file sudah tersedia.

## 10. Aturan kerja Antigravity

1. Baca SPEC Modul 3, dokumentasi Modul 1 dan Modul 2, serta handoff yang tersedia.
2. Periksa struktur folder, package/dependency, konfigurasi, branch, dan status Git.
3. Periksa response endpoint dan struktur JSON sebelum menentukan interface final.
4. Pada langkah pertama, jangan menulis kode. Sajikan ringkasan, file yang akan disentuh, rencana checkpoint, potensi konflik, dan kontrak integrasi.
5. Tunggu persetujuan eksplisit `SETUJU`.
6. Kerjakan satu checkpoint, lalu berhenti untuk review.
7. Jangan mengubah file anggota lain tanpa koordinasi.
8. Jangan menambah dependency atau mengubah fitur Modul 1/2 tanpa persetujuan.
9. Jalankan `npx tsc --noEmit` jika tersedia. Uji aplikasi dan request API bila lingkungan memungkinkan.
10. Laporkan hasil pengujian yang benar-benar dilakukan; jangan mengklaim berhasil jika belum diuji.
11. Jangan commit/push.
12. Buat handoff berisi file berubah, rubrik yang terpenuhi, cara uji, hasil test, masalah tersisa, dan latihan modifikasi demo.

## 11. Definition of Done

- [ ] Weather Card tampil pada halaman User CareFam.
- [ ] Data berasal dari endpoint Open-Meteo Malang yang ditentukan.
- [ ] Data JSON dipetakan ke object menggunakan TypeScript interface.
- [ ] `fetch()` digunakan sebagai pre-built asynchronous API.
- [ ] Custom async function diterapkan dan digunakan.
- [ ] Promise constructor digunakan dengan `resolve()` dan `reject()`.
- [ ] `.then()` menangani hasil sukses pada alur nyata.
- [ ] Error ditangani dan ditampilkan secara ramah.
- [ ] Loading, success, error, dan refresh berfungsi.
- [ ] Tidak ada data cuaca aktual yang di-hardcode.
- [ ] Modul 1 dan Modul 2 tetap berfungsi.
- [ ] `npx tsc --noEmit` diperiksa dan hasil dilaporkan.
- [ ] Alur utama diuji pada aplikasi.
- [ ] Setiap anggota dapat menjelaskan kontribusinya dan memodifikasi kode tanpa AI.

## 12. Kesesuaian dengan rubrik penilaian Modul 3

| Kriteria penilaian | Bobot | Bukti implementasi |
|---|---:|---|
| Codelab 1 | 40% | Mengikuti praktik Modul 3 pada repository/proyek praktikum sesuai arahan kelas |
| External API + Object + Interface | 10% | `fetch`, parsing JSON, interface, object `WeatherData` |
| Custom & Pre-built Async Function | 10% | Custom `async` function dan pre-built `fetch()` |
| `.then()`, `.resolve()`, `.reject()` | 10% | Promise wrapper, resolve/reject, then/catch |
| Menjawab pertanyaan | 15% | Setiap anggota memahami kode dan alur |
| Modifikasi kode | 15% | Dapat mengubah lokasi, label cuaca, tampilan, atau handling error |
| **Total** | **100%** | |

**Catatan:** Codelab 1 memiliki bobot 40% dan merupakan bagian terpisah dari fitur Weather Card. Ikuti instruksi asisten untuk penyelesaian codelab.
