import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoItem } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

// RUBRIK: Type & Array of Objects
export interface InfoCardProps {
  item: InfoItem;
}

// RUBRIK: External & Inline Styles
export const InfoCard: React.FC<InfoCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: typography.caption,
    color: colors.muted,
    marginBottom: 2,
  },
  value: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
});
