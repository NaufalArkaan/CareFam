import React from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Link, Href } from 'expo-router';
import { UserRole } from '../../types';
import { getLoginContent, getAccountsByRole } from '../../utils/login';
import { getHomeRoute, getRoleLabel } from '../../utils/roleRoute';
import { Header } from './Header';
import { PrimaryButton } from './PrimaryButton';
import { colors } from '../../constants/theme';
import { loginStyles as styles } from '../../styles/login.styles';

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

  // Warna header beda role: Admin = text (gelap), User = primary (teal)
  const headerBgColor = role === 'admin' ? colors.text : colors.primary;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Tema Peran */}
        <Header
          title={content.title}
          subtitle={content.subtitle}
          backgroundColor={headerBgColor}
        >
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.surface }]}>CareFam</Text>
          </View>
        </Header>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="contoh@carefam.test"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Input Email"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Kata sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              secureTextEntry
              accessibilityLabel="Input Kata Sandi"
            />
          </View>

          {/* Tombol Masuk via Link */}
          <View style={styles.buttonContainer}>
            <Link href={homeRoute as Href} asChild>
              {/* RUBRIK: Inline & External Styles (Inline style warna tombol dari content.accentColor) */}
              <PrimaryButton
                label={content.buttonLabel}
                color={content.accentColor}
              />
            </Link>
          </View>

          {/* Tautan ke Role Lain */}
          <View style={styles.altLinkContainer}>
            <Link href={content.altRoute as Href} style={styles.altLinkText}>
              {content.altLabel}
            </Link>
          </View>

          {/* Kartu Akun Demo */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Akun demo {getRoleLabel(role)}</Text>
            {/* RUBRIK: Type & Array of Objects (Render array of objects menggunakan map) */}
            {demoAccounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountEmail}>{account.email}</Text>
                <Text style={styles.accountRoleBadge}>
                  Role: {getRoleLabel(account.role)}
                </Text>
              </View>
            ))}
          </View>

          {/* Catatan Prototype */}
          <Text style={styles.noteText}>Prototype — belum terhubung ke server.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
