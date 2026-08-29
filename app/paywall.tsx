import { useEffect, useState } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { PrimaryButton, ui } from "@/components/fitness-ui";
import { useFitness } from "@/lib/fitness-store";
import { useRevenueCat } from "@/lib/revenuecat";
import { paywallCopyFor } from "@/lib/monetization";
import type { PremiumPlan } from "@/shared/fitness";

const BENEFITS = [
  { icon: "block", title: "Antrenmana odaklan", copy: "Premium ile üçüncü taraf reklamlar gösterilmez." },
  { icon: "query-stats", title: "İlerlemeni daha net gör", copy: "Gelişmiş trendler, plan içgörüleri ve hedef takibi." },
  { icon: "video-library", title: "Rehberlerini sakla", copy: "Favori eğitim videolarına daha hızlı eriş." },
] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { setPremiumStatus } = useFitness();
  const { annual, monthly, error: storeError, purchase, restore } = useRevenueCat();
  const [plan, setPlan] = useState<PremiumPlan>("annual");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  // React Compiler render sırasında ref okumayı uyarır; lazy useState aynı kalıcılığı sağlar.
  const [progress] = useState(() => new Animated.Value(0.18));

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(progress, { toValue: 0.18, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const start = async () => {
    setBusy(true);
    setStatusMessage(undefined);
    const result = await purchase(plan);
    setBusy(false);
    if (result.ok) {
      setPremiumStatus("active");
      setSubmitted(true);
      setStatusMessage("Premium erişimin etkinleştirildi.");
    } else {
      setStatusMessage(result.message);
    }
  };

  const restoreAccess = async () => {
    setBusy(true);
    const restored = await restore();
    setBusy(false);
    if (restored) {
      setPremiumStatus("active");
      setStatusMessage("Satın alımın geri yüklendi.");
    } else {
      setStatusMessage("Bu cihazda geri yüklenecek aktif bir satın alım bulunamadı.");
    }
  };

  return <View style={ui.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <TouchableOpacity accessibilityLabel="Ödeme duvarını kapat" onPress={() => router.back()} style={styles.close}><MaterialIcons name="close" size={21} color="#C8D1DE" /></TouchableOpacity>
    <View style={styles.hero}><View style={styles.orbit}><MaterialIcons name="bolt" size={29} color="#10150B" /></View><Text style={ui.eyebrow}>IRONPULSE PREMIUM</Text><Text style={styles.title}>Ritmini koru.{"\n"}<Text style={styles.titleAccent}>İlerlemeni büyüt.</Text></Text><Text style={styles.subtitle}>Antrenmanın bölünmesin; reklamları kaldır, planını ve gerçek ilerlemeni tek yerde takip et.</Text></View>
    <View style={styles.meter}><View style={styles.meterHead}><Text style={styles.meterLabel}>İLERLEME ODAĞI</Text><Text style={styles.meterValue}>Küçük adımlar · gerçek kayıt</Text></View><View style={styles.track}><Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["18%", "92%"] }) }]} /></View><Text style={styles.meterCopy}>Bugün yapabileceğin tek bir adım seç. Devamlılık, mükemmellikten daha değerlidir.</Text></View>
    <PrimaryButton label={busy ? "Mağaza hazırlanıyor…" : submitted ? "Premium erişimin etkin" : "1 hafta ücretsiz dene"} icon={submitted ? "check" : "auto-awesome"} onPress={start} />
    {storeError || statusMessage ? <Text style={styles.statusMessage}>{statusMessage ?? storeError}</Text> : null}
    <Text style={styles.disclosure}>Deneme sonunda seçtiğin plan, satın alma ekranında gösterilen fiyat üzerinden otomatik yenilenir. Deneme bitmeden mağaza abonelik ayarlarından iptal edebilirsin. Satın alma için açık onay gerekir; seçim bu ekranda otomatik olarak tamamlanmaz.</Text>
    <View style={styles.planRow}>{(["annual", "monthly"] as PremiumPlan[]).map((item) => <TouchableOpacity key={item} accessibilityRole="radio" accessibilityState={{ selected: plan === item }} onPress={() => setPlan(item)} style={[styles.planCard, plan === item && styles.planCardSelected]}><View style={styles.planTop}><View style={[styles.radio, plan === item && styles.radioSelected]}>{plan === item ? <View style={styles.radioDot} /> : null}</View><Text style={styles.planName}>{item === "annual" ? "Yıllık" : "Aylık"}</Text>{item === "annual" ? <Text style={styles.save}>DAHA AVANTAJLI</Text> : null}</View><Text style={styles.price}>{item === "annual" ? annual ?? "Mağaza yapılandırması bekleniyor" : monthly ?? "Mağaza yapılandırması bekleniyor"}</Text><Text style={styles.planHint}>{item === "annual" ? "Yıllık yenileme" : "Aylık yenileme"}</Text></TouchableOpacity>)}</View>
    <Text style={styles.selectedCopy}>{paywallCopyFor(plan)}</Text>
    <View style={styles.benefits}>{BENEFITS.map((benefit) => <View key={benefit.title} style={styles.benefit}><View style={styles.benefitIcon}><MaterialIcons name={benefit.icon as never} size={19} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.benefitTitle}>{benefit.title}</Text><Text style={styles.benefitCopy}>{benefit.copy}</Text></View></View>)}</View>
    <View style={styles.links}><TouchableOpacity onPress={() => router.push("/legal/privacy" as never)}><Text style={styles.link}>Gizlilik Politikası</Text></TouchableOpacity><TouchableOpacity onPress={() => router.push("/legal/terms" as never)}><Text style={styles.link}>Kullanım Koşulları / EULA</Text></TouchableOpacity><TouchableOpacity onPress={restoreAccess}><Text style={styles.link}>Satın alımları geri yükle</Text></TouchableOpacity></View>
    <Text style={styles.footer}>Abonelikler App Store veya Google Play hesabın üzerinden yönetilir. Fiyat, vergi, deneme ve yenileme koşulları satın alma onayından önce ilgili mağazada gösterilir. IronPulse sağlık veya diyetisyen hizmeti değildir.</Text>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 }, close: { alignSelf: "flex-end", width: 42, height: 42, borderRadius: 14, backgroundColor: "#141A22", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2B3748" }, hero: { alignItems: "center", paddingTop: 12, paddingBottom: 22 }, orbit: { width: 66, height: 66, borderRadius: 33, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#B8FF3D", shadowOpacity: 0.32, shadowRadius: 18, elevation: 6 }, title: { textAlign: "center", color: "#F8FAFC", fontSize: 34, lineHeight: 38, fontWeight: "900", letterSpacing: -1.2, marginTop: 12 }, titleAccent: { color: "#B8FF3D" }, subtitle: { color: "#AEB9C8", textAlign: "center", fontSize: 13, lineHeight: 20, maxWidth: 360, marginTop: 12 }, meter: { borderRadius: 20, borderWidth: 1, borderColor: "#475A2B", backgroundColor: "#172013", padding: 15, marginBottom: 16 }, meterHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, meterLabel: { color: "#B8FF3D", fontWeight: "900", fontSize: 10, letterSpacing: 0.8 }, meterValue: { color: "#B5C59F", fontSize: 10, fontWeight: "700" }, track: { height: 8, borderRadius: 4, backgroundColor: "#2B3825", overflow: "hidden", marginTop: 13 }, fill: { height: "100%", borderRadius: 4, backgroundColor: "#B8FF3D" }, meterCopy: { color: "#D2E0C4", fontSize: 11, lineHeight: 16, marginTop: 9 },   statusMessage: { color: "#B8FF3D", fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 10 }, disclosure: { color: "#8996A7", fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 11 }, planRow: { flexDirection: "row", gap: 10, marginTop: 18 }, planCard: { flex: 1, minHeight: 116, borderRadius: 18, borderWidth: 1, borderColor: "#2B3748", backgroundColor: "#141A22", padding: 13 }, planCardSelected: { borderColor: "#B8FF3D", backgroundColor: "#1B2A17" }, planTop: { flexDirection: "row", alignItems: "center", gap: 7 }, radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1, borderColor: "#687689", alignItems: "center", justifyContent: "center" }, radioSelected: { borderColor: "#B8FF3D" }, radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#B8FF3D" }, planName: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, save: { color: "#10150B", backgroundColor: "#B8FF3D", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 3, fontSize: 7, fontWeight: "900", marginLeft: "auto" }, price: { color: "#B8FF3D", fontSize: 16, fontWeight: "900", marginTop: 16 }, planHint: { color: "#A3AFBE", fontSize: 10, marginTop: 3 }, selectedCopy: { color: "#9AA6B5", fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 10 }, benefits: { gap: 9, marginTop: 20 }, benefit: { flexDirection: "row", gap: 11, alignItems: "center", padding: 12, borderRadius: 16, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748" }, benefitIcon: { width: 37, height: 37, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2A17" }, benefitTitle: { color: "#F4F7FA", fontSize: 13, fontWeight: "900" }, benefitCopy: { color: "#9AA6B5", fontSize: 10, lineHeight: 15, marginTop: 3 }, links: { alignItems: "center", gap: 10, marginTop: 24 }, link: { color: "#B8FF3D", fontSize: 12, fontWeight: "800" }, footer: { color: "#728094", fontSize: 9, lineHeight: 14, textAlign: "center", marginTop: 21 },
});
