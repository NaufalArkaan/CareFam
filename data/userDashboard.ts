import { FeatureItem, InfoItem } from '../types';

// RUBRIK: Type & Array of Objects
export const USER_FEATURES: FeatureItem[] = [
  {
    id: 1,
    title: 'Family Management',
    description: 'Kelola profil keluarga',
    icon: '👨‍👩‍👧',
    route: '/family',
    status: 'soon',
  },
  {
    id: 2,
    title: 'Medical Records',
    description: 'Riwayat diagnosis dan dokumen',
    icon: '📋',
    route: '/medical-records',
    status: 'soon',
  },
  {
    id: 3,
    title: 'Hospital Finder',
    description: 'Pencarian rumah sakit',
    icon: '🏥',
    route: '/hospital-finder',
    status: 'soon',
  },
  {
    id: 4,
    title: 'Emergency SOS',
    description: 'Bantuan darurat',
    icon: '🚨',
    route: '/emergency-sos',
    status: 'soon',
  },
  {
    id: 5,
    title: 'Health Reminder & Monitoring',
    description: 'Pengingat dan pencatatan kesehatan seluruh anggota keluarga',
    icon: '⏰',
    route: '/health-reminder',
    status: 'soon',
  },
];

// RUBRIK: Type & Array of Objects
export const PROFILE_INFO: InfoItem[] = [
  {
    id: 1,
    label: 'Email',
    value: 'user@carefam.test',
    icon: '📧',
  },
  {
    id: 2,
    label: 'Anggota keluarga',
    value: '3 orang',
    icon: '👥',
  },
  {
    id: 3,
    label: 'Status akun',
    value: 'Aktif',
    icon: '✅',
  },
];
