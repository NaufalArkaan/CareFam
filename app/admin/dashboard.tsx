import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/cards/StatCard';
import { FeatureCard } from '../../components/cards/FeatureCard';
import { ADMIN_STATS, ADMIN_MENUS } from '../../data/adminDashboard';
import { getSummaryText, isFullWidthCard } from '../../utils/features';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/adminDashboard.styles';

export default function AdminDashboardScreen() {
  const summaryText = getSummaryText(ADMIN_MENUS, 'menu');

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
        
        {/* Seksi Ringkasan Statistik */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ringkasan</Text>
          </View>
          
          <View style={styles.statGrid}>
            {/* RUBRIK: Custom Function & Loop (ADMIN_STATS di-map untuk merender deretan StatCard) */}
            {ADMIN_STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </View>
        </View>

        {/* Seksi Menu Pengelolaan */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu Pengelolaan</Text>
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

        {/* Tautan Keluar */}
        <View style={styles.logoutContainer}>
          <Link href="/admin/login" style={styles.logoutText}>
            Keluar
          </Link>
        </View>

      </ScrollView>
    </View>
  );
}
