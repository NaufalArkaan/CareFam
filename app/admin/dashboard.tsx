import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/cards/StatCard';
import { FeatureCard } from '../../components/cards/FeatureCard';
import { ADMIN_STATS, ADMIN_MENUS } from '../../data/adminDashboard';
import { getSummaryText, isFullWidthCard } from '../../utils/features';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/adminDashboard.styles';
import { signOutUser } from '../../services/authService';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const summaryText = getSummaryText(ADMIN_MENUS, 'menu');

  // Sign out resmi Supabase Auth untuk Admin
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // Abaikan error jaringan agar admin tetap bisa kembali ke login
    } finally {
      router.replace('/admin/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* RUBRIK: Inline & External Styles */}
      {/* Alasan inline style: Warna backgroundColor header untuk admin dibuat berbeda dengan user secara dinamis melalui props, admin memakai colors.text (gelap). */}
      <Header
        title="Panel Admin CareFam"
        subtitle="Ringkasan dan statistik aplikasi"
        backgroundColor={colors.text}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seksi Metrik Statistik */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Statistik Aplikasi</Text>
          <View style={styles.statGrid}>
            {/* RUBRIK: Type & Array of Objects (ADMIN_STATS di-map untuk merender StatCard) */}
            {ADMIN_STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </View>
        </View>

        {/* Seksi Menu Manajemen */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu Manajemen</Text>
            <Text style={styles.sectionSummary}>{summaryText}</Text>
          </View>
          
          <View style={styles.menuGrid}>
            {/* RUBRIK: Custom Function & Loop (ADMIN_MENUS di-map untuk merender grid FeatureCard) */}
            {ADMIN_MENUS.map((item, index) => {
              // Reuse fungsi isFullWidthCard milik Syahrial tanpa diduplikasi
              const fullWidth = isFullWidthCard(index, ADMIN_MENUS.length);
              
              return (
                /* RUBRIK: Inline & External Styles (Inline style lebar pembungkus kartu menu: 100% jika ganjil & terakhir, sisanya 48% agar pas 2 kolom) */
                <View key={item.id} style={{ width: fullWidth ? '100%' : '48%' }}>
                  {item.status === 'active' ? (
                    <Link href={item.route as any} asChild>
                      <FeatureCard item={item} />
                    </Link>
                  ) : (
                    <FeatureCard item={item} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Tautan Keluar (Sign Out) */}
        <View style={styles.logoutContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keluar dari Panel Admin"
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Keluar</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}
