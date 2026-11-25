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
  Switch,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} from '../../services/hospitalService';
import {
  FacilityType,
  Hospital,
} from '../../types/admin';
import { styles } from '../../styles/adminHospitals.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

const FACILITY_TYPES: FacilityType[] = [
  'Rumah Sakit',
  'Klinik',
  'Puskesmas',
  'Laboratorium',
  'Apotek',
];

const FILTER_OPTIONS = ['all', ...FACILITY_TYPES];

export default function AdminHospitalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State data fasilitas kesehatan
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Form Modal (Tambah / Edit)
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<FacilityType>('Rumah Sakit');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('Jakarta');
  const [formPhone, setFormPhone] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Detail Modal
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Fungsi memuat data dari Supabase
  const loadHospitals = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getHospitals({
          search: searchQuery,
          typeFilter,
          page: targetPage,
          pageSize,
        });

        setHospitals(result.hospitals);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Gagal memuat daftar fasilitas kesehatan.');
        } else {
          setError('Terjadi kesalahan saat memuat data fasilitas kesehatan.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, typeFilter, page]
  );

  // Muat data saat filter berubah
  useEffect(() => {
    loadHospitals(1);
  }, [typeFilter]);

  // Handler search
  const handleSearchSubmit = () => {
    loadHospitals(1);
  };

  // Handler refresh
  const handleRefresh = () => {
    loadHospitals(1, true);
  };

  // Buka Form Tambah
  const handleOpenAddForm = () => {
    setEditingHospital(null);
    setFormName('');
    setFormType('Rumah Sakit');
    setFormAddress('');
    setFormCity('Jakarta');
    setFormPhone('');
    setFormIsActive(true);
    setFormError(null);
    setIsFormModalVisible(true);
  };

  // Buka Form Edit
  const handleOpenEditForm = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormName(hospital.name);
    setFormType(hospital.facility_type);
    setFormAddress(hospital.address);
    setFormCity(hospital.city || 'Jakarta');
    setFormPhone(hospital.phone || '');
    setFormIsActive(hospital.is_active);
    setFormError(null);
    setIsFormModalVisible(true);
  };

  // Buka Detail Modal
  const handleOpenDetail = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsDetailModalVisible(true);
  };

  // Handler Simpan Form (Tambah / Edit)
  const handleSaveForm = async () => {
    if (!formName.trim()) {
      setFormError('Nama fasilitas kesehatan wajib diisi.');
      return;
    }
    if (!formAddress.trim()) {
      setFormError('Alamat fasilitas kesehatan wajib diisi.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingHospital) {
        // Operasi UPDATE
        await updateHospital(editingHospital.id, {
          name: formName.trim(),
          facility_type: formType,
          address: formAddress.trim(),
          city: formCity.trim() || null,
          phone: formPhone.trim() || null,
          is_active: formIsActive,
        });

        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert('Data fasilitas kesehatan berhasil diperbarui!');
          }
        } else {
          Alert.alert('Sukses', 'Data fasilitas kesehatan berhasil diperbarui!');
        }
      } else {
        // Operasi CREATE
        await createHospital({
          name: formName.trim(),
          facility_type: formType,
          address: formAddress.trim(),
          city: formCity.trim() || 'Jakarta',
          phone: formPhone.trim() || null,
          is_active: formIsActive,
        });

        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert('Fasilitas kesehatan baru berhasil ditambahkan!');
          }
        } else {
          Alert.alert('Sukses', 'Fasilitas kesehatan baru berhasil ditambahkan!');
        }
      }

      setIsFormModalVisible(false);
      loadHospitals(1, true);
    } catch (err: any) {
      setFormError(err?.message || 'Gagal menyimpan data fasilitas kesehatan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus dengan Konfirmasi & Optimistic UI
  const handleDeleteHospital = async (hospital: Hospital) => {
    const executeDelete = async () => {
      // 1. Simpan backup untuk rollback jika gagal
      const previousList = [...hospitals];

      // 2. Optimistic UI: langsung hapus dari tampilan
      setHospitals((prev) => prev.filter((h) => h.id !== hospital.id));
      setTotalCount((prev) => Math.max(0, prev - 1));

      try {
        await deleteHospital(hospital.id);
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert(`Fasilitas "${hospital.name}" berhasil dihapus.`);
          }
        }
      } catch (err: any) {
        // 3. Rollback jika database gagal
        setHospitals(previousList);
        setTotalCount(previousList.length);
        const errMsg = err?.message || 'Terjadi kesalahan saat menghapus data.';
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert('Gagal Menghapus: ' + errMsg);
          }
        } else {
          Alert.alert('Gagal Menghapus', errMsg);
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined'
          ? window.confirm(
              `Apakah Anda yakin ingin menghapus fasilitas kesehatan "${hospital.name}"?`
            )
          : true;
      if (confirmed) {
        await executeDelete();
      }
    } else {
      Alert.alert(
        'Konfirmasi Hapus',
        `Apakah Anda yakin ingin menghapus fasilitas kesehatan "${hospital.name}"?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: executeDelete,
          },
        ]
      );
    }
  };

  // Helper ikon fasilitas berdasarkan tipe
  const getFacilityIcon = (type: FacilityType) => {
    switch (type) {
      case 'Rumah Sakit':
        return { name: 'business' as const, bg: '#EFF6FF', color: '#2563EB' };
      case 'Klinik':
        return { name: 'medkit' as const, bg: '#F0FDF4', color: '#16A34A' };
      case 'Puskesmas':
        return { name: 'fitness' as const, bg: '#FAF5FF', color: '#9333EA' };
      case 'Laboratorium':
        return { name: 'flask' as const, bg: '#FFF7ED', color: '#EA580C' };
      case 'Apotek':
        return { name: 'bandage' as const, bg: '#ECFEFF', color: '#0891B2' };
      default:
        return { name: 'business' as const, bg: '#F1F5F9', color: '#64748B' };
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== Header Hospital Management ===== */}
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
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={adminColors.textPrimary} />
          </Pressable>

          <View style={styles.headerTitleBadge}>
            <Ionicons name="medkit" size={14} color="#16A34A" />
            <Text style={styles.headerBadgeText}>Modul Admin</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Hospital Management</Text>
        <Text style={styles.headerSubtitle}>
          Kelola data fasilitas kesehatan, rumah sakit, dan klinik rujukan
        </Text>
      </LinearGradient>

      {/* ===== Kontrol Pencarian & Filter ===== */}
      <View style={styles.controlsContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={adminColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama fasilitas, alamat, atau kota..."
            placeholderTextColor={adminColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery !== '' ? (
            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                loadHospitals(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Jenis Fasilitas Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {FILTER_OPTIONS.map((opt) => {
            const isAll = opt === 'all';
            const isSelected = typeFilter === opt;
            const label = isAll ? 'Semua Fasilitas' : opt;

            return (
              <Pressable
                key={opt}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setTypeFilter(opt)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ===== Bar Informasi Jumlah & Tombol Tambah ===== */}
      <View style={styles.metaInfoBar}>
        <Text style={styles.metaInfoText}>
          Total: {totalCount} fasilitas terdaftar
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tambah Fasilitas Kesehatan"
          style={styles.addFacilityBtn}
          onPress={handleOpenAddForm}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addFacilityBtnText}>Tambah Fasilitas</Text>
        </Pressable>
      </View>

      {/* ===== Daftar Fasilitas Kesehatan (FlatList) ===== */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerStateContainer}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={[styles.stateSubtitle, { marginTop: 12 }]}>
            Memuat data fasilitas kesehatan dari Supabase...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerStateContainer}>
          <View style={styles.emptyIconBadge}>
            <Ionicons name="alert-circle-outline" size={32} color={adminColors.dangerRed} />
          </View>
          <Text style={styles.stateTitle}>Gagal Memuat Data</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadHospitals(page)}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#16A34A"
            />
          }
          ListEmptyComponent={
            <View style={styles.centerStateContainer}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="medkit-outline" size={32} color={adminColors.textMuted} />
              </View>
              <Text style={styles.stateTitle}>Belum Ada Fasilitas Kesehatan</Text>
              <Text style={styles.stateSubtitle}>
                {searchQuery !== ''
                  ? `Tidak ada hasil pencarian untuk "${searchQuery}".`
                  : 'Belum ada data fasilitas kesehatan yang terdaftar. Tambahkan data baru menggunakan tombol di atas.'}
              </Text>
              {searchQuery !== '' || typeFilter !== 'all' ? (
                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                  }}
                >
                  <Text style={styles.retryButtonText}>Reset Filter</Text>
                </Pressable>
              ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const iconCfg = getFacilityIcon(item.facility_type);

            return (
              <View style={styles.card}>
                {/* Header Kartu: Ikon, Nama, Tipe, & Status */}
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: iconCfg.bg }]}>
                    <Ionicons name={iconCfg.name} size={22} color={iconCfg.color} />
                  </View>

                  <View style={styles.cardTitleWrapper}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <View style={styles.tagRow}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: iconCfg.bg },
                        ]}
                      >
                        <Text style={[styles.typeBadgeText, { color: iconCfg.color }]}>
                          {item.facility_type}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          item.is_active
                            ? styles.statusBadgeActive
                            : styles.statusBadgeInactive,
                        ]}
                      >
                        <Text
                          style={
                            item.is_active
                              ? styles.statusBadgeTextActive
                              : styles.statusBadgeTextInactive
                          }
                        >
                          {item.is_active ? '● Aktif' : '○ Nonaktif'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Body Informasi: Alamat & Kontak */}
                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color={adminColors.textMuted}
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                      {item.address}{item.city ? `, ${item.city}` : ''}
                    </Text>
                  </View>

                  {item.phone ? (
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="call-outline"
                        size={15}
                        color={adminColors.textMuted}
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>Kontak: {item.phone}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Aksi: Detail, Edit, Hapus */}
                <View style={styles.cardActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat detail ${item.name}`}
                    style={[styles.actionBtn, styles.detailBtn]}
                    onPress={() => handleOpenDetail(item)}
                  >
                    <Ionicons name="eye-outline" size={14} color="#2563EB" />
                    <Text style={styles.detailBtnText}>Detail</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.name}`}
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => handleOpenEditForm(item)}
                  >
                    <Ionicons name="pencil-outline" size={14} color="#16A34A" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hapus ${item.name}`}
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteHospital(item)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#DC2626" />
                    <Text style={styles.deleteBtnText}>Hapus</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.paginationContainer}>
                <Pressable
                  disabled={page <= 1 || isLoading}
                  style={[
                    styles.pageButton,
                    page <= 1 && styles.pageButtonDisabled,
                  ]}
                  onPress={() => loadHospitals(page - 1)}
                >
                  <Ionicons
                    name="chevron-back"
                    size={16}
                    color={adminColors.textPrimary}
                  />
                  <Text style={styles.pageButtonText}>Sebelumnya</Text>
                </Pressable>

                <Text style={styles.pageIndicatorText}>
                  Hal {page} dari {totalPages}
                </Text>

                <Pressable
                  disabled={page >= totalPages || isLoading}
                  style={[
                    styles.pageButton,
                    page >= totalPages && styles.pageButtonDisabled,
                  ]}
                  onPress={() => loadHospitals(page + 1)}
                >
                  <Text style={styles.pageButtonText}>Selanjutnya</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={adminColors.textPrimary}
                  />
                </Pressable>
              </View>
            ) : undefined
          }
        />
      )}

      {/* ===== Modal Form Tambah / Edit Fasilitas ===== */}
      <Modal
        visible={isFormModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFormModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsFormModalVisible(false)}
        >
          <Pressable
            style={styles.sheetContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {editingHospital ? 'Edit Fasilitas Kesehatan' : 'Tambah Fasilitas Kesehatan'}
              </Text>
              <Pressable
                style={styles.sheetCloseBtn}
                onPress={() => setIsFormModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={adminColors.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              {/* Pesan Error Form */}
              {formError ? (
                <View
                  style={{
                    backgroundColor: '#FEF2F2',
                    padding: 10,
                    borderRadius: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: '#FECDD3',
                  }}
                >
                  <Text style={{ color: '#DC2626', fontSize: 12.5, fontWeight: '600' }}>
                    ⚠️ {formError}
                  </Text>
                </View>
              ) : null}

              {/* Input Nama Fasilitas */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Nama Fasilitas Kesehatan <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Contoh: RSUP Fatmawati"
                  placeholderTextColor={adminColors.textMuted}
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              {/* Pilihan Jenis Fasilitas */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Jenis Fasilitas <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.typeChipsRow}>
                  {FACILITY_TYPES.map((type) => {
                    const isSelected = formType === type;
                    return (
                      <Pressable
                        key={type}
                        style={[
                          styles.typeOptionPill,
                          isSelected && styles.typeOptionPillActive,
                        ]}
                        onPress={() => setFormType(type)}
                      >
                        <Text
                          style={[
                            styles.typeOptionPillText,
                            isSelected && styles.typeOptionPillTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Input Alamat */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Alamat Lengkap <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Masukkan jalan, nomor, kelurahan, dan kecamatan..."
                  placeholderTextColor={adminColors.textMuted}
                  value={formAddress}
                  onChangeText={setFormAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Input Kota */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kota / Kabupaten</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Contoh: Jakarta Selatan"
                  placeholderTextColor={adminColors.textMuted}
                  value={formCity}
                  onChangeText={setFormCity}
                />
              </View>

              {/* Input Telepon */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nomor Telepon / Kontak</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Contoh: 021-7501524"
                  placeholderTextColor={adminColors.textMuted}
                  value={formPhone}
                  onChangeText={setFormPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Switch Status Aktif */}
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabelText}>Status Operasional</Text>
                  <Text style={styles.switchSubtext}>
                    {formIsActive
                      ? 'Fasilitas aktif dan dapat diakses pengguna'
                      : 'Fasilitas dinonaktifkan sementara'}
                  </Text>
                </View>
                <Switch
                  value={formIsActive}
                  onValueChange={setFormIsActive}
                  trackColor={{ false: '#CBD5E1', true: '#BBF7D0' }}
                  thumbColor={formIsActive ? '#16A34A' : '#F1F5F9'}
                />
              </View>

              {/* Tombol Aksi Form */}
              <View style={styles.formActions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => setIsFormModalVisible(false)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </Pressable>

                <Pressable
                  style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
                  onPress={handleSaveForm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                      <Text style={styles.submitBtnText}>
                        {editingHospital ? 'Simpan Perubahan' : 'Tambahkan'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ===== Modal Detail Fasilitas Kesehatan ===== */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsDetailModalVisible(false)}
        >
          <Pressable
            style={styles.sheetContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            {selectedHospital ? (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Rincian Fasilitas Kesehatan</Text>
                  <Pressable
                    style={styles.sheetCloseBtn}
                    onPress={() => setIsDetailModalVisible(false)}
                  >
                    <Ionicons name="close" size={22} color={adminColors.textMuted} />
                  </Pressable>
                </View>

                <View style={{ paddingBottom: 16 }}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Nama Fasilitas</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={[styles.detailValue, { fontWeight: '700' }]}>
                        {selectedHospital.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Jenis Fasilitas</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedHospital.facility_type}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Alamat</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedHospital.address}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Kota / Wilayah</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedHospital.city || '—'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Kontak / Telepon</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedHospital.phone || '—'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Status</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text
                        style={[
                          styles.detailValue,
                          {
                            color: selectedHospital.is_active ? '#15803D' : '#64748B',
                            fontWeight: '700',
                          },
                        ]}
                      >
                        {selectedHospital.is_active ? 'Aktif' : 'Nonaktif'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>ID Database</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={[styles.detailValue, { fontSize: 11, color: adminColors.textMuted }]}>
                        {selectedHospital.id}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
