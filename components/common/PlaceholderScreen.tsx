import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

// RUBRIK: Type & Array of Objects
export interface PlaceholderScreenProps {
  title: string;
}

// RUBRIK: External & Inline Styles
export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛠️</Text>
      <Text style={styles.text}>Halaman {title} sedang dikerjakan</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: typography.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});
