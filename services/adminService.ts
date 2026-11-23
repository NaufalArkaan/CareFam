import { supabase } from '../lib/supabase';
import {
  AdminDashboardMetrics,
  AdminUserProfile,
  AdminUsersQueryOptions,
  AdminUsersResult,
} from '../types/admin';

/**
 * Mengambil metrik kuantitatif aktual untuk Dashboard Admin dari database Supabase.
 * - Total Pengguna: Menghitung baris profiles dengan role = 'user' (mengecualikan admin).
 * - Anggota Keluarga: Menghitung seluruh anggota keluarga di tabel family_members.
 * - Fasilitas Kesehatan: null (karena tabel master fasilitas kesehatan belum dibuat di database).
 * - Laporan Masuk: null (karena tabel laporan/pengaduan belum dibuat di database).
 */
export async function getAdminDashboardStats(): Promise<Omit<AdminDashboardMetrics, 'isLoading' | 'error'>> {
  try {
    // 1. Query count akun pengguna biasa (mengecualikan admin)
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user');

    if (usersError) {
      console.error('[adminService] Gagal menghitung total pengguna:', usersError.message);
    }

    // 2. Query count seluruh anggota keluarga
    const { count: familyCount, error: familyError } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true });

    if (familyError) {
      console.error('[adminService] Gagal menghitung anggota keluarga:', familyError.message);
    }

    // 3. Fasilitas Kesehatan & Laporan Masuk:
    // Sesuai ketentuan, karena tabel belum tersedia di database,
    // nilai diatur ke null agar UI menampilkan indikator belum tersedia '—' (bukan angka 0).
    return {
      totalUsers: usersCount ?? null,
      totalFamilyMembers: familyCount ?? null,
      totalFacilities: null,
      totalReports: null,
    };
  } catch (err) {
    console.error('[adminService] Kesalahan tak terduga saat mengambil statistik admin:', err);
    return {
      totalUsers: null,
      totalFamilyMembers: null,
      totalFacilities: null,
      totalReports: null,
    };
  }
}

/**
 * Mengambil daftar pengguna dari tabel public.profiles untuk User Management.
 * Mendukung pencarian nama, filter peran, dan pagination yang efisien.
 */
export async function getAdminUsers(
  options: AdminUsersQueryOptions = {}
): Promise<AdminUsersResult> {
  const {
    search = '',
    roleFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Filter berdasarkan role jika ditentukan
    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    // Pencarian berdasarkan callsign atau full_name
    const trimmedSearch = search.trim();
    if (trimmedSearch !== '') {
      query = query.or(`callsign.ilike.%${trimmedSearch}%,full_name.ilike.%${trimmedSearch}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      users: (data as AdminUserProfile[]) || [],
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err) {
    console.error('[adminService] Gagal mengambil daftar pengguna:', err);
    throw err;
  }
}

/**
 * Mengambil rincian data profil pengguna tertentu berdasarkan ID akun.
 */
export async function getAdminUserDetail(
  userId: string
): Promise<AdminUserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return (data as AdminUserProfile) || null;
  } catch (err) {
    console.error('[adminService] Gagal mengambil detail pengguna:', err);
    throw err;
  }
}
