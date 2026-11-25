import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminMedicalRecords,
  getMedicalRecordFileUrl,
  parseMedicalNotes,
} from '../../services/medicalRecordService';
import { AdminMedicalRecord, RecordType } from '../../types/admin';
import { styles, medicalColors } from '../../styles/adminMedicalRecords.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

// Kategori Filter Dokumen Medis
interface TypeFilterOption {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TYPE_FILTER_OPTIONS: TypeFilterOption[] = [
  { key: 'all', label: 'Semua Berkas', icon: 'documents-outline' },
  { key: 'lab_result', label: 'Hasil Lab', icon: 'flask-outline' },
  { key: 'prescription', label: 'Resep Obat', icon: 'receipt-outline' },
  { key: 'diagnosis', label: 'Diagnosis', icon: 'fitness-outline' },
  { key: 'vaccine', label: 'Vaksin', icon: 'shield-outline' },
  { key: 'checkup', label: 'Check-up', icon: 'clipboard-outline' },
  { key: 'other', label: 'Lainnya', icon: 'folder-outline' },
];

// Pemetaan Gaya & Label Tipe Dokumen
const getRecordTypeBadge = (type: RecordType) => {
  switch (type) {
    case 'lab_result':
      return {
        label: 'Hasil Lab',
        bg: '#EDE9FE',
        text: '#7C3AED',
        icon: 'flask' as const,
      };
    case 'prescription':
      return {
        label: 'Resep Obat',
        bg: '#FEF3C7',
        text: '#D97706',
        icon: 'receipt' as const,
      };
    case 'diagnosis':
      return {
        label: 'Diagnosis',
        bg: '#CCFBF1',
        text: '#0D9488',
        icon: 'fitness' as const,
      };
    case 'vaccine':
      return {
        label: 'Vaksin',
        bg: '#DBEAFE',
        text: '#2563EB',
        icon: 'shield-checkmark' as const,
      };
    case 'checkup':
      return {
        label: 'Check-up',
        bg: '#E0E7FF',
        text: '#4F46E5',
        icon: 'clipboard' as const,
      };
    case 'other':
    default:
      return {
        label: 'Lainnya',
        bg: '#F1F5F9',
        text: '#475569',
        icon: 'folder' as const,
      };
  }
};

export default function AdminMedicalRecordsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Otorisasi: Verifikasi hak akses Administrator
  const isAdmin =
    user?.user_metadata?.role === 'admin' ||
    user?.email?.includes('admin');

