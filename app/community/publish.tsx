import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { PrimaryButton, ui } from "@/components/fitness-ui";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { useFitness } from "@/lib/fitness-store";
import { trpc } from "@/lib/trpc";

export default function PublishProgramScreen() {
  const router = useRouter();
  const { data } = useFitness();
  const { isAuthenticated, loading } = useAuth();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [summary, setSummary] = useState("");
  const [goal, setGoal] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [shareCode, setShareCode] = useState<string>();
  const selected = data.templates.find((template) => template.id === selectedTemplateId);
  const publish = trpc.community.publish.useMutation({
    onSuccess: (result) => setShareCode(result.shareCode),
    onError: () => Alert.alert("Program yayınlanamadı", "Giriş durumunu ve bağlantını kontrol ederek tekrar dene."),
  });

  const createShare = () => {
    if (!isAuthenticated) return startOAuthLogin();
    if (!selected) return Alert.alert("Program seç", "Önce kendi kütüphanenden bir antrenman planı seç.");
    if (summary.trim().length < 12 || goal.trim().length < 2) return Alert.alert("Açıklamayı tamamla", "En az kısa bir açıklama ve program hedefi ekle.");
    publish.mutate({
      title: selected.name,
      summary: summary.trim(),
      goal: goal.trim(),
      visibility: isPublic ? "public" : "private_link",
      templateJson: JSON.stringify(selected),
    });
  };

  if (!loading && !isAuthenticated) {
    return <View style={[ui.page, styles.center]}><View style={styles.lockBadge}><MaterialIcons name="lock" color="#B8FF3D" size={25} /></View><Text style={ui.h2}>Paylaşmak için giriş yap</Text><Text style={[ui.body, styles.centerCopy]}>Programlarının kime ait olduğunu ve özel bağlantılarını güvenle yönetebilmek için bir hesabın olmalı.</Text><View style={styles.fullButton}><PrimaryButton label="Giriş yap" onPress={startOAuthLogin} icon="login" /></View></View>;
  }

  const footer = data.templates.length ? (
    <View>
      <Text style={styles.fieldLabel}>Antrenör notu</Text>
      <TextInput value={summary} onChangeText={setSummary} placeholder="Bu planı kimler için ve nasıl tasarladın?" placeholderTextColor="#657386" multiline style={[styles.input, styles.multiline]} maxLength={1000} />
      <Text style={styles.fieldLabel}>Hedef</Text>
      <TextInput value={goal} onChangeText={setGoal} placeholder="Örn. Güç ve temel hareketler" placeholderTextColor="#657386" style={styles.input} maxLength={120} />
      <View style={styles.visibility}><View style={{ flex: 1 }}><Text style={styles.visibilityTitle}>Toplulukta herkese açık</Text><Text style={styles.visibilityCopy}>{isPublic ? "Program açık listede görünür." : "Yalnızca paylaşım kodunu verdiğin kişiler açabilir."}</Text></View><Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ false: "#344154", true: "#668B26" }} thumbColor={isPublic ? "#B8FF3D" : "#C5CDD7"} /></View>
      <PrimaryButton label={publish.isPending ? "Paylaşılıyor…" : isPublic ? "Toplulukta yayınla" : "Özel kod oluştur"} onPress={createShare} icon="share" />
    </View>
  ) : null;

  return (
    <View style={ui.page}>
      <FlatList
        data={data.templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<><TouchableOpacity onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={20} color="#D7DEE8" /><Text style={styles.backText}>Topluluk</Text></TouchableOpacity><Text style={ui.eyebrow}>Antrenör Alanı</Text><Text style={ui.h1}>Programını paylaş.</Text><Text style={[ui.body, { marginTop: 8 }]}>Bir plan seç, hedefini yaz ve paylaşım görünürlüğünü belirle.</Text><Text style={styles.fieldLabel}>Paylaşılacak plan</Text></>}
        renderItem={({ item }) => <TouchableOpacity onPress={() => setSelectedTemplateId(item.id)} style={[styles.template, selectedTemplateId === item.id && styles.templateActive]}><View style={styles.templateIcon}><MaterialIcons name="fitness-center" size={19} color={selectedTemplateId === item.id ? "#10150B" : "#B8FF3D"} /></View><View style={{ flex: 1 }}><Text style={[styles.templateName, selectedTemplateId === item.id && styles.templateNameActive]}>{item.name}</Text><Text style={[styles.templateMeta, selectedTemplateId === item.id && styles.templateMetaActive]}>{item.exercises.length} egzersiz</Text></View><MaterialIcons name={selectedTemplateId === item.id ? "check-circle" : "radio-button-unchecked"} size={21} color={selectedTemplateId === item.id ? "#10150B" : "#657386"} /></TouchableOpacity>}
        ListEmptyComponent={<View style={styles.emptyPlan}><Text style={styles.emptyPlanTitle}>Paylaşılacak planın yok</Text><Text style={styles.emptyPlanCopy}>Antrenman sekmesinden bir plan oluşturduktan sonra burada paylaşabilirsin.</Text></View>}
        ListFooterComponent={footer}
      />
      <Modal transparent visible={Boolean(shareCode)} animationType="fade"><View style={styles.modalShade}><View style={styles.modal}><View style={styles.successIcon}><MaterialIcons name="check" color="#10150B" size={25} /></View><Text style={styles.modalTitle}>Program hazır</Text><Text style={styles.modalCopy}>{isPublic ? "Programın toplulukta yayımlandı." : "Bu kodu yalnızca programı açmasını istediğin kişilerle paylaş."}</Text><View style={styles.shareCode}><Text style={styles.shareCodeText}>{shareCode}</Text></View><PrimaryButton label="Tamam" onPress={() => { setShareCode(undefined); router.replace("/(tabs)/community"); }} icon="done" /></View></View></Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 44, gap: 10 }, back: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, marginBottom: 26 }, backText: { color: "#C5CDD7", fontSize: 13, fontWeight: "800" }, fieldLabel: { color: "#D7DEE8", fontSize: 13, fontWeight: "900", marginTop: 24, marginBottom: 9 }, template: { borderWidth: 1, borderColor: "#344154", borderRadius: 16, padding: 13, backgroundColor: "#141A22", flexDirection: "row", alignItems: "center", gap: 10 }, templateActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, templateIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#1B2A17", alignItems: "center", justifyContent: "center" }, templateName: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, templateNameActive: { color: "#10150B" }, templateMeta: { color: "#9AA6B5", fontSize: 11, marginTop: 3 }, templateMetaActive: { color: "#38570A" }, input: { minHeight: 50, borderColor: "#344154", borderWidth: 1, borderRadius: 14, color: "#F5F7FA", paddingHorizontal: 14, backgroundColor: "#141A22", fontSize: 14 }, multiline: { minHeight: 92, paddingTop: 13, textAlignVertical: "top" }, visibility: { backgroundColor: "#141A22", borderRadius: 17, borderWidth: 1, borderColor: "#263141", marginTop: 17, marginBottom: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, visibilityTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, visibilityCopy: { color: "#9AA6B5", fontSize: 11, lineHeight: 16, marginTop: 4, maxWidth: 245 }, emptyPlan: { backgroundColor: "#141A22", borderColor: "#344154", borderWidth: 1, borderStyle: "dashed", borderRadius: 18, padding: 19 }, emptyPlanTitle: { color: "#F5F7FA", fontWeight: "900" }, emptyPlanCopy: { color: "#9AA6B5", fontSize: 12, lineHeight: 18, marginTop: 6 }, center: { alignItems: "center", justifyContent: "center", padding: 28 }, lockBadge: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#1B2A17", alignItems: "center", justifyContent: "center", marginBottom: 18 }, centerCopy: { textAlign: "center", marginTop: 9, lineHeight: 20 }, fullButton: { width: "100%", marginTop: 23 }, modalShade: { flex: 1, backgroundColor: "#000000A8", alignItems: "center", justifyContent: "center", padding: 24 }, modal: { width: "100%", backgroundColor: "#141A22", borderColor: "#344154", borderWidth: 1, borderRadius: 24, padding: 23, alignItems: "center" }, successIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#B8FF3D" }, modalTitle: { color: "#F5F7FA", fontSize: 20, fontWeight: "900", marginTop: 15 }, modalCopy: { color: "#9AA6B5", fontSize: 13, textAlign: "center", lineHeight: 19, marginTop: 8 }, shareCode: { width: "100%", backgroundColor: "#0B0E12", borderRadius: 15, borderColor: "#526D24", borderWidth: 1, alignItems: "center", paddingVertical: 15, marginVertical: 18 }, shareCodeText: { color: "#B8FF3D", letterSpacing: 3, fontSize: 22, fontWeight: "900" },
});
