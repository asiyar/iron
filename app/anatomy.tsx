import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { GlbAnatomyViewer } from "@/components/glb-anatomy-viewer";
import { ProfessionalMuscleAtlas } from "@/components/professional-muscle-atlas";
import { PrimaryButton, ui } from "@/components/fitness-ui";
import { EXERCISES, rankedExercisesForMuscleFocus, type MuscleFocus, type MuscleGroup } from "@/shared/fitness";

export default function AnatomyScreen() {
  const router = useRouter();
  const [view, setView] = useState<"front" | "back">("front");
  const [selectedFocus, setSelectedFocus] = useState<MuscleFocus>();
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>();
  const [glbFailed, setGlbFailed] = useState(false);
  const detailedAtlas = Platform.OS === "web" || glbFailed;
  const selected = selectedFocus?.group ?? selectedGroup;
  const exercises = selectedFocus ? rankedExercisesForMuscleFocus(selectedFocus) : selected ? EXERCISES.filter((exercise) => exercise.primaryMuscles.includes(selected)) : [];
  const sourceUrl = Platform.OS === "web" || glbFailed ? "https://github.com/vulovix/body-muscles" : "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html";
  const sourceLabel = Platform.OS === "web" || glbFailed ? "Ayrıntılı harita: Body Muscles · Apache-2.0" : "3D veri: BodyParts3D · CC BY 4.0";

  return <View style={ui.page}><FlatList data={exercises} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
    ListHeaderComponent={<>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={20} color="#D7DEE8" /><Text style={styles.backText}>Kütüphane</Text></TouchableOpacity>
      <Text style={ui.eyebrow}>{detailedAtlas ? "Ayrıntılı Kas Atlası" : "BodyParts3D Kas Atlası"}</Text><Text style={ui.h1}>Hedefini seç.</Text>
      <Text style={[ui.body, { marginTop: 8 }]}>{detailedAtlas ? "70'ten fazla anatomik bölgeden oluşan ön ve arka kas haritasında hedefini seçebilirsin." : "Gerçek yüzeysel kas modelini sürükleyerek döndür; geliştirmek istediğin kas bölgesine doğrudan dokun."}</Text>
      <View style={{ marginTop: 20 }}>{detailedAtlas ? <ProfessionalMuscleAtlas selected={selectedFocus} onSelect={(focus) => { setSelectedFocus(focus); setSelectedGroup(focus.group); }} view={view} onViewChange={setView} /> : <GlbAnatomyViewer selected={selectedGroup} onSelect={(group) => { setSelectedGroup(group); setSelectedFocus(undefined); }} onFailure={() => setGlbFailed(true)} />}</View>
      <TouchableOpacity style={styles.source} onPress={() => Linking.openURL(sourceUrl)}><MaterialIcons name="verified" size={15} color="#9CA9B9" /><Text style={styles.sourceText}>{sourceLabel}</Text><MaterialIcons name="open-in-new" size={14} color="#9CA9B9" /></TouchableOpacity>
      {selected ? <View style={styles.selection}><View style={styles.selectionTitleRow}><View style={styles.selectionDot} /><Text style={styles.selectionTitle}>{selectedFocus?.label ?? selected} için egzersizler</Text></View><Text style={styles.selectionCopy}>{exercises.length ? selectedFocus ? "Bölgeye doğrudan yük bindiren hareketler önce, aynı kas grubunu destekleyenler sonra sıralandı." : "Bu kası hedefleyen hareketleri form rehberiyle açabilir veya kütüphanene göre keşfedebilirsin." : "Bu kas için kütüphanede henüz eşleşen hareket yok."}</Text></View> : <View style={styles.tip}><MaterialIcons name="touch-app" size={18} color="#B8FF3D" /><Text style={styles.tipText}>Kaslara dokunarak kişiselleştirilmiş hareket önerilerini aç.</Text></View>}
    </>}
    renderItem={({ item }) => <TouchableOpacity onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: item.id } })} style={styles.exercise}><View style={styles.exerciseIcon}><MaterialIcons name="fitness-center" size={19} color="#60A5FA" /></View><View style={{ flex: 1 }}><Text style={styles.exerciseName}>{item.name}</Text><Text style={styles.exerciseMeta}>{item.equipment} · {item.primaryMuscles.join(" · ")}</Text></View><MaterialIcons name="play-circle-outline" size={23} color="#B8FF3D" /></TouchableOpacity>}
    ListFooterComponent={selected ? <View style={{ marginTop: 12 }}><PrimaryButton label="Kütüphanede filtrele" onPress={() => router.push({ pathname: "/exercise-library", params: { muscle: selected } })} icon="filter-list" /></View> : null}
  /></View>;
}

const styles = StyleSheet.create({ list: { padding: 20, paddingBottom: 44, gap: 10 }, back: { marginTop: 12, marginBottom: 26, flexDirection: "row", alignItems: "center", gap: 7 }, backText: { color: "#C5CDD7", fontSize: 13, fontWeight: "800" }, source: { marginTop: 10, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 9, backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748" }, sourceText: { color: "#9CA9B9", fontSize: 10, fontWeight: "800" }, selection: { marginTop: 22, marginBottom: 2 }, selectionTitleRow: { flexDirection: "row", gap: 8, alignItems: "center" }, selectionDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#B8FF3D" }, selectionTitle: { color: "#F5F7FA", fontSize: 18, fontWeight: "900" }, selectionCopy: { color: "#9AA6B5", fontSize: 12, lineHeight: 18, marginTop: 7 }, tip: { flexDirection: "row", gap: 9, alignItems: "center", marginTop: 20, padding: 13, borderWidth: 1, borderColor: "#526D2444", backgroundColor: "#161F16", borderRadius: 15 }, tipText: { color: "#C5CDD7", fontSize: 12, lineHeight: 17, flex: 1 }, exercise: { backgroundColor: "#141A22", borderColor: "#263141", borderWidth: 1, borderRadius: 18, padding: 13, flexDirection: "row", alignItems: "center", gap: 11 }, exerciseIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#162231", alignItems: "center", justifyContent: "center" }, exerciseName: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, exerciseMeta: { color: "#9AA6B5", fontSize: 11, marginTop: 4 } });
