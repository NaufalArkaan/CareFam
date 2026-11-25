import { supabase } from '../lib/supabase';
import {
  ArticleStatus,
  CreateArticleParams,
  EducationCategory,
  EducationQueryOptions,
  EducationQueryResult,
  HealthEducationArticle,
  UpdateArticleParams,
} from '../types/admin';

// Data artikel edukasi awal untuk fallback jika tabel di Supabase belum dibuat
export const INITIAL_ARTICLES: HealthEducationArticle[] = [
  {
    id: 'e1a10001-0000-4000-a000-000000000001',
    title: 'Panduan Pola Makan Bergizi Seimbang untuk Keluarga',
    category: 'Nutrisi',
    summary:
      'Pelajari prinsip piring makan sehat, pembagian porsi karbohidrat kompleks, protein, serat sayuran, serta kebutuhan hidrasi harian.',
    content:
      'Pola makan bergizi seimbang merupakan fondasi utama imunitas tubuh keluarga. Pastikan setengah piring diisi sayur dan buah, seperempat piring karbohidrat kompleks, dan seperempat piring protein berkualitas. Batasi konsumsi gula, garam, dan lemak jenuh.',
    image_url: null,
    author_name: 'dr. Siti Rahma, Sp.GK',
    status: 'published',
    published_at: new Date('2026-02-01T08:00:00Z').toISOString(),
    created_at: new Date('2026-02-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-02-01T08:00:00Z').toISOString(),
  },
  {
    id: 'e1a10002-0000-4000-a000-000000000002',
    title: 'Jadwal dan Pentingnya Imunisasi Dasar Lengkap pada Anak',
    category: 'Kesehatan Anak',
    summary:
      'Rangkuman jadwal imunisasi wajib mulai dari Hepatitis B, BCG, Polio, DPT-HB-Hib, hingga Campak-Rubella untuk melindungi tumbuh kembang buah hati.',
    content:
      'Imunisasi dasar lengkap membentuk kekebalan kelompok (herd immunity) dan melindungi anak dari komplikasi penyakit menular berbahaya. Selalu catat tanggal imunisasi pada buku KIA dan konsultasikan dengan dokter anak jika jadwal terlambat.',
    image_url: null,
    author_name: 'dr. Budi Santoso, Sp.A',
    status: 'published',
    published_at: new Date('2026-02-05T09:30:00Z').toISOString(),
    created_at: new Date('2026-02-05T09:30:00Z').toISOString(),
    updated_at: new Date('2026-02-05T09:30:00Z').toISOString(),
  },
  {
    id: 'e1a10003-0000-4000-a000-000000000003',
    title: 'Menjaga Kebugaran Fisik dan Kualitas Tidur Lansia',
    category: 'Lansia',
    summary:
      'Aktivitas fisik intensitas sedang seperti jalan pagi dan senam pernapasan membantu mempertahankan massa otot serta fungsi kognitif lansia.',
    content:
      'Seiring bertambahnya usia, menjaga kekuatan otot dan fleksibilitas sendi menjadi sangat krusial untuk mencegah risiko jatuh. Lakukan jalan santai 30 menit setiap hari dan ciptakan rutinitas tidur yang tenang.',
    image_url: null,
    author_name: 'dr. Hendro Wijaya, Sp.PD',
    status: 'published',
    published_at: new Date('2026-02-10T10:15:00Z').toISOString(),
    created_at: new Date('2026-02-10T10:15:00Z').toISOString(),
    updated_at: new Date('2026-02-10T10:15:00Z').toISOString(),
  },
  {
    id: 'e1a10004-0000-4000-a000-000000000004',
    title: 'Mengenal Gejala Dini Hipertensi dan Langkah Pencegahannya',
    category: 'Penyakit Kronis',
    summary:
      'Hipertensi sering dijuluki the silent killer. Kenali batas aman tekanan darah dan cara pemantauan berkala menggunakan tensimeter digital di rumah.',
    content:
      'Tekanan darah normal berada pada rentang sistolik di bawah 120 mmHg dan diastolik di bawah 80 mmHg. Rutin mencatat hasil pengukuran pada aplikasi CareFam membantu dokter mengevaluasi efektivitas terapi obat antihipertensi.',
    image_url: null,
    author_name: 'dr. Rahmat Siregar, Sp.JP',
    status: 'published',
    published_at: new Date('2026-02-15T11:00:00Z').toISOString(),
    created_at: new Date('2026-02-15T11:00:00Z').toISOString(),
    updated_at: new Date('2026-02-15T11:00:00Z').toISOString(),
  },
  {
    id: 'e1a10005-0000-4000-a000-000000000005',
    title: 'Rencana Strategis Penanganan Gejala Flu Musiman di Rumah',
    category: 'Umum',
    summary:
      'Draft panduan penanganan awal demam, batuk, dan pilek pada anggota keluarga sebelum memutuskan ke fasilitas kesehatan terdekat.',
    content:
      'Ketika anggota keluarga mengalami demam ringan dan flu, langkah pertama adalah isolasi mandiri ringan, memperbanyak asupan cairan hangat, dan istirahat total. Segera kunjungi fasilitas kesehatan jika demam bertahan lebih dari 3 hari.',
    image_url: null,
    author_name: 'Tim Redaksi Medis CareFam',
    status: 'draft',
    published_at: null,
    created_at: new Date('2026-02-20T14:20:00Z').toISOString(),
    updated_at: new Date('2026-02-20T14:20:00Z').toISOString(),
  },
];

