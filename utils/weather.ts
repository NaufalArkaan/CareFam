// RUBRIK: Modul 3 — Custom & Pre-built Async Function (Naufal)

/**
 * Pemetaan kode cuaca WMO (World Meteorological Organization) ke deskripsi teks bahasa Indonesia.
 * Sesuai panduan Open-Meteo & WMO Code table 4677.
 */
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Cerah';
    case 1:
      return 'Sebagian Cerah';
    case 2:
      return 'Cerah Berawan';
    case 3:
      return 'Berawan';
    case 45:
    case 48:
      return 'Berkabut';
    case 51:
    case 53:
    case 55:
      return 'Gerimis';
    case 61:
    case 63:
    case 65:
      return 'Hujan';
    case 71:
    case 73:
    case 75:
      return 'Hujan Salju';
    case 80:
    case 81:
    case 82:
      return 'Hujan Lebat';
    case 95:
    case 96:
    case 99:
      return 'Badai Petir';
    default:
      return 'Kondisi cuaca lainnya';
  }
}

/**
 * Mengembalikan icon emoji representasi cuaca berdasarkan weatherCode WMO
 */
export function getWeatherIcon(code: number): string {
  switch (code) {
    case 0:
      return '☀️';
    case 1:
    case 2:
      return '⛅';
    case 3:
      return '☁️';
    case 45:
    case 48:
      return '🌫️';
    case 51:
    case 53:
    case 55:
      return '🌦️';
    case 61:
    case 63:
    case 65:
      return '🌧️';
    case 71:
    case 73:
    case 75:
      return '❄️';
    case 80:
    case 81:
    case 82:
      return '⛈️';
    case 95:
    case 96:
    case 99:
      return '🌩️';
    default:
      return '🌤️';
  }
}

