import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { DashboardMetricId } from "@/shared/fitness";

export type DashboardMetricCard = { id: DashboardMetricId; icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; detail: string; tone: string };

/**
 * Web fallback: react-native-draggable-flatlist web'de sürükleme desteklemez.
 * Sıralama yukarı/aşağı düğmeleriyle yapılır.
 */
export function DraggableMetricList({ data, editing, onOrderChange }: { data: DashboardMetricCard[]; editing: boolean; onOrderChange: (order: DashboardMetricId[]) => void }) {
  const move = (index: number, direction: -1 | 1) => {
    const next = [...data];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onOrderChange(next.map((item) => item.id));
  };

  return (
    <View style={styles.metrics}>
      {data.map((item, index) => (
        <View key={item.id} style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: `${item.tone}20` }]}>
            <MaterialIcons name={item.icon} color={item.tone} size={19} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.metricValue}>{item.value}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={[styles.metricDetail, { color: item.tone }]}>{item.detail}</Text>
          </View>
          {editing ? (
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => move(index, -1)} disabled={index === 0} style={styles.control}>
                <MaterialIcons name="keyboard-arrow-up" size={20} color={index === 0 ? "#3A4557" : "#9AA6B5"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => move(index, 1)} disabled={index === data.length - 1} style={styles.control}>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={index === data.length - 1 ? "#3A4557" : "#9AA6B5"} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: { gap: 12 },
  metricCard: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: "#141A22", borderRadius: 18, borderWidth: 1, borderColor: "#263141", padding: 15 },
  metricIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  metricValue: { color: "#F5F7FA", fontSize: 18, fontWeight: "800" },
  metricLabel: { color: "#9AA6B5", fontSize: 12, marginTop: 1 },
  metricDetail: { fontSize: 11, fontWeight: "700", marginTop: 3 },
  controls: { gap: 2 },
  control: { padding: 2 },
});
