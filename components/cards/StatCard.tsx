import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminStat } from '../../types';
import { formatStatValue } from '../../utils/adminDashboard';

interface StatCardProps {
  stat: AdminStat;
}

// Map icon string atau fallback icon profesional
const getStatIconName = (stat: AdminStat): keyof typeof Ionicons.glyphMap => {
  switch (stat.id) {
    case 1:
      return 'people';
    case 2:
      return 'heart';
    case 3:
      return 'business';
    case 4:
      return 'document-text';
    default:
      return 'stats-chart';
  }
};

export function StatCard({ stat }: StatCardProps) {
  const iconName = getStatIconName(stat);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          {/* Wadah ikon beraksen tint pastel lembut */}
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: `${stat.color}12`, borderColor: `${stat.color}25` },
            ]}
          >
            <Ionicons name={iconName} size={20} color={stat.color} />
          </View>
          {/* Titik indikator minimalis */}
          <View style={[styles.indicatorDot, { backgroundColor: stat.color }]} />
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
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  content: {
    padding: 14,
    minHeight: 124,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  textWrapper: {
    marginTop: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 16,
  },
});
