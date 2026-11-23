import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SplashScreenView } from "../components/common/SplashScreenView";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Tahan native splash screen agar tidak tertutup sebelum custom splash siap (Hanya native Android & iOS)
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

// Flag tingkat modul: menandakan apakah splash screen cold start sudah pernah selesai
let isColdStartSplashFinished = false;

/**
 * Route Protection Guard & Splash Transition Controller
 * Mengonsumsi AuthContext dan useSegments() dari Expo Router untuk mengamankan navigasi,
 * serta memastikan Splash Screen HANYA muncul pada saat Cold Start (buka aplikasi pertama kali),
 * dan TIDAK PERNAH muncul lagi saat logout atau berpindah rute.
 */
function RootNavigation() {
  const { session, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // State untuk mengontrol keberadaan custom splash screen di memori (Hanya saat Cold Start)
  const [isSplashMounted, setIsSplashMounted] = useState(
    !isColdStartSplashFinished
  );

  // Sembunyikan native splash screen begitu JS engine siap (Hanya native Android & iOS)
  useEffect(() => {
    if (Platform.OS !== "web") {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  useEffect(() => {
    // 1. Tahan seluruh proses redirect selama pemulihan sesi awal (rehydration)
    if (isLoading) return;

    const currentSegments: readonly string[] = segments;
    const firstSegment = currentSegments[0];
    const secondSegment = currentSegments[1];

    // Identifikasi segment autentikasi publik (login user & login admin)
    const isUserLogin = firstSegment === "login";
    const isAdminLogin = firstSegment === "admin" && secondSegment === "login";
    const inPublicAuthGroup = isUserLogin || isAdminLogin;

    // Evaluasi status autentikasi user
    const isAuthenticated = Boolean(session && user);

    // Tentukan route tujuan utama berdasarkan peran pengguna
    const isAdmin =
      user?.email === "admin@carefam.test" ||
      user?.user_metadata?.role === "admin";
    const homeRoute = isAdmin ? "/admin/dashboard" : "/dashboard";

    // 2. KONDISI: Belum login (Guest / Sesi kedaluwarsa / Setelah Logout)
    if (!isAuthenticated) {
      // Jika pengguna berada di root ('/' atau 'index') atau rute privat manapun,
      // arahkan secara konsisten ke Halaman Login User ('/login')
      if (!inPublicAuthGroup) {
        router.replace("/login");
      }
      return;
    }

    // 3. KONDISI: Sudah login (Authenticated)
    // Jika masih berada di rute login publik (login atau admin/login) atau di root ('/' atau 'index'):
    if (
      inPublicAuthGroup ||
      firstSegment === undefined ||
      firstSegment === "index"
    ) {
      router.replace(homeRoute);
      return;
    }

    // 4. KONDISI: Proteksi Peran
    // Jika pengguna biasa mencoba mengakses area rute '/admin/*'
    if (!isAdmin && firstSegment === "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [session, user, isLoading, segments, router]);

  return (
    <View style={styles.rootContainer}>
      {/* Status Bar cross-platform: ikon gelap pada latar belakang putih */}
      <StatusBar style="dark" />

      {/* Stack Navigator Utama */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade", // Transisi navigasi yang lembut
        }}
      >
        {/* Rute Utama & Autentikasi */}
        <Stack.Screen name="index" options={{ title: "CareFam" }} />
        <Stack.Screen name="login" options={{ title: "Masuk" }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />

        {/* Fitur Family Management (Modul 2) */}
        <Stack.Screen
          name="family/index"
          options={{ title: "Keluarga Saya" }}
        />
        <Stack.Screen name="family/add" options={{ title: "Tambah Anggota" }} />
        <Stack.Screen
          name="family/[id]"
          options={{ title: "Detail Anggota" }}
        />

        {/* Rute Admin (Modul 1 & User Management) */}
        <Stack.Screen name="admin/login" options={{ title: "Masuk Admin" }} />
        <Stack.Screen
          name="admin/dashboard"
          options={{ title: "Panel Admin" }}
        />
        <Stack.Screen
          name="admin/users"
          options={{ title: "User Management" }}
        />
      </Stack>

      {/* Overlay Splash Screen CareFam: HANYA Cold Start Pertama Kali */}
      {isSplashMounted ? (
        <SplashScreenView
          isLoading={isLoading}
          onAnimationFinish={() => {
            isColdStartSplashFinished = true;
            setIsSplashMounted(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Warna dasar putih harmonis identik dengan Splash Screen
  },
});

/**
 * Root Provider
 * AuthProvider membungkus seluruh hierarki navigasi pada level terluar aplikasi.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
