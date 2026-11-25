import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { FamilyMember } from '../../types';
import {
  getStoredFamilyMembers,
  updateStoredFamilyMember,
} from '../../data/familyMembers';
import {
  getFamilyMemberDetail,
  updateFamilyMember,
} from '../../services/familyService';
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

export default function EditFamilyMemberScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const memberId = params.id ? String(params.id).trim() : '';

  // Form State
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [memberNotFound, setMemberNotFound] = useState<boolean>(false);

  // Available members fallback list for direct navigation without ID
  const [availableMembers, setAvailableMembers] = useState<FamilyMember[]>([]);

  // Load data anggota berdasarkan ID
  useEffect(() => {
    let isMounted = true;

    async function loadMemberData() {
      if (!memberId) {
        // Jika tidak ada ID di URL, muat daftar anggota agar user bisa memilih
        const localList = getStoredFamilyMembers();
        if (isMounted) {
          setAvailableMembers(localList);
          setIsLoading(false);
          setMemberNotFound(true);
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        // 1. Coba ambil dari Supabase
        const dbMember = await getFamilyMemberDetail(memberId);
        if (dbMember && isMounted) {
          setName(dbMember.name);
          setBirthDate(dbMember.birthDate || '');
          setRelationship(dbMember.relationship);
          setEmergencyContact(dbMember.emergencyContact || '');
          setMemberNotFound(false);
          return;
        }

        // 2. Fallback ke local store
        const localMember = getStoredFamilyMembers().find(
          (m) => m.id === memberId
        );
        if (localMember && isMounted) {
          setName(localMember.name);
          setBirthDate(localMember.birthDate || '');
          setRelationship(localMember.relationship);
          setEmergencyContact(localMember.emergencyContact || '');
          setMemberNotFound(false);
          return;
        }

        if (isMounted) {
          setMemberNotFound(true);
        }
      } catch (err: any) {
        console.warn('[EditFamily] Gagal memuat data anggota:', err);
        const fallback = getStoredFamilyMembers().find((m) => m.id === memberId);
        if (fallback && isMounted) {
          setName(fallback.name);
          setBirthDate(fallback.birthDate || '');
          setRelationship(fallback.relationship);
          setEmergencyContact(fallback.emergencyContact || '');
          setMemberNotFound(false);
        } else if (isMounted) {
          setMemberNotFound(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMemberData();

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  // Handler simpan perubahan
  const handleSubmit = async () => {
    if (!name.trim() || !relationship.trim()) {
      setErrorMessage(
        'Field dengan tanda (*) wajib diisi: Nama Lengkap dan Hubungan Keluarga.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Simpan perubahan ke Supabase
      const updated = await updateFamilyMember(memberId, {
        name: name.trim(),
        birthDate: birthDate.trim() || undefined,
        relationship: relationship.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
      });

      // 2. Sinkronkan dengan local store
      updateStoredFamilyMember(updated);

      if (Platform.OS === 'web') {
        window.alert('Data anggota keluarga berhasil diperbarui!');
      } else {
        Alert.alert('Berhasil', 'Data anggota keluarga berhasil diperbarui!');
      }

      router.replace('/family');
    } catch (err: any) {
      console.warn('[EditFamily] Error update Supabase, fallback ke local store:', err);

      // Fallback: update di memory store
      const fallbackUpdated: FamilyMember = {
        id: memberId,
        name: name.trim(),
        birthDate: birthDate.trim(),
        relationship: relationship.trim(),
        emergencyContact: emergencyContact.trim() || undefined,
      };
      updateStoredFamilyMember(fallbackUpdated);

      if (Platform.OS === 'web') {
        window.alert('Data anggota keluarga diperbarui secara lokal!');
      } else {
        Alert.alert('Tersimpan', 'Data anggota keluarga diperbarui secara lokal.');
      }

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
        title="Edit Anggota Keluarga"
        subtitle={name ? `Edit profil ${name}` : 'Perbarui data anggota keluarga'}
        backgroundColor={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigasi Kembali */}
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

        {isLoading ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 12, color: colors.muted }}>
              Memuat data anggota dari database...
            </Text>
          </View>
        ) : memberNotFound ? (
          /* Tampilan jika ID tidak diberikan atau data tidak ditemukan */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚠️</Text>
            <Text style={styles.emptyTitle}>Pilih Anggota yang Ingin Diedit</Text>
            <Text style={styles.emptyDescription}>
              {!memberId
                ? 'Tidak ada ID anggota yang dipilih pada URL. Silakan pilih anggota keluarga yang ingin Anda perbarui di bawah ini:'
                : `Anggota keluarga dengan ID "${memberId}" tidak ditemukan.`}
            </Text>

            {availableMembers.length > 0 ? (
              <View style={{ width: '100%', marginVertical: 16 }}>
                {availableMembers.map((m) => (
                  <Pressable
                    key={m.id}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surface,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => router.replace(`/family/edit?id=${m.id}`)}
                  >
                    <View>
                      <Text style={{ fontWeight: 'bold', color: colors.text }}>
                        {m.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted }}>
                        {m.relationship}
                      </Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                      Pilih Edit →
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali ke Daftar Keluarga"
              style={styles.addButton}
              onPress={() => router.replace('/family')}
            >
              <Text style={styles.addButtonText}>Kembali ke Daftar Keluarga</Text>
            </Pressable>
          </View>
        ) : (
          /* Form Edit Anggota */
          <View style={styles.formCard}>
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
                placeholder="Nama Lengkap"
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
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: 1991-02-28"
                placeholderTextColor={colors.muted}
                value={birthDate}
                onChangeText={setBirthDate}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            {/* Field: Hubungan Keluarga */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Hubungan Keluarga</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.textInput, { marginBottom: 8 }]}
                placeholder="Contoh: Istri / Anak"
                placeholderTextColor={colors.muted}
                value={relationship}
                onChangeText={setRelationship}
              />
              <View style={styles.chipsContainer}>
                {RELATIONSHIP_OPTIONS.map((option) => {
                  const isSelected = relationship === option;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityLabel={`Pilih hubungan ${option}`}
                      style={[styles.chip, isSelected && styles.chipSelected]}
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

            {/* Field: Kontak Darurat */}
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

            {/* Tombol Aksi: Batal & Simpan Perubahan */}
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
                accessibilityLabel="Simpan Perubahan"
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
