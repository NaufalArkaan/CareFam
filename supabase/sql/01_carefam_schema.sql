-- =============================================================================
-- CareFam — Skrip Skema Basis Data PostgreSQL (Supabase Native) — Versi 2.1 Production Hardened
-- Berkas: supabase/sql/01_carefam_schema.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- Normalisasi: Third Normal Form (3NF)
-- Dokumen Acuan: docs/SPEC-DATABASE-ERD-FINAL.md (Versi 2.1)
-- =============================================================================
-- URUTAN EKSEKUSI DEPENDENSI (TOPOLOGICAL EXECUTION ORDER):
-- 1. BAGIAN 0: Pemeriksaan Diagnostik Pra-Eksekusi (Pre-Flight Diagnostics)
-- 2. BAGIAN 1: Ekstensi PostgreSQL (uuid-ossp, pgcrypto)
-- 3. BAGIAN 2: Fungsi Bantu Generik Tanpa Dependensi Tabel (update_updated_at_column)
-- 4. BAGIAN 3: Pembuatan Seluruh 8 Tabel Utama (profiles, families, family_members,
--              medical_records, health_reminders, vital_logs, emergency_alerts, audit_logs)
-- 5. BAGIAN 4: Fungsi Otorisasi & Helper RLS Security Definer
--              (is_admin, is_family_member_or_owner, can_access_member_data)
-- 6. BAGIAN 5: Fungsi Trigger & Trigger Integritas Data
-- 7. BAGIAN 6: Optimasi Indeks (Foreign Key & Query Performance)
-- 8. BAGIAN 7: Row Level Security (RLS Enablement & Strict Policies)
-- =============================================================================

-- =============================================================================
-- BAGIAN 0: PEMERIKSAAN DIAGNOSTIK PRA-EKSEKUSI (PRE-FLIGHT DIAGNOSTICS)
-- =============================================================================

DO $$
DECLARE
    v_profiles_exists BOOLEAN;
    v_families_exists BOOLEAN;
    v_members_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') INTO v_profiles_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'families') INTO v_families_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'family_members') INTO v_members_exists;

    IF v_profiles_exists THEN
        RAISE NOTICE '[PRE-FLIGHT] Tabel profiles terdeteksi. Skrip akan mempertahankan data dan menyinkronkan constraint/trigger/policy.';
    ELSE
        RAISE NOTICE '[PRE-FLIGHT] Menjalankan Fresh Installation: Tabel profiles dan seluruh entitas baru akan dibuat.';
    END IF;

    IF v_families_exists THEN
        RAISE NOTICE '[PRE-FLIGHT] Tabel families terdeteksi.';
    END IF;

    IF v_members_exists THEN
        RAISE NOTICE '[PRE-FLIGHT] Tabel family_members terdeteksi.';
    END IF;
END $$;

-- =============================================================================
-- BAGIAN 1: EKSTENSI POSTGRESQL
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- BAGIAN 2: FUNGSI BANTU GENERIK TANPA DEPENDENSI TABEL
-- =============================================================================

-- 2.1. Otomasi pembaruan kolom updated_at ke timestamp saat ini
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Memperbarui kolom updated_at ke timestamp terkini saat baris mengalami UPDATE.';

-- =============================================================================
-- BAGIAN 3: PEMBUATAN SELURUH 8 TABEL UTAMA (TOPOLOGICAL FK ORDER)
-- Dibuat sebelum fungsi yang mereferensikannya untuk mencegah error 42P01.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1. TABEL: profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    callsign VARCHAR(50),
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_profiles_role CHECK (role IN ('user', 'admin'))
);

COMMENT ON TABLE public.profiles IS 
'Profil akun pengguna CareFam yang terhubung 1:1 ke auth.users Supabase.';
COMMENT ON COLUMN public.profiles.role IS 
'Peran otorisasi sistem: user (pengguna biasa) atau admin. Terproteksi trigger protect_profiles_role.';

-- -----------------------------------------------------------------------------
-- 3.2. TABEL: families
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_name VARCHAR(100) NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_families_name_not_empty CHECK (length(trim(family_name)) > 0)
);

COMMENT ON TABLE public.families IS 
'Grup keluarga tempat bernaungnya anggota-anggota keluarga.';

