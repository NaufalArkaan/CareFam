import { supabase } from '../lib/supabase';
import {
  SOSEmergencyType,
  SOSQueryOptions,
  SOSQueryResult,
  SOSRequest,
  SOSStatus,
  SOSStatusSummary,
  UpdateSOSStatusParams,
} from '../types/admin';

// Data permintaan bantuan darurat awal untuk pengujian jika tabel Supabase belum dibuat
export const INITIAL_SOS_REQUESTS: SOSRequest[] = [
  {
    id: 'sos-0001-0000-4000-a000-000000000001',
    user_id: null,
    caller_name: 'Aditya Kusuma',
    phone_number: '0817-4455-6677',
    family_member_name: 'Maya Indrawati (Istri)',
    emergency_type: 'medis',
    notes: 'Pasien mengeluhkan nyeri dada akut menjalar ke lengan kiri dan sesak napas berat mendadak.',
    latitude: -6.2087634,
    longitude: 106.8455990,
    location_address: 'Jl. Tebet Barat Dalam Raya No. 42, RT.03/RW.02, Tebet, Jakarta Selatan',
    status: 'active',
    responder_notes: null,
    dispatched_facility: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'sos-0002-0000-4000-a000-000000000002',
    user_id: null,
    caller_name: 'Rudi Hermawan',
    phone_number: '0812-8877-6655',
    family_member_name: 'Kakek Sastro (Lansia, 78 th)',
    emergency_type: 'lansia',
    notes: 'Lansia terjatuh di kamar mandi, terdapat dislokasi sendi pinggul dan tidak sadarkan diri sementara.',
    latitude: -6.1751100,
    longitude: 106.8650395,
    location_address: 'Jl. Cempaka Putih Tengah XXX No. 15, Cempaka Putih, Jakarta Pusat',
    status: 'responding',
    responder_notes: 'Ambulans Gawat Darurat RS Islam Cempaka Putih telah diberangkatkan bersama tim paramedis (ETA 7 menit).',
    dispatched_facility: 'RS Islam Jakarta Cempaka Putih',
    resolved_at: null,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'sos-0003-0000-4000-a000-000000000003',
    user_id: null,
    caller_name: 'Farhan Maulana',
    phone_number: '0856-7788-9900',
    family_member_name: 'Farhan Maulana',
    emergency_type: 'kecelakaan',
    notes: 'Kecelakaan tunggal sepeda motor, luka robek di lutut kanan dan fraktur pergelangan tangan.',
    latitude: -6.2297465,
    longitude: 106.8295180,
    location_address: 'Dekat Halte Busway Patra Kuningan, Jl. Gatot Subroto Kav. 36, Jakarta Selatan',
    status: 'resolved',
    responder_notes: 'Pasien telah dievakuasi ke IGD RS Siloam Semanggi. Tindakan bedah reposisi fraktur selesai dilakukan.',
    dispatched_facility: 'RS Siloam Semanggi',
    resolved_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sos-0004-0000-4000-a000-000000000004',
    user_id: null,
    caller_name: 'Anisa Rahma',
    phone_number: '0813-2233-4455',
    family_member_name: 'Anak Daffa (5 th)',
    emergency_type: 'anak',
    notes: 'Demam tinggi 40.2°C disertai kejang demam (step) selama 2 menit.',
    latitude: -6.9174639,
    longitude: 107.6191228,
    location_address: 'Jl. Riau No. 88, Citarum, Bandung Wetan, Kota Bandung',
    status: 'resolved',
    responder_notes: 'Pasien telah diberikan antipiretik dan antikonvulsan di IGD RS Limijati. Kondisi stabil dan diobservasi.',
    dispatched_facility: 'RSIA Limijati Bandung',
    resolved_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sos-0005-0000-4000-a000-000000000005',
    user_id: null,
    caller_name: 'Dimas Prasetyo',
    phone_number: '0878-1122-3344',
    family_member_name: 'Dimas Prasetyo',
    emergency_type: 'lainnya',
    notes: 'Alarm kepencet secara tidak sengaja saat menguji fitur aplikasi.',
    latitude: -6.2891234,
    longitude: 106.7981234,
    location_address: 'Jl. Fatmawati Raya No. 12, Cilandak, Jakarta Selatan',
    status: 'cancelled',
    responder_notes: 'Dikonfirmasi via telepon bahwa pengguna tidak sengaja menekan tombol SOS dalam kondisi aman.',
    dispatched_facility: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
  },
];

// In-memory store untuk menjaga konsistensi state lokal jika fallback aktif
let localSOSStore: SOSRequest[] = [...INITIAL_SOS_REQUESTS];

/**
 * Mengambil daftar permintaan SOS dari tabel public.sos_requests di Supabase.
 * Mendukung pencarian, filter kategori darurat, filter status penanganan, dan pagination.
 */
