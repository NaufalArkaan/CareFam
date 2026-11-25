import { supabase } from '../lib/supabase';
import {
  CreateHospitalParams,
  Hospital,
  HospitalQueryOptions,
  HospitalQueryResult,
  UpdateHospitalParams,
} from '../types/admin';

// Data fasilitas kesehatan awal untuk fallback jika tabel di Supabase belum dibuat
export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'f1a10001-0000-4000-a000-000000000001',
    name: 'RSUP Nasional Dr. Cipto Mangunkusumo',
    facility_type: 'Rumah Sakit',
    address: 'Jl. Diponegoro No. 71, Kenari, Senen',
    city: 'Jakarta Pusat',
    phone: '021-1500135',
    is_active: true,
    created_at: new Date('2026-01-10T08:00:00Z').toISOString(),
    updated_at: new Date('2026-01-10T08:00:00Z').toISOString(),
  },
  {
    id: 'f1a10002-0000-4000-a000-000000000002',
    name: 'RS Jantung dan Pembuluh Darah Harapan Kita',
    facility_type: 'Rumah Sakit',
    address: 'Jl. Letjen S. Parman Kav. 87, Slipi',
    city: 'Jakarta Barat',
    phone: '021-5684093',
    is_active: true,
    created_at: new Date('2026-01-12T09:30:00Z').toISOString(),
    updated_at: new Date('2026-01-12T09:30:00Z').toISOString(),
  },
  {
    id: 'f1a10003-0000-4000-a000-000000000003',
    name: 'RSUP Fatmawati',
    facility_type: 'Rumah Sakit',
    address: 'Jl. RS. Fatmawati Raya No. 4, Cilandak',
    city: 'Jakarta Selatan',
    phone: '021-7501524',
    is_active: true,
    created_at: new Date('2026-01-15T10:15:00Z').toISOString(),
    updated_at: new Date('2026-01-15T10:15:00Z').toISOString(),
  },
  {
    id: 'f1a10004-0000-4000-a000-000000000004',
    name: 'Klinik Pratama Sehat Keluarga',
    facility_type: 'Klinik',
    address: 'Jl. Tebet Barat Raya No. 12, Tebet',
    city: 'Jakarta Selatan',
    phone: '021-8312345',
    is_active: true,
    created_at: new Date('2026-01-20T11:00:00Z').toISOString(),
    updated_at: new Date('2026-01-20T11:00:00Z').toISOString(),
  },
  {
    id: 'f1a10005-0000-4000-a000-000000000005',
    name: 'Puskesmas Kecamatan Kebayoran Baru',
    facility_type: 'Puskesmas',
    address: 'Jl. Gandaria Tengah II No. 1, Kramat Pela',
    city: 'Jakarta Selatan',
    phone: '021-7243321',
    is_active: true,
    created_at: new Date('2026-01-25T14:20:00Z').toISOString(),
    updated_at: new Date('2026-01-25T14:20:00Z').toISOString(),
  },
];

// In-memory store untuk menjaga konsistensi state lokal saat fallback aktif
let localHospitalsStore: Hospital[] = [...INITIAL_HOSPITALS];

/**
 * Mengambil daftar fasilitas kesehatan dari tabel public.hospitals di Supabase.
 * Operasi: READ (List) dengan dukungan search, filter jenis faskes, dan pagination.
 */
export async function getHospitals(
  options: HospitalQueryOptions = {}
): Promise<HospitalQueryResult> {
  const {
    search = '',
    typeFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase
      .from('hospitals')
      .select('*', { count: 'exact' });

    // Filter Pencarian Nama / Alamat / Kota
    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(
        `name.ilike.%${cleanSearch}%,address.ilike.%${cleanSearch}%,city.ilike.%${cleanSearch}%`
      );
    }

    // Filter Jenis Fasilitas
    if (typeFilter && typeFilter !== 'all') {
      query = query.eq('facility_type', typeFilter);
    }

    // Urutan & Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order('is_active', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      // Jika tabel belum dibuat di Supabase (PGRST205), gunakan fallback lokal
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        console.warn(
          '[hospitalService] Tabel "hospitals" belum ditemukan di Supabase. Menggunakan local store fallback.'
        );
        return filterLocalHospitals(cleanSearch, typeFilter, page, pageSize);
      }
      throw error;
    }

    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      hospitals: (data as Hospital[]) || [],
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err: any) {
    console.warn('[hospitalService] Menggunakan local store fallback karena error:', err?.message);
    return filterLocalHospitals(search.trim(), typeFilter, page, pageSize);
  }
}

/**
 * Mengambil detail satu fasilitas kesehatan berdasarkan ID.
 * Operasi: READ (Single Item)
 */
export async function getHospitalById(id: string): Promise<Hospital | null> {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        const found = localHospitalsStore.find((h) => h.id === id);
        return found || null;
      }
      throw error;
    }

    return (data as Hospital) || null;
  } catch {
    const found = localHospitalsStore.find((h) => h.id === id);
    return found || null;
  }
}