// In-memory store untuk menjaga konsistensi state lokal saat fallback aktif
let localArticlesStore: HealthEducationArticle[] = [...INITIAL_ARTICLES];

/**
 * Mengambil daftar konten edukasi dari tabel public.health_education di Supabase.
 * Operasi: READ (List) dengan dukungan search, filter kategori, filter status, dan pagination.
 */
export async function getEducationArticles(
  options: EducationQueryOptions = {}
): Promise<EducationQueryResult> {
  const {
    search = '',
    categoryFilter = 'all',
    statusFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase
      .from('health_education')
      .select('*', { count: 'exact' });

    // Filter Pencarian (Judul, Ringkasan, atau Konten)
    const cleanSearch = search.trim();
    if (cleanSearch) {
      query = query.or(
        `title.ilike.%${cleanSearch}%,summary.ilike.%${cleanSearch}%,content.ilike.%${cleanSearch}%`
      );
    }

    // Filter Kategori
    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    // Filter Status Publikasi (draft / published)
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Urutan & Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        console.warn(
          '[educationService] Tabel "health_education" belum ditemukan di Supabase. Menggunakan local store fallback.'
        );
        return filterLocalArticles(cleanSearch, categoryFilter, statusFilter, page, pageSize);
      }
      throw error;
    }

    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      articles: (data as HealthEducationArticle[]) || [],
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err: any) {
    console.warn('[educationService] Menggunakan fallback lokal karena error:', err?.message);
    return filterLocalArticles(search.trim(), categoryFilter, statusFilter, page, pageSize);
  }
}

/**
 * Mengambil detail satu artikel berdasarkan ID.
 * Operasi: READ (Single Item)
 */
export async function getArticleById(
  id: string
): Promise<HealthEducationArticle | null> {
  try {
    const { data, error } = await supabase
      .from('health_education')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        const found = localArticlesStore.find((a) => a.id === id);
        return found || null;
      }
      throw error;
    }

    return (data as HealthEducationArticle) || null;
  } catch {
    const found = localArticlesStore.find((a) => a.id === id);
    return found || null;
  }
}

/**
 * Menambahkan konten artikel edukasi baru ke Supabase.
 * Operasi: CREATE (.insert())
 */
export async function createArticle(
  params: CreateArticleParams
): Promise<HealthEducationArticle> {
  // Validasi input wajib
  if (!params.title.trim()) {
    throw new Error('Judul artikel edukasi tidak boleh kosong.');
  }
  if (!params.summary.trim()) {
    throw new Error('Ringkasan artikel tidak boleh kosong.');
  }
  if (!params.content.trim()) {
    throw new Error('Isi lengkap artikel tidak boleh kosong.');
  }

  const status: ArticleStatus = params.status || 'published';
  const payload = {
    title: params.title.trim(),
    category: params.category || ('Umum' as EducationCategory),
    summary: params.summary.trim(),
    content: params.content.trim(),
    image_url: params.image_url ? params.image_url.trim() : null,
    author_name: params.author_name ? params.author_name.trim() : 'Tim Medis CareFam',
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  };

  try {
    const { data, error } = await supabase
      .from('health_education')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        const newArticle: HealthEducationArticle = {
          id: 'local-' + Date.now().toString(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localArticlesStore = [newArticle, ...localArticlesStore];
        return newArticle;
      }
      throw error;
    }

    if (data) {
      localArticlesStore = [data as HealthEducationArticle, ...localArticlesStore];
    }

    return data as HealthEducationArticle;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      const newArticle: HealthEducationArticle = {
        id: 'local-' + Date.now().toString(),
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localArticlesStore = [newArticle, ...localArticlesStore];
      return newArticle;
    }
    throw err;
  }
}

