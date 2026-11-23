import { StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

// RUBRIK: Inline & External Styles
export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },

  gradientContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // HERO SECTION: Dokter + Heart di KIRI | CareFam + Teks di KANAN
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 200,
    marginTop: 4,
    marginBottom: -16,
    position: "relative",
  },

  heroLeft: {
    width: 140,
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    marginBottom: -4,
  },

  heartDecoration: {
    position: "absolute",
    top: 15,
    left: -12,
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.45,
    zIndex: 1,
  },

  doctorImage: {
    width: 135,
    height: 195,
    zIndex: 2,
  },

  heroRight: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 2,
    justifyContent: "center",
    paddingBottom: 24,
    zIndex: 3,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  brandIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  brandTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#172554",
    letterSpacing: -0.3,
  },

  welcomeHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 26,
    letterSpacing: -0.3,
  },

  waveHand: {
    fontSize: 19,
  },

  welcomeSubtitle: {
    fontSize: 12.5,
    lineHeight: 17,
    color: "#64748B",
    marginTop: 5,
    fontWeight: "400",
  },

  // ADMIN HERO SECTION
  adminHeroContainer: {
    alignItems: "center",
    paddingTop: 6,
    marginBottom: -16,
    position: "relative",
  },

  adminBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 6,
  },

  adminIconBadge: {
    marginRight: 6,
  },

  adminBrandText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.3,
  },

  adminTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
  },

  adminSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  adminDoctorContainer: {
    width: 130,
    height: 145,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  adminHeartShape: {
    position: "absolute",
    top: 5,
    alignSelf: "center",
    opacity: 0.45,
    zIndex: 1,
  },

  adminDoctorImage: {
    width: 105,
    height: 140,
    zIndex: 2,
  },

  // LOGIN CARD
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -8,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 6,
  },

  // Tab Toggle Mode (Masuk vs Daftar)
  modeToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  modeToggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  modeToggleActiveTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  modeToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  modeToggleActiveText: {
    color: "#2563EB",
    fontWeight: "700",
  },

  // Alert Feedback Boxes
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  alertIcon: {
    marginRight: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    lineHeight: 18,
  },

  successText: {
    flex: 1,
    fontSize: 13,
    color: "#16A34A",
    lineHeight: 18,
  },

  // Form Fields
  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },

  requiredStar: {
    color: "#EF4444",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  },

  inputIcon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 10,
  },

  eyeIcon: {
    padding: 6,
    marginLeft: 4,
  },

  // Options Row
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 2,
  },

  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rememberMeText: {
    marginLeft: 7,
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },

  forgotText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  // Tombol Masuk
  buttonContainer: {
    marginTop: 2,
    marginBottom: 14,
  },

  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  dividerText: {
    marginHorizontal: 14,
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Admin Link
  altLinkContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  altButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#BFDBFE",
    backgroundColor: "#FFFFFF",
  },

  altButtonIcon: {
    marginRight: 8,
  },

  altLinkText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },

  // Demo Account Section
  demoSection: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  demoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },

  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F8FE",
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBF2FC",
    marginBottom: 10,
  },

  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  accountInfo: {
    flex: 1,
  },

  accountName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },

  accountEmail: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },

  badgeWrapper: {
    alignSelf: "flex-start",
  },

  accountRoleBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },

  noteText: {
    textAlign: "center",
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 8,
  },
});
