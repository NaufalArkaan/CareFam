import { StyleSheet, Platform } from 'react-native';
import { adminColors } from './adminDashboard.styles';

export const reportColors = {
  primary: '#D97706', // Amber/Orange thematic color for reports & issues
  primaryDark: '#B45309',
  bgPastel: '#FFFBEB',
  borderPastel: '#FDE68A',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
      },
    }),
  },
  headerTopNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: adminColors.border,
    gap: 6,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: adminColors.textPrimary,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: adminColors.border,
    gap: 6,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: reportColors.primaryDark,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: adminColors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: adminColors.textMuted,
    lineHeight: 18,
  },

  // Stat Summary Row
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  summaryPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: adminColors.border,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  summaryPillActive: {
    borderColor: reportColors.primary,
    backgroundColor: reportColors.bgPastel,
  },
  summaryNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: adminColors.textPrimary,
  },
  summaryLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: adminColors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  // Search & Filter Box
  filterSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: adminColors.border,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: adminColors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },

  // Filter Horizontal Chips
  chipsScroll: {
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: reportColors.primaryDark,
    borderColor: reportColors.primaryDark,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Sub-filter Row
  typeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  typePillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  typePillTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },

  // Report Cards List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: adminColors.border,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11.5,
    color: adminColors.textMuted,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: adminColors.textPrimary,
    lineHeight: 21,
    marginBottom: 6,
  },
  reporterInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reporterName: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.royalBlue,
  },
  reporterEmail: {
    fontSize: 11.5,
    color: adminColors.textMuted,
  },
  cardDescription: {
    fontSize: 12.5,
    color: adminColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  adminNotesSnippet: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    marginBottom: 12,
  },
  adminNotesSnippetTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 3,
  },
  adminNotesSnippetText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reportIdText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: adminColors.royalBlue,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    height: '92%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: adminColors.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Modal Sections
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: adminColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  infoGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoGridLabel: {
    fontSize: 12.5,
    color: adminColors.textMuted,
    fontWeight: '500',
  },
  infoGridValue: {
    fontSize: 12.5,
    color: adminColors.textPrimary,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },

  // Report Content Box in Modal
  reportContentCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reportContentTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 8,
  },
  reportContentBody: {
    fontSize: 13.5,
    color: '#92400E',
    lineHeight: 21,
  },

  // Status Action Card in Modal
  statusActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusOptionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    gap: 4,
  },
  statusOptionButtonActive: {
    borderColor: adminColors.royalBlue,
    backgroundColor: '#EFF6FF',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.textSecondary,
  },
  statusOptionTextActive: {
    color: adminColors.royalBlue,
  },
  adminNotesInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: adminColors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  saveStatusButton: {
    backgroundColor: adminColors.royalBlue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveStatusButtonDisabled: {
    opacity: 0.6,
  },
  saveStatusButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Pagination
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  paginationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },

  // Empty & Error States
  stateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  stateSubtitle: {
    fontSize: 12.5,
    color: adminColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: reportColors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
