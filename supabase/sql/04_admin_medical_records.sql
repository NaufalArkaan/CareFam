-- =============================================================================
-- CareFam — SQL Skema, RLS, & Storage: Admin Medical Records Management
-- Berkas: supabase/sql/04_admin_medical_records.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PASTIKAN TABEL medical_records TERSEDIA LENGKAP
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    doctor_or_facility VARCHAR(150),
    record_date DATE NOT NULL,
    diagnosis_notes TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_medical_records_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT chk_medical_records_type CHECK (
        record_type IN ('diagnosis', 'lab_result', 'prescription', 'vaccine', 'checkup', 'other')
    )
);

COMMENT ON TABLE public.medical_records IS 
'Arsip rekam medis, hasil lab, diagnosis, dan resep dokter per anggota keluarga.';

-- Indeks Tambahan untuk Filter & Pencarian
CREATE INDEX IF NOT EXISTS idx_medical_records_member ON public.medical_records (family_member_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_type ON public.medical_records (record_type);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON public.medical_records (record_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON public.medical_records (created_at DESC);

-- Trigger auto-update timestamp
CREATE OR REPLACE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON public.medical_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- 2.1. SELECT untuk Administrator:
-- Memungkinkan Admin resmi (role = 'admin') memantau rekam medis seluruh pengguna
DROP POLICY IF EXISTS "medical_records_select_admin" ON public.medical_records;
CREATE POLICY "medical_records_select_admin"
ON public.medical_records
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- Catatan Keamanan:
-- Admin TIDAK memiliki hak INSERT, UPDATE, atau DELETE pada rekam medis pengguna.
-- Hak DELETE tetap eksklusif milik Kepala Keluarga via policy "medical_records_delete_family_head".

-- -----------------------------------------------------------------------------
-- 3. SUPABASE STORAGE BUCKET: medical-records (PRIVATE BUCKET)
-- -----------------------------------------------------------------------------
-- Mendaftarkan bucket penyimpanan berkas rekam medis privat jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-records', 'medical-records', false)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Admin resmi berhak mengunduh/melihat berkas rekam medis
DROP POLICY IF EXISTS "admin_read_medical_records_bucket" ON storage.objects;
CREATE POLICY "admin_read_medical_records_bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'medical-records' AND public.is_admin()
);

-- -----------------------------------------------------------------------------
-- 4. CONTOH DATA SEED UNTUK PENGUJIAN & DEMO
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    v_member_id UUID;
BEGIN
    -- Ambil salah satu ID anggota keluarga pertama yang tersedia
    SELECT id INTO v_member_id FROM public.family_members LIMIT 1;

    IF v_member_id IS NOT NULL THEN
        -- Seed 1: Hasil Laboratorium dengan Hasil Diagnosis
        INSERT INTO public.medical_records (
            family_member_id, title, record_type, doctor_or_facility,
            record_date, diagnosis_notes, attachment_url
        ) VALUES (
            v_member_id,
            'Pemeriksaan Darah Lengkap & Profil Lipid',
            'lab_result',
            'Laboratorium Klinik Prodia',
            CURRENT_DATE - INTERVAL '3 days',
            'Kolesterol Total: 215 mg/dL (sedikit di atas batas normal). Trigliserida: 140 mg/dL (Normal). Glukosa Puasa: 92 mg/dL (Normal). Disarankan mengurangi asupan lemak jenuh dan evaluasi ulang 3 bulan ke depan.',
            'medical-records/lab_result_lipid_profile.pdf'
        ) ON CONFLICT DO NOTHING;

        -- Seed 2: Resep Obat
        INSERT INTO public.medical_records (
            family_member_id, title, record_type, doctor_or_facility,
            record_date, diagnosis_notes, attachment_url
        ) VALUES (
            v_member_id,
            'Resep Obat ISPA & Vitamin Daya Tahan Tubuh',
            'prescription',
            'dr. Sarah Sp.P - RS Medika',
            CURRENT_DATE - INTERVAL '14 days',
            'Amoxicillin 500mg (3x1 sesudah makan, habiskan), Paracetamol 500mg (3x1 bila demam), Vitamin C 500mg (1x1). Kontrol jika demam > 3 hari.',
            'medical-records/resep_obat_ispa.jpg'
        ) ON CONFLICT DO NOTHING;

        -- Seed 3: Pemeriksaan Rutin (Tanpa Catatan Diagnosis / Belum Ada Analisis)
        INSERT INTO public.medical_records (
            family_member_id, title, record_type, doctor_or_facility,
            record_date, diagnosis_notes, attachment_url
        ) VALUES (
            v_member_id,
            'Medical Check-up Tahunan 2026',
            'checkup',
            'RS Premier Bintaro',
            CURRENT_DATE - INTERVAL '1 day',
            NULL, -- Uji coba status: Belum ada hasil analisis
            'medical-records/mcu_annual_2026.pdf'
        ) ON CONFLICT DO NOTHING;

        -- Seed 4: Sertifikat Vaksinasi
        INSERT INTO public.medical_records (
            family_member_id, title, record_type, doctor_or_facility,
            record_date, diagnosis_notes, attachment_url
        ) VALUES (
            v_member_id,
            'Vaksinasi Influenza Dewasa',
            'vaccine',
            'Puskesmas Kebayoran Baru',
            CURRENT_DATE - INTERVAL '30 days',
            'Pemberian vaksin Vaxigrip Tetra 0.5 mL intramuskular deltoid kiri. Tidak ada riwayat KIPI segera 30 menit pasca injeksi.',
            'medical-records/sertifikat_vaksin_influenza.pdf'
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;
