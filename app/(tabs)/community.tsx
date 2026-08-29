import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Card, EmptyState, PrimaryButton, ui } from "@/components/fitness-ui";
import { useFitness } from "@/lib/fitness-store";
import { trpc } from "@/lib/trpc";
import type { WorkoutTemplate } from "@/shared/fitness";

type CommunityProgram = {
  id: number;
  title: string;
  summary: string;
  goal: string;
  visibility: "private_link" | "public";
  shareCode: string;
  templateJson: string;
  createdAt: Date;
  authorName: string | null;
};

export default function CommunityScreen() {
  const router = useRouter();
  const { importTemplate } = useFitness();
  const programs = trpc.community.publicList.useQuery();
  const [codeModal, setCodeModal] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const privateProgram = trpc.community.byCode.useQuery({ shareCode: shareCode.trim() }, { enabled: false });

  const importProgram = (program: Pick<CommunityProgram, "title" | "templateJson">) => {
    try {
      const template = JSON.parse(program.templateJson) as Pick<WorkoutTemplate, "name" | "exercises">;
      if (!template?.name || !Array.isArray(template.exercises)) throw new Error("invalid-template");
      importTemplate({ ...template, name: template.name || program.title });
      Alert.alert("Program eklendi", `${program.title} antrenman kütüphanene kopyalandı.`);
    } catch {
      Alert.alert("Program açılamadı", "Bu paylaşımın program verisi okunamadı.");
    }
  };

  const openByCode = async () => {
    if (shareCode.trim().length < 6) return Alert.alert("Kod gerekli", "Antrenörünün paylaştığı kodu gir.");
    const response = await privateProgram.refetch();
    if (!response.data) return Alert.alert("Program bulunamadı", "Kodu kontrol ederek tekrar dene.");
    importProgram(response.data);
    setCodeModal(false);
    setShareCode("");
  };

  const renderProgram = ({ item }: { item: CommunityProgram }) => (
    <Card>
      <View style={styles.programHead}>
        <View style={styles.coachMark}><MaterialIcons name="fitness-center" size={19} color="#B8FF3D" /></View>
        <View style={{ flex: 1 }}><Text style={styles.programTitle}>{item.title}</Text><Text style={styles.coachName}>{item.authorName ?? "IronPulse Antrenörü"}</Text></View>
        <View style={styles.publicPill}><MaterialIcons name="public" size={12} color="#60A5FA" /><Text style={styles.publicPillText}>Açık</Text></View>
      </View>
      <Text style={styles.programSummary}>{item.summary}</Text>
      <View style={styles.goalRow}><MaterialIcons name="flag" size={15} color="#F97316" /><Text style={styles.goal}>{item.goal}</Text></View>
      <TouchableOpacity onPress={() => importProgram(item)} style={styles.importButton}><Text style={styles.importText}>Programı kütüphaneme ekle</Text><MaterialIcons name="add-circle-outline" size={18} color="#10150B" /></TouchableOpacity>
    </Card>
  );

  const header = (
    <>
      <View style={styles.header}><Text style={ui.eyebrow}>Topluluk</Text><Text style={ui.h1}>Daha güçlü planlar.</Text><Text style={[ui.body, { marginTop: 8 }]}>Antrenör programlarını kütüphanene ekle ya da kendi planını seçtiğin kişilerle paylaş.</Text></View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push("/community/publish")} style={styles.publishAction}><MaterialIcons name="upload-file" size={20} color="#10150B" /><Text style={styles.publishText}>Program paylaş</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setCodeModal(true)} style={styles.codeAction}><MaterialIcons name="vpn-key" size={19} color="#D7DEE8" /><Text style={styles.codeText}>Kodla aç</Text></TouchableOpacity>
      </View>
      <View style={styles.privateNote}><MaterialIcons name="lock-outline" size={16} color="#9AA6B5" /><Text style={styles.privateCopy}>Yeni programlar varsayılan olarak özel bağlantıyla paylaşılır.</Text></View>
      <Text style={styles.sectionTitle}>Açık programlar</Text>
    </>
  );

  return (
    <View style={ui.page}>
      <FlatList
        data={programs.data ?? []}
        renderItem={renderProgram}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={programs.isFetching}
        onRefresh={() => programs.refetch()}
        ListHeaderComponent={header}
        ListEmptyComponent={programs.isLoading ? <ActivityIndicator color="#B8FF3D" style={{ marginTop: 30 }} /> : <EmptyState icon="groups" title="Henüz açık program yok" copy="İlk antrenör programını paylaşarak topluluğu başlatabilirsin." action="Program paylaş" onAction={() => router.push("/community/publish")} />}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
      <Modal animationType="slide" transparent visible={codeModal} onRequestClose={() => setCodeModal(false)}>
        <View style={styles.modalShade}><View style={styles.modal}><View style={styles.modalGrip} /><Text style={styles.modalTitle}>Özel programı aç</Text><Text style={styles.modalCopy}>Antrenörün sana verdiği paylaşım kodunu gir. Kod, programı yalnızca senin kütüphanene kopyalar.</Text><TextInput autoCapitalize="characters" value={shareCode} onChangeText={setShareCode} placeholder="Örn. A1B2C3D4" placeholderTextColor="#657386" style={styles.codeInput} maxLength={32} /><PrimaryButton label={privateProgram.isFetching ? "Aranıyor…" : "Programı aç"} onPress={openByCode} icon="arrow-forward" /><TouchableOpacity onPress={() => setCodeModal(false)} style={styles.cancel}><Text style={styles.cancelText}>Vazgeç</Text></TouchableOpacity></View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 116, gap: 12 }, header: { paddingTop: 12, marginBottom: 20 }, actions: { flexDirection: "row", gap: 10 }, publishAction: { flex: 1.25, minHeight: 50, backgroundColor: "#B8FF3D", borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 }, publishText: { color: "#10150B", fontSize: 13, fontWeight: "900" }, codeAction: { flex: 1, minHeight: 50, borderWidth: 1, borderColor: "#344154", backgroundColor: "#141A22", borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 }, codeText: { color: "#D7DEE8", fontSize: 13, fontWeight: "800" }, privateNote: { flexDirection: "row", gap: 7, alignItems: "center", marginTop: 14 }, privateCopy: { color: "#9AA6B5", flex: 1, fontSize: 11, lineHeight: 16 }, sectionTitle: { color: "#F5F7FA", fontSize: 18, fontWeight: "900", marginTop: 24, marginBottom: 1 },
  programHead: { flexDirection: "row", gap: 10, alignItems: "center" }, coachMark: { width: 37, height: 37, borderRadius: 13, backgroundColor: "#273116", alignItems: "center", justifyContent: "center" }, programTitle: { color: "#F5F7FA", fontSize: 15, fontWeight: "900" }, coachName: { color: "#9AA6B5", fontSize: 11, marginTop: 3 }, publicPill: { flexDirection: "row", gap: 4, alignItems: "center", backgroundColor: "#172537", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 99 }, publicPillText: { color: "#8BC4FF", fontSize: 10, fontWeight: "900" }, programSummary: { color: "#C5CDD7", fontSize: 13, lineHeight: 19, marginTop: 14 }, goalRow: { marginTop: 12, flexDirection: "row", gap: 6, alignItems: "center" }, goal: { color: "#F9B371", fontSize: 12, fontWeight: "800" }, importButton: { marginTop: 16, minHeight: 44, borderRadius: 13, backgroundColor: "#B8FF3D", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, importText: { color: "#10150B", fontSize: 13, fontWeight: "900" },
  modalShade: { flex: 1, backgroundColor: "#000000AA", justifyContent: "flex-end" }, modal: { backgroundColor: "#141A22", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 42, borderTopWidth: 1, borderColor: "#344154" }, modalGrip: { alignSelf: "center", width: 42, height: 4, borderRadius: 4, backgroundColor: "#526070", marginBottom: 18 }, modalTitle: { color: "#F5F7FA", fontSize: 21, fontWeight: "900" }, modalCopy: { color: "#9AA6B5", fontSize: 13, lineHeight: 19, marginTop: 8 }, codeInput: { marginTop: 19, backgroundColor: "#0B0E12", borderWidth: 1, borderColor: "#344154", borderRadius: 14, color: "#F5F7FA", paddingHorizontal: 14, minHeight: 50, fontSize: 16, fontWeight: "900", letterSpacing: 1.5 }, cancel: { alignItems: "center", marginTop: 16, minHeight: 34, justifyContent: "center" }, cancelText: { color: "#9AA6B5", fontWeight: "800" },
});
