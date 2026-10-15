import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Header } from '../../components/common/Header';
import { FamilyMember } from '../../types';
import { addStoredFamilyMember } from '../../data/familyMembers';
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

  // RUBRIK Modul 2: useState untuk pesan validasi error
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handler simpan anggota keluarga baru
  const handleSubmit = () => {
    // Validasi sederhana: field wajib tidak boleh kosong
    if (!name.trim() || !birthDate.trim() || !relationship.trim()) {
      setErrorMessage('Field dengan tanda (*) wajib diisi: Nama, Tanggal Lahir, dan Hubungan.');
      return;
    }

    // Bersihkan pesan error jika valid
    setErrorMessage('');

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: name.trim(),
      birthDate: birthDate.trim(),
      relationship: relationship.trim(),
      emergencyContact: emergencyContact.trim() || undefined,
    };

    // Simpan ke in-memory store agar tetap ada selama sesi aplikasi
    addStoredFamilyMember(newMember);

    // Kembali ke halaman daftar keluarga
    router.replace('/family');
  };

  const handleCancel = () => {
    router.back();
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
        {/* Navigasi Kembali */}
        <View style={styles.navigationBar}>
          <Link href="/family" style={styles.backButton}>
            <Text style={styles.backButtonText}>← Batal & Kembali ke Daftar</Text>
          </Link>
        </View>

        {/* Tampilan Pesan Error Validasi */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        {/* Kartu Form Input */}
        <View style={styles.formCard}>
          {/* Input 1: Nama Lengkap (Wajib) */}
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
              onChangeText={(text) => {
                setName(text);
                if (errorMessage) setErrorMessage('');
              }}
              accessibilityLabel="Input Nama Lengkap"
            />
          </View>

          {/* Input 2: Tanggal Lahir (Wajib) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Tanggal Lahir</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD (Contoh: 1995-04-12)"
              placeholderTextColor={colors.muted}
              value={birthDate}
              onChangeText={(text) => {
                setBirthDate(text);
                if (errorMessage) setErrorMessage('');
              }}
              accessibilityLabel="Input Tanggal Lahir"
            />
            <Text style={styles.inputHint}>Format: YYYY-MM-DD atau tanggal lahir anggota</Text>
          </View>

          {/* Input 3: Hubungan Keluarga (Wajib) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Hubungan Keluarga</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Pilih dari opsi di bawah atau ketik sendiri"
              placeholderTextColor={colors.muted}
              value={relationship}
              onChangeText={(text) => {
                setRelationship(text);
                if (errorMessage) setErrorMessage('');
              }}
              accessibilityLabel="Input Hubungan Keluarga"
            />

            {/* Pilihan Cepat Hubungan Keluarga */}
            <View style={styles.chipsContainer}>
              {RELATIONSHIP_OPTIONS.map((option) => {
                const isSelected = relationship === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => {
                      setRelationship(option);
                      if (errorMessage) setErrorMessage('');
                    }}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Input 4: Kontak Darurat (Opsional) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Kontak Darurat</Text>
              <Text style={styles.optionalLabel}>(Opsional)</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 0812-3456-7890"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              accessibilityLabel="Input Kontak Darurat Opsional"
            />
            <Text style={styles.inputHint}>Nomor telepon darurat jika berbeda dari akun utama</Text>
          </View>

          {/* Tombol Aksi Form */}
          <View style={styles.formButtonRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Batal"
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Simpan Anggota Keluarga"
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Simpan Anggota</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
