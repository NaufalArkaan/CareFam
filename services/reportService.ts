import { supabase } from '../lib/supabase';
import {
  ReportQueryOptions,
  ReportQueryResult,
  ReportStatus,
  ReportStatusSummary,
  ReportType,
  UpdateReportStatusParams,
  UserReport,
} from '../types/admin';

// Data laporan awal untuk pengujian jika tabel di Supabase belum dibuat
export const INITIAL_REPORTS: UserReport[] = [
  {
    id: 'rep-0001-0000-4000-a000-000000000001',
    reporter_id: null,
    reporter_name: 'Aditya Kusuma',
    reporter_email: 'aditya.kusuma@carefam.test',
    report_type: 'data_issue',
    title: 'Ketidaksesuaian Tanggal Lahir pada Profil Anggota Keluarga',
    description:
      'Saya mendapati tanggal lahir anak saya (Rizky Kusuma) tercatat tidak sesuai setelah sinkronisasi data rekam medis faskes. Mohon bantuan koreksi menjadi 2018-06-12.',
    attachment_url: null,
    status: 'pending',
    admin_notes: null,
    handled_by: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rep-0002-0000-4000-a000-000000000002',
    reporter_id: null,
    reporter_name: 'Siti Nurhaliza',
    reporter_email: 'siti.nurhaliza@carefam.test',
    report_type: 'abuse',
    title: 'Indikasi Akses Tidak Dikenal pada Akun Saya',
    description:
      'Terdapat riwayat login dari perangkat tidak dikenal pada pukul 02:15 WIB. Mohon verifikasi keamanan sesi dan reset autentikasi perangkat jika terbukti ada percobaan peretasan.',
    attachment_url: null,
    status: 'in_progress',
    admin_notes:
      'Sedang dilakukan audit log login IP oleh tim keamanan CareFam. Sesi aktif telah dipantau dan email verifikasi 2FA dikirim ke pengguna.',
    handled_by: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rep-0003-0000-4000-a000-000000000003',
    reporter_id: null,
    reporter_name: 'Maya Indrawati',
    reporter_email: 'maya.indrawati@carefam.test',
    report_type: 'complaint',
    title: 'Klinik Pratama Sehat Selalu Tidak Dapat Dihubungi via Aplikasi',
    description:
      'Nomor darurat dan tombol telepon untuk Klinik Pratama Sehat Selalu yang tertera di menu Hospital Management mengalami nada sibuk terus-menerus. Mohon diperbarui kontak faskes yang valid.',
    attachment_url: null,
    status: 'resolved',
    admin_notes:
      'Kontak faskes telah dikonfirmasi langsung dengan pihak klinik dan diperbarui dengan nomor hotline 24 jam baru (0812-9988-7766).',
    handled_by: null,
    resolved_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rep-0004-0000-4000-a000-000000000004',
    reporter_id: null,
    reporter_name: 'Bambang Pamungkas',
    reporter_email: 'bambang.p@carefam.test',
    report_type: 'complaint',
    title: 'Kendala Unggah Dokumen PDF Rekam Medis Lebih dari 5MB',
    description:
      'Ketika mengunggah berkas hasil rontgen dada berukuran 6.2 MB, aplikasi memunculkan pesan gagal unggah tanpa rincian batas maksimal berkas yang diizinkan sistem.',
    attachment_url: null,
    status: 'pending',
    admin_notes: null,
    handled_by: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rep-0005-0000-4000-a000-000000000005',
    reporter_id: null,
    reporter_name: 'Dewi Lestari',
    reporter_email: 'dewi.lestari@carefam.test',
    report_type: 'other',
    title: 'Usulan Penambahan Kategori Edukasi Vaksinasi Dewasa',
    description:
      'Saya mengusulkan agar menu Health Education dan Rekam Medis menambahkan panduan imunisasi / vaksinasi HPV dan Influenza untuk orang dewasa dan lansia.',
    attachment_url: null,
    status: 'resolved',
    admin_notes:
      'Usulan telah diteruskan ke tim redaksi medis untuk diagendakan dalam artikel edukasi edisi mendatang.',
    handled_by: null,
    resolved_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

// In-memory store untuk menjaga konsistensi state lokal jika fallback aktif
let localReportsStore: UserReport[] = [...INITIAL_REPORTS];

/**
 * Mengambil daftar laporan dari tabel public.reports di Supabase.
 * Mendukung pencarian, filter kategori tipe laporan, filter status, dan pagination.
 */
export async function getAdminReports(
  options: ReportQueryOptions = {}
): Promise<ReportQueryResult> {
  const {
    search = '',
    typeFilter = 'all',
    statusFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase.from('reports').select('*', { count: 'exact' });

    // Filter Pencarian (Judul, Deskripsi, Nama Pelapor, atau Email)
    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(
        `title.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%,reporter_name.ilike.%${cleanSearch}%,reporter_email.ilike.%${cleanSearch}%`
      );
    }

    // Filter Tipe Laporan
    if (typeFilter && typeFilter !== 'all') {
      query = query.eq('report_type', typeFilter);
    }

    // Filter Status Laporan
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Urutan & Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        console.warn(
          '[reportService] Tabel "reports" belum dibuat di Supabase. Menggunakan fallback lokal.'
        );
        return filterLocalReports(cleanSearch, typeFilter, statusFilter, page, pageSize);
      }
      throw error;
    }

    // Ambil rekap ringkasan status dari database
    const summary = await getReportStatusSummary();

    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      reports: (data as UserReport[]) || [],
      totalCount,
      page,
      pageSize,
      totalPages,
      summary,
    };
  } catch (err: any) {
    console.warn('[reportService] Error query Supabase, fallback aktif:', err?.message);
    return filterLocalReports(search.trim(), typeFilter, statusFilter, page, pageSize);
  }
}

