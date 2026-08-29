import { Platform } from "react-native";

import type { HealthSnapshot } from "@/shared/fitness";

/**
 * Sağlık verisi köprüsü.
 *
 * iOS  -> @kingstinct/react-native-healthkit
 * Android -> react-native-health-connect
 *
 * Her iki modül de yalnızca development build / store derlemesinde bulunur.
 * Expo Go, web ve Node (vitest) ortamlarında güvenli bir "unsupported" durumu döner;
 * böylece çağıran ekranlar platform kontrolü yapmak zorunda kalmaz.
 */

const UNSUPPORTED: HealthSnapshot = {
  provider: "none",
  status: "unsupported",
  enabled: false,
  message: "Sağlık senkronizasyonu yalnızca iOS ve Android derlemelerinde kullanılabilir.",
};

function isNativeRuntime() {
  return Platform.OS === "ios" || Platform.OS === "android";
}

async function loadAppleHealth() {
  try {
    return await import("@kingstinct/react-native-healthkit");
  } catch {
    return null;
  }
}

async function loadHealthConnect() {
  try {
    return await import("react-native-health-connect");
  } catch {
    return null;
  }
}

/** Mevcut izinlerle okunabilen özet veriyi döner. İzin yoksa "needs-permission" verir. */
export async function syncHealthData(): Promise<HealthSnapshot> {
  if (!isNativeRuntime()) return UNSUPPORTED;

  if (Platform.OS === "ios") {
    const healthkit = await loadAppleHealth();
    if (!healthkit) return UNSUPPORTED;
    try {
      const available = await healthkit.isHealthDataAvailableAsync();
      if (!available) return { ...UNSUPPORTED, provider: "apple-health" };
      return {
        provider: "apple-health",
        status: "connected",
        enabled: true,
        lastSyncedAt: new Date().toISOString(),
      };
    } catch (error) {
      return { provider: "apple-health", status: "error", enabled: false, message: String(error) };
    }
  }

  const healthConnect = await loadHealthConnect();
  if (!healthConnect) return UNSUPPORTED;
  try {
    const initialized = await healthConnect.initialize();
    if (!initialized) return { provider: "health-connect", status: "needs-permission", enabled: false };
    return {
      provider: "health-connect",
      status: "connected",
      enabled: true,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    return { provider: "health-connect", status: "error", enabled: false, message: String(error) };
  }
}

/** İzin diyaloğunu açar, ardından senkronizasyonu dener. */
export async function requestHealthPermissionAndSync(): Promise<HealthSnapshot> {
  if (!isNativeRuntime()) return UNSUPPORTED;

  if (Platform.OS === "ios") {
    const healthkit = await loadAppleHealth();
    if (!healthkit) return UNSUPPORTED;
    try {
      // @kingstinct/react-native-healthkit v14: tek bir { toRead, toShare } nesnesi alır.
      await healthkit.requestAuthorization({
        toRead: ["HKQuantityTypeIdentifierStepCount", "HKQuantityTypeIdentifierBodyMass", "HKWorkoutTypeIdentifier"],
        toShare: [],
      });
    } catch (error) {
      return { provider: "apple-health", status: "error", enabled: false, message: String(error) };
    }
    return syncHealthData();
  }

  const healthConnect = await loadHealthConnect();
  if (!healthConnect) return UNSUPPORTED;
  try {
    await healthConnect.initialize();
    await healthConnect.requestPermission([
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "Weight" },
      { accessType: "read", recordType: "ExerciseSession" },
    ]);
  } catch (error) {
    return { provider: "health-connect", status: "error", enabled: false, message: String(error) };
  }
  return syncHealthData();
}
