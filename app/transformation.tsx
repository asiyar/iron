import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, PrimaryButton, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { ScreenHeader } from "@/components/screen-header";
import { bodyWeightChange } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";
import type { TransformationGoal } from "@/shared/fitness";

const FOCUS_OPTIONS: NonNullable<TransformationGoal["focus"]>[] = ["Güç", "Kas kazanımı", "Yağ kaybı", "Performans"];
const dateLabel = (value: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));

export default function TransformationScreen() {
  const { data, addMeasurement, updateTransformationGoal } = useFitness();
  const goal = data.transformationGoal;

  const [targetWeight, setTargetWeight] = useState(goal.targetWeight ? String(goal.targetWeight) : "");
  const [focus, setFocus] = useState(goal.focus);
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arm, setArm] = useState("");
  const [note, setNote] = useState("");

  const latestWeight = data.bodyWeights[data.bodyWeights.length - 1];
  const change = bodyWeightChange(data.bodyWeights);
  const measurements = useMemo(
    () => [...data.measurements].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
    [data.measurements],
  );

  const remaining = latestWeight && goal.targetWeight ? Number((goal.targetWeight - latestWeight.weight).toFixed(1)) : null;

  const saveGoal = () => {
    const parsed = Number(targetWeight.replace(",", "."));
    updateTransformationGoal({ ...goal, focus, targetWeight: Number.isFinite(parsed) && parsed > 0 ? parsed : undefined });
  };

  const saveMeasurement = () => {
    const numeric = (value: string) => {
      const parsed = Number(value.replace(",", "."));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    };
    if (!waist && !chest && !arm && !note.trim()) return;
    addMeasurement({ waistCm: numeric(waist), chestCm: numeric(chest), armCm: numeric(arm), note: note.trim() || undefined });
    setWaist("");
    setChest("");
    setArm("");
    setNote("");
  };

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader back="İlerleme" eyebrow="Dönüşüm" title="Uzun vadeli hedefin." copy="Ağırlık, çevre ölçümleri ve notlar tek bir zaman çizelgesinde birikir." />

        <MotionSection delay={40}>
          <Card accent>
            <Text style={ui.eyebrow}>Şu an</Text>
            <Text style={styles.big}>
              {latestWeight ? `${latestWeight.weight} ${data.settings.unit}` : "—"}
            </Text>
            <Text style={ui.body}>
              {remaining === null
                ? "Hedef ağırlık belirlediğinde kalan mesafe burada görünür."
                : remaining === 0
                  ? "Hedefindesin. Yeni bir hedef belirleyebilirsin."
                  : `Hedefe ${Math.abs(remaining)} ${data.settings.unit} kaldı.`}
            </Text>
            {change !== null ? (
              <View style={styles.changeRow}>
                <MaterialIcons name={change > 0 ? "trending-up" : change < 0 ? "trending-down" : "trending-flat"} size={16} color="#B8FF3D" />
                <Text style={styles.changeText}>Son dönemde {change > 0 ? "+" : ""}{change} {data.settings.unit}</Text>
              </View>
            ) : null}
          </Card>
        </MotionSection>

        <SectionTitle title="Hedefini tanımla" />
        <Card>
          <Text style={styles.label}>Odak</Text>
          <View style={styles.chips}>
            {FOCUS_OPTIONS.map((option) => (
              <TouchableOpacity key={option} onPress={() => setFocus(option)} style={[styles.chip, focus === option && styles.chipActive]}>
                <Text style={[styles.chipText, focus === option && styles.chipTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Hedef ağırlık ({data.settings.unit})</Text>
          <TextInput value={targetWeight} onChangeText={setTargetWeight} keyboardType="decimal-pad" placeholder="Örn. 78" placeholderTextColor="#657386" style={styles.input} />
          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="Hedefi Kaydet" icon="flag" onPress={saveGoal} />
          </View>
        </Card>

        <SectionTitle title="Ölçüm ekle" />
        <Card>
          <View style={styles.row}>
            <TextInput value={waist} onChangeText={setWaist} keyboardType="decimal-pad" placeholder="Bel (cm)" placeholderTextColor="#657386" style={[styles.input, { flex: 1 }]} />
            <TextInput value={chest} onChangeText={setChest} keyboardType="decimal-pad" placeholder="Göğüs (cm)" placeholderTextColor="#657386" style={[styles.input, { flex: 1 }]} />
            <TextInput value={arm} onChangeText={setArm} keyboardType="decimal-pad" placeholder="Kol (cm)" placeholderTextColor="#657386" style={[styles.input, { flex: 1 }]} />
          </View>
          <TextInput value={note} onChangeText={setNote} placeholder="Not (isteğe bağlı)" placeholderTextColor="#657386" style={styles.input} multiline />
          <View style={{ marginTop: 14 }}>
            <PrimaryButton label="Ölçümü Kaydet" icon="straighten" onPress={saveMeasurement} secondary />
          </View>
        </Card>

        <SectionTitle title="Zaman çizelgesi" />
        {measurements.length ? (
          measurements.map((entry) => (
            <View key={entry.id} style={styles.item}>
              <View style={styles.icon}>
                <MaterialIcons name="straighten" size={18} color="#FF6FAE" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{dateLabel(entry.recordedAt)}</Text>
                <Text style={styles.itemCopy}>
                  {[entry.waistCm && `Bel ${entry.waistCm} cm`, entry.chestCm && `Göğüs ${entry.chestCm} cm`, entry.armCm && `Kol ${entry.armCm} cm`].filter(Boolean).join(" · ") || "Yalnızca not"}
                </Text>
                {entry.note ? <Text style={styles.itemNote}>{entry.note}</Text> : null}
              </View>
            </View>
          ))
        ) : (
          <EmptyState icon="timeline" title="Ölçüm yok" copy="İlk çevre ölçümünü ekle; değişimi zaman içinde karşılaştırabilirsin." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  big: { color: "#F5F7FA", fontSize: 38, fontWeight: "900", letterSpacing: -1.3, marginVertical: 6 },
  changeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  changeText: { color: "#B8FF3D", fontSize: 12, fontWeight: "800" },
  label: { color: "#9AA6B5", fontSize: 12, fontWeight: "800", marginTop: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  input: { backgroundColor: "#0F141B", borderWidth: 1, borderColor: "#263141", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#F5F7FA", fontSize: 14, marginTop: 8 },
  row: { flexDirection: "row", gap: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 9 },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 99, backgroundColor: "#0F141B", borderWidth: 1, borderColor: "#263141" },
  chipActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" },
  chipText: { color: "#9AA6B5", fontSize: 12, fontWeight: "800" },
  chipTextActive: { color: "#10150B" },
  item: { flexDirection: "row", gap: 13, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  icon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#221520", alignItems: "center", justifyContent: "center" },
  itemTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  itemCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 3 },
  itemNote: { color: "#788596", fontSize: 12, marginTop: 6, fontStyle: "italic" },
});
