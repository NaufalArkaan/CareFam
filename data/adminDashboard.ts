import { AdminStat, FeatureItem } from '../types';

// RUBRIK: Type & Array of Objects
// Struktur awal kartu metrik statistik operasional CareFam
// Catatan: Nilai aktual akan dimuat secara dinamis dari Supabase melalui adminService
export const ADMIN_STATS: AdminStat[] = [
  { id: 1, label: 'Total Pengguna', value: null, icon: 'people', color: '#2563EB' },
  { id: 2, label: 'Anggota Keluarga', value: null, icon: 'heart', color: '#0D9488' },
  { id: 3, label: 'Fasilitas Kesehatan', value: '—', icon: 'business', color: '#7C3AED' },
  { id: 4, label: 'Laporan Masuk', value: '—', icon: 'document-text', color: '#D97706' },
];

// RUBRIK: Type & Array of Objects
// Data modul manajemen admin CareFam
// Modul User Management kini berstatus 'active' dengan rute '/admin/users'
export const ADMIN_MENUS: FeatureItem[] = [
  { id: 1, title: 'User Management', description: 'Kelola akun pengguna dan status akun', icon: 'people-outline', route: '/admin/users', status: 'active' },
  { id: 2, title: 'Hospital Management', description: 'Tambah, ubah, dan nonaktifkan data rumah sakit atau klinik', icon: 'medkit-outline', route: '/admin/hospitals', status: 'soon' },
  { id: 3, title: 'Health Education', description: 'Kelola artikel dan informasi edukasi kesehatan', icon: 'book-outline', route: '/admin/education', status: 'soon' },
  { id: 4, title: 'Report Management', description: 'Tangani laporan data, penyalahgunaan, dan keluhan', icon: 'shield-checkmark-outline', route: '/admin/reports', status: 'soon' },
  { id: 5, title: 'SOS Monitoring', description: 'Pantau status teknis pengiriman SOS', icon: 'radio-outline', route: '/admin/sos', status: 'soon' },
  { id: 6, title: 'System Settings', description: 'Atur konfigurasi aplikasi dan hak akses admin', icon: 'settings-outline', route: '/admin/settings', status: 'soon' },
];
