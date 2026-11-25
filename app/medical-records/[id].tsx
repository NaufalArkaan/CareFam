import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { colors, spacing, radius } from '../../constants/theme';
import {
  getMedicalRecordDetail,
  getMedicalRecordFileUrl,
  parseMedicalNotes,
} from '../../services/medicalRecordService';
import { AdminMedicalRecord, RecordType } from '../../types/admin';
import { styles } from '../../styles/userMedicalRecords.styles';

const getBadgeStyle = (type: RecordType) => {
  switch (type) {
    case 'lab_result':
      return { bg: '#EDE9FE', text: '#7C3AED', label: 'Hasil Lab' };
    case 'prescription':
      return { bg: '#FEF3C7', text: '#D97706', label: 'Resep Obat' };
    case 'diagnosis':
      return { bg: '#CCFBF1', text: '#0D9488', label: 'Diagnosis' };
    case 'vaccine':
      return { bg: '#DBEAFE', text: '#2563EB', label: 'Vaksin' };
    case 'checkup':
      return { bg: '#E0E7FF', text: '#4F46E5', label: 'Check-up' };
    case 'other':
    default:
      return { bg: '#F1F5F9', text: '#475569', label: 'Lainnya' };
  }
};

export default function UserMedicalRecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [record, setRecord] = useState<AdminMedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFileOpening, setIsFileOpening] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      getMedicalRecordDetail(id)
        .then((data) => {
          if (isMounted) setRecord(data);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOpenFile = async (attachmentUrl: string | null) => {
    if (!attachmentUrl) return;
    setIsFileOpening(true);
    try {
      const url = await getMedicalRecordFileUrl(attachmentUrl);
      if (!url) throw new Error('Gagal membuat tautan akses berkas.');

      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) await Linking.openURL(url);
        else Alert.alert('Informasi', 'Perangkat tidak dapat membuka tautan ini.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal mengakses dokumen medis.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Gagal Mengakses Berkas', msg);
    } finally {
      setIsFileOpening(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/medical-records');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Rincian Rekam Medis"
          subtitle="Memuat informasi dokumen..."
          backgroundColor={colors.primary}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.muted }}>
            Mengambil data rekam medis...
          </Text>
        </View>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.container}>
        <Header
          title="Rincian Rekam Medis"
          subtitle="Dokumen tidak ditemukan"
          backgroundColor={colors.primary}
        />
        <View style={styles.scrollContent}>
          <View style={styles.navigationBar}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Kembali ke Daftar</Text>
            </Pressable>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>❓</Text>
            <Text style={styles.emptyTitle}>Berkas Tidak Ditemukan</Text>
            <Text style={styles.emptyDescription}>
              Rekam medis dengan ID tersebut tidak ditemukan pada akun Anda.
            </Text>
            <Pressable
              style={styles.addButton}
              onPress={() => router.replace('/medical-records')}
            >
              <Text style={styles.addButtonText}>Kembali ke Daftar Rekam Medis</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const badge = getBadgeStyle(record.record_type);
  const parsed = parseMedicalNotes(record.diagnosis_notes);

  return (
    <View style={styles.container}>
      <Header
        title="Rincian Rekam Medis"
        subtitle={record.title}
        backgroundColor={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigasi Kembali */}
        <View style={styles.navigationBar}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Kembali ke Daftar</Text>
          </Pressable>
        </View>

        {/* 1. Seksi Identitas Pasien */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>1. Identitas Pasien</Text>
          <View style={styles.detailInfoCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>Nama Pasien</Text>
              <Text style={styles.detailRowValue}>👤 {record.patient_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>Hubungan Keluarga</Text>
              <Text style={styles.detailRowValue}>{record.relationship || 'Anggota'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Seksi Informasi Pemeriksaan */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>2. Informasi Pemeriksaan</Text>
          <View style={styles.detailInfoCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>Judul Pemeriksaan</Text>
              <Text style={styles.detailRowValue}>{record.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>Kategori Dokumen</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>Tanggal Pemeriksaan</Text>
              <Text style={styles.detailRowValue}>📅 {formatDate(record.record_date)}</Text>
            </View>
            {record.doctor_or_facility ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailRowLabel}>Dokter / Faskes</Text>
                <Text style={styles.detailRowValue}>🏥 {record.doctor_or_facility}</Text>
              </View>
            ) : null}
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailRowLabel}>Waktu Input ke Sistem</Text>
              <Text style={styles.detailRowValue}>{formatDate(record.created_at)}</Text>
            </View>
          </View>
        </View>

        {/* 3. Seksi Informasi Kesehatan dari Pengguna (Keluhan) */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>
            3. Informasi yang Dilaporkan Pengguna
          </Text>
          <View style={styles.detailInfoCard}>
            {parsed.userComplaints ? (
              <View>
                <Text style={{ fontSize: 13, color: '#1E3A8A', lineHeight: 20 }}>
                  {parsed.userComplaints}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.muted,
                    marginTop: 8,
                    fontStyle: 'italic',
                  }}
                >
                  *Catatan gejala dan kondisi yang dilaporkan mandiri oleh pasien/keluarga.
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 13, color: colors.muted, fontStyle: 'italic' }}>
                Tidak ada keluhan khusus yang dicatatkan saat pengunggahan berkas.
              </Text>
            )}
          </View>
        </View>

        {/* 4. Seksi Hasil Pemeriksaan & Diagnosis Dokter */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>
            4. Hasil Pemeriksaan & Diagnosis Dokter
          </Text>
          <View
            style={[
              styles.detailInfoCard,
              { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
            ]}
          >
            {parsed.clinicalDiagnosis ? (
              <View>
                <Text style={{ fontSize: 13.5, color: '#166534', lineHeight: 21, fontWeight: '500' }}>
                  {parsed.clinicalDiagnosis}
                </Text>

                {/* Grid Nilai Laboratorium Terstruktur */}
                {parsed.labMetrics && parsed.labMetrics.length > 0 ? (
                  <View style={{ marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#DCFCE7' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#15803D', marginBottom: 6 }}>
                      NILAI PENGUKURAN LABORATORIUM:
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {parsed.labMetrics.map((met, idx) => (
                        <View
                          key={idx}
                          style={{
                            backgroundColor: met.isAbnormal ? '#FEF2F2' : '#FFFFFF',
                            borderColor: met.isAbnormal ? '#FCA5A5' : '#86EFAC',
                            borderWidth: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: 'bold',
                              color: met.isAbnormal ? '#B91C1C' : '#15803D',
                            }}
                          >
                            {met.label}: {met.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={{ paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, color: '#166534', fontWeight: 'bold' }}>
                  ℹ️ Belum ada hasil analisis
                </Text>
                <Text style={{ fontSize: 12, color: '#4ADE80', marginTop: 2 }}>
                  Dokumen ini belum memiliki catatan diagnosis atau masih menunggu hasil pemeriksaan laboratorium.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 5. Seksi Rekomendasi Medis / Tindak Lanjut */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>
            5. Rekomendasi & Tindak Lanjut Tenaga Medis
          </Text>
          <View style={styles.detailInfoCard}>
            {parsed.recommendations ? (
              <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>
                {parsed.recommendations}
              </Text>
            ) : (
              <Text style={{ fontSize: 12.5, color: colors.muted, fontStyle: 'italic' }}>
                Belum ada instruksi tindak lanjut atau rekomendasi khusus yang tercatat.
              </Text>
            )}
          </View>
        </View>

        {/* 6. Dokumen Asli */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionHeader}>6. Dokumen Asli</Text>
          <View style={styles.detailInfoCard}>
            {record.attachment_url ? (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                  <Text style={{ fontSize: 24 }}>📄</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>
                      {record.file_name || 'Berkas Rekam Medis'}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted }}>
                      Tersimpan secara aman di Supabase Storage
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Buka atau unduh dokumen"
                  style={[styles.addButton, { justifyContent: 'center' }]}
                  onPress={() => handleOpenFile(record.attachment_url)}
                  disabled={isFileOpening}
                >
                  {isFileOpening ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text style={styles.addButtonText}>📄 Buka / Unduh Berkas Medis</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <Text style={{ fontSize: 12.5, color: colors.muted }}>
                Tidak ada berkas digital yang dilampirkan pada rekam medis ini.
              </Text>
            )}
          </View>
        </View>

        {/* Disklaimer Medis */}
        <View
          style={{
            backgroundColor: '#EFF6FF',
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: '#BFDBFE',
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: '#1E40AF', lineHeight: 18 }}>
            🔒 <Text style={{ fontWeight: 'bold' }}>Perhatian Privasi Medis:</Text> Arsip ini dilindungi oleh Row Level Security (RLS). Hanya anggota keluarga yang berwenang dan dokter pemeriksa yang memiliki izin resmi yang dapat mengakses riwayat kesehatan ini.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
