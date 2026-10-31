import { StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

// RUBRIK: Inline & External Styles
export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6F1FC",
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
    color: "#1E293B",
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

  // Form Fields
  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 7,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  inputLeadingIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 12,
  },

  inputTrailingIcon: {
    marginLeft: 8,
  },

  // Options: Ingat saya & Lupa kata sandi?
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 18,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rememberText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 7,
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
  },

  accountEmail: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  badgeWrapper: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: 5,
  },

  accountRoleBadge: {
    fontSize: 10,
    color: "#2563EB",
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // Prototype Note
  noteText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 14,
    fontStyle: "italic",
  },
});
