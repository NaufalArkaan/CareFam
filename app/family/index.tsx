import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Header } from '../../components/common/Header';
import { FamilyMemberCard } from '../../components/cards/FamilyMemberCard';
import { FamilyMember } from '../../types';
import {
  getStoredFamilyMembers,
  INITIAL_FAMILY_MEMBERS,
  subscribeFamilyMembers,
} from '../../data/familyMembers';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/family.styles';

export default function FamilyManagementScreen() {
  // RUBRIK Modul 2: useRouter untuk navigasi imperatif (Robi)
  const router = useRouter();

  // RUBRIK Modul 2: useState untuk mengelola daftar anggota keluarga
  const [members, setMembers] = useState<FamilyMember[]>(() => getStoredFamilyMembers());

  // RUBRIK Modul 2: useState untuk mengelola ID anggota yang sedang dipantau
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    const initialList = getStoredFamilyMembers();
    return initialList.length > 0 ? initialList[0].id : '';
  });

  // RUBRIK Modul 2: useEffect 1 — Berlangganan ke perubahan data store agar anggota baru yang ditambahkan
  // di form tetap terlihat seketika saat kembali ke daftar ini
  useEffect(() => {
    const unsubscribe = subscribeFamilyMembers(() => {
      setMembers(getStoredFamilyMembers());
    });

    // Cleanup listener saat komponen unmount untuk menghindari kebocoran memori
    return () => {
      unsubscribe();
    };
  }, []);

  // RUBRIK Modul 2: useEffect 2 — Menjaga konsistensi profil yang dipilih saat daftar anggota berubah
  useEffect(() => {
    if (members.length === 0) {
      if (selectedMemberId !== '') {
        setSelectedMemberId('');
      }
    } else {
      const isCurrentSelectedValid = members.some((member) => member.id === selectedMemberId);
      if (!isCurrentSelectedValid) {
        // Otomatis memilih anggota pertama jika profil terpilih sebelumnya tidak ditemukan
        setSelectedMemberId(members[0].id);
      }
    }
  }, [members, selectedMemberId]);

  // Handler memilih profil anggota untuk dipantau
  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
  };

  // CHECKPOINT 1: Handler navigasi imperatif menggunakan router.push()
  const handleAddMember = () => {
    router.push('/family/add');
  };

  const handleViewDetail = (id: string) => {
    router.push(`/family/${id}`);
  };

  // Handler simulasi kosongkan / kembalikan data untuk mempermudah demo pengujian
  const handleToggleSimulation = () => {
    if (members.length > 0) {
      setMembers([]);
      setSelectedMemberId('');
    } else {
      setMembers([...INITIAL_FAMILY_MEMBERS]);
      setSelectedMemberId(INITIAL_FAMILY_MEMBERS[0]?.id || '');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Halaman Family Management */}
      <Header
        title="Keluarga Saya"
        subtitle="Kelola profil dan pemantauan kesehatan keluarga"
        backgroundColor={colors.primary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigasi Kembali ke Dashboard */}
        <View style={styles.navigationBar}>
          <Link href="/dashboard" style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali ke Dashboard</Text>
          </Link>
        </View>

        {/* Baris Ringkasan & Tombol Aksi */}
        <View style={styles.topActions}>
          <Text style={styles.memberCountText}>
            {members.length > 0
              ? `${members.length} anggota keluarga terdaftar`
              : 'Belum ada anggota terdaftar'}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tambah Anggota Keluarga"
            style={styles.addButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addButtonText}>+ Tambah Anggota</Text>
          </Pressable>
        </View>

        {/* Kondisional Tampilan: Daftar Anggota ATAU Empty State */}
        {members.length > 0 ? (
          members.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              isSelected={selectedMemberId === member.id}
              onSelect={handleSelectMember}
              onViewDetail={handleViewDetail}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>Daftar Keluarga Kosong</Text>
            <Text style={styles.emptyDescription}>
              Belum ada anggota keluarga yang terdaftar. Tambahkan anggota keluarga pertama Anda
              untuk mulai memantau kesehatannya.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tambah Anggota Baru"
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Text style={styles.addButtonText}>+ Tambah Anggota Baru</Text>
            </Pressable>
          </View>
        )}

        {/* Tombol Bantuan Demo: Kosongkan / Reset Data */}
        <View style={styles.demoToggleRow}>
          <Pressable onPress={handleToggleSimulation}>
            <Text style={styles.demoToggleText}>
              {members.length > 0
                ? 'Simulasi Pengujian: Kosongkan Daftar'
                : 'Simulasi Pengujian: Pulihkan Data Awal'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
