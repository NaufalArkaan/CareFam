import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FamilyMember } from '../../types';
import { styles } from '../../styles/family.styles';

export interface FamilyMemberCardProps {
  member: FamilyMember;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onViewDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  isSelected,
  onSelect,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      {/* Header Kartu: Nama, Hubungan, dan Status Pilihan */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.memberName}>{member.name}</Text>
          <View style={styles.memberRelationBadge}>
            <Text style={styles.memberRelationText}>{member.relationship}</Text>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>Dipantau</Text>
          </View>
        ) : null}
      </View>

      {/* Detail Informasi Anggota */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailLabel}>Tanggal Lahir</Text>
          <Text style={styles.detailValue}>{member.birthDate}</Text>
        </View>

        {member.emergencyContact ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📞</Text>
            <Text style={styles.detailLabel}>Kontak Darurat</Text>
            <Text style={styles.detailValue}>{member.emergencyContact}</Text>
          </View>
        ) : null}
      </View>

      {/* Aksi Pemilihan Profil, Edit, Hapus, & Detail */}
      <View style={styles.cardFooter}>
        <View style={styles.cardActionGroup}>
          {onViewDetail ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Lihat detail ${member.name}`}
              style={styles.detailButton}
              onPress={() => onViewDetail(member.id)}
            >
              <Text style={styles.detailButtonText}>Detail Profil →</Text>
            </Pressable>
          ) : null}

          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit data ${member.name}`}
              style={styles.editButton}
              onPress={() => onEdit(member.id)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </Pressable>
          ) : null}

          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hapus ${member.name} dari daftar keluarga`}
              style={styles.deleteButton}
              onPress={() => onDelete(member.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Hapus</Text>
            </Pressable>
          ) : null}
        </View>

        {isSelected ? (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeIndicatorText}>✓ Profil Aktif Dipantau</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Pilih ${member.name} untuk dipantau`}
            style={styles.selectButton}
            onPress={() => onSelect(member.id)}
          >
            <Text style={styles.selectButtonText}>Pilih untuk Dipantau</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
