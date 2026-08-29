import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BarChart } from "@/components/charts";
import { Card, MetricCard, SectionTitle, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { ScreenHeader } from "@/components/screen-header";
import { muscleVolume, personalRecords } from "@/lib/fitness-analytics";
import { useFitness } from "@/lib/fitness-store";
import { deloadGuidance, monthlyReport } from "@/lib/planning-analytics";

export default function MonthlyReportScreen() {
  const { data } = useFitness();
  const report = monthlyReport(data.sessions, data.nutrition);
  const guidance = deloadGuidance(data.sessions, data.wellness);
  const completed = data.sessions.filter((session) => session.completedAt);
  const records = personalRecords(completed).slice(0, 5);
  const distribution = muscleVolume(completed).sort((a, b) => b.volume - a.volume).slice(0, 8);

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Performans" eyebrow="Son 30 gün" title="Aylık rapor." copy="Tüm sayılar yalnızca tamamlanmış setlerden hesaplanır; tahmin veya doldurma yapılmaz." />

        <MotionSection delay={40}>
          <View style={styles.metrics}>
            <MetricCard icon="fitness-center" label="Antrenman" value={`${report.sessions}`} detail="Tamamlanan" tone="lime" />
            <MetricCard icon="done-all" label="Set" value={`${report.sets}`} detail="Tamamlanan" tone="blue" />
            <MetricCard icon="monitor-weight" label="Hacim" value={report.volume.toLocaleString("tr-TR")} detail={data.settings.unit} tone="orange" />
            <MetricCard icon="restaurant" label="Öğün" value={`${report.meals}`} detail={`Ort. ${report.averageProtein} g protein`} tone="lime" />
          </View>
        </MotionSection>

        <SectionTitle title="Yüklenme durumu" />
        <Card accent>
          <Text style={styles.guidanceTitle}>{guidance.title}</Text>
          <Text style={ui.body}>{guidance.detail}</Text>
        </Card>

        {distribution.length ? (
          <>
            <SectionTitle title="Kas grubu dağılımı" />
            <Card>
              <BarChart points={distribution.map((entry) => ({ label: entry.muscle, value: entry.volume }))} />
            </Card>
          </>
        ) : null}

        {records.length ? (
          <>
            <SectionTitle title="Kişisel rekorlar" />
            <Card>
              {records.map((record) => (
                <View key={record.exerciseId} style={styles.recordRow}>
                  <Text style={styles.recordName} numberOfLines={1}>{record.name}</Text>
                  <Text style={styles.recordValue}>{record.weight} {data.settings.unit} × {record.reps}</Text>
                </View>
              ))}
            </Card>
          </>
        ) : null}

        <Text style={styles.footnote}>
          Rapor son 30 günü kapsar. Ağrı, sakatlık veya alışılmadık yorgunlukta antrenmanı durdur ve bir sağlık profesyoneline danış.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  guidanceTitle: { color: "#F5F7FA", fontSize: 17, fontWeight: "900", marginBottom: 6 },
  recordRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1D2531", gap: 12 },
  recordName: { color: "#D7DEE8", fontSize: 13, fontWeight: "700", flex: 1 },
  recordValue: { color: "#B8FF3D", fontSize: 13, fontWeight: "900" },
  footnote: { color: "#657386", fontSize: 11, lineHeight: 16, marginTop: 26 },
});
