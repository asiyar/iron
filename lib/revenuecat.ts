
export function useRevenueCat() {
  // Bu uyarlamada yüklenecek mağaza verisi yok; hazır durumu sabittir.
  const purchase = async (_plan: "monthly" | "annual") => ({
    ok: false as const,
    message: "Mağaza satın alımları iOS veya Android derlemesinde kullanılabilir.",
  });
  const restore = async () => false;
  return { ready: true, error: undefined, monthly: undefined, annual: undefined, purchase, restore };
}
