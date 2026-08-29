import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { ActivityIndicator, AppState, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFitness } from "@/lib/fitness-store";

export function BiometricLock({ children }: PropsWithChildren) {
  const { data, ready } = useFitness();
  const [locked, setLocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const backgroundAt = useRef<number | null>(null);

  const authenticate = useCallback(async () => {
    if (Platform.OS === "web" || !data.settings.biometricLockEnabled) return setLocked(false);
    setChecking(true);
    const [hasHardware, isEnrolled] = await Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync()]);
    if (!hasHardware || !isEnrolled) {
      setLocked(false);
      setChecking(false);
      return;
    }
    const response = await LocalAuthentication.authenticateAsync({
      promptMessage: "IronPulse kilidini aç",
      fallbackLabel: "Cihaz parolasını kullan",
      cancelLabel: "Vazgeç",
    });
    setLocked(!response.success);
    setChecking(false);
  }, [data.settings.biometricLockEnabled]);

  useEffect(() => {
    if (!ready || Platform.OS === "web") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") backgroundAt.current = Date.now();
      if (state === "active" && backgroundAt.current) {
        const elapsed = Date.now() - backgroundAt.current;
        backgroundAt.current = null;
        if (elapsed >= data.settings.lockTimeoutMinutes * 60_000 && data.settings.biometricLockEnabled) {
          setLocked(true);
        }
      }
    });
    return () => subscription.remove();
  }, [data.settings.biometricLockEnabled, data.settings.lockTimeoutMinutes, ready]);

  useEffect(() => {
    if (locked && !checking) authenticate();
  }, [authenticate, checking, locked]);

  if (!ready) return <View style={styles.loading}><ActivityIndicator color="#B8FF3D" /></View>;
  if (!locked) return <>{children}</>;
  return <View style={styles.locked}>
    <View style={styles.iconCircle}><Text style={styles.icon}>⌁</Text></View>
    <Text style={styles.title}>IronPulse kilitli</Text>
    <Text style={styles.copy}>Antrenman kayıtlarını görüntülemek için cihazınla doğrulama yap.</Text>
    <TouchableOpacity style={styles.button} onPress={authenticate} disabled={checking}>
      <Text style={styles.buttonText}>{checking ? "Doğrulanıyor…" : "Kilidi Aç"}</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: "#0B0E12", alignItems: "center", justifyContent: "center" },
  locked: { flex: 1, backgroundColor: "#0B0E12", padding: 28, alignItems: "center", justifyContent: "center" },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#18221A", alignItems: "center", justifyContent: "center", marginBottom: 22 },
  icon: { color: "#B8FF3D", fontSize: 38, fontWeight: "800" },
  title: { color: "#F5F7FA", fontSize: 24, fontWeight: "800" },
  copy: { color: "#9AA6B5", fontSize: 15, textAlign: "center", lineHeight: 22, marginTop: 10, maxWidth: 280 },
  button: { marginTop: 28, backgroundColor: "#B8FF3D", paddingHorizontal: 24, paddingVertical: 15, borderRadius: 16 },
  buttonText: { color: "#10150B", fontWeight: "800", fontSize: 16 },
});
