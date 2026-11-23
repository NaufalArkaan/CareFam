import { StyleSheet, Platform } from 'react-native';
import { adminColors } from './adminDashboard.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },

  // ===== Header User Management =====
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
    color: adminColors.royalBlue,
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
    paddingBottom: 8,
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
    marginBottom: 12,
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
  },
  clearButton: {
    padding: 4,
  },

  // Filter Chips Row
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  filterChipActive: {
    backgroundColor: adminColors.royalBlue,
    borderColor: adminColors.royalBlue,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Meta bar info (Total result)
  metaInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  metaInfoText: {
    fontSize: 12,
    color: adminColors.textSecondary,
    fontWeight: '600',
  },

  // ===== User List Items =====
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: adminColors.border,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: adminColors.borderSubtle,
    overflow: 'hidden',
  },
  userAvatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userAvatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: adminColors.royalBlue,
  },
  userInfoWrapper: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: adminColors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  userCallsign: {
    fontSize: 12,
    color: adminColors.royalBlue,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeUser: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  roleBadgeAdmin: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  roleBadgeTextUser: {
    fontSize: 10,
    fontWeight: '700',
    color: adminColors.royalBlue,
  },
  roleBadgeTextAdmin: {
    fontSize: 10,
    fontWeight: '700',
    color: adminColors.softPurple,
  },
  userDateText: {
    fontSize: 11,
    color: adminColors.textMuted,
  },

  // ===== Pagination Controls =====
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textPrimary,
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },

  // ===== Empty & Error States =====
  centerStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 12.5,
    color: adminColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: adminColors.royalBlue,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // ===== Modal Detail Pengguna =====
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
    paddingBottom: Platform.OS === 'ios' ? 38 : 28,
    maxHeight: '88%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetAvatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: adminColors.borderSubtle,
    overflow: 'hidden',
  },
  sheetHeaderInfo: {
    flex: 1,
  },
  sheetUserName: {
    fontSize: 17,
    fontWeight: '800',
    color: adminColors.textPrimary,
    marginBottom: 2,
  },
  sheetUserCallsign: {
    fontSize: 12.5,
    color: adminColors.royalBlue,
    fontWeight: '600',
  },

  // Detail Cards
  detailSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: adminColors.border,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailRowLast: {
    marginBottom: 0,
  },
  detailLabelWrapper: {
    width: 120,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  detailValueWrapper: {
    flex: 1,
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textPrimary,
  },
  detailValueMuted: {
    fontSize: 12,
    color: adminColors.textMuted,
    fontStyle: 'italic',
  },

  // Notice Box
  privacyNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 18,
  },
  privacyNoticeText: {
    fontSize: 11.5,
    color: '#15803D',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  // Close Button
  sheetCloseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  sheetCloseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: adminColors.textPrimary,
  },
});
