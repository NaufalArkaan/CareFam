import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

// RUBRIK: Type & Array of Objects
export interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

// RUBRIK: External & Inline Styles
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  backgroundColor = colors.primary,
  children,
}) => {
  return (
    // RUBRIK: External & Inline Styles (Inline style untuk warna latar header dinamis sesuai peran)
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.secondary,
  },
});
