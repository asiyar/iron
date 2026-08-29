import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { BarChart, LineChart } from "@/components/charts";
import { Card, EmptyState, MetricCard, SectionTitle, ui } from "@/components/fitness-ui";
import { bodyWeightChange, muscleVolume, personalRecords, progressionHint, totalVolume, workoutVolume } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(value));
}

export default function ProgressScreen() {
  const router = useRouter();
  const { data, addBodyWeight } = useFitness();
  const [weight, setWeight] = useState("");
  const [section, setSection] = useState<"özet" | "kaslar">("özet");
  const completed = useMemo(() => data.sessions.filter((session) => session.completedAt), [data.sessions]);
  const records = personalRecords(completed);
  const volumes = useMemo(() => completed.slice(-7).map((session) => ({ label: dateLabel(session.completedAt!), value: Math.round(workoutVolume(session)) })), [completed]);
  const weights = useMemo(() => [...data.bodyWeights].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)), [data.bodyWeights]);
  const weightPoints = weights.slice(-7).map((entry) => ({ label: dateLabel(entry.recordedAt), value: entry.weight }));
  const musclePoints = muscleVolume(completed).sort((a, b) => b.volume - a.volume);
  const latestWeight = weights.at(-1);
  const change = bodyWeightChange(weights);
  const allSets = completed.flatMap((session) => session.exercises.flatMap((entry) => entry.sets.filter((set) => set.completed)));
  const firstTrackedExercise = completed.flatMap((session) => session.exercises).find((entry) => entry.sets.some((set) => set.completed));
  const hint = firstTrackedExercise ? progressionHint(completed, firstTrackedExercise.exerciseId, data.settings.unit) : "Kişiselleştirilmiş öneri için ilk antrenmanını tamamla.";
  const saveWeight = () => { const value = Number(weight.replace(",", ".")); if (Number.isFinite(value) && value > 0) { addBodyWeight(value); setWeight(""); } };

  return <View style={ui.page}><ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
    <View style={styles.header}><View style={styles.headRow}><View><Text style={ui.eyebrow}>İlerleme</Text><Text style={ui.h1}>Verin konuşsun.</Text></View><TouchableOpacity onPress={() => router.push("/coach")} style={styles.coachShortcut}><MaterialIcons name="auto-awesome" size={17} color="#10150B" /><Text style={styles.coachShortcutText}>Koç</Text></TouchableOpacity></View><Text style={[ui.body, { marginTop: 8 }]}>Tüm metrikler yalnızca tamamladığın antrenmanlardan hesaplanır.</Text></View>
    <View style={styles.segment}><TouchableOpacity onPress={() => setSection("özet")} style={[styles.segmentItem, section === "özet" && styles.segmentActive]}><Text style={[styles.segmentText, section === "özet" && styles.segmentTextActive]}>Özet</Text></TouchableOpacity><TouchableOpacity onPress={() => setSection("kaslar")} style={[styles.segmentItem, section === "kaslar" && styles.segmentActive]}><Text style={[styles.segmentText, section === "kaslar" && styles.segmentTextActive]}>Kas Analizi</Text></TouchableOpacity></View>
    {section === "özet" ? <>
      <View style={styles.metrics}><MetricCard icon="emoji-events" label="Kişisel rekor" value={records.length ? `${records.length}` : "—"} detail={records.length ? "Takip edilen egzersiz" : "Veri bekleniyor"} tone="orange" /><MetricCard icon="fitness-center" label="Toplam hacim" value={completed.length ? `${Math.round(totalVolume(completed)).toLocaleString("tr-TR")}` : "—"} detail={completed.length ? `${data.settings.unit} × tekrar` : "İlk kaydını ekle"} tone="blue" /></View>
      <SectionTitle title="Antrenman hacmi" />
      <Card><Text style={styles.cardSubtitle}>Son tamamlanan antrenmanlar</Text><View style={{ marginTop: 14 }}><LineChart points={volumes} color="#60A5FA" suffix={` ${data.settings.unit}`} /></View></Card>
      <SectionTitle title="Kişisel rekorlar" />
      {records.length ? <View style={{ gap: 10 }}>{records.slice(0, 4).map((record, index) => <Card key={record.exerciseId}><View style={styles.prRow}><View style={[styles.rank, index === 0 && styles.gold]}><Text style={[styles.rankText, index === 0 && styles.goldText]}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.prName}>{record.name}</Text><Text style={styles.prMeta}>{record.weight} {data.settings.unit} × {record.reps} tekrar · {dateLabel(record.achievedAt)}</Text></View><Text style={styles.prValue}>{record.oneRepMax}<Text style={styles.prUnit}> e1RM</Text></Text></View></Card>)}</View> : <EmptyState icon="emoji-events" title="Rekorlar yakında burada" copy="Setlerini tamamladığında egzersiz bazlı tahmini 1RM değerlerin hesaplanır." />}
      <SectionTitle title="Akıllı ilerleme" />
      <Card accent><View style={styles.adviceHead}><View style={styles.adviceIcon}><MaterialIcons name="auto-graph" size={21} color="#B8FF3D" /></View><Text style={styles.adviceTitle}>Bir sonraki hamle</Text></View><Text style={[ui.body, { marginTop: 12 }]}>{hint}</Text></Card>
      <SectionTitle title="Vücut ağırlığı" />
      <Card><View style={styles.weightHead}><View><Text style={styles.weightLabel}>Son ölçüm</Text><Text style={styles.weightValue}>{latestWeight ? `${latestWeight.weight} ${data.settings.unit}` : "—"}</Text></View>{change !== null ? <View style={[styles.changePill, change === 0 && styles.neutralPill]}><MaterialIcons name={change > 0 ? "trending-up" : change < 0 ? "trending-down" : "trending-flat"} size={15} color={change === 0 ? "#C5CDD7" : "#B8FF3D"} /><Text style={[styles.changeText, change === 0 && styles.neutralText]}>{change > 0 ? "+" : ""}{change} {data.settings.unit}</Text></View> : null}</View><View style={{ marginTop: 14 }}><LineChart points={weightPoints} color="#B8FF3D" suffix={` ${data.settings.unit}`} /></View><View style={styles.weightInputRow}><TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder={`${data.settings.unit} gir`} placeholderTextColor="#657386" returnKeyType="done" onSubmitEditing={saveWeight} style={styles.weightInput} /><TouchableOpacity onPress={saveWeight} style={styles.saveWeight}><Text style={styles.saveWeightText}>Kaydet</Text></TouchableOpacity></View></Card>
    </> : <>
      <SectionTitle title="Kas grubu hacmi" />
      <Card><Text style={styles.cardSubtitle}>Tamamlanan setlerden gelen dağılım</Text><View style={{ marginTop: 18 }}><BarChart points={musclePoints.map((point) => ({ label: point.muscle, value: point.volume }))} /></View></Card>
      <SectionTitle title="Denge kontrolü" />
      {musclePoints.length ? <Card accent><View style={styles.adviceHead}><View style={styles.adviceIcon}><MaterialIcons name="balance" size={21} color="#B8FF3D" /></View><Text style={styles.adviceTitle}>Haftalık yorum</Text></View><Text style={[ui.body, { marginTop: 12 }]}>{musclePoints.length >= 2 ? `${musclePoints[0].muscle} hacmi en yüksek kas grubun. ${musclePoints.at(-1)?.muscle} için set ekleyerek antrenman dağılımını dengelemeyi değerlendirebilirsin.` : "Dengeli bir yorum için en az iki kas grubunda tamamlanmış set kaydet."}</Text></Card> : <EmptyState icon="insights" title="Kas analizi için kayıt gerekli" copy="Her tamamlanan set, ilgili kas gruplarına hacim olarak yansır." />}
      <SectionTitle title="Kaydedilen aktivite" />
      <View style={styles.metrics}><MetricCard icon="done-all" label="Tamamlanan set" value={allSets.length ? `${allSets.length}` : "—"} detail={allSets.length ? "Toplam kayıt" : "Veri bekleniyor"} /><MetricCard icon="event" label="Antrenman" value={completed.length ? `${completed.length}` : "—"} detail={completed.length ? "Tamamlanan oturum" : "İlk oturumunu başlat"} tone="blue" /></View>
    </>}
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: 12, marginBottom: 20 }, headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, coachShortcut: { minHeight: 38, paddingHorizontal: 11, borderRadius: 13, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }, coachShortcutText: { color: "#10150B", fontSize: 12, fontWeight: "900" },
  segment: { flexDirection: "row", backgroundColor: "#141A22", borderColor: "#263141", borderWidth: 1, borderRadius: 15, padding: 4 }, segmentItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 11 }, segmentActive: { backgroundColor: "#B8FF3D" }, segmentText: { color: "#9AA6B5", fontSize: 13, fontWeight: "900" }, segmentTextActive: { color: "#10150B" },
  metrics: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 }, cardSubtitle: { color: "#9AA6B5", fontSize: 12, fontWeight: "700" },
  prRow: { flexDirection: "row", alignItems: "center", gap: 12 }, rank: { width: 31, height: 31, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2430" }, gold: { backgroundColor: "#3C2B12" }, rankText: { color: "#9AA6B5", fontWeight: "900" }, goldText: { color: "#F6BC59" }, prName: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, prMeta: { color: "#9AA6B5", fontSize: 11, marginTop: 4 }, prValue: { color: "#B8FF3D", fontSize: 19, fontWeight: "900" }, prUnit: { color: "#9AA6B5", fontSize: 10, fontWeight: "700" },
  adviceHead: { flexDirection: "row", alignItems: "center", gap: 10 }, adviceIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#273116" }, adviceTitle: { color: "#F5F7FA", fontSize: 15, fontWeight: "900" },
  weightHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, weightLabel: { color: "#9AA6B5", fontSize: 12, fontWeight: "700" }, weightValue: { color: "#F5F7FA", fontSize: 23, fontWeight: "900", marginTop: 3 }, changePill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 99, backgroundColor: "#1B2A17" }, neutralPill: { backgroundColor: "#1B2430" }, changeText: { color: "#B8FF3D", fontWeight: "900", fontSize: 12 }, neutralText: { color: "#C5CDD7" }, weightInputRow: { marginTop: 17, gap: 9, flexDirection: "row" }, weightInput: { flex: 1, borderColor: "#344154", borderWidth: 1, backgroundColor: "#0B0E12", borderRadius: 13, color: "#F5F7FA", paddingHorizontal: 13, fontSize: 14, fontWeight: "700" }, saveWeight: { minWidth: 84, backgroundColor: "#B8FF3D", borderRadius: 13, alignItems: "center", justifyContent: "center", paddingHorizontal: 13 }, saveWeightText: { color: "#10150B", fontWeight: "900" },
});
