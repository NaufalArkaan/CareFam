// RUBRIK: Modul 3 — Custom & Pre-built Async Function (Naufal)

import { fetchCurrentWeather } from './weatherService';
import type { WeatherData } from '../types';

/**
 * CHECKPOINT 1 (Pre-built Async Function) & CHECKPOINT 2 (Custom Async Function)
 *
 * loadCurrentWeather adalah custom asynchronous function yang memanfaatkan
 * pre-built async function fetch() (melalui service fetchCurrentWeather dari Robi)
 * dengan menggunakan sintaks modern async/await.
 *
 * @returns Promise<WeatherData> Objek data cuaca terstruktur untuk Malang
 */
export async function loadCurrentWeather(): Promise<WeatherData> {
  // Menggunakan await untuk menunggu proses asynchronous pengambilan data HTTP selesai
  const weatherData: WeatherData = await fetchCurrentWeather();
  return weatherData;
}

