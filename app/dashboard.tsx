import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Header } from '../components/common/Header';
import { InfoCard } from '../components/cards/InfoCard';
import { FeatureCard } from '../components/cards/FeatureCard';
import { WeatherCard } from '../components/cards/WeatherCard';
import { USER_FEATURES } from '../data/userDashboard';
import { getGreeting } from '../utils/userDashboard';
import { getSummaryText, isFullWidthCard } from '../utils/features';
import { colors } from '../constants/theme';
import { styles } from '../styles/userDashboard.styles';
import { signOutUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardData, UserDashboardData } from '../services/familyService';
import { getRecentPublishedArticles } from '../services/educationService';
import { HealthEducationArticle } from '../types/admin';
import { InfoItem } from '../types';

export default function UserDashboardScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  // State data pengguna aktual dari database Supabase
  const [dashboardData, setDashboardData] = useState<UserDashboardData>({
    email: user?.email || 'user@carefam.test',
    callsign: user?.user_metadata?.callsign || 'Keluarga',
    fullName: user?.user_metadata?.full_name || 'Pengguna CareFam',
    memberCount: 0,
    isLoading: true,
  });
  const [recentArticles, setRecentArticles] = useState<HealthEducationArticle[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memuat data aktual dari Supabase
  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const [data, articles] = await Promise.all([
        getUserDashboardData(),
        getRecentPublishedArticles(2),
      ]);
      setDashboardData(data);
      setRecentArticles(articles);
    } catch {
      const data = await getUserDashboardData();
      setDashboardData(data);
    } finally {
      if (refresh) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CHECKPOINT 5: Sign Out handler resmi Supabase Auth
  const handleLogout = async () => {
    try {
      await signOut();
      await signOutUser();
      router.replace('/login');
    } catch (error) {
      console.error('[UserDashboard] Gagal melakukan logout:', error);
    }
  };

  // Sapaan personal berdasarkan callsign aktual dari database
  const greeting = getGreeting(dashboardData.callsign || 'Pengguna');
  const summaryText = getSummaryText(USER_FEATURES, 'layanan');

  // RUBRIK: Type & Array of Objects (Dihasilkan dinamis dari database Supabase)
  const dynamicProfileInfo: InfoItem[] = [
    {
      id: 1,
      label: 'Email',
      value: dashboardData.email,
      icon: '📧',
    },
    {
      id: 2,
      label: 'Anggota keluarga',
      value: `${dashboardData.memberCount} orang`,
      icon: '👥',
    },
    {
      id: 3,
      label: 'Status akun',
      value: 'Aktif',
      icon: '✅',
    },
  ];

  return (
    <View style={styles.container}>
      {/* RUBRIK: External & Inline Styles (Header dengan warna primary dan sapaan pengguna) */}
      <Header
        title="CareFam"
        subtitle="Satu aplikasi untuk mengelola kesehatan keluarga"
        backgroundColor={colors.primary}
      >
        <Text style={styles.greetingText}>{greeting}</Text>
      </Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadData(true)}
            colors={[colors.primary]}
          />
        }
      >
        {/* Seksi Profil Pengguna Terhubung Supabase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun dan profil pengguna</Text>
          {/* RUBRIK: Type & Array of Objects (InfoItem di-map ke komponen InfoCard) */}
          {dynamicProfileInfo.map((info) => (
            <InfoCard key={info.id} item={info} />
          ))}
        </View>

        {/* RUBRIK Modul 3: Weather Card (Custom & Pre-built Async Function - Naufal) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kondisi Cuaca Hari Ini</Text>
          <WeatherCard />
        </View>

        {/* Seksi Layanan Keluarga */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Layanan Keluarga</Text>
            <Text style={styles.sectionSummary}>{summaryText}</Text>
          </View>

          <View style={styles.gridContainer}>
            {/* RUBRIK: Custom Function & Loop (USER_FEATURES di-map ke grid FeatureCard) */}
            {USER_FEATURES.map((item, index) => {
              const fullWidth = isFullWidthCard(index, USER_FEATURES.length);
              const cardContent = <FeatureCard item={item} />;

              return (
                /* RUBRIK: Inline & External Styles */
                <View key={item.id} style={{ width: fullWidth ? '100%' : '48%' }}>
                  {item.status === 'active' ? (
                    <Link href={item.route as any} asChild>
                      <Pressable style={{ width: '100%' }}>
                        {cardContent}
                      </Pressable>
                    </Link>
                  ) : (
                    cardContent
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Seksi Berita & Edukasi Kesehatan Terkini */}
        {recentArticles.length > 0 ? (
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={styles.sectionTitle}>Berita & Edukasi Kesehatan</Text>
                <Text style={styles.sectionSummary}>Rujukan medis preventif keluarga</Text>
              </View>
              <Link href="/education" asChild>
                <Pressable>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
                    Lihat Semua →
                  </Text>
                </Pressable>
              </Link>
            </View>

            {recentArticles.map((art) => (
              <Pressable
                key={art.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 10,
                }}
                onPress={() => router.push(`/education/${art.id}` as any)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                      {art.category}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: colors.muted }}>
                    {art.author_name || 'Tim Medis CareFam'}
                  </Text>
                </View>
                <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                  {art.title}
                </Text>
                <Text style={{ fontSize: 12.5, color: colors.muted, lineHeight: 18 }} numberOfLines={2}>
                  {art.summary}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            CareFam adalah pendamping informasi dan bukan pengganti saran tenaga kesehatan.
          </Text>
        </View>

        {/* Tautan Keluar (Sign Out) */}
        <View style={styles.logoutContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keluar dari Akun"
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Keluar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
