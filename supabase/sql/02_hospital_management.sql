-- =============================================================================
-- CareFam — SQL Skema & RLS Tabel Fasilitas Kesehatan (Hospital Management)
-- Berkas: supabase/sql/02_hospital_management.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL CHECK (length(trim(name)) > 0),
    facility_type VARCHAR(50) NOT NULL DEFAULT 'Rumah Sakit' CHECK (facility_type IN ('Rumah Sakit', 'Klinik', 'Puskesmas', 'Laboratorium', 'Apotek')),
    address TEXT NOT NULL CHECK (length(trim(address)) > 0),
    city VARCHAR(100) DEFAULT 'Jakarta',
    phone VARCHAR(30) CHECK (phone IS NULL OR length(trim(phone)) > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk pencarian dan pemfilteran
CREATE INDEX IF NOT EXISTS idx_hospitals_name ON public.hospitals (name);
CREATE INDEX IF NOT EXISTS idx_hospitals_type ON public.hospitals (facility_type);
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON public.hospitals (city);
CREATE INDEX IF NOT EXISTS idx_hospitals_active ON public.hospitals (is_active);

-- Trigger auto-update timestamp
CREATE OR REPLACE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Semua pengguna terotentikasi dan Admin dapat melihat fasilitas kesehatan
DROP POLICY IF EXISTS "hospitals_select_policy" ON public.hospitals;
CREATE POLICY "hospitals_select_policy"
ON public.hospitals
FOR SELECT
TO authenticated
USING (true);

-- 2. INSERT: Hanya Admin yang berhak menambahkan fasilitas kesehatan baru
DROP POLICY IF EXISTS "hospitals_insert_policy" ON public.hospitals;
CREATE POLICY "hospitals_insert_policy"
ON public.hospitals
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- 3. UPDATE: Hanya Admin yang berhak memperbarui data fasilitas kesehatan
DROP POLICY IF EXISTS "hospitals_update_policy" ON public.hospitals;
CREATE POLICY "hospitals_update_policy"
ON public.hospitals
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. DELETE: Hanya Admin yang berhak menghapus fasilitas kesehatan
DROP POLICY IF EXISTS "hospitals_delete_policy" ON public.hospitals;
CREATE POLICY "hospitals_delete_policy"
ON public.hospitals
FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- SEED DATA AWAL FASILITAS KESEHATAN
-- =============================================================================
INSERT INTO public.hospitals (name, facility_type, address, city, phone, is_active)
VALUES
    ('RSUP Nasional Dr. Cipto Mangunkusumo', 'Rumah Sakit', 'Jl. Diponegoro No. 71, Kenari, Senen', 'Jakarta Pusat', '021-1500135', true),
    ('RS Jantung dan Pembuluh Darah Harapan Kita', 'Rumah Sakit', 'Jl. Letjen S. Parman Kav. 87, Slipi', 'Jakarta Barat', '021-5684093', true),
    ('RSUP Fatmawati', 'Rumah Sakit', 'Jl. RS. Fatmawati Raya No. 4, Cilandak', 'Jakarta Selatan', '021-7501524', true),
    ('Klinik Pratama Sehat Keluarga', 'Klinik', 'Jl. Tebet Barat Raya No. 12, Tebet', 'Jakarta Selatan', '021-8312345', true),
    ('Puskesmas Kecamatan Kebayoran Baru', 'Puskesmas', 'Jl. Gandaria Tengah II No. 1, Kramat Pela', 'Jakarta Selatan', '021-7243321', true)
ON CONFLICT DO NOTHING;
