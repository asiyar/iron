import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated, Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

const THEME_KEY = "ironpulse.theme-preference.v1";
export type ThemePreference = ColorScheme | "system";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = (useSystemColorScheme() ?? "light") as ColorScheme;
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(systemScheme);
  // React Compiler render sırasında ref okumayı uyarır; lazy useState aynı kalıcılığı sağlar.
  const [overlayOpacity] = useState(() => new Animated.Value(0));
  const previousScheme = useRef<ColorScheme>(systemScheme);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      Object.entries(SchemeColors[scheme]).forEach(([token, value]) => root.style.setProperty(`--color-${token}`, value));
    }
  }, []);

  const transitionTo = useCallback((scheme: ColorScheme) => {
    if (scheme === colorScheme) return;
    previousScheme.current = colorScheme;
    overlayOpacity.stopAnimation();
    overlayOpacity.setValue(1);
    setColorSchemeState(scheme);
    applyScheme(scheme);
    Animated.timing(overlayOpacity, { toValue: 0, duration: 260, useNativeDriver: true }).start();
  }, [applyScheme, colorScheme, overlayOpacity]);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      const preference: ThemePreference = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
      setThemePreferenceState(preference);
      const resolved = preference === "system" ? systemScheme : preference;
      setColorSchemeState(resolved);
      applyScheme(resolved);
      previousScheme.current = resolved;
    }).catch(() => applyScheme(systemScheme));
  }, [applyScheme, systemScheme]);

  useEffect(() => {
    if (themePreference === "system") transitionTo(systemScheme);
  }, [systemScheme, themePreference, transitionTo]);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    AsyncStorage.setItem(THEME_KEY, preference).catch(() => undefined);
    transitionTo(preference === "system" ? systemScheme : preference);
  }, [systemScheme, transitionTo]);

  const setColorScheme = useCallback((scheme: ColorScheme) => setThemePreference(scheme), [setThemePreference]);

  const themeVariables = useMemo(() => vars({
    "color-primary": SchemeColors[colorScheme].primary,
    "color-background": SchemeColors[colorScheme].background,
    "color-surface": SchemeColors[colorScheme].surface,
    "color-foreground": SchemeColors[colorScheme].foreground,
    "color-muted": SchemeColors[colorScheme].muted,
    "color-border": SchemeColors[colorScheme].border,
    "color-success": SchemeColors[colorScheme].success,
    "color-warning": SchemeColors[colorScheme].warning,
    "color-error": SchemeColors[colorScheme].error,
  }), [colorScheme]);

  const value = useMemo(() => ({ colorScheme, themePreference, setThemePreference, setColorScheme }), [colorScheme, setColorScheme, setThemePreference, themePreference]);

  return <ThemeContext.Provider value={value}><View style={[{ flex: 1 }, themeVariables]}>{children}<Animated.View pointerEvents="none" style={[styles.transitionOverlay, { backgroundColor: SchemeColors[previousScheme.current].background, opacity: overlayOpacity }]} /></View></ThemeContext.Provider>;
}

const styles = { transitionOverlay: { position: "absolute" as const, inset: 0 } };

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
