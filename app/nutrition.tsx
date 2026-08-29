import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, MetricCard, PrimaryButton, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { ScreenHeader } from "@/components/screen-header";
import { useFitness } from "@/lib/fitness-store";

const isToday = (value: string) => new Date(value).toDateString() === new Date().toDateString();
const timeLabel = (value: string) => new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export default function NutritionScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode?: string }>();
  const { data, addNutrition } = useFitness();

  // Barkod tarayıcıdan dönüldüyse öğün adı kodla ön doldurulur.
  const [label, setLabel] = useState(barcode ? `Barkod ${barcode}` : "");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const today = useMemo(() => data.nutrition.filter((entry) => isToday(entry.recordedAt)), [data.nutrition]);
  const totals = useMemo(
    () =>
      today.reduce(
        (sum, entry) => ({
          calories: sum.calories + entry.calories,
          protein: sum.protein + entry.proteinGrams,
          carbs: sum.carbs + entry.carbsGrams,
          fat: sum.fat + entry.fatGrams,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [today],
  );

  const save = () => {
    const parsedCalories = Number(calories.replace(",", "."));
    if (!label.trim() || !Number.isFinite(parsedCalories) || parsedCalories <= 0) return;
    addNutrition({
      label: label.trim(),
      calories: Math.round(parsedCalories),
      proteinGrams: Math.max(0, Math.round(Number(protein.replace(",", ".")) || 0)),
      carbsGrams: Math.max(0, Math.round(Number(carbs.replace(",", ".")) || 0)),
      fatGrams: Math.max(0, Math.round(Number(fat.replace(",", ".")) || 0)),
      source: barcode ? "barcode" : "manual",
    });
    setLabel("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader back="Profil" eyebrow="Beslenme" title="Bugünkü alım." copy="Kalori ve makro kaydı tamamen cihazında tutulur; hiçbir veri dışarı gönderilmez." />

        <MotionSection delay={40}>
          <View style={styles.metrics}>
            <MetricCard icon="local-fire-department" label="Kalori" value={`${totals.calories}`} detail={`${today.length} öğün`} tone="orange" />
            <MetricCard icon="egg-alt" label="Protein" value={`${totals.protein} g`} detail="Bugün" tone="lime" />
            <MetricCard icon="bakery-dining" label="Karbonhidrat" value={`${totals.carbs} g`} detail="Bugün" tone="blue" />
            <MetricCard icon="opacity" label="Yağ" value={`${totals.fat} g`} detail="Bugün" tone="orange" />
          </View>
        </MotionSection>

        <SectionTitle title="Öğün ekle" />
        <Card>
          <TextInput value={label} onChangeText={setLabel} placeholder="Öğün adı (ör. Tavuk + pilav)" placeholderTextColor="#657386" style={styles.input} />
          <View style={styles.row}>
            <TextInput value={calories} onChangeText={setCalories} keyboardType="number-pad" placeholder="kcal" placeholderTextColor="#657386" style={[styles.input, styles.small]} />
            <TextInput value={protein} onChangeText={setProtein} keyboardType="number-pad" placeholder="P (g)" placeholderTextColor="#657386" style={[styles.input, styles.small]} />
            <TextInput value={carbs} onChangeText={setCarbs} keyboardType="number-pad" placeholder="K (g)" placeholderTextColor="#657386" style={[styles.input, styles.small]} />
            <TextInput value={fat} onChangeText={setFat} keyboardType="number-pad" placeholder="Y (g)" placeholderTextColor="#657386" style={[styles.input, styles.small]} />
          </View>
          <View style={{ marginTop: 14 }}>
            <PrimaryButton label="Öğünü Kaydet" icon="add" onPress={save} />
          </View>
          <TouchableOpacity onPress={() => router.push("/barcode-scan" as never)} style={styles.scan}>
            <MaterialIcons name="qr-code-scanner" size={18} color="#B8FF3D" />
            <Text style={styles.scanText}>Barkod tara</Text>
          </TouchableOpacity>
        </Card>

        <SectionTitle title="Bugünkü kayıtlar" />
        {today.length ? (
          today.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.entryIcon}>
                <MaterialIcons name={entry.source === "barcode" ? "qr-code" : "restaurant"} size={18} color="#B8FF3D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryTitle}>{entry.label}</Text>
                <Text style={styles.entryCopy}>
                  {timeLabel(entry.recordedAt)} · {entry.calories} kcal · P {entry.proteinGrams} / K {entry.carbsGrams} / Y {entry.fatGrams}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState icon="restaurant-menu" title="Bugün kayıt yok" copy="İlk öğününü ekle; günlük makro dağılımın burada birikir." />
        )}

        <Text style={styles.disclaimer}>
          Bu ekran yalnızca kayıt tutar. Beslenme planı veya tıbbi tavsiye vermez; bireysel bir program için diyetisyene danış.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  input: { backgroundColor: "#0F141B", borderWidth: 1, borderColor: "#263141", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: "#F5F7FA", fontSize: 14, marginTop: 10 },
  small: { flex: 1, minWidth: 64 },
  row: { flexDirection: "row", gap: 8 },
  scan: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 14 },
  scanText: { color: "#B8FF3D", fontSize: 13, fontWeight: "800" },
  entry: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  entryIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#1B2416", alignItems: "center", justifyContent: "center" },
  entryTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  entryCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 3 },
  disclaimer: { color: "#657386", fontSize: 11, lineHeight: 16, marginTop: 26 },
});
