import { useEffect } from "react";
import { AppState } from "react-native";

import { syncHealthData } from "@/lib/health-sync";
import { useFitness } from "@/lib/fitness-store";

export function HealthSyncGate() {
  const { data, applyHealthSnapshot } = useFitness();

  useEffect(() => {
    if (!data.healthSync.enabled) return;
    syncHealthData().then(applyHealthSnapshot).catch(() => undefined);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncHealthData().then(applyHealthSnapshot).catch(() => undefined);
    });
    return () => subscription.remove();
  }, [applyHealthSnapshot, data.healthSync.enabled]);

  return null;
}
