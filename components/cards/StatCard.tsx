import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AdminStat } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { formatStatValue } from '../../utils/adminDashboard';

interface StatCardProps {
  stat: AdminStat;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    // RUBRIK: Inline & External Styles
    // Alasan inline style: Warna border atas kartu dinamis mengikuti warna aksen khusus tiap statistik dari data stat.color
    <View style={[styles.card, { borderTopColor: stat.color }]}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>{stat.icon}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {formatStatValue(stat.value)}
          </Text>
          <Text style={styles.label} numberOfLines={2}>
            {stat.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', // Mengisi 48% lebar container untuk grid 2 kolom yang presisi tanpa gap crash
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 4, // Memberikan aksen yang lebih solid dan modern dibanding block
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.md,
  },
  content: {
    padding: spacing.md,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 120, // Menjaga konsistensi tinggi kartu meskipun teks bervariasi panjangnya
  },
  iconWrapper: {
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5, // Tampilan font angka lebih rapat dan modern
  },
  label: {
    fontSize: typography.caption,
    color: colors.muted,
    lineHeight: 18,
    fontWeight: '500',
  },
});
