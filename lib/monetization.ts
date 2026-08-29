export type MonetizationEvent = "app-open" | "workout-complete" | "manual-premium";

export type MonetizationState = {
  appOpenedAt?: string;
  lastAdAt?: string;
  adCount: number;
  lastPaywallAt?: string;
  premiumStatus: "free" | "trial" | "active" | "expired";
  trialStartedAt?: string;
  selectedPlan?: "monthly" | "annual";
};

export type AdDecision = {
  show: boolean;
  reason: "first-minute" | "workout-active" | "cooldown" | "not-completion" | "eligible";
};

export const AD_FIRST_MINUTE_MS = 60_000;
export const AD_COOLDOWN_MS = 210_000;

export function adDecisionFor(
  state: MonetizationState,
  event: MonetizationEvent,
  now = Date.now(),
  workoutActive = false,
): AdDecision {
  if (state.premiumStatus === "trial" || state.premiumStatus === "active") return { show: false, reason: "cooldown" };
  if (workoutActive) return { show: false, reason: "workout-active" };
  if (event !== "workout-complete" && event !== "app-open") return { show: false, reason: "not-completion" };
  const openedAt = state.appOpenedAt ? new Date(state.appOpenedAt).getTime() : now;
  if (now - openedAt < AD_FIRST_MINUTE_MS) return { show: false, reason: "first-minute" };
  if (state.lastAdAt && now - new Date(state.lastAdAt).getTime() < AD_COOLDOWN_MS) return { show: false, reason: "cooldown" };
  return { show: true, reason: "eligible" };
}

export function shouldShowPaywallAfterAd(adCount: number) {
  return adCount > 0 && (adCount === 1 || adCount % 4 === 0);
}

export function paywallCopyFor(plan: "monthly" | "annual") {
  return plan === "annual"
    ? "Yıllık plan seçildiğinde deneme sonunda otomatik yenilenir; ücret ve yenileme tarihi satın alma ekranında açıkça gösterilir. İstediğin zaman mağaza ayarlarından iptal edebilirsin."
    : "Aylık plan deneme sonunda aylık olarak yenilenir; ücret ve yenileme tarihi satın alma ekranında açıkça gösterilir. İstediğin zaman mağaza ayarlarından iptal edebilirsin.";
}

export function recordAdShown(state: MonetizationState, now = new Date().toISOString()): MonetizationState {
  return { ...state, lastAdAt: now, adCount: state.adCount + 1 };
}

export function startTrial(state: MonetizationState, plan: "monthly" | "annual", now = new Date().toISOString()): MonetizationState {
  return { ...state, premiumStatus: "trial", selectedPlan: plan, trialStartedAt: now };
}
