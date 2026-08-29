import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { DraggableMetricList, type DashboardMetricCard } from "@/components/draggable-metric-list";
import { Card, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { adaptiveTargets, latestWellness, performanceBadges, recoveryScore } from "@/lib/performance-engine";
import { useFitness } from "@/lib/fitness-store";
import { deloadGuidance } from "@/lib/planning-analytics";
import type { DashboardMetricId } from "@/shared/fitness";

const modules = [
  { route: "/planner", icon: "calendar-month", title: "Akıllı Planlayıcı", copy: "Takvim, kaçan oturumlar ve yeniden planlama", tone: "#7DD3FC" },
  { route: "/monthly-report", icon: "summarize", title: "Aylık Rapor", copy: "Hacim, devamlılık ve beslenme özeti", tone: "#FBBF24" },
  { route: "/transformation", icon: "timeline", title: "Dönüşüm Merkezi", copy: "Ölçüler, hedefler ve gelişim çizelgesi", tone: "#B8FF3D" },
  { route: "/wellness", icon: "bedtime", title: "Toparlanma Günlüğü", copy: "Uyku, protein, su ve günlük hazır oluş", tone: "#60A5FA" },
  { route: "/nutrition", icon: "restaurant", title: "Beslenme Günlüğü", copy: "Makro kaydı ve barkod destekli hızlı giriş", tone: "#F9B371" },
  { route: "/training-setup", icon: "tune", title: "Ekipman ve Partner", copy: "Salon ekipmanı ve partnerli antrenman", tone: "#D28CFF" },
  { route: "/safety-card", icon: "health-and-safety", title: "Güvenlik Kartı", copy: "İsteğe bağlı acil kişi ve antrenman notu", tone: "#FF8765" },
  { route: "/coach-desk", icon: "assignment", title: "Koç Çalışma Alanı", copy: "Görevler, kontrol listeleri ve program takibi", tone: "#F9B371" },
  { route: "/challenges", icon: "emoji-events", title: "Rozetler ve Sezon", copy: "Seriler, kilometre taşları ve meydan okumalar", tone: "#D28CFF" },
  { route: "/form-lab", icon: "videocam", title: "Form Laboratuvarı", copy: "Cihaz içi kamera hizalama rehberi", tone: "#FF8765" },
];

const DEFAULT_METRICS: DashboardMetricId[] = ["readiness", "badges", "weekly-volume", "sessions"];

export default function PerformanceScreen() {
  const router = useRouter();
  const { data, updateDashboardMetricOrder } = useFitness();
  const [editingMetrics, setEditingMetrics] = useState(false);
  const wellness = latestWellness(data.wellness);
  const recovery = recoveryScore(wellness);
  const targets = adaptiveTargets(data.sessions);
  const badges = performanceBadges(data.sessions, data.coachTasks);
  const deload = deloadGuidance(data.sessions, data.wellness);
  // Ekran açıldığı andaki zaman referansı — render sırasında Date.now() çağırmak saf değildir.
  const [now] = useState(() => Date.now());
  const weeklyVolume = data.sessions.filter((session) => session.completedAt && now - new Date(session.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000).flatMap((session) => session.exercises).flatMap((exercise) => exercise.sets).filter((set) => set.completed).reduce((sum, set) => sum + set.weight * set.reps, 0);
  const completedSessions = data.sessions.filter((session) => session.completedAt).length;
  const orderedMetrics = useMemo(() => {
    const metricMap: Record<DashboardMetricId, DashboardMetricCard> = {
      readiness: { id: "readiness", icon: "favorite", label: "Hazır oluş", value: recovery === null ? "—" : `${recovery}%`, detail: wellness ? "Bugünkü günlükten" : "Günlük ekle", tone: "#60A5FA" },
      badges: { id: "badges", icon: "emoji-events", label: "Açılan rozet", value: `${badges.filter((badge) => badge.unlocked).length}/${badges.length}`, detail: "Sezon ilerlemen", tone: "#F97316" },
      "weekly-volume": { id: "weekly-volume", icon: "monitor-weight", label: "7 gün hacim", value: weeklyVolume ? `${Math.round(weeklyVolume / 1000).toLocaleString("tr-TR")}k` : "—", detail: weeklyVolume ? "kg × tekrar" : "Set tamamla", tone: "#B8FF3D" },
      sessions: { id: "sessions", icon: "calendar-today", label: "Tamamlanan", value: String(completedSessions), detail: "Toplam antrenman", tone: "#D28CFF" },
    };
    const saved = data.dashboardMetricOrder?.filter((id) => DEFAULT_METRICS.includes(id)) ?? [];
    return [...saved, ...DEFAULT_METRICS.filter((id) => !saved.includes(id))].map((id) => metricMap[id]);
  }, [badges, completedSessions, data.dashboardMetricOrder, recovery, weeklyVolume, wellness]);
  return <View style={ui.page}><ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false} nestedScrollEnabled>
    <MotionSection><View style={styles.header}><View style={styles.headerCapsule}><MaterialIcons name="insights" size={14} color="#B8FF3D" /><Text style={styles.headerCapsuleText}>PERFORMANS SİSTEMİ</Text></View><Text style={ui.h1}>Planla. Uygula.{`\n`}Geliş.</Text><Text style={[ui.body, styles.intro]}>Antrenman yükünü, toparlanmanı ve hedeflerini aynı ritimde takip et.</Text></View></MotionSection>
    <MotionSection delay={60}><SectionTitle title="Kişisel pano" action={editingMetrics ? "Bitti" : "Düzenle"} onAction={() => setEditingMetrics((value) => !value)} /><Text style={styles.dashboardHint}>{editingMetrics ? "Kartı basılı tutup sürükleyerek sıralamanı kaydet." : "Metriklerin; verine göre güncellenir. İstersen sırasını değiştir."}</Text><DraggableMetricList data={orderedMetrics} editing={editingMetrics} onOrderChange={updateDashboardMetricOrder} /></MotionSection>
    <MotionSection delay={110}><SectionTitle title="Yük ve toparlanma" /><Card accent={deload.level !== "low"}><View style={styles.deloadRow}><View style={[styles.deloadIcon, deload.level === "high" && styles.deloadHigh]}><MaterialIcons name={deload.level === "low" ? "verified" : "health-and-safety"} size={20} color={deload.level === "low" ? "#60A5FA" : "#F9B371"} /></View><View style={{ flex: 1 }}><Text style={styles.deloadTitle}>{deload.title}</Text><Text style={styles.deloadCopy}>{deload.detail}</Text></View></View><View style={styles.signalBar}><View style={[styles.signalFill, { width: deload.level === "high" ? "86%" : deload.level === "medium" ? "58%" : "28%" }]} /></View></Card></MotionSection>
    <MotionSection delay={160}><SectionTitle title="Adaptif sonraki hamle" action="Tümü" onAction={() => router.push("/train" as never)} />{targets.length ? <View style={{ gap: 10 }}>{targets.slice(0, 2).map((target) => <Card key={target.exerciseId} accent><View style={styles.targetRow}><View style={styles.targetIcon}><MaterialIcons name="auto-graph" size={19} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.targetName}>{target.exerciseName}</Text><Text style={styles.targetNote}>{target.note}</Text></View><View style={styles.targetMetric}><Text style={styles.targetValue}>{target.weight}</Text><Text style={styles.targetUnit}>kg × {target.reps}</Text></View></View></Card>)}</View> : <Card><Text style={styles.emptyText}>İlk adaptif hedef için en az bir antrenmanı tamamla.</Text></Card>}</MotionSection>
    <MotionSection delay={220}><SectionTitle title="Sporcu araçları" /><View style={{ gap: 10 }}>{modules.map((module) => <TouchableOpacity key={module.route} onPress={() => router.push(module.route as never)} style={styles.module}><View style={[styles.moduleIcon, { backgroundColor: `${module.tone}20` }]}><MaterialIcons name={module.icon as never} size={22} color={module.tone} /></View><View style={{ flex: 1 }}><Text style={styles.moduleTitle}>{module.title}</Text><Text style={styles.moduleCopy}>{module.copy}</Text></View><View style={styles.moduleArrow}><MaterialIcons name="arrow-forward" size={17} color="#D7DEE8" /></View></TouchableOpacity>)}</View></MotionSection>
  </ScrollView></View>;
}

