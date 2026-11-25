import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/common/Header';
import { colors } from '../../constants/theme';
import { getUserPublishedArticles } from '../../services/educationService';
import {
  EducationCategory,
  HealthEducationArticle,
} from '../../types/admin';
import { userEducationStyles as styles } from '../../styles/userEducation.styles';

const CATEGORIES: ('all' | EducationCategory)[] = [
  'all',
  'Nutrisi',
  'Kesehatan Anak',
  'Lansia',
  'Penyakit Kronis',
  'Gaya Hidup',
  'Umum',
];

const getCategoryBadgeStyle = (category: EducationCategory) => {
  switch (category) {
    case 'Nutrisi':
      return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', icon: 'nutrition-outline' as const };
    case 'Kesehatan Anak':
      return { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', icon: 'happy-outline' as const };
    case 'Lansia':
      return { bg: '#FAF5FF', border: '#E9D5FF', text: '#9333EA', icon: 'heart-outline' as const };
    case 'Penyakit Kronis':
      return { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C', icon: 'pulse-outline' as const };
    case 'Gaya Hidup':
      return { bg: '#ECFEFF', border: '#A5F3FC', text: '#0891B2', icon: 'bicycle-outline' as const };
    default:
      return { bg: '#F1F5F9', border: '#CBD5E1', text: '#475569', icon: 'book-outline' as const };
  }
};

export default function UserEducationListScreen() {
  const router = useRouter();

  // State pencarian, filter, dan pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // State data artikel
  const [articles, setArticles] = useState<HealthEducationArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fungsi memuat artikel edukasi berstatus published
  const loadArticles = useCallback(
    async (targetPage: number = page, isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const result = await getUserPublishedArticles({
          search: searchQuery,
          categoryFilter: selectedCategory,
          page: targetPage,
          pageSize,
        });

        setArticles(result.articles);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'Gagal memuat artikel edukasi. Silakan periksa koneksi Anda.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedCategory, page]
  );

  // Muat data saat kategori berubah
  useEffect(() => {
    loadArticles(1);
  }, [selectedCategory]);

  const handleSearchSubmit = () => {
    loadArticles(1);
  };

  const handleRefresh = () => {
    loadArticles(1, true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
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

  return (
    <View style={styles.container}>
      {/* CareFam Header */}
      <Header
        title="Edukasi Kesehatan"
        subtitle="Artikel dan panduan kesehatan keluarga terpercaya"
        backgroundColor={colors.primary}
      />

      {/* Navigasi Bar Kembali & Total Konten */}
      <View style={styles.navigationBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Dashboard"
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={18} color={colors.primary} />
          <Text style={styles.backButtonText}>Kembali ke Dashboard</Text>
        </Pressable>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{totalCount} Artikel Tersedia</Text>
        </View>
      </View>

      {/* Hero & Search Bar */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Berita & Tips Sehat</Text>
        <Text style={styles.heroSubtitle}>
          Kumpulan rujukan medis preventif dan edukasi gizi dari tenaga kesehatan profesional untuk keluarga Anda.
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#94A3B8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari topik kesehatan, gejala, atau gizi..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
              style={styles.clearSearchButton}
              onPress={() => {
                setSearchQuery('');
                loadArticles(1);
              }}
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter Kategori Horizontal Chips */}
      <View style={{ backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'all' ? 'Semua Topik' : cat;

            return (
              <Pressable
                key={cat}
                accessibilityRole="button"
                accessibilityLabel={`Kategori ${label}`}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Konten Daftar Artikel Edukasi */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: '#64748B', fontSize: 13 }}>
            Memuat artikel kesehatan dari CareFam...
          </Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateIcon}>⚠️</Text>
          <Text style={styles.stateTitle}>Gagal Memuat Konten</Text>
          <Text style={styles.stateSubtitle}>{errorMessage}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Coba muat ulang artikel"
            style={styles.retryButton}
            onPress={() => loadArticles(1)}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : articles.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateIcon}>🔍</Text>
          <Text style={styles.stateTitle}>Artikel Tidak Ditemukan</Text>
          <Text style={styles.stateSubtitle}>
            {searchQuery
              ? `Tidak ada artikel edukasi yang cocok dengan kata kunci "${searchQuery}".`
              : 'Belum ada artikel yang dipublikasikan pada kategori ini.'}
          </Text>
          {searchQuery || selectedCategory !== 'all' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset filter artikel"
              style={styles.retryButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.retryButtonText}>Tampilkan Semua Topik</Text>
            </Pressable>
          ) : null}
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
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => {
            const badgeStyle = getCategoryBadgeStyle(item.category);

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Baca artikel ${item.title}`}
                style={styles.articleCard}
                onPress={() => router.push(`/education/${item.id}` as any)}
              >
                {/* Gambar Thumbnail (jika ada) */}
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : null}

                <View style={styles.cardBody}>
                  {/* Metadata Row: Kategori & Tanggal */}
                  <View style={styles.cardMetaRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        {
                          backgroundColor: badgeStyle.bg,
                          borderColor: badgeStyle.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: badgeStyle.text },
                        ]}
                      >
                        {item.category}
                      </Text>
                    </View>

                    <Text style={styles.dateText}>
                      {formatDate(item.published_at || item.created_at)}
                    </Text>
                  </View>

                  {/* Judul Artikel */}
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  {/* Ringkasan Konten */}
                  <Text style={styles.articleSummary} numberOfLines={3}>
                    {item.summary}
                  </Text>

                  {/* Footer Kartu: Penulis & Tombol Baca */}
                  <View style={styles.cardFooter}>
                    <View style={styles.authorRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color={colors.primary}
                      />
                      <Text style={styles.authorText} numberOfLines={1}>
                        {item.author_name || 'Tim Medis CareFam'}
                      </Text>
                    </View>

                    <View style={styles.readButton}>
                      <Text style={styles.readButtonText}>Baca Selengkapnya</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={14}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
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
                    if (page > 1) loadArticles(page - 1);
                  }}
                  disabled={page <= 1}
                >
                  <Ionicons name="chevron-back" size={16} color="#0F172A" />
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
                    if (page < totalPages) loadArticles(page + 1);
                  }}
                  disabled={page >= totalPages}
                >
                  <Ionicons name="chevron-forward" size={16} color="#0F172A" />
                </Pressable>
              </View>
            ) : undefined
          }
        />
      )}
    </View>
  );
}
