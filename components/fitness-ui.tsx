import { MaterialIcons } from "@expo/vector-icons";
import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconName = keyof typeof MaterialIcons.glyphMap;

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{action && <TouchableOpacity onPress={onAction}><Text style={styles.action}>{action}</Text></TouchableOpacity>}</View>;
}

export function Card({ children, accent = false }: PropsWithChildren<{ accent?: boolean }>) {
  return <View style={[styles.card, accent && styles.accentCard]}>{children}</View>;
}

export function MetricCard({ label, value, detail, icon, tone = "lime" }: { label: string; value: string; detail?: string; icon: IconName; tone?: "lime" | "blue" | "orange" }) {
  const color = tone === "blue" ? "#60A5FA" : tone === "orange" ? "#F97316" : "#B8FF3D";
  return <View style={styles.metricCard}><View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}><MaterialIcons name={icon} color={color} size={19} /></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text>{detail ? <Text style={styles.metricDetail}>{detail}</Text> : null}</View>;
}

export function PrimaryButton({ label, onPress, icon = "arrow-forward", secondary = false }: { label: string; onPress: () => void; icon?: IconName; secondary?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, secondary && styles.secondaryButton, pressed && styles.pressed]}><Text style={[styles.primaryText, secondary && styles.secondaryText]}>{label}</Text><MaterialIcons name={icon} color={secondary ? "#F5F7FA" : "#10150B"} size={19} /></Pressable>;
}

export function EmptyState({ icon, title, copy, action, onAction }: { icon: IconName; title: string; copy: string; action?: string; onAction?: () => void }) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><MaterialIcons name={icon} color="#B8FF3D" size={24} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyCopy}>{copy}</Text>{action && onAction ? <TouchableOpacity onPress={onAction} style={styles.textAction}><Text style={styles.action}>{action}</Text></TouchableOpacity> : null}</View>;
}

export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0B0E12" },
  content: { paddingHorizontal: 20, paddingBottom: 118 },
  eyebrow: { color: "#B8FF3D", fontSize: 11, fontWeight: "900", letterSpacing: 1.3, textTransform: "uppercase" },
  h1: { color: "#F8FAFC", fontSize: 34, fontWeight: "900", letterSpacing: -1.15, marginTop: 5, lineHeight: 40 },
  h2: { color: "#F8FAFC", fontSize: 21, fontWeight: "900", letterSpacing: -0.35 },
  body: { color: "#9AA6B5", fontSize: 14, lineHeight: 20 },
  pill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, backgroundColor: "#202A16" },
  pillText: { color: "#B8FF3D", fontSize: 11, fontWeight: "800" },
});

const styles = StyleSheet.create({
  sectionHead: { marginTop: 30, marginBottom: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: "#F8FAFC", fontSize: 18, fontWeight: "900", letterSpacing: -0.25 },
  action: { color: "#B8FF3D", fontSize: 14, fontWeight: "800" },
  card: { backgroundColor: "#141A22", borderColor: "#2B3748", borderWidth: 1, borderRadius: 24, padding: 17, shadowColor: "#000000", shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 3 },
  accentCard: { borderColor: "#B8FF3D66", backgroundColor: "#172116" },
  metricCard: { width: "48%", backgroundColor: "#141A22", borderColor: "#2B3748", borderWidth: 1, borderRadius: 22, padding: 15, minHeight: 142 },
  metricIcon: { width: 34, height: 34, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  metricValue: { color: "#F8FAFC", fontSize: 24, fontWeight: "900", letterSpacing: -0.65 },
  metricLabel: { color: "#9AA6B5", fontSize: 12, marginTop: 4 },
  metricDetail: { color: "#B8FF3D", fontSize: 11, marginTop: 5, fontWeight: "700" },
  primaryButton: { backgroundColor: "#B8FF3D", minHeight: 56, borderRadius: 18, paddingHorizontal: 19, flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", shadowColor: "#B8FF3D", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  secondaryButton: { backgroundColor: "#1B2430", borderWidth: 1, borderColor: "#344154" },
  pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  primaryText: { color: "#10150B", fontWeight: "900", fontSize: 15 },
  secondaryText: { color: "#F5F7FA" },
  empty: { alignItems: "center", paddingVertical: 26, paddingHorizontal: 18, backgroundColor: "#141A22", borderWidth: 1, borderStyle: "dashed", borderColor: "#344154", borderRadius: 22 },
  emptyIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#1B2A17", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  emptyTitle: { color: "#F5F7FA", fontSize: 16, fontWeight: "800" },
  emptyCopy: { color: "#9AA6B5", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 19 },
  textAction: { marginTop: 14, padding: 4 },
});
