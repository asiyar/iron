import { useEffect, useState } from "react";
import Purchases, { type PurchasesOfferings, type PurchasesPackage } from "react-native-purchases";

let configuredKey: string | undefined;
let configurePromise: Promise<boolean> | undefined;

async function ensureConfigured() {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_PUBLIC_SDK_KEY ?? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_PUBLIC_SDK_KEY;
  if (!apiKey) return false;
  if (configuredKey === apiKey) return true;
  if (!configurePromise) {
    configurePromise = Promise.resolve().then(() => {
      Purchases.configure({ apiKey });
      configuredKey = apiKey;
      return true;
    });
  }
  return configurePromise;
}

export type StorePlan = { identifier: string; priceString?: string; package: PurchasesPackage };

export function useRevenueCat() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    ensureConfigured()
      .then(async (configured) => {
        if (!configured) return;
        const result = await Purchases.getOfferings();
        if (!cancelled) {
          setOfferings(result);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Mağaza ürünleri şu anda yüklenemedi.");
          setReady(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // React Compiler bu fonksiyonları kendisi memoize eder; elle useCallback sarmalamak
  // derleyicinin mevcut memoizasyonu koruyamamasına ve dosyanın optimizasyon dışı
  // kalmasına yol açıyordu.
  const findPackage = (plan: "monthly" | "annual") => {
    const current = offerings?.current;
    if (!current) return undefined;
    const identifier = plan === "annual" ? "$rc_annual" : "$rc_monthly";
    const packageType = plan === "annual" ? "ANNUAL" : "MONTHLY";
    const byIdentifier = current.availablePackages.find((item) => item.identifier === identifier);
    if (byIdentifier) return byIdentifier;
    return current.availablePackages.find((item) => item.packageType === packageType);
  };

  const purchase = async (plan: "monthly" | "annual") => {
    const selected = findPackage(plan);
    if (!selected) return { ok: false as const, message: "Bu plan için mağaza ürünü henüz yapılandırılmadı." };
    try {
      const result = await Purchases.purchasePackage(selected);
      return { ok: Boolean(result.customerInfo.entitlements.active["ironpulse_pro"]) };
    } catch (purchaseError) {
      if (purchaseError && typeof purchaseError === "object" && "userCancelled" in purchaseError && purchaseError.userCancelled) {
        return { ok: false as const, message: "Satın alma iptal edildi." };
      }
      return { ok: false as const, message: "Satın alma tamamlanamadı. Lütfen tekrar deneyin." };
    }
  };

  const restore = async () => {
    try {
      const result = await Purchases.restorePurchases();
      return Boolean(result.entitlements.active["ironpulse_pro"]);
    } catch {
      return false;
    }
  };

  return { ready, error, monthly: findPackage("monthly")?.product.priceString, annual: findPackage("annual")?.product.priceString, purchase, restore };
}