-- -----------------------------------------------------------------------------
-- 3.3. TABEL: family_members
-- Catatan: Validasi birth_date di masa depan ditangani oleh trigger
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10),
    relationship VARCHAR(50) NOT NULL,
    blood_type VARCHAR(5),
    emergency_contact VARCHAR(25),
    allergies TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_family_members_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT chk_family_members_rel_not_empty CHECK (length(trim(relationship)) > 0),
    CONSTRAINT chk_family_members_gender CHECK (gender IS NULL OR gender IN ('male', 'female')),
    CONSTRAINT chk_family_members_blood_type CHECK (
        blood_type IS NULL OR blood_type IN (
            'A', 'B', 'AB', 'O',
            'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
            '-'
        )
    ),
    CONSTRAINT chk_family_members_birth_date_past CHECK (birth_date >= '1900-01-01')
);

COMMENT ON TABLE public.family_members IS 
'Daftar anggota keluarga individual beserta data dasar medis dan kontak darurat.';

-- -----------------------------------------------------------------------------
-- 3.4. TABEL: medical_records
-- Catatan: Validasi record_date di masa depan ditangani oleh trigger
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

-- -----------------------------------------------------------------------------
-- 3.5. TABEL: health_reminders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    reminder_type VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    reminder_time TIME NOT NULL,
    dosage VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_health_reminders_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT chk_health_reminders_type CHECK (
        reminder_type IN ('medication', 'doctor_visit', 'routine_check')
    ),
    CONSTRAINT chk_health_reminders_frequency CHECK (
        frequency IN ('daily', 'weekly', 'monthly', 'once')
    ),
    CONSTRAINT chk_health_reminders_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE public.health_reminders IS 
'Jadwal pengingat konsumsi obat dan agenda kontrol medis anggota keluarga.';

-- -----------------------------------------------------------------------------
-- 3.6. TABEL: vital_logs
-- Memvalidasi kelengkapan pasangan tekanan darah dan batas biologis yang akurat
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vital_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
    systolic INT,
    diastolic INT,
    heart_rate INT,
    blood_sugar DECIMAL(5,2),
    body_temperature DECIMAL(4,1),
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_vital_systolic CHECK (systolic IS NULL OR (systolic BETWEEN 50 AND 300)),
    CONSTRAINT chk_vital_diastolic CHECK (diastolic IS NULL OR (diastolic BETWEEN 30 AND 200)),
    -- Aturan Klinis: Tekanan darah harus berpasangan (keduanya ada atau keduanya null),
    -- sistolik wajib lebih besar daripada diastolik, dan selisih nadi minimal 10 mmHg
    CONSTRAINT chk_vital_blood_pressure_pair CHECK (
        (systolic IS NULL AND diastolic IS NULL) OR
        (systolic IS NOT NULL AND diastolic IS NOT NULL AND systolic > diastolic AND (systolic - diastolic) >= 10)
    ),
    CONSTRAINT chk_vital_heart_rate CHECK (heart_rate IS NULL OR (heart_rate BETWEEN 30 AND 250)),
    CONSTRAINT chk_vital_blood_sugar CHECK (blood_sugar IS NULL OR (blood_sugar BETWEEN 20.00 AND 999.99)),
    CONSTRAINT chk_vital_temperature CHECK (body_temperature IS NULL OR (body_temperature BETWEEN 32.0 AND 44.0)),
    CONSTRAINT chk_vital_at_least_one_metric CHECK (
        systolic IS NOT NULL OR 
        diastolic IS NOT NULL OR 
        heart_rate IS NOT NULL OR 
        blood_sugar IS NOT NULL OR 
        body_temperature IS NOT NULL
    )
);

COMMENT ON TABLE public.vital_logs IS 
'Pencatatan tanda-tanda vital tubuh anggota keluarga dengan validasi klinis berpasangan.';

