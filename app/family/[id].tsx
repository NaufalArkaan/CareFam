import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Header } from "../../components/common/Header";
import { colors } from "../../constants/theme";
import {
  deleteStoredFamilyMember,
  getStoredFamilyMembers,
} from "../../data/familyMembers";
import {
  deleteFamilyMember,
  getFamilyMemberDetail,
} from "../../services/familyService";
import { styles } from "../../styles/family.styles";
import { FamilyMember } from "../../types";

export default function FamilyMemberDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // State anggota yang diambil dari Supabase / Local store
  const [member, setMember] = useState<FamilyMember | null>(() => {
    const local = getStoredFamilyMembers().find((m) => m.id === id);
    return local || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!member);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      getFamilyMemberDetail(id)
        .then((dbMember) => {
          if (isMounted && dbMember) {
            setMember(dbMember);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handler navigasi kembali
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/family");
    }
  };

  // Tampilan loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Detail Anggota"
          subtitle="Memuat informasi..."
          backgroundColor={colors.primary}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.muted }}>
            Memuat profil dari database...
          </Text>
        </View>
      </View>
    );
  }

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
              Anggota keluarga dengan ID tersebut tidak ditemukan dalam database.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke Daftar Keluarga"
              style={styles.addButton}
              onPress={() => router.replace("/family")}
            >
              <Text style={styles.addButtonText}>
                Kembali ke Daftar Keluarga
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Tampilan detail anggota aktual dari database
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
                <Text style={styles.memberRelationText}>
                  {member.relationship}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailLabel}>Tanggal Lahir</Text>
              <Text style={styles.detailValue}>{member.birthDate}</Text>
            </View>

            {member.gender ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>👤</Text>
                <Text style={styles.detailLabel}>Jenis Kelamin</Text>
                <Text style={styles.detailValue}>
                  {member.gender === "male" ? "Laki-laki" : "Perempuan"}
                </Text>
              </View>
            ) : null}

            {member.bloodType ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🩸</Text>
                <Text style={styles.detailLabel}>Golongan Darah</Text>
                <Text style={styles.detailValue}>{member.bloodType}</Text>
              </View>
            ) : null}

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.detailLabel}>Kontak Darurat</Text>
              <Text style={styles.detailValue}>
                {member.emergencyContact || "Tidak tersedia"}
              </Text>
            </View>

            {member.allergies ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>⚠️</Text>
                <Text style={styles.detailLabel}>Riwayat Alergi</Text>
                <Text style={styles.detailValue}>{member.allergies}</Text>
              </View>
            ) : null}
          </View>

          {/* Tombol Aksi CRUD: Edit & Hapus Anggota */}
          <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit Anggota Keluarga"
                style={[styles.editButton, { flex: 1, minHeight: 44, flexDirection: 'row', gap: 6 }]}
                onPress={() => router.push(`/family/edit?id=${member.id}`)}
              >
                <Text style={[styles.editButtonText, { fontSize: 14 }]}>✏️ Edit Profil</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Hapus Anggota Keluarga"
                style={[styles.deleteButton, { flex: 1, minHeight: 44, flexDirection: 'row', gap: 6 }]}
                onPress={() => {
                  const doDelete = async () => {
                    try {
                      deleteStoredFamilyMember(member.id);
                      await deleteFamilyMember(member.id);
                      if (Platform.OS === 'web') {
                        window.alert('Data anggota keluarga berhasil dihapus.');
                      } else {
                        Alert.alert('Berhasil', 'Data anggota keluarga berhasil dihapus.');
                      }
                      router.replace('/family');
                    } catch (err: any) {
                      if (Platform.OS === 'web') {
                        window.alert(`Gagal menghapus: ${err?.message || 'Kesalahan database'}`);
                      } else {
                        Alert.alert('Gagal Menghapus', err?.message || 'Terjadi kesalahan saat menghapus data.');
                      }
                    }
                  };

                  if (Platform.OS === 'web') {
                    if (window.confirm(`Apakah Anda yakin ingin menghapus "${member.name}" dari daftar keluarga?`)) {
                      doDelete();
                    }
                  } else {
                    Alert.alert(
                      'Konfirmasi Hapus',
                      `Apakah Anda yakin ingin menghapus "${member.name}" dari daftar keluarga?`,
                      [
                        { text: 'Batal', style: 'cancel' },
                        { text: 'Hapus', style: 'destructive', onPress: doDelete },
                      ]
                    );
                  }
                }}
              >
                <Text style={[styles.deleteButtonText, { fontSize: 14 }]}>🗑️ Hapus Anggota</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