/**
 * Memperbarui konten artikel edukasi di Supabase.
 * Operasi: UPDATE (.update().eq('id', id))
 */
export async function updateArticle(
  id: string,
  params: UpdateArticleParams
): Promise<HealthEducationArticle> {
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (params.title !== undefined) {
    if (!params.title.trim()) throw new Error('Judul artikel tidak boleh kosong.');
    updatePayload.title = params.title.trim();
  }
  if (params.category !== undefined) {
    updatePayload.category = params.category;
  }
  if (params.summary !== undefined) {
    if (!params.summary.trim()) throw new Error('Ringkasan artikel tidak boleh kosong.');
    updatePayload.summary = params.summary.trim();
  }
  if (params.content !== undefined) {
    if (!params.content.trim()) throw new Error('Isi konten artikel tidak boleh kosong.');
    updatePayload.content = params.content.trim();
  }
  if (params.image_url !== undefined) {
    updatePayload.image_url = params.image_url ? params.image_url.trim() : null;
  }
  if (params.author_name !== undefined) {
    updatePayload.author_name = params.author_name ? params.author_name.trim() : 'Tim Medis CareFam';
  }
  if (params.status !== undefined) {
    updatePayload.status = params.status;
    if (params.status === 'published') {
      updatePayload.published_at = new Date().toISOString();
    }
  }

  try {
    const { data, error } = await supabase
      .from('health_education')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localArticlesStore = localArticlesStore.map((a) =>
          a.id === id ? { ...a, ...updatePayload } : a
        );
        const updated = localArticlesStore.find((a) => a.id === id);
        if (!updated) throw new Error('Artikel tidak ditemukan.');
        return updated;
      }
      throw error;
    }

    localArticlesStore = localArticlesStore.map((a) =>
      a.id === id ? (data as HealthEducationArticle) : a
    );

    return data as HealthEducationArticle;
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localArticlesStore = localArticlesStore.map((a) =>
        a.id === id ? { ...a, ...updatePayload } : a
      );
      const updated = localArticlesStore.find((a) => a.id === id);
      if (!updated) throw new Error('Artikel tidak ditemukan.');
      return updated;
    }
    throw err;
  }
}

/**
 * Menghapus artikel edukasi dari Supabase.
 * Operasi: DELETE (.delete().eq('id', id))
 */
export async function deleteArticle(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('health_education')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        localArticlesStore = localArticlesStore.filter((a) => a.id !== id);
        return;
      }
      throw error;
    }

    localArticlesStore = localArticlesStore.filter((a) => a.id !== id);
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('does not exist')) {
      localArticlesStore = localArticlesStore.filter((a) => a.id !== id);
      return;
    }
    throw err;
  }
}

/**
 * Helper fungsi penyaringan lokal untuk fallback
 */
function filterLocalArticles(
  search: string,
  categoryFilter: string,
  statusFilter: string,
  page: number,
  pageSize: number
): EducationQueryResult {
  let filtered = [...localArticlesStore];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.summary.toLowerCase().includes(lower) ||
        a.content.toLowerCase().includes(lower)
    );
  }

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((a) => a.category === categoryFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((a) => a.status === statusFilter);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const offset = (page - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    articles: paginated,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Mengambil daftar artikel kesehatan yang sudah dipublikasikan khusus untuk sisi User.
 * Operasi: READ (List) dengan jaminan hanya menampilkan artikel 'published'.
 * Artikel berstatus 'draft' secara otomatis disaring keluar.
 */
export async function getUserPublishedArticles(
  options: {
    search?: string;
    categoryFilter?: string;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<EducationQueryResult> {
  return getEducationArticles({
    ...options,
    statusFilter: 'published',
  });
}

/**
 * Mengambil detail satu artikel untuk dibaca pengguna di sisi User.
 * Memastikan bahwa artikel yang diakses benar-benar berstatus 'published'.
 * Jika artikel berupa draf atau dihapus, mengembalikan null.
 */
export async function getUserArticleDetail(
  id: string
): Promise<HealthEducationArticle | null> {
  const article = await getArticleById(id);
  if (!article || article.status !== 'published') {
    return null;
  }
  return article;
}

/**
 * Mengambil beberapa artikel kesehatan terbaru berstatus 'published'
 * untuk preview di Beranda / User Dashboard.
 */
export async function getRecentPublishedArticles(
  limit: number = 3
): Promise<HealthEducationArticle[]> {
  const result = await getUserPublishedArticles({
    page: 1,
    pageSize: limit,
  });
  return result.articles;
}

