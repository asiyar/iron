import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import type { BodyWeightEntry, CoachTask, DashboardMetricId, FitnessData, FitnessSettings, GeneratedPlan, HealthSnapshot, MeasurementEntry, MonetizationProfile, NutritionEntry, PartnerProfile, PremiumPlan, ScheduledWorkout, TransformationGoal, VideoFavorite, VideoWatchHistory, WellnessEntry, WorkoutExercise, WorkoutSession, WorkoutSet, WorkoutTemplate } from "@/shared/fitness";

const STORAGE_KEY = "ironpulse.fitness-data.v1";
const INITIAL_SETTINGS: FitnessSettings = {
  unit: "kg",
  biometricLockEnabled: false,
  lockTimeoutMinutes: 5,
  defaultRestSeconds: 90,
  voiceCoachEnabled: false,
  voiceCoachLanguage: "tr-TR",
  voiceCoachRate: 0.95,
};
const INITIAL_DATA: FitnessData = { templates: [], sessions: [], bodyWeights: [], healthSync: { provider: "none", status: "disconnected", enabled: false }, wellness: [], measurements: [], transformationGoal: {}, coachTasks: [], schedule: [], nutrition: [], equipmentProfile: [], partner: { enabled: false }, dashboardMetricOrder: ["readiness", "badges", "weekly-volume", "sessions"], videoFavorites: [], videoWatchHistory: [], monetization: { adCount: 0, premiumStatus: "free" }, settings: INITIAL_SETTINGS };

type FitnessContextValue = {
  data: FitnessData;
  ready: boolean;
  activeSession?: WorkoutSession;
  createTemplate: (name: string) => string;
  importTemplate: (template: Pick<WorkoutTemplate, "name" | "exercises">) => string;
  addExerciseToTemplate: (templateId: string, exerciseId: string) => void;
  startWorkout: (templateId?: string, name?: string) => string;
  addExerciseToSession: (sessionId: string, exerciseId: string) => void;
  addSet: (sessionId: string, exerciseIndex: number) => void;
  updateSet: (sessionId: string, exerciseIndex: number, setIndex: number, patch: Partial<WorkoutSet>) => void;
  setSuperset: (sessionId: string, firstIndex: number, secondIndex: number) => void;
  finishWorkout: (sessionId: string) => void;
  addBodyWeight: (weight: number) => void;
  applyHealthSnapshot: (snapshot: HealthSnapshot) => void;
  saveWellness: (input: Omit<WellnessEntry, "id" | "recordedAt">) => void;
  addMeasurement: (input: Omit<MeasurementEntry, "id" | "recordedAt">) => void;
  updateTransformationGoal: (goal: TransformationGoal) => void;
  saveGeneratedPlan: (plan: GeneratedPlan) => void;
  addCoachTask: (input: Omit<CoachTask, "id" | "createdAt" | "completed">) => void;
  toggleCoachTask: (taskId: string) => void;
  scheduleTemplate: (templateId: string, scheduledFor: string) => void;
  rescheduleWorkout: (scheduleId: string, scheduledFor: string) => void;
  addNutrition: (input: Omit<NutritionEntry, "id" | "recordedAt">) => void;
  updateEquipmentProfile: (equipment: string[]) => void;
  updatePartner: (profile: PartnerProfile) => void;
  updateDashboardMetricOrder: (order: DashboardMetricId[]) => void;
  updateFormChecklist: (sessionId: string, exerciseIndex: number, setIndex: number, itemId: string, checked: boolean) => void;
  upsertVideoFavorite: (favorite: VideoFavorite) => void;
  removeVideoFavorite: (exerciseId: string) => void;
  recordVideoWatch: (input: Omit<VideoWatchHistory, "watchedAt" | "watchCount">) => void;
  updateSettings: (patch: Partial<FitnessSettings>) => void;
  recordAdShown: () => void;
  recordPaywallShown: () => void;
  startPremiumTrial: (plan: PremiumPlan) => void;
  setPremiumStatus: (status: MonetizationProfile["premiumStatus"]) => void;
};

const FitnessContext = createContext<FitnessContextValue | null>(null);

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const blankSet = (): WorkoutSet => ({ id: makeId("set"), weight: 0, reps: 0, completed: false });
const blankExercise = (exerciseId: string): WorkoutExercise => ({ id: makeId("entry"), exerciseId, sets: [blankSet()] });

