import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import {
  AdminMedicalRecord,
  CreateMedicalRecordParams,
  MedicalRecordQueryOptions,
  MedicalRecordQueryResult,
  ParsedMedicalNotes,
  RecordType,
} from '../types/admin';

// =============================================================================
// PARSER & FORMATTER CATATAN MEDIS
// Memisahkan secara tegas:
// 1. Keluhan / Informasi yang dilaporkan pengguna
// 2. Hasil Pemeriksaan & Diagnosis Dokter / Nilai Lab
// 3. Rekomendasi / Tindak Lanjut Tenaga Medis
// =============================================================================

export function formatMedicalNotes(params: {
  user_complaints?: string | null;
  diagnosis_notes?: string | null;
  recommendations?: string | null;
}): string {
  const parts: string[] = [];

  if (params.user_complaints && params.user_complaints.trim().length > 0) {
    parts.push(`[KELUHAN PASIEN]\n${params.user_complaints.trim()}`);
  }

  if (params.diagnosis_notes && params.diagnosis_notes.trim().length > 0) {
    parts.push(`[HASIL PEMERIKSAAN & DIAGNOSIS]\n${params.diagnosis_notes.trim()}`);
  }

  if (params.recommendations && params.recommendations.trim().length > 0) {
    parts.push(`[REKOMENDASI MEDIS]\n${params.recommendations.trim()}`);
  }

  return parts.join('\n\n');
}

export function parseMedicalNotes(rawNotes: string | null): ParsedMedicalNotes {
  if (!rawNotes || rawNotes.trim().length === 0) {
    return {
      userComplaints: null,
      clinicalDiagnosis: null,
      recommendations: null,
      labMetrics: [],
    };
  }

  let userComplaints: string | null = null;
  let clinicalDiagnosis: string | null = null;
  let recommendations: string | null = null;

  // Cek apakah teks menggunakan tag penanda bagian
  const hasUserTag = rawNotes.includes('[KELUHAN PASIEN]');
  const hasDiagTag = rawNotes.includes('[HASIL PEMERIKSAAN & DIAGNOSIS]');
  const hasRecTag = rawNotes.includes('[REKOMENDASI MEDIS]');

  if (hasUserTag || hasDiagTag || hasRecTag) {
    if (hasUserTag) {
      const start = rawNotes.indexOf('[KELUHAN PASIEN]') + '[KELUHAN PASIEN]'.length;
      const endDiag = hasDiagTag ? rawNotes.indexOf('[HASIL PEMERIKSAAN & DIAGNOSIS]') : rawNotes.length;
      const endRec = hasRecTag ? rawNotes.indexOf('[REKOMENDASI MEDIS]') : rawNotes.length;
      const end = Math.min(endDiag > start ? endDiag : rawNotes.length, endRec > start ? endRec : rawNotes.length);
      userComplaints = rawNotes.substring(start, end).trim() || null;
    }

    if (hasDiagTag) {
      const start = rawNotes.indexOf('[HASIL PEMERIKSAAN & DIAGNOSIS]') + '[HASIL PEMERIKSAAN & DIAGNOSIS]'.length;
      const end = hasRecTag ? rawNotes.indexOf('[REKOMENDASI MEDIS]') : rawNotes.length;
      clinicalDiagnosis = rawNotes.substring(start, end).trim() || null;
    }

    if (hasRecTag) {
      const start = rawNotes.indexOf('[REKOMENDASI MEDIS]') + '[REKOMENDASI MEDIS]'.length;
      recommendations = rawNotes.substring(start).trim() || null;
    }
  } else {
    // Teks biasa dari rekam medis lama / seed data
    clinicalDiagnosis = rawNotes.trim();
  }

  // Ekstraksi nilai metrik laboratorium / tanda vital jika terdeteksi dalam teks
  const labMetrics: Array<{ label: string; value: string; isAbnormal?: boolean }> = [];
  const textToScan = (clinicalDiagnosis || '') + ' ' + (rawNotes || '');

  // Pola nilai lab umum: Label: Nilai Satuan
  const metricRegex = /(Kolesterol\s*Total|Trigliserida|Glukosa\s*(?:Darah\s*)?Puasa|Tekanan\s*Darah|TD|Asam\s*Urat|Hemoglobin|Hb|Leukosit|Trombosit)\s*[:=]\s*([0-9\/\.]+\s*(?:mg\/dL|mmHg|g\/dL|ribu\/µL|%|mmol\/L)?(?:\s*\([^)]+\))?)/gi;
  let match;
  while ((match = metricRegex.exec(textToScan)) !== null) {
    const label = match[1].trim();
    const value = match[2].trim();
    const isAbnormal =
      value.toLowerCase().includes('tinggi') ||
      value.toLowerCase().includes('borderline') ||
      value.toLowerCase().includes('rendah');
    labMetrics.push({ label, value, isAbnormal });
  }

  return {
    userComplaints,
    clinicalDiagnosis,
    recommendations,
    labMetrics,
  };
}

