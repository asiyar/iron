export type MuscleGroup =
  | "Göğüs"
  | "Sırt"
  | "Omuz"
  | "Biceps"
  | "Triceps"
  | "Quadriceps"
  | "Hamstring"
  | "Glute"
  | "Core"
  | "Baldır";

export const MUSCLE_REGIONS = [
  "Pectoralis major · üst", "Pectoralis major · alt", "Anterior deltoid", "Lateral deltoid", "Posterior deltoid", "Trapezius · üst", "Trapezius · orta", "Biceps brachii", "Brachialis & ön kol", "Triceps · uzun baş", "Triceps · lateral baş", "Latissimus dorsi · üst", "Latissimus dorsi · alt", "Rhomboid & orta sırt", "Erector spinae", "Gluteus maximus", "Gluteus medius", "Rectus abdominis · üst", "Rectus abdominis · alt", "Obliques", "Serratus anterior", "Quadriceps", "Adductors", "Hamstring · medial", "Hamstring · lateral", "Gastrocnemius", "Soleus", "Tibialis anterior",
] as const;

export type MuscleRegion = typeof MUSCLE_REGIONS[number];
export type MuscleFocus = { atlasId: string; group: MuscleGroup; region: MuscleRegion; label: string };

const ATLAS_FOCUS_RULES: { prefix: string; group: MuscleGroup; region: MuscleRegion }[] = [
  { prefix: "chest-upper", group: "Göğüs", region: "Pectoralis major · üst" }, { prefix: "chest-lower", group: "Göğüs", region: "Pectoralis major · alt" },
  { prefix: "shoulder-front", group: "Omuz", region: "Anterior deltoid" }, { prefix: "shoulder-side", group: "Omuz", region: "Lateral deltoid" }, { prefix: "deltoid-rear", group: "Omuz", region: "Posterior deltoid" },
  { prefix: "traps-upper", group: "Omuz", region: "Trapezius · üst" }, { prefix: "traps-mid", group: "Sırt", region: "Trapezius · orta" }, { prefix: "traps-lower", group: "Sırt", region: "Trapezius · orta" },
  { prefix: "biceps", group: "Biceps", region: "Biceps brachii" }, { prefix: "forearm", group: "Biceps", region: "Brachialis & ön kol" }, { prefix: "elbow", group: "Biceps", region: "Brachialis & ön kol" },
  { prefix: "triceps-long", group: "Triceps", region: "Triceps · uzun baş" }, { prefix: "triceps-lateral", group: "Triceps", region: "Triceps · lateral baş" },
  { prefix: "lats-upper", group: "Sırt", region: "Latissimus dorsi · üst" }, { prefix: "lats-mid", group: "Sırt", region: "Latissimus dorsi · üst" }, { prefix: "lats-lower", group: "Sırt", region: "Latissimus dorsi · alt" }, { prefix: "rhomboid", group: "Sırt", region: "Rhomboid & orta sırt" },
  { prefix: "lower-back", group: "Sırt", region: "Erector spinae" }, { prefix: "spine", group: "Sırt", region: "Erector spinae" },
  { prefix: "gluteus-maximus", group: "Glute", region: "Gluteus maximus" }, { prefix: "gluteus-medius", group: "Glute", region: "Gluteus medius" },
  { prefix: "abs-upper", group: "Core", region: "Rectus abdominis · üst" }, { prefix: "abs-lower", group: "Core", region: "Rectus abdominis · alt" }, { prefix: "obliques", group: "Core", region: "Obliques" }, { prefix: "serratus", group: "Core", region: "Serratus anterior" }, { prefix: "hip-flexor", group: "Core", region: "Rectus abdominis · alt" },
  { prefix: "quads", group: "Quadriceps", region: "Quadriceps" }, { prefix: "adductors", group: "Quadriceps", region: "Adductors" }, { prefix: "hamstrings-medial", group: "Hamstring", region: "Hamstring · medial" }, { prefix: "hamstrings-lateral", group: "Hamstring", region: "Hamstring · lateral" },
  { prefix: "calves-gastroc", group: "Baldır", region: "Gastrocnemius" }, { prefix: "calves-soleus", group: "Baldır", region: "Soleus" }, { prefix: "tibialis", group: "Baldır", region: "Tibialis anterior" },
];

