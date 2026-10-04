export function formatStatValue(value: number): string {
  // Kita memilih perulangan manual (tanpa toLocaleString) agar pemisah ribuan 
  // selalu konsisten menggunakan titik (.), terlepas dari pengaturan bahasa/locale 
  // pada sistem operasi perangkat pengguna yang bisa saja menggunakan koma.
  const chars = value.toString().split('').reverse();
  let result = '';
  let count = 0;

  // RUBRIK: Custom Function & Loop
  for (const char of chars) {
    if (count > 0 && count % 3 === 0) {
      result = '.' + result;
    }
    result = char + result;
    count++;
  }

  return result;
}
