import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MotionSection } from "@/components/motion-section";

const ONBOARDING_KEY = "ironpulse.onboarding.completed.v1";
const ONBOARDING_GOAL_KEY = "ironpulse.onboarding.goal.v1";

type Goal = "Güç" | "Kas kazanımı" | "Yağ kaybı" | "Performans";

const slides = [
  { eyebrow: "IRONPULSE / 01", title: "Antrenmanın.\nSinyalin.", copy: "Setlerini, yükünü ve toparlanmanı tek bir yerel-öncelikli akışta kaydet.", icon: "bolt", stat: "HER SET BİR VERİ NOKTASI", color: "#B8FF3D" },
  { eyebrow: "HAREKETİNİ OKU / 02", title: "İlerlemeni\ngörünür kıl.", copy: "PR, e1RM, hacim ve kas dağılımını gün gün karşılaştır; bir sonraki iyi kararı ver.", icon: "insights", stat: "SÜRDÜRÜLEBİLİR İLERLEME", color: "#60A5FA" },
  { eyebrow: "ANATOMİ / 03", title: "Hedef kasa\ndoğrudan git.", copy: "Gerçek 3D kas katmanlarını döndür, bölgeye dokun ve uygun hareketleri keşfet.", icon: "accessibility-new", stat: "ETKİLEŞİMLİ KAS ATLASI", color: "#F97316" },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("Kas kazanımı");
  const isGoalStep = step === slides.length;
  const current = useMemo(() => slides[step], [step]);

  const finish = async () => {
    await AsyncStorage.multiSet([[ONBOARDING_KEY, "true"], [ONBOARDING_GOAL_KEY, goal]]);
    router.replace("/(tabs)");
  };

  return <View style={styles.page}><View style={styles.topLine}><Text style={styles.wordmark}>IRONPULSE</Text><View style={styles.progress}>{[0, 1, 2, 3].map((item) => <View key={item} style={[styles.progressDot, item <= step && styles.progressDotActive]} />)}</View><Text style={styles.count}>{String(step + 1).padStart(2, "0")} / 04</Text></View>{isGoalStep ? <MotionSection delay={20}><View style={styles.body}><Text style={styles.eyebrow}>KİŞİSELLEŞTİR / 04</Text><Text style={styles.title}>Bugün ne için{`\n`}çalışıyorsun?</Text><Text style={styles.copy}>Bunu daha sonra profilinden değiştirebilirsin. Seçimin önerileri ve ana ekrandaki odağı belirler.</Text><View style={styles.goalGrid}>{(["Güç", "Kas kazanımı", "Yağ kaybı", "Performans"] as Goal[]).map((item) => <Pressable key={item} onPress={() => setGoal(item)} style={[styles.goalCard, goal === item && styles.goalCardActive]}><MaterialIcons name={item === "Güç" ? "fitness-center" : item === "Kas kazanımı" ? "trending-up" : item === "Yağ kaybı" ? "local-fire-department" : "bolt"} size={21} color={goal === item ? "#10150B" : "#B8FF3D"} /><Text style={[styles.goalText, goal === item && styles.goalTextActive]}>{item}</Text></Pressable>)}</View></View></MotionSection> : <MotionSection delay={20}><View style={styles.body}><Text style={styles.eyebrow}>{current.eyebrow}</Text><View style={[styles.orbit, { borderColor: current.color }]}><View style={[styles.orbitCore, { backgroundColor: current.color }]}><MaterialIcons name={current.icon} size={50} color="#10150B" /></View><View style={[styles.orbitMark, { backgroundColor: current.color }]} /></View><Text style={styles.title}>{current.title}</Text><Text style={styles.copy}>{current.copy}</Text><View style={styles.stat}><View style={[styles.statDot, { backgroundColor: current.color }]} /><Text style={styles.statText}>{current.stat}</Text></View></View></MotionSection>}<View style={styles.bottom}>{step > 0 ? <Pressable style={styles.secondary} onPress={() => setStep((value) => value - 1)}><Text style={styles.secondaryText}>Geri</Text></Pressable> : <View />}{isGoalStep ? <Pressable style={styles.primary} onPress={finish}><Text style={styles.primaryText}>IronPulse’a başla</Text><MaterialIcons name="arrow-forward" size={19} color="#10150B" /></Pressable> : <Pressable style={styles.primary} onPress={() => setStep((value) => value + 1)}><Text style={styles.primaryText}>Devam</Text><MaterialIcons name="arrow-forward" size={19} color="#10150B" /></Pressable>}</View><Text style={styles.privacy}><MaterialIcons name="lock-outline" size={12} color="#7D8A99" /> Verilerin varsayılan olarak bu cihazda kalır.</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E12", padding: 24, justifyContent: "space-between" }, topLine: { paddingTop: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, wordmark: { color: "#F5F7FA", fontSize: 12, fontWeight: "900", letterSpacing: 2 }, count: { color: "#7D8A99", fontSize: 10, fontWeight: "900", letterSpacing: 1 }, progress: { flexDirection: "row", gap: 5 }, progressDot: { width: 19, height: 3, borderRadius: 3, backgroundColor: "#263141" }, progressDotActive: { backgroundColor: "#B8FF3D" },
  body: { flex: 1, justifyContent: "center", paddingBottom: 24 }, eyebrow: { color: "#B8FF3D", fontSize: 10, fontWeight: "900", letterSpacing: 1.25 }, orbit: { width: 166, height: 166, marginTop: 29, marginBottom: 30, borderRadius: 83, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#121A22" }, orbitCore: { width: 86, height: 86, borderRadius: 43, alignItems: "center", justifyContent: "center" }, orbitMark: { position: "absolute", width: 10, height: 10, borderRadius: 5, top: 8, right: 25 }, title: { color: "#F5F7FA", fontSize: 38, lineHeight: 43, fontWeight: "900", letterSpacing: -1.2 }, copy: { color: "#AAB4C0", marginTop: 17, fontSize: 15, lineHeight: 23, maxWidth: 340 }, stat: { marginTop: 26, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: "#151E27" }, statDot: { width: 7, height: 7, borderRadius: 4 }, statText: { color: "#C8D1DB", fontSize: 10, fontWeight: "900", letterSpacing: 0.4 },
  goalGrid: { gap: 10, marginTop: 28 }, goalCard: { minHeight: 58, borderRadius: 17, borderWidth: 1, borderColor: "#344154", backgroundColor: "#141A22", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 11 }, goalCardActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, goalText: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, goalTextActive: { color: "#10150B" },
  bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }, primary: { minHeight: 52, paddingHorizontal: 17, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 8, flexDirection: "row", backgroundColor: "#B8FF3D" }, primaryText: { color: "#10150B", fontSize: 13, fontWeight: "900" }, secondary: { minHeight: 48, paddingHorizontal: 10, justifyContent: "center" }, secondaryText: { color: "#AAB4C0", fontSize: 13, fontWeight: "800" }, privacy: { color: "#7D8A99", alignSelf: "center", flexDirection: "row", fontSize: 10, lineHeight: 16 },
});
