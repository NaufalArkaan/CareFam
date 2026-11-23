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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAdminUsers } from '../../services/adminService';
import { AdminUserProfile, UserFilterRole } from '../../types/admin';
import { styles } from '../../styles/adminUsers.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserFilterRole>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State data pengguna
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State modal detail pengguna
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Fungsi memuat data pengguna dari Supabase
  const loadUsers = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getAdminUsers({
          search: searchQuery,
          roleFilter,
          page: targetPage,
          pageSize,
        });

        setUsers(result.users);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Gagal memuat daftar pengguna.');
        } else {
          setError('Terjadi kesalahan saat memuat data pengguna.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, roleFilter, page]
  );

  // Muat data saat filter atau pencarian berubah
  useEffect(() => {
    loadUsers(1);
  }, [roleFilter]);

  // Handler pencarian submit
  const handleSearchSubmit = () => {
    loadUsers(1);
  };

  // Handler refresh
  const handleRefresh = () => {
    loadUsers(1, true);
  };

  // Format tanggal bergabung
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper inisial nama
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Buka detail pengguna
  const handleOpenDetail = (user: AdminUserProfile) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* ===== Header User Management ===== */}
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
            <Ionicons name="people" size={14} color={adminColors.royalBlue} />
            <Text style={styles.headerBadgeText}>Modul Admin</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          Kelola dan pantau profil akun pengguna terdaftar
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
            placeholder="Cari berdasarkan nama atau callsign..."
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
                loadUsers(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Role Chips */}
        <View style={styles.filterRow}>
          <Pressable
            style={[
              styles.filterChip,
              roleFilter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setRoleFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                roleFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              Semua Akun
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              roleFilter === 'user' && styles.filterChipActive,
            ]}
            onPress={() => setRoleFilter('user')}
          >
            <Text
              style={[
                styles.filterChipText,
                roleFilter === 'user' && styles.filterChipTextActive,
              ]}
            >
              Pengguna (User)
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              roleFilter === 'admin' && styles.filterChipActive,
            ]}
            onPress={() => setRoleFilter('admin')}
          >
            <Text
              style={[
                styles.filterChipText,
                roleFilter === 'admin' && styles.filterChipTextActive,
              ]}
            >
              Administrator
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Informasi Jumlah Data */}
      <View style={styles.metaInfoBar}>
        <Text style={styles.metaInfoText}>
          Total: {totalCount} akun terdaftar
        </Text>
        {totalPages > 1 ? (
          <Text style={styles.metaInfoText}>
            Halaman {page} dari {totalPages}
          </Text>
        ) : null}
      </View>

      {/* ===== Daftar Pengguna (FlatList) ===== */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerStateContainer}>
          <ActivityIndicator size="large" color={adminColors.royalBlue} />
          <Text style={[styles.stateSubtitle, { marginTop: 12 }]}>
            Memuat daftar pengguna...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerStateContainer}>
          <View style={styles.emptyIconBadge}>
            <Ionicons name="alert-circle-outline" size={32} color={adminColors.dangerRed} />
          </View>
          <Text style={styles.stateTitle}>Gagal Memuat Data</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadUsers(page)}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={adminColors.royalBlue}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerStateContainer}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="people-outline" size={32} color={adminColors.textMuted} />
              </View>
              <Text style={styles.stateTitle}>Tidak Ada Pengguna Ditemukan</Text>
              <Text style={styles.stateSubtitle}>
                {searchQuery !== ''
                  ? `Tidak ada hasil untuk kata kunci "${searchQuery}".`
                  : 'Belum ada akun pengguna yang sesuai dengan filter.'}
              </Text>
              {searchQuery !== '' || roleFilter !== 'all' ? (
                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                  }}
                >
                  <Text style={styles.retryButtonText}>Reset Filter</Text>
                </Pressable>
              ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const displayName = item.full_name || item.callsign || 'Pengguna Tanpa Nama';
            const initials = getInitials(displayName);
            const isAdmin = item.role === 'admin';

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Lihat detail ${displayName}`}
                style={({ pressed }) => [
                  styles.userCard,
                  { opacity: pressed ? 0.75 : 1.0 },
                ]}
                onPress={() => handleOpenDetail(item)}
              >
                {/* Avatar Pengguna */}
                <View style={styles.userAvatarContainer}>
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: item.avatar_url }}
                      style={styles.userAvatarImage}
                    />
                  ) : (
                    <LinearGradient
                      colors={isAdmin ? ['#EDE9FE', '#DDD6FE'] : ['#DBEAFE', '#BFDBFE']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.userAvatarGradient}
                    >
                      <Text style={styles.userAvatarInitials}>{initials}</Text>
                    </LinearGradient>
                  )}
                </View>

                {/* Info Pengguna */}
                <View style={styles.userInfoWrapper}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {displayName}
                    </Text>
                    <View
                      style={[
                        styles.roleBadge,
                        isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
                      ]}
                    >
                      <Text
                        style={
                          isAdmin
                            ? styles.roleBadgeTextAdmin
                            : styles.roleBadgeTextUser
                        }
                      >
                        {isAdmin ? 'ADMIN' : 'USER'}
                      </Text>
                    </View>
                  </View>

                  {item.callsign ? (
                    <Text style={styles.userCallsign} numberOfLines={1}>
                      @{item.callsign}
                    </Text>
                  ) : null}

                  <View style={styles.userMetaRow}>
                    <Text style={styles.userDateText}>
                      Terdaftar: {formatDate(item.created_at)}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={adminColors.textMuted}
                />
              </Pressable>
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
                  onPress={() => loadUsers(page - 1)}
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
                  onPress={() => loadUsers(page + 1)}
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

      {/* ===== Modal Detail Pengguna ===== */}
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

            {selectedUser ? (
              <>
                {/* Header Profil Modal */}
                <View style={styles.sheetHeaderRow}>
                  <View style={styles.sheetAvatarLarge}>
                    {selectedUser.avatar_url ? (
                      <Image
                        source={{ uri: selectedUser.avatar_url }}
                        style={styles.userAvatarImage}
                      />
                    ) : (
                      <Text style={styles.userAvatarInitials}>
                        {getInitials(
                          selectedUser.full_name || selectedUser.callsign
                        )}
                      </Text>
                    )}
                  </View>
                  <View style={styles.sheetHeaderInfo}>
                    <Text style={styles.sheetUserName}>
                      {selectedUser.full_name ||
                        selectedUser.callsign ||
                        'Pengguna Tanpa Nama'}
                    </Text>
                    {selectedUser.callsign ? (
                      <Text style={styles.sheetUserCallsign}>
                        Callsign: {selectedUser.callsign}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Rincian Atribut Akun */}
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>User ID</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={[styles.detailValue, { fontSize: 11 }]}>
                        {selectedUser.id}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Nama Lengkap</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedUser.full_name || 'Belum diisi'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Panggilan / Callsign</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedUser.callsign || 'Belum diisi'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Nomor Telepon</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedUser.phone_number || 'Belum didaftarkan'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Peran (Role)</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {selectedUser.role === 'admin'
                          ? 'Administrator'
                          : 'Pengguna Biasa (User)'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Tanggal Terdaftar</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedUser.created_at)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.detailRow, styles.detailRowLast]}>
                    <View style={styles.detailLabelWrapper}>
                      <Text style={styles.detailLabel}>Terakhir Diperbarui</Text>
                    </View>
                    <View style={styles.detailValueWrapper}>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedUser.updated_at)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Pemberitahuan Keamanan & Privasi */}
                <View style={styles.privacyNoticeBox}>
                  <Ionicons
                    name="shield-checkmark"
                    size={18}
                    color="#15803D"
                  />
                  <Text style={styles.privacyNoticeText}>
                    Data medis dan riwayat kesehatan keluarga dilindungi oleh
                    Row Level Security (RLS) keluarga dan tidak diekspos di luar hak akses.
                  </Text>
                </View>

                {/* Tombol Tutup */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tutup rincian pengguna"
                  style={styles.sheetCloseButton}
                  onPress={() => setIsDetailModalVisible(false)}
                >
                  <Text style={styles.sheetCloseButtonText}>Tutup</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
