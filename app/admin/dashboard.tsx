import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatCard } from "../../components/cards/StatCard";
import { useAuth } from "../../context/AuthContext";
import {
    ADMIN_MENUS,
    ADMIN_STATS as INITIAL_STATS,
} from "../../data/adminDashboard";
import { getAdminDashboardStats } from "../../services/adminService";
import { signOutUser } from "../../services/authService";
import { adminColors, styles } from "../../styles/adminDashboard.styles";
import { AdminStat, FeatureItem } from "../../types";

// Pemetaan ikon vektor profesional untuk setiap modul manajemen
const getMenuIcon = (id: number): keyof typeof Ionicons.glyphMap => {
  switch (id) {
    case 1:
      return "people";
    case 2:
      return "medkit";
    case 3:
      return "book";
    case 4:
      return "shield-checkmark";
    case 5:
      return "radio";
    case 6:
      return "settings";
    case 7:
      return "document-text";
    default:
      return "grid";
  }
};

// Pemetaan kombinasi warna pastel lingkaran & ikon navigasi horizontal
const getMenuStyle = (id: number) => {
  switch (id) {
    case 1: // User Management: Blue
      return { bg: "#EFF6FF", border: "#BFDBFE", color: "#2563EB" };
    case 2: // Hospital Management: Green
      return { bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" };
    case 3: // Health Education: Purple
      return { bg: "#F5F3FF", border: "#DDD6FE", color: "#7C3AED" };
    case 4: // Report Management: Orange
      return { bg: "#FFF7ED", border: "#FED7AA", color: "#EA580C" };
    case 5: // SOS Monitoring: Pink/Red
      return { bg: "#FFF1F2", border: "#FECDD3", color: "#E11D48" };
    case 6: // System Settings: Slate/Grey
      return { bg: "#F1F5F9", border: "#CBD5E1", color: "#475569" };
    case 7: // Medical Records: Teal
      return { bg: "#F0FDFA", border: "#99F6E4", color: "#0D9488" };
    default:
      return { bg: "#F8FAFC", border: "#E2E8F0", color: "#64748B" };
  }
};

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  // State untuk Bottom Sheet / Modal menu profil administrator
  const [isProfileSheetVisible, setIsProfileSheetVisible] = useState(false);

  // State metrik statistik aplikasi
  const [stats, setStats] = useState<AdminStat[]>(INITIAL_STATS);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Informasi akun aktual administrator dari AuthContext
  const adminName =
    user?.user_metadata?.callsign ||
    user?.user_metadata?.name ||
    "Administrator";
  const adminEmail = user?.email || "admin@carefam.test";
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined);

  // Inisial avatar 2 karakter dari nama atau email
  const initials =
    (adminName || "AD")
      .split(" ")
      .filter(Boolean)
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  // Memuat data statistik aktual
  const loadDashboardStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsStatsLoading(true);
    }

    try {
      const data = await getAdminDashboardStats();
      setStats([
        {
          id: 1,
          label: "Total Pengguna",
          value: data.totalUsers,
          icon: "people",
          color: "#2563EB",
        },
        {
          id: 2,
          label: "Anggota Keluarga",
          value: data.totalFamilyMembers,
          icon: "heart",
          color: "#0D9488",
        },
        {
          id: 3,
          label: "Fasilitas Kesehatan",
          value: data.totalFacilities ?? 0,
          icon: "business",
          color: "#7C3AED",
        },
        {
          id: 4,
          label: "Laporan Masuk",
          value: data.totalReports ?? 0,
          icon: "document-text",
          color: "#D97706",
        },
      ]);
    } catch (err) {
      console.error("[AdminDashboardScreen] Gagal memuat data statistik:", err);
    } finally {
      setIsStatsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  // Alur Logout dengan Dialog Konfirmasi
  const handleLogoutConfirmation = () => {
    // Pada lingkungan Web, Alert.alert tidak memicu callback tombol
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined'
        ? window.confirm('Apakah Anda yakin ingin mengakhiri sesi administrator ini?')
        : true;
      if (confirmed) {
        executeLogout();
      }
      return;
    }

    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin mengakhiri sesi administrator ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: executeLogout,
        },
      ],
      { cancelable: true },
    );
  };

  // Eksekusi resmi signOut dan pengalihan ke Halaman Login User
  const executeLogout = async () => {
    setIsProfileSheetVisible(false);
    try {
      // 1. Bersihkan state AuthContext secara instan untuk mencegah pemantulan navigasi
      await signOut();
      // 2. Bersihkan sesi Supabase & SecureStore
      await signOutUser();
      // 3. Arahkan langsung ke Halaman Login User
      router.replace("/login");
    } catch (error) {
      console.error("[AdminDashboard] Gagal melakukan logout:", error);
      Alert.alert(
        "Gagal Keluar",
        "Terjadi kesalahan saat mengakhiri sesi. Silakan coba lagi.",
        [{ text: "OK" }]
      );
    }
  };

  // Feedback interaksi untuk Menu Manajemen yang masih dalam pengembangan
  const handleMenuPress = (item: FeatureItem) => {
    Alert.alert(
      "Fitur Dalam Pengembangan",
      `Modul "${item.title}" saat ini masih dalam tahap pengembangan dan akan segera tersedia pada pembaruan mendatang.`,
      [{ text: "Mengerti", style: "default" }],
    );
  };

  return (
    <View style={styles.container}>
      {/* Alur Scroll Tunggal: Header ikut scroll ke atas secara natural */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 28) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadDashboardStats(true)}
            tintColor={adminColors.royalBlue}
          />
        }
      >
        {/* ===== Hero Header (Pastel Blue ke Lavender Gradient) ===== */}
        <LinearGradient
          colors={[
            adminColors.pastelBlue,
            adminColors.lavender,
            adminColors.background,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.heroGradient,
            { paddingTop: Math.max(insets.top + 8, 44) },
          ]}
        >
          {/* Bar Navigasi Atas: Identitas Aplikasi & Status Faktual */}
          <View style={styles.headerTopNav}>
            <View style={styles.appIdentityPill}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={adminColors.royalBlue}
              />
              <Text style={styles.appIdentityText}>CareFam Admin</Text>
            </View>
            <View style={styles.systemStatusPill}>
              <Ionicons
                name="shield-checkmark-outline"
                size={13}
                color={adminColors.royalBlue}
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>Sesi Terproteksi</Text>
            </View>
          </View>

          {/* Profil Administrator Interaktif (Tekan untuk membuka menu profil & opsi keluar) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buka menu profil administrator"
            style={({ pressed }) => [
              styles.profilePressable,
              { opacity: pressed ? 0.8 : 1.0 },
            ]}
            onPress={() => setIsProfileSheetVisible(true)}
          >
            <View style={styles.profileInfoWrapper}>
              <Text style={styles.greetingText}>Selamat Bertugas</Text>
              <Text style={styles.adminNameText} numberOfLines={1}>
                {adminName}
              </Text>
              <View style={styles.roleBadgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>ADMINISTRATOR</Text>
                </View>
                <Text style={styles.emailText} numberOfLines={1}>
                  {adminEmail}
                </Text>
              </View>
            </View>

            {/* Avatar (Foto Aktual jika ada, atau Inisial Bergradasi) & Indikator Opsi */}
            <View style={styles.profileAvatarSide}>
              <View style={styles.avatarContainer}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <LinearGradient
                    colors={["#EDE9FE", "#DBEAFE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </LinearGradient>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={adminColors.textMuted}
              />
            </View>
          </Pressable>
        </LinearGradient>

        {/* ===== Konten Utama Dashboard ===== */}
        <View style={styles.mainContent}>
          {/* Welcome Banner Ringkas (Informasi penyambutan murni non-navigasi) */}
          <LinearGradient
            colors={["#EBF3FE", "#F3E8FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeBanner}
          >
            <View style={styles.welcomeBannerIconBadge}>
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={adminColors.royalBlue}
              />
            </View>
            <View style={styles.welcomeBannerTextWrapper}>
              <Text style={styles.welcomeBannerTitle}>
                Selamat datang di CareFam!
              </Text>
              <Text style={styles.welcomeBannerDescription}>
                Kelola dan pantau layanan kesehatan keluarga melalui satu
                platform.
              </Text>
            </View>
          </LinearGradient>

          {/* Seksi Metrik Statistik */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Statistik Aplikasi</Text>
                {isStatsLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={adminColors.royalBlue}
                  />
                ) : null}
              </View>
              <Text style={styles.sectionSummary}>
                Ringkasan indikator dan metrik pengguna layanan
              </Text>
            </View>

            <View style={styles.statGrid}>
              {/* RUBRIK: Type & Array of Objects */}
              {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </View>
          </View>

          {/* Seksi Menu Manajemen: Horizontal Scroll Navigation */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Menu Manajemen</Text>
              </View>
              <Text style={styles.sectionSummary}>
                Akses cepat modul dan layanan administrasi
              </Text>
            </View>

            {/* Navigasi Ikon Horizontal dengan Gesture Geser (Swipe) */}
            <View style={styles.horizontalMenuContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalMenuScroll}
              >
                {ADMIN_MENUS.map((item: FeatureItem) => {
                  const menuIcon = getMenuIcon(item.id);
                  const menuStyle = getMenuStyle(item.id);
                  const isActive = item.status === "active";

                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Buka modul ${item.title}`}
                      style={({ pressed }) => [
                        styles.horizontalMenuItem,
                        { opacity: pressed ? 0.75 : 1.0 },
                      ]}
                      onPress={() => {
                        if (isActive) {
                          router.push(item.route as any);
                        } else {
                          handleMenuPress(item);
                        }
                      }}
                    >
                      {/* Wadah Ikon Berbentuk Lingkaran Pastel */}
                      <View
                        style={[
                          styles.circleIconContainer,
                          {
                            backgroundColor: menuStyle.bg,
                            borderColor: menuStyle.border,
                          },
                          isActive && styles.circleIconActive,
                        ]}
                      >
                        <Ionicons
                          name={menuIcon}
                          size={24}
                          color={menuStyle.color}
                        />
                        {/* Dot penanda aktif */}
                        {isActive ? (
                          <View style={styles.activeDotBadge} />
                        ) : null}
                      </View>

                      {/* Judul Menu di Bawah Ikon */}
                      <Text
                        style={[
                          styles.horizontalMenuTitle,
                          isActive && styles.horizontalMenuTitleActive,
                        ]}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ===== Bottom Sheet / Modal Profil Administrator & Logout ===== */}
      <Modal
        visible={isProfileSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsProfileSheetVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsProfileSheetVisible(false)}
        >
          {/* Kontainer Sheet (Cegah close saat area sheet ditekan) */}
          <Pressable
            style={styles.sheetContainer}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle Drag Bar */}
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>Menu Administrator</Text>

            {/* Informasi Akun Profil Lengkap */}
            <View style={styles.sheetProfileCard}>
              <View style={styles.sheetAvatarContainer}>
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.sheetAvatarImage}
                  />
                ) : (
                  <Text style={styles.sheetAvatarInitials}>{initials}</Text>
                )}
              </View>
              <View style={styles.sheetProfileInfo}>
                <Text style={styles.sheetAdminName}>{adminName}</Text>
                <Text style={styles.sheetAdminEmail}>{adminEmail}</Text>
                <View style={styles.sheetRoleBadge}>
                  <Text style={styles.sheetRoleBadgeText}>ADMINISTRATOR</Text>
                </View>
              </View>
            </View>

            {/* Aksi Sesi: Tombol Keluar dari Akun (Memicu Dialog Konfirmasi) */}
            <View style={styles.sheetActionSection}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Keluar dari akun administrator"
                style={({ pressed }) => [
                  styles.sheetLogoutButton,
                  { opacity: pressed ? 0.8 : 1.0 },
                ]}
                onPress={handleLogoutConfirmation}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={adminColors.dangerRed}
                />
                <Text style={styles.sheetLogoutText}>Keluar dari akun</Text>
              </Pressable>

              {/* Tombol Tutup Sheet */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tutup menu profil"
                style={({ pressed }) => [
                  styles.sheetCloseButton,
                  { opacity: pressed ? 0.75 : 1.0 },
                ]}
                onPress={() => setIsProfileSheetVisible(false)}
              >
                <Text style={styles.sheetCloseText}>Tutup</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