-- -----------------------------------------------------------------------------
-- 3.7. TABEL: emergency_alerts
-- Kolom triggered_by_member_id mengosongkan diri secara aman saat anggota terhapus (ON DELETE SET NULL)
-- tanpa merusak family_id (NOT NULL). Keabsahan anggota terhadap family_id divalidasi via trigger.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    triggered_by_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    note TEXT,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT chk_emergency_status CHECK (status IN ('active', 'resolved', 'cancelled')),
    CONSTRAINT chk_emergency_latitude CHECK (latitude IS NULL OR (latitude BETWEEN -90.000000 AND 90.000000)),
    CONSTRAINT chk_emergency_longitude CHECK (longitude IS NULL OR (longitude BETWEEN -180.000000 AND 180.000000)),
    CONSTRAINT chk_emergency_resolution_time CHECK (resolved_at IS NULL OR resolved_at >= created_at)
);

COMMENT ON TABLE public.emergency_alerts IS 
'Sinyal peringatan darurat medis SOS dengan integritas lifecycle dan verifikasi keluarga.';

-- -----------------------------------------------------------------------------
-- 3.8. TABEL: audit_logs (Append-Only Ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 
'Buku besar pencatatan aktivitas sensitif pengguna dan admin untuk kepatuhan sistem.';

-- =============================================================================
-- BAGIAN 4: FUNGSI OTORISASI & HELPER RLS (SECURITY DEFINER WITH SEARCH_PATH)
-- Dibuat setelah seluruh tabel tersedia untuk mencegah error relasi 42P01.
-- =============================================================================

-- 4.1. Verifikasi status peran Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

COMMENT ON FUNCTION public.is_admin() IS 
'Mengembalikan TRUE jika auth.uid() yang terotentikasi memiliki peran admin.';

-- 4.2. Verifikasi kepemilikan atau keanggotaan dalam suatu keluarga
CREATE OR REPLACE FUNCTION public.is_family_member_or_owner(target_family_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        -- Kasus A: Pengguna adalah kepala/pembuat keluarga
        SELECT 1 FROM public.families f
        WHERE f.id = target_family_id AND f.created_by = auth.uid()
    ) OR EXISTS (
        -- Kasus B: Pengguna adalah anggota keluarga yang akunnya ditautkan
        SELECT 1 FROM public.family_members fm
        WHERE fm.family_id = target_family_id AND fm.user_id = auth.uid()
    );
$$;

COMMENT ON FUNCTION public.is_family_member_or_owner(UUID) IS 
'Mengembalikan TRUE jika auth.uid() adalah kepala keluarga atau anggota tertaut dalam target_family_id.';

-- 4.3. Verifikasi izin akses terhadap data individual anggota keluarga
CREATE OR REPLACE FUNCTION public.can_access_member_data(target_member_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.family_members fm
        WHERE fm.id = target_member_id
          AND public.is_family_member_or_owner(fm.family_id)
    );
$$;

COMMENT ON FUNCTION public.can_access_member_data(UUID) IS 
'Mengembalikan TRUE jika auth.uid() memiliki akses keluarga terhadap anggota target_member_id.';

-- =============================================================================
-- BAGIAN 5: FUNGSI TRIGGER & TRIGGER INTEGRITAS DATA
-- Dibuat setelah tabel dan fungsi helper otorisasi tersedia.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5.1. PROFILES: Triggers
-- -----------------------------------------------------------------------------

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger Proteksi Role & Bootstrap Admin di SQL Editor
CREATE OR REPLACE FUNCTION public.protect_profiles_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Evaluasi saat UPDATE role atau INSERT dengan role 'admin'
    IF (TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role) OR
       (TG_OP = 'INSERT' AND NEW.role = 'admin') THEN
        
        -- Diizinkan jika:
        -- 1. Sesi dieksekusi langsung oleh konsol database / SQL Editor Supabase (current_user = 'postgres' atau 'service_role')
        -- 2. Atau sesi pengguna terotentikasi adalah admin aktif (public.is_admin() = true)
        IF CURRENT_USER IN ('postgres', 'service_role', 'supabase_admin') THEN
            RETURN NEW;
        ELSIF public.is_admin() THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Pelanggaran Keamanan: Hanya administrator atau konsol database yang dapat menetapkan role admin.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profiles_role ON public.profiles;
CREATE TRIGGER trg_protect_profiles_role
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profiles_role();

-- Trigger Registrasi Supabase Auth: Selalu mengunci role = 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_callsign TEXT;
    v_full_name TEXT;
BEGIN
    v_callsign := NULLIF(TRIM(NEW.raw_user_meta_data->>'callsign'), '');
    v_full_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')), '');

    -- Role dikunci mutlak ke 'user'
    INSERT INTO public.profiles (id, callsign, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(v_callsign, 'Keluarga'),
        v_full_name,
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        callsign = COALESCE(EXCLUDED.callsign, public.profiles.callsign),
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        updated_at = NOW();

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 
'Trigger pendaftaran akun Supabase Auth: Selalu mengunci role = user tanpa kompromi.';

-- Mendaftarkan trigger pada auth.users secara defensif
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 5.2. FAMILIES: Triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_families_updated_at ON public.families;
CREATE TRIGGER trg_families_updated_at
    BEFORE UPDATE ON public.families
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5.3. FAMILY_MEMBERS: Triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_family_members_updated_at ON public.family_members;
CREATE TRIGGER trg_family_members_updated_at
    BEFORE UPDATE ON public.family_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Validasi tanggal lahir di masa depan
CREATE OR REPLACE FUNCTION public.validate_family_member_birth_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.birth_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Pelanggaran Validasi: birth_date (%) tidak boleh berada di masa depan.', NEW.birth_date;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_family_member_birth_date ON public.family_members;
CREATE TRIGGER trg_validate_family_member_birth_date
    BEFORE INSERT OR UPDATE OF birth_date ON public.family_members
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_family_member_birth_date();

-- Proteksi Integritas: family_id dan user_id anti-pembajakan
CREATE OR REPLACE FUNCTION public.protect_family_members_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_is_family_head BOOLEAN;
BEGIN
    -- 1. Dilarang memindahkan anggota ke keluarga lain (family_id bersifat permanen)
    IF NEW.family_id IS DISTINCT FROM OLD.family_id THEN
        RAISE EXCEPTION 'Pelanggaran Integritas: family_id anggota keluarga tidak dapat diubah atau dipindahkan.';
    END IF;

    -- 2. Evaluasi apakah pemanggil adalah kepala keluarga
    SELECT EXISTS (
        SELECT 1 FROM public.families
        WHERE id = OLD.family_id AND created_by = auth.uid()
    ) INTO v_is_family_head;

    -- 3. Jika bukan kepala keluarga dan bukan admin, dilarang mengubah user_id
    IF NOT (v_is_family_head OR public.is_admin()) THEN
        IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
            RAISE EXCEPTION 'Pelanggaran Hak Akses: Anggota keluarga biasa dilarang memanipulasi tautan akun user_id.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_family_members_integrity ON public.family_members;
CREATE TRIGGER trg_protect_family_members_integrity
    BEFORE UPDATE ON public.family_members
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_family_members_integrity();

-- -----------------------------------------------------------------------------
-- 5.4. MEDICAL_RECORDS: Triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_medical_records_updated_at ON public.medical_records;
CREATE TRIGGER trg_medical_records_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Validasi tanggal rekam medis di masa depan
CREATE OR REPLACE FUNCTION public.validate_medical_record_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.record_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Pelanggaran Validasi: record_date (%) tidak boleh berada di masa depan.', NEW.record_date;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_medical_record_date ON public.medical_records;
CREATE TRIGGER trg_validate_medical_record_date
    BEFORE INSERT OR UPDATE OF record_date ON public.medical_records
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_medical_record_date();

-- -----------------------------------------------------------------------------
-- 5.5. HEALTH_REMINDERS: Triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_health_reminders_updated_at ON public.health_reminders;
CREATE TRIGGER trg_health_reminders_updated_at
    BEFORE UPDATE ON public.health_reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5.6. EMERGENCY_ALERTS: Triggers (Lifecycle & Same-Family Validation)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.validate_emergency_alert_lifecycle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_is_authorized BOOLEAN;
BEGIN
    -- 1. Validasi relasional: triggered_by_member_id wajib terdaftar pada family_id yang sama
    IF NEW.triggered_by_member_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.family_members
            WHERE id = NEW.triggered_by_member_id AND family_id = NEW.family_id
        ) THEN
            RAISE EXCEPTION 'Pelanggaran Integritas: triggered_by_member_id (%) tidak terdaftar pada family_id (%).',
                NEW.triggered_by_member_id, NEW.family_id;
        END IF;
    END IF;

    -- 2. Status 'active'
    IF NEW.status = 'active' THEN
        -- Larang re-opening insiden yang sudah selesai oleh non-admin
        IF TG_OP = 'UPDATE' AND OLD.status IN ('resolved', 'cancelled') AND NOT public.is_admin() THEN
            RAISE EXCEPTION 'Pelanggaran Status: Peringatan darurat yang telah selesai tidak dapat diaktifkan kembali.';
        END IF;
        NEW.resolved_at := NULL;
        NEW.resolved_by := NULL;

    -- 3. Status diselesaikan ('resolved' atau 'cancelled')
    ELSIF NEW.status IN ('resolved', 'cancelled') THEN
        -- Verifikasi otorisasi: wajib anggota keluarga bersangkutan atau admin
        SELECT (public.is_family_member_or_owner(NEW.family_id) OR public.is_admin())
        INTO v_is_authorized;

        IF NOT v_is_authorized THEN
            RAISE EXCEPTION 'Pelanggaran Otorisasi: Anda tidak memiliki hak untuk menyelesaikan insiden darurat ini.';
        END IF;

        -- Jika baru saja beralih dari active ke resolved/cancelled
        IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status = 'active') THEN
            NEW.resolved_at := NOW();
            -- resolved_by dipaksakan sesuai auth.uid() pengguna aktif yang menyelesaikan
            NEW.resolved_by := auth.uid();
        ELSE
            -- Jika sudah resolved sebelumnya dan hanya update teks/note, lindungi resolved_by dan resolved_at
            IF NOT public.is_admin() THEN
                NEW.resolved_by := OLD.resolved_by;
                NEW.resolved_at := OLD.resolved_at;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_emergency_alert_lifecycle ON public.emergency_alerts;
