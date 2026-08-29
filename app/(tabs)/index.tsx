import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, MetricCard, PrimaryButton, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { totalVolume, trainingConsistency, workoutVolume } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";

function formatDate(value?: string) {
  if (!value) return "Henüz antrenman yok";
  return new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(value));
}

export default function TodayScreen() {
  const router = useRouter();
  const { data, startWorkout, activeSession } = useFitness();
  const completed = data.sessions.filter((session) => session.completedAt);
  const lastSession = completed.at(-1);
  // Ekran açıldığı andaki zaman referansı — render sırasında Date.now() çağırmak saf değildir.
  const [now] = useState(() => Date.now());
  const sessionsThisWeek = completed.filter((session) => now - new Date(session.completedAt!).getTime() < 7 * 24 * 60 * 60 * 1000);
  const volumeThisWeek = totalVolume(sessionsThisWeek);
  const consistency = trainingConsistency(completed);
  const focus = data.transformationGoal.focus ?? "Düzenli başlangıç";
  const coachPurpose = focus === "Yağ kaybı" ? "Bugün sürdürülebilir tempo ve set kalitesine odaklan; mükemmel değil, tutarlı ol." : focus === "Kas kazanımı" ? "Bugün kontrollü tekrar ve düzenli set kaydıyla kas gelişimini destekle." : focus === "Güç" ? "Bugün tekniği koruyarak ölçülü progresif yüklenmeye odaklan." : focus === "Performans" ? "Bugün kondisyonunu ve hareket ekonomini geliştirecek dengeli bir tempo seç." : "Bugün ilk küçük adımı at; gerçek verin sonraki önerileri daha iyi yapar.";

  const beginWorkout = () => {
    const id = startWorkout();
    router.push(`/workout/${id}` as never);
  };

  return <View style={ui.page}><ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false}>
    <MotionSection><View style={styles.header}><View><Text style={styles.dayLabel}>{new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</Text><Text style={ui.h1}>Gücünü inşa et.</Text></View><TouchableOpacity accessibilityLabel="Profil ayarları" onPress={() => router.push("/profile" as never)} style={styles.profileBubble}><MaterialIcons name="person-outline" size={22} color="#F5F7FA" /></TouchableOpacity></View></MotionSection>

    <MotionSection delay={60}>{activeSession ? <Card accent><View style={styles.row}><View style={styles.liveDot} /><Text style={styles.liveText}>CANLI OTURUM</Text><Text style={styles.resumeText}>Devam etmeye hazır</Text></View><Text style={styles.activeTitle}>{activeSession.name}</Text><Text style={ui.body}>{activeSession.exercises.length} egzersiz · {activeSession.exercises.reduce((count, exercise) => count + exercise.sets.filter((set) => set.completed).length, 0)} set tamamlandı</Text><View style={{ marginTop: 18 }}><PrimaryButton label="Antrenmana Dön" icon="play-arrow" onPress={() => router.push(`/workout/${activeSession.id}` as never)} /></View></Card> : <View style={styles.heroShell}><View style={styles.heroGlow} /><Card accent><View style={styles.heroTop}><Text style={ui.eyebrow}>Bugünün odağı</Text><View style={styles.heroGlyph}><MaterialIcons name="bolt" size={19} color="#10150B" /></View></View><Text style={styles.heroTitle}>{data.templates.length ? "Planın hazır." : "İlk kaydını oluştur."}</Text><Text style={ui.body}>{data.templates.length ? "Planını seç veya serbest antrenmanla başla. Her set, gelecekteki hedeflerini daha akıllı yapar." : "Ağırlık, tekrar ve setlerini kaydet; IronPulse ilerlemeni yalnızca gerçek verinle hesaplar."}</Text><View style={{ marginTop: 19 }}><PrimaryButton label="Antrenmanı Başlat" icon="fitness-center" onPress={beginWorkout} /></View></Card></View>}</MotionSection>

    <MotionSection delay={120}><SectionTitle title="Bu hafta" /><View style={styles.metrics}><MetricCard icon="event-available" label="Antrenman" value={`${sessionsThisWeek.length}`} detail={sessionsThisWeek.length ? "Tamamlanan kayıt" : "İlk antrenmanını başlat"} /><MetricCard icon="monitor-weight" label="Hacim" value={volumeThisWeek ? `${Math.round(volumeThisWeek).toLocaleString("tr-TR")}` : "—"} detail={volumeThisWeek ? `${data.settings.unit} × tekrar` : "Kayıt bekleniyor"} tone="blue" /></View><View style={styles.achievement}><View style={styles.achievementIcon}><MaterialIcons name="local-fire-department" size={22} color="#10150B" /></View><View style={{ flex: 1 }}><Text style={styles.achievementEyebrow}>BAŞARI SAYACI</Text><Text style={styles.achievementTitle}>{consistency.streakDays ? `${consistency.streakDays} gün devam serisi` : "Serini başlatmaya hazır"}</Text><Text style={styles.achievementCopy}>{consistency.activeDays ? `Toplam ${consistency.activeDays} aktif antrenman günü kaydettin.` : "İlk tamamlanan antrenmanınla gün sayacın başlayacak."}</Text></View><View style={styles.achievementNumber}><Text style={styles.achievementNumberValue}>{consistency.activeDays}</Text><Text style={styles.achievementNumberLabel}>GÜN</Text></View></View></MotionSection>

    <MotionSection delay={150}><TouchableOpacity accessibilityRole="button" onPress={() => router.push("/coach" as never)} style={styles.coachCard}><View style={styles.coachIcon}><MaterialIcons name="auto-awesome" size={19} color="#10150B" /></View><View style={{ flex: 1 }}><Text style={styles.coachEyebrow}>BUGÜNÜN KOÇU · AMACIN</Text><Text style={styles.coachTitle}>{focus}</Text><Text style={styles.coachCopy}>{coachPurpose}</Text></View><MaterialIcons name="chevron-right" size={22} color="#B8FF3D" /></TouchableOpacity></MotionSection>

    <MotionSection delay={180}><SectionTitle title="Son aktivite" action={completed.length ? "Tümünü Gör" : undefined} onAction={() => router.push("/progress" as never)} />{lastSession ? <Pressable onPress={() => router.push(`/workout/${lastSession.id}` as never)} style={({ pressed }) => [styles.historyCard, pressed && styles.pressed]}><View style={styles.historyIcon}><MaterialIcons name="check" size={20} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.historyTitle}>{lastSession.name}</Text><Text style={styles.historyCopy}>{formatDate(lastSession.completedAt)} · {Math.round(workoutVolume(lastSession)).toLocaleString("tr-TR")} hacim</Text></View><MaterialIcons name="chevron-right" size={22} color="#788596" /></Pressable> : <EmptyState icon="history" title="Henüz aktivite yok" copy="İlk tamamlanan antrenmanın burada yer alacak." action="Serbest antrenman başlat" onAction={beginWorkout} />}</MotionSection>

    <MotionSection delay={240}><SectionTitle title="Hızlı erişim" /><View style={styles.quickRow}><TouchableOpacity onPress={() => router.push("/train" as never)} style={styles.quickCard}><View style={[styles.quickIcon, { backgroundColor: "#17263A" }]}><MaterialIcons name="dashboard-customize" size={20} color="#60A5FA" /></View><Text style={styles.quickText}>Planlarım</Text><Text style={styles.quickCopy}>Şablonlarını düzenle</Text></TouchableOpacity><TouchableOpacity onPress={() => router.push("/progress" as never)} style={styles.quickCard}><View style={[styles.quickIcon, { backgroundColor: "#2B2113" }]}><MaterialIcons name="query-stats" size={20} color="#F97316" /></View><Text style={styles.quickText}>İlerleme</Text><Text style={styles.quickCopy}>Metriklerini incele</Text></TouchableOpacity></View><TouchableOpacity onPress={() => router.push("/paywall" as never)} style={styles.premiumCard}><View style={styles.premiumIcon}><MaterialIcons name="bolt" size={19} color="#10150B" /></View><View style={{ flex: 1 }}><Text style={styles.premiumEyebrow}>IRONPULSE PREMIUM</Text><Text style={styles.premiumTitle}>Antrenmanını bölmeden devam et</Text><Text style={styles.premiumCopy}>Reklamsız deneyim ve gelişmiş ilerleme içgörüleri.</Text></View><MaterialIcons name="chevron-right" size={22} color="#B8FF3D" /></TouchableOpacity></MotionSection>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: 14, marginBottom: 28, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, dayLabel: { color: "#9AA6B5", fontSize: 12, fontWeight: "800", textTransform: "capitalize" },
  profileBubble: { width: 46, height: 46, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748" },
  row: { flexDirection: "row", alignItems: "center", gap: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#B8FF3D" },
  liveText: { color: "#B8FF3D", fontSize: 10, fontWeight: "900", letterSpacing: 1.2 }, resumeText: { color: "#9AA6B5", fontSize: 10, marginLeft: "auto", fontWeight: "700" },
  activeTitle: { color: "#F8FAFC", fontSize: 25, fontWeight: "900", letterSpacing: -0.6, marginTop: 11, marginBottom: 6 }, heroShell: { marginHorizontal: -2 }, heroGlow: { position: "absolute", width: 170, height: 170, borderRadius: 100, backgroundColor: "#B8FF3D0D", right: -16, top: -30 }, heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, heroGlyph: { width: 35, height: 35, borderRadius: 12, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center" },
  heroTitle: { color: "#F8FAFC", fontSize: 27, fontWeight: "900", letterSpacing: -0.8, marginTop: 16, marginBottom: 8 },
  metrics: { flexDirection: "row", justifyContent: "space-between" },
  achievement: { marginTop: 12, padding: 14, borderRadius: 19, backgroundColor: "#241E13", borderWidth: 1, borderColor: "#634F1E", flexDirection: "row", alignItems: "center", gap: 10 }, achievementIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFD166" }, achievementEyebrow: { color: "#F6D782", fontSize: 9, letterSpacing: 0.7, fontWeight: "900" }, achievementTitle: { color: "#FFF3C5", fontSize: 14, fontWeight: "900", marginTop: 2 }, achievementCopy: { color: "#D9CBA1", fontSize: 10, lineHeight: 15, marginTop: 3 }, achievementNumber: { alignItems: "center", minWidth: 36 }, achievementNumberValue: { color: "#FFD166", fontSize: 22, lineHeight: 25, fontWeight: "900" }, achievementNumberLabel: { color: "#D9CBA1", fontSize: 8, fontWeight: "900", letterSpacing: 0.7 },
  coachCard: { marginTop: 16, padding: 14, borderRadius: 19, backgroundColor: "#171B2A", borderWidth: 1, borderColor: "#49577B", flexDirection: "row", gap: 10, alignItems: "center" }, coachIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center" }, coachEyebrow: { color: "#AABEF0", fontSize: 9, fontWeight: "900", letterSpacing: 0.65 }, coachTitle: { color: "#F2F5FF", fontSize: 14, fontWeight: "900", marginTop: 2 }, coachCopy: { color: "#B5C0DD", fontSize: 10, lineHeight: 15, marginTop: 3 },
  historyCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#141A22", borderColor: "#2B3748", borderWidth: 1, borderRadius: 22, padding: 15 },
  historyIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2A17" },
  historyTitle: { color: "#F5F7FA", fontWeight: "800", fontSize: 15 },
  historyCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 4 },
  quickRow: { flexDirection: "row", gap: 12 },
  quickCard: { flex: 1, minHeight: 126, borderRadius: 22, borderWidth: 1, borderColor: "#2B3748", backgroundColor: "#141A22", padding: 15, justifyContent: "space-between" }, quickIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  premiumCard: { marginTop: 12, flexDirection: "row", gap: 11, alignItems: "center", padding: 14, borderRadius: 19, backgroundColor: "#1B2A17", borderWidth: 1, borderColor: "#526D24" }, premiumIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center" }, premiumEyebrow: { color: "#B8FF3D", fontSize: 9, fontWeight: "900", letterSpacing: 0.7 }, premiumTitle: { color: "#F5F7FA", fontSize: 13, fontWeight: "900", marginTop: 2 }, premiumCopy: { color: "#B5C59F", fontSize: 10, lineHeight: 15, marginTop: 3 },
  quickText: { color: "#F8FAFC", fontWeight: "900", fontSize: 15, marginTop: 10 }, quickCopy: { color: "#9AA6B5", fontSize: 10, marginTop: 4 },
  pressed: { opacity: 0.72 },
});
