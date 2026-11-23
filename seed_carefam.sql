-- =============================================================================
-- CareFam — SQL Seeding Data Dummy Anggota Keluarga (Supabase Native)
-- Berkas: seed_carefam.sql
-- Standar: PostgreSQL 15+, Supabase Auth, Row Level Security (RLS)
-- Dokumen Acuan: docs/SPEC-DATABASE-ERD-FINAL.md (Versi 2.1)
-- =============================================================================
-- DESKRIPSI:
-- Skrip ini menambahkan tepat 20 data dummy anggota keluarga (family_members)
-- yang didistribusikan merata ke 4 akun kepala keluarga aktual di Supabase Auth:
-- 1. budi.pratama@gmail.com   (UID: 40659e5e-03a1-4e08-8979-189e5628a208) -> Keluarga Pratama (5 anggota)
-- 2. hendrowijaya@gmail.com  (UID: d867efd7-a588-439e-af86-70e959d2f065) -> Keluarga Wijaya  (5 anggota)
-- 3. rahmatsiregar@gmail.com (UID: 704093c8-a434-42ea-8ccc-fe6bb1185091) -> Keluarga Siregar (5 anggota)
-- 4. adityakusuma@gmail.com  (UID: 0b8b5120-3a87-4abc-ba10-8fb99c7c363e) -> Keluarga Kusuma  (5 anggota)
--
-- PRINSIP KEAMANAN & INTEGRITAS DATA:
-- 1. Menggunakan ID akun aktual dari Supabase Auth milik pengguna (bukan ID sembarangan).
-- 2. Akun administrator tetap murni tanpa data keluarga.
-- 3. Sinkronisasi otomatis ke public.profiles jika baris profil belum terbentuk.
-- 4. Idempotent: Menggunakan WHERE NOT EXISTS sehingga aman dieksekusi berkali-kali tanpa duplikasi.
-- =============================================================================

DO $$
DECLARE
    -- ID Akun Aktual dari Supabase Auth
    v_u1 UUID := '40659e5e-03a1-4e08-8979-189e5628a208'::UUID; -- budi.pratama@gmail.com
    v_u2 UUID := 'd867efd7-a588-439e-af86-70e959d2f065'::UUID; -- hendrowijaya@gmail.com
    v_u3 UUID := '704093c8-a434-42ea-8ccc-fe6bb1185091'::UUID; -- rahmatsiregar@gmail.com
    v_u4 UUID := '0b8b5120-3a87-4abc-ba10-8fb99c7c363e'::UUID; -- adityakusuma@gmail.com

    -- ID Unit Keluarga
    v_f1 UUID;
    v_f2 UUID;
    v_f3 UUID;
    v_f4 UUID;

    v_total_inserted INT := 0;
