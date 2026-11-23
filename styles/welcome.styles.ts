import { StyleSheet, Platform } from 'react-native';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF', // Lembut, perpaduan lavender putih
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },

  // ===== Ambient Gradient Glows (Matching Splash Screen) =====
  ambientOrbTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(244, 114, 182, 0.18)', // Pastel pink glow
  },
  ambientOrbLeft: {
    position: 'absolute',
    top: '35%',
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(196, 181, 253, 0.22)', // Soft purple glow
  },
  ambientOrbBottom: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(199, 210, 254, 0.25)', // Periwinkle / lavender glow
  },

  // ===== Header Section =====
  headerSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(196, 181, 253, 0.5)',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    marginLeft: 6,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  // ===== Cards Container =====
  cardsContainer: {
    gap: 18,
    marginBottom: 24,
  },
  selectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(237, 233, 254, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircleUser: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  iconCircleAdmin: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  cardHeaderText: {
    marginLeft: 14,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1B4B',
    letterSpacing: -0.2,
  },
  cardRoleTag: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#4B5563',
    marginBottom: 20,
  },

  // Tombol Aksi di dalam Card
  actionButtonUser: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  actionButtonUserGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonTextUser: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  actionButtonAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    borderWidth: 1.2,
    borderColor: '#DDD6FE',
    gap: 8,
  },
  actionButtonTextAdmin: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.2,
  },

  // ===== Footer Section =====
  footerSection: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
