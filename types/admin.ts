/**
 * Kontrak tipe untuk modul Administrator CareFam:
 * - Statistik Dashboard Admin
 * - User Management
 */

export interface AdminDashboardMetrics {
  totalUsers: number | null;
  totalFamilyMembers: number | null;
  totalFacilities: number | null;
  totalReports: number | null;
  isLoading: boolean;
  error: string | null;
}

export type UserRole = 'user' | 'admin';

export interface AdminUserProfile {
  id: string;
  callsign: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type UserFilterRole = 'all' | 'user' | 'admin';

export interface AdminUsersQueryOptions {
  search?: string;
  roleFilter?: UserFilterRole;
  page?: number;
  pageSize?: number;
}

export interface AdminUsersResult {
  users: AdminUserProfile[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Hospital Management =====
export type FacilityType =
  | 'Rumah Sakit'
  | 'Klinik'
  | 'Puskesmas'
  | 'Laboratorium'
  | 'Apotek';

export interface Hospital {
  id: string;
  name: string;
  facility_type: FacilityType;
  address: string;
  city: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHospitalParams {
  name: string;
  facility_type: FacilityType;
  address: string;
  city?: string | null;
  phone?: string | null;
  is_active?: boolean;
}

export interface UpdateHospitalParams {
  name?: string;
  facility_type?: FacilityType;
  address?: string;
  city?: string | null;
  phone?: string | null;
  is_active?: boolean;
}

export interface HospitalQueryOptions {
  search?: string;
  typeFilter?: string; // 'all' | FacilityType
  page?: number;
  pageSize?: number;
}

export interface HospitalQueryResult {
  hospitals: Hospital[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Health Education Management =====
export type EducationCategory =
  | 'Umum'
  | 'Nutrisi'
  | 'Kesehatan Anak'
  | 'Lansia'
  | 'Penyakit Kronis'
  | 'Gaya Hidup';

export type ArticleStatus = 'draft' | 'published';

export interface HealthEducationArticle {
  id: string;
  title: string;
  category: EducationCategory;
  summary: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleParams {
  title: string;
  category: EducationCategory;
  summary: string;
  content: string;
  image_url?: string | null;
  author_name?: string | null;
  status?: ArticleStatus;
}

export interface UpdateArticleParams {
  title?: string;
  category?: EducationCategory;
  summary?: string;
  content?: string;
  image_url?: string | null;
  author_name?: string | null;
  status?: ArticleStatus;
}

export interface EducationQueryOptions {
  search?: string;
  categoryFilter?: string; // 'all' | EducationCategory
  statusFilter?: string; // 'all' | ArticleStatus
  page?: number;
  pageSize?: number;
}

export interface EducationQueryResult {
  articles: HealthEducationArticle[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Medical Records Management =====
export type RecordType =
  | 'diagnosis'
  | 'lab_result'
  | 'prescription'
  | 'vaccine'
  | 'checkup'
  | 'other';

export interface AdminMedicalRecord {
  id: string;
  family_member_id: string;
  patient_name: string;
  relationship?: string;
  family_name?: string;
  account_owner?: string;
  title: string;
  record_type: RecordType;
  doctor_or_facility: string | null;
  record_date: string;
  diagnosis_notes: string | null;
  attachment_url: string | null;
  file_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordQueryOptions {
  search?: string;
  typeFilter?: string; // 'all' | RecordType
  hasDiagnosisFilter?: string; // 'all' | 'with_diagnosis' | 'without_diagnosis'
  page?: number;
  pageSize?: number;
}

export interface MedicalRecordQueryResult {
  records: AdminMedicalRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ParsedMedicalNotes {
  userComplaints: string | null;
  clinicalDiagnosis: string | null;
  recommendations: string | null;
  labMetrics?: Array<{ label: string; value: string; isAbnormal?: boolean }>;
}

export interface CreateMedicalRecordParams {
  family_member_id: string;
  title: string;
  record_type: RecordType;
  doctor_or_facility?: string | null;
  record_date: string;
  user_complaints?: string | null;
  diagnosis_notes?: string | null;
  recommendations?: string | null;
  attachment_url?: string | null;
  file?: {
    name: string;
    size?: number;
    type?: string;
    file?: File | Blob;
    uri?: string;
  };
}

// ===== Report Management =====
export type ReportType = 'data_issue' | 'abuse' | 'complaint' | 'other';
export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface UserReport {
  id: string;
  reporter_id: string | null;
  reporter_name: string;
  reporter_email: string | null;
  report_type: ReportType;
  title: string;
  description: string;
  attachment_url: string | null;
  status: ReportStatus;
  admin_notes: string | null;
  handled_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportQueryOptions {
  search?: string;
  typeFilter?: string; // 'all' | ReportType
  statusFilter?: string; // 'all' | ReportStatus
  page?: number;
  pageSize?: number;
}

export interface ReportStatusSummary {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

export interface ReportQueryResult {
  reports: UserReport[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: ReportStatusSummary;
}

export interface UpdateReportStatusParams {
  status: ReportStatus;
  admin_notes?: string | null;
}

// ===== SOS Monitoring =====
export type SOSEmergencyType = 'medis' | 'lansia' | 'kecelakaan' | 'anak' | 'lainnya';
export type SOSStatus = 'active' | 'responding' | 'resolved' | 'cancelled';

export interface SOSRequest {
  id: string;
  user_id: string | null;
  caller_name: string;
  phone_number: string;
  family_member_name: string | null;
  emergency_type: SOSEmergencyType;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  location_address: string | null;
  status: SOSStatus;
  responder_notes: string | null;
  dispatched_facility: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SOSQueryOptions {
  search?: string;
  typeFilter?: string; // 'all' | SOSEmergencyType
  statusFilter?: string; // 'all' | SOSStatus
  page?: number;
  pageSize?: number;
}

export interface SOSStatusSummary {
  total: number;
  active: number;
  responding: number;
  resolved: number;
  cancelled: number;
}

export interface SOSQueryResult {
  requests: SOSRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: SOSStatusSummary;
}

export interface UpdateSOSStatusParams {
  status: SOSStatus;
  responder_notes?: string | null;
  dispatched_facility?: string | null;
}




