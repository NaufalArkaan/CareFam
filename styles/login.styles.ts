import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';

// RUBRIK: Inline & External Styles
export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    marginBottom: spacing.xs,
  },
  logoText: {
    fontSize: typography.heading,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  altLinkContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  altLinkText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  demoSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoTitle: {
    fontSize: typography.caption,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  accountCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  accountName: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  accountEmail: {
    fontSize: typography.caption,
    color: colors.muted,
    marginTop: 2,
  },
  accountRoleBadge: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  noteText: {
    fontSize: typography.caption,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});
