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
import {
  getAdminSOSRequests,
  updateSOSStatus,
} from '../../services/sosService';
import {
  SOSEmergencyType,
  SOSRequest,
  SOSStatus,
  SOSStatusSummary,
} from '../../types/admin';
import { styles, sosColors } from '../../styles/adminSOS.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

// Filter Kategori Darurat
interface TypeFilterItem {
  key: string;
  label: string;
  type?: SOSEmergencyType;
}

const TYPE_FILTERS: TypeFilterItem[] = [
  { key: 'all', label: 'Semua Kategori' },
  { key: 'medis', label: 'Kondisi Medis', type: 'medis' },
  { key: 'lansia', label: 'Darurat Lansia', type: 'lansia' },
  { key: 'kecelakaan', label: 'Kecelakaan', type: 'kecelakaan' },
  { key: 'anak', label: 'Darurat Anak', type: 'anak' },
  { key: 'lainnya', label: 'Lainnya', type: 'lainnya' },
];

// Helper Badge Tipe Darurat
const getTypeBadge = (type: SOSEmergencyType) => {
  switch (type) {
    case 'medis':
      return { label: 'Medis Akut', bg: '#FEE2E2', border: '#FECACA', text: '#DC2626' };
    case 'lansia':
      return { label: 'Lansia', bg: '#FAF5FF', border: '#E9D5FF', text: '#9333EA' };
    case 'kecelakaan':
      return { label: 'Kecelakaan', bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' };
    case 'anak':
      return { label: 'Anak', bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' };
    case 'lainnya':
      return { label: 'Lainnya', bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
    default:
      return { label: type, bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
  }
};

// Helper Badge Status SOS
const getStatusBadge = (status: SOSStatus) => {
  switch (status) {
    case 'active':
      return { label: 'Darurat Aktif', bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626', icon: 'alert-circle' as const };
    case 'responding':
      return { label: 'Menuju Lokasi', bg: '#FEF3C7', border: '#FDE68A', text: '#D97706', icon: 'navigate' as const };
    case 'resolved':
      return { label: 'Selesai', bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', icon: 'checkmark-circle' as const };
    case 'cancelled':
      return { label: 'Dibatalkan', bg: '#F3F4F6', border: '#E5E7EB', text: '#6B7280', icon: 'close-circle' as const };
    default:
      return { label: status, bg: '#F1F5F9', border: '#CBD5E1', text: '#475569', icon: 'help-circle' as const };
  }
};

export default function AdminSOSScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State pencarian, filter, dan pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State data SOS
  const [requests, setRequests] = useState<SOSRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<SOSStatusSummary>({
    total: 0,
    active: 0,
    responding: 0,
    resolved: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Detail & Form Tindak Lanjut Modal
  const [selectedSOS, setSelectedSOS] = useState<SOSRequest | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editStatus, setEditStatus] = useState<SOSStatus>('active');
  const [editFacility, setEditFacility] = useState('');
  const [editResponderNotes, setEditResponderNotes] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Fungsi memuat data permintaan darurat SOS
  const loadRequests = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const result = await getAdminSOSRequests({
          search: searchQuery,
          typeFilter: selectedType,
          statusFilter: selectedStatus,
          page: targetPage,
          pageSize,
        });

        setRequests(result.requests);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
        setSummary(result.summary);
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'Gagal memuat permintaan bantuan darurat. Silakan periksa koneksi Anda.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedType, selectedStatus, page]
  );

  useEffect(() => {
    loadRequests(1);
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = () => {
    loadRequests(1);
  };

  const handleRefresh = () => {
    loadRequests(1, true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/admin/dashboard');
    }
  };

  // Buka Modal Detail & Tindak Lanjut
  const handleOpenDetail = (item: SOSRequest) => {
    setSelectedSOS(item);
    setEditStatus(item.status);
    setEditFacility(item.dispatched_facility || '');
    setEditResponderNotes(item.responder_notes || '');
    setIsDetailModalVisible(true);
  };

  // Panggil nomor darurat langsung
  const handleCallPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    if (!clean) return;
    Linking.openURL(`tel:${clean}`).catch(() => {
      Alert.alert('Kontak Darurat', `Nomor telepon pelapor: ${phone}`);
    });
  };

  // Simpan Tindak Lanjut Responder
  const handleSaveStatus = async () => {
    if (!selectedSOS) return;

    setIsSavingStatus(true);
    try {
      const updated = await updateSOSStatus(selectedSOS.id, {
        status: editStatus,
        dispatched_facility: editFacility.trim() || null,
        responder_notes: editResponderNotes.trim() || null,
      });

      setSelectedSOS(updated);
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      if (Platform.OS === 'web') {
        window.alert('Status penanganan SOS berhasil disimpan!');
      } else {
        Alert.alert('Sukses', 'Status penanganan darurat berhasil diperbarui.');
      }

      loadRequests(page, true);
    } catch (err: any) {
      const msg = err?.message || 'Gagal menyimpan status penanganan SOS.';
      if (Platform.OS === 'web') {
        window.alert(`Gagal: ${msg}`);
      } else {
        Alert.alert('Gagal Memperbarui', msg);
      }
    } finally {
      setIsSavingStatus(false);
    }
  };

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
      {/* Header Gradien Admin SOS */}
      <LinearGradient
        colors={[adminColors.pastelBlue, '#FFE4E6', adminColors.background]}
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
            <View style={styles.headerBadgeDot} />
            <Text style={styles.headerBadgeText}>SOS Monitoring</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Pemantauan Sinyal SOS</Text>
        <Text style={styles.headerSubtitle}>
          Pantau status darurat teknis, permintaan ambulans, dan evakuasi medis keluarga secara terpusat.
        </Text>
      </LinearGradient>

      {/* Bar Metrik Rekap Status SOS */}
      <View style={styles.summaryRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tampilkan semua status SOS"
          style={[
            styles.summaryPill,
            selectedStatus === 'all' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={styles.summaryNumber}>{summary.total}</Text>
          <Text style={styles.summaryLabel}>Total SOS</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter darurat aktif"
          style={[
            styles.summaryPill,
            selectedStatus === 'active' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('active')}
        >
          <Text style={[styles.summaryNumber, { color: sosColors.activeEmergency }]}>
            {summary.active}
          </Text>
          <Text style={styles.summaryLabel}>Darurat Aktif</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter menuju lokasi"
          style={[
            styles.summaryPill,
            selectedStatus === 'responding' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('responding')}
        >
          <Text style={[styles.summaryNumber, { color: sosColors.respondingAmber }]}>
            {summary.responding}
          </Text>
          <Text style={styles.summaryLabel}>Menuju Lokasi</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter selesai"
          style={[
            styles.summaryPill,
            selectedStatus === 'resolved' && styles.summaryPillActive,
          ]}
          onPress={() => setSelectedStatus('resolved')}
        >
          <Text style={[styles.summaryNumber, { color: sosColors.resolvedGreen }]}>
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
            placeholder="Cari nama pasien, no telp, faskes, atau alamat..."
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
                loadRequests(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Kategori Tipe Darurat */}
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

      {/* Konten Daftar Permintaan SOS */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={sosColors.primary} />
          <Text style={{ marginTop: 12, color: adminColors.textMuted, fontSize: 13 }}>
            Memuat radar sinyal bantuan darurat dari Supabase...
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={40} color={sosColors.primary} />
          <Text style={styles.stateTitle}>Gagal Mengambil Data SOS</Text>
          <Text style={styles.stateSubtitle}>{errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Muat ulang radar SOS"
            style={styles.retryButton}
            onPress={() => loadRequests(1)}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.stateContainer}>
          <Ionicons name="radio-outline" size={40} color={adminColors.textMuted} />
          <Text style={styles.stateTitle}>Tidak Ada Permintaan Bantuan</Text>
          <Text style={styles.stateSubtitle}>
            {searchQuery
              ? `Tidak ditemukan sinyal darurat dengan kata kunci "${searchQuery}".`
              : 'Saat ini tidak ada sinyal SOS aktif pada kategori yang dipilih. Seluruh sistem terpantau aman.'}
          </Text>
          {searchQuery || selectedType !== 'all' || selectedStatus !== 'all' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset seluruh filter SOS"
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
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[sosColors.primary]}
              tintColor={sosColors.primary}
            />
          }
          renderItem={({ item }) => {
            const typeBadge = getTypeBadge(item.emergency_type);
            const statusBadge = getStatusBadge(item.status);
            const isUrgent = item.status === 'active';

            return (
              <View style={[styles.card, isUrgent && styles.cardActiveUrgent]}>
                {/* Header Kartu: Badges & Waktu */}
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

                {/* Baris Pemanggil & Kontak Cepat */}
                <View style={styles.callerRow}>
                  <Text style={styles.callerNameText}>{item.caller_name}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hubungi nomor ${item.phone_number}`}
                    style={styles.phonePill}
                    onPress={() => handleCallPhone(item.phone_number)}
                  >
                    <Ionicons name="call" size={13} color={adminColors.royalBlue} />
                    <Text style={styles.phoneText}>{item.phone_number}</Text>
                  </Pressable>
                </View>

                {/* Pasien Terkait */}
                {item.family_member_name ? (
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientLabel}>Pasien darurat:</Text>
                    <Text style={styles.patientValue}>{item.family_member_name}</Text>
                  </View>
                ) : null}

                {/* Lokasi Kejadian */}
                {item.location_address ? (
                  <View style={styles.locationBox}>
                    <Ionicons name="location" size={15} color={sosColors.primary} />
                    <Text style={styles.locationText} numberOfLines={2}>
                      {item.location_address}
                    </Text>
                  </View>
                ) : null}

                {/* Keterangan / Gejala */}
                {item.notes ? (
                  <Text style={styles.notesSnippet} numberOfLines={2}>
                    "{item.notes}"
                  </Text>
                ) : null}

                {/* Status Faskes yang Ditugaskan */}
                {item.dispatched_facility ? (
                  <View style={styles.dispatchedFacilityBadge}>
                    <Ionicons name="medkit" size={14} color="#15803D" />
                    <Text style={styles.dispatchedFacilityText} numberOfLines={1}>
                      Faskes Penolong: {item.dispatched_facility}
                    </Text>
                  </View>
                ) : null}

                {/* Footer Kartu: ID & Tombol Aksi */}
                <View style={styles.cardFooter}>
                  <Text style={styles.idText}>
                    ID: {item.id.slice(0, 8)}...
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Buka detail sinyal SOS ${item.caller_name}`}
                    style={styles.actionButton}
                    onPress={() => handleOpenDetail(item)}
                  >
                    <Text style={styles.actionButtonText}>Detail & Tindak Lanjut</Text>
                    <Ionicons name="arrow-forward" size={13} color={sosColors.primaryDark} />
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
                    if (page > 1) loadRequests(page - 1);
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
                    if (page < totalPages) loadRequests(page + 1);
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

      {/* ===== Modal Detail & Tindak Lanjut SOS ===== */}
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
                  Rincian Sinyal Bantuan SOS
                </Text>
                <Text style={{ fontSize: 12, color: adminColors.textMuted }}>
                  Koordinasi respon evakuasi medis darurat
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tutup rincian SOS"
                style={styles.modalCloseButton}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={adminColors.textPrimary} />
              </Pressable>
            </View>

            {selectedSOS ? (
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 48, 60) }}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Seksi Identitas Pemanggil & Pasien */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Identitas Pelapor & Pasien</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Nama Pemanggil</Text>
                      <Text style={styles.infoGridValue}>{selectedSOS.caller_name}</Text>
                    </View>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Nomor Kontak</Text>
                      <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                        onPress={() => handleCallPhone(selectedSOS.phone_number)}
                      >
                        <Ionicons name="call" size={13} color={adminColors.royalBlue} />
                        <Text style={[styles.infoGridValue, { color: adminColors.royalBlue }]}>
                          {selectedSOS.phone_number}
                        </Text>
                      </Pressable>
                    </View>
                    {selectedSOS.family_member_name ? (
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Pasien Korban</Text>
                        <Text style={styles.infoGridValue}>{selectedSOS.family_member_name}</Text>
                      </View>
                    ) : null}
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Kategori Darurat</Text>
                      <Text style={[styles.infoGridValue, { textTransform: 'capitalize', color: sosColors.primaryDark }]}>
                        {selectedSOS.emergency_type}
                      </Text>
                    </View>
                    <View style={styles.infoGridRow}>
                      <Text style={styles.infoGridLabel}>Waktu Pemanggilan</Text>
                      <Text style={styles.infoGridValue}>
                        {formatDateTime(selectedSOS.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2. Seksi Informasi Lokasi GPS */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Lokasi Kejadian Darurat</Text>
                  <View style={styles.infoGrid}>
                    <View style={{ gap: 4 }}>
                      <Text style={styles.infoGridLabel}>Alamat Terdeteksi:</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: adminColors.textPrimary, lineHeight: 18 }}>
                        {selectedSOS.location_address || 'Alamat tidak terdeteksi via GPS'}
                      </Text>
                    </View>
                    {selectedSOS.latitude && selectedSOS.longitude ? (
                      <View style={styles.infoGridRow}>
                        <Text style={styles.infoGridLabel}>Koordinat GPS</Text>
                        <Text style={[styles.infoGridValue, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 11 }]}>
                          {selectedSOS.latitude}, {selectedSOS.longitude}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* 3. Seksi Catatan Kondisi Pasien */}
                {selectedSOS.notes ? (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Keluhan & Kondisi Darurat</Text>
                    <View style={styles.notesDetailCard}>
                      <Text style={styles.notesDetailTitle}>LAPORAN KORBAN / KELUARGA</Text>
                      <Text style={styles.notesDetailBody}>{selectedSOS.notes}</Text>
                    </View>
                  </View>
                ) : null}

                {/* 4. Seksi Tindak Lanjut Admin / Respon Faskes */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Tindak Lanjut & Dispatch Ambulans</Text>
                  <View style={styles.actionCard}>
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: adminColors.textSecondary, marginBottom: 10 }}>
                      Pilih Status Respon:
                    </Text>

                    {/* Tombol Opsi Status */}
                    <View style={styles.statusButtonsGrid}>
                      {(['active', 'responding', 'resolved', 'cancelled'] as SOSStatus[]).map(
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
                                color={isCurrent ? sosColors.primaryDark : badge.text}
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

                    {/* Input Fasilitas Kesehatan Penolong */}
                    <Text style={styles.inputLabel}>
                      Faskes / Unit Ambulans yang Diberangkatkan:
                    </Text>
                    <TextInput
                      style={styles.facilityInput}
                      placeholder="Contoh: RS Siloam Semanggi - Unit Ambulans 02"
                      placeholderTextColor={adminColors.textMuted}
                      value={editFacility}
                      onChangeText={setEditFacility}
                    />

                    {/* Catatan Responder Paramedis */}
                    <Text style={styles.inputLabel}>
                      Catatan Tim Responder / Perkembangan Pasien:
                    </Text>
                    <TextInput
                      style={styles.responderNotesInput}
                      placeholder="Tuliskan estimasi tiba (ETA), kondisi pasien saat evakuasi, atau alasan pembatalan..."
                      placeholderTextColor={adminColors.textMuted}
                      multiline
                      value={editResponderNotes}
                      onChangeText={setEditResponderNotes}
                    />

                    {selectedSOS.resolved_at ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <Ionicons name="checkmark-done-circle" size={15} color="#059669" />
                        <Text style={{ fontSize: 11.5, color: '#059669', fontWeight: '600' }}>
                          Dinyatakan selesai pada: {formatDateTime(selectedSOS.resolved_at)}
                        </Text>
                      </View>
                    ) : null}

                    {/* Tombol Simpan */}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Simpan status penanganan SOS"
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
                            Simpan Pembaruan Respon SOS
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
