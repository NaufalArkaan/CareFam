import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2, // Ekstra padding di bawah agar nyaman di-scroll dan tidak mentok border bawah layar
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSummary: {
    fontSize: typography.caption,
    color: colors.muted,
    fontWeight: '400',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.accent,
    padding: spacing.sm, // Touch target lebih besar
  },
});
