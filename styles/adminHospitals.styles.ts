import { StyleSheet, Platform } from 'react-native';
import { adminColors } from './adminDashboard.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },

  // ===== Header Hospital Management =====
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#16A34A',
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: adminColors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: adminColors.textSecondary,
    lineHeight: 18,
  },

  // ===== Search & Filter Controls =====
  controlsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  searchBar: {
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
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },

  // Chips Filter Horizontal
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Meta Info & Add Button Bar
  metaInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  metaInfoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textMuted,
  },
  addFacilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#16A34A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addFacilityBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  // ===== Hospital Cards List =====
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: adminColors.border,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleWrapper: {
    flex: 1,
  },
  cardName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: adminColors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  statusBadgeTextInactive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },

  // Body Information
  cardBody: {
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    color: adminColors.textSecondary,
    lineHeight: 18,
  },

  // Actions Footer
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  detailBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },
  editBtn: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
    marginLeft: 4,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 4,
  },

  // ===== Loading / Empty / Error States =====
  centerStateContainer: {
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: adminColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  stateSubtitle: {
    fontSize: 13,
    color: adminColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: adminColors.royalBlue,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ===== Pagination =====
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 6,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textPrimary,
    marginHorizontal: 4,
  },
  pageIndicatorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textMuted,
  },

  // ===== Modal & Form Styles =====
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: adminColors.textPrimary,
  },
  sheetCloseBtn: {
    padding: 6,
  },

  // Form Fields
  formScroll: {
    maxHeight: 460,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: adminColors.textPrimary,
    marginBottom: 6,
  },
  requiredStar: {
    color: '#DC2626',
    fontWeight: '700',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: adminColors.textPrimary,
  },
  formTextarea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOptionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeOptionPillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  typeOptionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  typeOptionPillTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  switchLabelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: adminColors.textPrimary,
  },
  switchSubtext: {
    fontSize: 12,
    color: adminColors.textMuted,
  },

  // Form Action Buttons
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: adminColors.border,
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  // Detail Modal Row
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailLabelWrapper: {
    width: 120,
  },
  detailLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textMuted,
  },
  detailValueWrapper: {
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: adminColors.textPrimary,
    lineHeight: 18,
  },
});