  // State Pencarian & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [hasDiagnosisFilter, setHasDiagnosisFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // State Data Rekam Medis
  const [records, setRecords] = useState<AdminMedicalRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Modal Detail Rekam Medis
  const [selectedRecord, setSelectedRecord] = useState<AdminMedicalRecord | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isFileOpening, setIsFileOpening] = useState(false);

  // Memuat data rekam medis dari Supabase Service
  const loadRecords = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getAdminMedicalRecords({
          search: searchQuery,
          typeFilter,
          hasDiagnosisFilter,
          page: targetPage,
          pageSize,
        });

        setRecords(result.records);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Gagal memuat arsip rekam medis.');
        } else {
          setError('Terjadi kesalahan saat memuat rekam medis.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, typeFilter, hasDiagnosisFilter, page]
  );

  // Muat data saat filter berubah
  useEffect(() => {
    loadRecords(1);
  }, [typeFilter, hasDiagnosisFilter]);

  // Handler Buka Detail
  const handleOpenDetail = (record: AdminMedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // Handler Buka / Unduh Berkas Medis Aman (Signed URL)
  const handleOpenFile = async (attachmentUrl: string | null) => {
    if (!attachmentUrl) {
      if (Platform.OS === 'web') {
        window.alert('Tidak ada berkas digital yang terlampir.');
      } else {
        Alert.alert('Informasi', 'Tidak ada berkas digital yang terlampir.');
      }
      return;
    }

    setIsFileOpening(true);
    try {
      const fileUrl = await getMedicalRecordFileUrl(attachmentUrl);
      if (!fileUrl) {
        throw new Error('Gagal membuat tautan akses aman ke berkas rekam medis.');
      }

      if (Platform.OS === 'web') {
        window.open(fileUrl, '_blank');
      } else {
        const canOpen = await Linking.canOpenURL(fileUrl);
        if (canOpen) {
          await Linking.openURL(fileUrl);
        } else {
          Alert.alert('Gagal Membuka Berkas', 'Perangkat tidak mendukung pembukaan tautan ini.');
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Terjadi kesalahan saat mengakses berkas medis.';
      if (Platform.OS === 'web') {
        window.alert(errMsg);
      } else {
        Alert.alert('Gagal Mengakses Berkas', errMsg);
      }
    } finally {
      setIsFileOpening(false);
    }
  };

  // Format Tanggal
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Format Tanggal & Jam Lengkap
  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== Hero Header (Pastel Teal / Cyan Gradient) ===== */}
      <LinearGradient
        colors={[medicalColors.bgPastel, '#E6FFFA', adminColors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top + 10, 20) }]}
      >
        <View style={styles.headerTopNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Dashboard Admin"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={adminColors.textPrimary} />
          </Pressable>

          <View style={styles.headerTitleBadge}>
            <Ionicons name="shield-checkmark" size={14} color={medicalColors.primary} />
            <Text style={styles.headerBadgeText}>Akses Administrator</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Medical Records</Text>
        <Text style={styles.headerSubtitle}>
          Pantau berkas rekam medis dan hasil diagnosis pengguna secara aman
        </Text>
      </LinearGradient>

      {/* ===== Search & Filter Controls ===== */}
      <View style={styles.controlsContainer}>
        {/* Kolom Pencarian */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={adminColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari judul berkas, nama pasien, dokter..."
            placeholderTextColor={adminColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => loadRecords(1)}
            returnKeyType="search"
          />
          {searchQuery ? (
            <Pressable
              onPress={() => {
                setSearchQuery('');
                loadRecords(1);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={16} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Kategori Dokumen (Horizontal Chips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {TYPE_FILTER_OPTIONS.map((item) => {
            const isSelected = typeFilter === item.key;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${item.label}`}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setTypeFilter(item.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Sub-Filter: Status Ketersediaan Catatan Diagnosis */}
        <View style={styles.subFilterRow}>
          <Text style={{ fontSize: 11, color: adminColors.textMuted, fontWeight: '600' }}>
            Filter Diagnosis:
          </Text>

          <Pressable
            style={[
              styles.subFilterPill,
              hasDiagnosisFilter === 'all' && styles.subFilterPillActive,
            ]}
            onPress={() => setHasDiagnosisFilter('all')}
          >
            <Text
              style={[
                styles.subFilterPillText,
                hasDiagnosisFilter === 'all' && styles.subFilterPillTextActive,
              ]}
            >
              Semua
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.subFilterPill,
              hasDiagnosisFilter === 'with_diagnosis' && styles.subFilterPillActive,
            ]}
            onPress={() => setHasDiagnosisFilter('with_diagnosis')}
          >
            <Text
              style={[
                styles.subFilterPillText,
                hasDiagnosisFilter === 'with_diagnosis' && styles.subFilterPillTextActive,
              ]}
            >
              🩺 Ada Hasil Analisis
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.subFilterPill,
              hasDiagnosisFilter === 'without_diagnosis' && styles.subFilterPillActive,
            ]}
            onPress={() => setHasDiagnosisFilter('without_diagnosis')}
          >
            <Text
              style={[
                styles.subFilterPillText,
                hasDiagnosisFilter === 'without_diagnosis' && styles.subFilterPillTextActive,
              ]}
            >
              ⏳ Belum Ada Hasil
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Baris Total Counter */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          Total Arsip: <Text style={styles.countNumber}>{totalCount}</Text> berkas
        </Text>
        <Text style={{ fontSize: 11.5, color: adminColors.textMuted }}>
          Halaman {page} dari {totalPages}
        </Text>
      </View>

      {/* ===== FlatList Rekam Medis ===== */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={medicalColors.primary} />
          <Text style={styles.loadingText}>Memuat rekam medis dari database...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
          <Text style={styles.errorTitle}>Gagal Mengambil Data</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadRecords(page)}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="document-text-outline" size={32} color={medicalColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Tidak Ada Berkas Medis</Text>
          <Text style={styles.emptySubtitle}>
            Belum ada berkas rekam medis yang sesuai dengan kriteria pencarian atau filter yang dipilih.
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 28) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadRecords(1, true)}
              tintColor={medicalColors.primary}
            />
          }
          renderItem={({ item }) => {
            const badge = getRecordTypeBadge(item.record_type);
            const hasDiagnosis = !!(item.diagnosis_notes && item.diagnosis_notes.trim().length > 0);

            return (
              <View style={styles.card}>
                {/* Header Kartu: Tipe Dokumen & Tanggal Periksa */}
                <View style={styles.cardHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon} size={12} color={badge.text} />
                    <Text style={[styles.typeBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>

                  <Text style={styles.recordDateText}>
                    📅 {formatDate(item.record_date)}
                  </Text>
                </View>

                {/* Judul Rekam Medis */}
                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* Info Pasien & Akun Keluarga */}
                <View style={styles.patientInfoRow}>
                  <Ionicons name="person-circle-outline" size={16} color={medicalColors.primary} />
                  <Text style={styles.patientNameText}>{item.patient_name}</Text>
                  {item.relationship ? (
                    <Text style={styles.patientRelationText}>({item.relationship})</Text>
                  ) : null}
                  {item.account_owner ? (
                    <Text style={styles.accountOwnerText} numberOfLines={1}>
                      • Akun: {item.account_owner}
                    </Text>
                  ) : null}
                </View>

                {/* Info Dokter / Faskes */}
                {item.doctor_or_facility ? (
                  <View style={styles.facilityRow}>
                    <Ionicons name="business-outline" size={14} color={adminColors.textMuted} />
                    <Text style={styles.facilityText} numberOfLines={1}>
                      {item.doctor_or_facility}
                    </Text>
                  </View>
                ) : null}

                {/* Catatan / Hasil Diagnosis yang Tersimpan */}
                {hasDiagnosis ? (
                  <View style={styles.diagnosisBox}>
                    <View style={styles.diagnosisHeaderRow}>
                      <Ionicons name="fitness" size={13} color={medicalColors.primaryDark} />
                      <Text style={styles.diagnosisLabel}>Hasil Diagnosis / Analisis Klinis:</Text>
                    </View>
                    <Text style={styles.diagnosisSnippet} numberOfLines={2}>
                      {item.diagnosis_notes}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noDiagnosisPill}>
                    <Ionicons name="information-circle-outline" size={13} color="#64748B" />
                    <Text style={styles.noDiagnosisText}>Belum ada hasil analisis</Text>
                  </View>
                )}

                {/* Footer Kartu: Status Berkas & Tombol Detail */}
                <View style={styles.cardFooter}>
                  <View style={styles.attachmentBadge}>
                    <Ionicons
                      name={item.attachment_url ? 'attach' : 'document-outline'}
                      size={14}
                      color={item.attachment_url ? medicalColors.primary : adminColors.textMuted}
                    />
                    <Text style={styles.attachmentText}>
                      {item.attachment_url
                        ? item.file_name || '1 Berkas Terlampir'
                        : 'Tanpa Berkas Digital'}
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat detail rekam medis ${item.title}`}
                    style={styles.detailButton}
                    onPress={() => handleOpenDetail(item)}
                  >
                    <Text style={styles.detailButtonText}>Lihat Detail</Text>
                    <Ionicons name="arrow-forward" size={13} color={medicalColors.primary} />
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.paginationRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Halaman sebelumnya"
                  style={[
                    styles.paginationButton,
                    page <= 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => {
                    if (page > 1) loadRecords(page - 1);
                  }}
                  disabled={page <= 1}
                >
                  <Ionicons name="chevron-back" size={16} color={adminColors.textPrimary} />
                </Pressable>

                <Text style={styles.paginationText}>
                  {page} / {totalPages}
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Halaman berikutnya"
                  style={[
                    styles.paginationButton,
                    page >= totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => {
                    if (page < totalPages) loadRecords(page + 1);
                  }}
                  disabled={page >= totalPages}
                >
                  <Ionicons name="chevron-forward" size={16} color={adminColors.textPrimary} />
                </Pressable>
              </View>
            ) : undefined
          }
        />
      )}

      {/* ===== Modal Detail Rekam Medis ===== */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  Rincian Rekam Medis
                </Text>
                <Text style={{ fontSize: 12, color: adminColors.textMuted }}>
                  Verifikasi administratif dokumen kesehatan
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tutup rincian rekam medis"
                style={styles.modalCloseButton}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={adminColors.textPrimary} />
              </Pressable>
            </View>

            {selectedRecord ? (() => {
              const parsedNotes = parseMedicalNotes(selectedRecord.diagnosis_notes);
              const hasNotes = Boolean(
                selectedRecord.diagnosis_notes && selectedRecord.diagnosis_notes.trim().length > 0
              );

              return (
                <ScrollView
                  style={styles.modalScroll}
                  contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 48, 60) }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* 1. Seksi Pasien & Akun */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Identitas Pasien</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Nama Pasien</Text>
                        <Text style={styles.infoGridValue}>{selectedRecord.patient_name}</Text>
                      </View>
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Hubungan Keluarga</Text>
                        <Text style={styles.infoGridValue}>
                          {selectedRecord.relationship || 'Anggota'}
                        </Text>
                      </View>
                      {selectedRecord.family_name ? (
                        <View style={styles.infoGridRow}>
                          <Text style={styles.infoGridLabel}>Unit Keluarga</Text>
                          <Text style={styles.infoGridValue}>{selectedRecord.family_name}</Text>
                        </View>
                      ) : null}
                      {selectedRecord.account_owner ? (
                        <View style={styles.infoGridRow}>
                          <Text style={styles.infoGridLabel}>Akun Pengunggah</Text>
                          <Text style={styles.infoGridValue}>{selectedRecord.account_owner}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* 2. Seksi Metadata Berkas */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Informasi Pemeriksaan</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Judul Tindakan</Text>
                        <Text style={styles.infoGridValue}>{selectedRecord.title}</Text>
                      </View>
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Jenis Dokumen</Text>
                        <Text style={styles.infoGridValue}>
                          {getRecordTypeBadge(selectedRecord.record_type).label}
                        </Text>
                      </View>
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Tanggal Pemeriksaan</Text>
                        <Text style={styles.infoGridValue}>
                          {formatDate(selectedRecord.record_date)}
                        </Text>
                      </View>
                      {selectedRecord.doctor_or_facility ? (
                        <View style={styles.infoGridRow}>
                          <Text style={styles.infoGridLabel}>Fasilitas / Dokter</Text>
                          <Text style={styles.infoGridValue}>
                            {selectedRecord.doctor_or_facility}
                          </Text>
                        </View>
                      ) : null}
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Waktu Unggah ke Sistem</Text>
                        <Text style={styles.infoGridValue}>
                          {formatDateTime(selectedRecord.created_at)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 3. Seksi Informasi Kesehatan Pasien (Keluhan) */}
                  {parsedNotes.userComplaints ? (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Keluhan / Catatan Pasien</Text>
                      <View style={styles.userNotesCard}>
                        <Text style={styles.userNotesText}>
                          {parsedNotes.userComplaints}
                        </Text>
                        <Text style={styles.userNotesSubtext}>
                          * Dilaporkan oleh pasien saat pengunggahan berkas medis
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {/* 4. Seksi Hasil Diagnosis & Analisis Medis Dokter */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Hasil Pemeriksaan & Diagnosis Dokter</Text>
                    {hasNotes ? (
                      <View style={styles.diagnosisDetailCard}>
                        <Text style={styles.diagnosisDetailText}>
                          {parsedNotes.clinicalDiagnosis || selectedRecord.diagnosis_notes}
                        </Text>

                        {/* Parameter Lab Terstruktur (Jika Ada) */}
                        {parsedNotes.labMetrics && parsedNotes.labMetrics.length > 0 ? (
                          <View style={styles.labMetricsBox}>
                            <Text style={styles.labMetricsTitle}>PARAMETER LABORATORIUM TERDETEKSI</Text>
                            <View style={styles.labMetricsGrid}>
                              {parsedNotes.labMetrics.map((metric, idx) => (
                                <View
                                  key={idx}
                                  style={[
                                    styles.labMetricBadge,
                                    metric.isAbnormal && styles.labMetricBadgeAbnormal,
                                  ]}
                                >
                                  <Text style={styles.labMetricLabel}>{metric.label}</Text>
                                  <Text
                                    style={[
                                      styles.labMetricValue,
                                      metric.isAbnormal && styles.labMetricValueAbnormal,
                                    ]}
                                  >
                                    {metric.value} {metric.isAbnormal ? '⚠️' : ''}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        ) : null}

                        <View style={styles.clinicalDisclaimer}>
                          <Ionicons name="alert-circle" size={15} color="#D97706" />
                          <Text style={styles.clinicalDisclaimerText}>
                            Data observasi medis ini tersimpan di basis data CareFam dan diverifikasi untuk kepatuhan riwayat kesehatan keluarga.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.infoGrid,
                          { backgroundColor: '#F8FAFC', alignItems: 'center', paddingVertical: 18 },
                        ]}
                      >
                        <Ionicons name="information-circle-outline" size={24} color="#94A3B8" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#64748B',
                            fontWeight: '600',
                            marginTop: 6,
                          }}
                        >
                          Belum ada hasil analisis
                        </Text>
                        <Text
                          style={{
                            fontSize: 11.5,
                            color: '#94A3B8',
                            textAlign: 'center',
                            marginTop: 2,
                            paddingHorizontal: 20,
                          }}
                        >
                          Dokumen ini diunggah tanpa ringkasan diagnosis teks atau masih menunggu pengisian catatan dari tenaga medis.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* 5. Seksi Rekomendasi & Tindak Lanjut Medis */}
                  {parsedNotes.recommendations ? (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Rekomendasi & Tindak Lanjut</Text>
                      <View style={styles.recommendationsCard}>
                        <Text style={styles.recommendationsText}>
                          {parsedNotes.recommendations}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {/* 6. Seksi Berkas Lampiran Digital */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Berkas Lampiran Digital</Text>
                    {selectedRecord.attachment_url ? (
                      <View>
                        <View style={styles.attachmentCard}>
                          <View style={styles.attachmentIconBox}>
                            <Ionicons
                              name={
                                selectedRecord.file_name?.endsWith('.jpg') ||
                                selectedRecord.file_name?.endsWith('.png')
                                  ? 'image-outline'
                                  : 'document-attach-outline'
                              }
                              size={22}
                              color={medicalColors.primary}
                            />
                          </View>
                          <View style={styles.attachmentInfo}>
                            <Text style={styles.attachmentName} numberOfLines={1}>
                              {selectedRecord.file_name || 'Berkas Lampiran Medis'}
                            </Text>
                            <Text style={styles.attachmentSubtext}>
                              Tersimpan di Supabase Storage (Private Bucket)
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Buka atau unduh berkas medis"
                          style={styles.openFileButton}
                          onPress={() => handleOpenFile(selectedRecord.attachment_url)}
                          disabled={isFileOpening}
                        >
                          {isFileOpening ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              <Ionicons name="open-outline" size={17} color="#FFFFFF" />
                              <Text style={styles.openFileButtonText}>
                                Buka / Unduh Berkas Medis
                              </Text>
                            </>
                          )}
                        </Pressable>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.infoGrid,
                          { backgroundColor: '#F8FAFC', alignItems: 'center', paddingVertical: 14 },
                        ]}
                      >
                        <Text style={{ fontSize: 12.5, color: adminColors.textMuted }}>
                          Tidak ada berkas digital yang dilampirkan pada arsip ini.
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              );
            })() : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
