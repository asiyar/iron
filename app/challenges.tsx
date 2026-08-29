import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { ScreenHeader } from "@/components/screen-header";
import { totalVolume, trainingConsistency } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";

type Challenge = {
  id: string;
  title: string;
  copy: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  current: number;
  target: number;
  unit: string;
};

export default function ChallengesScreen() {
  const { data } = useFitness();
  const completed = useMemo(() => data.sessions.filter((session) => session.completedAt), [data.sessions]);
  // Ekran açıldığı andaki zaman referansı — render sırasında Date.now() çağırmak saf değildir.
  const [now] = useState(() => Date.now());

  const challenges = useMemo<Challenge[]>(() => {
    const week = completed.filter((session) => now - new Date(session.completedAt!).getTime() <= 7 * 86_400_000);
    const month = completed.filter((session) => now - new Date(session.completedAt!).getTime() <= 30 * 86_400_000);
    const weeklySets = week.flatMap((session) => session.exercises.flatMap((entry) => entry.sets.filter((set) => set.completed))).length;
    const consistency = trainingConsistency(completed);

    return [
      { id: "weekly-sessions", title: "Haftada 3 antrenman", copy: "Düzenli sıklık, ilerlemenin en güçlü tek göstergesidir.", icon: "event-repeat", current: week.length, target: 3, unit: "antrenman" },
      { id: "weekly-sets", title: "Haftada 60 set", copy: "Tamamlanmış set sayısı toplam çalışma hacmini yansıtır.", icon: "done-all", current: weeklySets, target: 60, unit: "set" },
      { id: "monthly-volume", title: "Ayda 40.000 hacim", copy: `Son 30 günde toplanan ${data.settings.unit} × tekrar toplamı.`, icon: "monitor-weight", current: Math.round(totalVolume(month)), target: 40_000, unit: data.settings.unit },
      { id: "streak", title: "7 günlük seri", copy: "Arka arkaya antrenman yapılan gün sayısı.", icon: "local-fire-department", current: consistency.streakDays, target: 7, unit: "gün" },
      { id: "wellness-log", title: "7 gün toparlanma günlüğü", copy: "Uyku ve hazır olma kaydı, adaptif hedefleri besler.", icon: "bedtime", current: data.wellness.length, target: 7, unit: "gün" },
    ];
  }, [completed, now, data.settings.unit, data.wellness.length]);

  const unlocked = challenges.filter((challenge) => challenge.current >= challenge.target).length;

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Topluluk" eyebrow="Meydan okumalar" title="Kendi rekorunu kır." copy="Hedefler kendi verinden hesaplanır; kimseyle kıyaslanmazsın." />

        <MotionSection delay={40}>
          <Card accent>
            <Text style={ui.eyebrow}>Durum</Text>
            <Text style={styles.summary}>{unlocked} / {challenges.length} tamamlandı</Text>
            <Text style={ui.body}>Tamamlanan hedefler her yeni antrenman kaydında otomatik güncellenir.</Text>
          </Card>
        </MotionSection>

        <SectionTitle title="Aktif hedefler" />
        {challenges.map((challenge) => {
          const ratio = Math.min(1, challenge.target ? challenge.current / challenge.target : 0);
          const done = challenge.current >= challenge.target;
          return (
            <View key={challenge.id} style={[styles.card, done && styles.cardDone]}>
              <View style={styles.head}>
                <View style={[styles.icon, done && styles.iconDone]}>
                  <MaterialIcons name={done ? "emoji-events" : challenge.icon} size={19} color={done ? "#10150B" : "#B8FF3D"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{challenge.title}</Text>
                  <Text style={styles.copy}>{challenge.copy}</Text>
                </View>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.max(3, ratio * 100)}%` }]} />
              </View>
              <Text style={styles.progress}>
                {challenge.current.toLocaleString("tr-TR")} / {challenge.target.toLocaleString("tr-TR")} {challenge.unit}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { color: "#F5F7FA", fontSize: 26, fontWeight: "900", letterSpacing: -0.8, marginVertical: 6 },
  card: { backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 20, padding: 16, marginBottom: 12 },
  cardDone: { borderColor: "#B8FF3D66", backgroundColor: "#172116" },
  head: { flexDirection: "row", gap: 13, alignItems: "flex-start" },
  icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#1B2416", alignItems: "center", justifyContent: "center" },
  iconDone: { backgroundColor: "#B8FF3D" },
  title: { color: "#F5F7FA", fontSize: 15, fontWeight: "800" },
  copy: { color: "#9AA6B5", fontSize: 12, marginTop: 3, lineHeight: 17 },
  track: { height: 8, borderRadius: 5, backgroundColor: "#1B222C", overflow: "hidden", marginTop: 14 },
  fill: { height: "100%", borderRadius: 5, backgroundColor: "#B8FF3D" },
  progress: { color: "#788596", fontSize: 11, fontWeight: "700", marginTop: 8 },
});