CREATE TRIGGER trg_validate_emergency_alert_lifecycle
    BEFORE INSERT OR UPDATE ON public.emergency_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_emergency_alert_lifecycle();

-- =============================================================================
-- BAGIAN 6: OPTIMASI INDEKS (INDEXING UNTUK QUERY CEPAT & FOREIGN KEY)
-- =============================================================================

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- families
CREATE INDEX IF NOT EXISTS idx_families_created_by ON public.families(created_by);

-- family_members
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_name ON public.family_members(name);

-- Constraint Unik: 1 akun pengguna hanya dapat ditautkan ke maksimal 1 baris anggota dalam keluarga yang sama
CREATE UNIQUE INDEX IF NOT EXISTS uq_family_members_family_user 
    ON public.family_members(family_id, user_id) 
    WHERE user_id IS NOT NULL;

-- medical_records
CREATE INDEX IF NOT EXISTS idx_medical_records_member ON public.medical_records(family_member_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON public.medical_records(family_member_id, record_date DESC);

-- health_reminders
CREATE INDEX IF NOT EXISTS idx_health_reminders_member ON public.health_reminders(family_member_id);
CREATE INDEX IF NOT EXISTS idx_health_reminders_active ON public.health_reminders(family_member_id, is_active) WHERE is_active = TRUE;

-- vital_logs
CREATE INDEX IF NOT EXISTS idx_vital_logs_member_date ON public.vital_logs(family_member_id, logged_at DESC);

-- emergency_alerts
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_family ON public.emergency_alerts(family_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_active ON public.emergency_alerts(status) WHERE status = 'active';

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =============================================================================
-- BAGIAN 7: ROW LEVEL SECURITY (RLS) & POLICY AKSES DATA KETAT
-- Seluruh evaluasi relasi keluarga menggunakan fungsi Security Definer untuk mencegah Infinite Recursion
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 7.1. RLS: profiles
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT
    USING (
        id = auth.uid() OR public.is_admin()
    );

-- INSERT profil secara deklaratif menolak pengguna biasa memasukkan role admin
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT
    WITH CHECK (
        (id = auth.uid() AND role = 'user') OR public.is_admin()
    );

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
    FOR UPDATE
    USING (
        id = auth.uid() OR public.is_admin()
    )
    WITH CHECK (
        id = auth.uid() OR public.is_admin()
    );

-- -----------------------------------------------------------------------------
-- 7.2. RLS: families
-- -----------------------------------------------------------------------------
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "families_select_member_or_admin" ON public.families;
CREATE POLICY "families_select_member_or_admin" ON public.families
    FOR SELECT
    USING (
        public.is_family_member_or_owner(id) OR public.is_admin()
    );

DROP POLICY IF EXISTS "families_insert_authenticated" ON public.families;
CREATE POLICY "families_insert_authenticated" ON public.families
    FOR INSERT
    WITH CHECK (
        created_by = auth.uid()
    );

DROP POLICY IF EXISTS "families_update_owner_or_admin" ON public.families;
CREATE POLICY "families_update_owner_or_admin" ON public.families
    FOR UPDATE
    USING (
        created_by = auth.uid() OR public.is_admin()
    )
    WITH CHECK (
        created_by = auth.uid() OR public.is_admin()
    );

DROP POLICY IF EXISTS "families_delete_owner_or_admin" ON public.families;
CREATE POLICY "families_delete_owner_or_admin" ON public.families
    FOR DELETE
    USING (
        created_by = auth.uid() OR public.is_admin()
    );

-- -----------------------------------------------------------------------------
-- 7.3. RLS: family_members
-- Memisahkan hak Kepala Keluarga vs Anggota Tertaut
-- -----------------------------------------------------------------------------
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "family_members_select_family_or_admin" ON public.family_members;
CREATE POLICY "family_members_select_family_or_admin" ON public.family_members
    FOR SELECT
    USING (
        public.is_family_member_or_owner(family_id) OR public.is_admin()
    );

-- Hanya Kepala Keluarga atau Admin yang boleh mendaftarkan anggota baru
DROP POLICY IF EXISTS "family_members_insert_owner_or_admin" ON public.family_members;
CREATE POLICY "family_members_insert_owner_or_admin" ON public.family_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.families f
            WHERE f.id = family_members.family_id AND (f.created_by = auth.uid() OR public.is_admin())
        )
    );

