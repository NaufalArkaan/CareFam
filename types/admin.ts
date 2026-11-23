/**
 * Kontrak tipe untuk modul Administrator CareFam:
 * - Statistik Dashboard Admin
 * - User Management
 */

export interface AdminDashboardMetrics {
  totalUsers: number | null;
  totalFamilyMembers: number | null;
  totalFacilities: number | null;
  totalReports: number | null;
  isLoading: boolean;
  error: string | null;
}

export type UserRole = 'user' | 'admin';

export interface AdminUserProfile {
  id: string;
  callsign: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type UserFilterRole = 'all' | 'user' | 'admin';

export interface AdminUsersQueryOptions {
  search?: string;
  roleFilter?: UserFilterRole;
  page?: number;
  pageSize?: number;
}

export interface AdminUsersResult {
  users: AdminUserProfile[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