// =============================================================================
// FALLBACK DATA STORE LOKAL (MEMORI)
// =============================================================================
export const FALLBACK_MEDICAL_RECORDS: AdminMedicalRecord[] = [
  {
    id: 'med-rec-001',
    family_member_id: 'fam-mem-001',
    patient_name: 'Aditya Kusuma',
    relationship: 'Kepala Keluarga',
    family_name: 'Keluarga Kusuma',
    account_owner: 'aditya.kusuma@email.com',
    title: 'Pemeriksaan Darah Lengkap & Profil Lipid',
    record_type: 'lab_result',
    doctor_or_facility: 'Laboratorium Klinik Prodia',
    record_date: '2026-11-23',
    diagnosis_notes: `[KELUHAN PASIEN]
Badan terasa lekas lelah, tengkuk terasa berat terutama saat bangun pagi.

[HASIL PEMERIKSAAN & DIAGNOSIS]
Kolesterol Total: 218 mg/dL (Borderline tinggi). Trigliserida: 142 mg/dL (Normal). Glukosa Darah Puasa: 94 mg/dL (Normal).

[REKOMENDASI MEDIS]
Diet rendah lemak jenuh dan garam. Olahraga aerobik teratur minimal 30 menit per hari (3-5 kali seminggu). Evaluasi ulang profil lipid setelah 3 bulan.`,
    attachment_url: 'medical-records/lab_result_lipid_profile.pdf',
    file_name: 'lab_result_lipid_profile.pdf',
    created_at: '2026-11-23T08:30:00Z',
    updated_at: '2026-11-23T08:30:00Z',
  },
  {
    id: 'med-rec-002',
    family_member_id: 'fam-mem-002',
    patient_name: 'Maya Indrawati',
    relationship: 'Istri',
    family_name: 'Keluarga Kusuma',
    account_owner: 'aditya.kusuma@email.com',
    title: 'Resep Obat ISPA & Vitamin Imunitas',
    record_type: 'prescription',
    doctor_or_facility: 'dr. Sarah Sp.P - RS Medika',
    record_date: '2026-11-20',
    diagnosis_notes: `[KELUHAN PASIEN]
Batuk berdahak, hidung tersumbat, dan tenggorokan gatal sejak 2 hari yang lalu.

[HASIL PEMERIKSAAN & DIAGNOSIS]
Faring hiperemis ringan, tidak ada ronki/wheezing. Diagnosis: ISPA non-spesifik fase akut.

[REKOMENDASI MEDIS]
Cefixime 100mg 2x1 tablet (habiskan selama 5 hari). Tremenza 3x1 tablet bila hidung tersumbat. Vitamin C 500mg 1x1. Banyak minum air putih hangat dan hindari minuman dingin/gorengan.`,
    attachment_url: 'medical-records/resep_obat_ispa_maya.jpg',
    file_name: 'resep_obat_ispa_maya.jpg',
    created_at: '2026-11-20T10:15:00Z',
    updated_at: '2026-11-20T10:15:00Z',
  },
  {
    id: 'med-rec-003',
    family_member_id: 'fam-mem-003',
    patient_name: 'Surya Kusuma',
    relationship: 'Anak',
    family_name: 'Keluarga Kusuma',
    account_owner: 'aditya.kusuma@email.com',
    title: 'Sertifikat Vaksinasi Influenza Quadrivalent',
    record_type: 'vaccine',
    doctor_or_facility: 'Puskesmas Kebayoran Baru',
    record_date: '2026-11-15',
    diagnosis_notes: `[KELUHAN PASIEN]
Kondisi anak sehat, tidak ada demam atau batuk pilek saat datang ke faskes.

[HASIL PEMERIKSAAN & DIAGNOSIS]
Suhu tubuh 36.6°C, respirasi normal. Layak menerima imunisasi influenza tahunan.

[REKOMENDASI MEDIS]
Injeksi Vaksin Vaxigrip Tetra 0.5 mL intramuskular deltoid kiri selesai diberikan. Kompres dingin pada area suntikan bila nyeri/bengkak. Paracetamol sirup bila timbul demam pasca imunisasi.`,
    attachment_url: 'medical-records/sertifikat_vaksin_surya.pdf',
    file_name: 'sertifikat_vaksin_surya.pdf',
    created_at: '2026-11-15T14:00:00Z',
    updated_at: '2026-11-15T14:00:00Z',
  },
  {
    id: 'med-rec-004',
    family_member_id: 'fam-mem-004',
    patient_name: 'Budi Santoso',
    relationship: 'Kepala Keluarga',
    family_name: 'Keluarga Santoso',
    account_owner: 'budi.santoso@email.com',
    title: 'Berkas Radiologi Rontgen Thorax PA',
    record_type: 'checkup',
    doctor_or_facility: 'RS Premier Bintaro',
    record_date: '2026-11-18',
    diagnosis_notes: null, // Uji coba: Belum ada hasil analisis
    attachment_url: 'medical-records/rontgen_thorax_budi.pdf',
    file_name: 'rontgen_thorax_budi.pdf',
    created_at: '2026-11-18T16:20:00Z',
    updated_at: '2026-11-18T16:20:00Z',
  },
  {
    id: 'med-rec-005',
    family_member_id: 'fam-mem-005',
    patient_name: 'Siti Rahma',
    relationship: 'Istri',
    family_name: 'Keluarga Santoso',
    account_owner: 'budi.santoso@email.com',
    title: 'Resume Konsultasi Hipertensi & Pola Makan',
    record_type: 'diagnosis',
    doctor_or_facility: 'Klinik Sehat Keluarga',
    record_date: '2026-11-10',
    diagnosis_notes: `[KELUHAN PASIEN]
Pusing berputar sesaat ketika berubah posisi mendadak.

[HASIL PEMERIKSAAN & DIAGNOSIS]
Tekanan Darah: 138/88 mmHg. Status kardiovaskular stabil. Hipertensi Stage 1 terkontrol.

[REKOMENDASI MEDIS]
Teruskan konsumsi Amlodipine 5mg malam hari. Catat buku harian tekanan darah pagi dan malam selama 14 hari.`,
    attachment_url: 'medical-records/resume_klinis_siti.pdf',
    file_name: 'resume_klinis_siti.pdf',
    created_at: '2026-11-10T11:45:00Z',
    updated_at: '2026-11-10T11:45:00Z',
  },
];

