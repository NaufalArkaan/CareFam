import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, Link } from "expo-router";
import React from "react";
import {
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

// RUBRIK: Type & Array of Objects
export interface LoginFormProps {
  role: UserRole;
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  // RUBRIK: Custom Function & Loop (Mendapatkan konten login via for...of loop)
  const content = getLoginContent(role);

  // RUBRIK: Custom Function & Loop (Mendapatkan akun demo via for...of loop)
  const demoAccounts = getAccountsByRole(role);

  // RUBRIK: Custom Function & Loop (Mendapatkan rute halaman utama sesuai peran)
  const homeRoute = getHomeRoute(role);

  // Warna header beda role: Admin = text (gelap), User = transparan (di atas background gradasi lembut)
  const headerBgColor = role === "admin" ? colors.text : "transparent";

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#E6F1FC", "#EFF6FD", "#FFFFFF"]}
        locations={[0, 0.35, 1]}
        style={styles.gradientContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Tema Peran */}
          <Header
            title={content.title}
            subtitle={content.subtitle}
            backgroundColor={headerBgColor}
          >
            {/* HERO SECTION: Dokter + Heart di KIRI | CareFam + Teks di KANAN */}
            <View style={styles.heroRow}>
              {/* SISI KIRI: Heart Dekoratif + Dokter */}
              <View style={styles.heroLeft}>
                {/* Heart Dekorasi di Belakang Dokter */}
                <View style={styles.heartDecoration} pointerEvents="none">
                  <Ionicons name="heart" size={170} color="#BFDBFE" />
                </View>

                {/* Gambar Dokter */}
                <Image
                  source={require("../../assets/images/docter.png")}
                  style={styles.doctorImage}
                  resizeMode="contain"
                />
              </View>

              {/* SISI KANAN: Logo CareFam, Selamat Datang, Subtitle */}
              <View style={styles.heroRight}>
                {/* Logo & Nama CareFam */}
                <View style={styles.brandRow}>
                  <View style={styles.brandIconWrapper}>
                    <Ionicons name="heart" size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.brandTitle}>CareFam</Text>
                </View>

                {/* Heading Selamat Datang */}
                <Text
                  style={styles.welcomeHeading}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Selamat datang <Text style={styles.waveHand}>👋</Text>
                </Text>

                {/* Subtitle */}
                <Text style={styles.welcomeSubtitle}>
                  Kelola kesehatan keluarga dengan lebih mudah.
                </Text>
              </View>
            </View>
          </Header>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color="#94A3B8"
                  style={styles.inputLeadingIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="contoh@carefam.test"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Input Email"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kata sandi</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color="#94A3B8"
                  style={styles.inputLeadingIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  accessibilityLabel="Input Kata Sandi"
                />
                <Ionicons
                  name="eye-off-outline"
                  size={19}
                  color="#94A3B8"
                  style={styles.inputTrailingIcon}
                />
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberContainer}>
                <Ionicons name="checkbox" size={18} color="#2563EB" />
                <Text style={styles.rememberText}>Ingat saya</Text>
              </View>
              <Text style={styles.forgotText}>Lupa kata sandi?</Text>
            </View>

            {/* Tombol Masuk via Link */}
            <View style={styles.buttonContainer}>
              <Link href={homeRoute as Href} asChild>
                {/* RUBRIK: Inline & External Styles (Inline style warna tombol dari content.accentColor) */}
                <PrimaryButton
                  label={`${content.buttonLabel}   →`}
                  color={content.accentColor}
                  style={styles.primaryButton}
                />
              </Link>
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
                  style={styles.altButton}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={17}
                    color="#2563EB"
                    style={styles.altButtonIcon}
                  />
                  <Text style={styles.altLinkText}>{content.altLabel}</Text>
                </Pressable>
              </Link>
            </View>

            {/* Kartu Akun Demo */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Akun Demo Pengguna</Text>

              {/* RUBRIK: Type & Array of Objects (Render array of objects menggunakan map) */}
              {demoAccounts.map((account) => (
                <View key={account.id} style={styles.accountCard}>
                  <View style={styles.accountIcon}>
                    <Ionicons name="people" size={20} color="#2563EB" />
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
                </View>
              ))}
            </View>

            {/* Catatan Prototype */}
            <Text style={styles.noteText}>
              Prototype — belum terhubung ke server.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
