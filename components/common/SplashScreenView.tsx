import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Platform, Text, View } from "react-native";
import { splashStyles as styles } from "../../styles/splashScreen.styles";

interface SplashScreenViewProps {
  /** Menandakan apakah pemeriksaan sesi dan inisialisasi masih berjalan */
  isLoading: boolean;
  /** Callback yang dipanggil setelah animasi fade-out selesai */
  onAnimationFinish?: () => void;
}

export const SplashScreenView: React.FC<SplashScreenViewProps> = ({
  isLoading,
  onAnimationFinish,
}) => {
  // Timestamp saat komponen dimuat untuk menjamin durasi minimal 2.5 detik
  const mountTime = useRef(Date.now()).current;

  // Gunakan native driver hanya pada platform native (iOS/Android) untuk kompatibilitas Web tanpa warning
  const useNativeDriver = Platform.OS !== "web";

  // Animasi logo pembuka (fade-in & spring scale-in)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  // Animasi teks nama brand, tagline, dan dots yang muncul bertahap
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;

  // Animasi pergerakan lengkungan lingkaran dekoratif biru (breathing loop halus)
  const motionAnim = useRef(new Animated.Value(0)).current;

  // Animasi penutup (fade-out seluruh splash screen overlay)
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Jalankan animasi logo CareFam
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 35,
        useNativeDriver,
      }),
    ]).start();

    // 2. Animasi teks brand muncul bertahap (staggered delay 220ms)
    const textTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]).start();
    }, 220);

    // 3. Loop animasi pergerakan lembut dekorasi lingkaran biru glassmorphism
    const motionLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(motionAnim, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver,
        }),
        Animated.timing(motionAnim, {
          toValue: 0,
          duration: 3400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver,
        }),
      ])
    );
    motionLoop.start();

    return () => {
      clearTimeout(textTimer);
      motionLoop.stop();
    };
  }, [fadeAnim, scaleAnim, textFadeAnim, textTranslateY, motionAnim, useNativeDriver]);

  useEffect(() => {
    // 4. Ketika pemeriksaan sesi selesai (isLoading === false),
    // hitung sisa durasi agar memenuhi batas minimal 2.5 detik (2500ms)
    if (!isLoading) {
      const elapsed = Date.now() - mountTime;
      const minDuration = 2500;
      const remainingTime = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }).start(() => {
          if (onAnimationFinish) {
            onAnimationFinish();
          }
        });
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, mountTime, overlayOpacity, onAnimationFinish, useNativeDriver]);

  // Interpolasi transformasi lembut untuk lengkungan/lingkaran dekoratif biru
  const arcScale1 = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const arcTranslateY = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const arcScale2 = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.06, 0.98],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: overlayOpacity,
        },
      ]}
      pointerEvents="auto"
    >
      {/* Background White-to-Blue Gradient: Dominan Putih Bersih di Tengah */}
      <LinearGradient
        colors={["#EAF4FF", "#FFFFFF", "#FFFFFF", "#EAF4FF", "#D0E6FF"]}
        locations={[0, 0.22, 0.72, 0.88, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Layer 1: Pusat Cahaya Putih Bersih */}
        <View style={styles.centerWhiteGlow} pointerEvents="none" />

        {/* Layer 2: Lingkaran & Lengkungan Transparan Biru Glassmorphism (Sesuai Referensi) */}
        {/* Sudut Atas Kanan */}
        <Animated.View
          style={[
            styles.arcTopRight,
            {
              transform: [{ scale: arcScale1 }, { translateY: arcTranslateY }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Sudut Atas Kiri */}
        <Animated.View
          style={[
            styles.arcTopLeft,
            {
              transform: [{ scale: arcScale2 }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Sudut Bawah Kanan */}
        <Animated.View
          style={[
            styles.arcBottomRight,
            {
              transform: [{ scale: arcScale1 }, { translateY: arcTranslateY }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Sudut Bawah Kiri */}
        <Animated.View
          style={[
            styles.arcBottomLeft,
            {
              transform: [{ scale: arcScale2 }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Layer 3: Konten Tengah — Logo CareFam dalam Card Glassmorphism */}
        <View style={styles.centerContent}>
          {/* Logo Card dengan Animasi Fade & Spring Scale */}
          <Animated.View
            style={[
              styles.logoCardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/carefam-logo-card.png")}
              style={styles.logoCardImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Teks Nama Brand, Tagline, dan 3 Dots Indikator */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textFadeAnim,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.brandName}>CareFam</Text>
            <Text style={styles.tagline}>Healthcare for Your Family</Text>

            {/* 3 Dots Indikator (Sesuai Desain Referensi) */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotInactive]} />
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