export function muscleFocusForAtlasRegion(atlasId: string): MuscleFocus | undefined {
  const match = ATLAS_FOCUS_RULES.find((rule) => atlasId.startsWith(rule.prefix));
  if (!match) return undefined;
  const side = atlasId.endsWith("-left") ? "sol" : atlasId.endsWith("-right") ? "sağ" : "orta";
  return { atlasId, group: match.group, region: match.region, label: `${match.region} · ${side}` };
}

export type Exercise = {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  equipment: string;
  notes?: string;
  targetRegions?: MuscleRegion[];
};

export type ExerciseCategory = "Kardiyo" | "Kas kazanımı" | "Yağ kaybı" | "Kilo alma" | "Bacak" | "Sırt" | "Göğüs" | "Kol & Omuz" | "Core";

export const EXERCISE_CATEGORY_INFO: Record<ExerciseCategory, { title: string; subtitle: string; icon: string }> = {
  "Kardiyo": { title: "Kardiyo", subtitle: "Kondisyon, kalp sağlığı ve günlük enerji harcaması", icon: "directions-run" },
  "Kas kazanımı": { title: "Kas kazanımı", subtitle: "Hacim ve kontrollü progresif yüklenme", icon: "fitness-center" },
  "Yağ kaybı": { title: "Yağ kaybı", subtitle: "Yoğunluk, tüm vücut hareketleri ve kondisyon", icon: "local-fire-department" },
  "Kilo alma": { title: "Kilo alma", subtitle: "Büyük kas grupları için kuvvet odaklı temel hareketler", icon: "trending-up" },
  "Bacak": { title: "Bacak & kalça", subtitle: "Quadriceps, hamstring, glute ve baldır", icon: "directions-walk" },
  "Sırt": { title: "Sırt", subtitle: "Genişlik, kalınlık ve postür desteği", icon: "accessibility-new" },
  "Göğüs": { title: "Göğüs", subtitle: "Press ve fly varyasyonları", icon: "favorite-border" },
  "Kol & Omuz": { title: "Kol & omuz", subtitle: "Deltoid, biceps ve triceps odaklı", icon: "sports-martial-arts" },
  "Core": { title: "Core", subtitle: "Karın stabilitesi ve gövde kontrolü", icon: "self-improvement" },
};

export type WorkoutSet = {
  id: string;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
  formChecklist?: string[];
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  supersetId?: string;
  note?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  createdAt: string;
  exercises: WorkoutExercise[];
};

export type WorkoutSession = {
  id: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  exercises: WorkoutExercise[];
  notes?: string;
};

export type BodyWeightEntry = {
  id: string;
  weight: number;
  recordedAt: string;
  source?: "manual" | "health";
};

export type HealthProvider = "apple-health" | "health-connect" | "none";

export type HealthSyncStatus = "disconnected" | "connected" | "unsupported" | "needs-permission" | "error";

export type HealthSnapshot = {
  provider: HealthProvider;
  status: HealthSyncStatus;
  enabled: boolean;
  lastSyncedAt?: string;
  stepsToday?: number;
  latestWeight?: { value: number; recordedAt: string };
  lastWorkoutAt?: string;
  workoutCount?: number;
  message?: string;
};

export type FitnessSettings = {
  unit: "kg" | "lb";
  biometricLockEnabled: boolean;
  lockTimeoutMinutes: number;
  defaultRestSeconds: number;
  voiceCoachEnabled: boolean;
  voiceCoachLanguage: "tr-TR" | "en-US";
  voiceCoachRate: 0.8 | 0.95 | 1.1;
};