export async function getAdminSOSRequests(
  options: SOSQueryOptions = {}
): Promise<SOSQueryResult> {
  const {
    search = '',
    typeFilter = 'all',
    statusFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase.from('sos_requests').select('*', { count: 'exact' });

    // Filter Pencarian (Nama Pemanggil, Pasien, No HP, Lokasi, Catatan)
    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(
        `caller_name.ilike.%${cleanSearch}%,phone_number.ilike.%${cleanSearch}%,family_member_name.ilike.%${cleanSearch}%,location_address.ilike.%${cleanSearch}%,notes.ilike.%${cleanSearch}%,dispatched_facility.ilike.%${cleanSearch}%`
      );
    }

    // Filter Kategori Darurat
    if (typeFilter && typeFilter !== 'all') {
      query = query.eq('emergency_type', typeFilter);
    }

    // Filter Status Darurat
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Urutan: terbaru di paling atas
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        console.warn(
          '[sosService] Tabel "sos_requests" belum dibuat di Supabase. Menggunakan fallback lokal.'
        );
        return filterLocalSOS(cleanSearch, typeFilter, statusFilter, page, pageSize);
      }
      throw error;
    }

    const summary = await getSOSStatusSummary();
    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      requests: (data as SOSRequest[]) || [],
      totalCount,
      page,
      pageSize,
      totalPages,
      summary,
    };
  } catch (err: any) {
    console.warn('[sosService] Error query Supabase, fallback aktif:', err?.message);
    return filterLocalSOS(search.trim(), typeFilter, statusFilter, page, pageSize);
  }
}

/**
 * Mengambil detail satu permintaan SOS berdasarkan ID.
 */
export async function getSOSRequestById(id: string): Promise<SOSRequest | null> {
  try {
    const { data, error } = await supabase
      .from('sos_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        const found = localSOSStore.find((r) => r.id === id);
        return found || null;
      }
      throw error;
    }

    return (data as SOSRequest) || null;
  } catch {
    const found = localSOSStore.find((r) => r.id === id);
    return found || null;
  }
}

/**
 * Memperbarui status penanganan darurat SOS dan catatan responder di Supabase.
 * Operasi: UPDATE
 */
export async function updateSOSStatus(
  id: string,
  params: UpdateSOSStatusParams
): Promise<SOSRequest> {
  const updatePayload: Record<string, any> = {
    status: params.status,
    responder_notes: params.responder_notes !== undefined ? params.responder_notes : null,
    dispatched_facility: params.dispatched_facility !== undefined ? params.dispatched_facility : null,
    updated_at: new Date().toISOString(),
  };

  if (params.status === 'resolved') {
    updatePayload.resolved_at = new Date().toISOString();
  } else {
    updatePayload.resolved_at = null;
  }

  try {
    const { data, error } = await supabase
      .from('sos_requests')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localSOSStore = localSOSStore.map((r) =>
          r.id === id ? { ...r, ...updatePayload } : r
        );
        const updated = localSOSStore.find((r) => r.id === id);
        if (!updated) throw new Error('Data SOS tidak ditemukan.');
        return updated;
      }
      throw error;
    }

    localSOSStore = localSOSStore.map((r) =>
      r.id === id ? (data as SOSRequest) : r
    );

    return data as SOSRequest;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localSOSStore = localSOSStore.map((r) =>
        r.id === id ? { ...r, ...updatePayload } : r
      );
      const updated = localSOSStore.find((r) => r.id === id);
      if (!updated) throw new Error('Data SOS tidak ditemukan.');
      return updated;
    }
    throw err;
  }
}

/**
 * Menghitung total permintaan SOS masuk untuk statistik dashboard.
 */
export async function getTotalSOSCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('sos_requests')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        return localSOSStore.length;
      }
      return localSOSStore.length;
    }

    return count ?? localSOSStore.length;
  } catch {
    return localSOSStore.length;
  }
}

/**
 * Helper untuk menghitung rekap status SOS
 */
async function getSOSStatusSummary(): Promise<SOSStatusSummary> {
  try {
    const { data, error } = await supabase.from('sos_requests').select('status');
    if (error || !data) {
      return computeLocalSOSSummary();
    }

    let active = 0;
    let responding = 0;
    let resolved = 0;
    let cancelled = 0;

    data.forEach((r: { status: string }) => {
      if (r.status === 'active') active++;
      else if (r.status === 'responding') responding++;
      else if (r.status === 'resolved') resolved++;
      else if (r.status === 'cancelled') cancelled++;
    });

    return {
      total: data.length,
      active,
      responding,
      resolved,
      cancelled,
    };
  } catch {
    return computeLocalSOSSummary();
  }
}

function computeLocalSOSSummary(): SOSStatusSummary {
  let active = 0;
  let responding = 0;
  let resolved = 0;
  let cancelled = 0;

  localSOSStore.forEach((r) => {
    if (r.status === 'active') active++;
    else if (r.status === 'responding') responding++;
    else if (r.status === 'resolved') resolved++;
    else if (r.status === 'cancelled') cancelled++;
  });

  return {
    total: localSOSStore.length,
    active,
    responding,
    resolved,
    cancelled,
  };
}

/**
 * Filter lokal untuk fallback
 */
function filterLocalSOS(
  search: string,
  typeFilter: string,
  statusFilter: string,
  page: number,
  pageSize: number
): SOSQueryResult {
  let filtered = [...localSOSStore];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.caller_name.toLowerCase().includes(lower) ||
        r.phone_number.toLowerCase().includes(lower) ||
        (r.family_member_name && r.family_member_name.toLowerCase().includes(lower)) ||
        (r.location_address && r.location_address.toLowerCase().includes(lower)) ||
        (r.notes && r.notes.toLowerCase().includes(lower)) ||
        (r.dispatched_facility && r.dispatched_facility.toLowerCase().includes(lower))
    );
  }

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter((r) => r.emergency_type === typeFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const offset = (page - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    requests: paginated,
    totalCount,
    page,
    pageSize,
    totalPages,
    summary: computeLocalSOSSummary(),
  };
}
