import { Stack } from 'expo-router';

export default function RootLayout() {
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

