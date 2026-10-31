// RUBRIK: Modul 3 — External API, JSON Object, dan TypeScript Interface (Robi)

/**
 * Interface untuk blok unit pengukuran cuaca dari Open-Meteo.
 */
export interface OpenMeteoCurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
}

/**
 * Interface untuk payload `current` aktual dari Open-Meteo.
 */
export interface OpenMeteoCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
}

/**
 * Interface representasi raw response JSON dari API Open-Meteo.
 */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: OpenMeteoCurrentUnits;
  current: OpenMeteoCurrent;
}

/**
 * Model data cuaca ringkas yang telah dipetakan dan siap dikonsumsi oleh UI (Weather Card).
 */
export interface WeatherData {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  weatherCode: number;
}
