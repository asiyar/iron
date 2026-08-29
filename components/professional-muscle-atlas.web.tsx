import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BodyChart, MUSCLE_MAP, ViewSide, type BodyState } from "body-muscles";

import { muscleFocusForAtlasRegion, type MuscleFocus } from "@/shared/fitness";

type Props = {
  selected?: MuscleFocus;
  onSelect: (muscle: MuscleFocus) => void;
  view: "front" | "back";
  onViewChange: (view: "front" | "back") => void;
};

const buildBodyState = (selected?: MuscleFocus): BodyState => Object.fromEntries(MUSCLE_MAP.map((region) => {
  const focus = muscleFocusForAtlasRegion(region.id);
  const active = focus?.atlasId === selected?.atlasId;
  return [region.id, { intensity: active ? 9 : 0, selected: active }];
}));

export function ProfessionalMuscleAtlas({ selected, onSelect, view, onViewChange }: Props) {
  const host = useRef<HTMLElement | null>(null);
  const chart = useRef<BodyChart | null>(null);
  const bodyState = useMemo(() => buildBodyState(selected), [selected]);

  useEffect(() => {
    if (!host.current) return;
    const instance = new BodyChart(host.current, {
      view: view === "front" ? ViewSide.FRONT : ViewSide.BACK,
      bodyState,
      ariaLabel: "IronPulse ayrıntılı kas atlası",
      showViewLabel: false,
      enableTransitions: true,
      onMuscleClick: (id) => {
        const focus = muscleFocusForAtlasRegion(id);
        if (focus) onSelect(focus);
      },
    });
    chart.current = instance;
    return () => { instance.destroy(); chart.current = null; };
  // The event callback belongs to the chart construction contract; updates use the effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelect]);

  useEffect(() => {
    chart.current?.update({ view: view === "front" ? ViewSide.FRONT : ViewSide.BACK, bodyState });
  }, [bodyState, view]);

  return <View style={styles.wrap}>
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: view === "front" }} onPress={() => onViewChange("front")} style={[styles.side, view === "front" && styles.sideActive]}><Text style={[styles.sideText, view === "front" && styles.sideTextActive]}>Ön</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: view === "back" }} onPress={() => onViewChange("back")} style={[styles.side, view === "back" && styles.sideActive]}><Text style={[styles.sideText, view === "back" && styles.sideTextActive]}>Arka</Text></TouchableOpacity>
    </View>
    <View style={styles.canvas} ref={(node) => { host.current = node as unknown as HTMLElement; }} />
    <View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>{selected ? `${selected.label} seçili` : "Ayrıntılı kas bölgesine dokun"}</Text><Text style={styles.detail}>70+ BÖLGE</Text></View>
  </View>;
}

const styles = StyleSheet.create({ wrap: { backgroundColor: "#101720", borderColor: "#2C3A4C", borderWidth: 1, borderRadius: 26, overflow: "hidden" }, controls: { flexDirection: "row", alignSelf: "center", marginTop: 14, padding: 4, borderRadius: 14, backgroundColor: "#0B0E12", zIndex: 1 }, side: { minWidth: 68, paddingVertical: 8, alignItems: "center", borderRadius: 10 }, sideActive: { backgroundColor: "#B8FF3D" }, sideText: { color: "#9AA6B5", fontSize: 12, fontWeight: "900" }, sideTextActive: { color: "#10150B" }, canvas: { height: 420, width: "100%", paddingHorizontal: 42 }, status: { minHeight: 48, backgroundColor: "#141A22", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 }, dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#B8FF3D" }, statusText: { color: "#D7DEE8", fontSize: 12, fontWeight: "800", flex: 1 }, detail: { color: "#60A5FA", fontSize: 10, fontWeight: "900", letterSpacing: 0.5 } });
