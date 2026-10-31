// RUBRIK: Modul 3 — Promise Constructor, resolve(), dan reject() (Syahrial)

import { fetchCurrentWeather } from './weatherService';
import type { WeatherData } from '../types';

/**
 * CHECKPOINT 1 (Promise Constructor) & CHECKPOINT 2 (Resolve dan Reject)
 *
 * getWeatherWithPromise adalah custom function yang mengembalikan Promise bertipe
 * Promise<WeatherData> menggunakan konstruktor eksplisit `new Promise<WeatherData>()`.
 *
 * Fungsi ini mengonsumsi service aktual Robi (fetchCurrentWeather) tanpa request ganda,
 * dan meneruskan hasil asynchronous secara tegas melalui:
 * - resolve(data) saat operasi berhasil
 * - reject(error) saat operasi gagal
 *
 * @returns Promise<WeatherData> Promise yang menghasilkan data cuaca Malang
 */
export function getWeatherWithPromise(): Promise<WeatherData> {
  return new Promise<WeatherData>((resolve, reject) => {
    // Menjalankan proses asynchronous nyata dari service API
    fetchCurrentWeather()
      .then((data: WeatherData) => {
        // Memanggil resolve(data) jika pengambilan & pemrosesan data berhasil
        resolve(data);
      })
      .catch((error: unknown) => {
        // Memanggil reject(error) jika request HTTP atau parsing gagal
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error('Terjadi kesalahan yang tidak terduga saat memuat cuaca'));
        }
      });
  });
}