export function FitnessProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<FitnessData>(INITIAL_DATA);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) { const parsed = JSON.parse(saved); setData({ ...INITIAL_DATA, ...parsed, wellness: parsed.wellness ?? [], measurements: parsed.measurements ?? [], transformationGoal: parsed.transformationGoal ?? {}, planProfile: parsed.planProfile, activeGeneratedPlan: parsed.activeGeneratedPlan, coachTasks: parsed.coachTasks ?? [], schedule: parsed.schedule ?? [], nutrition: parsed.nutrition ?? [], equipmentProfile: parsed.equipmentProfile ?? [], dashboardMetricOrder: parsed.dashboardMetricOrder ?? INITIAL_DATA.dashboardMetricOrder, videoFavorites: parsed.videoFavorites ?? [], videoWatchHistory: parsed.videoWatchHistory ?? [], monetization: { ...INITIAL_DATA.monetization, ...parsed.monetization }, partner: { ...INITIAL_DATA.partner, ...parsed.partner }, healthSync: { ...INITIAL_DATA.healthSync, ...parsed.healthSync }, settings: { ...INITIAL_SETTINGS, ...parsed.settings } }); }
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const updateData = useCallback((updater: (current: FitnessData) => FitnessData) => {
    setData((current) => {
      const next = updater(current);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const createTemplate = useCallback((name: string) => {
    const id = makeId("template");
    updateData((current) => ({ ...current, templates: [...current.templates, { id, name: name.trim() || "Yeni Plan", createdAt: new Date().toISOString(), exercises: [] }] }));
    return id;
  }, [updateData]);

  const importTemplate = useCallback((template: Pick<WorkoutTemplate, "name" | "exercises">) => {
    const id = makeId("template");
    const normalized: WorkoutTemplate = {
      id,
      name: template.name.trim() || "Paylaşılan Program",
      createdAt: new Date().toISOString(),
      exercises: template.exercises.map((entry) => ({ ...entry, id: makeId("entry"), sets: entry.sets.map((set) => ({ ...set, id: makeId("set"), completed: false })) })),
    };
    updateData((current) => ({ ...current, templates: [...current.templates, normalized] }));
    return id;
  }, [updateData]);

  const addExerciseToTemplate = useCallback((templateId: string, exerciseId: string) => {
    updateData((current) => ({ ...current, templates: current.templates.map((template) => template.id === templateId ? { ...template, exercises: [...template.exercises, blankExercise(exerciseId)] } : template) }));
  }, [updateData]);

  const startWorkout = useCallback((templateId?: string, name?: string) => {
    const id = makeId("session");
    const template = templateId ? data.templates.find((item) => item.id === templateId) : undefined;
    const session: WorkoutSession = {
      id,
      name: name ?? template?.name ?? "Serbest Antrenman",
      startedAt: new Date().toISOString(),
      exercises: (template?.exercises ?? []).map((entry) => ({ ...entry, id: makeId("entry"), sets: entry.sets.map(() => blankSet()) })),
    };
    updateData((current) => ({ ...current, sessions: [...current.sessions, session], activeSessionId: id }));
    return id;
  }, [data.templates, updateData]);

  const addExerciseToSession = useCallback((sessionId: string, exerciseId: string) => {
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, exercises: [...session.exercises, blankExercise(exerciseId)] } : session) }));
  }, [updateData]);

  const addSet = useCallback((sessionId: string, exerciseIndex: number) => {
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      return { ...session, exercises: session.exercises.map((entry, index) => index === exerciseIndex ? { ...entry, sets: [...entry.sets, blankSet()] } : entry) };
    }) }));
  }, [updateData]);

  const updateSet = useCallback((sessionId: string, exerciseIndex: number, setIndex: number, patch: Partial<WorkoutSet>) => {
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      return { ...session, exercises: session.exercises.map((entry, index) => index === exerciseIndex ? { ...entry, sets: entry.sets.map((set, currentIndex) => currentIndex === setIndex ? { ...set, ...patch } : set) } : entry) };
    }) }));
  }, [updateData]);

  const setSuperset = useCallback((sessionId: string, firstIndex: number, secondIndex: number) => {
    const supersetId = makeId("superset");
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      return { ...session, exercises: session.exercises.map((entry, index) => index === firstIndex || index === secondIndex ? { ...entry, supersetId } : entry) };
    }) }));
  }, [updateData]);

  const finishWorkout = useCallback((sessionId: string) => {
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, completedAt: new Date().toISOString() } : session), activeSessionId: current.activeSessionId === sessionId ? undefined : current.activeSessionId }));
  }, [updateData]);

  const addBodyWeight = useCallback((weight: number) => {
    if (!Number.isFinite(weight) || weight <= 0) return;
    const entry: BodyWeightEntry = { id: makeId("weight"), weight, recordedAt: new Date().toISOString(), source: "manual" };
    updateData((current) => ({ ...current, bodyWeights: [...current.bodyWeights, entry] }));
  }, [updateData]);

  const applyHealthSnapshot = useCallback((snapshot: HealthSnapshot) => {
    updateData((current) => {
      const latest = snapshot.latestWeight;
      const alreadyTracked = latest ? current.bodyWeights.some((entry) => entry.recordedAt.slice(0, 10) === latest.recordedAt.slice(0, 10) && entry.source === "health") : true;
      const syncedWeight: BodyWeightEntry[] = latest && !alreadyTracked
        ? [...current.bodyWeights, { id: makeId("health-weight"), weight: latest.value, recordedAt: latest.recordedAt, source: "health" }]
        : current.bodyWeights;
      return { ...current, healthSync: snapshot, bodyWeights: syncedWeight };
    });
  }, [updateData]);

  const saveWellness = useCallback((input: Omit<WellnessEntry, "id" | "recordedAt">) => {
    const entry: WellnessEntry = { id: makeId("wellness"), recordedAt: new Date().toISOString(), ...input };
    updateData((current) => ({ ...current, wellness: [...current.wellness.filter((item) => item.recordedAt.slice(0, 10) !== entry.recordedAt.slice(0, 10)), entry] }));
  }, [updateData]);

  const addMeasurement = useCallback((input: Omit<MeasurementEntry, "id" | "recordedAt">) => {
    const entry: MeasurementEntry = { id: makeId("measure"), recordedAt: new Date().toISOString(), ...input };
    updateData((current) => ({ ...current, measurements: [...current.measurements, entry] }));
  }, [updateData]);

  const updateTransformationGoal = useCallback((goal: TransformationGoal) => {
    updateData((current) => ({ ...current, transformationGoal: { ...current.transformationGoal, ...goal } }));
  }, [updateData]);

  const saveGeneratedPlan = useCallback((plan: GeneratedPlan) => {
    const focus: TransformationGoal["focus"] = plan.profile.goal === "Kondisyon" ? "Performans" : plan.profile.goal;
    updateData((current) => ({ ...current, planProfile: plan.profile, activeGeneratedPlan: plan, transformationGoal: { ...current.transformationGoal, focus } }));
  }, [updateData]);

  const addCoachTask = useCallback((input: Omit<CoachTask, "id" | "createdAt" | "completed">) => {
    const task: CoachTask = { id: makeId("coach-task"), createdAt: new Date().toISOString(), completed: false, ...input };
    updateData((current) => ({ ...current, coachTasks: [...current.coachTasks, task] }));
  }, [updateData]);

  const toggleCoachTask = useCallback((taskId: string) => {
    updateData((current) => ({ ...current, coachTasks: current.coachTasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task) }));
  }, [updateData]);

  const scheduleTemplate = useCallback((templateId: string, scheduledFor: string) => {
    const item: ScheduledWorkout = { id: makeId("schedule"), templateId, scheduledFor, status: "planned" };
    updateData((current) => ({ ...current, schedule: [...current.schedule, item] }));
  }, [updateData]);

  const rescheduleWorkout = useCallback((scheduleId: string, scheduledFor: string) => {
    updateData((current) => ({ ...current, schedule: current.schedule.map((item) => item.id === scheduleId ? { ...item, scheduledFor, status: "planned" } : item) }));
  }, [updateData]);

  const addNutrition = useCallback((input: Omit<NutritionEntry, "id" | "recordedAt">) => {
    const entry: NutritionEntry = { id: makeId("nutrition"), recordedAt: new Date().toISOString(), ...input };
    updateData((current) => ({ ...current, nutrition: [...current.nutrition, entry] }));
  }, [updateData]);

  const updateEquipmentProfile = useCallback((equipment: string[]) => {
    updateData((current) => ({ ...current, equipmentProfile: equipment }));
  }, [updateData]);

  const updatePartner = useCallback((profile: PartnerProfile) => {
    updateData((current) => ({ ...current, partner: { ...current.partner, ...profile } }));
  }, [updateData]);

  const updateDashboardMetricOrder = useCallback((order: DashboardMetricId[]) => {
    updateData((current) => ({ ...current, dashboardMetricOrder: order }));
  }, [updateData]);

  const updateFormChecklist = useCallback((sessionId: string, exerciseIndex: number, setIndex: number, itemId: string, checked: boolean) => {
    updateData((current) => ({ ...current, sessions: current.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      return { ...session, exercises: session.exercises.map((entry, index) => {
        if (index !== exerciseIndex) return entry;
        return { ...entry, sets: entry.sets.map((set, currentIndex) => {
          if (currentIndex !== setIndex) return set;
          const currentItems = set.formChecklist ?? [];
          const formChecklist = checked ? Array.from(new Set([...currentItems, itemId])) : currentItems.filter((item) => item !== itemId);
          return { ...set, formChecklist };
        }) };
      }) };
    }) }));
  }, [updateData]);

  const upsertVideoFavorite = useCallback((favorite: VideoFavorite) => {
    updateData((current) => ({ ...current, videoFavorites: [...current.videoFavorites.filter((item) => item.exerciseId !== favorite.exerciseId), favorite] }));
  }, [updateData]);

  const removeVideoFavorite = useCallback((exerciseId: string) => {
    updateData((current) => ({ ...current, videoFavorites: current.videoFavorites.filter((item) => item.exerciseId !== exerciseId) }));
  }, [updateData]);

  const recordVideoWatch = useCallback((input: Omit<VideoWatchHistory, "watchedAt" | "watchCount">) => {
    updateData((current) => {
      const matching = current.videoWatchHistory.find((item) => item.exerciseId === input.exerciseId && item.url === input.url);
      const next: VideoWatchHistory = { ...input, watchedAt: new Date().toISOString(), watchCount: (matching?.watchCount ?? 0) + 1 };
      return { ...current, videoWatchHistory: [next, ...current.videoWatchHistory.filter((item) => !(item.exerciseId === input.exerciseId && item.url === input.url))].slice(0, 60) };
    });
  }, [updateData]);

  const updateSettings = useCallback((patch: Partial<FitnessSettings>) => {
    updateData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, [updateData]);

  const recordAdShown = useCallback(() => {
    updateData((current) => ({ ...current, monetization: { ...current.monetization, lastAdAt: new Date().toISOString(), adCount: current.monetization.adCount + 1 } }));
  }, [updateData]);

  const recordPaywallShown = useCallback(() => {
    updateData((current) => ({ ...current, monetization: { ...current.monetization, lastPaywallAt: new Date().toISOString() } }));
  }, [updateData]);

  const startPremiumTrial = useCallback((plan: PremiumPlan) => {
    updateData((current) => ({ ...current, monetization: { ...current.monetization, premiumStatus: "trial", selectedPlan: plan, trialStartedAt: new Date().toISOString() } }));
  }, [updateData]);

  const setPremiumStatus = useCallback((status: MonetizationProfile["premiumStatus"]) => {
    updateData((current) => ({ ...current, monetization: { ...current.monetization, premiumStatus: status } }));
  }, [updateData]);

  const activeSession = data.sessions.find((session) => session.id === data.activeSessionId);
  const value = useMemo(() => ({ data, ready, activeSession, createTemplate, importTemplate, addExerciseToTemplate, startWorkout, addExerciseToSession, addSet, updateSet, setSuperset, finishWorkout, addBodyWeight, applyHealthSnapshot, saveWellness, addMeasurement, updateTransformationGoal, saveGeneratedPlan, addCoachTask, toggleCoachTask, scheduleTemplate, rescheduleWorkout, addNutrition, updateEquipmentProfile, updatePartner, updateDashboardMetricOrder, updateFormChecklist, upsertVideoFavorite, removeVideoFavorite, recordVideoWatch, updateSettings, recordAdShown, recordPaywallShown, startPremiumTrial, setPremiumStatus }), [data, ready, activeSession, createTemplate, importTemplate, addExerciseToTemplate, startWorkout, addExerciseToSession, addSet, updateSet, setSuperset, finishWorkout, addBodyWeight, applyHealthSnapshot, saveWellness, addMeasurement, updateTransformationGoal, saveGeneratedPlan, addCoachTask, toggleCoachTask, scheduleTemplate, rescheduleWorkout, addNutrition, updateEquipmentProfile, updatePartner, updateDashboardMetricOrder, updateFormChecklist, upsertVideoFavorite, removeVideoFavorite, recordVideoWatch, updateSettings, recordAdShown, recordPaywallShown, startPremiumTrial, setPremiumStatus]);
  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
}

export function useFitness() {
  const value = useContext(FitnessContext);
  if (!value) throw new Error("useFitness must be used within FitnessProvider");
  return value;
}
