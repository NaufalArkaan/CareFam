import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "../../constants/theme";

// RUBRIK: Type & Array of Objects
export interface PrimaryButtonProps extends PressableProps {
  label: string;
  color?: string;
}

// RUBRIK: External & Inline Styles
// Menggunakan forwardRef agar kompatibel dengan Expo Router <Link asChild>
export const PrimaryButton = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  PrimaryButtonProps
>(({ label, color = colors.primary, style, ...restProps }, ref) => {
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={(state) => [
        styles.button,
        { backgroundColor: color, opacity: state.pressed ? 0.85 : 1.0 },
        typeof style === "function" ? style(state) : style,
      ]}
      {...restProps}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
});

PrimaryButton.displayName = "PrimaryButton";

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: typography.body,
    fontWeight: "bold",
    color: colors.surface,
  },
});
