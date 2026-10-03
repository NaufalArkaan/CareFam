// RUBRIK: Type & Array of Objects

// ===== Role & Akun =====
export type UserRole = 'user' | 'admin';

export interface DemoAccount {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// ===== Konten Halaman Login =====
export interface LoginContent {
  id: number;
  role: UserRole;
  title: string;
  subtitle: string;
  buttonLabel: string;
  accentColor: string;   // hex, dipakai sebagai inline style tombol
  altLabel: string;      // teks tautan ke login role lain
  altRoute: string;      // path tautan tersebut
}

// ===== Kartu Layanan / Menu =====
export type FeatureStatus = 'active' | 'soon';

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;          // emoji
  route: string;         // RENCANA rute modul berikutnya (belum dibuat)
  status: FeatureStatus; // Modul 1: semua 'soon'
}

// ===== Info & Statistik =====
export interface InfoItem {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface AdminStat {
  id: number;
  label: string;
  value: number;
  icon: string;
  color: string;         // hex aksen, dipakai sebagai inline style
}
