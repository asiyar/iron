import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Card, EmptyState, PrimaryButton, ui } from "@/components/fitness-ui";
import { MotionSection } from "@/components/motion-section";
import { VoiceCommandControl } from "@/components/voice-command-control";
import { WorkoutMuscleAtlas } from "@/components/workout-muscle-atlas";
import { checklistCompliance, workoutVolume } from "@/lib/fitness-analytics";
import { adaptiveTargets } from "@/lib/performance-engine";
import { useFitness } from "@/lib/fitness-store";
import { formChecklistFor, voiceCoachTextFor } from "@/lib/exercise-guides";
import { EXERCISES, exerciseById } from "@/shared/fitness";

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function WorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, addExerciseToSession, addSet, updateSet, setSuperset, finishWorkout, updateFormChecklist } = useFitness();
  const session = data.sessions.find((item) => item.id === id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pairStart, setPairStart] = useState<number | null>(null);
  const [rest, setRest] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [openChecklistFor, setOpenChecklistFor] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<string>();
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestions = useMemo(() => EXERCISES.filter((exercise) => !session?.exercises.some((entry) => entry.exerciseId === exercise.id)), [session]);
  const adaptive = useMemo(() => adaptiveTargets(data.sessions), [data.sessions]);

  useEffect(() => {
    activateKeepAwakeAsync("ironpulse-workout").catch(() => undefined);
    return () => { deactivateKeepAwake("ironpulse-workout").catch(() => undefined); };
  }, []);

  useEffect(() => {
    if (!rest || rest <= 0) return;
    const timer = setInterval(() => setRest((current) => {
      if (current && current > 1) return current - 1;
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      Speech.isSpeakingAsync().then((speaking) => { if (!speaking) Speech.speak("Dinlenme tamamlandı", { language: "tr-TR", rate: 0.95 }); }).catch(() => undefined);
      return null;
    }), 1000);
    return () => clearInterval(timer);
  }, [rest]);

  useEffect(() => () => { if (celebrationTimer.current) clearTimeout(celebrationTimer.current); }, []);

  if (!session) return <View style={[ui.page, styles.center]}><Text style={ui.h2}>Antrenman bulunamadı</Text></View>;
  const readOnly = Boolean(session.completedAt);
  const seconds = rest ?? 0;
  const timerText = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const pairExercise = (index: number) => {
    if (pairStart === null) return setPairStart(index);
    if (pairStart === index) return setPairStart(null);
    setSuperset(session.id, pairStart, index);
    setPairStart(null);
  };
  const finish = () => {
    if (!session.exercises.some((exercise) => exercise.sets.some((set) => set.completed))) return Alert.alert("Set kaydı gerekli", "Antrenmanı bitirmeden önce en az bir seti tamamlayın.");
    Alert.alert("Antrenmanı bitir?", "Tamamlanan setlerin kilitlenir ve ilerleme panellerine eklenir.", [{ text: "Vazgeç", style: "cancel" }, { text: "Bitir", style: "destructive", onPress: () => { finishWorkout(session.id); setShowSummary(true); } }]);
  };
  const handleVoiceCommand = (command: "complete-set" | "start-rest" | "finish-workout") => {
    if (command === "start-rest") { setRest(data.settings.defaultRestSeconds); return; }
    if (command === "finish-workout") { finishWorkout(session.id); setShowSummary(true); return; }
    for (let exerciseIndex = 0; exerciseIndex < session.exercises.length; exerciseIndex += 1) { const setIndex = session.exercises[exerciseIndex].sets.findIndex((set) => !set.completed); if (setIndex >= 0) { updateSet(session.id, exerciseIndex, setIndex, { completed: true }); setRest(data.settings.defaultRestSeconds); if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined); return; } }
  };
  const speakCoach = (exerciseId: string) => {
    if (!data.settings.voiceCoachEnabled) return;
    Speech.stop().catch(() => undefined).finally(() => {
      Speech.speak(voiceCoachTextFor(exerciseId, data.settings.voiceCoachLanguage), { language: data.settings.voiceCoachLanguage, rate: data.settings.voiceCoachRate, pitch: 1, useApplicationAudioSession: false });
    });
  };
  const celebrate = (message: string) => {
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    setCelebration(message);
    celebrationTimer.current = setTimeout(() => setCelebration(undefined), 2600);
  };

  if (showSummary || readOnly) return <WorkoutSummary sessionId={session.id} />;
  return <View style={ui.page}>
    <ScrollView contentContainerStyle={ui.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <MotionSection><View style={styles.nav}><TouchableOpacity onPress={() => router.back()} style={styles.navButton}><MaterialIcons name="close" color="#F5F7FA" size={23} /></TouchableOpacity><View style={styles.timerPill}><View style={styles.timerAccent} /><MaterialIcons name="timer" color="#60A5FA" size={17} /><Text style={styles.timerText}>{rest ? timerText : "Dinlenme hazır"}</Text></View><View style={styles.navActions}><VoiceCommandControl onCommand={handleVoiceCommand} /><TouchableOpacity onPress={finish} style={styles.finishTop}><Text style={styles.finishTopText}>Bitir</Text></TouchableOpacity></View></View><View style={styles.workoutStatus}><View style={styles.statusDot} /><Text style={styles.statusText}>CANLI ANTRENMAN</Text><Text style={styles.statusMetric}>{session.exercises.reduce((total, entry) => total + entry.sets.filter((set) => set.completed).length, 0)} SET</Text></View><Text style={ui.h1}>{session.name}</Text><Text style={[ui.body, { marginTop: 8 }]}>{Math.round(workoutVolume(session)).toLocaleString("tr-TR")} hacim · her tekrar kayıt altında</Text>{data.partner.enabled ? <View style={styles.partnerBanner}><MaterialIcons name="group" size={17} color="#D28CFF" /><Text style={styles.partnerText}>{data.partner.displayName ? `${data.partner.displayName} ile partner modu aktif.` : "Partner modu aktif. Setleri sırayla takip edin."}</Text></View> : null}<WorkoutMuscleAtlas onAddExercise={(exerciseId) => addExerciseToSession(session.id, exerciseId)} /></MotionSection>

      {pairStart !== null ? <MotionSection delay={40}><View style={styles.pairBanner}><MaterialIcons name="link" size={18} color="#B8FF3D" /><Text style={styles.pairText}>Eşleştirmek için ikinci egzersizi seçin.</Text><TouchableOpacity onPress={() => setPairStart(null)}><Text style={styles.cancelPair}>Vazgeç</Text></TouchableOpacity></View></MotionSection> : null}
      <View style={{ gap: 16, marginTop: 22 }}>
        {session.exercises.map((entry, exerciseIndex) => {
          const exercise = exerciseById(entry.exerciseId);
          const target = adaptive.find((item) => item.exerciseId === entry.exerciseId);
          const isPairing = pairStart === exerciseIndex;
          const nextSetIndex = entry.sets.findIndex((set) => !set.completed);
          const activeSetIndex = nextSetIndex >= 0 ? nextSetIndex : Math.max(0, entry.sets.length - 1);
          const activeChecklist = entry.sets[activeSetIndex]?.formChecklist ?? [];
          return <MotionSection key={entry.id} delay={80 + exerciseIndex * 50}><Card accent={Boolean(entry.supersetId)}>
            {entry.supersetId ? <View style={styles.supersetLabel}><MaterialIcons name="link" color="#B8FF3D" size={14} /><Text style={styles.supersetText}>SÜPERSET</Text></View> : null}
            <View style={styles.exerciseHead}><View style={{ flex: 1 }}><Text style={styles.exerciseTitle}>{exercise?.name ?? "Egzersiz"}</Text><Text style={styles.exerciseMeta}>{exercise?.primaryMuscles.join(" · ")}</Text></View><TouchableOpacity onPress={() => pairExercise(exerciseIndex)} style={[styles.linkButton, isPairing && styles.linkButtonActive]}><MaterialIcons name="link" size={18} color={isPairing ? "#10150B" : "#B8FF3D"} /></TouchableOpacity></View>
            {target ? <View style={styles.targetHint}><MaterialIcons name="auto-graph" size={14} color="#B8FF3D" /><Text style={styles.targetHintText}>Hedef: {target.weight} kg × {target.reps} · {target.note}</Text></View> : null}
            {exercise ? <SetReadinessChecklist exerciseId={exercise.id} label={`${activeSetIndex + 1}. set öncesi kontrol`} checkedItemIds={activeChecklist} expanded={openChecklistFor === entry.id} voiceEnabled={data.settings.voiceCoachEnabled} onToggle={() => setOpenChecklistFor((current) => current === entry.id ? null : entry.id)} onToggleItem={(itemId, checked) => { updateFormChecklist(session.id, exerciseIndex, activeSetIndex, itemId, checked); const nextChecked = checked ? Array.from(new Set([...activeChecklist, itemId])) : activeChecklist.filter((item) => item !== itemId); if (nextChecked.length === 3) celebrate("Form ve nefes kontrolü tamam. Kaliteyi bu sete taşı."); }} onSpeak={() => speakCoach(exercise.id)} /> : null}
            <View style={styles.columnLabels}><Text style={[styles.columnLabel, { width: 30 }]}>SET</Text><Text style={[styles.columnLabel, styles.inputLabel]}>KG</Text><Text style={[styles.columnLabel, styles.inputLabel]}>TEKRAR</Text><Text style={[styles.columnLabel, styles.inputLabel]}>RPE</Text><View style={{ width: 42 }} /></View>
            {entry.sets.map((set, setIndex) => <View key={set.id} style={[styles.setRow, set.completed && styles.completedSet]}><Text style={styles.setNumber}>{setIndex + 1}</Text><SetInput editable={!readOnly} value={set.weight ? String(set.weight) : ""} onChange={(value) => updateSet(session.id, exerciseIndex, setIndex, { weight: toNumber(value) })} placeholder={target ? String(target.weight) : "0"} /><SetInput editable={!readOnly} value={set.reps ? String(set.reps) : ""} onChange={(value) => updateSet(session.id, exerciseIndex, setIndex, { reps: toNumber(value) })} placeholder={target ? String(target.reps) : "0"} /><SetInput editable={!readOnly} value={set.rpe ? String(set.rpe) : ""} onChange={(value) => updateSet(session.id, exerciseIndex, setIndex, { rpe: toNumber(value) })} placeholder="—" /><TouchableOpacity disabled={readOnly} onPress={() => { updateSet(session.id, exerciseIndex, setIndex, { completed: !set.completed }); if (!set.completed) { setRest(data.settings.defaultRestSeconds); celebrate(["Set tamamlandı. Ritmini koru.", "Güzel iş. Bir sonraki tekrarına odaklan.", "İstikrar güçtür. Kaydın ilerlemene eklendi."][setIndex % 3]); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined); } }} style={[styles.check, set.completed && styles.checked]}><MaterialIcons name={set.completed ? "check" : "circle"} size={20} color={set.completed ? "#10150B" : "#657386"} /></TouchableOpacity></View>)}
            <TouchableOpacity onPress={() => addSet(session.id, exerciseIndex)} style={styles.addSet}><MaterialIcons name="add" size={18} color="#B8FF3D" /><Text style={styles.addSetText}>Set ekle</Text></TouchableOpacity>
          </Card></MotionSection>;
        })}
      </View>
      {session.exercises.length === 0 ? <View style={{ marginTop: 22 }}><EmptyState icon="fitness-center" title="İlk egzersizi ekleyin" copy="Antrenmanınızda kaydetmek istediğiniz hareketi seçin." /></View> : null}
      <MotionSection delay={220}><TouchableOpacity onPress={() => setPickerOpen(true)} style={styles.addExercise}><MaterialIcons name="add" size={20} color="#B8FF3D" /><Text style={styles.addExerciseText}>Egzersiz ekle</Text></TouchableOpacity><View style={{ marginTop: 14 }}><PrimaryButton label="Antrenmanı Bitir" icon="check" onPress={finish} /></View></MotionSection>
    </ScrollView>{celebration ? <View pointerEvents="none" style={styles.celebration}><MaterialIcons name="celebration" size={18} color="#10150B" /><Text style={styles.celebrationText}>{celebration}</Text></View> : null}
    <Modal visible={pickerOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPickerOpen(false)}><View style={ui.page}><View style={styles.sheetHead}><Text style={ui.h2}>Egzersiz ekle</Text><TouchableOpacity onPress={() => setPickerOpen(false)}><Text style={styles.done}>Bitti</Text></TouchableOpacity></View><ScrollView contentContainerStyle={[ui.content, { paddingTop: 10 }]}>{suggestions.map((exercise) => <TouchableOpacity key={exercise.id} onPress={() => { addExerciseToSession(session.id, exercise.id); setPickerOpen(false); }} style={styles.choice}><View style={styles.choiceIcon}><MaterialIcons name="add" size={18} color="#B8FF3D" /></View><View style={{ flex: 1 }}><Text style={styles.exerciseTitle}>{exercise.name}</Text><Text style={styles.exerciseMeta}>{exercise.primaryMuscles.join(" · ")} · {exercise.equipment}</Text></View><MaterialIcons name="chevron-right" size={22} color="#788596" /></TouchableOpacity>)}</ScrollView></View></Modal>
  </View>;
}

