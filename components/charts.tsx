import { StyleSheet, Text, View } from "react-native";

export type ChartPoint = { label: string; value: number };

/**
 * Lightweight, dependency-free çizgi grafiği.
 * Değerleri normalize edip yükseklik olarak yansıtır; native + web'de aynı çalışır.
 */
export function LineChart({ points, color = "#B8FF3D", suffix = "" }: { points: ChartPoint[]; color?: string; suffix?: string }) {
  if (!points.length) return <Text style={styles.empty}>Grafik için yeterli veri yok.</Text>;
  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  const range = max - min || 1;

  return (
    <View>
      <View style={styles.plot}>
        {points.map((point, index) => {
          const ratio = (point.value - min) / range;
          return (
            <View key={`${point.label}-${index}`} style={styles.column}>
              <View style={styles.track}>
                <View style={[styles.dot, { backgroundColor: color, bottom: `${8 + ratio * 84}%` }]} />
                <View style={[styles.stem, { backgroundColor: `${color}33`, height: `${8 + ratio * 84}%` }]} />
              </View>
              <Text style={styles.value} numberOfLines={1}>{Math.round(point.value).toLocaleString("tr-TR")}{suffix}</Text>
              <Text style={styles.label} numberOfLines={1}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Yatay bar grafiği — kas grubu hacim dağılımı gibi kategorik veriler için. */
export function BarChart({ points, color = "#B8FF3D" }: { points: ChartPoint[]; color?: string }) {
  if (!points.length) return <Text style={styles.empty}>Grafik için yeterli veri yok.</Text>;
  const max = Math.max(...points.map((point) => point.value)) || 1;

  return (
    <View style={{ gap: 12 }}>
      {points.map((point, index) => (
        <View key={`${point.label}-${index}`}>
          <View style={styles.barHead}>
            <Text style={styles.barLabel} numberOfLines={1}>{point.label}</Text>
            <Text style={styles.barValue}>{Math.round(point.value).toLocaleString("tr-TR")}</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.max(4, (point.value / max) * 100)}%`, backgroundColor: color }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  plot: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 168 },
  column: { flex: 1, alignItems: "center" },
  track: { width: "100%", height: 120, justifyContent: "flex-end", alignItems: "center" },
  stem: { width: 3, borderRadius: 2 },
  dot: { position: "absolute", width: 9, height: 9, borderRadius: 5 },
  value: { color: "#F5F7FA", fontSize: 11, fontWeight: "700", marginTop: 8 },
  label: { color: "#788596", fontSize: 10, marginTop: 2 },
  empty: { color: "#788596", fontSize: 13 },
  barHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  barLabel: { color: "#D7DEE8", fontSize: 12, fontWeight: "600", flex: 1 },
  barValue: { color: "#9AA6B5", fontSize: 12 },
  barTrack: { height: 9, borderRadius: 5, backgroundColor: "#1B222C", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 5 },
});
