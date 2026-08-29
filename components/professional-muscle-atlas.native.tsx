import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { BACK_MUSCLES, FRONT_MUSCLES } from "body-muscles";

import { muscleFocusForAtlasRegion, type MuscleFocus, type MuscleGroup } from "@/shared/fitness";

type Props = {
  selected?: MuscleFocus;
  onSelect: (muscle: MuscleFocus) => void;
  view: "front" | "back";
  onViewChange: (view: "front" | "back") => void;
};

const accents: Record<MuscleGroup, string> = { Göğüs: "#FF8765", Sırt: "#60A5FA", Omuz: "#D28CFF", Biceps: "#F9B371", Triceps: "#F9B371", Quadriceps: "#B8FF3D", Hamstring: "#B8FF3D", Glute: "#FF6FAE", Core: "#FFD166", Baldır: "#7CE9DD" };

export function groupForAtlasRegion(id: string): MuscleGroup | undefined {
  if (id.startsWith("chest-")) return "Göğüs";
  if (id.startsWith("shoulder-") || id.startsWith("deltoid-") || id.startsWith("traps-")) return "Omuz";
  if (id.startsWith("biceps-") || id.startsWith("forearm-") || id.startsWith("elbow-")) return "Biceps";
  if (id.startsWith("triceps-")) return "Triceps";
  if (id.startsWith("lats-") || id.startsWith("rhomboid-") || id.startsWith("spine") || id.startsWith("lower-back-")) return "Sırt";
  if (id.startsWith("gluteus-")) return "Glute";
  if (id.startsWith("abs-") || id.startsWith("serratus-") || id.startsWith("obliques-") || id.startsWith("hip-flexor-")) return "Core";
  if (id.startsWith("quads-") || id.startsWith("adductors-") || id.startsWith("knee-")) return "Quadriceps";
  if (id.startsWith("hamstrings-")) return "Hamstring";
  if (id.startsWith("calves-") || id.startsWith("tibialis-")) return "Baldır";
  return undefined;
}

export function ProfessionalMuscleAtlas({ selected, onSelect, view, onViewChange }: Props) {
  const regions = useMemo(() => view === "front" ? FRONT_MUSCLES : BACK_MUSCLES, [view]);
  const viewBox = view === "front" ? "0 0 35 93" : "37 0 35 93";
  const selectedLabel = selected ? `${selected.label} seçili` : "70+ anatomik bölgeden birine dokun";

  return <View style={styles.wrap}>
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: view === "front" }} onPress={() => onViewChange("front")} style={[styles.side, view === "front" && styles.sideActive]}><Text style={[styles.sideText, view === "front" && styles.sideTextActive]}>Ön</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: view === "back" }} onPress={() => onViewChange("back")} style={[styles.side, view === "back" && styles.sideActive]}><Text style={[styles.sideText, view === "back" && styles.sideTextActive]}>Arka</Text></TouchableOpacity>
    </View>
    <View style={styles.canvas}>
      <Svg width="100%" height="100%" viewBox={viewBox} accessibilityLabel="Ayrıntılı kas atlası">
        {regions.map((region) => {
          const muscle = groupForAtlasRegion(region.id);
          const focus = muscleFocusForAtlasRegion(region.id);
          const active = focus?.atlasId === selected?.atlasId;
          return <Path key={region.id} d={region.path} fill={active && focus ? accents[focus.group] : muscle ? "#263646" : "#18232F"} fillOpacity={active ? 1 : muscle ? 0.96 : 0.58} stroke={active ? "#F7FAFC" : "#40536A"} strokeWidth={active ? 0.32 : 0.14} onPress={() => focus && onSelect(focus)} />;
        })}
      </Svg>
    </View>
    <View style={styles.status}><View style={[styles.dot, { backgroundColor: selected ? accents[selected.group] : "#657386" }]} /><Text style={styles.statusText}>{selectedLabel}</Text><Text style={styles.degree}>70+ BÖLGE</Text></View>
  </View>;
}

const styles = StyleSheet.create({ wrap: { backgroundColor: "#101720", borderColor: "#2C3A4C", borderWidth: 1, borderRadius: 26, overflow: "hidden" }, controls: { flexDirection: "row", alignSelf: "center", marginTop: 14, padding: 4, borderRadius: 14, backgroundColor: "#0B0E12" }, side: { minWidth: 68, paddingVertical: 8, alignItems: "center", borderRadius: 10 }, sideActive: { backgroundColor: "#B8FF3D" }, sideText: { color: "#9AA6B5", fontSize: 12, fontWeight: "900" }, sideTextActive: { color: "#10150B" }, canvas: { height: 420, alignItems: "center", justifyContent: "center", paddingHorizontal: 74, paddingTop: 6 }, status: { minHeight: 48, backgroundColor: "#141A22", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 }, dot: { width: 9, height: 9, borderRadius: 5 }, statusText: { color: "#D7DEE8", fontSize: 12, fontWeight: "800", flex: 1 }, degree: { color: "#60A5FA", fontSize: 10, fontWeight: "900", letterSpacing: 0.5 } });
