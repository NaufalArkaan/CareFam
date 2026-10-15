import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { FeatureItem } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

// RUBRIK: Type & Array of Objects
export interface FeatureCardProps extends ViewProps {
  item: FeatureItem;
}

// RUBRIK: External & Inline Styles
// Menggunakan forwardRef agar kompatibel dengan Expo Router <Link asChild>
export const FeatureCard = React.forwardRef<View, FeatureCardProps>(
  ({ item, style, ...restProps }, ref) => {
    const isSoon = item.status === 'soon';

    return (
      // RUBRIK: External & Inline Styles (Inline style untuk kelambutan transparan pada kartu status 'soon')
      <View
        ref={ref}
        style={[styles.card, { opacity: isSoon ? 0.7 : 1.0 }, style]}
        {...restProps}
      >
        <View style={styles.headerRow}>
          <Text style={styles.icon}>{item.icon}</Text>
          {isSoon ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Segera hadir</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';


const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  badge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: typography.caption,
    color: colors.muted,
    fontWeight: '500',
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.caption,
    color: colors.muted,
    lineHeight: 20,
  },
});
