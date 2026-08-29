import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

import type { MuscleGroup } from "@/shared/fitness";

type MuscleAtlasProps = { selected?: MuscleGroup; onSelect: (muscle: MuscleGroup) => void; view: "front" | "back"; onViewChange: (view: "front" | "back") => void };

const accents: Record<MuscleGroup, string> = { Göğüs: "#FF8765", Sırt: "#60A5FA", Omuz: "#D28CFF", Biceps: "#F9B371", Triceps: "#F9B371", Quadriceps: "#B8FF3D", Hamstring: "#B8FF3D", Glute: "#FF6FAE", Core: "#FFD166", Baldır: "#7CE9DD" };

function Region({ d, muscle, selected, onSelect }: { d: string; muscle: MuscleGroup; selected?: MuscleGroup; onSelect: (muscle: MuscleGroup) => void }) {
  const active = selected === muscle;
  return <Path d={d} fill={active ? accents[muscle] : `${accents[muscle]}55`} stroke={active ? "#F5F7FA" : `${accents[muscle]}99`} strokeWidth={active ? 2.3 : 1.1} onPress={() => onSelect(muscle)} />;
}

export function MuscleAtlas({ selected, onSelect, view, onViewChange }: MuscleAtlasProps) {
  // React Compiler render sırasında ref okumayı uyarır; lazy useState aynı kalıcılığı sağlar.
  const [flip] = useState(() => new Animated.Value(view === "front" ? 0 : 1));
  useEffect(() => { Animated.timing(flip, { toValue: view === "front" ? 0 : 1, duration: 280, useNativeDriver: true }).start(); }, [flip, view]);
  const rotation = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const label = selected ? `${selected} seçili` : "Bir kas bölgesine dokun";

  return <View style={styles.wrap}>
    <View style={styles.controls}><TouchableOpacity onPress={() => onViewChange("front")} style={[styles.side, view === "front" && styles.sideActive]}><Text style={[styles.sideText, view === "front" && styles.sideTextActive]}>Ön</Text></TouchableOpacity><TouchableOpacity onPress={() => onViewChange("back")} style={[styles.side, view === "back" && styles.sideActive]}><Text style={[styles.sideText, view === "back" && styles.sideTextActive]}>Arka</Text></TouchableOpacity></View>
    <Animated.View style={[styles.canvas, { transform: [{ perspective: 900 }, { rotateY: rotation }] }]}>
      <Svg width="245" height="390" viewBox="0 0 260 430">
        <Defs><LinearGradient id="skin" x1="0" x2="1" y1="0" y2="1"><Stop offset="0" stopColor="#2B3542" /><Stop offset="1" stopColor="#151C26" /></LinearGradient><LinearGradient id="edge" x1="0" x2="1"><Stop offset="0" stopColor="#3D4A5E" /><Stop offset="1" stopColor="#1B2430" /></LinearGradient></Defs>
        <Circle cx="130" cy="43" r="26" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        <Path d="M112 67 L148 67 L153 91 L107 91 Z" fill="url(#edge)" />
        <Path d="M91 91 C101 79 112 81 130 83 C148 81 159 79 169 91 L185 201 L161 238 L99 238 L75 201 Z" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        <Path d="M75 96 C59 105 57 143 62 183 L76 238 L94 230 L89 169 Z" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        <Path d="M185 96 C201 105 203 143 198 183 L184 238 L166 230 L171 169 Z" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        <Path d="M100 235 L128 240 L123 335 L91 397 L69 394 L87 318 Z" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        <Path d="M160 235 L132 240 L137 335 L169 397 L191 394 L173 318 Z" fill="url(#skin)" stroke="#536174" strokeWidth="2" />
        {view === "front" ? <G>
          <Region muscle="Omuz" selected={selected} onSelect={onSelect} d="M87 98 C95 85 108 89 111 105 L102 130 L82 124 Z" /><Region muscle="Omuz" selected={selected} onSelect={onSelect} d="M173 98 C165 85 152 89 149 105 L158 130 L178 124 Z" />
          <Region muscle="Göğüs" selected={selected} onSelect={onSelect} d="M105 111 C113 101 128 104 128 123 L126 146 C114 145 103 141 96 130 Z" /><Region muscle="Göğüs" selected={selected} onSelect={onSelect} d="M155 111 C147 101 132 104 132 123 L134 146 C146 145 157 141 164 130 Z" />
          <Region muscle="Biceps" selected={selected} onSelect={onSelect} d="M73 131 C83 128 91 141 90 158 L85 180 C75 181 67 173 66 158 Z" /><Region muscle="Biceps" selected={selected} onSelect={onSelect} d="M187 131 C177 128 169 141 170 158 L175 180 C185 181 193 173 194 158 Z" />
          <Region muscle="Core" selected={selected} onSelect={onSelect} d="M112 148 L148 148 L154 211 L130 227 L106 211 Z" />
          <Region muscle="Quadriceps" selected={selected} onSelect={onSelect} d="M94 248 C106 239 120 244 122 264 L116 316 L88 311 Z" /><Region muscle="Quadriceps" selected={selected} onSelect={onSelect} d="M166 248 C154 239 140 244 138 264 L144 316 L172 311 Z" />
          <Region muscle="Baldır" selected={selected} onSelect={onSelect} d="M88 323 C101 318 113 327 111 348 L94 389 L75 387 Z" /><Region muscle="Baldır" selected={selected} onSelect={onSelect} d="M172 323 C159 318 147 327 149 348 L166 389 L185 387 Z" />
        </G> : <G transform="translate(260, 0) scale(-1, 1)">
          <Region muscle="Omuz" selected={selected} onSelect={onSelect} d="M87 98 C95 85 108 89 111 105 L102 130 L82 124 Z" /><Region muscle="Omuz" selected={selected} onSelect={onSelect} d="M173 98 C165 85 152 89 149 105 L158 130 L178 124 Z" />
          <Region muscle="Sırt" selected={selected} onSelect={onSelect} d="M104 110 C115 101 145 101 156 110 L169 185 L151 210 L109 210 L91 185 Z" />
          <Region muscle="Triceps" selected={selected} onSelect={onSelect} d="M74 132 C85 129 92 141 90 163 L84 187 C74 186 67 177 67 160 Z" /><Region muscle="Triceps" selected={selected} onSelect={onSelect} d="M186 132 C175 129 168 141 170 163 L176 187 C186 186 193 177 193 160 Z" />
          <Region muscle="Glute" selected={selected} onSelect={onSelect} d="M101 216 C112 207 128 211 130 229 L127 248 L99 252 L91 236 Z" /><Region muscle="Glute" selected={selected} onSelect={onSelect} d="M159 216 C148 207 132 211 130 229 L133 248 L161 252 L169 236 Z" />
          <Region muscle="Hamstring" selected={selected} onSelect={onSelect} d="M95 252 C107 245 120 251 121 272 L116 317 L89 311 Z" /><Region muscle="Hamstring" selected={selected} onSelect={onSelect} d="M165 252 C153 245 140 251 139 272 L144 317 L171 311 Z" />
          <Region muscle="Baldır" selected={selected} onSelect={onSelect} d="M88 323 C101 318 113 327 111 348 L94 389 L75 387 Z" /><Region muscle="Baldır" selected={selected} onSelect={onSelect} d="M172 323 C159 318 147 327 149 348 L166 389 L185 387 Z" />
        </G>}
      </Svg>
    </Animated.View>
    <View style={styles.status}><View style={[styles.dot, { backgroundColor: selected ? accents[selected] : "#657386" }]} /><Text style={styles.statusText}>{label}</Text><Text style={styles.degree}>360°</Text></View>
  </View>;
}

const styles = StyleSheet.create({ wrap: { backgroundColor: "#101720", borderColor: "#2C3A4C", borderWidth: 1, borderRadius: 26, overflow: "hidden" }, controls: { flexDirection: "row", alignSelf: "center", marginTop: 14, padding: 4, borderRadius: 14, backgroundColor: "#0B0E12" }, side: { minWidth: 68, paddingVertical: 8, alignItems: "center", borderRadius: 10 }, sideActive: { backgroundColor: "#B8FF3D" }, sideText: { color: "#9AA6B5", fontSize: 12, fontWeight: "900" }, sideTextActive: { color: "#10150B" }, canvas: { alignItems: "center", justifyContent: "center", minHeight: 400 }, status: { minHeight: 48, backgroundColor: "#141A22", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 }, dot: { width: 9, height: 9, borderRadius: 5 }, statusText: { color: "#D7DEE8", fontSize: 12, fontWeight: "800", flex: 1 }, degree: { color: "#60A5FA", fontSize: 11, fontWeight: "900", letterSpacing: 0.7 } });
