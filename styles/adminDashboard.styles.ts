import { StyleSheet, Platform } from 'react-native';

export const adminColors = {
  // Brand & Accent Colors (Modern Pastel Blue & Lavender Hierarchy)
  pastelBlue: '#E0EEFF',
  lavender: '#EBE5FC',
  softPurple: '#8B5CF6',
  royalBlue: '#2563EB',
  indigo: '#4F46E5',

  // Neutrals & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderSubtle: '#EDE9FE',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  // Status & Badges
  successGreen: '#10B981',
  successBg: '#ECFDF5',
  warningAmber: '#F59E0B',
  dangerRed: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',

  // Card Shadow
  cardShadow: '#0F172A',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // ===== Hero Header (Pastel Blue ke Lavender Gradient) =====
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  appIdentityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  appIdentityText: {
    fontSize: 12,
    fontWeight: '700',
    color: adminColors.royalBlue,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  systemStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  statusIcon: {
    marginRight: 5,
  },
  statusText: {
    color: adminColors.royalBlue,
    fontSize: 11,
    fontWeight: '600',
  },

  // ===== Profil Administrator (Dapat Ditekan untuk Buka Menu Akun) =====
  profilePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  profileInfoWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    fontSize: 11.5,
    color: adminColors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminNameText: {
    fontSize: 19,
    fontWeight: '800',
    color: adminColors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: adminColors.softPurple,
    letterSpacing: 0.3,
  },
  emailText: {
    fontSize: 11.5,
    color: adminColors.textSecondary,
    fontWeight: '500',
  },
  profileAvatarSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: adminColors.softPurple,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: adminColors.royalBlue,
  },

  // ===== Area Konten Utama =====
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  // ===== Welcome Banner Sederhana & Ringkas =====
  welcomeBanner: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    flexDirection: 'row',
    alignItems: 'center',
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
  welcomeBannerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  welcomeBannerTextWrapper: {
    flex: 1,
  },
  welcomeBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  welcomeBannerDescription: {
    fontSize: 12,
    color: adminColors.textSecondary,
    lineHeight: 17,
  },

  // ===== Section Layout =====
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: adminColors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: adminColors.textSecondary,
  },
  sectionSummary: {
    fontSize: 12.5,
    color: adminColors.textSecondary,
    fontWeight: '400',
    lineHeight: 17,
  },

  // ===== Grids Statistik =====
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // ===== Menu Manajemen Horizontal Scroll Navigation =====
  horizontalMenuContainer: {
    marginHorizontal: -16,
    paddingVertical: 4,
  },
  horizontalMenuScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  horizontalMenuItem: {
    alignItems: 'center',
    width: 82,
    marginRight: 12,
  },
  circleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  circleIconActive: {
    borderWidth: 2.5,
    borderColor: adminColors.royalBlue,
    ...Platform.select({
      ios: {
        shadowColor: adminColors.royalBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  activeDotBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: adminColors.royalBlue,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  horizontalMenuTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: adminColors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 15,
  },
  horizontalMenuTitleActive: {
    fontWeight: '700',
    color: adminColors.royalBlue,
  },
  activeMiniBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  activeMiniBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: adminColors.royalBlue,
  },

  // ===== Modal / Bottom Sheet Menu Profil Administrator =====
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
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: adminColors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  sheetProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sheetAvatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
    overflow: 'hidden',
  },
  sheetAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sheetAvatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: adminColors.royalBlue,
  },
  sheetProfileInfo: {
    flex: 1,
  },
  sheetAdminName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginBottom: 2,
  },
  sheetAdminEmail: {
    fontSize: 12,
    color: adminColors.textSecondary,
    marginBottom: 6,
  },
  sheetRoleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sheetRoleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: adminColors.softPurple,
  },
  sheetActionSection: {
    marginBottom: 8,
  },
  sheetLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adminColors.dangerBg,
    borderWidth: 1,
    borderColor: adminColors.dangerBorder,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sheetLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 8,
  },
  sheetCloseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  sheetCloseText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
});
