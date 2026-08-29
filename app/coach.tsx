import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Card, PrimaryButton, ui } from "@/components/fitness-ui";
import { startOAuthLogin } from "@/constants/oauth";
import { muscleVolume, personalRecords, totalVolume } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

type CoachResponse = { headline: string; summary: string; actions: string[]; caution: string };

export default function CoachScreen() {
  const router = useRouter();
  const { data } = useFitness();
  const { isAuthenticated, loading } = useAuth();
  const completed = data.sessions.filter((session) => session.completedAt);
  const topMuscles = useMemo(() => muscleVolume(completed).sort((a, b) => b.volume - a.volume).slice(0, 3).map((entry) => entry.muscle), [completed]);
  const latestWeight = [...data.bodyWeights].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]?.weight;
  const recommendation = trpc.ai.recommend.useMutation();
  const result = recommendation.data as CoachResponse | undefined;

  const askCoach = () => {
    if (!isAuthenticated) return startOAuthLogin();
    recommendation.mutate({
      completedWorkouts: completed.length,
      totalVolume: totalVolume(completed),
      personalRecordCount: personalRecords(completed).length,
      topMuscles,
      latestWeight,
      stepsToday: data.healthSync.stepsToday,
    });
  };

  return <View style={ui.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <TouchableOpacity onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={20} color="#D7DEE8" /><Text style={styles.backText}>İlerleme</Text></TouchableOpacity>
    <View style={styles.hero}><View style={styles.coachIcon}><MaterialIcons name="auto-awesome" size={26} color="#10150B" /></View><View style={{ flex: 1 }}><Text style={ui.eyebrow}>IronPulse Koç</Text><Text style={ui.h1}>Bir sonraki doğru hamle.</Text></View></View>
    <Text style={[ui.body, { marginTop: 13 }]}>Koç, yalnızca tamamlanan antrenmanlarını ve izin verdiğin sağlık özetlerini değerlendirir. Tıbbi teşhis veya tedavi önerisi vermez.</Text>
    <Card accent><Text style={styles.cardLabel}>ANALİZ EDİLECEK ÖZET</Text><View style={styles.statRow}><View><Text style={styles.statValue}>{completed.length || "—"}</Text><Text style={styles.statLabel}>Antrenman</Text></View><View><Text style={styles.statValue}>{personalRecords(completed).length || "—"}</Text><Text style={styles.statLabel}>PR</Text></View><View><Text style={styles.statValue}>{data.healthSync.stepsToday?.toLocaleString("tr-TR") ?? "—"}</Text><Text style={styles.statLabel}>Bugünün adımı</Text></View></View><Text style={styles.muscleLine}>{topMuscles.length ? `Öne çıkan kaslar: ${topMuscles.join(", ")}` : "Kas dengesi için ilk antrenmanını tamamla."}</Text></Card>
    {!loading && !isAuthenticated ? <Card><View style={styles.loginRow}><MaterialIcons name="lock-outline" size={21} color="#F97316" /><View style={{ flex: 1 }}><Text style={styles.loginTitle}>Kişisel öneriler için giriş yap</Text><Text style={styles.loginCopy}>Öneri geçmişini ve program önerilerini hesabında güvenle saklarız.</Text></View></View><View style={{ marginTop: 15 }}><PrimaryButton label="Giriş yap" onPress={startOAuthLogin} icon="login" /></View></Card> : null}
    {recommendation.isPending ? <Card><View style={styles.loading}><ActivityIndicator color="#B8FF3D" /><Text style={styles.loadingText}>Antrenman ritmin değerlendiriliyor…</Text></View></Card> : null}
    {result ? <Card accent><View style={styles.resultHead}><View style={styles.spark}><MaterialIcons name="bolt" size={20} color="#B8FF3D" /></View><Text style={styles.resultTitle}>{result.headline}</Text></View><Text style={[ui.body, { marginTop: 13 }]}>{result.summary}</Text><View style={styles.actionList}>{result.actions.slice(0, 3).map((action, index) => <View key={`${index}-${action}`} style={styles.action}><Text style={styles.actionNumber}>{index + 1}</Text><Text style={styles.actionText}>{action}</Text></View>)}</View><Text style={styles.caution}>{result.caution}</Text></Card> : null}
    <View style={{ marginTop: 22 }}><PrimaryButton label={isAuthenticated ? "Koç önerisi oluştur" : "Giriş yap ve öneri al"} onPress={askCoach} icon="auto-awesome" /></View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 50 }, back: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, marginBottom: 26 }, backText: { color: "#C5CDD7", fontSize: 13, fontWeight: "800" }, hero: { flexDirection: "row", gap: 14, alignItems: "center" }, coachIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center" }, cardLabel: { color: "#B8FF3D", fontSize: 10, letterSpacing: 0.7, fontWeight: "900" }, statRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 }, statValue: { color: "#F5F7FA", fontSize: 21, fontWeight: "900" }, statLabel: { color: "#9AA6B5", fontSize: 10, marginTop: 2 }, muscleLine: { color: "#C5CDD7", fontSize: 12, lineHeight: 18, marginTop: 15, paddingTop: 13, borderTopWidth: 1, borderTopColor: "#526D2444" }, loginRow: { flexDirection: "row", gap: 10, alignItems: "center" }, loginTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, loginCopy: { color: "#9AA6B5", fontSize: 11, lineHeight: 16, marginTop: 3 }, loading: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 56 }, loadingText: { color: "#D7DEE8", fontWeight: "700", fontSize: 13 }, resultHead: { flexDirection: "row", gap: 10, alignItems: "center" }, spark: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#273116", alignItems: "center", justifyContent: "center" }, resultTitle: { color: "#F5F7FA", fontSize: 16, fontWeight: "900", flex: 1 }, actionList: { marginTop: 17, gap: 10 }, action: { flexDirection: "row", gap: 10, alignItems: "flex-start" }, actionNumber: { color: "#10150B", backgroundColor: "#B8FF3D", width: 21, height: 21, lineHeight: 21, textAlign: "center", borderRadius: 11, fontWeight: "900", fontSize: 11 }, actionText: { color: "#D7DEE8", flex: 1, fontSize: 12, lineHeight: 18 }, caution: { color: "#F9B371", fontSize: 11, lineHeight: 16, marginTop: 17, paddingTop: 13, borderTopWidth: 1, borderTopColor: "#526D2444" },
});
