import { UserRole, LoginContent, DemoAccount } from '../types';
import { LOGIN_CONTENT } from '../data/loginContent';
import { DEMO_ACCOUNTS } from '../data/accounts';

// RUBRIK: Custom Function & Loop
// Mengambil konten konfigurasi login sesuai peran menggunakan loop for...of
export function getLoginContent(role: UserRole): LoginContent {
  for (const item of LOGIN_CONTENT) {
    if (item.role === role) {
      return item;
    }
  }
  return LOGIN_CONTENT[0];
}

// RUBRIK: Custom Function & Loop
// Mengambil daftar akun demo yang sesuai dengan peran menggunakan loop for...of
export function getAccountsByRole(role: UserRole): DemoAccount[] {
  const result: DemoAccount[] = [];
  for (const account of DEMO_ACCOUNTS) {
    if (account.role === role) {
      result.push(account);
    }
  }
  return result;
}
