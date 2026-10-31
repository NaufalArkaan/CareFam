// RUBRIK: Modul 3 — External API, JSON Object, dan TypeScript Interface (Robi)

import type { OpenMeteoResponse, WeatherData } from '../types';

export const MALANG_WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-7.98&longitude=112.63&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code';

/**
 * CHECKPOINT 3: Mengubah raw response Open-Meteo menjadi object WeatherData
 * yang mudah dan aman digunakan oleh komponen Weather Card.
 *
 * @param raw Objek raw response dari Open-Meteo API
 * @returns Objek WeatherData yang telah dinormalisasi
 */
export function mapOpenMeteoToWeatherData(raw: OpenMeteoResponse): WeatherData {
  if (!raw || !raw.current) {
    throw new Error('Payload cuaca tidak memiliki data "current"');
  }

  const { current } = raw;

  if (
    typeof current.temperature_2m !== 'number' ||
    typeof current.relative_humidity_2m !== 'number' ||
    typeof current.apparent_temperature !== 'number' ||
    typeof current.weather_code !== 'number' ||
    typeof current.time !== 'string'
  ) {
    throw new Error('Data cuaca tidak lengkap: salah satu field metrik cuaca tidak valid');
  }

  return {
    time: current.time,
    temperature: current.temperature_2m,
    relativeHumidity: current.relative_humidity_2m,
    apparentTemperature: current.apparent_temperature,
    weatherCode: current.weather_code,
  };
}

/**
 * CHECKPOINT 2: Mengambil data cuaca terkini dari Open-Meteo API menggunakan fetch().
 *
 * - Memeriksa response.ok (HTTP 2xx).
 * - Melempar error deskriptif jika HTTP gagal atau struktur data rusak.
 * - Memetakan payload JSON ke interface WeatherData.
 *
 * @returns Promise<WeatherData> Objek data cuaca aktual
 */
export async function fetchCurrentWeather(): Promise<WeatherData> {
  const response = await fetch(MALANG_WEATHER_API_URL);

  // fetch() tidak otomatis reject untuk HTTP 4xx/5xx, harus divalidasi manual
  if (!response.ok) {
    throw new Error(
      `Gagal mengambil data cuaca dari server (HTTP ${response.status}: ${response.statusText || 'Error'})`
    );
  }

  const json: unknown = await response.json();

  if (!json || typeof json !== 'object' || !('current' in json)) {
    throw new Error('Format respons JSON tidak valid dari server cuaca');
  }

  return mapOpenMeteoToWeatherData(json as OpenMeteoResponse);
}
