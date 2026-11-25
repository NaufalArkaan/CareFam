import { StyleSheet, Platform } from 'react-native';
import { colors } from '../constants/theme';

export const userEducationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Navigation Bar
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.primary,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 4,
  },

  // Filter Categories Scroll
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Article Cards List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
      },
    }),
  },
  thumbnailImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F1F5F9',
  },
  cardBody: {
    padding: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 23,
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
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
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    opacity: 0.35,
  },
  paginationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },

  // Empty & Error States
  stateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 36,
    marginHorizontal: 16,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stateIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // ==========================================
  // DETAIL SCREEN STYLES
  // ==========================================
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailScroll: {
    paddingBottom: 48,
  },
  detailImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#E2E8F0',
  },
  detailHeaderContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  detailCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 30,
    marginBottom: 14,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  authorAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorNameDetail: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  authorRoleDetail: {
    fontSize: 11.5,
    color: '#64748B',
  },
  summaryHighlightBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 20,
  },
  summaryHighlightTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryHighlightText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  contentBody: {
    paddingHorizontal: 20,
  },
  contentParagraph: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 25,
    marginBottom: 16,
  },
  disclaimerBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  disclaimerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#92400E',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  backToTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  backToTopText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
});
