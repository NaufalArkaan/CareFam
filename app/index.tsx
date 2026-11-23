import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Entry Point Root ('/') CareFam.
 * Evaluasi sesi dan navigasi otomatis diarahkan oleh Route Protection Guard
 * di app/_layout.tsx secara mulus bersamaan dengan transisi Splash Screen.
 */
export default function Index() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
