import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },

  // Navigation Bar (Back button)
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // Top Actions Bar (Count & Add Button)
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: typography.caption,
    color: colors.muted,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    gap: 6,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: 'bold',
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.text,
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },

  // Filter Chips Row
  filterScroll: {
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.surface,
    fontWeight: 'bold',
  },

  // Card Item
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 4,
  },
  badgeText: {
    fontSize: typography.caption - 2,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: typography.caption - 1,
    color: colors.muted,
  },
  cardTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },

  // Patient badge
  patientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
    gap: 4,
  },
  patientBadgeText: {
    fontSize: typography.caption - 1,
    color: colors.text,
    fontWeight: '600',
  },

  // Facility Text
  facilityText: {
    fontSize: typography.caption - 1,
    color: colors.muted,
    marginBottom: spacing.sm,
  },

  // Diagnosis Box
  diagnosisBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  diagnosisLabel: {
    fontSize: typography.caption - 2,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 2,
  },
  diagnosisText: {
    fontSize: typography.caption - 1,
    color: '#166534',
    lineHeight: 18,
  },

  noDiagnosisBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  noDiagnosisText: {
    fontSize: typography.caption - 2,
    color: colors.muted,
    fontStyle: 'italic',
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fileIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fileIndicatorText: {
    fontSize: typography.caption - 1,
    color: colors.muted,
    fontWeight: '500',
  },
  detailButton: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailButtonText: {
    fontSize: typography.caption - 1,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // Empty State
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: typography.caption,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  // Form Styles (Add Screen)
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  requiredStar: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  inputHint: {
    fontSize: typography.caption - 2,
    color: colors.muted,
    marginTop: 2,
  },
  textInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.caption,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textAreaInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.caption,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlignVertical: 'top',
  },

  // File Picker Box
  filePickerBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filePickerText: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  filePickerHint: {
    fontSize: typography.caption - 2,
    color: colors.muted,
    marginTop: 2,
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  selectedFileName: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '600',
  },

  // Form Buttons
  formButtonRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    fontSize: typography.caption,
    color: colors.muted,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: typography.caption,
    color: colors.surface,
    fontWeight: 'bold',
  },

  // Error Box
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#991B1B',
    fontSize: typography.caption,
    fontWeight: '600',
  },

  // Detail View Section
  detailSection: {
    marginBottom: spacing.md,
  },
  detailSectionHeader: {
    fontSize: typography.caption - 1,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  detailInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLabel: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  detailRowValue: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
});
