-- =============================================================================
-- CareFam — SQL Skema & RLS Tabel Pemantauan Darurat (SOS Monitoring)
-- Berkas: supabase/sql/06_admin_sos_monitoring.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- Sesuai Dokumen SPEC: "Pantau status teknis pengiriman SOS"
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sos_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    caller_name VARCHAR(150) NOT NULL DEFAULT 'Pengguna CareFam',
    phone_number VARCHAR(50) NOT NULL,
    family_member_name VARCHAR(150),
    emergency_type VARCHAR(50) NOT NULL DEFAULT 'medis'
        CHECK (emergency_type IN ('medis', 'lansia', 'kecelakaan', 'anak', 'lainnya')),
    notes TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_address TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'responding', 'resolved', 'cancelled')),
    responder_notes TEXT,
    dispatched_facility VARCHAR(200),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa query pemantauan realtime & pengurutan status
CREATE INDEX IF NOT EXISTS idx_sos_status ON public.sos_requests (status);
CREATE INDEX IF NOT EXISTS idx_sos_emergency_type ON public.sos_requests (emergency_type);
CREATE INDEX IF NOT EXISTS idx_sos_created_at ON public.sos_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sos_user_id ON public.sos_requests (user_id);

-- Trigger auto-update timestamp updated_at
CREATE OR REPLACE TRIGGER update_sos_requests_updated_at
BEFORE UPDATE ON public.sos_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.sos_requests ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Admin dapat melihat seluruh permintaan SOS secara realtime,
--            User hanya melihat riwayat SOS yang dikirim oleh akunnya sendiri.
DROP POLICY IF EXISTS "sos_requests_select_policy" ON public.sos_requests;
CREATE POLICY "sos_requests_select_policy"
ON public.sos_requests
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = user_id);

-- 2. INSERT: Pengguna terautentikasi dapat mengirimkan sinyal darurat SOS
DROP POLICY IF EXISTS "sos_requests_insert_policy" ON public.sos_requests;
CREATE POLICY "sos_requests_insert_policy"
ON public.sos_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3. UPDATE: Hanya Administrator yang berhak mengubah status penanganan,
--            menugaskan ambulans/faskes, dan mengisi catatan responder.
DROP POLICY IF EXISTS "sos_requests_update_policy" ON public.sos_requests;
CREATE POLICY "sos_requests_update_policy"
ON public.sos_requests
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. DELETE: Hanya Administrator yang berhak mengarsipkan/menghapus catatan SOS
DROP POLICY IF EXISTS "sos_requests_delete_policy" ON public.sos_requests;
CREATE POLICY "sos_requests_delete_policy"
ON public.sos_requests
FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- DATA AWAL CONTOH PERMINTAAN SOS PENGUJIAN (SEED DATA)
-- =============================================================================
INSERT INTO public.sos_requests (
    caller_name,
    phone_number,
    family_member_name,
    emergency_type,
    notes,
    latitude,
    longitude,
    location_address,
    status,
    responder_notes,
    dispatched_facility,
    created_at
)
VALUES
    (
        'Aditya Kusuma',
        '0817-4455-6677',
        'Maya Indrawati (Istri)',
        'medis',
        'Pasien mengeluhkan nyeri dada akut menjalar ke lengan kiri dan sesak napas berat mendadak.',
        -6.2087634,
        106.8455990,
        'Jl. Tebet Barat Dalam Raya No. 42, RT.03/RW.02, Tebet, Jakarta Selatan',
        'active',
        NULL,
        NULL,
        NOW() - INTERVAL '12 minutes'
    ),
    (
        'Rudi Hermawan',
        '0812-8877-6655',
        'Kakek Sastro (Lansia, 78 th)',
        'lansia',
        'Lansia terjatuh di kamar mandi, terdapat dislokasi sendi pinggul dan tidak sadarkan diri sementara.',
        -6.1751100,
        106.8650395,
        'Jl. Cempaka Putih Tengah XXX No. 15, Cempaka Putih, Jakarta Pusat',
        'responding',
        'Ambulans Gawat Darurat RS Islam Cempaka Putih telah diberangkatkan bersama tim paramedis (ETA 7 menit).',
        'RS Islam Jakarta Cempaka Putih',
        NOW() - INTERVAL '35 minutes'
    ),
    (
        'Farhan Maulana',
        '0856-7788-9900',
        'Farhan Maulana',
        'kecelakaan',
        'Kecelakaan tunggal sepeda motor, luka robek di lutut kanan dan fraktur pergelangan tangan.',
        -6.2297465,
        106.8295180,
        'Dekat Halte Busway Patra Kuningan, Jl. Gatot Subroto Kav. 36, Jakarta Selatan',
        'resolved',
        'Pasien telah dievakuasi ke IGD RS Siloam Semanggi. Tindakan bedah reposisi fraktur selesai dilakukan.',
        'RS Siloam Semanggi',
        NOW() - INTERVAL '4 hours'
    ),
    (
        'Anisa Rahma',
        '0813-2233-4455',
        'Anak Daffa (5 th)',
        'anak',
        'Demam tinggi 40.2°C disertai kejang demam (step) selama 2 menit.',
        -6.9174639,
        107.6191228,
        'Jl. Riau No. 88, Citarum, Bandung Wetan, Kota Bandung',
        'resolved',
        'Pasien telah diberikan antipiretik dan antikonvulsan di IGD RS Limijati. Kondisi stabil dan diobservasi.',
        'RSIA Limijati Bandung',
        NOW() - INTERVAL '8 hours'
    ),
    (
        'Dimas Prasetyo',
        '0878-1122-3344',
        'Dimas Prasetyo',
        'lainnya',
        'Alarm kepencet secara tidak sengaja saat menguji fitur aplikasi.',
        -6.2891234,
        106.7981234,
        'Jl. Fatmawati Raya No. 12, Cilandak, Jakarta Selatan',
        'cancelled',
        'Dikonfirmasi via telepon bahwa pengguna tidak sengaja menekan tombol SOS dalam kondisi aman.',
        NULL,
        NOW() - INTERVAL '1 day'
    );
