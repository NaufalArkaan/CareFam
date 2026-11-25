import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/common/Header';
import { colors } from '../../constants/theme';
import { getUserArticleDetail } from '../../services/educationService';
import { HealthEducationArticle } from '../../types/admin';
import { userEducationStyles as styles } from '../../styles/userEducation.styles';

const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'Nutrisi':
      return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' };
    case 'Kesehatan Anak':
      return { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' };
    case 'Lansia':
      return { bg: '#FAF5FF', border: '#E9D5FF', text: '#9333EA' };
    case 'Penyakit Kronis':
      return { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' };
    case 'Gaya Hidup':
      return { bg: '#ECFEFF', border: '#A5F3FC', text: '#0891B2' };
    default:
      return { bg: '#F1F5F9', border: '#CBD5E1', text: '#475569' };
  }
};

export default function UserEducationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const articleId = params.id ? String(params.id).trim() : '';

  const [article, setArticle] = useState<HealthEducationArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      if (!articleId) {
        if (isMounted) {
          setIsLoading(false);
          setErrorMessage('ID artikel tidak ditemukan.');
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getUserArticleDetail(articleId);
        if (isMounted) {
          if (!data) {
            setErrorMessage('Artikel ini tidak tersedia, berstatus draf, atau telah ditarik dari publikasi.');
          } else {
            setArticle(data);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err?.message || 'Terjadi kesalahan saat memuat artikel edukasi.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/education');
    }
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(
            `${article.title} - Baca selengkapnya di CareFam Health Education`
          );
          window.alert('Tautan artikel berhasil disalin ke clipboard!');
        } else {
          window.alert(`Bagikan: ${article.title}`);
        }
      } else {
        await Share.share({
          title: article.title,
          message: `${article.title}\n\n${article.summary}\n\nBaca artikel kesehatan terpercaya ini di aplikasi CareFam.`,
        });
      }
    } catch {
      // Abaikan cancel
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // State Memuat Data
  if (isLoading) {
    return (
      <View style={styles.detailContainer}>
        <Header
          title="Membaca Artikel"
          subtitle="Memuat konten edukasi..."
          backgroundColor={colors.primary}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: '#64748B', fontSize: 13 }}>
            Memuat naskah artikel kesehatan dari CareFam...
          </Text>
        </View>
      </View>
    );
  }

  // State Artikel Tidak Ditemukan / Draft
  if (errorMessage || !article) {
    return (
      <View style={styles.detailContainer}>
        <Header
          title="Edukasi Kesehatan"
          subtitle="Informasi artikel tidak ditemukan"
          backgroundColor={colors.primary}
        />
        <View style={styles.navigationBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Daftar Edukasi"
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={styles.backButtonText}>Kembali ke Daftar Edukasi</Text>
          </Pressable>
        </View>

        <View style={styles.stateContainer}>
          <Text style={styles.stateIcon}>📄</Text>
          <Text style={styles.stateTitle}>Artikel Tidak Tersedia</Text>
          <Text style={styles.stateSubtitle}>
            {errorMessage || 'Artikel yang Anda tuju belum dipublikasikan atau sedang ditinjau oleh tim medis.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Daftar Edukasi"
            style={styles.retryButton}
            onPress={() => router.replace('/education')}
          >
            <Text style={styles.retryButtonText}>Jelajahi Artikel Lain</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const badgeStyle = getCategoryBadgeStyle(article.category);
  const paragraphs = article.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <View style={styles.detailContainer}>
      {/* CareFam Header */}
      <Header
        title="Baca Artikel"
        subtitle={article.category}
        backgroundColor={colors.primary}
      />

      {/* Navigasi Bar Atas */}
      <View style={styles.navigationBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Daftar Edukasi"
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={18} color={colors.primary} />
          <Text style={styles.backButtonText}>Daftar Artikel</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bagikan artikel ini"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6 }}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.primary} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>Bagikan</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
        {/* Gambar Banner Artikel (Jika Ada) */}
        {article.image_url ? (
          <Image
            source={{ uri: article.image_url }}
            style={styles.detailImage}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.detailHeaderContent}>
          {/* Bar Kategori & Tanggal Rilis */}
          <View style={styles.detailCategoryRow}>
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
                {article.category}
              </Text>
            </View>

            <Text style={styles.dateText}>
              {formatDate(article.published_at || article.created_at)}
            </Text>
          </View>

          {/* Judul Utama Artikel */}
          <Text style={styles.detailTitle}>{article.title}</Text>

          {/* Profil Penulis & Verifikasi Medis */}
          <View style={styles.authorCard}>
            <View style={styles.authorAvatarBox}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.authorNameDetail}>
                  {article.author_name || 'Tim Medis CareFam'}
                </Text>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              </View>
              <Text style={styles.authorRoleDetail}>
                Peninjau Medis Terverifikasi • CareFam Health Editorial
              </Text>
            </View>
          </View>

          {/* Ringkasan Eksekutif (Lead Summary) */}
          <View style={styles.summaryHighlightBox}>
            <Text style={styles.summaryHighlightTitle}>POKOK INFORMASI</Text>
            <Text style={styles.summaryHighlightText}>{article.summary}</Text>
          </View>
        </View>

        {/* Isi Lengkap Naskah Artikel */}
        <View style={styles.contentBody}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.contentParagraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Kotak Penafian / Catatan Medis Resmi */}
        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="shield-checkmark" size={18} color="#92400E" />
            <Text style={styles.disclaimerTitle}>Catatan Medis & Etika CareFam</Text>
          </View>
          <Text style={styles.disclaimerText}>
            Informasi kesehatan ini diterbitkan sebagai panduan edukatif keluarga dan tidak menggantikan pemeriksaan langsung, diagnosis, serta resep terapi dari dokter spesialis. Hubungi faskes atau layanan darurat apabila terdapat perburukan gejala klinis.
          </Text>
        </View>

        {/* Tombol Kembali ke Daftar di Bagian Bawah */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Selesai membaca dan kembali ke daftar edukasi"
          style={styles.backToTopButton}
          onPress={() => router.replace('/education')}
        >
          <Ionicons name="arrow-back" size={16} color="#475569" />
          <Text style={styles.backToTopText}>Kembali ke Daftar Edukasi</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
