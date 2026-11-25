import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Header } from '../../components/common/Header';
import { colors } from '../../constants/theme';
import { getFamilyMembers } from '../../services/familyService';
import {
  getUserMedicalRecords,
  parseMedicalNotes,
} from '../../services/medicalRecordService';
import { AdminMedicalRecord, RecordType } from '../../types/admin';
import { FamilyMember } from '../../types';
import { styles } from '../../styles/userMedicalRecords.styles';

const TYPE_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua Jenis' },
  { key: 'lab_result', label: 'Hasil Lab' },
  { key: 'prescription', label: 'Resep Obat' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'vaccine', label: 'Vaksin' },
  { key: 'checkup', label: 'Check-up' },
  { key: 'other', label: 'Lainnya' },
];

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

export default function UserMedicalRecordsScreen() {
  const router = useRouter();

  const [records, setRecords] = useState<AdminMedicalRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Memuat daftar anggota keluarga untuk filter
  useEffect(() => {
    getFamilyMembers()
      .then((mems) => {
        if (mems && mems.length > 0) {
          setFamilyMembers(mems);
        }
      })
      .catch((err) => {
        console.warn('[UserMedicalRecords] Gagal memuat anggota:', err);
      });
  }, []);

  // Memuat berkas rekam medis
  const loadRecords = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const data = await getUserMedicalRecords(
          selectedMemberId !== 'all' ? selectedMemberId : undefined
        );
        setRecords(data);
      } catch (err) {
        console.warn('[UserMedicalRecords] Gagal memuat rekam medis:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedMemberId]
  );

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Filter teks pencarian dan jenis dokumen
  const filteredRecords = records.filter((rec) => {
    const matchType = selectedType === 'all' || rec.record_type === selectedType;
    if (!matchType) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      rec.title.toLowerCase().includes(q) ||
      rec.patient_name.toLowerCase().includes(q) ||
      (rec.doctor_or_facility && rec.doctor_or_facility.toLowerCase().includes(q)) ||
      (rec.diagnosis_notes && rec.diagnosis_notes.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Rekam Medis"
        subtitle="Riwayat diagnosis dan dokumen kesehatan keluarga"
        backgroundColor={colors.primary}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadRecords(true)}
            colors={[colors.primary]}
          />
        }
      >
        {/* Navigasi Kembali ke Dashboard */}
        <View style={styles.navigationBar}>
          <Link href="/dashboard" style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali ke Dashboard</Text>
          </Link>
        </View>

        {/* Ringkasan & Tombol Tambah Rekam Medis */}
        <View style={styles.topActions}>
          <Text style={styles.countText}>
            {filteredRecords.length > 0
              ? `${filteredRecords.length} berkas medis tersimpan`
              : 'Belum ada berkas medis'}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah Rekam Medis"
            style={styles.addButton}
            onPress={() => router.push('/medical-records/add')}
          >
            <Text style={styles.addButtonText}>+ Tambah Berkas</Text>
          </Pressable>
        </View>

        {/* Kolom Pencarian */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari judul berkas, nama pasien, dokter..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={{ color: colors.muted, paddingHorizontal: 4 }}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Filter Anggota Keluarga */}
        {familyMembers.length > 0 ? (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                fontWeight: '600',
                marginBottom: 6,
              }}
            >
              Filter Anggota Keluarga:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <Pressable
                style={[
                  styles.chip,
                  selectedMemberId === 'all' && styles.chipSelected,
                ]}
                onPress={() => setSelectedMemberId('all')}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMemberId === 'all' && styles.chipTextSelected,
                  ]}
                >
                  Semua Anggota
                </Text>
              </Pressable>
              {familyMembers.map((fm) => (
                <Pressable
                  key={fm.id}
                  style={[
                    styles.chip,
                    selectedMemberId === fm.id && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedMemberId(fm.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedMemberId === fm.id && styles.chipTextSelected,
                    ]}
                  >
                    👤 {fm.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Filter Jenis Dokumen */}
        <View style={{ marginBottom: 14 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {TYPE_OPTIONS.map((item) => (
              <Pressable
                key={item.key}
                style={[
                  styles.chip,
                  selectedType === item.key && styles.chipSelected,
                ]}
                onPress={() => setSelectedType(item.key)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedType === item.key && styles.chipTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* List Berkas Rekam Medis */}
        {isLoading && !isRefreshing ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.muted }}>
              Memuat arsip rekam medis keluarga...
            </Text>
          </View>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((item) => {
            const badge = getBadgeStyle(item.record_type);
            const parsed = parseMedicalNotes(item.diagnosis_notes);

            return (
              <View key={item.id} style={styles.card}>
                {/* Header Kartu: Badge & Tanggal */}
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>📅 {formatDate(item.record_date)}</Text>
                </View>

                {/* Judul Berkas */}
                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* Pasien */}
                <View style={styles.patientBadge}>
                  <Text style={styles.patientBadgeText}>
                    👤 {item.patient_name} {item.relationship ? `(${item.relationship})` : ''}
                  </Text>
                </View>

                {/* Fasilitas / Dokter */}
                {item.doctor_or_facility ? (
                  <Text style={styles.facilityText}>
                    🏥 {item.doctor_or_facility}
                  </Text>
                ) : null}

                {/* Ringkasan Hasil Diagnosis / Keluhan */}
                {parsed.clinicalDiagnosis ? (
                  <View style={styles.diagnosisBox}>
                    <Text style={styles.diagnosisLabel}>Hasil Pemeriksaan / Diagnosis:</Text>
                    <Text style={styles.diagnosisText} numberOfLines={2}>
                      {parsed.clinicalDiagnosis}
                    </Text>
                  </View>
                ) : parsed.userComplaints ? (
                  <View
                    style={[
                      styles.diagnosisBox,
                      { backgroundColor: '#EFF6FF', borderLeftColor: colors.primary },
                    ]}
                  >
                    <Text style={[styles.diagnosisLabel, { color: colors.primary }]}>
                      Keluhan yang Dilaporkan:
                    </Text>
                    <Text style={[styles.diagnosisText, { color: '#1E3A8A' }]} numberOfLines={2}>
                      {parsed.userComplaints}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noDiagnosisBox}>
                    <Text style={styles.noDiagnosisText}>ℹ️ Belum ada hasil analisis</Text>
                  </View>
                )}

                {/* Footer Kartu: Lampiran & Tombol Rincian */}
                <View style={styles.cardFooter}>
                  <View style={styles.fileIndicator}>
                    <Text style={{ fontSize: 13 }}>
                      {item.attachment_url ? '📎' : '📄'}
                    </Text>
                    <Text style={styles.fileIndicatorText}>
                      {item.attachment_url
                        ? item.file_name || '1 Berkas Terlampir'
                        : 'Tanpa Berkas Digital'}
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat rincian ${item.title}`}
                    style={styles.detailButton}
                    onPress={() => router.push(`/medical-records/${item.id}`)}
                  >
                    <Text style={styles.detailButtonText}>Buka Rincian →</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Belum Ada Rekam Medis</Text>
            <Text style={styles.emptyDescription}>
              Arsip rekam medis, hasil lab, resep obat, atau sertifikat vaksinasi
              keluarga Anda akan tercatat di sini dengan aman.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tambah Berkas Medis Pertama"
              style={styles.addButton}
              onPress={() => router.push('/medical-records/add')}
            >
              <Text style={styles.addButtonText}>+ Tambah Berkas Medis Baru</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
