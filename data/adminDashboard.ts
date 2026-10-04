import { AdminStat, FeatureItem } from '../types';

// RUBRIK: Type & Array of Objects
export const ADMIN_STATS: AdminStat[] = [
  { id: 1, label: 'Total Pengguna', value: 128, icon: '👥', color: '#2F6F73' },
  { id: 2, label: 'Anggota Keluarga', value: 342, icon: '👨‍👩‍👧', color: '#A8C3B0' },
  { id: 3, label: 'Fasilitas Kesehatan', value: 24, icon: '🏥', color: '#E89B8A' },
  { id: 4, label: 'Laporan Masuk', value: 5, icon: '📝', color: '#263238' },
];

// RUBRIK: Type & Array of Objects
export const ADMIN_MENUS: FeatureItem[] = [
  { id: 1, title: 'User Management', description: 'Kelola akun pengguna dan status akun', icon: '👥', route: '/admin/users', status: 'soon' },
  { id: 2, title: 'Hospital Management', description: 'Tambah, ubah, dan nonaktifkan data rumah sakit atau klinik', icon: '🏥', route: '/admin/hospitals', status: 'soon' },
  { id: 3, title: 'Health Education', description: 'Kelola artikel dan informasi edukasi kesehatan', icon: '📖', route: '/admin/education', status: 'soon' },
  { id: 4, title: 'Report Management', description: 'Tangani laporan data, penyalahgunaan, dan keluhan', icon: '📝', route: '/admin/reports', status: 'soon' },
  { id: 5, title: 'SOS Monitoring', description: 'Pantau status teknis pengiriman SOS', icon: '📡', route: '/admin/sos', status: 'soon' },
  { id: 6, title: 'System Settings', description: 'Atur konfigurasi aplikasi dan hak akses admin', icon: '⚙️', route: '/admin/settings', status: 'soon' },
];