export type WellnessEntry = {
  id: string;
  recordedAt: string;
  proteinGrams: number;
  waterLiters: number;
  sleepHours: number;
  readiness: number;
  steps?: number;
};

export type MeasurementEntry = {
  id: string;
  recordedAt: string;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  note?: string;
  photoUri?: string;
};

export type TransformationGoal = {
  targetWeight?: number;
  targetDate?: string;
  focus?: "Güç" | "Kas kazanımı" | "Yağ kaybı" | "Performans";
};

export type TrainingGoal = "Yağ kaybı" | "Kas kazanımı" | "Güç" | "Kondisyon";
export type PhysiqueGoal = "Atletik & dengeli" | "Kas hacmi" | "Yağ kaybı & fit" | "Güç & performans";
export type ExperienceLevel = "Sıfırdan" | "Başlangıç" | "Orta";
export type EquipmentAccess = "Evde vücut ağırlığı" | "Ev ekipmanı" | "Tam salon";

export type PlanPreferences = {
  goal: TrainingGoal;
  physique: PhysiqueGoal;
  experience: ExperienceLevel;
  daysPerWeek: 2 | 3 | 4 | 5;
  equipment: EquipmentAccess;
  limitationNote?: string;
  createdAt: string;
};

export type GeneratedPlanSession = {
  day: number;
  title: string;
  focus: string;
  exerciseIds: string[];
  sets: string;
  recoveryNote: string;
};

export type GeneratedPlanWeek = { week: number; focus: string; sessions: GeneratedPlanSession[] };

export type NutritionGuide = { title: string; principles: string[]; recoveryNote: string; safetyNote: string };

export type GeneratedPlan = {
  id: string;
  name: string;
  profile: PlanPreferences;
  weeks: GeneratedPlanWeek[];
  phases: { label: string; weeks: string; purpose: string }[];
  nutrition: NutritionGuide;
  createdAt: string;
};

export type CoachTask = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
};

export type ScheduledWorkout = {
  id: string;
  templateId: string;
  scheduledFor: string;
  status: "planned" | "completed" | "missed";
};

export type NutritionEntry = {
  id: string;
  recordedAt: string;
  label: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  source: "manual" | "barcode";
};

export type PartnerProfile = {
  displayName?: string;
  inviteCode?: string;
  enabled: boolean;
};

export type DashboardMetricId = "readiness" | "badges" | "weekly-volume" | "sessions";

export type VideoFavorite = {
  exerciseId: string;
  title: string;
  url: string;
  provider: string;
  license: string;
  author?: string;
  savedAt: string;
  localUri?: string;
  downloadStatus: "idle" | "saved" | "downloading" | "failed";
};

export type VideoWatchHistory = {
  exerciseId: string;
  title: string;
  url: string;
  provider: string;
  watchedAt: string;
  watchCount: number;
  localUri?: string;
};

export type PremiumPlan = "monthly" | "annual";
export type PremiumStatus = "free" | "trial" | "active" | "expired";

export type MonetizationProfile = {
  appOpenedAt?: string;
  lastAdAt?: string;
  adCount: number;
  lastPaywallAt?: string;
  premiumStatus: PremiumStatus;
  trialStartedAt?: string;
  selectedPlan?: PremiumPlan;
};

export type FitnessData = {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  activeSessionId?: string;
  bodyWeights: BodyWeightEntry[];
  healthSync: HealthSnapshot;
  wellness: WellnessEntry[];
  measurements: MeasurementEntry[];
  transformationGoal: TransformationGoal;
  planProfile?: PlanPreferences;
  activeGeneratedPlan?: GeneratedPlan;
  coachTasks: CoachTask[];
  schedule: ScheduledWorkout[];
  nutrition: NutritionEntry[];
  equipmentProfile: string[];
  partner: PartnerProfile;
  dashboardMetricOrder: DashboardMetricId[];
  videoFavorites: VideoFavorite[];
  videoWatchHistory: VideoWatchHistory[];
  monetization: MonetizationProfile;
  settings: FitnessSettings;
};

