import { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { GlbAnatomyViewer } from "@/components/glb-anatomy-viewer";
import { ProfessionalMuscleAtlas } from "@/components/professional-muscle-atlas";
import { rankedExercisesForMuscleFocus, type MuscleFocus, type MuscleGroup } from "@/shared/fitness";

type Props = { onAddExercise: (exerciseId: string) => void };

export function WorkoutMuscleAtlas({ onAddExercise }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"model" | "detail">("model");
  const [view, setView] = useState<"front" | "back">("front");
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>();
  const [focus, setFocus] = useState<MuscleFocus>();
  const ranked = useMemo(() => rankedExercisesForMuscleFocus(focus).slice(0, 5), [focus]);

  const selectGroup = (group: MuscleGroup) => { setSelectedGroup(group); setFocus(undefined); };
  const selectFocus = (nextFocus: MuscleFocus) => { setFocus(nextFocus); setSelectedGroup(nextFocus.group); };

  return <>
    <TouchableOpacity accessibilityRole="button" onPress={() => setOpen(true)} style={styles.trigger}>
      <View style={styles.triggerIcon}><MaterialIcons name="accessibility-new" size={21} color="#10150B" /></View>
      <View style={{ flex: 1 }}><Text style={styles.triggerTitle}>3D kas atlasını aç</Text><Text style={styles.triggerCopy}>Hedef kasını seç; sana uygun hareketleri doğru sırayla ekle.</Text></View>
      <MaterialIcons name="chevron-right" size={23} color="#B8FF3D" />
    </TouchableOpacity>
    <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
      <View style={styles.page}>
        <View style={styles.header}><View style={{ flex: 1 }}><Text style={styles.eyebrow}>CANLI ANTRENMAN ARACI</Text><Text style={styles.title}>Kas atlası</Text></View><TouchableOpacity accessibilityRole="button" onPress={() => setOpen(false)} style={styles.close}><MaterialIcons name="close" size={21} color="#F5F7FA" /></TouchableOpacity></View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.note}><MaterialIcons name="info-outline" size={18} color="#A9E8EF" /><Text style={styles.noteText}>Atlas, çalışmak istediğin bölgeyi görselleştirir. Ayrıntılı bölgede seçtiğin kas için doğrudan hedefleyen hareketler önce sıralanır.</Text></View>
          <View style={styles.switcher}><TouchableOpacity onPress={() => setMode("model")} style={[styles.switchItem, mode === "model" && styles.switchActive]}><Text style={[styles.switchText, mode === "model" && styles.switchTextActive]}>3D görünüm</Text></TouchableOpacity><TouchableOpacity onPress={() => setMode("detail")} style={[styles.switchItem, mode === "detail" && styles.switchActive]}><Text style={[styles.switchText, mode === "detail" && styles.switchTextActive]}>Ayrıntılı seçim</Text></TouchableOpacity></View>
          {mode === "model" ? <View><GlbAnatomyViewer selected={selectedGroup} onSelect={selectGroup} /><Text style={styles.helper}>3D modelde kas grubunu seç; tek tek baş/katman seçimi için Ayrıntılı seçim sekmesini kullan.</Text></View> : <ProfessionalMuscleAtlas selected={focus} onSelect={selectFocus} view={view} onViewChange={setView} />}
          {focus ? <View style={styles.results}><Text style={styles.resultsEyebrow}>SEÇİLEN BÖLGE</Text><Text style={styles.resultsTitle}>{focus.label}</Text><Text style={styles.resultsCopy}>Doğrudan bu bölgeyi hedefleyen hareketler üstte; aynı ana kas grubunu destekleyenler altta görünür.</Text>{ranked.map((exercise, index) => <View key={exercise.id} style={styles.exerciseCard}><View style={styles.exerciseRow}><View style={styles.rank}><Text style={styles.rankText}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseMeta}>{exercise.equipment} · {exercise.primaryMuscles.join(" · ")}</Text></View><TouchableOpacity accessibilityRole="button" onPress={() => { onAddExercise(exercise.id); setOpen(false); }} style={styles.add}><MaterialIcons name="add" size={20} color="#10150B" /></TouchableOpacity></View></View>)}</View> : selectedGroup ? <View style={styles.groupHint}><MaterialIcons name="touch-app" size={19} color="#B8FF3D" /><Text style={styles.groupHintText}>{selectedGroup} seçildi. Hedef bölgeye özel sıralama için Ayrıntılı seçim sekmesinden kasın üzerine dokun.</Text></View> : null}
        </ScrollView>
      </View>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  trigger: { marginTop: 16, minHeight: 70, backgroundColor: "#111D1D", borderColor: "#245356", borderWidth: 1, borderRadius: 18, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }, triggerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#B8FF3D" }, triggerTitle: { color: "#EAF8D5", fontSize: 13, fontWeight: "900" }, triggerCopy: { color: "#9EC1C4", fontSize: 10, lineHeight: 14, marginTop: 3 },
  page: { flex: 1, backgroundColor: "#0B0E12" }, header: { paddingTop: 25, paddingHorizontal: 20, paddingBottom: 15, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#263141" }, eyebrow: { color: "#B8FF3D", fontSize: 9, fontWeight: "900", letterSpacing: 0.8 }, title: { color: "#F5F7FA", fontSize: 25, lineHeight: 31, fontWeight: "900", marginTop: 2 }, close: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748" }, content: { padding: 20, paddingBottom: 48 }, note: { flexDirection: "row", gap: 9, padding: 12, borderRadius: 15, backgroundColor: "#102022", borderWidth: 1, borderColor: "#245356" }, noteText: { flex: 1, color: "#BDE9EA", fontSize: 11, lineHeight: 16 }, switcher: { marginTop: 16, padding: 4, backgroundColor: "#141A22", borderRadius: 15, flexDirection: "row" }, switchItem: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 11 }, switchActive: { backgroundColor: "#B8FF3D" }, switchText: { color: "#9AA6B5", fontSize: 11, fontWeight: "900" }, switchTextActive: { color: "#10150B" }, helper: { color: "#9AA6B5", fontSize: 10, lineHeight: 15, marginTop: 9, paddingHorizontal: 3 }, results: { marginTop: 20, gap: 9 }, resultsEyebrow: { color: "#B8FF3D", fontSize: 9, letterSpacing: 0.8, fontWeight: "900" }, resultsTitle: { color: "#F5F7FA", fontSize: 20, fontWeight: "900", marginTop: 2 }, resultsCopy: { color: "#9AA6B5", fontSize: 11, lineHeight: 16, marginBottom: 4 }, exerciseCard: { padding: 12, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748", borderRadius: 16 }, exerciseRow: { flexDirection: "row", alignItems: "center", gap: 10 }, rank: { width: 25, height: 25, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#162231" }, rankText: { color: "#7FB4FF", fontSize: 11, fontWeight: "900" }, exerciseName: { color: "#F5F7FA", fontSize: 13, fontWeight: "900" }, exerciseMeta: { color: "#9AA6B5", fontSize: 10, marginTop: 3 }, add: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#B8FF3D" }, groupHint: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 14, backgroundColor: "#1B2A17", borderColor: "#526D24", borderWidth: 1, marginTop: 17 }, groupHintText: { color: "#D8F6AA", fontSize: 11, lineHeight: 16, flex: 1 },
});
