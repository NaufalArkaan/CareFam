import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { colors } from '../../constants/theme';
import { getFamilyMembers } from '../../services/familyService';
import {
  createMedicalRecord,
  pickMedicalDocument,
} from '../../services/medicalRecordService';
import { RecordType } from '../../types/admin';
import { FamilyMember } from '../../types';
import { styles } from '../../styles/userMedicalRecords.styles';

const RECORD_TYPES: Array<{ key: RecordType; label: string; icon: string }> = [
  { key: 'lab_result', label: 'Hasil Lab', icon: '🧪' },
  { key: 'prescription', label: 'Resep Obat', icon: '💊' },
  { key: 'diagnosis', label: 'Diagnosis', icon: '🩺' },
  { key: 'vaccine', label: 'Vaksin', icon: '💉' },
  { key: 'checkup', label: 'Check-up', icon: '📋' },
  { key: 'other', label: 'Lainnya', icon: '📁' },
];

export default function AddMedicalRecordScreen() {
  const router = useRouter();

  // State Daftar Anggota Keluarga
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState<RecordType>('lab_result');
  const [recordDate, setRecordDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [doctorOrFacility, setDoctorOrFacility] = useState('');
  const [userComplaints, setUserComplaints] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Selected File State
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    file?: File | Blob;
    uri: string;
  } | null>(null);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Muat anggota keluarga
  useEffect(() => {
    getFamilyMembers().then((mems) => {
      if (mems && mems.length > 0) {
        setFamilyMembers(mems);
        setSelectedMemberId(mems[0].id);
      }
    });
  }, []);

  // Handler Pilih Berkas
  const handlePickFile = async () => {
    try {
      const picked = await pickMedicalDocument();
      if (picked) {
        setSelectedFile(picked);
      }
    } catch (err: any) {
      console.warn('[AddMedicalRecord] Gagal memilih berkas:', err);
    }
  };

  // Handler Simpan
  const handleSubmit = async () => {
    if (!selectedMemberId) {
      setErrorMessage('Pilih anggota keluarga yang bersangkutan.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Judul pemeriksaan atau tindakan wajib diisi.');
      return;
    }
    if (!recordDate.trim()) {
      setErrorMessage('Tanggal pemeriksaan wajib diisi.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const selectedMember = familyMembers.find((m) => m.id === selectedMemberId);

      const created = await createMedicalRecord({
        family_member_id: selectedMemberId,
        title: title.trim(),
        record_type: recordType,
        record_date: recordDate.trim(),
        doctor_or_facility: doctorOrFacility.trim() || null,
        user_complaints: userComplaints.trim() || null,
        diagnosis_notes: diagnosisNotes.trim() || null,
        recommendations: recommendations.trim() || null,
        file: selectedFile || undefined,
      });

      if (selectedMember) {
        created.patient_name = selectedMember.name;
        created.relationship = selectedMember.relationship;
      }

      if (Platform.OS === 'web') {
        window.alert('Rekam medis berhasil disimpan dan terhubung ke sistem CareFam!');
      } else {
        Alert.alert('Berhasil', 'Rekam medis berhasil disimpan dan terhubung ke sistem CareFam!');
      }

      router.replace('/medical-records');
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat menyimpan rekam medis.';
      setErrorMessage(msg);
      if (Platform.OS === 'web') {
        window.alert(`Gagal: ${msg}`);
      } else {
        Alert.alert('Gagal Menyimpan', msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/medical-records');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Tambah Rekam Medis"
        subtitle="Simpan arsip pemeriksaan atau hasil tes kesehatan"
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

        <View style={styles.formCard}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 1. Pilih Pasien / Anggota Keluarga */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Pasien / Anggota Keluarga</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <Text style={styles.inputHint}>
              Pilih anggota keluarga yang menjalani pemeriksaan
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {familyMembers.map((m) => {
                const isSelected = selectedMemberId === m.id;
                return (
                  <Pressable
                    key={m.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setSelectedMemberId(m.id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      👤 {m.name} ({m.relationship})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 2. Judul Pemeriksaan */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Judul Pemeriksaan / Tindakan</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Tes Darah Lengkap & Kolesterol"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 3. Jenis Dokumen */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Jenis Dokumen Medis</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {RECORD_TYPES.map((t) => {
                const isSelected = recordType === t.key;
                return (
                  <Pressable
                    key={t.key}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setRecordType(t.key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {t.icon} {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 4. Tanggal Pemeriksaan */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Tanggal Pemeriksaan (YYYY-MM-DD)</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 2026-11-25"
              placeholderTextColor={colors.muted}
              value={recordDate}
              onChangeText={setRecordDate}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          {/* 5. Fasilitas Kesehatan / Nama Dokter */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Fasilitas Kesehatan / Dokter</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: RS Medika / dr. Hendra Sp.A"
              placeholderTextColor={colors.muted}
              value={doctorOrFacility}
              onChangeText={setDoctorOrFacility}
            />
          </View>

          {/* 6. Keluhan atau Informasi yang Dilaporkan Pengguna */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Keluhan Pasien (Dilaporkan User)</Text>
            </View>
            <Text style={styles.inputHint}>
              Gejala awal, keluhan yang dirasakan, atau alasan pemeriksaan
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Contoh: Pusing sejak 3 hari lalu, badan lekas lelah setelah beraktivitas..."
              placeholderTextColor={colors.muted}
              value={userComplaints}
              onChangeText={setUserComplaints}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 7. Hasil Pemeriksaan & Diagnosis Dokter */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Hasil Pemeriksaan & Diagnosis Dokter</Text>
            </View>
            <Text style={styles.inputHint}>
              Catatan diagnosa resmi dokter atau nilai hasil tes laboratorium
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Contoh: Kolesterol Total: 210 mg/dL, Trigliserida: 130 mg/dL. Diagnosis: Hiperkolesterolemia ringan..."
              placeholderTextColor={colors.muted}
              value={diagnosisNotes}
              onChangeText={setDiagnosisNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 8. Rekomendasi Medis / Tindak Lanjut */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Rekomendasi & Tindak Lanjut Medis</Text>
            </View>
            <Text style={styles.inputHint}>
              Anjuran dokter, resep obat, atau jadwal kontrol berikutnya
            </Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Contoh: Batasi konsumsi lemak jenuh, olahraga aerobik 30 menit sehari, kontrol ulang 3 bulan..."
              placeholderTextColor={colors.muted}
              value={recommendations}
              onChangeText={setRecommendations}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 9. Unggah Berkas Medis */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Lampiran Dokumen / Foto Medis</Text>
            </View>
            <Text style={styles.inputHint}>
              Format didukung: PDF, Foto Hasil Lab (JPG/PNG), Scan Surat Kontrol
            </Text>

            <Pressable style={styles.filePickerBox} onPress={handlePickFile}>
              <Text style={{ fontSize: 24 }}>📎</Text>
              <Text style={styles.filePickerText}>
                {selectedFile ? 'Ganti Berkas Terpilih' : 'Pilih Berkas dari Perangkat'}
              </Text>
              <Text style={styles.filePickerHint}>Maksimal 10 MB per dokumen</Text>
            </Pressable>

            {selectedFile ? (
              <View style={styles.selectedFileCard}>
                <Text style={{ fontSize: 18 }}>📄</Text>
                <Text style={styles.selectedFileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Pressable onPress={() => setSelectedFile(null)}>
                  <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>✕</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          {/* Tombol Aksi Form */}
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
              accessibilityLabel="Simpan Rekam Medis"
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.submitButtonText}>Simpan Berkas</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
