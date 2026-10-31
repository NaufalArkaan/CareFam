# Handoff Modul 3 — Robi (External API, JSON Object, dan TypeScript Interface)

## 1. Identitas & Ringkasan Peran
- **Anggota:** Robi (Anggota 3)
- **Modul:** Modul 3 — External API, JSON Object, dan TypeScript Interface
- **Tanggung Jawab:** 
  1. Membuat TypeScript Interface untuk raw response API Open-Meteo dan model ringkas `WeatherData`.
  2. Mengimplementasikan fetch service menggunakan `fetch()` native untuk mengambil data cuaca aktual Malang.
  3. Memetakan (*mapping*) JSON payload ke dalam object `WeatherData`.
  4. Menyediakan kontrak data yang jelas dan siap dikonsumsi oleh Naufal dan Syahrial.

---

## 2. File yang Dibuat & Diubah

| File | Status | Keterangan |
| :--- | :---: | :--- |
| `types/weather.ts` | **Baru** | Definisi interface `OpenMeteoResponse`, `OpenMeteoCurrent`, dan `WeatherData`. |
| `types/index.ts` | **Diubah** | Re-export `* from './weather'` untuk integrasi terpusat. |
| `services/weatherService.ts` | **Baru** | Service pemanggilan API `fetchCurrentWeather()` dan mapping `mapOpenMeteoToWeatherData()`. |
| `docs/handoff/modul3-robi.md` | **Baru** | Dokumen kontrak handoff ini. |

---

## 3. Kontrak Data untuk Naufal & Syahrial

### A. Lokasi File & Nama Interface
- **File Interface:** `types/weather.ts` (bisa diimpor langsung via `types` atau `@/types`).
- **Nama Interface Utama:** `WeatherData`
- **Nama Interface Raw API:** `OpenMeteoResponse`

```typescript
export interface WeatherData {
  time: string;                // Waktu pencatatan data cuaca (ISO 8601 string)
  temperature: number;         // Suhu udara aktual dalam °C
  relativeHumidity: number;    // Kelembaban relatif dalam %
  apparentTemperature: number; // Suhu yang dirasakan (feels like) dalam °C
  weatherCode: number;         // Kode interpretasi cuaca standar WMO
}
```

### B. Nama & Cara Menggunakan Fungsi Service
- **File Service:** `services/weatherService.ts` (atau `@/services/weatherService`).
- **Nama Fungsi:** `fetchCurrentWeather(): Promise<WeatherData>`

**Contoh Penggunaan di Komponen (State & Effect Naufal/Syahrial):**
```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { fetchCurrentWeather } from '@/services/weatherService';
import type { WeatherData } from '@/types';

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await fetchCurrentWeather();
        if (isMounted) {
          setWeather(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat cuaca';
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <ActivityIndicator />;
  if (errorMessage) return <Text>Error: {errorMessage}</Text>;
  if (!weather) return null;

  return (
    <View>
      <Text>Suhu: {weather.temperature}°C</Text>
      <Text>Kelembaban: {weather.relativeHumidity}%</Text>
      <Text>Terasa Seperti: {weather.apparentTemperature}°C</Text>
    </View>
  );
}
```

### C. Cara Pelaporan Error (*Error Reporting*)
Fungsi `fetchCurrentWeather()` melempar standard JavaScript `Error` dengan pesan yang informatif:
1. **HTTP Error (misal 4xx / 5xx):**
   `Gagal mengambil data cuaca dari server (HTTP <status_code>: <status_text>)`
2. **Payload Rusak / Jaringan Bermasalah:**
   `Format respons JSON tidak valid dari server cuaca` atau `Data cuaca tidak lengkap: salah satu field metrik cuaca tidak valid`

Naufal & Syahrial cukup membungkus pemanggilan dengan blok `try ... catch` dan menampilkan `error.message` ke state UI jika terjadi kegagalan.

---

## 4. Hasil Verifikasi & Pengujian Aktual
1. **TypeScript Check (`npx tsc --noEmit`):**
   - **Status:** Lolos (Exit Code 0).
   - Tidak ada error tipe, tidak menggunakan `any`, `@ts-ignore`, atau *type casting* liar.
2. **Pengujian Pemanggilan API Aktual (Live Network Call):**
   - **HTTP Status:** 200 OK.
   - **Endpoint:** `https://api.open-meteo.com/v1/forecast?latitude=-7.98&longitude=112.63&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code`
   - **Hasil Output Terpetakan:**
     ```json
     {
       "time": "2026-10-31T14:30",
       "temperature": 22.9,
       "relativeHumidity": 95,
       "apparentTemperature": 27.2,
       "weatherCode": 1
     }
     ```
   - Seluruh 5 field utama berhasil dipetakan ke dalam objek `WeatherData` secara valid dan akurat.
