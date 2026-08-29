import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, PrimaryButton, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { ScreenHeader } from "@/components/screen-header";
import { useFitness } from "@/lib/fitness-store";
import { latestWellness, recoveryScore } from "@/lib/performance-engine";

const dayLabel = (value: string) => new Intl.DateTimeFormat("tr-TR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(value));

export default function WellnessScreen() {
  const { data, saveWellness } = useFitness();
  const latest = latestWellness(data.wellness);
  const recovery = recoveryScore(latest);

  const [protein, setProtein] = useState(latest ? String(latest.proteinGrams) : "");
  const [water, setWater] = useState(latest ? String(latest.waterLiters) : "");
  const [sleep, setSleep] = useState(latest ? String(latest.sleepHours) : "");
  const [readiness, setReadiness] = useState(latest?.readiness ?? 7);

  const numeric = (value: string) => Math.max(0, Number(value.replace(",", ".")) || 0);

  const save = () => {
    saveWellness({
      proteinGrams: Math.round(numeric(protein)),
      waterLiters: Number(numeric(water).toFixed(1)),
      sleepHours: Number(numeric(sleep).toFixed(1)),
      readiness,
      steps: data.healthSync.stepsToday,
    });
  };

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader back="Performans" eyebrow="Toparlanma" title="Günlük durumun." copy="Uyku, sıvı ve hazır olma puanı; adaptif hedefler ve deload önerisi bu kayıtlardan hesaplanır." />

        <MotionSection delay={40}>
          <Card accent>
            <Text style={ui.eyebrow}>Toparlanma skoru</Text>
            <Text style={styles.score}>{recovery ?? "—"}<Text style={styles.scoreUnit}> / 100</Text></Text>
            <Text style={ui.body}>
              {recovery === null
                ? "Skor için önce bugünün uyku, sıvı ve hazır olma değerlerini kaydet."
                : recovery >= 75
                  ? "Yüksek yoğunluk için uygun görünüyorsun."
                  : recovery >= 50
                    ? "Orta yoğunlukta ilerle, teknik kaliteyi koru."
                    : "Hacmi düşür veya aktif dinlenme günü planla."}
            </Text>
          </Card>
        </MotionSection>

        <SectionTitle title="Bugünü kaydet" />
        <Card>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput value={protein} onChangeText={setProtein} keyboardType="number-pad" placeholder="Örn. 140" placeholderTextColor="#657386" style={styles.input} />

          <Text style={styles.label}>Su (L)</Text>
          <TextInput value={water} onChangeText={setWater} keyboardType="decimal-pad" placeholder="Örn. 2.5" placeholderTextColor="#657386" style={styles.input} />

          <Text style={styles.label}>Uyku (saat)</Text>
          <TextInput value={sleep} onChangeText={setSleep} keyboardType="decimal-pad" placeholder="Örn. 7.5" placeholderTextColor="#657386" style={styles.input} />

          <Text style={styles.label}>Hazır olma hissi</Text>
          <View style={styles.scale}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
              <TouchableOpacity key={value} onPress={() => setReadiness(value)} style={[styles.scaleDot, readiness === value && styles.scaleActive]}>
                <Text style={[styles.scaleText, readiness === value && styles.scaleTextActive]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 18 }}>
            <PrimaryButton label="Günlüğü Kaydet" icon="favorite" onPress={save} />
          </View>
        </Card>

        <SectionTitle title="Geçmiş" />
        {data.wellness.length ? (
          [...data.wellness]
            .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
            .slice(0, 14)
            .map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <View style={styles.entryIcon}>
                  <MaterialIcons name="bedtime" size={18} color="#7CE9DD" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle}>{dayLabel(entry.recordedAt)}</Text>
                  <Text style={styles.entryCopy}>
                    {entry.sleepHours} sa uyku · {entry.waterLiters} L su · {entry.proteinGrams} g protein
                  </Text>
                </View>
                <View style={styles.readinessPill}>
                  <Text style={styles.readinessText}>{entry.readiness}</Text>
                </View>
              </View>
            ))
        ) : (
          <EmptyState icon="self-improvement" title="Henüz günlük yok" copy="İlk kaydını gir; toparlanma skoru en az bir günlükle anlam kazanır." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  score: { color: "#B8FF3D", fontSize: 44, fontWeight: "900", letterSpacing: -1.6, marginVertical: 6 },
  scoreUnit: { color: "#788596", fontSize: 17, fontWeight: "800" },
  label: { color: "#9AA6B5", fontSize: 12, fontWeight: "800", marginTop: 14, textTransform: "uppercase", letterSpacing: 0.6 },
  input: { backgroundColor: "#0F141B", borderWidth: 1, borderColor: "#263141", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#F5F7FA", fontSize: 14, marginTop: 7 },
  scale: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 9 },
  scaleDot: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#0F141B", borderWidth: 1, borderColor: "#263141" },
  scaleActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" },
  scaleText: { color: "#9AA6B5", fontSize: 13, fontWeight: "800" },
  scaleTextActive: { color: "#10150B" },
  entry: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  entryIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#122024", alignItems: "center", justifyContent: "center" },
  entryTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  entryCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 3 },
  readinessPill: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 99, backgroundColor: "#202A16" },
  readinessText: { color: "#B8FF3D", fontSize: 13, fontWeight: "900" },
});