function SetInput({ value, onChange, placeholder, editable }: { value: string; onChange: (value: string) => void; placeholder: string; editable: boolean }) {
  return <TextInput value={value} onChangeText={onChange} editable={editable} placeholder={placeholder} placeholderTextColor="#657386" keyboardType="decimal-pad" selectTextOnFocus style={styles.setInput} />;
}

function SetReadinessChecklist({ exerciseId, label, checkedItemIds, expanded, voiceEnabled, onToggle, onToggleItem, onSpeak }: { exerciseId: string; label: string; checkedItemIds: string[]; expanded: boolean; voiceEnabled: boolean; onToggle: () => void; onToggleItem: (itemId: "setup" | "form" | "breathing", checked: boolean) => void; onSpeak: () => void }) {
  const items = formChecklistFor(exerciseId);
  return <View style={styles.checklist}><View style={styles.checklistHead}><TouchableOpacity onPress={onToggle} style={styles.checklistToggle}><MaterialIcons name="fact-check" size={16} color="#7CE9DD" /><View style={{ flex: 1 }}><Text style={styles.checklistTitle}>FORM KONTROLÜ · {checkedItemIds.length}/3</Text><Text style={styles.checklistLabel}>{label}</Text></View><MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={19} color="#9EDFE2" /></TouchableOpacity>{voiceEnabled ? <TouchableOpacity accessibilityLabel="Sesli koçluğu dinle" onPress={onSpeak} style={styles.coachButton}><MaterialIcons name="volume-up" size={17} color="#10150B" /></TouchableOpacity> : null}</View>{expanded ? <View style={styles.checklistItems}>{items.map((item) => { const checked = checkedItemIds.includes(item.id); return <TouchableOpacity key={item.id} onPress={() => onToggleItem(item.id, !checked)} style={[styles.checklistItem, checked && styles.checklistItemDone]}><View style={[styles.checklistMark, checked && styles.checklistMarkDone]}><MaterialIcons name={checked ? "check" : "circle"} size={15} color={checked ? "#10150B" : "#789EA2"} /></View><View style={{ flex: 1 }}><Text style={[styles.checklistItemTitle, checked && styles.checklistItemTitleDone]}>{item.title}</Text><Text style={styles.checklistItemCopy}>{item.detail}</Text></View></TouchableOpacity>; })}</View> : null}</View>;
}