let localRecordsStore: AdminMedicalRecord[] = [...FALLBACK_MEDICAL_RECORDS];

/**
 * Ekstraksi nama berkas dari path atau URL lampiran
 */
export function extractFileName(attachmentUrl: string | null): string | undefined {
  if (!attachmentUrl) return undefined;
  try {
    const cleanUrl = attachmentUrl.split('?')[0];
    const parts = cleanUrl.split('/');
    return parts[parts.length - 1] || 'document.pdf';
  } catch {
    return 'document.pdf';
  }
}

/**
 * Pemilih berkas dokumen/gambar secara universal (Cross-Platform)
 */
export async function pickMedicalDocument(): Promise<{
  name: string;
  size: number;
  type: string;
  file?: File | Blob;
  uri: string;
} | null> {
  if (Platform.OS === 'web') {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve(null);
        return;
      }
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf,image/png,image/jpeg,image/jpg,.doc,.docx';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            file: file,
            uri: URL.createObjectURL(file),
          });
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  // Fallback platform non-web (simulasi dokumen terlampir)
  return {
    name: 'rekam_medis_lampiran.pdf',
    size: 245000,
    type: 'application/pdf',
    uri: 'file://mock/rekam_medis_lampiran.pdf',
  };
}

/**
 * Mengunggah berkas rekam medis ke Supabase Storage (Private bucket: medical-records)
 */
