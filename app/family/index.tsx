import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { FamilyMemberCard } from "../../components/cards/FamilyMemberCard";
import { Header } from "../../components/common/Header";
import { colors } from "../../constants/theme";
import {
  deleteStoredFamilyMember,
  getStoredFamilyMembers,
  INITIAL_FAMILY_MEMBERS,
  subscribeFamilyMembers,
} from "../../data/familyMembers";
import {
  deleteFamilyMember,
  getFamilyMembers,
} from "../../services/familyService";
import { styles } from "../../styles/family.styles";
import { FamilyMember } from "../../types";

export default function FamilyManagementScreen() {
  // RUBRIK Modul 2: useRouter untuk navigasi imperatif (Robi)
  const rout = useRouter();

  // RUBRIK Modul 2: useState untuk mengelola daftar anggota keluarga
  const [members, setMembers] = useState<FamilyMember[]>(() =>
    getStoredFamilyMembers(),
  );

  // RUBRIK Modul 2: useState untuk mengelola ID anggota yang sedang dipantau
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    const initialList = getStoredFamilyMembers();
    return initialList.length > 0 ? initialList[0].id : "";
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Memuat data anggota keluarga dari database Supabase
  const loadMembersFromDb = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const dbMembers = await getFamilyMembers();
      if (dbMembers && dbMembers.length > 0) {
        setMembers(dbMembers);
        setSelectedMemberId((prev) => {
          const exists = dbMembers.some((m) => m.id === prev);
          return exists ? prev : dbMembers[0].id;
        });
      } else {
        // Fallback ke local store jika belum ada data di Supabase
        const localList = getStoredFamilyMembers();
        setMembers(localList);
      }
    } catch (err) {
      console.warn("[FamilyScreen] Fallback ke local data:", err);
      setMembers(getStoredFamilyMembers());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMembersFromDb();
  }, [loadMembersFromDb]);

  // RUBRIK Modul 2: useEffect 1 — Berlangganan ke perubahan data store lokal
  useEffect(() => {
    const unsubscribe = subscribeFamilyMembers(() => {
      setMembers(getStoredFamilyMembers());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // RUBRIK Modul 2: useEffect 2 — Menjaga konsistensi profil yang dipilih saat daftar anggota berubah
  useEffect(() => {
    if (members.length === 0) {
      if (selectedMemberId !== "") {
        setSelectedMemberId("");
      }
    } else {
      const isCurrentSelectedValid = members.some(
        (member) => member.id === selectedMemberId,
      );
      if (!isCurrentSelectedValid) {
        setSelectedMemberId(members[0].id);
      }
    }
  }, [members, selectedMemberId]);

  // Handler memilih profil anggota untuk dipantau
  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
  };

  // CHECKPOINT 1: Handler navigasi imperatif menggunakan router.push()
  const handleAddMember = () => {
    rout.push("/family/add");
  };

  const handleViewDetail = (id: string) => {
    rout.push(`/family/${id}`);
  };

  // Handler UPDATE: Navigasi ke halaman form edit membawa ID anggota terpilih
  const handleEditMember = (id: string) => {
    rout.push(`/family/edit?id=${id}`);
  };

  // Handler DELETE dengan Optimistic UI:
  // 1. Simpan backup
  // 2. Hapus langsung dari tampilan secara instan
  // 3. Eksekusi query delete ke Supabase di background
  // 4. Rollback jika database gagal
  const handleDeleteMember = async (id: string, name: string) => {
    const executeDelete = async () => {
      const backupMembers = [...members];
      // Optimistic UI: langsung filter keluar dari tampilan
      setMembers((prev) => prev.filter((m) => m.id !== id));
      deleteStoredFamilyMember(id);

      try {
        await deleteFamilyMember(id);
      } catch (err: any) {
        console.warn("[FamilyScreen] Gagal delete di Supabase:", err);
        // Rollback state lokal jika gagal
        if (Platform.OS === "web") {
          window.alert(`Gagal menghapus: ${err?.message || "Kesalahan database"}`);
        } else {
          Alert.alert("Gagal Menghapus", err?.message || "Terjadi kesalahan saat menghapus data.");
        }
        setMembers(backupMembers);
      }
    };

    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm(`Apakah Anda yakin ingin menghapus data "${name}"?`)
          : true;
      if (confirmed) {
        executeDelete();
      }
    } else {
      Alert.alert(
        "Hapus Anggota Keluarga",
        `Apakah Anda yakin ingin menghapus data "${name}"? Tindakan ini tidak dapat dibatalkan.`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: executeDelete,
          },
        ]
      );
    }
  };

  // Handler simulasi kosongkan / kembalikan data untuk demo pengujian
  const handleToggleSimulation = () => {
    if (members.length > 0) {
      setMembers([]);
      setSelectedMemberId("");
    } else {
      setMembers([...INITIAL_FAMILY_MEMBERS]);
      setSelectedMemberId(INITIAL_FAMILY_MEMBERS[0]?.id || "");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Halaman Family Management */}
      <Header
        title="Keluarga Saya"
        subtitle="Kelola profil dan pemantauan kesehatan keluarga"
        backgroundColor={colors.primary}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadMembersFromDb(true)}
            colors={[colors.primary]}
          />
        }
      >
        {/* Navigasi Kembali ke Dashboard */}
        <View style={styles.navigationBar}>
          <Link href="/dashboard" style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali ke Dashboard</Text>
          </Link>
        </View>

        {/* Baris Ringkasan & Tombol Aksi */}
        <View style={styles.topActions}>
          <Text style={styles.memberCountText}>
            {members.length > 0
              ? `${members.length} anggota keluarga terdaftar`
              : "Belum ada anggota terdaftar"}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah Anggota Keluarga"
            style={styles.addButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addButtonText}>+ Tambah Anggota</Text>
          </Pressable>
        </View>

        {isLoading && !isRefreshing ? (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 8, color: colors.muted }}>
              Memuat data keluarga dari database...
            </Text>
          </View>
        ) : members.length > 0 ? (
          members.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              isSelected={selectedMemberId === member.id}
              onSelect={handleSelectMember}
              onViewDetail={handleViewDetail}
              onEdit={handleEditMember}
              onDelete={(id) => handleDeleteMember(id, member.name)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>Daftar Keluarga Kosong</Text>
            <Text style={styles.emptyDescription}>
              Belum ada anggota keluarga yang terdaftar. Tambahkan anggota
              keluarga pertama Anda untuk mulai memantau kesehatannya.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tambah Anggota Baru"
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Text style={styles.addButtonText}>+ Tambah Anggota Baru</Text>
            </Pressable>
          </View>
        )}

        {/* Tombol Bantuan Demo: Kosongkan / Reset Data */}
        <View style={styles.demoToggleRow}>
          <Pressable onPress={handleToggleSimulation}>
            <Text style={styles.demoToggleText}>
              {members.length > 0
                ? "Simulasi Pengujian: Kosongkan Daftar"
                : "Simulasi Pengujian: Pulihkan Data Awal"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
