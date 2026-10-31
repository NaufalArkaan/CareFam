// RUBRIK: Modul 3 — Custom & Pre-built Async Function (Naufal)

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { loadCurrentWeather } from '../../services/weatherAsync';
import { getWeatherDescription, getWeatherIcon } from '../../utils/weather';
import type { WeatherData } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

export interface WeatherCardProps {
  /**
   * Opsional: Handler eksternal (misal alur Promise .then() dari Syahrial)
   * untuk mendemonstrasikan variasi alur asynchronous tanpa double fetch otomatis.
   */
  onCustomFetch?: () => Promise<WeatherData>;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ onCustomFetch }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  /**
   * CHECKPOINT 2 & 4: Custom Async Function handler dengan async/await,
   * try-catch-finally, dan perlindungan state.
   */
  const handleFetchWeather = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Menggunakan handler kustom jika ada, atau default ke custom async function Naufal
      const data: WeatherData = onCustomFetch
        ? await onCustomFetch()
        : await loadCurrentWeather();

      setWeather(data);
      const now = new Date();
      setLastUpdated(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke layanan cuaca. Periksa koneksi internet Anda.';
      setErrorMessage(message);
    } finally {
      // Memastikan loading selalu selesai baik saat sukses maupun terjadi error
      setIsLoading(false);
    }
  }, [onCustomFetch]);

  // CHECKPOINT 4: Pemuatan awal tunggal saat mount, bebas dari infinite request loop
  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      if (isMounted) {
        await handleFetchWeather();
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, [handleFetchWeather]);

  return (
    <View style={styles.cardContainer}>
      {/* Header Kartu Cuaca */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationPin}>📍</Text>
          <View>
            <Text style={styles.cityText}>Malang, Jawa Timur</Text>
            <Text style={styles.subtitleText}>Informasi Cuaca Terkini</Text>
          </View>
        </View>

        {lastUpdated && !isLoading && !errorMessage ? (
          <Text style={styles.timeBadge}>{lastUpdated} WIB</Text>
        ) : null}
      </View>

      {/* State 1: LOADING */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Mengambil data cuaca Open-Meteo...</Text>
        </View>
      ) : null}

      {/* State 2: ERROR */}
      {!isLoading && errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Gagal Memuat Cuaca</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Coba Lagi"
            style={({ pressed }) => [
              styles.retryButton,
              { opacity: pressed ? 0.8 : 1.0 },
            ]}
            onPress={handleFetchWeather}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : null}

      {/* State 3: SUCCESS */}
      {!isLoading && !errorMessage && weather ? (
        <View style={styles.contentContainer}>
          <View style={styles.mainWeatherRow}>
            <View>
              <Text style={styles.temperatureText}>
                {Math.round(weather.temperature)}°C
              </Text>
              <Text style={styles.conditionText}>
                {getWeatherIcon(weather.weatherCode)}{' '}
                {getWeatherDescription(weather.weatherCode)}
              </Text>
            </View>

            <View style={styles.metricsBox}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Terasa Seperti</Text>
                <Text style={styles.metricValue}>
                  {Math.round(weather.apparentTemperature)}°C
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Kelembapan</Text>
                <Text style={styles.metricValue}>{weather.relativeHumidity}%</Text>
              </View>
            </View>
          </View>

          {/* Tombol Perbarui Cuaca (Refresh) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Perbarui Data Cuaca"
            style={({ pressed }) => [
              styles.refreshButton,
              { opacity: pressed ? 0.85 : 1.0 },
            ]}
            onPress={handleFetchWeather}
          >
            <Text style={styles.refreshButtonText}>🔄 Perbarui Cuaca</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  cityText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  subtitleText: {
    fontSize: typography.caption - 2,
    color: colors.muted,
  },
  timeBadge: {
    fontSize: typography.caption - 2,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.caption,
    color: colors.muted,
  },
  errorContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: '#FDF2F2',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  errorTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: typography.caption,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  contentContainer: {
    paddingTop: spacing.xs,
  },
  mainWeatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  conditionText: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  metricsBox: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricItem: {
    marginVertical: 2,
  },
  metricLabel: {
    fontSize: typography.caption - 2,
    color: colors.muted,
  },
  metricValue: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  refreshButtonText: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
});