const styles = StyleSheet.create({ header: { paddingTop: 14 }, headerCapsule: { alignSelf: "flex-start", flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 99, backgroundColor: "#1B2A17", marginBottom: 11 }, headerCapsuleText: { color: "#B8FF3D", fontSize: 9, letterSpacing: 1, fontWeight: "900" }, intro: { marginTop: 10, maxWidth: 310 }, dashboardHint: { color: "#9AA6B5", fontSize: 11, lineHeight: 17, marginTop: -6, marginBottom: 10 }, deloadRow: { flexDirection: "row", gap: 11, alignItems: "center" }, deloadIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#162231", alignItems: "center", justifyContent: "center" }, deloadHigh: { backgroundColor: "#2B2113" }, deloadTitle: { color: "#F8FAFC", fontSize: 14, fontWeight: "900" }, deloadCopy: { color: "#9AA6B5", fontSize: 11, lineHeight: 17, marginTop: 4 }, signalBar: { height: 4, borderRadius: 4, backgroundColor: "#263141", marginTop: 15, overflow: "hidden" }, signalFill: { height: "100%", borderRadius: 4, backgroundColor: "#B8FF3D" }, targetRow: { flexDirection: "row", alignItems: "center", gap: 11 }, targetIcon: { width: 41, height: 41, borderRadius: 14, backgroundColor: "#273116", alignItems: "center", justifyContent: "center" }, targetName: { color: "#F8FAFC", fontSize: 14, fontWeight: "900" }, targetNote: { color: "#9AA6B5", fontSize: 11, lineHeight: 16, marginTop: 3 }, targetMetric: { alignItems: "flex-end" }, targetValue: { color: "#B8FF3D", textAlign: "right", fontWeight: "900", fontSize: 21, letterSpacing: -0.5 }, targetUnit: { color: "#D7DEE8", fontSize: 10, fontWeight: "700", marginTop: 2 }, emptyText: { color: "#9AA6B5", fontSize: 13, textAlign: "center", paddingVertical: 6 }, module: { minHeight: 78, padding: 14, gap: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#141A22", borderColor: "#2B3748", borderWidth: 1, borderRadius: 21 }, moduleIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" }, moduleTitle: { color: "#F8FAFC", fontSize: 14, fontWeight: "900" }, moduleCopy: { color: "#9AA6B5", fontSize: 11, marginTop: 3, lineHeight: 16 }, moduleArrow: { width: 29, height: 29, borderRadius: 10, backgroundColor: "#1B2430", alignItems: "center", justifyContent: "center" } });
