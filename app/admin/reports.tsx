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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getAdminReports,
  updateReportStatus,
} from '../../services/reportService';
import {
  ReportStatus,
  ReportStatusSummary,
  ReportType,
  UserReport,
} from '../../types/admin';
import { styles, reportColors } from '../../styles/adminReports.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

// Filter Kategori Tipe Laporan
interface TypeFilterItem {
  key: string;
  label: string;
  type?: ReportType;
}

const TYPE_FILTERS: TypeFilterItem[] = [
  { key: 'all', label: 'Semua Tipe' },
  { key: 'data_issue', label: 'Kesalahan Data', type: 'data_issue' },
  { key: 'abuse', label: 'Penyalahgunaan', type: 'abuse' },
  { key: 'complaint', label: 'Keluhan Layanan', type: 'complaint' },
  { key: 'other', label: 'Lainnya', type: 'other' },
];

// Filter Status
interface StatusFilterItem {
  key: string;
  label: string;
  status?: ReportStatus;
}

const STATUS_FILTERS: StatusFilterItem[] = [
  { key: 'all', label: 'Semua Status' },
  { key: 'pending', label: 'Menunggu', status: 'pending' },
  { key: 'in_progress', label: 'Diproses', status: 'in_progress' },
  { key: 'resolved', label: 'Selesai', status: 'resolved' },
  { key: 'rejected', label: 'Ditolak', status: 'rejected' },
];

