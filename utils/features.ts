import { FeatureItem } from '../types';

/**
 * Menghitung jumlah item berdasarkan statusnya ('active' atau 'soon').
 */
// RUBRIK: Custom Function & Loop
export function countByStatus(items: FeatureItem[]): { active: number; soon: number } {
  let active = 0;
  let soon = 0;

  for (const item of items) {
    if (item.status === 'active') {
      active += 1;
    } else if (item.status === 'soon') {
      soon += 1;
    }
  }

  return { active, soon };
}

/**
 * Menghasilkan teks ringkasan jumlah item dan status kesiapannya.
 */
// RUBRIK: Custom Function & Loop
export function getSummaryText(items: FeatureItem[], unit: string): string {
  const total = items.length;
  const { active } = countByStatus(items);

  if (active > 0) {
    return `${total} ${unit} • ${active} siap dipakai`;
  }

  return `${total} ${unit} • akan dibuka bertahap`;
}

/**
 * Menentukan apakah suatu kartu harus selebar penuh (100%) dalam grid 2 kolom.
 */
// RUBRIK: Custom Function & Loop
export function isFullWidthCard(index: number, total: number): boolean {
  const isOddTotal = total % 2 !== 0;
  const isLastIndex = index === total - 1;

  return isOddTotal && isLastIndex;
}
