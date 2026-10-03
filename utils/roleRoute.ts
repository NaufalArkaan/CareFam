import { UserRole } from '../types';

// RUBRIK: Custom Function & Loop
// Mendapatkan rute halaman utama (dashboard) berdasarkan peran pengguna
export function getHomeRoute(role: UserRole): string {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

// RUBRIK: Custom Function & Loop
// Mendapatkan label nama peran dalam bahasa Indonesia
export function getRoleLabel(role: UserRole): string {
  return role === 'admin' ? 'Admin' : 'Pengguna';
}
