import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: rawWidth } = Dimensions.get('window');
// Skala responsif: mempertahankan rasio smartphone (Android/iPhone) 100%,
// dan membatasi maksimum 480px pada desktop Web agar proporsi lingkaran dekoratif tetap estetis
const width = Math.min(rawWidth || 390, 480);

export const splashStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // ===== Pusat Cahaya Putih Bersih (Luminous White Center Glow) =====
  centerWhiteGlow: {
    position: 'absolute',
    width: width * 1.05,
    height: width * 1.05,
    borderRadius: (width * 1.05) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    zIndex: 1,
  },

  // ===== Lingkaran & Lengkungan Dekoratif Biru Glassmorphism (Sesuai Referensi) =====
  // 1. Lengkungan atas kanan (Sky Blue #83BDFF)
  arcTopRight: {
    position: 'absolute',
    top: -width * 0.25,
    right: -width * 0.22,
    width: width * 0.92,
    height: width * 0.92,
    borderRadius: (width * 0.92) / 2,
    backgroundColor: 'rgba(131, 189, 255, 0.32)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    zIndex: 2,
  },

  // 2. Lengkungan atas kiri (Periwinkle Blue #AFC5FF)
  arcTopLeft: {
    position: 'absolute',
    top: -width * 0.18,
    left: -width * 0.26,
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: (width * 0.82) / 2,
    backgroundColor: 'rgba(175, 197, 255, 0.24)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    zIndex: 2,
  },

  // 3. Lengkungan bawah kanan (Soft Blue #B9DCFF)
  arcBottomRight: {
    position: 'absolute',
    bottom: -width * 0.3,
    right: -width * 0.2,
    width: width * 1.15,
    height: width * 1.15,
    borderRadius: (width * 1.15) / 2,
    backgroundColor: 'rgba(185, 220, 255, 0.38)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    zIndex: 2,
  },

  // 4. Lengkungan bawah kiri (Sky Blue #83BDFF)
  arcBottomLeft: {
    position: 'absolute',
    bottom: -width * 0.15,
    left: -width * 0.28,
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: (width * 0.95) / 2,
    backgroundColor: 'rgba(131, 189, 255, 0.26)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.60)',
    zIndex: 2,
  },

  // ===== Konten Utama di Tengah Layar =====
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  // Wadah Glassmorphism Squircle Logo CareFam
  logoCardContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#83BDFF',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.32,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoCardImage: {
    width: 140,
    height: 140,
    borderRadius: 44,
  },

  // Tipografi Nama Brand & Tagline
  textContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  brandName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#172554', // Navy Blue tegas berjarak kontras tinggi terhadap latar putih
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#475569', // Slate Blue halus dan nyaman dibaca
    marginTop: 6,
    letterSpacing: 0.2,
  },

  // 3 Dots Indikator (Sesuai Desain Referensi)
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 22,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotInactive: {
    backgroundColor: '#BAE6FD', // Sky blue muda
  },
  dotActive: {
    backgroundColor: '#2563EB', // Biru aktif CareFam
    transform: [{ scale: 1.15 }],
  },
});
