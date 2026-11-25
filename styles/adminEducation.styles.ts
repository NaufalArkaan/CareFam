import { StyleSheet, Platform } from 'react-native';
import { adminColors } from './adminDashboard.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },

  // ===== Header Health Education =====
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
    color: '#7C3AED',
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

  // ===== Controls: Search, Category & Status =====
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

  // Chips Filter Horizontal (Kategori)
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 8,
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
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Filter Bar Status (Semua, Published, Draft)
  statusFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusFilterPill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusFilterPillActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#C4B5FD',
  },
  statusFilterPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: adminColors.textMuted,
  },
  statusFilterPillTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
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
  addArticleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addArticleBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  // ===== Article Cards List =====
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
    marginBottom: 8,
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
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: adminColors.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  statusBadgePublished: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeDraft: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeTextPublished: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  statusBadgeTextDraft: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },

  // Card Body Summary
  cardSummary: {
    fontSize: 13,
    color: adminColors.textSecondary,
    lineHeight: 19,
    marginTop: 2,
    marginBottom: 10,
  },

  // Card Meta Row (Author & Date)
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemText: {
    fontSize: 11.5,
    color: adminColors.textMuted,
    marginLeft: 5,
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
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
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
    backgroundColor: '#7C3AED',
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
    maxHeight: '92%',
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
    maxHeight: 500,
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
  formTextareaSummary: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  formTextareaContent: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOptionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryOptionPillActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  categoryOptionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  categoryOptionPillTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },

  // Status Selector Segment
  statusSegmentRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  statusSegmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  statusSegmentBtnActivePublished: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusSegmentBtnActiveDraft: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusSegmentText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textMuted,
  },
  statusSegmentTextActivePublished: {
    color: '#15803D',
    fontWeight: '700',
  },
  statusSegmentTextActiveDraft: {
    color: '#B45309',
    fontWeight: '700',
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
    backgroundColor: '#7C3AED',
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

  // Detail Modal Read Article
  detailScroll: {
    maxHeight: 520,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: adminColors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  detailSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    marginBottom: 16,
  },
  detailSummaryText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: adminColors.textSecondary,
    lineHeight: 19,
  },
  detailContentText: {
    fontSize: 14,
    color: adminColors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
});