// Helper Badge Tipe Laporan
const getTypeBadge = (type: ReportType) => {
  switch (type) {
    case 'data_issue':
      return { label: 'Kesalahan Data', bg: '#FEF3C7', border: '#FDE68A', text: '#B45309' };
    case 'abuse':
      return { label: 'Penyalahgunaan', bg: '#FEE2E2', border: '#FECACA', text: '#DC2626' };
    case 'complaint':
      return { label: 'Keluhan Layanan', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' };
    case 'other':
      return { label: 'Lainnya', bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
    default:
      return { label: type, bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
  }
};

// Helper Badge Status Laporan
const getStatusBadge = (status: ReportStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu', bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', icon: 'time-outline' as const };
    case 'in_progress':
      return { label: 'Diproses', bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', icon: 'sync-outline' as const };
    case 'resolved':
      return { label: 'Selesai', bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', icon: 'checkmark-circle-outline' as const };
    case 'rejected':
      return { label: 'Ditolak', bg: '#F3F4F6', border: '#E5E7EB', text: '#6B7280', icon: 'close-circle-outline' as const };
    default:
      return { label: status, bg: '#F1F5F9', border: '#CBD5E1', text: '#475569', icon: 'help-circle-outline' as const };
  }
};

export default function AdminReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State pencarian, filter, dan pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State data laporan
  const [reports, setReports] = useState<UserReport[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<ReportStatusSummary>({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Detail & Form Tindak Lanjut Modal
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editStatus, setEditStatus] = useState<ReportStatus>('pending');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Fungsi memuat data laporan dari Supabase
  const loadReports = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const result = await getAdminReports({
          search: searchQuery,
          typeFilter: selectedType,
          statusFilter: selectedStatus,
          page: targetPage,
          pageSize,
        });

        setReports(result.reports);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
        setSummary(result.summary);
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'Gagal memuat laporan pengaduan. Silakan periksa koneksi Anda.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedType, selectedStatus, page]
  );

  // Muat data saat filter berubah
  useEffect(() => {
    loadReports(1);
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = () => {
    loadReports(1);
  };

  const handleRefresh = () => {
    loadReports(1, true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/admin/dashboard');
    }
  };

  // Buka Modal Detail & Tindak Lanjut
  const handleOpenDetail = (report: UserReport) => {
    setSelectedReport(report);
    setEditStatus(report.status);
    setEditAdminNotes(report.admin_notes || '');
    setIsDetailModalVisible(true);
  };

  // Simpan Tindak Lanjut Admin
  const handleSaveStatus = async () => {
    if (!selectedReport) return;

    setIsSavingStatus(true);
    try {
      const updated = await updateReportStatus(selectedReport.id, {
        status: editStatus,
        admin_notes: editAdminNotes.trim() || null,
      });

      // Perbarui selected report di modal & daftar laporan
      setSelectedReport(updated);
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      if (Platform.OS === 'web') {
        window.alert('Status dan catatan tindak lanjut laporan berhasil disimpan!');
      } else {
        Alert.alert('Sukses', 'Status dan catatan penanganan laporan berhasil diperbarui.');
      }

      // Muat ulang ringkasan data di background
      loadReports(page, true);
    } catch (err: any) {
      const msg = err?.message || 'Gagal menyimpan perubahan status.';
      if (Platform.OS === 'web') {
        window.alert(`Gagal: ${msg}`);
      } else {
        Alert.alert('Gagal Memperbarui', msg);
      }
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Format tanggal dan waktu
  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
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
      {/* Header Gradien Admin CareFam */}
      <LinearGradient
        colors={[adminColors.pastelBlue, adminColors.lavender, adminColors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.headerGradient,
          { paddingTop: Math.max(insets.top + 8, 44) },
        ]}
      >
        <View style={styles.headerTopNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Dashboard Admin"
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={17} color={adminColors.textPrimary} />
            <Text style={styles.backButtonText}>Dashboard</Text>
          </Pressable>

          <View style={styles.headerBadge}>
            <Ionicons name="shield-checkmark" size={14} color={reportColors.primaryDark} />
            <Text style={styles.headerBadgeText}>Report Management</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Manajemen Laporan</Text>
        <Text style={styles.headerSubtitle}>
          Tangani laporan data, potensi penyalahgunaan, dan keluhan layanan dari pengguna CareFam.
        </Text>
      </LinearGradient>

      {/* Bar Metrik Rekap Status Laporan */}
      <View style={styles.summaryRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tampilkan semua status"
          style={[
            styles.summaryPill,
            selectedStatus === 'all' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={styles.summaryNumber}>{summary.total}</Text>
          <Text style={styles.summaryLabel}>Total Masuk</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter laporan menunggu"
          style={[
            styles.summaryPill,
            selectedStatus === 'pending' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('pending')}
        >
          <Text style={[styles.summaryNumber, { color: '#D97706' }]}>
            {summary.pending}
          </Text>
          <Text style={styles.summaryLabel}>Menunggu</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter laporan diproses"
          style={[
            styles.summaryPill,
            selectedStatus === 'in_progress' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('in_progress')}
        >
          <Text style={[styles.summaryNumber, { color: '#2563EB' }]}>
            {summary.in_progress}
          </Text>
          <Text style={styles.summaryLabel}>Diproses</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter laporan selesai"
          style={[
            styles.summaryPill,
            selectedStatus === 'resolved' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('resolved')}
        >
          <Text style={[styles.summaryNumber, { color: '#059669' }]}>
            {summary.resolved}
          </Text>
          <Text style={styles.summaryLabel}>Selesai</Text>
        </Pressable>
      </View>

      {/* Kotak Pencarian & Filter */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={adminColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari judul laporan, pelapor, atau isi keluhan..."
            placeholderTextColor={adminColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                loadReports(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Kategori Tipe Laporan */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {TYPE_FILTERS.map((item) => {
            const isSelected = selectedType === item.key;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${item.label}`}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSelectedType(item.key)}
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
      </View>

      {/* Konten Daftar Laporan */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={adminColors.royalBlue} />
          <Text style={{ marginTop: 12, color: adminColors.textMuted, fontSize: 13 }}>
            Memuat arsip laporan pengaduan dari Supabase...
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
          <Text style={styles.stateTitle}>Gagal Mengambil Laporan</Text>
          <Text style={styles.stateSubtitle}>{errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Muat ulang laporan"
            style={styles.retryButton}
            onPress={() => loadReports(1)}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.stateContainer}>
          <Ionicons name="folder-open-outline" size={40} color={adminColors.textMuted} />
          <Text style={styles.stateTitle}>Tidak Ada Laporan Ditemukan</Text>
          <Text style={styles.stateSubtitle}>
            {searchQuery
              ? `Tidak ada laporan yang sesuai dengan kata kunci "${searchQuery}".`
              : 'Tidak ada laporan pengaduan pada kategori atau status yang dipilih.'}
          </Text>
          {searchQuery || selectedType !== 'all' || selectedStatus !== 'all' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset seluruh filter"
              style={styles.retryButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
            >
              <Text style={styles.retryButtonText}>Reset Semua Filter</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[adminColors.royalBlue]}
              tintColor={adminColors.royalBlue}
            />
          }
          renderItem={({ item }) => {
            const typeBadge = getTypeBadge(item.report_type);
            const statusBadge = getStatusBadge(item.status);

            return (
              <View style={styles.card}>
                {/* Header Kartu: Badges & Tanggal */}
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor: typeBadge.bg,
                          borderColor: typeBadge.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          { color: typeBadge.text },
                        ]}
                      >
                        {typeBadge.label}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: statusBadge.bg,
                          borderColor: statusBadge.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={statusBadge.icon}
                        size={12}
                        color={statusBadge.text}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: statusBadge.text },
                        ]}
                      >
                        {statusBadge.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDateTime(item.created_at)}
                  </Text>
                </View>

                {/* Judul Laporan */}
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Info Pelapor */}
                <View style={styles.reporterInfoRow}>
                  <Ionicons name="person-circle-outline" size={16} color={adminColors.royalBlue} />
                  <Text style={styles.reporterName}>{item.reporter_name}</Text>
                  {item.reporter_email ? (
                    <Text style={styles.reporterEmail} numberOfLines={1}>
                      • {item.reporter_email}
                    </Text>
                  ) : null}
                </View>

                {/* Ringkasan Isi Laporan */}
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Snippet Catatan Tindak Lanjut Admin (jika ada) */}
                {item.admin_notes ? (
                  <View style={styles.adminNotesSnippet}>
                    <Text style={styles.adminNotesSnippetTitle}>TINDAK LANJUT ADMIN</Text>
                    <Text style={styles.adminNotesSnippetText} numberOfLines={2}>
                      {item.admin_notes}
                    </Text>
                  </View>
                ) : null}

                {/* Footer Kartu: ID & Tombol Aksi */}
                <View style={styles.cardFooter}>
                  <Text style={styles.reportIdText}>
                    ID: {item.id.slice(0, 8)}...
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat detail laporan ${item.title}`}
                    style={styles.actionButton}
                    onPress={() => handleOpenDetail(item)}
                  >
                    <Text style={styles.actionButtonText}>Detail & Tindak Lanjut</Text>
                    <Ionicons name="arrow-forward" size={13} color={adminColors.royalBlue} />
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
                    if (page > 1) loadReports(page - 1);
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
                    if (page < totalPages) loadReports(page + 1);
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

      {/* ===== Modal Detail & Tindak Lanjut Laporan ===== */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  Rincian Laporan Pengaduan
                </Text>
                <Text style={{ fontSize: 12, color: adminColors.textMuted }}>
                  Verifikasi dan pembaruan status penanganan
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tutup rincian laporan"
                style={styles.modalCloseButton}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={adminColors.textPrimary} />
              </Pressable>
            </View>

            {selectedReport ? (
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 48, 60) }}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Seksi Identitas Pelapor */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Identitas Pelapor</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Nama Pelapor</Text>
                      <Text style={styles.infoGridValue}>{selectedReport.reporter_name}</Text>
                    </View>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Alamat Email</Text>
                      <Text style={styles.infoGridValue}>
                        {selectedReport.reporter_email || 'Tidak dicantumkan'}
                      </Text>
                    </View>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Waktu Masuk</Text>
                      <Text style={styles.infoGridValue}>
                        {formatDateTime(selectedReport.created_at)}
                      </Text>
                    </View>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>ID Tiket</Text>
                      <Text style={[styles.infoGridValue, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 11 }]}>
                        {selectedReport.id}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2. Seksi Isi Lengkap Laporan */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Isi Laporan Pengguna</Text>
                  <View style={styles.reportContentCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor: getTypeBadge(selectedReport.report_type).bg,
                            borderColor: getTypeBadge(selectedReport.report_type).border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeText,
                            { color: getTypeBadge(selectedReport.report_type).text },
                          ]}
                        >
                          {getTypeBadge(selectedReport.report_type).label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.reportContentTitle}>
                      {selectedReport.title}
                    </Text>

                    <Text style={styles.reportContentBody}>
                      {selectedReport.description}
                    </Text>
                  </View>
                </View>

                {/* 3. Seksi Tindak Lanjut & Status Admin */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Tindak Lanjut & Status Penanganan</Text>
                  <View style={styles.statusActionCard}>
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: adminColors.textSecondary, marginBottom: 10 }}>
                      Pilih Status Penanganan:
                    </Text>

                    {/* Tombol Opsi Status */}
                    <View style={styles.statusButtonsGrid}>
                      {(['pending', 'in_progress', 'resolved', 'rejected'] as ReportStatus[]).map(
                        (stat) => {
                          const isCurrent = editStatus === stat;
                          const badge = getStatusBadge(stat);

                          return (
                            <Pressable
                              key={stat}
                              accessibilityRole="button"
                              accessibilityLabel={`Ubah status ke ${badge.label}`}
                              style={[
                                styles.statusOptionButton,
                                isCurrent && styles.statusOptionButtonActive,
                              ]}
                              onPress={() => setEditStatus(stat)}
                            >
                              <Ionicons
                                name={badge.icon}
                                size={16}
                                color={isCurrent ? adminColors.royalBlue : badge.text}
                              />
                              <Text
                                style={[
                                  styles.statusOptionText,
                                  isCurrent && styles.statusOptionTextActive,
                                ]}
                              >
                                {badge.label}
                              </Text>
                            </Pressable>
                          );
                        }
                      )}
                    </View>

                    {/* Catatan Penanganan Admin */}
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: adminColors.textSecondary, marginBottom: 6 }}>
                      Catatan Tindak Lanjut / Solusi Admin:
                    </Text>
                    <TextInput
                      style={styles.adminNotesInput}
                      placeholder="Tuliskan catatan langkah penanganan, hasil verifikasi, atau alasan penolakan..."
                      placeholderTextColor={adminColors.textMuted}
                      multiline
                      value={editAdminNotes}
                      onChangeText={setEditAdminNotes}
                    />

                    {selectedReport.resolved_at ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <Ionicons name="checkmark-done-circle" size={15} color="#059669" />
                        <Text style={{ fontSize: 11.5, color: '#059669', fontWeight: '600' }}>
                          Dinyatakan selesai pada: {formatDateTime(selectedReport.resolved_at)}
                        </Text>
                      </View>
                    ) : null}

                    {/* Tombol Simpan */}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Simpan status dan catatan tindak lanjut"
                      style={[
                        styles.saveStatusButton,
                        isSavingStatus && styles.saveStatusButtonDisabled,
                      ]}
                      onPress={handleSaveStatus}
                      disabled={isSavingStatus}
                    >
                      {isSavingStatus ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="save-outline" size={17} color="#FFFFFF" />
                          <Text style={styles.saveStatusButtonText}>
                            Simpan Perubahan Status
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
