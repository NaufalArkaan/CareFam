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
  getEducationArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../../services/educationService';
import {
  ArticleStatus,
  EducationCategory,
  HealthEducationArticle,
} from '../../types/admin';
import { styles } from '../../styles/adminEducation.styles';
import { adminColors } from '../../styles/adminDashboard.styles';

const CATEGORIES: EducationCategory[] = [
  'Nutrisi',
  'Kesehatan Anak',
  'Lansia',
  'Penyakit Kronis',
  'Gaya Hidup',
  'Umum',
];

const CATEGORY_FILTER_OPTIONS = ['all', ...CATEGORIES];

export default function AdminEducationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State data artikel edukasi
  const [articles, setArticles] = useState<HealthEducationArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Form Modal (Tambah / Edit)
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HealthEducationArticle | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EducationCategory>('Nutrisi');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('Tim Medis CareFam');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState<ArticleStatus>('published');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Detail / Baca Modal
  const [selectedArticle, setSelectedArticle] = useState<HealthEducationArticle | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Fungsi memuat data artikel edukasi dari Supabase
  const loadArticles = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getEducationArticles({
          search: searchQuery,
          categoryFilter,
          statusFilter,
          page: targetPage,
          pageSize,
        });

        setArticles(result.articles);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Gagal memuat artikel edukasi.');
        } else {
          setError('Terjadi kesalahan saat memuat data edukasi kesehatan.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, categoryFilter, statusFilter, page]
  );

  // Muat data saat filter berubah
  useEffect(() => {
    loadArticles(1);
  }, [categoryFilter, statusFilter]);

  // Handler search
  const handleSearchSubmit = () => {
    loadArticles(1);
  };

  // Handler refresh
  const handleRefresh = () => {
    loadArticles(1, true);
  };

  // Format tanggal artikel
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Draf (Belum tayang)';
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

  // Buka Form Tambah
  const handleOpenAddForm = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormCategory('Nutrisi');
    setFormSummary('');
    setFormContent('');
    setFormAuthor('Tim Medis CareFam');
    setFormImageUrl('');
    setFormStatus('published');
    setFormError(null);
    setIsFormModalVisible(true);
  };

  // Buka Form Edit
  const handleOpenEditForm = (article: HealthEducationArticle) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormSummary(article.summary);
    setFormContent(article.content);
    setFormAuthor(article.author_name || 'Tim Medis CareFam');
    setFormImageUrl(article.image_url || '');
    setFormStatus(article.status);
    setFormError(null);
    setIsFormModalVisible(true);
  };

  // Buka Detail / Baca Modal
  const handleOpenDetail = (article: HealthEducationArticle) => {
    setSelectedArticle(article);
    setIsDetailModalVisible(true);
  };

  // Handler Simpan Form (Tambah / Edit)
  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      setFormError('Judul artikel wajib diisi.');
      return;
    }
    if (!formSummary.trim()) {
      setFormError('Ringkasan artikel wajib diisi.');
      return;
    }
    if (!formContent.trim()) {
      setFormError('Isi konten artikel wajib diisi.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingArticle) {
        // Operasi UPDATE
        await updateArticle(editingArticle.id, {
          title: formTitle.trim(),
          category: formCategory,
          summary: formSummary.trim(),
          content: formContent.trim(),
          author_name: formAuthor.trim() || null,
          image_url: formImageUrl.trim() || null,
          status: formStatus,
        });

        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert('Artikel edukasi berhasil diperbarui!');
          }
        } else {
          Alert.alert('Sukses', 'Artikel edukasi berhasil diperbarui!');
        }
      } else {
        // Operasi CREATE
        await createArticle({
          title: formTitle.trim(),
          category: formCategory,
          summary: formSummary.trim(),
          content: formContent.trim(),
          author_name: formAuthor.trim() || 'Tim Medis CareFam',
          image_url: formImageUrl.trim() || null,
          status: formStatus,
        });

        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert('Artikel edukasi baru berhasil diterbitkan!');
          }
        } else {
          Alert.alert('Sukses', 'Artikel edukasi baru berhasil diterbitkan!');
        }
      }

      setIsFormModalVisible(false);
      loadArticles(1, true);
    } catch (err: any) {
      setFormError(err?.message || 'Gagal menyimpan konten artikel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus dengan Konfirmasi & Optimistic UI
  const handleDeleteArticle = async (article: HealthEducationArticle) => {
    const executeDelete = async () => {
      // 1. Simpan backup untuk rollback jika gagal
      const previousList = [...articles];

      // 2. Optimistic UI: langsung hapus dari tampilan
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      setTotalCount((prev) => Math.max(0, prev - 1));

      try {
        await deleteArticle(article.id);
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            window.alert(`Artikel "${article.title}" berhasil dihapus.`);
          }
        }
      } catch (err: any) {
        // 3. Rollback jika database gagal
        setArticles(previousList);
        setTotalCount(previousList.length);
        const errMsg = err?.message || 'Terjadi kesalahan saat menghapus artikel.';
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
              `Apakah Anda yakin ingin menghapus artikel edukasi "${article.title}"?`
            )
          : true;
      if (confirmed) {
        await executeDelete();
      }
    } else {
      Alert.alert(
        'Konfirmasi Hapus',
        `Apakah Anda yakin ingin menghapus artikel edukasi "${article.title}"?`,
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

  // Helper ikon kategori
  const getCategoryConfig = (category: EducationCategory) => {
    switch (category) {
      case 'Nutrisi':
        return { name: 'nutrition' as const, bg: '#F0FDF4', color: '#16A34A' };
      case 'Kesehatan Anak':
        return { name: 'happy' as const, bg: '#EFF6FF', color: '#2563EB' };
      case 'Lansia':
        return { name: 'heart' as const, bg: '#FAF5FF', color: '#9333EA' };
      case 'Penyakit Kronis':
        return { name: 'pulse' as const, bg: '#FFF7ED', color: '#EA580C' };
      case 'Gaya Hidup':
        return { name: 'bicycle' as const, bg: '#ECFEFF', color: '#0891B2' };
      default:
        return { name: 'book' as const, bg: '#F1F5F9', color: '#64748B' };
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== Header Health Education ===== */}
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
            <Ionicons name="book" size={14} color="#7C3AED" />
            <Text style={styles.headerBadgeText}>Modul Admin</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Health Education</Text>
        <Text style={styles.headerSubtitle}>
          Kelola artikel dan informasi edukasi kesehatan untuk pengguna CareFam
        </Text>
      </LinearGradient>

      {/* ===== Kontrol: Pencarian & Filter Kategori / Status ===== */}
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
            placeholder="Cari judul artikel atau topik kesehatan..."
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
                loadArticles(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color={adminColors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Kategori Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {CATEGORY_FILTER_OPTIONS.map((cat) => {
            const isAll = cat === 'all';
            const isSelected = categoryFilter === cat;
            const label = isAll ? 'Semua Kategori' : cat;

            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setCategoryFilter(cat)}
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

        {/* Filter Status Publikasi (Semua, Published, Draft) */}
        <View style={styles.statusFilterRow}>
          <Pressable
            style={[
              styles.statusFilterPill,
              statusFilter === 'all' && styles.statusFilterPillActive,
            ]}
            onPress={() => setStatusFilter('all')}
          >
            <Text
              style={[
                styles.statusFilterPillText,
                statusFilter === 'all' && styles.statusFilterPillTextActive,
              ]}
            >
              Semua Status
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusFilterPill,
              statusFilter === 'published' && styles.statusFilterPillActive,
            ]}
            onPress={() => setStatusFilter('published')}
          >
            <Text
              style={[
                styles.statusFilterPillText,
                statusFilter === 'published' && styles.statusFilterPillTextActive,
              ]}
            >
              ● Published
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.statusFilterPill,
              statusFilter === 'draft' && styles.statusFilterPillActive,
            ]}
            onPress={() => setStatusFilter('draft')}
          >
            <Text
              style={[
                styles.statusFilterPillText,
                statusFilter === 'draft' && styles.statusFilterPillTextActive,
              ]}
            >
              ○ Draft
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ===== Bar Informasi Jumlah & Tombol Tambah ===== */}
      <View style={styles.metaInfoBar}>
        <Text style={styles.metaInfoText}>
          Total: {totalCount} artikel terdaftar
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tambah Artikel Edukasi"
          style={styles.addArticleBtn}
          onPress={handleOpenAddForm}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addArticleBtnText}>Tambah Artikel</Text>
        </Pressable>
      </View>

      {/* ===== Daftar Artikel Edukasi (FlatList) ===== */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerStateContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={[styles.stateSubtitle, { marginTop: 12 }]}>
            Memuat data artikel edukasi dari Supabase...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerStateContainer}>
          <View style={styles.emptyIconBadge}>
            <Ionicons name="alert-circle-outline" size={32} color={adminColors.dangerRed} />
          </View>
          <Text style={styles.stateTitle}>Gagal Memuat Data</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadArticles(page)}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#7C3AED"
            />
          }
          ListEmptyComponent={
            <View style={styles.centerStateContainer}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="book-outline" size={32} color={adminColors.textMuted} />
              </View>
              <Text style={styles.stateTitle}>Belum Ada Artikel Edukasi</Text>
              <Text style={styles.stateSubtitle}>
                {searchQuery !== ''
                  ? `Tidak ada hasil pencarian untuk "${searchQuery}".`
                  : 'Belum ada konten artikel edukasi yang terdaftar. Tambahkan artikel baru menggunakan tombol di atas.'}
              </Text>
              {searchQuery !== '' || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  <Text style={styles.retryButtonText}>Reset Filter</Text>
                </Pressable>
              ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const catCfg = getCategoryConfig(item.category);
            const isPublished = item.status === 'published';

            return (
              <View style={styles.card}>
                {/* Header Kartu: Ikon Kategori, Judul, Kategori & Status */}
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: catCfg.bg }]}>
                    <Ionicons name={catCfg.name} size={22} color={catCfg.color} />
                  </View>

                  <View style={styles.cardTitleWrapper}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.tagRow}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: catCfg.bg },
                        ]}
                      >
                        <Text style={[styles.categoryBadgeText, { color: catCfg.color }]}>
                          {item.category}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          isPublished
                            ? styles.statusBadgePublished
                            : styles.statusBadgeDraft,
                        ]}
                      >
                        <Text
                          style={
                            isPublished
                              ? styles.statusBadgeTextPublished
                              : styles.statusBadgeTextDraft
                          }
                        >
                          {isPublished ? '● Published' : '○ Draft'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Ringkasan Konten */}
                <Text style={styles.cardSummary} numberOfLines={2}>
                  {item.summary}
                </Text>

                {/* Baris Meta: Penulis & Tanggal Publikasi */}
                <View style={styles.cardMetaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={13} color={adminColors.textMuted} />
                    <Text style={styles.metaItemText}>
                      {item.author_name || 'Tim Medis'}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={13} color={adminColors.textMuted} />
                    <Text style={styles.metaItemText}>
                      {formatDate(item.published_at)}
                    </Text>
                  </View>
                </View>

                {/* Tombol Aksi: Baca / Detail, Edit, Hapus */}
                <View style={styles.cardActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Baca detail ${item.title}`}
                    style={[styles.actionBtn, styles.detailBtn]}
                    onPress={() => handleOpenDetail(item)}
                  >
                    <Ionicons name="eye-outline" size={14} color="#7C3AED" />
                    <Text style={styles.detailBtnText}>Baca Detail</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.title}`}
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => handleOpenEditForm(item)}
                  >
                    <Ionicons name="pencil-outline" size={14} color="#16A34A" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hapus ${item.title}`}
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteArticle(item)}
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
                  onPress={() => loadArticles(page - 1)}
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
                  onPress={() => loadArticles(page + 1)}
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

      {/* ===== Modal Form Tambah / Edit Artikel ===== */}
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
                {editingArticle ? 'Edit Konten Edukasi' : 'Tambah Konten Edukasi'}
              </Text>
              <Pressable
                style={styles.sheetCloseBtn}
                onPress={() => setIsFormModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={adminColors.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              {/* Pesan Error Validasi Form */}
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

              {/* Input Judul Artikel */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Judul Artikel Edukasi <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Contoh: Tips Pencegahan Penyakit Menular..."
                  placeholderTextColor={adminColors.textMuted}
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              {/* Pilihan Kategori Artikel */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Kategori <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.categoryChipsRow}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = formCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        style={[
                          styles.categoryOptionPill,
                          isSelected && styles.categoryOptionPillActive,
                        ]}
                        onPress={() => setFormCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryOptionPillText,
                            isSelected && styles.categoryOptionPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Status Publikasi (Published vs Draft) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status Publikasi</Text>
                <View style={styles.statusSegmentRow}>
                  <Pressable
                    style={[
                      styles.statusSegmentBtn,
                      formStatus === 'published' &&
                        styles.statusSegmentBtnActivePublished,
                    ]}
                    onPress={() => setFormStatus('published')}
                  >
                    <Text
                      style={[
                        styles.statusSegmentText,
                        formStatus === 'published' &&
                          styles.statusSegmentTextActivePublished,
                      ]}
                    >
                      ● Published (Diterbitkan)
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.statusSegmentBtn,
                      formStatus === 'draft' &&
                        styles.statusSegmentBtnActiveDraft,
                    ]}
                    onPress={() => setFormStatus('draft')}
                  >
                    <Text
                      style={[
                        styles.statusSegmentText,
                        formStatus === 'draft' &&
                          styles.statusSegmentTextActiveDraft,
                      ]}
                    >
                      ○ Draft (Arsip Konsep)
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Input Ringkasan */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Ringkasan Singkat (Lead / Abstract) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInput, styles.formTextareaSummary]}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu pratinjau..."
                  placeholderTextColor={adminColors.textMuted}
                  value={formSummary}
                  onChangeText={setFormSummary}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Input Isi Lengkap Artikel */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Isi Konten Artikel <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.formInput, styles.formTextareaContent]}
                  placeholder="Tuliskan ulasan medis, petunjuk penanganan, atau tips lengkap..."
                  placeholderTextColor={adminColors.textMuted}
                  value={formContent}
                  onChangeText={setFormContent}
                  multiline
                  numberOfLines={6}
                />
              </View>

              {/* Input Penulis / Sumber */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Penulis / Narasumber Medis</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Contoh: dr. Budi Santoso, Sp.A"
                  placeholderTextColor={adminColors.textMuted}
                  value={formAuthor}
                  onChangeText={setFormAuthor}
                />
              </View>

              {/* Input Gambar URL */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tautan Gambar Thumbnail (Opsional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={adminColors.textMuted}
                  value={formImageUrl}
                  onChangeText={setFormImageUrl}
                  keyboardType="url"
                  autoCapitalize="none"
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
                        {editingArticle ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ===== Modal Baca Detail Artikel ===== */}
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

            {selectedArticle ? (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Baca Artikel Edukasi</Text>
                  <Pressable
                    style={styles.sheetCloseBtn}
                    onPress={() => setIsDetailModalVisible(false)}
                  >
                    <Ionicons name="close" size={22} color={adminColors.textMuted} />
                  </Pressable>
                </View>

                <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                  {/* Tag Kategori & Status */}
                  <View style={[styles.tagRow, { marginBottom: 10 }]}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryConfig(selectedArticle.category).bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: getCategoryConfig(selectedArticle.category).color },
                        ]}
                      >
                        {selectedArticle.category}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        selectedArticle.status === 'published'
                          ? styles.statusBadgePublished
                          : styles.statusBadgeDraft,
                      ]}
                    >
                      <Text
                        style={
                          selectedArticle.status === 'published'
                            ? styles.statusBadgeTextPublished
                            : styles.statusBadgeTextDraft
                        }
                      >
                        {selectedArticle.status === 'published'
                          ? '● Published'
                          : '○ Draft'}
                      </Text>
                    </View>
                  </View>

                  {/* Judul Artikel */}
                  <Text style={styles.detailTitle}>{selectedArticle.title}</Text>

                  {/* Meta Penulis & Tanggal */}
                  <View style={[styles.cardMetaRow, { marginBottom: 14 }]}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person-circle-outline" size={16} color="#7C3AED" />
                      <Text style={[styles.metaItemText, { fontWeight: '600' }]}>
                        {selectedArticle.author_name || 'Tim Medis CareFam'}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={15} color={adminColors.textMuted} />
                      <Text style={styles.metaItemText}>
                        {formatDate(selectedArticle.published_at)}
                      </Text>
                    </View>
                  </View>

                  {/* Ringkasan Box */}
                  <View style={styles.detailSummaryBox}>
                    <Text style={styles.detailSummaryText}>
                      "{selectedArticle.summary}"
                    </Text>
                  </View>

                  {/* Isi Konten Artikel */}
                  <Text style={styles.detailContentText}>
                    {selectedArticle.content}
                  </Text>
                </ScrollView>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
