import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Header } from '../components/common/Header';
import { InfoCard } from '../components/cards/InfoCard';
import { FeatureCard } from '../components/cards/FeatureCard';
import { PROFILE_INFO, USER_FEATURES } from '../data/userDashboard';
import { getAccountsByRole } from '../utils/login';
import { getGreeting } from '../utils/userDashboard';
import { getSummaryText, isFullWidthCard } from '../utils/features';
import { colors } from '../constants/theme';
import { styles } from '../styles/userDashboard.styles';

export default function UserDashboardScreen() {
  // RUBRIK: Custom Function & Loop (Mengambil data akun demo user dan menyapa pengguna)
  const userAccount = getAccountsByRole('user')[0];
  const greeting = getGreeting(userAccount ? userAccount.name : 'Pengguna');
  const summaryText = getSummaryText(USER_FEATURES, 'layanan');

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seksi Profil Pengguna */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun dan profil pengguna</Text>
          {/* RUBRIK: Type & Array of Objects (PROFILE_INFO di-map ke komponen InfoCard) */}
          {PROFILE_INFO.map((info) => (
            <InfoCard key={info.id} item={info} />
          ))}
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
                /* RUBRIK: Inline & External Styles (Inline style untuk menentukan lebar kartu grid: 100% jika total ganjil & item terakhir, 48% untuk dua kolom) */
                <View key={item.id} style={{ width: fullWidth ? '100%' : '48%' }}>
                  {item.status === 'active' ? (
                    <Link href={item.route as any} asChild>
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            CareFam adalah pendamping informasi dan bukan pengganti saran tenaga kesehatan.
          </Text>
        </View>

        {/* Tautan Keluar */}
        <View style={styles.logoutContainer}>
          <Link href="/login" style={styles.logoutText}>
            Keluar
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