export async function uploadMedicalDocumentFile(
  fileObj: { name: string; size?: number; type?: string; file?: File | Blob; uri?: string },
  familyMemberId: string
): Promise<string> {
  const fileExt = fileObj.name.split('.').pop() || 'pdf';
  const cleanMemberId = familyMemberId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const fileName = `rec_${cleanMemberId}_${Date.now()}.${fileExt}`;
  const filePath = `medical-records/${fileName}`;

  try {
    if (fileObj.file) {
      // Platform Web: Kirim File / Blob langsung
      const { error } = await supabase.storage
        .from('medical-records')
        .upload(fileName, fileObj.file, {
          contentType: fileObj.type || 'application/pdf',
          upsert: true,
        });

      if (error) {
        console.warn('[medicalRecordService] Gagal upload storage Supabase:', error.message);
        return filePath;
      }
    }
  } catch (err) {
    console.warn('[medicalRecordService] Exception upload berkas:', err);
  }

  return filePath;
}

/**
 * Membuat data rekam medis baru dari sisi User
 * Disimpan ke tabel public.medical_records dan Storage Supabase
 */
export async function createMedicalRecord(
  params: CreateMedicalRecordParams
): Promise<AdminMedicalRecord> {
  let attachmentUrl = params.attachment_url || null;

  // 1. Unggah berkas jika disertakan oleh pengguna
  if (params.file) {
    try {
      attachmentUrl = await uploadMedicalDocumentFile(params.file, params.family_member_id);
    } catch (uploadErr) {
      console.warn('[medicalRecordService] Berkas gagal diunggah, lanjut tanpa berkas:', uploadErr);
    }
  }

  // 2. Format catatan klinis dengan pemisahan keluhan, diagnosis, dan rekomendasi
  const formattedNotes = formatMedicalNotes({
    user_complaints: params.user_complaints,
    diagnosis_notes: params.diagnosis_notes,
    recommendations: params.recommendations,
  });

  // 3. Masukkan ke database Supabase
  let createdDbRecord: any = null;
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert({
        family_member_id: params.family_member_id,
        title: params.title.trim(),
        record_type: params.record_type,
        doctor_or_facility: params.doctor_or_facility?.trim() || null,
        record_date: params.record_date,
        diagnosis_notes: formattedNotes || null,
        attachment_url: attachmentUrl,
      })
      .select('*')
      .single();

    if (error) {
      console.warn('[medicalRecordService] Insert Supabase error, lanjut simpan lokal:', error.message);
    } else {
      createdDbRecord = data;
    }
  } catch (dbErr) {
    console.warn('[medicalRecordService] Exception insert Supabase:', dbErr);
  }

  // 4. Buat objek data rekam medis lengkap
  const newRecord: AdminMedicalRecord = {
    id: createdDbRecord?.id || `med-rec-${Date.now()}`,
    family_member_id: params.family_member_id,
    patient_name: 'Anggota Keluarga', // Diisi nama anggota di layer UI
    relationship: 'Keluarga',
    family_name: 'Keluarga Saya',
    account_owner: 'Saya',
    title: params.title.trim(),
    record_type: params.record_type,
    doctor_or_facility: params.doctor_or_facility?.trim() || null,
    record_date: params.record_date,
    diagnosis_notes: formattedNotes || null,
    attachment_url: attachmentUrl,
    file_name: extractFileName(attachmentUrl),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Simpan ke in-memory store agar tampilan langsung terbarui
  localRecordsStore = [newRecord, ...localRecordsStore];

  return newRecord;
}

/**
 * Mengambil rekam medis pengguna untuk Halaman User
 * Dilengkapi filter anggota keluarga dan fallback lokal
 */