function WorkoutSummary({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { data } = useFitness();
  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) return null;
  const completedSets = session.exercises.reduce((total, entry) => total + entry.sets.filter((set) => set.completed).length, 0);
  const compliance = checklistCompliance(session);
  return <View style={ui.page}><ScrollView contentContainerStyle={[ui.content, styles.summary]}><MotionSection><View style={styles.summaryBadge}><MaterialIcons name="check" size={34} color="#10150B" /></View><Text style={ui.eyebrow}>Tamamlandı</Text><Text style={[ui.h1, { textAlign: "center" }]}>İyi iş çıkardın.</Text><Text style={[ui.body, { textAlign: "center", marginTop: 9 }]}>Antrenman kaydın ilerleme panellerine eklendi.</Text></MotionSection><MotionSection delay={90}><View style={styles.summaryMetrics}><View style={styles.summaryMetric}><Text style={styles.summaryValue}>{completedSets}</Text><Text style={styles.summaryLabel}>Tamamlanan set</Text></View><View style={styles.summaryMetric}><Text style={styles.summaryValue}>{Math.round(workoutVolume(session)).toLocaleString("tr-TR")}</Text><Text style={styles.summaryLabel}>Toplam hacim</Text></View></View><View style={styles.complianceReport}><View style={styles.complianceHead}><View style={styles.complianceIcon}><MaterialIcons name="fact-check" size={19} color="#102022" /></View><View style={{ flex: 1 }}><Text style={styles.complianceTitle}>FORM & NEFES UYUMU</Text><Text style={styles.complianceCopy}>Tamamlanan setlerde işaretlediğin kontrol maddeleri.</Text></View><Text style={styles.compliancePercent}>%{compliance.percent}</Text></View><View style={styles.complianceTrack}><View style={[styles.complianceFill, { width: `${compliance.percent}%` }]} /></View><Text style={styles.complianceMeta}>{compliance.checkedItems}/{compliance.possibleItems} form ve nefes kontrolü tamamlandı</Text><View style={styles.complianceRows}>{compliance.byExercise.map((item) => <View key={item.exerciseId} style={styles.complianceRow}><Text numberOfLines={1} style={styles.complianceExercise}>{item.name}</Text><Text style={styles.complianceCount}>{item.checkedItems}/{item.possibleItems}</Text></View>)}</View></View><View style={{ width: "100%", marginTop: 26 }}><PrimaryButton label="Bugüne Dön" icon="home" onPress={() => router.replace("/" as never)} /></View><TouchableOpacity onPress={() => router.replace("/progress" as never)} style={styles.progressLink}><Text style={styles.progressText}>İlerlemeyi görüntüle</Text><MaterialIcons name="arrow-forward" size={17} color="#B8FF3D" /></TouchableOpacity></MotionSection></ScrollView></View>;
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  nav: { paddingTop: 14, marginBottom: 21, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, navActions: { flexDirection: "row", alignItems: "center", gap: 7 },
  navButton: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#141A22", borderWidth: 1, borderColor: "#2B3748" },
  finishTop: { paddingHorizontal: 14, paddingVertical: 11, backgroundColor: "#2B1A1B", borderRadius: 14 }, finishTopText: { color: "#FF9A9A", fontWeight: "900", fontSize: 13 },
  timerPill: { position: "relative", overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#162231", borderColor: "#2D5076", borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 }, timerAccent: { width: 4, height: 18, borderRadius: 4, backgroundColor: "#60A5FA" }, timerText: { color: "#B4D8FF", fontSize: 12, fontWeight: "900" },
  workoutStatus: { flexDirection: "row", gap: 7, alignItems: "center", marginBottom: 9 }, statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#B8FF3D" }, statusText: { color: "#B8FF3D", fontSize: 10, fontWeight: "900", letterSpacing: 1.15 }, statusMetric: { color: "#9AA6B5", fontSize: 10, fontWeight: "900", marginLeft: "auto" },
  pairBanner: { marginTop: 18, padding: 12, borderWidth: 1, borderColor: "#526D24", backgroundColor: "#1B2A17", borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 8 }, pairText: { color: "#D8F6AA", flex: 1, fontSize: 12, fontWeight: "700" }, cancelPair: { color: "#B8FF3D", fontSize: 12, fontWeight: "900" },
  partnerBanner: { marginTop: 14, padding: 10, borderRadius: 13, backgroundColor: "#211B2B", borderColor: "#664B8D", borderWidth: 1, flexDirection: "row", gap: 7, alignItems: "center" }, partnerText: { color: "#E8D8FF", fontSize: 11, fontWeight: "700", flex: 1 },
  supersetLabel: { alignSelf: "flex-start", backgroundColor: "#1B2A17", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 }, supersetText: { color: "#B8FF3D", fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  exerciseHead: { flexDirection: "row", alignItems: "center", gap: 12 }, exerciseTitle: { color: "#F8FAFC", fontSize: 17, fontWeight: "900", letterSpacing: -0.25 }, exerciseMeta: { color: "#9AA6B5", fontSize: 11, marginTop: 4 },
  linkButton: { width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#1B2A17", borderWidth: 1, borderColor: "#526D24" }, linkButtonActive: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" },
  columnLabels: { flexDirection: "row", gap: 6, marginTop: 18, marginBottom: 7, alignItems: "center" }, columnLabel: { color: "#728094", fontSize: 10, fontWeight: "900" }, inputLabel: { flex: 1, textAlign: "center" },
  targetHint: { marginTop: 14, padding: 9, borderRadius: 11, backgroundColor: "#161F16", borderWidth: 1, borderColor: "#526D2444", flexDirection: "row", gap: 6, alignItems: "flex-start" }, targetHintText: { color: "#D8F6AA", fontSize: 10, lineHeight: 15, flex: 1 },
  checklist: { marginTop: 13, borderWidth: 1, borderColor: "#245356", backgroundColor: "#102022", borderRadius: 14, overflow: "hidden" }, checklistHead: { flexDirection: "row", alignItems: "center" }, checklistToggle: { minHeight: 53, flex: 1, flexDirection: "row", gap: 8, alignItems: "center", paddingHorizontal: 11, paddingVertical: 8 }, checklistTitle: { color: "#9EDFE2", fontSize: 10, fontWeight: "900", letterSpacing: 0.65 }, checklistLabel: { color: "#C3DADC", fontSize: 10, marginTop: 2 }, coachButton: { width: 42, height: 42, borderRadius: 12, marginRight: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#7CE9DD" }, checklistItems: { paddingHorizontal: 11, paddingBottom: 11, gap: 7 }, checklistItem: { flexDirection: "row", gap: 9, padding: 10, borderRadius: 11, backgroundColor: "#14282A" }, checklistItemDone: { backgroundColor: "#203B29" }, checklistMark: { width: 21, height: 21, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#0D1B1D" }, checklistMarkDone: { backgroundColor: "#B8FF3D" }, checklistItemTitle: { color: "#E3F4F5", fontSize: 11, fontWeight: "900" }, checklistItemTitleDone: { color: "#D8F6AA" }, checklistItemCopy: { color: "#9EC1C4", fontSize: 10, lineHeight: 14, marginTop: 2 },
  setRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 7, padding: 5, borderRadius: 13, borderWidth: 1, borderColor: "transparent" }, completedSet: { backgroundColor: "#1B2A17", borderColor: "#526D2455" }, setNumber: { width: 30, color: "#D1D9E4", fontSize: 13, textAlign: "center", fontWeight: "900" }, setInput: { flex: 1, minHeight: 42, paddingHorizontal: 5, borderWidth: 1, borderColor: "#344154", backgroundColor: "#0B0E12", borderRadius: 11, color: "#F8FAFC", textAlign: "center", fontSize: 14, fontWeight: "900" }, check: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#344154", borderRadius: 11, backgroundColor: "#0B0E12" }, checked: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" },
  addSet: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 3, marginTop: 7, paddingVertical: 7, paddingHorizontal: 5 }, addSetText: { color: "#B8FF3D", fontSize: 13, fontWeight: "900" },
  celebration: { position: "absolute", left: 20, right: 20, bottom: 20, minHeight: 52, borderRadius: 17, paddingHorizontal: 14, backgroundColor: "#B8FF3D", flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 16, elevation: 8 }, celebrationText: { color: "#10150B", fontSize: 12, lineHeight: 17, fontWeight: "900", flex: 1 },
  addExercise: { marginTop: 18, minHeight: 54, borderRadius: 17, borderWidth: 1, borderStyle: "dashed", borderColor: "#526D24", backgroundColor: "#11190F", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, addExerciseText: { color: "#B8FF3D", fontWeight: "900" },
  sheetHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#263141" }, done: { color: "#B8FF3D", fontWeight: "900", fontSize: 15 },
  choice: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#263141" }, choiceIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2A17" },
  summary: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }, summaryBadge: { width: 78, height: 78, borderRadius: 39, alignItems: "center", justifyContent: "center", backgroundColor: "#B8FF3D", marginBottom: 25 }, summaryMetrics: { marginTop: 26, flexDirection: "row", width: "100%", gap: 12 }, summaryMetric: { flex: 1, alignItems: "center", padding: 16, borderRadius: 18, backgroundColor: "#141A22", borderColor: "#263141", borderWidth: 1 }, summaryValue: { color: "#F5F7FA", fontWeight: "900", fontSize: 22 }, summaryLabel: { color: "#9AA6B5", fontSize: 11, textAlign: "center", marginTop: 5 }, complianceReport: { width: "100%", marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "#102022", borderColor: "#245356", borderWidth: 1 }, complianceHead: { flexDirection: "row", gap: 10, alignItems: "center" }, complianceIcon: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#7CE9DD" }, complianceTitle: { color: "#BDE9EA", fontSize: 10, fontWeight: "900", letterSpacing: 0.75 }, complianceCopy: { color: "#8CB9BC", fontSize: 10, lineHeight: 15, marginTop: 2 }, compliancePercent: { color: "#7CE9DD", fontSize: 21, fontWeight: "900" }, complianceTrack: { height: 7, borderRadius: 4, backgroundColor: "#173438", marginTop: 13, overflow: "hidden" }, complianceFill: { height: "100%", borderRadius: 4, backgroundColor: "#7CE9DD" }, complianceMeta: { color: "#BDE9EA", fontSize: 11, fontWeight: "800", marginTop: 8 }, complianceRows: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#245356" }, complianceRow: { flexDirection: "row", gap: 10, alignItems: "center", paddingTop: 8 }, complianceExercise: { color: "#A6CED0", fontSize: 11, flex: 1, fontWeight: "700" }, complianceCount: { color: "#7CE9DD", fontSize: 11, fontWeight: "900" }, progressLink: { marginTop: 18, flexDirection: "row", gap: 6, alignItems: "center", padding: 7 }, progressText: { color: "#B8FF3D", fontWeight: "800", fontSize: 14 },
});
