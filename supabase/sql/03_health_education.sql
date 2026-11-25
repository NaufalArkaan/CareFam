-- =============================================================================
-- CareFam — SQL Skema & RLS Tabel Edukasi Kesehatan (Health Education)
-- Berkas: supabase/sql/03_health_education.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.health_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
    category VARCHAR(50) NOT NULL DEFAULT 'Umum' CHECK (category IN ('Umum', 'Nutrisi', 'Kesehatan Anak', 'Lansia', 'Penyakit Kronis', 'Gaya Hidup')),
    summary TEXT NOT NULL CHECK (length(trim(summary)) > 0),
    content TEXT NOT NULL CHECK (length(trim(content)) > 0),
    image_url TEXT,
    author_name VARCHAR(100) DEFAULT 'Tim Medis CareFam',
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa pencarian, penyaringan kategori, dan status publikasi
CREATE INDEX IF NOT EXISTS idx_health_education_title ON public.health_education (title);
CREATE INDEX IF NOT EXISTS idx_health_education_category ON public.health_education (category);
CREATE INDEX IF NOT EXISTS idx_health_education_status ON public.health_education (status);
CREATE INDEX IF NOT EXISTS idx_health_education_published_at ON public.health_education (published_at DESC);

-- Trigger auto-update timestamp updated_at
CREATE OR REPLACE TRIGGER update_health_education_updated_at
BEFORE UPDATE ON public.health_education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.health_education ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Pengguna umum hanya dapat melihat artikel yang berstatus 'published',
-- sedangkan Administrator dapat melihat seluruh artikel termasuk 'draft'.
DROP POLICY IF EXISTS "health_education_select_policy" ON public.health_education;
CREATE POLICY "health_education_select_policy"
ON public.health_education
FOR SELECT
TO authenticated
USING (status = 'published' OR public.is_admin());

-- 2. INSERT: Hanya Administrator yang berhak menambahkan artikel edukasi baru
DROP POLICY IF EXISTS "health_education_insert_policy" ON public.health_education;
CREATE POLICY "health_education_insert_policy"
ON public.health_education
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- 3. UPDATE: Hanya Administrator yang berhak memperbarui artikel edukasi
DROP POLICY IF EXISTS "health_education_update_policy" ON public.health_education;
CREATE POLICY "health_education_update_policy"
ON public.health_education
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. DELETE: Hanya Administrator yang berhak menghapus artikel edukasi
DROP POLICY IF EXISTS "health_education_delete_policy" ON public.health_education;
CREATE POLICY "health_education_delete_policy"
ON public.health_education
FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- SEED DATA AWAL KONTEN EDUKASI KESEHATAN
-- =============================================================================
INSERT INTO public.health_education (title, category, summary, content, author_name, status, published_at)
VALUES
    (
        'Panduan Pola Makan Bergizi Seimbang untuk Keluarga',
        'Nutrisi',
        'Pelajari prinsip piring makan sehat, pembagian porsi karbohidrat kompleks, protein, serat sayuran, serta kebutuhan hidrasi harian.',
        'Pola makan bergizi seimbang merupakan fondasi utama imunitas tubuh keluarga. Pastikan setengah piring diisi sayur dan buah, seperempat piring karbohidrat kompleks, dan seperempat piring protein berkualitas. Batasi konsumsi gula, garam, dan lemak jenuh.',
        'dr. Siti Rahma, Sp.GK',
        'published',
        NOW() - INTERVAL '5 days'
    ),
    (
        'Jadwal dan Pentingnya Imunisasi Dasar Lengkap pada Anak',
        'Kesehatan Anak',
        'Rangkuman jadwal imunisasi wajib mulai dari Hepatitis B, BCG, Polio, DPT-HB-Hib, hingga Campak-Rubella untuk melindungi tumbuh kembang buah hati.',
        'Imunisasi dasar lengkap membentuk kekebalan kelompok (herd immunity) dan melindungi anak dari komplikasi penyakit menular berbahaya. Selalu catat tanggal imunisasi pada buku KIA dan konsultasikan dengan dokter anak jika jadwal terlambat.',
        'dr. Budi Santoso, Sp.A',
        'published',
        NOW() - INTERVAL '3 days'
    ),
    (
        'Menjaga Kebugaran Fisik dan Kualitas Tidur Lansia',
        'Lansia',
        'Aktivitas fisik intensitas sedang seperti jalan pagi dan senam pernapasan membantu mempertahankan massa otot serta fungsi kognitif lansia.',
        'Seiring bertambahnya usia, menjaga kekuatan otot dan fleksibilitas sendi menjadi sangat krusial untuk mencegah risiko jatuh. Lakukan jalan santai 30 menit setiap hari dan ciptakan rutinitas tidur yang tenang.',
        'dr. Hendro Wijaya, Sp.PD',
        'published',
        NOW() - INTERVAL '2 days'
    ),
    (
        'Mengenal Gejala Dini Hipertensi dan Langkah Pencegahannya',
        'Penyakit Kronis',
        'Hipertensi sering dijuluki the silent killer. Kenali batas aman tekanan darah dan cara pemantauan berkala menggunakan tensimeter digital di rumah.',
        'Tekanan darah normal berada pada rentang sistolik di bawah 120 mmHg dan diastolik di bawah 80 mmHg. Rutin mencatat hasil pengukuran pada aplikasi CareFam membantu dokter mengevaluasi efektivitas terapi obat antihipertensi.',
        'dr. Rahmat Siregar, Sp.JP',
        'published',
        NOW() - INTERVAL '1 day'
    ),
    (
        'Rencana Strategis Penanganan Gejala Flu Musiman di Rumah',
        'Umum',
        'Draft panduan penanganan awal demam, batuk, dan pilek pada anggota keluarga sebelum memutuskan ke fasilitas kesehatan terdekat.',
        'Ketika anggota keluarga mengalami demam ringan dan flu, langkah pertama adalah isolasi mandiri ringan, memperbanyak asupan cairan hangat, dan istirahat total. Segera kunjungi fasilitas kesehatan jika demam bertahan lebih dari 3 hari.',
        'Tim Redaksi Medis CareFam',
        'draft',
        NOW()
    )
ON CONFLICT DO NOTHING;
