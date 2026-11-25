import { StyleSheet, Platform } from 'react-native';
import { adminColors } from './adminDashboard.styles';

export const medicalColors = {
  primary: '#0D9488',       // Teal 600
  primaryDark: '#0F766E',   // Teal 700
  primaryLight: '#14B8A6',  // Teal 500
  bgPastel: '#F0FDFA',      // Teal 50
  borderPastel: '#CCFBF1',  // Teal 100
  badgeBg: '#E6FFFA',
  badgeText: '#0D9488',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },

  // ===== Header Medical Records Management =====
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: medicalColors.primary,
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
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },

  // Filter Horizontal Chips
  filterScroll: {
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: adminColors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: medicalColors.primary,
    borderColor: medicalColors.primaryDark,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Sub-filter Status Diagnosis
  subFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  subFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subFilterPillActive: {
    backgroundColor: medicalColors.bgPastel,
    borderColor: medicalColors.primary,
  },
  subFilterPillText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  subFilterPillTextActive: {
    color: medicalColors.primary,
    fontWeight: '700',
  },

  // Stats Bar (Counter)
  countBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: adminColors.textSecondary,
  },
  countNumber: {
    color: medicalColors.primary,
    fontWeight: '700',
  },

  // ===== Medical Record Card =====
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
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
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  recordDateText: {
    fontSize: 11.5,
    color: adminColors.textMuted,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: adminColors.textPrimary,
    lineHeight: 21,
    marginBottom: 8,
  },

  // Patient Info Row
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  patientIcon: {
    color: medicalColors.primary,
  },
  patientNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: adminColors.textPrimary,
  },
  patientRelationText: {
    fontSize: 11.5,
    color: adminColors.textSecondary,
  },
  accountOwnerText: {
    fontSize: 10.5,
    color: adminColors.textMuted,
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // Doctor & Facility Info
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 5,
  },
  facilityText: {
    fontSize: 12,
    color: adminColors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },

  // Diagnosis Box in Card
  diagnosisBox: {
    backgroundColor: '#F0FDFA',
    borderLeftWidth: 3,
    borderLeftColor: medicalColors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  diagnosisHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  diagnosisLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: medicalColors.primaryDark,
  },
  diagnosisSnippet: {
    fontSize: 11.5,
    color: '#134E4A',
    lineHeight: 16,
  },
  cardMetricChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  cardMetricChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardMetricChipText: {
    fontSize: 10.5,
    color: '#0F766E',
    fontWeight: '700',
  },

  // No Diagnosis Pill
  noDiagnosisPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 5,
  },
  noDiagnosisText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    fontStyle: 'italic',
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachmentText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: medicalColors.bgPastel,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: medicalColors.borderPastel,
    gap: 4,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: medicalColors.primary,
  },

  // ===== Detail Modal =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '92%',
    maxHeight: '94%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
    backgroundColor: '#FFFFFF',
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

  // Modal Section
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: adminColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  // Info Grid in Modal
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

  // User Notes Card in Modal (Keluhan Pasien)
  userNotesCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  userNotesText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 19,
    fontWeight: '500',
  },
  userNotesSubtext: {
    fontSize: 11,
    color: '#60A5FA',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Diagnosis Card in Modal
  diagnosisDetailCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: medicalColors.borderPastel,
  },
  diagnosisDetailText: {
    fontSize: 13.5,
    color: '#0F766E',
    lineHeight: 20,
    fontWeight: '500',
  },

  // Structured Lab Metrics in Modal
  labMetricsBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCFBF1',
  },
  labMetricsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  labMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  labMetricBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5EEAD4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  labMetricBadgeAbnormal: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  labMetricLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  labMetricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  labMetricValueAbnormal: {
    color: '#DC2626',
  },

  // Recommendations Card in Modal
  recommendationsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  recommendationsText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 19,
    fontWeight: '500',
  },
  clinicalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  clinicalDisclaimerText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
    flex: 1,
  },

  // File Download / View Section in Modal
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: medicalColors.borderPastel,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  attachmentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: medicalColors.bgPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginBottom: 2,
  },
  attachmentSubtext: {
    fontSize: 11,
    color: adminColors.textMuted,
  },
  openFileButton: {
    backgroundColor: medicalColors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  openFileButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  // ===== Loading, Error, Empty States =====
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: adminColors.textMuted,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginTop: 8,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 12.5,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: medicalColors.bgPastel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: adminColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ===== Pagination =====
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
});