/**
 * Menambahkan data fasilitas kesehatan baru ke Supabase.
 * Operasi: CREATE (.insert())
 */
export async function createHospital(
  params: CreateHospitalParams
): Promise<Hospital> {
  // Validasi input wajib
  if (!params.name.trim()) {
    throw new Error('Nama fasilitas kesehatan tidak boleh kosong.');
  }
  if (!params.address.trim()) {
    throw new Error('Alamat fasilitas kesehatan tidak boleh kosong.');
  }

  const payload = {
    name: params.name.trim(),
    facility_type: params.facility_type,
    address: params.address.trim(),
    city: params.city ? params.city.trim() : 'Jakarta',
    phone: params.phone ? params.phone.trim() : null,
    is_active: params.is_active ?? true,
  };

  try {
    const { data, error } = await supabase
      .from('hospitals')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        // Fallback simpan ke local store
        const newHospital: Hospital = {
          id: 'local-' + Date.now().toString(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localHospitalsStore = [newHospital, ...localHospitalsStore];
        return newHospital;
      }
      throw error;
    }

    // Sinkronkan juga ke local store
    if (data) {
      localHospitalsStore = [data as Hospital, ...localHospitalsStore];
    }

    return data as Hospital;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      const newHospital: Hospital = {
        id: 'local-' + Date.now().toString(),
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localHospitalsStore = [newHospital, ...localHospitalsStore];
      return newHospital;
    }
    throw err;
  }
}

/**
 * Memperbarui data fasilitas kesehatan di Supabase.
 * Operasi: UPDATE (.update().eq('id', id))
 */
export async function updateHospital(
  id: string,
  params: UpdateHospitalParams
): Promise<Hospital> {
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (params.name !== undefined) {
    if (!params.name.trim()) throw new Error('Nama fasilitas tidak boleh kosong.');
    updatePayload.name = params.name.trim();
  }
  if (params.facility_type !== undefined) {
    updatePayload.facility_type = params.facility_type;
  }
  if (params.address !== undefined) {
    if (!params.address.trim()) throw new Error('Alamat tidak boleh kosong.');
    updatePayload.address = params.address.trim();
  }
  if (params.city !== undefined) {
    updatePayload.city = params.city ? params.city.trim() : null;
  }
  if (params.phone !== undefined) {
    updatePayload.phone = params.phone ? params.phone.trim() : null;
  }
  if (params.is_active !== undefined) {
    updatePayload.is_active = params.is_active;
  }

  try {
    const { data, error } = await supabase
      .from('hospitals')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localHospitalsStore = localHospitalsStore.map((h) =>
          h.id === id ? { ...h, ...updatePayload } : h
        );
        const updated = localHospitalsStore.find((h) => h.id === id);
        if (!updated) throw new Error('Data fasilitas kesehatan tidak ditemukan.');
        return updated;
      }
      throw error;
    }

    // Sinkronkan ke local store
    localHospitalsStore = localHospitalsStore.map((h) =>
      h.id === id ? (data as Hospital) : h
    );

    return data as Hospital;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localHospitalsStore = localHospitalsStore.map((h) =>
        h.id === id ? { ...h, ...updatePayload } : h
      );
      const updated = localHospitalsStore.find((h) => h.id === id);
      if (!updated) throw new Error('Data fasilitas kesehatan tidak ditemukan.');
      return updated;
    }
    throw err;
  }
}

/**
 * Menghapus data fasilitas kesehatan dari Supabase.
 * Operasi: DELETE (.delete().eq('id', id))
 */
export async function deleteHospital(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localHospitalsStore = localHospitalsStore.filter((h) => h.id !== id);
        return;
      }
      throw error;
    }

    localHospitalsStore = localHospitalsStore.filter((h) => h.id !== id);
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localHospitalsStore = localHospitalsStore.filter((h) => h.id !== id);
      return;
    }
    throw err;
  }
}

/**
 * Helper fungsi penyaringan lokal untuk fallback
 */
function filterLocalHospitals(
  search: string,
  typeFilter: string,
  page: number,
  pageSize: number
): HospitalQueryResult {
  let filtered = [...localHospitalsStore];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.address.toLowerCase().includes(lower) ||
        (h.city && h.city.toLowerCase().includes(lower))
    );
  }

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter((h) => h.facility_type === typeFilter);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const offset = (page - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    hospitals: paginated,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Menghitung total data fasilitas kesehatan aktual dari tabel hospitals di Supabase.
 * Digunakan untuk metrik kartu statistik pada Dashboard Admin.
 */
export async function getTotalHospitalsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        return localHospitalsStore.length;
      }
      return localHospitalsStore.length;
    }

    return count ?? localHospitalsStore.length;
  } catch {
    return localHospitalsStore.length;
  }
}