export async function getUserMedicalRecords(
  familyMemberId?: string
): Promise<AdminMedicalRecord[]> {
  try {
    let query = supabase
      .from('medical_records')
      .select(
        `
        id,
        family_member_id,
        title,
        record_type,
        doctor_or_facility,
        record_date,
        diagnosis_notes,
        attachment_url,
        created_at,
        updated_at,
        family_members (
          id,
          name,
          relationship
        )
      `
      )
      .order('record_date', { ascending: false });

    if (familyMemberId && familyMemberId !== 'all') {
      query = query.eq('family_member_id', familyMemberId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[medicalRecordService] User medical records query error:', error.message);
      return getLocalUserRecords(familyMemberId);
    }

    if (!data || data.length === 0) {
      return getLocalUserRecords(familyMemberId);
    }

    return data.map((item: any) => ({
      id: item.id,
      family_member_id: item.family_member_id,
      patient_name: item.family_members?.name || 'Pasien',
      relationship: item.family_members?.relationship || 'Keluarga',
      title: item.title,
      record_type: item.record_type as RecordType,
      doctor_or_facility: item.doctor_or_facility || null,
      record_date: item.record_date,
      diagnosis_notes: item.diagnosis_notes || null,
      attachment_url: item.attachment_url || null,
      file_name: extractFileName(item.attachment_url),
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (err) {
    console.warn('[medicalRecordService] Exception getUserMedicalRecords:', err);
    return getLocalUserRecords(familyMemberId);
  }
}

function getLocalUserRecords(familyMemberId?: string): AdminMedicalRecord[] {
  if (familyMemberId && familyMemberId !== 'all') {
    return localRecordsStore.filter((r) => r.family_member_id === familyMemberId);
  }
  return [...localRecordsStore];
}

/**
 * Mengambil daftar rekam medis untuk Admin dari Supabase
 * Dilengkapi relasi data ke tabel family_members, families, dan profiles
 */
export async function getAdminMedicalRecords(
  options: MedicalRecordQueryOptions = {}
): Promise<MedicalRecordQueryResult> {
  const {
    search = '',
    typeFilter = 'all',
    hasDiagnosisFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  try {
    let query = supabase
      .from('medical_records')
      .select(
        `
        id,
        family_member_id,
        title,
        record_type,
        doctor_or_facility,
        record_date,
        diagnosis_notes,
        attachment_url,
        created_at,
        updated_at,
        family_members (
          id,
          name,
          relationship,
          family_id,
          families (
            id,
            family_name,
            created_by,
            profiles:created_by (
              id,
              full_name,
              callsign,
              email
            )
          )
        )
      `,
        { count: 'exact' }
      );

    if (typeFilter && typeFilter !== 'all') {
      query = query.eq('record_type', typeFilter);
    }

    if (hasDiagnosisFilter === 'with_diagnosis') {
      query = query.not('diagnosis_notes', 'is', null);
    } else if (hasDiagnosisFilter === 'without_diagnosis') {
      query = query.is('diagnosis_notes', null);
    }

    query = query.order('record_date', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      console.warn('[medicalRecordService] Supabase query error, fallback ke local store:', error.message);
      return getFilteredLocalRecords(options);
    }

    if (!data || data.length === 0) {
      if (localRecordsStore.length > 0) {
        return getFilteredLocalRecords(options);
      }
      return {
        records: [],
        totalCount: 0,
        page,
        pageSize,
        totalPages: 1,
      };
    }

    let mappedRecords: AdminMedicalRecord[] = data.map((item: any) => {
      const famMember = item.family_members;
      const family = famMember?.families;
      const ownerProfile = family?.profiles;

      return {
        id: item.id,
        family_member_id: item.family_member_id,
        patient_name: famMember?.name || 'Pasien CareFam',
        relationship: famMember?.relationship || 'Anggota',
        family_name: family?.family_name || 'Keluarga CareFam',
        account_owner:
          ownerProfile?.callsign ||
          ownerProfile?.full_name ||
          ownerProfile?.email ||
          'Pengguna',
        title: item.title,
        record_type: item.record_type as RecordType,
        doctor_or_facility: item.doctor_or_facility || null,
        record_date: item.record_date,
        diagnosis_notes: item.diagnosis_notes || null,
        attachment_url: item.attachment_url || null,
        file_name: extractFileName(item.attachment_url),
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      mappedRecords = mappedRecords.filter((rec) => {
        return (
          rec.title.toLowerCase().includes(q) ||
          rec.patient_name.toLowerCase().includes(q) ||
          (rec.doctor_or_facility && rec.doctor_or_facility.toLowerCase().includes(q)) ||
          (rec.diagnosis_notes && rec.diagnosis_notes.toLowerCase().includes(q)) ||
          (rec.family_name && rec.family_name.toLowerCase().includes(q))
        );
      });
    }

    const totalCount = mappedRecords.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedRecords = mappedRecords.slice(startIndex, startIndex + pageSize);

    return {
      records: paginatedRecords,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err) {
    console.warn('[medicalRecordService] Exception tak terduga, fallback ke local store:', err);
    return getFilteredLocalRecords(options);
  }
}

function getFilteredLocalRecords(
  options: MedicalRecordQueryOptions
): MedicalRecordQueryResult {
  const {
    search = '',
    typeFilter = 'all',
    hasDiagnosisFilter = 'all',
    page = 1,
    pageSize = 10,
  } = options;

  let filtered = [...localRecordsStore];

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter((r) => r.record_type === typeFilter);
  }

  if (hasDiagnosisFilter === 'with_diagnosis') {
    filtered = filtered.filter((r) => r.diagnosis_notes && r.diagnosis_notes.trim().length > 0);
  } else if (hasDiagnosisFilter === 'without_diagnosis') {
    filtered = filtered.filter((r) => !r.diagnosis_notes || r.diagnosis_notes.trim().length === 0);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((r) => {
      return (
        r.title.toLowerCase().includes(q) ||
        r.patient_name.toLowerCase().includes(q) ||
        (r.doctor_or_facility && r.doctor_or_facility.toLowerCase().includes(q)) ||
        (r.diagnosis_notes && r.diagnosis_notes.toLowerCase().includes(q)) ||
        (r.family_name && r.family_name.toLowerCase().includes(q))
      );
    });
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (page - 1) * pageSize;
  const records = filtered.slice(startIndex, startIndex + pageSize);

  return {
    records,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Mengambil detail 1 berkas rekam medis berdasarkan ID
 */
export async function getMedicalRecordDetail(
  id: string
): Promise<AdminMedicalRecord | null> {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select(
        `
        id,
        family_member_id,
        title,
        record_type,
        doctor_or_facility,
        record_date,
        diagnosis_notes,
        attachment_url,
        created_at,
        updated_at,
        family_members (
          id,
          name,
          relationship,
          family_id,
          families (
            id,
            family_name,
            created_by,
            profiles:created_by (
              id,
              full_name,
              callsign,
              email
            )
          )
        )
      `
      )
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      const local = localRecordsStore.find((r) => r.id === id);
      return local || null;
    }

    const famMember = (data as any).family_members;
    const family = famMember?.families;
    const ownerProfile = family?.profiles;

    return {
      id: data.id,
      family_member_id: data.family_member_id,
      patient_name: famMember?.name || 'Pasien CareFam',
      relationship: famMember?.relationship || 'Anggota',
      family_name: family?.family_name || 'Keluarga CareFam',
      account_owner:
        ownerProfile?.callsign ||
        ownerProfile?.full_name ||
        ownerProfile?.email ||
        'Pengguna',
      title: data.title,
      record_type: data.record_type as RecordType,
      doctor_or_facility: data.doctor_or_facility || null,
      record_date: data.record_date,
      diagnosis_notes: data.diagnosis_notes || null,
      attachment_url: data.attachment_url || null,
      file_name: extractFileName(data.attachment_url),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.warn('[medicalRecordService] Gagal memuat detail rekam medis:', err);
    return localRecordsStore.find((r) => r.id === id) || null;
  }
}

/**
 * Menghasilkan Signed URL aman untuk mengakses berkas lampiran rekam medis
 */
export async function getMedicalRecordFileUrl(
  attachmentUrl: string | null
): Promise<string | null> {
  if (!attachmentUrl) return null;

  if (
    attachmentUrl.startsWith('http://') ||
    attachmentUrl.startsWith('https://')
  ) {
    return attachmentUrl;
  }

  try {
    let storagePath = attachmentUrl;
    if (storagePath.startsWith('medical-records/')) {
      storagePath = storagePath.replace('medical-records/', '');
    }

    const { data, error } = await supabase.storage
      .from('medical-records')
      .createSignedUrl(storagePath, 3600);

    if (error) {
      console.warn('[medicalRecordService] Gagal membuat signed URL storage:', error.message);
      const { data: pubData } = supabase.storage
        .from('medical-records')
        .getPublicUrl(storagePath);
      return pubData?.publicUrl || null;
    }

    return data?.signedUrl || null;
  } catch (err) {
    console.error('[medicalRecordService] Exception signed URL:', err);
    return null;
  }
}
