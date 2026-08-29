export function useRevenueCat() {
  // Web'de mağaza SDK'sı yok; yüklenecek veri olmadığı için hazır durumu sabittir.
  const purchase = async () => ({
    ok: false as const,
    message: "Mağaza satın alımları gerçek iOS veya Android derlemesinde kullanılabilir.",
  });
  const restore = async () => false;
  return { ready: true, error: undefined, monthly: undefined, annual: undefined, purchase, restore };
}
