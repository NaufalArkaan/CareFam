-- =============================================================================
-- CareFam — SQL Skema & RLS Tabel Manajemen Laporan (Report Management)
-- Berkas: supabase/sql/05_admin_report_management.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- Sesuai Dokumen SPEC: "Tangani laporan data, penyalahgunaan, dan keluhan"
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_name VARCHAR(150) NOT NULL DEFAULT 'Pengguna CareFam',
    reporter_email VARCHAR(150),
    report_type VARCHAR(50) NOT NULL DEFAULT 'complaint'
        CHECK (report_type IN ('data_issue', 'abuse', 'complaint', 'other')),
    title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT NOT NULL CHECK (length(trim(description)) > 0),
    attachment_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
    admin_notes TEXT,
    handled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa pencarian, penyaringan tipe, status, dan waktu
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports (report_type);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports (reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports (created_at DESC);

-- Trigger auto-update timestamp updated_at
CREATE OR REPLACE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Admin dapat melihat seluruh laporan, User hanya melihat laporan miliknya
DROP POLICY IF EXISTS "reports_select_policy" ON public.reports;
CREATE POLICY "reports_select_policy"
ON public.reports
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = reporter_id);

-- 2. INSERT: Pengguna terautentikasi dapat mengirimkan laporan atas namanya sendiri
DROP POLICY IF EXISTS "reports_insert_policy" ON public.reports;
CREATE POLICY "reports_insert_policy"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id OR public.is_admin());

-- 3. UPDATE: Hanya Administrator yang berhak mengubah status dan catatan penanganan
DROP POLICY IF EXISTS "reports_update_policy" ON public.reports;
CREATE POLICY "reports_update_policy"
ON public.reports
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. DELETE: Hanya Administrator yang berhak menghapus arsip laporan
DROP POLICY IF EXISTS "reports_delete_policy" ON public.reports;
CREATE POLICY "reports_delete_policy"
ON public.reports
FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- DATA AWAL CONTOH LAPORAN PENGUJIAN (SEED DATA)
-- =============================================================================
INSERT INTO public.reports (
    reporter_name,
    reporter_email,
    report_type,
    title,
    description,
    status,
    admin_notes,
    created_at
)
VALUES
    (
        'Aditya Kusuma',
        'aditya.kusuma@carefam.test',
        'data_issue',
        'Ketidaksesuaian Tanggal Lahir pada Profil Anggota Keluarga',
        'Saya mendapati tanggal lahir anak saya (Rizky Kusuma) tercatat tidak sesuai setelah sinkronisasi data rekam medis faskes. Mohon bantuan koreksi menjadi 2018-06-12.',
        'pending',
        NULL,
        NOW() - INTERVAL '3 hours'
    ),
    (
        'Siti Nurhaliza',
        'siti.nurhaliza@carefam.test',
        'abuse',
        'Indikasi Akses Tidak Dikenal pada Akun Saya',
        'Terdapat riwayat login dari perangkat tidak dikenal pada pukul 02:15 WIB. Mohon verifikasi keamanan sesi dan reset autentikasi perangkat jika terbukti ada percobaan peretasan.',
        'in_progress',
        'Sedang dilakukan audit log login IP oleh tim keamanan CareFam. Sesi aktif telah dipantau.',
        NOW() - INTERVAL '1 day'
    ),
    (
        'Maya Indrawati',
        'maya.indrawati@carefam.test',
        'complaint',
        'Klinik Pratama Sehat Selalu Tidak Dapat Dihubungi via Aplikasi',
        'Nomor darurat dan tombol telepon untuk Klinik Pratama Sehat Selalu yang tertera di menu Hospital Management mengalami nada sibuk terus-menerus. Mohon diperbarui kontak faskes yang valid.',
        'resolved',
        'Kontak faskes telah dikonfirmasi dan diperbarui dengan nomor hotline 24 jam baru (0812-9988-7766).',
        NOW() - INTERVAL '2 days'
    ),
    (
        'Bambang Pamungkas',
        'bambang.p@carefam.test',
        'complaint',
        'Kendala Unggah Dokumen PDF Rekam Medis Lebih dari 5MB',
        'Ketika mengunggah hasil rontgen dada berukuran 6.2 MB, aplikasi memunculkan pesan gagal unggah tanpa rincian batas maksimal berkas.',
        'pending',
        NULL,
        NOW() - INTERVAL '4 hours'
    ),
    (
        'Dewi Lestari',
        'dewi.lestari@carefam.test',
        'other',
        'Usulan Penambahan Kategori Vaksinasi Dewasa',
        'Saya mengusulkan agar menu Health Education dan Rekam Medis menambahkan panduan vaksinasi HPV dan Influenza untuk orang dewasa.',
        'resolved',
        'Usulan telah diteruskan ke tim redaksi medis untuk diagendakan dalam artikel edukasi edisi mendatang.',
        NOW() - INTERVAL '5 days'
    );