BEGIN
    RAISE NOTICE '======================================================================';
    RAISE NOTICE 'Memulai Seeding 20 Data Dummy CareFam untuk 4 Akun Kepala Keluarga...';
    RAISE NOTICE '======================================================================';

    -- -------------------------------------------------------------------------
    -- TAHAP 1: SINKRONISASI KE TABEL public.profiles
    -- Memastikan profil tersedia dengan role = ''user'' dan nama kepala keluarga
    -- -------------------------------------------------------------------------
    INSERT INTO public.profiles (id, callsign, full_name, role)
    VALUES
        (v_u1, 'Ayah Budi', 'Budi Pratama', 'user'),
        (v_u2, 'Pak Hendro', 'Hendro Wijaya', 'user'),
        (v_u3, 'Ayah Rahmat', 'Rahmat Siregar', 'user'),
        (v_u4, 'Mas Aditya', 'Aditya Kusuma', 'user')
    ON CONFLICT (id) DO UPDATE SET
        callsign = EXCLUDED.callsign,
        full_name = EXCLUDED.full_name,
        role = 'user',
        updated_at = NOW();

    RAISE NOTICE 'Tabel public.profiles berhasil disinkronkan untuk 4 akun.';

    -- -------------------------------------------------------------------------
    -- TAHAP 2: MEMASTIKAN 4 UNIT KELUARGA (families) TERSEDIA
    -- Masing-masing akun mengepalai 1 unit keluarga
    -- -------------------------------------------------------------------------
    -- 1. Keluarga Pratama (Akun Budi Pratama)
    SELECT id INTO v_f1 FROM public.families WHERE created_by = v_u1 AND family_name = 'Keluarga Pratama' LIMIT 1;
    IF v_f1 IS NULL THEN
        INSERT INTO public.families (family_name, created_by) VALUES ('Keluarga Pratama', v_u1) RETURNING id INTO v_f1;
        RAISE NOTICE 'Dibuat: Keluarga Pratama (ID: %)', v_f1;
    END IF;

    -- 2. Keluarga Wijaya (Akun Hendro Wijaya)
    SELECT id INTO v_f2 FROM public.families WHERE created_by = v_u2 AND family_name = 'Keluarga Wijaya' LIMIT 1;
    IF v_f2 IS NULL THEN
        INSERT INTO public.families (family_name, created_by) VALUES ('Keluarga Wijaya', v_u2) RETURNING id INTO v_f2;
        RAISE NOTICE 'Dibuat: Keluarga Wijaya (ID: %)', v_f2;
    END IF;

    -- 3. Keluarga Siregar (Akun Rahmat Siregar)
    SELECT id INTO v_f3 FROM public.families WHERE created_by = v_u3 AND family_name = 'Keluarga Siregar' LIMIT 1;
    IF v_f3 IS NULL THEN
        INSERT INTO public.families (family_name, created_by) VALUES ('Keluarga Siregar', v_u3) RETURNING id INTO v_f3;
        RAISE NOTICE 'Dibuat: Keluarga Siregar (ID: %)', v_f3;
    END IF;

    -- 4. Keluarga Kusuma (Akun Aditya Kusuma)
    SELECT id INTO v_f4 FROM public.families WHERE created_by = v_u4 AND family_name = 'Keluarga Kusuma' LIMIT 1;
    IF v_f4 IS NULL THEN
        INSERT INTO public.families (family_name, created_by) VALUES ('Keluarga Kusuma', v_u4) RETURNING id INTO v_f4;
        RAISE NOTICE 'Dibuat: Keluarga Kusuma (ID: %)', v_f4;
    END IF;

    -- -------------------------------------------------------------------------
    -- TAHAP 3: INSERT TEPAT 20 DATA ANGGOTA KELUARGA (family_members)
    -- Distribusi merata: 4 keluarga x 5 anggota = 20 data dummy
    -- -------------------------------------------------------------------------

    -- A. KELUARGA PRATAMA (Akun Budi Pratama — 5 Anggota)
    INSERT INTO public.family_members (family_id, user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    SELECT v_f1, d.user_id, d.name, d.birth_date, d.gender, d.relationship, d.blood_type, d.emergency_contact, d.allergies
    FROM (VALUES
        (v_u1, 'Budi Pratama', '1982-04-14'::date, 'male', 'Kepala Keluarga', 'O+', '0812-1122-3344', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Siti Handayani', '1985-08-22'::date, 'female', 'Istri', 'A+', '0812-1122-3345', 'Alergi Seafood (Udang)'),
        (NULL::uuid, 'Dimas Pratama', '2008-01-10'::date, 'male', 'Anak Pertama', 'O+', '0812-1122-3344', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Alya Putri Pratama', '2014-06-18'::date, 'female', 'Anak Kedua', 'A+', '0812-1122-3345', 'Alergi Debu & Riwayat Asma Ringan'),
        (NULL::uuid, 'Soekarno Pratama', '1952-11-05'::date, 'male', 'Kakek', 'B+', '0812-1122-3344', 'Alergi Obat Antibiotik Penisilin')
    ) AS d(user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    WHERE NOT EXISTS (SELECT 1 FROM public.family_members fm WHERE fm.family_id = v_f1 AND fm.name = d.name);

    -- B. KELUARGA WIJAYA (Akun Hendro Wijaya — 5 Anggota)
    INSERT INTO public.family_members (family_id, user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    SELECT v_f2, d.user_id, d.name, d.birth_date, d.gender, d.relationship, d.blood_type, d.emergency_contact, d.allergies
    FROM (VALUES
        (v_u2, 'Hendro Wijaya', '1979-09-30'::date, 'male', 'Kepala Keluarga', 'B+', '0813-2233-4455', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Rina Marlina', '1983-12-15'::date, 'female', 'Istri', 'B+', '0813-2233-4456', 'Alergi Suhu Dingin (Rhinitis Alergi)'),
        (NULL::uuid, 'Bagas Arya Wijaya', '2011-03-25'::date, 'male', 'Anak', 'B+', '0813-2233-4455', 'Alergi Kacang Tanah'),
        (NULL::uuid, 'Dewi Rahayu', '1955-07-08'::date, 'female', 'Nenek', 'AB+', '0813-2233-4455', 'Alergi Antibiotik Sulfonamida (Sulfa)'),
        (NULL::uuid, 'Tirto Utomo', '1950-02-19'::date, 'male', 'Kakek', 'O+', '0813-2233-4456', 'Tidak ada riwayat alergi')
    ) AS d(user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    WHERE NOT EXISTS (SELECT 1 FROM public.family_members fm WHERE fm.family_id = v_f2 AND fm.name = d.name);

    -- C. KELUARGA SIREGAR (Akun Rahmat Siregar — 5 Anggota)
    INSERT INTO public.family_members (family_id, user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    SELECT v_f3, d.user_id, d.name, d.birth_date, d.gender, d.relationship, d.blood_type, d.emergency_contact, d.allergies
    FROM (VALUES
        (v_u3, 'Rahmat Siregar', '1986-07-12'::date, 'male', 'Kepala Keluarga', 'A+', '0815-3344-5566', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Nurul Hidayah', '1989-10-04'::date, 'female', 'Istri', 'O+', '0815-3344-5567', 'Intoleransi / Alergi Laktosa'),
        (NULL::uuid, 'Fikri Siregar', '2016-04-20'::date, 'male', 'Anak Pertama', 'A+', '0815-3344-5566', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Zahra Siregar', '2020-08-14'::date, 'female', 'Anak Kedua', 'O+', '0815-3344-5567', 'Alergi Telur Ayam Ringan'),
        (NULL::uuid, 'Mariati Lubis', '1960-05-02'::date, 'female', 'Ibu Mertua', 'AB+', '0815-3344-5566', 'Hipersensitivitas Obat Anti-inflamasi (NSAID)')
    ) AS d(user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    WHERE NOT EXISTS (SELECT 1 FROM public.family_members fm WHERE fm.family_id = v_f3 AND fm.name = d.name);

    -- D. KELUARGA KUSUMA (Akun Aditya Kusuma — 5 Anggota)
    INSERT INTO public.family_members (family_id, user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    SELECT v_f4, d.user_id, d.name, d.birth_date, d.gender, d.relationship, d.blood_type, d.emergency_contact, d.allergies
    FROM (VALUES
        (v_u4, 'Aditya Kusuma', '1991-02-28'::date, 'male', 'Kepala Keluarga', 'AB+', '0817-4455-6677', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Maya Indrawati', '1993-05-16'::date, 'female', 'Istri', 'B+', '0817-4455-6678', 'Alergi Serbuk Bunga (Pollen)'),
        (NULL::uuid, 'Reza Kusuma', '2018-09-09'::date, 'male', 'Anak Pertama', 'B+', '0817-4455-6677', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Kinanti Kusuma', '2022-12-01'::date, 'female', 'Anak Kedua', 'AB+', '0817-4455-6678', 'Tidak ada riwayat alergi'),
        (NULL::uuid, 'Surya Kusuma', '1997-11-20'::date, 'male', 'Adik Kandung', 'A+', '0817-4455-6677', 'Alergi Amoksisilin')
    ) AS d(user_id, name, birth_date, gender, relationship, blood_type, emergency_contact, allergies)
    WHERE NOT EXISTS (SELECT 1 FROM public.family_members fm WHERE fm.family_id = v_f4 AND fm.name = d.name);

    -- Hitung total data yang tersimpan
    SELECT COUNT(*) INTO v_total_inserted
    FROM public.family_members
    WHERE family_id IN (v_f1, v_f2, v_f3, v_f4)
      AND name IN (
        'Budi Pratama', 'Siti Handayani', 'Dimas Pratama', 'Alya Putri Pratama', 'Soekarno Pratama',
        'Hendro Wijaya', 'Rina Marlina', 'Bagas Arya Wijaya', 'Dewi Rahayu', 'Tirto Utomo',
        'Rahmat Siregar', 'Nurul Hidayah', 'Fikri Siregar', 'Zahra Siregar', 'Mariati Lubis',
        'Aditya Kusuma', 'Maya Indrawati', 'Reza Kusuma', 'Kinanti Kusuma', 'Surya Kusuma'
      );

    RAISE NOTICE '======================================================================';
    RAISE NOTICE 'Seeding Selesai! Tepat % Data Anggota Keluarga Berhasil Tersimpan.', v_total_inserted;
    RAISE NOTICE 'Data tersebar merata: 4 Akun x 5 Anggota = 20 Data.';
    RAISE NOTICE '======================================================================';
END $$;

-- =============================================================================
-- QUERY VERIFIKASI SEEDING DATA
-- =============================================================================

-- 1. Verifikasi Total Data Dummy (Wajib Tepat 20)
SELECT 
    COUNT(*) AS total_data_dummy,
    CASE 
        WHEN COUNT(*) = 20 THEN 'BERHASIL: Tepat 20 data dummy anggota keluarga terdaftar.'
        ELSE 'PERINGATAN: Jumlah data tidak sama dengan 20.'
    END AS status_audit
FROM public.family_members fm
JOIN public.families f ON fm.family_id = f.id
WHERE fm.name IN (
    'Budi Pratama', 'Siti Handayani', 'Dimas Pratama', 'Alya Putri Pratama', 'Soekarno Pratama',
    'Hendro Wijaya', 'Rina Marlina', 'Bagas Arya Wijaya', 'Dewi Rahayu', 'Tirto Utomo',
    'Rahmat Siregar', 'Nurul Hidayah', 'Fikri Siregar', 'Zahra Siregar', 'Mariati Lubis',
    'Aditya Kusuma', 'Maya Indrawati', 'Reza Kusuma', 'Kinanti Kusuma', 'Surya Kusuma'
);

-- 2. Verifikasi Distribusi Merata per Akun & Unit Keluarga (Masing-masing 5 data)
SELECT 
    au.email AS email_akun,
    p.callsign AS panggilan,
    f.family_name AS nama_keluarga,
    COUNT(fm.id) AS jumlah_anggota
FROM public.families f
JOIN auth.users au ON f.created_by = au.id
JOIN public.profiles p ON au.id = p.id
JOIN public.family_members fm ON fm.family_id = f.id
WHERE fm.name IN (
    'Budi Pratama', 'Siti Handayani', 'Dimas Pratama', 'Alya Putri Pratama', 'Soekarno Pratama',
    'Hendro Wijaya', 'Rina Marlina', 'Bagas Arya Wijaya', 'Dewi Rahayu', 'Tirto Utomo',
    'Rahmat Siregar', 'Nurul Hidayah', 'Fikri Siregar', 'Zahra Siregar', 'Mariati Lubis',
    'Aditya Kusuma', 'Maya Indrawati', 'Reza Kusuma', 'Kinanti Kusuma', 'Surya Kusuma'
)
GROUP BY au.email, p.callsign, f.family_name
ORDER BY f.family_name;

-- 3. Verifikasi Daftar Rinci 20 Data Anggota
SELECT 
    f.family_name AS keluarga,
    au.email AS email_pemilik,
    fm.name AS nama_anggota,
    fm.relationship AS hubungan,
    fm.gender,
    fm.birth_date AS tgl_lahir,
    EXTRACT(YEAR FROM age(CURRENT_DATE, fm.birth_date))::int AS usia_tahun,
    fm.blood_type AS gol_darah,
    fm.emergency_contact AS kontak_darurat,
    fm.allergies AS alergi
FROM public.family_members fm
JOIN public.families f ON fm.family_id = f.id
JOIN auth.users au ON f.created_by = au.id
WHERE fm.name IN (
    'Budi Pratama', 'Siti Handayani', 'Dimas Pratama', 'Alya Putri Pratama', 'Soekarno Pratama',
    'Hendro Wijaya', 'Rina Marlina', 'Bagas Arya Wijaya', 'Dewi Rahayu', 'Tirto Utomo',
    'Rahmat Siregar', 'Nurul Hidayah', 'Fikri Siregar', 'Zahra Siregar', 'Mariati Lubis',
    'Aditya Kusuma', 'Maya Indrawati', 'Reza Kusuma', 'Kinanti Kusuma', 'Surya Kusuma'
)
ORDER BY f.family_name, fm.birth_date ASC;