/**
 * Mengambil detail satu laporan berdasarkan ID.
 */
export async function getReportById(id: string): Promise<UserReport | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        const found = localReportsStore.find((r) => r.id === id);
        return found || null;
      }
      throw error;
    }

    return (data as UserReport) || null;
  } catch {
    const found = localReportsStore.find((r) => r.id === id);
    return found || null;
  }
}

/**
 * Memperbarui status laporan dan catatan penanganan admin di Supabase.
 * Operasi: UPDATE
 */
export async function updateReportStatus(
  id: string,
  params: UpdateReportStatusParams
): Promise<UserReport> {
  const updatePayload: Record<string, any> = {
    status: params.status,
    admin_notes: params.admin_notes !== undefined ? params.admin_notes : null,
    updated_at: new Date().toISOString(),
  };

  if (params.status === 'resolved') {
    updatePayload.resolved_at = new Date().toISOString();
  } else {
    updatePayload.resolved_at = null;
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localReportsStore = localReportsStore.map((r) =>
          r.id === id ? { ...r, ...updatePayload } : r
        );
        const updated = localReportsStore.find((r) => r.id === id);
        if (!updated) throw new Error('Laporan tidak ditemukan.');
        return updated;
      }
      throw error;
    }

    localReportsStore = localReportsStore.map((r) =>
      r.id === id ? (data as UserReport) : r
    );

    return data as UserReport;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localReportsStore = localReportsStore.map((r) =>
        r.id === id ? { ...r, ...updatePayload } : r
      );
      const updated = localReportsStore.find((r) => r.id === id);
      if (!updated) throw new Error('Laporan tidak ditemukan.');
      return updated;
    }
    throw err;
  }
}

/**
 * Menghitung total laporan masuk aktual untuk statistik dashboard.
 */
export async function getTotalReportsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        return localReportsStore.length;
      }
      return localReportsStore.length;
    }

    return count ?? localReportsStore.length;
  } catch {
    return localReportsStore.length;
  }
}

/**
 * Helper untuk menghitung jumlah laporan per status
 */
async function getReportStatusSummary(): Promise<ReportStatusSummary> {
  try {
    const { data, error } = await supabase.from('reports').select('status');
    if (error || !data) {
      return computeLocalSummary();
    }

    let pending = 0;
    let in_progress = 0;
    let resolved = 0;
    let rejected = 0;

    data.forEach((r: { status: string }) => {
      if (r.status === 'pending') pending++;
      else if (r.status === 'in_progress') in_progress++;
      else if (r.status === 'resolved') resolved++;
      else if (r.status === 'rejected') rejected++;
    });

    return {
      total: data.length,
      pending,
      in_progress,
      resolved,
      rejected,
    };
  } catch {
    return computeLocalSummary();
  }
}

function computeLocalSummary(): ReportStatusSummary {
  let pending = 0;
  let in_progress = 0;
  let resolved = 0;
  let rejected = 0;

  localReportsStore.forEach((r) => {
    if (r.status === 'pending') pending++;
    else if (r.status === 'in_progress') in_progress++;
    else if (r.status === 'resolved') resolved++;
    else if (r.status === 'rejected') rejected++;
  });

  return {
    total: localReportsStore.length,
    pending,
    in_progress,
    resolved,
    rejected,
  };
}

/**
 * Filter lokal untuk fallback
 */
function filterLocalReports(
  search: string,
  typeFilter: string,
  statusFilter: string,
  page: number,
  pageSize: number
): ReportQueryResult {
  let filtered = [...localReportsStore];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower) ||
        r.reporter_name.toLowerCase().includes(lower) ||
        (r.reporter_email && r.reporter_email.toLowerCase().includes(lower))
    );
  }

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter((r) => r.report_type === typeFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const offset = (page - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    reports: paginated,
    totalCount,
    page,
    pageSize,
    totalPages,
    summary: computeLocalSummary(),
  };
}