export const EXERCISES: Exercise[] = [
  { id: "barbell-bench-press", name: "Barbell Bench Press", primaryMuscles: ["Göğüs", "Triceps"], equipment: "Barbell" },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", primaryMuscles: ["Göğüs", "Omuz", "Triceps"], equipment: "Dumbbell" },
  { id: "cable-fly", name: "Cable Fly", primaryMuscles: ["Göğüs"], equipment: "Cable" },
  { id: "pull-up", name: "Pull-up", primaryMuscles: ["Sırt", "Biceps"], equipment: "Bodyweight" },
  { id: "barbell-row", name: "Barbell Row", primaryMuscles: ["Sırt", "Biceps"], equipment: "Barbell" },
  { id: "lat-pulldown", name: "Lat Pulldown", primaryMuscles: ["Sırt", "Biceps"], equipment: "Cable" },
  { id: "overhead-press", name: "Overhead Press", primaryMuscles: ["Omuz", "Triceps"], equipment: "Barbell" },
  { id: "lateral-raise", name: "Lateral Raise", primaryMuscles: ["Omuz"], equipment: "Dumbbell" },
  { id: "barbell-squat", name: "Barbell Squat", primaryMuscles: ["Quadriceps", "Glute", "Core"], equipment: "Barbell" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscles: ["Hamstring", "Glute", "Sırt"], equipment: "Barbell" },
  { id: "leg-press", name: "Leg Press", primaryMuscles: ["Quadriceps", "Glute"], equipment: "Machine" },
  { id: "leg-curl", name: "Leg Curl", primaryMuscles: ["Hamstring"], equipment: "Machine" },
  { id: "barbell-curl", name: "Barbell Curl", primaryMuscles: ["Biceps"], equipment: "Barbell" },
  { id: "triceps-pushdown", name: "Triceps Pushdown", primaryMuscles: ["Triceps"], equipment: "Cable" },
  { id: "standing-calf-raise", name: "Standing Calf Raise", primaryMuscles: ["Baldır"], equipment: "Machine" },
  { id: "cable-crunch", name: "Cable Crunch", primaryMuscles: ["Core"], equipment: "Cable" },
  { id: "push-up", name: "Push-up", primaryMuscles: ["Göğüs", "Triceps", "Core"], equipment: "Bodyweight" },
  { id: "machine-chest-press", name: "Machine Chest Press", primaryMuscles: ["Göğüs", "Triceps"], equipment: "Machine" },
  { id: "dumbbell-row", name: "One-arm Dumbbell Row", primaryMuscles: ["Sırt", "Biceps"], equipment: "Dumbbell" },
  { id: "seated-cable-row", name: "Seated Cable Row", primaryMuscles: ["Sırt", "Biceps"], equipment: "Cable" },
  { id: "face-pull", name: "Face Pull", primaryMuscles: ["Omuz", "Sırt"], equipment: "Cable" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", primaryMuscles: ["Omuz", "Triceps"], equipment: "Dumbbell" },
  { id: "reverse-fly", name: "Reverse Fly", primaryMuscles: ["Omuz", "Sırt"], equipment: "Dumbbell" },
  { id: "hammer-curl", name: "Hammer Curl", primaryMuscles: ["Biceps"], equipment: "Dumbbell" },
  { id: "skull-crusher", name: "Skull Crusher", primaryMuscles: ["Triceps"], equipment: "Barbell" },
  { id: "walking-lunge", name: "Walking Lunge", primaryMuscles: ["Quadriceps", "Glute", "Hamstring"], equipment: "Dumbbell" },
  { id: "hip-thrust", name: "Hip Thrust", primaryMuscles: ["Glute", "Hamstring"], equipment: "Barbell" },
  { id: "dumbbell-deadlift", name: "Dumbbell Deadlift", primaryMuscles: ["Hamstring", "Glute", "Sırt"], equipment: "Dumbbell" },
  { id: "step-up", name: "Step-up", primaryMuscles: ["Quadriceps", "Glute"], equipment: "Dumbbell" },
  { id: "leg-extension", name: "Leg Extension", primaryMuscles: ["Quadriceps"], equipment: "Machine" },
  { id: "glute-bridge", name: "Glute Bridge", primaryMuscles: ["Glute", "Core"], equipment: "Bodyweight" },
  { id: "plank", name: "Plank", primaryMuscles: ["Core", "Omuz"], equipment: "Bodyweight" },
  { id: "incline-walk", name: "Incline Treadmill Walk", primaryMuscles: ["Glute", "Hamstring", "Baldır"], equipment: "Treadmill" },
  { id: "running", name: "Running Intervals", primaryMuscles: ["Quadriceps", "Hamstring", "Baldır"], equipment: "Track" },
  { id: "cycling", name: "Stationary Cycling", primaryMuscles: ["Quadriceps", "Glute"], equipment: "Bike" },
  { id: "rowing-erg", name: "Rowing Ergometer", primaryMuscles: ["Sırt", "Quadriceps", "Core"], equipment: "Rower" },
  { id: "jump-rope", name: "Jump Rope", primaryMuscles: ["Baldır", "Core"], equipment: "Rope" },
  { id: "burpee", name: "Burpee", primaryMuscles: ["Göğüs", "Quadriceps", "Core"], equipment: "Bodyweight" },
];

export const EXERCISE_REGION_TARGETS: Record<string, MuscleRegion[]> = {
  "barbell-bench-press": ["Pectoralis major · alt", "Triceps · lateral baş"], "incline-dumbbell-press": ["Pectoralis major · üst", "Anterior deltoid", "Triceps · uzun baş"], "cable-fly": ["Pectoralis major · üst", "Pectoralis major · alt"],
  "pull-up": ["Latissimus dorsi · üst", "Biceps brachii"], "barbell-row": ["Latissimus dorsi · üst", "Rhomboid & orta sırt", "Biceps brachii"], "lat-pulldown": ["Latissimus dorsi · üst", "Biceps brachii"],
  "overhead-press": ["Anterior deltoid", "Lateral deltoid", "Triceps · lateral baş"], "lateral-raise": ["Lateral deltoid"], "barbell-squat": ["Quadriceps", "Gluteus maximus", "Rectus abdominis · alt"], "romanian-deadlift": ["Hamstring · medial", "Hamstring · lateral", "Gluteus maximus", "Erector spinae"],
  "leg-press": ["Quadriceps", "Gluteus maximus"], "leg-curl": ["Hamstring · medial", "Hamstring · lateral"], "barbell-curl": ["Biceps brachii"], "triceps-pushdown": ["Triceps · uzun baş", "Triceps · lateral baş"], "standing-calf-raise": ["Gastrocnemius", "Soleus"], "cable-crunch": ["Rectus abdominis · üst", "Rectus abdominis · alt"],
  "push-up": ["Pectoralis major · alt", "Triceps · lateral baş", "Rectus abdominis · alt"], "machine-chest-press": ["Pectoralis major · alt", "Triceps · lateral baş"], "dumbbell-row": ["Latissimus dorsi · alt", "Biceps brachii"], "seated-cable-row": ["Rhomboid & orta sırt", "Latissimus dorsi · üst"], "face-pull": ["Posterior deltoid", "Trapezius · orta"], "dumbbell-shoulder-press": ["Anterior deltoid", "Lateral deltoid", "Triceps · uzun baş"],
  "reverse-fly": ["Posterior deltoid", "Rhomboid & orta sırt"], "hammer-curl": ["Brachialis & ön kol"], "skull-crusher": ["Triceps · uzun baş"], "walking-lunge": ["Quadriceps", "Gluteus maximus", "Hamstring · medial"], "hip-thrust": ["Gluteus maximus", "Hamstring · medial"], "dumbbell-deadlift": ["Hamstring · medial", "Gluteus maximus", "Erector spinae"],
  "step-up": ["Quadriceps", "Gluteus maximus"], "leg-extension": ["Quadriceps"], "glute-bridge": ["Gluteus maximus", "Rectus abdominis · alt"], "plank": ["Rectus abdominis · üst", "Rectus abdominis · alt", "Anterior deltoid"], "incline-walk": ["Gluteus maximus", "Hamstring · medial", "Gastrocnemius"], "running": ["Quadriceps", "Hamstring · lateral", "Gastrocnemius"], "cycling": ["Quadriceps", "Gluteus maximus"], "rowing-erg": ["Latissimus dorsi · üst", "Quadriceps", "Rectus abdominis · alt"], "jump-rope": ["Gastrocnemius", "Soleus", "Rectus abdominis · alt"], "burpee": ["Pectoralis major · alt", "Quadriceps", "Rectus abdominis · alt"],
};

export function rankedExercisesForMuscleFocus(focus?: MuscleFocus) {
  if (!focus) return [];
  return EXERCISES.map((exercise) => ({
    exercise,
    score: (EXERCISE_REGION_TARGETS[exercise.id]?.includes(focus.region) ? 100 : 0) + (exercise.primaryMuscles.includes(focus.group) ? 10 : 0),
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name, "tr")).map((item) => item.exercise);
}

export function exerciseById(id: string) {
  return EXERCISES.find((exercise) => exercise.id === id);
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Göğüs", "Sırt", "Omuz", "Biceps", "Triceps", "Quadriceps", "Hamstring", "Glute", "Core", "Baldır",
];

export function categoriesForExercise(exercise: Exercise): ExerciseCategory[] {
  const categories = new Set<ExerciseCategory>();
  const name = exercise.name.toLowerCase();
  if (["incline-walk", "running", "cycling", "rowing-erg", "jump-rope", "burpee"].includes(exercise.id)) categories.add("Kardiyo");
  if (["burpee", "jump-rope", "running", "rowing-erg"].includes(exercise.id)) categories.add("Yağ kaybı");
  if (["barbell-bench-press", "barbell-squat", "romanian-deadlift", "hip-thrust", "overhead-press", "barbell-row", "leg-press"].includes(exercise.id)) categories.add("Kilo alma");
  if (!categories.has("Kardiyo")) categories.add("Kas kazanımı");
  if (exercise.primaryMuscles.some((muscle) => ["Quadriceps", "Hamstring", "Glute", "Baldır"].includes(muscle))) categories.add("Bacak");
  if (exercise.primaryMuscles.includes("Sırt")) categories.add("Sırt");
  if (exercise.primaryMuscles.includes("Göğüs")) categories.add("Göğüs");
  if (exercise.primaryMuscles.some((muscle) => ["Biceps", "Triceps", "Omuz"].includes(muscle))) categories.add("Kol & Omuz");
  if (exercise.primaryMuscles.includes("Core")) categories.add("Core");
  if (name.includes("burpee")) categories.add("Kas kazanımı");
  return Array.from(categories);
}

const PLAN_SESSION_LIBRARY: Record<TrainingGoal, { title: string; focus: string; exerciseIds: string[] }[]> = {
  "Kas kazanımı": [
    { title: "Üst vücut · itiş", focus: "Göğüs, omuz ve triceps", exerciseIds: ["incline-dumbbell-press", "machine-chest-press", "dumbbell-shoulder-press", "triceps-pushdown", "push-up"] },
    { title: "Alt vücut", focus: "Quadriceps, kalça ve hamstring", exerciseIds: ["barbell-squat", "leg-press", "romanian-deadlift", "leg-curl", "standing-calf-raise"] },
    { title: "Üst vücut · çekiş", focus: "Sırt, arka omuz ve biceps", exerciseIds: ["lat-pulldown", "seated-cable-row", "face-pull", "hammer-curl", "pull-up"] },
    { title: "Tam vücut · destek", focus: "Dengeli hacim ve core", exerciseIds: ["walking-lunge", "dumbbell-row", "overhead-press", "glute-bridge", "plank"] },
  ],
  "Yağ kaybı": [
    { title: "Tam vücut · temel", focus: "Kontrollü kuvvet ve hareket kalitesi", exerciseIds: ["leg-press", "machine-chest-press", "seated-cable-row", "glute-bridge", "plank"] },
    { title: "Kondisyon · düşük darbe", focus: "Sürdürülebilir tempo", exerciseIds: ["incline-walk", "cycling", "rowing-erg", "jump-rope"] },
    { title: "Tam vücut · destek", focus: "Kas korunumu ve core", exerciseIds: ["walking-lunge", "dumbbell-row", "push-up", "cable-crunch"] },
    { title: "Kondisyon · interval", focus: "Kademeli yoğunluk", exerciseIds: ["running", "cycling", "rowing-erg", "burpee"] },
  ],
  "Güç": [
    { title: "Temel itiş", focus: "Teknik, bracing ve kontrollü kuvvet", exerciseIds: ["barbell-bench-press", "overhead-press", "leg-press", "triceps-pushdown", "plank"] },
    { title: "Temel çekiş", focus: "Kalça menteşesi ve sırt kontrolü", exerciseIds: ["romanian-deadlift", "barbell-row", "lat-pulldown", "hammer-curl", "standing-calf-raise"] },
    { title: "Alt vücut · teknik", focus: "Squat deseni ve kalça gücü", exerciseIds: ["barbell-squat", "hip-thrust", "walking-lunge", "leg-curl", "cable-crunch"] },
    { title: "Tam vücut · destek", focus: "Dengeli yardımcı çalışmalar", exerciseIds: ["dumbbell-shoulder-press", "dumbbell-row", "glute-bridge", "face-pull", "plank"] },
  ],
  "Kondisyon": [
    { title: "Kondisyon · temel", focus: "Rahat konuşma temposunda aerobik taban", exerciseIds: ["incline-walk", "cycling", "rowing-erg", "plank"] },
    { title: "Kuvvet · destek", focus: "Dayanıklılığı destekleyen bütün vücut kuvveti", exerciseIds: ["leg-press", "machine-chest-press", "dumbbell-row", "glute-bridge"] },
    { title: "Kondisyon · kademeli interval", focus: "Kısa kaliteli eforlar ve toparlanma", exerciseIds: ["running", "cycling", "jump-rope", "cable-crunch"] },
    { title: "Hareket kalitesi", focus: "Kalça, core ve omuz dengesi", exerciseIds: ["walking-lunge", "face-pull", "push-up", "plank"] },
  ],
};

function accessibleExerciseIds(ids: string[], equipment: EquipmentAccess) {
  const allowed = equipment === "Tam salon" ? undefined : equipment === "Ev ekipmanı" ? new Set(["Dumbbell", "Bodyweight", "Rope"]) : new Set(["Bodyweight", "Rope"]);
  const filtered = ids.filter((id) => !allowed || allowed.has(exerciseById(id)?.equipment ?? ""));
  return filtered.length ? filtered : ["push-up", "glute-bridge", "plank"];
}

export function buildGeneratedPlan(profile: PlanPreferences): GeneratedPlan {
  const library = PLAN_SESSION_LIBRARY[profile.goal];
  const sessionsForWeek = library.slice(0, profile.daysPerWeek).map((item, index) => ({ day: index + 1, title: item.title, focus: item.focus, exerciseIds: accessibleExerciseIds(item.exerciseIds, profile.equipment), sets: "2 set × 8–10 kontrollü tekrar", recoveryNote: "Önce 5–8 dakika ısın; son tekrarlarda teknik bozulursa seti bitir." }));
  const weeklyFocus = ["Hareketleri öğren ve rahat bir başlangıç temposu kur.", "Aynı teknikle düzenli tekrar yap; yalnızca hazır hissedersen bir set ekle.", "RPE 6–7 civarında kontrollü hacim oluştur; ağırlaşmak zorunlu değildir.", "Uyum haftası: daha hafif, akıcı tekrarlarla tekniği gözden geçir."];
  const weeks: GeneratedPlanWeek[] = [1, 2, 3, 4].map((week) => ({ week, focus: weeklyFocus[week - 1], sessions: sessionsForWeek.map((session) => ({ ...session, sets: week === 1 ? "2 set × 8–10 kontrollü tekrar" : week === 2 ? "2–3 set × 8–10 kontrollü tekrar" : week === 3 ? "3 set × 8–12 kontrollü tekrar" : "2 set × 8–10 kolay uyum tekrarı" })) }));
  const nutrition: NutritionGuide = profile.goal === "Yağ kaybı"
    ? { title: "Sürdürülebilir enerji dengesi", principles: ["Öğünlerine protein, sebze veya meyve ve lif kaynağı eklemeye çalış.", "Enerji alımını keskin kısıtlamalar yerine sürdürülebilir küçük düzenlemelerle gözden geçir.", "Su tüketimini ve düzenli öğün ritmini takip et; antrenman günlerinde toparlanmayı ihmal et."], recoveryNote: "Uyku ve dinlenme, performansı ve iştah yönetimini destekler.", safetyNote: "Bu genel eğitim bilgisidir; kişiye özel kalori/makro reçetesi değildir. Hastalık, ilaç kullanımı, hamilelik veya yeme bozukluğu geçmişinde uzmana danış." }
    : profile.goal === "Kas kazanımı"
      ? { title: "Yeterli enerji ve düzenli protein", principles: ["Protein kaynaklarını gün içindeki öğünlere yaymaya çalış.", "Antrenman çevresinde yeterli karbonhidrat ve sıvı, performans ve toparlanmayı destekler.", "Çeşitli sebze, meyve ve lif kaynaklarını düzenli beslenme düzenine ekle."], recoveryNote: "Yeterli uyku ve dinlenme günleri, yüklenme kadar önemlidir.", safetyNote: "Bu genel eğitim bilgisidir; kişiye özel kalori/makro reçetesi değildir. Hastalık, ilaç kullanımı, hamilelik veya yeme bozukluğu geçmişinde uzmana danış." }
      : { title: "Performansı destekleyen dengeli beslenme", principles: ["Her ana öğünde protein, lif ve çeşitli besin gruplarını dengelemeye çalış.", "Antrenman öncesi ve sonrası yeterli sıvı alımını hatırla.", "Yoğunluğu artırırken uyku, dinlenme ve düzenli öğün ritmini birlikte değerlendir."], recoveryNote: "Toparlanma hissin düşükse yoğunluk yerine teknik ve hafif hareketi seç.", safetyNote: "Bu genel eğitim bilgisidir; kişiye özel kalori/makro reçetesi değildir. Hastalık, ilaç kullanımı, hamilelik veya yeme bozukluğu geçmişinde uzmana danış." };
  return { id: `generated-plan-${Date.now()}`, name: `${profile.goal} · başlangıç planı`, profile, weeks, phases: [{ label: "Temel", weeks: "1–4. haftalar", purpose: "Hareket tekniği, düzen ve güvenli yüklenme alışkanlığı." }, { label: "Gelişim", weeks: "5–8. haftalar", purpose: "Teknik korunarak küçük hacim veya tekrar artışları." }, { label: "Pekiştirme", weeks: "9–12. haftalar", purpose: "İlerlemeni değerlendir, gerektiğinde uyum haftası uygula." }], nutrition, createdAt: new Date().toISOString() };
}
