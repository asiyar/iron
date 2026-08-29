import { Platform } from "react-native";

const { themeColors } = require("../../theme.config.js") as {
  themeColors: Record<string, { light: string; dark: string }>;
};

export type ColorScheme = "light" | "dark";
export type ThemeColorPalette = Record<keyof typeof themeColors, string>;

/** Ham token tablosu — hem NativeWind hem StyleSheet tarafından kullanılır. */
export const ThemeColors = themeColors;

/** Şemaya göre düzleştirilmiş palet. */
export const SchemeColors: Record<ColorScheme, ThemeColorPalette> = {
  light: Object.fromEntries(Object.entries(themeColors).map(([key, value]) => [key, value.light])) as ThemeColorPalette,
  dark: Object.fromEntries(Object.entries(themeColors).map(([key, value]) => [key, value.dark])) as ThemeColorPalette,
};

/** Uygulama koyu tema öncelikli çalışır; varsayılan kısayol budur. */
export const Colors = SchemeColors.dark;

export const Fonts = Platform.select({
  ios: { sans: "System", serif: "Georgia", rounded: "System", mono: "Menlo" },
  android: { sans: "sans-serif", serif: "serif", rounded: "sans-serif", mono: "monospace" },
  default: { sans: "system-ui", serif: "Georgia, serif", rounded: "system-ui", mono: "ui-monospace, monospace" },
})!;
