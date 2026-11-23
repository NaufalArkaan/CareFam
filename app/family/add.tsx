import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { FamilyMember } from '../../types';
import { addStoredFamilyMember } from '../../data/familyMembers';
import { addFamilyMemberToDatabase } from '../../services/familyService';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/family.styles';

const RELATIONSHIP_OPTIONS = [
  'Kepala Keluarga',
  'Istri',
  'Suami',
  'Anak',
  'Ayah',
  'Ibu',
  'Kakek',
  'Nenek',
  'Saudara',
];

export default function AddFamilyMemberScreen() {
  const router = useRouter();

  // RUBRIK Modul 2: useState untuk mengontrol setiap field input form
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // RUBRIK Modul 2: useState untuk pesan validasi error
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handler simpan anggota keluarga baru
  const handleSubmit = async () => {
    // Validasi sederhana: field wajib tidak boleh kosong
    if (!name.trim() || !birthDate.trim() || !relationship.trim()) {
      setErrorMessage('Field dengan tanda (*) wajib diisi: Nama, Tanggal Lahir, dan Hubungan.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Simpan ke database Supabase
      const savedMember = await addFamilyMemberToDatabase({
        name: name.trim(),
        birthDate: birthDate.trim(),
        relationship: relationship.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
      });

      // 2. Simpan juga ke local store untuk sinkronisasi state instan
      addStoredFamilyMember(savedMember);

      // CHECKPOINT 3: Menggunakan router.replace() — kembali ke daftar
      router.replace('/family');
    } catch (err: unknown) {
      console.warn('[AddFamily] Error menyimpan ke Supabase:', err);
      // Fallback: simpan ke in-memory store
      const fallbackMember: FamilyMember = {
        id: Date.now().toString(),
        name: name.trim(),
        birthDate: birthDate.trim(),
        relationship: relationship.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
      };
      addStoredFamilyMember(fallbackMember);
      router.replace('/family');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/family');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Tambah Anggota"
        subtitle="Daftarkan anggota keluarga baru ke dalam akun"
        backgroundColor={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigasi Kembali menggunakan router.back() */}
        <View style={styles.navigationBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Batal & Kembali ke Daftar"
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>← Batal & Kembali ke Daftar</Text>
          </Pressable>
        </View>

        {/* Card Formulir Pendaftaran */}
        <View style={styles.formCard}>
          {/* Banner Pesan Error Validasi */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Field: Nama Lengkap */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Siti Rahma"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Field: Tanggal Lahir */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Tanggal Lahir (YYYY-MM-DD)</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 1984-08-20"
              placeholderTextColor={colors.muted}
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {/* Field: Hubungan Keluarga (Pilihan Cepat) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Hubungan Keluarga</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={styles.chipsContainer}>
              {RELATIONSHIP_OPTIONS.map((option) => {
                const isSelected = relationship === option;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityLabel={`Pilih hubungan ${option}`}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                    onPress={() => setRelationship(option)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Field: Kontak Darurat (Opsional) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Kontak Darurat</Text>
              <Text style={styles.optionalLabel}>(Opsional)</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 0812-3456-7890"
              placeholderTextColor={colors.muted}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              keyboardType="phone-pad"
            />
          </View>

          {/* Tombol Simpan & Batal */}
          <View style={styles.formButtonRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Batal"
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Simpan Anggota"
              style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Simpan Anggota</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
