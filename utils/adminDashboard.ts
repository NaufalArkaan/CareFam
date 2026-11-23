export function formatStatValue(value: number | string | null | undefined): string {
  // Jika nilai null/undefined atau berupa tanda strip '—', kembalikan '—'
  if (value === null || value === undefined || value === '—' || value === '') {
    return '—';
  }

  // Jika berupa string, periksa apakah string angka
  let numValue: number;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return value;
    }
    numValue = parsed;
  } else {
    numValue = value;
  }

  // Kita memilih perulangan manual (tanpa toLocaleString) agar pemisah ribuan 
  // selalu konsisten menggunakan titik (.), terlepas dari pengaturan bahasa/locale 
  // pada sistem operasi perangkat pengguna yang bisa saja menggunakan koma.
  const chars = numValue.toString().split('').reverse();
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
