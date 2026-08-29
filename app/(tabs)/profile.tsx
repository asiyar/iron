import { MaterialIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Card, SectionTitle, ui } from "@/components/fitness-ui";
import { requestHealthPermissionAndSync, syncHealthData } from "@/lib/health-sync";
import { useFitness } from "@/lib/fitness-store";
import { saveBiometricPreference } from "@/lib/secure-preferences";
import { useThemeContext, type ThemePreference } from "@/lib/theme-provider";

type BiometricState = "checking" | "available" | "unavailable" | "web";

export default function ProfileScreen() {
  const router = useRouter();
  const { data, applyHealthSnapshot, updateSettings } = useFitness();
  const { themePreference, setThemePreference } = useThemeContext();
  const [biometricState, setBiometricState] = useState<BiometricState>(Platform.OS === "web" ? "web" : "checking");
  const [biometricLabel, setBiometricLabel] = useState("Biyometrik kilit");
  const [syncingHealth, setSyncingHealth] = useState(false);
  const recentVideos = data.videoWatchHistory.slice(0, 3);

  useEffect(() => {
    if (Platform.OS === "web") return;
    Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync(), LocalAuthentication.supportedAuthenticationTypesAsync()]).then(([hasHardware, enrolled, types]) => {
      if (!hasHardware || !enrolled) return setBiometricState("unavailable");
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) setBiometricLabel("Face ID ile kilit");
      else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) setBiometricLabel("Touch ID / parmak izi kilidi");
      setBiometricState("available");
    }).catch(() => setBiometricState("unavailable"));
  }, []);

  const setBiometric = async (enabled: boolean) => {
    if (!enabled) {
      updateSettings({ biometricLockEnabled: false });
      saveBiometricPreference(false).catch(() => undefined);
      return;
    }
    if (Platform.OS === "web") return Alert.alert("Yerel cihazda kullanılabilir", "Face ID, Touch ID ve Android biyometrik doğrulama bir iOS veya Android derlemesinde etkinleşir.");
    if (biometricState !== "available") return Alert.alert("Biyometri hazır değil", "Cihaz ayarlarından bir yüz veya parmak izi tanımlayın; ardından tekrar deneyin.");
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: "IronPulse biyometrik kilidini etkinleştir", fallbackLabel: "Cihaz parolasını kullan", cancelLabel: "Vazgeç" });
    if (!result.success) return;
    updateSettings({ biometricLockEnabled: true });
    saveBiometricPreference(true).catch(() => undefined);
  };

  const connectHealth = async () => {
    setSyncingHealth(true);
    const snapshot = await requestHealthPermissionAndSync();
    applyHealthSnapshot(snapshot);
    setSyncingHealth(false);
    if (snapshot.status !== "connected") Alert.alert("Senkronizasyon durumu", snapshot.message ?? "Sağlık verisi senkronize edilemedi.");
  };

  const refreshHealth = async () => {
    setSyncingHealth(true);
    const snapshot = await syncHealthData();
    applyHealthSnapshot(snapshot);
    setSyncingHealth(false);
    if (snapshot.status !== "connected") Alert.alert("Senkronizasyon durumu", snapshot.message ?? "Sağlık verisi senkronize edilemedi.");
  };

  const biometricDescription = biometricState === "available" ? `Uygulama arka plandan döndükten sonra ${data.settings.lockTimeoutMinutes} dakika içinde biyometri ister.` : biometricState === "web" ? "Web önizlemesinde cihaz biyometrisi kullanılamaz." : "Cihazında yüz veya parmak izi tanımlanmadı.";
  return <View style={ui.page}><ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View style={styles.avatar}><MaterialIcons name="bolt" size={28} color="#B8FF3D" /></View><View><Text style={ui.eyebrow}>IronPulse</Text><Text style={ui.h1}>Spor profilin</Text></View></View>
    <Card accent><View style={styles.privacyHead}><View style={styles.privacyIcon}><MaterialIcons name="shield" size={22} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.privacyTitle}>Yerel öncelikli</Text><Text style={styles.privacyCopy}>Antrenman kayıtların bu cihazda saklanır.</Text></View></View></Card>
    <SectionTitle title="Eğitim videoları" />
    <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/favorites" as never)} style={styles.favoritesCard}><View style={styles.favoritesIcon}><MaterialIcons name="favorite" size={21} color="#F3A6B9" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Favori Videolar</Text><Text style={styles.settingCopy}>{data.videoFavorites.length ? `${data.videoFavorites.length} eğitim rehberini sonra izlemek için kaydettin.` : "Beğendiğin doğrulanmış eğitim rehberlerini sonra izlemek için kaydet."}</Text></View><MaterialIcons name="chevron-right" size={22} color="#B8FF3D" /></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/watch-history" as never)} style={styles.historyCard}><View style={styles.historyTop}><View style={styles.historyIcon}><MaterialIcons name="history" size={21} color="#7CE9DD" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>İzleme Geçmişi</Text><Text style={styles.settingCopy}>{recentVideos.length ? `Son açılan rehberler ve tekrar izleme sayıları.` : "Açtığın eğitim videoları ve teknik rehberler burada görünür."}</Text></View><MaterialIcons name="chevron-right" size={22} color="#7CE9DD" /></View>{recentVideos.length ? <View style={styles.historyItems}>{recentVideos.map((item) => <View key={`${item.exerciseId}-${item.url}`} style={styles.historyItem}><Text numberOfLines={1} style={styles.historyTitle}>{item.title}</Text><Text style={styles.historyMeta}>{item.provider} · {item.watchCount}× açıldı</Text></View>)}</View> : null}</TouchableOpacity>
    <SectionTitle title="Sağlık senkronizasyonu" />
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="monitor-heart" size={21} color="#F97316" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Apple Health / Health Connect</Text><Text style={styles.settingCopy}>{data.healthSync.status === "connected" ? `Son eşitleme: ${data.healthSync.lastSyncedAt ? new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(data.healthSync.lastSyncedAt)) : "az önce"}` : "Antrenman, adım ve vücut ağırlığını yalnızca izninle eşitle."}</Text></View></View><View style={styles.healthMetrics}>{data.healthSync.status === "connected" ? <><View style={styles.healthMetric}><Text style={styles.healthMetricValue}>{data.healthSync.stepsToday?.toLocaleString("tr-TR") ?? "—"}</Text><Text style={styles.healthMetricLabel}>Bugünün adımı</Text></View><View style={styles.healthMetric}><Text style={styles.healthMetricValue}>{data.healthSync.latestWeight ? `${data.healthSync.latestWeight.value} kg` : "—"}</Text><Text style={styles.healthMetricLabel}>Son ölçüm</Text></View></> : <Text style={styles.healthHint}>Paylaşım ve öneri ekranlarına hiçbir ham sağlık verisi aktarılmaz.</Text>}</View><TouchableOpacity onPress={data.healthSync.enabled ? refreshHealth : connectHealth} disabled={syncingHealth} style={styles.healthButton}><MaterialIcons name={data.healthSync.enabled ? "sync" : "link"} color="#10150B" size={18} /><Text style={styles.healthButtonText}>{syncingHealth ? "Eşitleniyor…" : data.healthSync.enabled ? "Şimdi eşitle" : "Bağlan ve izin ver"}</Text></TouchableOpacity></Card>
    <SectionTitle title="Güvenlik" />
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="fingerprint" size={21} color="#60A5FA" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>{biometricLabel}</Text><Text style={styles.settingCopy}>{biometricDescription}</Text></View><Switch value={data.settings.biometricLockEnabled} onValueChange={setBiometric} disabled={biometricState === "checking"} trackColor={{ false: "#344154", true: "#668B26" }} thumbColor={data.settings.biometricLockEnabled ? "#B8FF3D" : "#C5CDD7"} /></View>{data.settings.biometricLockEnabled ? <View style={styles.timeoutGroup}><Text style={styles.timeoutLabel}>Arka plan sonrası kilitle</Text><View style={styles.timeoutRow}>{[1, 5, 30].map((minute) => <TouchableOpacity key={minute} onPress={() => updateSettings({ lockTimeoutMinutes: minute })} style={[styles.timeout, data.settings.lockTimeoutMinutes === minute && styles.timeoutActive]}><Text style={[styles.timeoutText, data.settings.lockTimeoutMinutes === minute && styles.timeoutTextActive]}>{minute} dk</Text></TouchableOpacity>)}</View></View> : null}</Card>
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="key" size={21} color="#F97316" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Passkey ile hesap erişimi</Text><Text style={styles.settingCopy}>Çoklu cihaz senkronizasyonu etkinleştirildiğinde kullanılacak. Bu yerel ilk sürümde hesap girişi açık değildir.</Text></View></View><View style={styles.comingSoon}><Text style={styles.comingSoonText}>HAZIRLIK AŞAMASINDA</Text></View></Card>
    <SectionTitle title="Tercihler" />
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="dark-mode" size={21} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Görünüm</Text><Text style={styles.settingCopy}>Geçiş, önceki paletin üzerinden kısa ve yumuşak biçimde uygulanır.</Text></View></View><View style={styles.themeRow}>{(["system", "dark", "light"] as ThemePreference[]).map((preference) => <TouchableOpacity key={preference} onPress={() => setThemePreference(preference)} style={[styles.themeOption, themePreference === preference && styles.themeOptionActive]}><MaterialIcons name={preference === "system" ? "brightness-auto" : preference === "dark" ? "dark-mode" : "light-mode"} size={15} color={themePreference === preference ? "#10150B" : "#B7C0CB"} /><Text style={[styles.themeText, themePreference === preference && styles.themeTextActive]}>{preference === "system" ? "Sistem" : preference === "dark" ? "Koyu" : "Açık"}</Text></TouchableOpacity>)}</View></Card>
    <Card><Text style={styles.settingTitle}>Ağırlık birimi</Text><View style={styles.unitRow}>{(["kg", "lb"] as const).map((unit) => <TouchableOpacity key={unit} onPress={() => updateSettings({ unit })} style={[styles.unit, data.settings.unit === unit && styles.unitActive]}><Text style={[styles.unitText, data.settings.unit === unit && styles.unitTextActive]}>{unit}</Text></TouchableOpacity>)}</View></Card>
    <Card><Text style={styles.settingTitle}>Varsayılan dinlenme</Text><Text style={[styles.settingCopy, { marginTop: 4 }]}>Tamamlanan her setten sonra otomatik başlar.</Text><View style={styles.unitRow}>{[60, 90, 120].map((seconds) => <TouchableOpacity key={seconds} onPress={() => updateSettings({ defaultRestSeconds: seconds })} style={[styles.unit, data.settings.defaultRestSeconds === seconds && styles.unitActive]}><Text style={[styles.unitText, data.settings.defaultRestSeconds === seconds && styles.unitTextActive]}>{seconds} sn</Text></TouchableOpacity>)}</View></Card>
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="record-voice-over" size={21} color="#7CE9DD" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Set içi sesli koçluk</Text><Text style={styles.settingCopy}>Aktif antrenmanda istediğin anda form, nefes ve güvenlik hatırlatmasını dinle.</Text></View><Switch value={data.settings.voiceCoachEnabled} onValueChange={(voiceCoachEnabled) => updateSettings({ voiceCoachEnabled })} trackColor={{ false: "#344154", true: "#336E70" }} thumbColor={data.settings.voiceCoachEnabled ? "#7CE9DD" : "#C5CDD7"} /></View>{data.settings.voiceCoachEnabled ? <View style={styles.voiceOptions}><Text style={styles.voiceOptionLabel}>Koç dili</Text><View style={styles.voiceRow}>{(["tr-TR", "en-US"] as const).map((language) => <TouchableOpacity key={language} onPress={() => updateSettings({ voiceCoachLanguage: language })} style={[styles.voiceOption, data.settings.voiceCoachLanguage === language && styles.voiceOptionActive]}><Text style={[styles.voiceOptionText, data.settings.voiceCoachLanguage === language && styles.voiceOptionTextActive]}>{language === "tr-TR" ? "Türkçe" : "English"}</Text></TouchableOpacity>)}</View><Text style={styles.voiceOptionLabel}>Konuşma hızı</Text><View style={styles.voiceRow}>{([{ value: 0.8, label: "Yavaş" }, { value: 0.95, label: "Dengeli" }, { value: 1.1, label: "Hızlı" }] as const).map((option) => <TouchableOpacity key={option.value} onPress={() => updateSettings({ voiceCoachRate: option.value })} style={[styles.voiceOption, data.settings.voiceCoachRate === option.value && styles.voiceOptionActive]}><Text style={[styles.voiceOptionText, data.settings.voiceCoachRate === option.value && styles.voiceOptionTextActive]}>{option.label}</Text></TouchableOpacity>)}</View><Text style={styles.voiceNote}>Cihazın sessiz modunda iOS sesli koçluk çıkışı vermeyebilir.</Text></View> : null}</Card>
    <SectionTitle title="Veri ve gizlilik" />
    <Card><View style={styles.settingRow}><View style={styles.rowIcon}><MaterialIcons name="info-outline" size={21} color="#9AA6B5" /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Veri kullanımı ve paylaşım</Text><Text style={styles.settingCopy}>Ham sağlık verilerin toplulukta paylaşılmaz. Topluluk yalnızca senin açıkça yayınladığın programları görür; yapay zekâ koçu yalnızca antrenman ve izinli metrik özetleriyle çalışır.</Text></View></View></Card>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: 12, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 13 }, avatar: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "#1B2A17", borderWidth: 1, borderColor: "#526D24" },
  privacyHead: { flexDirection: "row", alignItems: "center", gap: 12 }, privacyIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#273116" }, privacyTitle: { color: "#F5F7FA", fontWeight: "900", fontSize: 15 }, privacyCopy: { color: "#9AA6B5", fontSize: 12, marginTop: 3 }, favoritesCard: { minHeight: 80, padding: 14, borderRadius: 18, backgroundColor: "#201720", borderColor: "#5D3144", borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 12 }, favoritesIcon: { width: 41, height: 41, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#38202D" }, historyCard: { marginTop: 10, padding: 14, borderRadius: 18, backgroundColor: "#112326", borderColor: "#31585E", borderWidth: 1 }, historyTop: { flexDirection: "row", alignItems: "center", gap: 12 }, historyIcon: { width: 41, height: 41, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#173438" }, historyItems: { marginTop: 12, paddingTop: 10, borderTopColor: "#2E5359", borderTopWidth: 1, gap: 7 }, historyItem: { gap: 2 }, historyTitle: { color: "#DBEEF0", fontSize: 11, fontWeight: "800" }, historyMeta: { color: "#8ABCC1", fontSize: 10 },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12 }, rowIcon: { width: 39, height: 39, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2430" }, settingTitle: { color: "#F5F7FA", fontSize: 14, fontWeight: "900" }, settingCopy: { color: "#9AA6B5", fontSize: 12, lineHeight: 18, marginTop: 3 },
  timeoutGroup: { paddingTop: 16, marginTop: 16, borderTopWidth: 1, borderTopColor: "#263141" }, timeoutLabel: { color: "#C5CDD7", fontSize: 12, fontWeight: "800", marginBottom: 10 }, timeoutRow: { flexDirection: "row", gap: 8 }, timeout: { flex: 1, paddingVertical: 10, borderRadius: 11, borderColor: "#344154", borderWidth: 1, alignItems: "center", backgroundColor: "#0B0E12" }, timeoutActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, timeoutText: { color: "#C5CDD7", fontSize: 12, fontWeight: "900" }, timeoutTextActive: { color: "#10150B" },
  comingSoon: { alignSelf: "flex-start", marginTop: 14, backgroundColor: "#2B2113", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5 }, comingSoonText: { color: "#FFC776", fontSize: 10, fontWeight: "900", letterSpacing: 0.6 },
  themeRow: { flexDirection: "row", gap: 8, marginTop: 15 }, themeOption: { flex: 1, minHeight: 42, borderRadius: 12, borderColor: "#344154", borderWidth: 1, backgroundColor: "#0B0E12", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 5 }, themeOptionActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, themeText: { color: "#C5CDD7", fontWeight: "900", fontSize: 11 }, themeTextActive: { color: "#10150B" }, unitRow: { flexDirection: "row", gap: 9, marginTop: 13 }, unit: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 12, borderColor: "#344154", borderWidth: 1, backgroundColor: "#0B0E12" }, unitActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, unitText: { color: "#C5CDD7", fontWeight: "900", fontSize: 13 }, unitTextActive: { color: "#10150B" },
  healthMetrics: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#263141", flexDirection: "row", gap: 8 }, healthMetric: { flex: 1, backgroundColor: "#0B0E12", borderRadius: 12, padding: 10 }, healthMetricValue: { color: "#B8FF3D", fontSize: 16, fontWeight: "900" }, healthMetricLabel: { color: "#9AA6B5", fontSize: 10, marginTop: 3 }, healthHint: { color: "#9AA6B5", fontSize: 12, lineHeight: 18 }, healthButton: { marginTop: 15, backgroundColor: "#B8FF3D", borderRadius: 13, minHeight: 44, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, healthButtonText: { color: "#10150B", fontSize: 13, fontWeight: "900" }, voiceOptions: { marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: "#263141" }, voiceOptionLabel: { color: "#AFC5C7", fontSize: 11, fontWeight: "900", marginBottom: 8 }, voiceRow: { flexDirection: "row", gap: 8, marginBottom: 14 }, voiceOption: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: "#345459", borderRadius: 11, alignItems: "center", backgroundColor: "#102022" }, voiceOptionActive: { backgroundColor: "#7CE9DD", borderColor: "#7CE9DD" }, voiceOptionText: { color: "#B8D8DA", fontSize: 11, fontWeight: "900" }, voiceOptionTextActive: { color: "#102022" }, voiceNote: { paddingTop: 2, color: "#88BFC1", fontSize: 11, lineHeight: 16 },
});
