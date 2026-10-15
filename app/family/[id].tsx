import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { getStoredFamilyMembers } from '../../data/familyMembers';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/family.styles';

export default function FamilyMemberDetailScreen() {
  const router = useRouter();

  // Mengambil parameter ID dari URL dinamis /family/[id]
  const { id } = useLocalSearchParams<{ id: string }>();

  // CHECKPOINT 2: Handler navigasi kembali dengan router.back() dan fallback aman
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/family');
    }
  };

  // Mencari anggota berdasarkan ID dari store
  const members = getStoredFamilyMembers();
  const member = members.find((m) => m.id === id);

  // Tampilan jika anggota tidak ditemukan
  if (!member) {
    return (
      <View style={styles.container}>
        <Header
          title="Detail Anggota"
          subtitle="Informasi anggota keluarga"
          backgroundColor={colors.primary}
        />
        <View style={styles.scrollContent}>
          <View style={styles.navigationBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke Daftar"
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>← Kembali ke Daftar</Text>
            </Pressable>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>❓</Text>
            <Text style={styles.emptyTitle}>Anggota Tidak Ditemukan</Text>
            <Text style={styles.emptyDescription}>
              Anggota keluarga dengan ID tersebut tidak ditemukan dalam daftar.
            </Text>
            {/* CHECKPOINT 3: Menggunakan router.replace() untuk mengganti layar rute error dengan daftar keluarga */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke Daftar Keluarga"
              style={styles.addButton}
              onPress={() => router.replace('/family')}
            >
              <Text style={styles.addButtonText}>Kembali ke Daftar Keluarga</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Tampilan detail anggota
  return (
    <View style={styles.container}>
      <Header
        title="Detail Anggota"
        subtitle={member.name}
        backgroundColor={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigasi kembali menggunakan router.back() */}
        <View style={styles.navigationBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Daftar"
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>← Kembali ke Daftar</Text>
          </Pressable>
        </View>

        {/* Kartu Informasi Detail Anggota */}
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.memberRelationBadge}>
                <Text style={styles.memberRelationText}>{member.relationship}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailLabel}>Tanggal Lahir</Text>
              <Text style={styles.detailValue}>{member.birthDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.detailLabel}>Kontak Darurat</Text>
              <Text style={styles.detailValue}>
                {member.emergencyContact || 'Tidak tersedia'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
