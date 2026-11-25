import { supabase } from '../lib/supabase';
import { FamilyMember } from '../types';

export interface DbFamilyMember {
  id: string;
  family_id: string;
  user_id: string | null;
  name: string;
  birth_date: string;
  gender: string | null;
  relationship: string;
  blood_type: string | null;
  emergency_contact: string | null;
  allergies: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDashboardData {
  email: string;
  callsign: string;
  fullName: string;
  memberCount: number;
  isLoading: boolean;
}

/**
 * Mengambil data profil dan statistik pengguna aktif untuk Dashboard User
 */
export async function getUserDashboardData(): Promise<UserDashboardData> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        email: 'user@carefam.test',
        callsign: 'Pengguna',
        fullName: 'Pengguna CareFam',
        memberCount: 0,
        isLoading: false,
      };
    }

    // Ambil data profil dari public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('callsign, full_name')
      .eq('id', user.id)
      .maybeSingle();

    // Hitung anggota keluarga yang dapat diakses oleh pengguna ini
    const { count } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true });

    const callsign =
      profile?.callsign ||
      user.user_metadata?.callsign ||
      (user.email ? user.email.split('@')[0] : 'Keluarga');
    const fullName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      callsign;

    return {
      email: user.email || 'user@carefam.test',
      callsign,
      fullName,
      memberCount: count ?? 0,
      isLoading: false,
    };
  } catch (error) {
    console.warn('[familyService] Gagal mengambil data user dashboard:', error);
    return {
      email: 'user@carefam.test',
      callsign: 'Pengguna',
      fullName: 'Pengguna CareFam',
      memberCount: 0,
      isLoading: false,
    };
  }
}

/**
 * Mengambil daftar anggota keluarga aktual dari Supabase
 */
export async function getFamilyMembers(): Promise<FamilyMember[]> {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .order('birth_date', { ascending: true });

    if (error) {
      console.warn('[familyService] Gagal memuat anggota keluarga:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item: DbFamilyMember) => ({
      id: item.id,
      name: item.name,
      birthDate: item.birth_date,
      relationship: item.relationship,
      emergencyContact: item.emergency_contact || undefined,
      gender: item.gender || undefined,
      bloodType: item.blood_type || undefined,
      allergies: item.allergies || undefined,
    }));
  } catch (err) {
    console.error('[familyService] Kesalahan tak terduga:', err);
    return [];
  }
}

/**
 * Mengambil rincian detail 1 anggota keluarga berdasarkan ID dari Supabase
 */
export async function getFamilyMemberDetail(id: string): Promise<FamilyMember | null> {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      birthDate: data.birth_date,
      relationship: data.relationship,
      emergencyContact: data.emergency_contact || undefined,
      gender: data.gender || undefined,
      bloodType: data.blood_type || undefined,
      allergies: data.allergies || undefined,
    };
  } catch (err) {
    console.error('[familyService] Gagal memuat detail anggota:', err);
    return null;
  }
}

/**
 * Menyimpan anggota keluarga baru ke database Supabase
 */
export async function addFamilyMemberToDatabase(params: {
  name: string;
  birthDate: string;
  relationship: string;
  emergencyContact?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string;
}): Promise<FamilyMember> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi autentikasi tidak ditemukan. Silakan login kembali.');
  }

  // 1. Cari atau dapatkan family_id milik pengguna
  let { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('created_by', user.id)
    .maybeSingle();

  // 2. Jika belum punya unit keluarga, buatkan otomatis
  if (!family) {
    const defaultFamilyName = `Keluarga ${params.name.split(' ')[0] || 'Saya'}`;
    const { data: newFamily, error: famError } = await supabase
      .from('families')
      .insert({
        family_name: defaultFamilyName,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (famError) throw famError;
    family = newFamily;
  }

  // 3. Masukkan data anggota keluarga
  const { data: newMember, error } = await supabase
    .from('family_members')
    .insert({
      family_id: family.id,
      name: params.name.trim(),
      birth_date: params.birthDate.trim(),
      relationship: params.relationship.trim(),
      emergency_contact: params.emergencyContact?.trim() || null,
      gender: params.gender || null,
      blood_type: params.bloodType || null,
      allergies: params.allergies?.trim() || null,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return {
    id: newMember.id,
    name: newMember.name,
    birthDate: newMember.birth_date,
    relationship: newMember.relationship,
    emergencyContact: newMember.emergency_contact || undefined,
    gender: newMember.gender || undefined,
    bloodType: newMember.blood_type || undefined,
    allergies: newMember.allergies || undefined,
  };
}

/**
 * Memperbarui data anggota keluarga di Supabase berdasarkan ID
 * Operasi: UPDATE menggunakan .update().eq('id', id)
 */
export async function updateFamilyMember(
  id: string,
  params: {
    name: string;
    birthDate?: string;
    relationship: string;
    emergencyContact?: string;
    gender?: string;
    bloodType?: string;
    allergies?: string;
  }
): Promise<FamilyMember> {
  const updatePayload: Record<string, any> = {
    name: params.name.trim(),
    relationship: params.relationship.trim(),
    updated_at: new Date().toISOString(),
  };

  if (params.birthDate !== undefined) {
    updatePayload.birth_date = params.birthDate.trim();
  }
  if (params.emergencyContact !== undefined) {
    updatePayload.emergency_contact = params.emergencyContact?.trim() || null;
  }
  if (params.gender !== undefined) {
    updatePayload.gender = params.gender || null;
  }
  if (params.bloodType !== undefined) {
    updatePayload.blood_type = params.bloodType || null;
  }
  if (params.allergies !== undefined) {
    updatePayload.allergies = params.allergies?.trim() || null;
  }

  const { data, error } = await supabase
    .from('family_members')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error(`[familyService] Gagal memperbarui anggota keluarga (id: ${id}):`, error.message);
    throw error;
  }

  if (!data) {
    throw new Error('Data anggota keluarga tidak ditemukan.');
  }

  return {
    id: data.id,
    name: data.name,
    birthDate: data.birth_date,
    relationship: data.relationship,
    emergencyContact: data.emergency_contact || undefined,
    gender: data.gender || undefined,
    bloodType: data.blood_type || undefined,
    allergies: data.allergies || undefined,
  };
}

/**
 * Menghapus anggota keluarga dari Supabase berdasarkan ID
 * Operasi: DELETE menggunakan .delete().eq('id', id)
 */
export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[familyService] Gagal menghapus anggota keluarga (id: ${id}):`, error.message);
    throw error;
  }
}

