import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

/**
 * CHECKPOINT 3: Route Protection Guard Component
 * Mengonsumsi AuthContext dan useSegments() dari Expo Router untuk mengamankan navigasi.
 */
function RootNavigation() {
  const { session, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Tahan seluruh proses redirect selama pemulihan sesi awal (rehydration)
    if (isLoading) return;

    const currentSegments: readonly string[] = segments;
    const firstSegment = currentSegments[0];
    const secondSegment = currentSegments[1];

    // Identifikasi segment autentikasi publik (login)
    const isUserLogin = firstSegment === 'login';
    const isAdminLogin = firstSegment === 'admin' && secondSegment === 'login';
    const inAuthGroup = isUserLogin || isAdminLogin;

    // Evaluasi status autentikasi user
    const isAuthenticated = Boolean(session && user);

    // Tentukan route tujuan utama berdasarkan peran pengguna
    const isAdmin =
      user?.email === 'admin@carefam.test' ||
      user?.user_metadata?.role === 'admin';
    const homeRoute = isAdmin ? '/admin/dashboard' : '/dashboard';

    // 2. Jika belum login (Guest) dan mencoba membuka area privat
    if (!isAuthenticated && !inAuthGroup) {
      // Jika mencoba akses dashboard admin, arahkan ke login admin
      if (firstSegment === 'admin') {
        router.replace('/admin/login');
      } else {
        router.replace('/login');
      }
      return;
    }

    // 3. Jika sudah login tetapi berada di route autentikasi (login)
    if (isAuthenticated && inAuthGroup) {
      router.replace(homeRoute);
      return;
    }

    // 4. Jika sudah login dan membuka root aplikasi ('/' atau 'index')
    if (isAuthenticated && (firstSegment === undefined || firstSegment === 'index')) {
      router.replace(homeRoute);
    }
  }, [session, user, isLoading, segments, router]);

  // 1. Tampilkan loading/splash saat isLoading === true agar tidak terjadi flicker
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // CHECKPOINT 4: Pertahankan seluruh konfigurasi <Stack> dan <Stack.Screen> Modul 1-3
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Rute Utama & Autentikasi (Modul 1) */}
      <Stack.Screen name="index" options={{ title: 'CareFam' }} />
      <Stack.Screen name="login" options={{ title: 'Masuk' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />

      {/* RUBRIK Modul 2: Konfigurasi <Stack.Screen> untuk Fitur Family Management (Naufal) */}
      <Stack.Screen
        name="family/index"
        options={{
          title: 'Keluarga Saya',
        }}
      />
      <Stack.Screen
        name="family/add"
        options={{
          title: 'Tambah Anggota',
        }}
      />
      <Stack.Screen
        name="family/[id]"
        options={{
          title: 'Detail Anggota',
        }}
      />

      {/* Rute Admin (Modul 1) */}
      <Stack.Screen name="admin/login" options={{ title: 'Masuk Admin' }} />
      <Stack.Screen name="admin/dashboard" options={{ title: 'Panel Admin' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

/**
 * CHECKPOINT 2: Root Provider
 * AuthProvider membungkus seluruh hierarki navigasi pada level terluar aplikasi.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}


