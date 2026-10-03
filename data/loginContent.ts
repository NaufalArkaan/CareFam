import { LoginContent } from '../types';

// RUBRIK: Type & Array of Objects
export const LOGIN_CONTENT: LoginContent[] = [
  { id: 1, role: 'user',  title: 'Masuk ke CareFam',
    subtitle: 'Kelola kesehatan seluruh keluarga dalam satu aplikasi',
    buttonLabel: 'Masuk', accentColor: '#2F6F73',
    altLabel: 'Masuk sebagai admin', altRoute: '/admin/login' },
  { id: 2, role: 'admin', title: 'Admin Login',
    subtitle: 'Masuk menggunakan akun admin',
    buttonLabel: 'Masuk sebagai Admin', accentColor: '#263238',
    altLabel: 'Kembali ke login pengguna', altRoute: '/login' },
];
