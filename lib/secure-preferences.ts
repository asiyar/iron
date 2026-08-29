import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const BIOMETRIC_LOCK_KEY = "ironpulse.biometric-lock";

export async function saveBiometricPreference(enabled: boolean) {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") localStorage.setItem(BIOMETRIC_LOCK_KEY, String(enabled));
    return;
  }
  await SecureStore.setItemAsync(BIOMETRIC_LOCK_KEY, String(enabled));
}

export async function readBiometricPreference() {
  if (Platform.OS === "web") return typeof localStorage !== "undefined" ? localStorage.getItem(BIOMETRIC_LOCK_KEY) === "true" : false;
  return (await SecureStore.getItemAsync(BIOMETRIC_LOCK_KEY)) === "true";
}