-- Pembaruan data:
-- 1. Kepala Keluarga dapat memperbarui anggota dalam keluarganya
-- 2. Anggota tertaut HANYA dapat memperbarui baris profil dirinya sendiri (user_id = auth.uid())
-- 3. Admin dapat memperbarui
DROP POLICY IF EXISTS "family_members_update_owner_or_self" ON public.family_members;
CREATE POLICY "family_members_update_owner_or_self" ON public.family_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.families f
            WHERE f.id = family_members.family_id AND f.created_by = auth.uid()
        )
        OR user_id = auth.uid()
        OR public.is_admin()
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.families f
            WHERE f.id = family_members.family_id AND f.created_by = auth.uid()
        )
        OR user_id = auth.uid()
        OR public.is_admin()
    );

-- Hanya Kepala Keluarga atau Admin yang boleh menghapus anggota keluarga
DROP POLICY IF EXISTS "family_members_delete_owner_or_admin" ON public.family_members;
CREATE POLICY "family_members_delete_owner_or_admin" ON public.family_members
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.families f
            WHERE f.id = family_members.family_id AND (f.created_by = auth.uid() OR public.is_admin())
        )
    );

-- -----------------------------------------------------------------------------
-- 7.4. RLS: medical_records
-- PRINSIP PRIVASI MEDIS:
-- 1. Administrator TIDAK diizinkan membaca atau mengubah rekam medis privat!
-- 2. Penghapusan (DELETE) murni hanya diizinkan untuk Kepala Keluarga yang bersangkutan.
-- -----------------------------------------------------------------------------
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "medical_records_select_family" ON public.medical_records;
CREATE POLICY "medical_records_select_family" ON public.medical_records
    FOR SELECT
    USING (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "medical_records_insert_family" ON public.medical_records;
CREATE POLICY "medical_records_insert_family" ON public.medical_records
    FOR INSERT
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "medical_records_update_family" ON public.medical_records;
CREATE POLICY "medical_records_update_family" ON public.medical_records
    FOR UPDATE
    USING (
        public.can_access_member_data(family_member_id)
    )
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

-- Hak DELETE rekam medis eksklusif milik Kepala Keluarga (Admin dilarang)
DROP POLICY IF EXISTS "medical_records_delete_family_head" ON public.medical_records;
CREATE POLICY "medical_records_delete_family_head" ON public.medical_records
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.family_members fm
            JOIN public.families f ON fm.family_id = f.id
            WHERE fm.id = medical_records.family_member_id 
              AND f.created_by = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 7.5. RLS: health_reminders
-- -----------------------------------------------------------------------------
ALTER TABLE public.health_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "health_reminders_select_family" ON public.health_reminders;
CREATE POLICY "health_reminders_select_family" ON public.health_reminders
    FOR SELECT
    USING (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "health_reminders_insert_family" ON public.health_reminders;
CREATE POLICY "health_reminders_insert_family" ON public.health_reminders
    FOR INSERT
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "health_reminders_update_family" ON public.health_reminders;
CREATE POLICY "health_reminders_update_family" ON public.health_reminders
    FOR UPDATE
    USING (
        public.can_access_member_data(family_member_id)
    )
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "health_reminders_delete_family" ON public.health_reminders;
CREATE POLICY "health_reminders_delete_family" ON public.health_reminders
    FOR DELETE
    USING (
        public.can_access_member_data(family_member_id)
    );

-- -----------------------------------------------------------------------------
-- 7.6. RLS: vital_logs
-- PRINSIP PRIVASI MEDIS: Administrator TIDAK diizinkan membaca tanda vital privat!
-- -----------------------------------------------------------------------------
ALTER TABLE public.vital_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vital_logs_select_family" ON public.vital_logs;
CREATE POLICY "vital_logs_select_family" ON public.vital_logs
    FOR SELECT
    USING (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "vital_logs_insert_family" ON public.vital_logs;
CREATE POLICY "vital_logs_insert_family" ON public.vital_logs
    FOR INSERT
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "vital_logs_update_family" ON public.vital_logs;
CREATE POLICY "vital_logs_update_family" ON public.vital_logs
    FOR UPDATE
    USING (
        public.can_access_member_data(family_member_id)
    )
    WITH CHECK (
        public.can_access_member_data(family_member_id)
    );

DROP POLICY IF EXISTS "vital_logs_delete_family" ON public.vital_logs;
CREATE POLICY "vital_logs_delete_family" ON public.vital_logs
    FOR DELETE
    USING (
        public.can_access_member_data(family_member_id)
    );

-- -----------------------------------------------------------------------------
-- 7.7. RLS: emergency_alerts
-- Sinyal SOS dapat dibaca oleh keluarga bersangkutan dan tim admin (SOS Monitoring)
-- -----------------------------------------------------------------------------
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emergency_alerts_select_family_or_admin" ON public.emergency_alerts;
CREATE POLICY "emergency_alerts_select_family_or_admin" ON public.emergency_alerts
    FOR SELECT
    USING (
        public.is_family_member_or_owner(family_id) OR public.is_admin()
    );

DROP POLICY IF EXISTS "emergency_alerts_insert_family" ON public.emergency_alerts;
CREATE POLICY "emergency_alerts_insert_family" ON public.emergency_alerts
    FOR INSERT
    WITH CHECK (
        public.is_family_member_or_owner(family_id)
    );

DROP POLICY IF EXISTS "emergency_alerts_update_family_or_admin" ON public.emergency_alerts;
CREATE POLICY "emergency_alerts_update_family_or_admin" ON public.emergency_alerts
    FOR UPDATE
    USING (
        public.is_family_member_or_owner(family_id) OR public.is_admin()
    )
    WITH CHECK (
        public.is_family_member_or_owner(family_id) OR public.is_admin()
    );

-- -----------------------------------------------------------------------------
-- 7.8. RLS: audit_logs (Append-Only Ledger)
-- -----------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_select_admin_only" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin_only" ON public.audit_logs
    FOR SELECT
    USING (
        public.is_admin()
    );

DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid() OR public.is_admin()
    );

-- Kunci permanen: Melarang modifikasi dan penghapusan buku besar audit
DROP POLICY IF EXISTS "audit_logs_deny_update" ON public.audit_logs;
CREATE POLICY "audit_logs_deny_update" ON public.audit_logs
    FOR UPDATE
    USING (false);

DROP POLICY IF EXISTS "audit_logs_deny_delete" ON public.audit_logs;
CREATE POLICY "audit_logs_deny_delete" ON public.audit_logs
    FOR DELETE
    USING (false);

-- =============================================================================
-- SELESAI: Skema Basis Data CareFam Versi 2.1 Production Hardened Berhasil Disiapkan
-- =============================================================================
