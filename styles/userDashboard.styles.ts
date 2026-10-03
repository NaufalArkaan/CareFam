import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../constants/theme';

// RUBRIK: Inline & External Styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  greetingText: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.surface,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSummary: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  disclaimerCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  disclaimerText: {
    fontSize: typography.caption,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.accent,
  },
});
