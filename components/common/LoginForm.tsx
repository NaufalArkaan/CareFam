// RUBRIK: Modul 4 — Secure Token Storage & Supabase Auth Flow (Naufal)

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../../constants/theme";
import { loginStyles as styles } from "../../styles/login.styles";
import { UserRole } from "../../types";
import { getAccountsByRole, getLoginContent } from "../../utils/login";
import { getHomeRoute, getRoleLabel } from "../../utils/roleRoute";
import { Header } from "./Header";
import { PrimaryButton } from "./PrimaryButton";
import { signInUser, signUpUser } from "../../services/authService";

// RUBRIK: Type & Array of Objects
export interface LoginFormProps {
  role: UserRole;
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const router = useRouter();

  // RUBRIK: Custom Function & Loop (Mendapatkan konten login via for...of loop)
  const content = getLoginContent(role);

  // RUBRIK: Custom Function & Loop (Mendapatkan akun demo via for...of loop)
  const demoAccounts = getAccountsByRole(role);

  // RUBRIK: Custom Function & Loop (Mendapatkan rute halaman utama sesuai peran)
  const homeRoute = getHomeRoute(role);

  const isAdmin = role === "admin";
  const headerBgColor = "transparent";

  // CHECKPOINT 3, 4, 6: State Form Autentikasi
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsign, setCallsign] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * CHECKPOINT 3, 4, 6: Handler Submit Autentikasi (Sign In / Sign Up)
   * Dilengkapi pencegahan multiple submission, validasi, dan penanganan error.
   */
  const handleSubmit = async () => {
    // Pencegahan multiple submission
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();

    // Validasi input dasar
    if (!cleanEmail) {
      setErrorMessage("Silakan masukkan alamat email.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setErrorMessage("Format email tidak valid (contoh: user@carefam.test).");
      return;
    }

    if (!password) {
      setErrorMessage("Silakan masukkan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (isRegistering && !callsign.trim()) {
      setErrorMessage("Silakan masukkan nama panggilan (callsign) Anda.");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // CHECKPOINT 3: Sign Up dengan options.data.callsign
        const data = await signUpUser({
          email: cleanEmail,
          password,
          callsign,
        });

        // Tangani kemungkinan konfirmasi email
        if (data.session) {
          // Berhasil mendaftar dan langsung mendapatkan sesi
          router.replace(homeRoute as Href);
        } else {
          // Memerlukan konfirmasi email
          setSuccessMessage(
            "Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi aktivasi akun, kemudian masuk."
          );
          setIsRegistering(false);
          setPassword("");
        }
      } else {
        // CHECKPOINT 4: Sign In via Supabase
        await signInUser({
          email: cleanEmail,
          password,
        });

        // Sesi berhasil dibuat dan otomatis tersimpan di SecureStore
        router.replace(homeRoute as Href);
      }
    } catch (err: unknown) {
      let message = "Terjadi kesalahan saat memproses permintaan.";
      if (err instanceof Error) {
        const errLower = err.message.toLowerCase();
        if (errLower.includes("invalid login credentials")) {
          message = "Email atau kata sandi salah. Silakan periksa kembali.";
        } else if (errLower.includes("user already registered")) {
          message = "Email sudah terdaftar. Silakan pilih tab Masuk.";
        } else if (errLower.includes("network request failed")) {
          message = "Gagal terhubung ke server Supabase. Periksa koneksi internet Anda.";
        } else {
          message = err.message;
        }
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#EFF6FF", "#F8FAFC", "#FFFFFF"]}
        locations={[0, 0.35, 1]}
        style={styles.gradientContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Tema Peran */}
          <Header
            title=""
            subtitle=""
            backgroundColor={headerBgColor}
          >
            {isAdmin ? (
              <View style={styles.adminHeroContainer}>
                {/* Branding Badge Subtle */}
                <View style={styles.adminBadgeRow}>
                  <View style={styles.adminIconBadge}>
                    <Ionicons name="shield-checkmark" size={13} color="#2563EB" />
                  </View>
                  <Text style={styles.adminBrandText}>CareFam Admin</Text>
                </View>

                {/* Heading & Subtitle Admin */}
                <Text style={styles.adminTitle}>{content.title}</Text>
                <Text style={styles.adminSubtitle}>{content.subtitle}</Text>

                {/* Ilustrasi Dokter Compact */}
                <View style={styles.adminDoctorContainer}>
                  <View style={styles.adminHeartShape} pointerEvents="none">
                    <Ionicons name="heart" size={135} color="#BFDBFE" />
                  </View>
                  <Image
                    source={require("../../assets/images/docter.png")}
                    style={styles.adminDoctorImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.heroRow}>
                {/* SISI KIRI: Heart Dekoratif + Dokter */}
                <View style={styles.heroLeft}>
                  <View style={styles.heartDecoration} pointerEvents="none">
                    <Ionicons name="heart" size={160} color="#BFDBFE" />
                  </View>
                  <Image
                    source={require("../../assets/images/docter.png")}
                    style={styles.doctorImage}
                    resizeMode="contain"
                  />
                </View>

                {/* SISI KANAN: Logo CareFam, Selamat Datang, Subtitle */}
                <View style={styles.heroRight}>
                  <View style={styles.brandRow}>
                    <View style={styles.brandIconWrapper}>
                      <Ionicons name="heart" size={18} color="#2563EB" />
                    </View>
                    <Text style={styles.brandTitle}>CareFam</Text>
                  </View>

                  <Text
                    style={styles.welcomeHeading}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Selamat datang <Text style={styles.waveHand}>👋</Text>
                  </Text>

                  <Text style={styles.welcomeSubtitle}>
                    {isRegistering
                      ? "Daftarkan diri Anda untuk memantau kesehatan keluarga."
                      : "Kelola kesehatan keluarga dengan lebih mudah."}
                  </Text>
                </View>
              </View>
            )}
          </Header>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Toggle Mode: Masuk vs Daftar Akun (khusus User) */}
            {!isAdmin && (
              <View style={styles.modeToggleContainer}>
                <Pressable
                  accessibilityRole="tab"
                  accessibilityLabel="Tab Masuk"
                  disabled={isLoading}
                  style={[
                    styles.modeToggleTab,
                    !isRegistering && styles.modeToggleActiveTab,
                  ]}
                  onPress={() => {
                    setIsRegistering(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      !isRegistering && styles.modeToggleActiveText,
                    ]}
                  >
                    Masuk
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="tab"
                  accessibilityLabel="Tab Daftar Akun"
                  disabled={isLoading}
                  style={[
                    styles.modeToggleTab,
                    isRegistering && styles.modeToggleActiveTab,
                  ]}
                  onPress={() => {
                    setIsRegistering(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      isRegistering && styles.modeToggleActiveText,
                    ]}
                  >
                    Daftar Akun
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Error Message Box */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color="#EF4444"
                  style={styles.alertIcon}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Success Message Box */}
            {successMessage && (
              <View style={styles.successBox}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#10B981"
                  style={styles.alertIcon}
                />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            {/* Field Callsign (Hanya saat Registrasi User) */}
            {isRegistering && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Nama Panggilan (Callsign) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Contoh: Ayah Budi / Ibu Siti"
                    placeholderTextColor="#94A3B8"
                    value={callsign}
                    onChangeText={setCallsign}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}

            {/* Field Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Alamat Email <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder={
                    isAdmin ? "admin@carefam.test" : "nama@email.com"
                  }
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Field Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Kata Sandi <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </Pressable>
              </View>
            </View>

            {/* Opsi Tambahan: Ingat Saya & Lupa Sandi */}
            {!isRegistering && (
              <View style={styles.optionsRow}>
                <View style={styles.rememberMeContainer}>
                  <Ionicons name="checkbox" size={18} color="#2563EB" />
                  <Text style={styles.rememberMeText}>Ingat saya</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Lupa kata sandi"
                  onPress={() => {
                    alert("Fitur reset kata sandi dapat dilakukan melalui email yang terdaftar.");
                  }}
                >
                  <Text style={styles.forgotText}>Lupa sandi?</Text>
                </Pressable>
              </View>
            )}

            {/* CHECKPOINT 6: Tombol Submit dengan Loading & Proteksi Multiple Submission */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                label={
                  isLoading
                    ? "Memproses..."
                    : isRegistering
                    ? "Daftar Sekarang   →"
                    : `${content.buttonLabel}   →`
                }
                color={content.accentColor}
                disabled={isLoading}
                onPress={handleSubmit}
                style={[
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
              />
              {isLoading ? (
                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <ActivityIndicator size="small" color={content.accentColor} />
                </View>
              ) : null}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.divider} />
            </View>

            {/* Tautan ke Role Lain */}
            <View style={styles.altLinkContainer}>
              <Link href={content.altRoute as Href} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={content.altLabel}
                  disabled={isLoading}
                  style={styles.altButton}
                >
                  <Ionicons
                    name={
                      isAdmin
                        ? "arrow-back-outline"
                        : "shield-checkmark-outline"
                    }
                    size={17}
                    color="#2563EB"
                    style={styles.altButtonIcon}
                  />
                  <Text style={styles.altLinkText}>{content.altLabel}</Text>
                </Pressable>
              </Link>
            </View>

            {/* Kartu Akun Demo (Dapat diklik untuk auto-fill saat testing) */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>
                {isAdmin ? "Akun Demo Admin" : "Akun Demo Pengguna"}
              </Text>

              {/* RUBRIK: Type & Array of Objects */}
              {demoAccounts.map((account) => (
                <Pressable
                  key={account.id}
                  disabled={isLoading}
                  style={styles.accountCard}
                  onPress={() => {
                    setEmail(account.email);
                    setPassword("carefam123");
                    if (isRegistering) {
                      setCallsign(account.name);
                    }
                  }}
                >
                  <View style={styles.accountIcon}>
                    <Ionicons
                      name={isAdmin ? "shield-checkmark" : "people"}
                      size={20}
                      color="#2563EB"
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountEmail}>{account.email}</Text>
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.accountRoleBadge}>
                        {getRoleLabel(account.role).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </Pressable>
              ))}
            </View>

            {/* Catatan Status Auth */}
            <Text style={styles.noteText}>
              Terhubung dengan Supabase Auth & SecureStore.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
