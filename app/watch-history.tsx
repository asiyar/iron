import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, EmptyState, SectionTitle, ui } from "@/components/fitness-ui";
import { ScreenHeader } from "@/components/screen-header";
import { useFitness } from "@/lib/fitness-store";

const dateLabel = (value: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export default function WatchHistoryScreen() {
  const { data } = useFitness();

  const history = useMemo(() => [...data.videoWatchHistory].sort((a, b) => b.watchedAt.localeCompare(a.watchedAt)), [data.videoWatchHistory]);
  const totalViews = history.reduce((sum, entry) => sum + entry.watchCount, 0);
  const mostWatched = [...history].sort((a, b) => b.watchCount - a.watchCount)[0];

  return (
    <View style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader back="Profil" eyebrow="İzleme geçmişi" title="Baktığın rehberler." copy="Geçmiş yalnızca cihazında saklanır ve profil ayarlarından verilerini silerek temizlenir." />

        {history.length ? (
          <Card accent>
            <Text style={ui.eyebrow}>Özet</Text>
            <Text style={styles.summary}>{history.length} rehber · {totalViews} izleme</Text>
            {mostWatched ? <Text style={ui.body}>En çok izlenen: {mostWatched.title} ({mostWatched.watchCount}×)</Text> : null}
          </Card>
        ) : null}

        <SectionTitle title="Son izlenenler" />
        {history.length ? (
          history.map((entry) => (
            <View key={`${entry.exerciseId}-${entry.watchedAt}`} style={styles.item}>
              <View style={styles.icon}>
                <MaterialIcons name="history" size={19} color="#60A5FA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>{entry.title}</Text>
                <Text style={styles.meta}>{entry.provider} · {dateLabel(entry.watchedAt)}</Text>
              </View>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{entry.watchCount}×</Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState icon="ondemand-video" title="Geçmiş boş" copy="Bir egzersiz rehberi izlediğinde burada görünür." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { color: "#F5F7FA", fontSize: 22, fontWeight: "900", letterSpacing: -0.6, marginVertical: 6 },
  item: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#263141", borderRadius: 18, padding: 14, marginBottom: 10 },
  icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#131C29", alignItems: "center", justifyContent: "center" },
  title: { color: "#F5F7FA", fontSize: 14, fontWeight: "800" },
  meta: { color: "#9AA6B5", fontSize: 11, marginTop: 3 },
  countPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, backgroundColor: "#131C29" },
  countText: { color: "#60A5FA", fontSize: 12, fontWeight: "800" },
});
