import { MaterialIcons } from "@expo/vector-icons";
import DraggableFlatList, { type RenderItemParams } from "react-native-draggable-flatlist";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { DashboardMetricId } from "@/shared/fitness";

export type DashboardMetricCard = { id: DashboardMetricId; icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; detail: string; tone: string };

export function DraggableMetricList({ data, editing, onOrderChange }: { data: DashboardMetricCard[]; editing: boolean; onOrderChange: (order: DashboardMetricId[]) => void }) {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<DashboardMetricCard>) => <TouchableOpacity activeOpacity={editing ? 0.86 : 1} onLongPress={editing ? drag : undefined} delayLongPress={180} style={[styles.metricCard, isActive && styles.metricCardDragging]}><View style={[styles.metricIcon, { backgroundColor: `${item.tone}20` }]}><MaterialIcons name={item.icon} color={item.tone} size={19} /></View><View style={{ flex: 1 }}><Text style={styles.metricValue}>{item.value}</Text><Text style={styles.metricLabel}>{item.label}</Text><Text style={[styles.metricDetail, { color: item.tone }]}>{item.detail}</Text></View>{editing ? <View style={styles.dragHandle}><MaterialIcons name="drag-indicator" size={22} color="#9AA6B5" /></View> : null}</TouchableOpacity>;
  return <DraggableFlatList data={data} keyExtractor={(item) => item.id} renderItem={renderItem} onDragEnd={({ data: next }) => onOrderChange(next.map((item) => item.id))} scrollEnabled={false} activationDistance={editing ? 6 : 999} containerStyle={styles.metrics} />;
}

const styles = StyleSheet.create({ metrics: { gap: 9 }, metricCard: { minHeight: 81, padding: 14, borderRadius: 19, backgroundColor: "#141A22", borderColor: "#2B3748", borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 12 }, metricCardDragging: { backgroundColor: "#1C2A20", borderColor: "#B8FF3D", shadowColor: "#000", shadowOpacity: 0.36, shadowRadius: 15, elevation: 8 }, metricIcon: { width: 39, height: 39, borderRadius: 13, alignItems: "center", justifyContent: "center" }, metricValue: { color: "#F8FAFC", fontSize: 22, fontWeight: "900", letterSpacing: -0.65 }, metricLabel: { color: "#C1CBD7", fontSize: 12, marginTop: 1, fontWeight: "800" }, metricDetail: { fontSize: 10, marginTop: 3, fontWeight: "800" }, dragHandle: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#202B37" } });
