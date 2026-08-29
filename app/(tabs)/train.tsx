import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, PrimaryButton, SectionTitle, ui } from "@/components/fitness-ui";
import { useFitness } from "@/lib/fitness-store";

export default function TrainScreen() {
  const router = useRouter();
  const { data, activeSession, createTemplate, startWorkout } = useFitness();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");

  const create = () => {
    const id = createTemplate(name || "Yeni Plan");
    setName("");
    setCreateOpen(false);
    router.push(`/template/${id}` as never);
  };
  const startFromTemplate = (templateId: string) => {
    if (activeSession) return Alert.alert("Devam eden antrenman", "Yeni bir antrenman başlatmadan önce mevcut antrenmana dönün.", [{ text: "Mevcut antrenmana git", onPress: () => router.push(`/workout/${activeSession.id}` as never) }, { text: "Vazgeç", style: "cancel" }]);
    const id = startWorkout(templateId);
    router.push(`/workout/${id}` as never);
  };
  const freeStart = () => {
    const id = startWorkout();
    router.push(`/workout/${id}` as never);
  };

  return <View style={ui.page}><ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Text style={ui.eyebrow}>Antrenman</Text><Text style={ui.h1}>Planın, gücün.</Text><Text style={[ui.body, { marginTop: 8 }]}>Her seti kaydet; ilerleme hesabını IronPulse yapsın.</Text></View>
    {activeSession ? <Card accent><Text style={ui.eyebrow}>Açık oturum</Text><Text style={styles.activeName}>{activeSession.name}</Text><Text style={ui.body}>{activeSession.exercises.length} egzersiz kaydedildi</Text><View style={{ marginTop: 14 }}><PrimaryButton label="Devam Et" icon="play-arrow" onPress={() => router.push(`/workout/${activeSession.id}` as never)} /></View></Card> : <View style={styles.actionRow}><View style={{ flex: 1 }}><PrimaryButton label="Serbest Başlat" icon="add" onPress={freeStart} /></View><TouchableOpacity onPress={() => setCreateOpen(true)} style={styles.addPlan}><MaterialIcons name="playlist-add" size={23} color="#F5F7FA" /></TouchableOpacity></View>}
    <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/plan-builder" as never)} style={styles.planBuilder}><View style={styles.planBuilderIcon}><MaterialIcons name="auto-awesome" size={22} color="#10150B" /></View><View style={{ flex: 1 }}><Text style={styles.planBuilderEyebrow}>{data.activeGeneratedPlan ? "AKTİF HEDEF PLANI" : "SIFIRDAN BAŞLAYANLAR İÇİN"}</Text><Text style={styles.planBuilderTitle}>{data.activeGeneratedPlan ? data.activeGeneratedPlan.name : "Hedefine göre plan oluştur"}</Text><Text style={styles.planBuilderCopy}>{data.activeGeneratedPlan ? "4 haftalık başlangıç bloğunu ve 12 haftalık yol haritanı gözden geçir." : "Amaç, deneyim, zaman, ekipman ve görünüm yönünü seç; planını birlikte kuralım."}</Text></View><MaterialIcons name="chevron-right" size={23} color="#B8FF3D" /></TouchableOpacity>
    <SectionTitle title="Planlarım" action="Yeni plan" onAction={() => setCreateOpen(true)} />
    {data.templates.length ? <View style={{ gap: 12 }}>{data.templates.map((template) => <Pressable key={template.id} onPress={() => router.push(`/template/${template.id}` as never)} style={({ pressed }) => [styles.template, pressed && { opacity: 0.72 }]}><View style={styles.templateIcon}><MaterialIcons name="fitness-center" color="#B8FF3D" size={22} /></View><View style={{ flex: 1 }}><Text style={styles.templateName}>{template.name}</Text><Text style={styles.templateMeta}>{template.exercises.length ? `${template.exercises.length} egzersiz · ${template.exercises.reduce((sum, item) => sum + item.sets.length, 0)} set` : "Egzersiz ekle"}</Text></View><TouchableOpacity onPress={(event) => { event.stopPropagation(); startFromTemplate(template.id); }} style={styles.playButton}><MaterialIcons name="play-arrow" color="#10150B" size={20} /></TouchableOpacity></Pressable>)}</View> : <EmptyState icon="playlist-add" title="Henüz planın yok" copy="Sürdürülebilir bir rutin için ilk planını oluştur." action="İlk planı oluştur" onAction={() => setCreateOpen(true)} />}
    <SectionTitle title="Kütüphane" />
    <TouchableOpacity onPress={() => router.push("/exercise-library" as never)} style={styles.libraryCard}><View style={styles.libraryIcon}><MaterialIcons name="search" size={22} color="#60A5FA" /></View><View style={{ flex: 1 }}><Text style={styles.templateName}>Egzersiz kütüphanesi</Text><Text style={styles.templateMeta}>Kas grubu ve ekipmana göre seç</Text></View><MaterialIcons name="chevron-right" size={22} color="#788596" /></TouchableOpacity>
  </ScrollView>
  <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}><View style={styles.overlay}><View style={styles.modal}><Text style={styles.modalTitle}>Yeni Plan</Text><Text style={ui.body}>Planına kısa ve anlaşılır bir isim ver.</Text><TextInput value={name} onChangeText={setName} placeholder="Örn. Push A" placeholderTextColor="#657386" returnKeyType="done" onSubmitEditing={create} style={styles.input} autoFocus /><View style={styles.modalActions}><TouchableOpacity onPress={() => setCreateOpen(false)} style={styles.cancel}><Text style={styles.cancelText}>Vazgeç</Text></TouchableOpacity><TouchableOpacity onPress={create} style={styles.confirm}><Text style={styles.confirmText}>Oluştur</Text></TouchableOpacity></View></View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: 12, marginBottom: 24 },
  actionRow: { flexDirection: "row", gap: 12 },
  planBuilder: { marginTop: 15, padding: 14, borderRadius: 20, backgroundColor: "#182516", borderWidth: 1, borderColor: "#547F2D", flexDirection: "row", alignItems: "center", gap: 10 }, planBuilderIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#B8FF3D", alignItems: "center", justifyContent: "center" }, planBuilderEyebrow: { color: "#B8FF3D", fontSize: 9, fontWeight: "900", letterSpacing: 0.7 }, planBuilderTitle: { color: "#F3F9E9", fontSize: 15, fontWeight: "900", marginTop: 2 }, planBuilderCopy: { color: "#BED6AF", fontSize: 10, lineHeight: 15, marginTop: 3 },
  addPlan: { width: 54, height: 54, backgroundColor: "#1B2430", borderColor: "#344154", borderWidth: 1, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  activeName: { color: "#F5F7FA", fontSize: 21, fontWeight: "900", marginTop: 7, marginBottom: 4 },
  template: { flexDirection: "row", alignItems: "center", padding: 13, gap: 12, backgroundColor: "#141A22", borderColor: "#263141", borderWidth: 1, borderRadius: 20 },
  templateIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#1B2A17", alignItems: "center", justifyContent: "center" },
  templateName: { color: "#F5F7FA", fontSize: 15, fontWeight: "800" },
  templateMeta: { color: "#9AA6B5", fontSize: 12, marginTop: 4 },
  playButton: { backgroundColor: "#B8FF3D", width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  libraryCard: { flexDirection: "row", alignItems: "center", padding: 15, gap: 12, backgroundColor: "#141A22", borderColor: "#263141", borderWidth: 1, borderRadius: 20 },
  libraryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#162231", alignItems: "center", justifyContent: "center" },
  overlay: { flex: 1, backgroundColor: "#000000A8", justifyContent: "center", padding: 22 },
  modal: { backgroundColor: "#141A22", borderRadius: 26, borderWidth: 1, borderColor: "#344154", padding: 20 },
  modalTitle: { color: "#F5F7FA", fontSize: 21, fontWeight: "900", marginBottom: 5 },
  input: { color: "#F5F7FA", backgroundColor: "#0B0E12", borderColor: "#344154", borderWidth: 1, borderRadius: 14, fontSize: 16, paddingHorizontal: 14, paddingVertical: 13, marginTop: 18 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 18 },
  cancel: { paddingHorizontal: 16, paddingVertical: 12 },
  cancelText: { color: "#C5CDD7", fontWeight: "800" },
  confirm: { paddingHorizontal: 17, paddingVertical: 12, backgroundColor: "#B8FF3D", borderRadius: 13 },
  confirmText: { color: "#10150B", fontWeight: "900" },
});
