import { exerciseById, type BodyWeightEntry, type MuscleGroup, type WorkoutSession } from "@/shared/fitness";

export function completedSets(session: WorkoutSession) {
  return session.exercises.flatMap((exercise) => exercise.sets.filter((set) => set.completed));
}

export function workoutVolume(session: WorkoutSession) {
  return completedSets(session).reduce((total, set) => total + set.weight * set.reps, 0);
}

export type ChecklistCompliance = {
  completedSets: number;
  checkedItems: number;
  possibleItems: number;
  percent: number;
  byExercise: { exerciseId: string; name: string; completedSets: number; checkedItems: number; possibleItems: number }[];
};

export function checklistCompliance(session: WorkoutSession): ChecklistCompliance {
  const byExercise = session.exercises.map((entry) => {
    const sets = entry.sets.filter((set) => set.completed);
    const completedSets = sets.length;
    const checkedItems = sets.reduce((total, set) => total + (set.formChecklist?.length ?? 0), 0);
    const possibleItems = completedSets * 3;
    return { exerciseId: entry.exerciseId, name: exerciseById(entry.exerciseId)?.name ?? "Egzersiz", completedSets, checkedItems, possibleItems };
  }).filter((item) => item.completedSets > 0);
  const completedSets = byExercise.reduce((total, item) => total + item.completedSets, 0);
  const checkedItems = byExercise.reduce((total, item) => total + item.checkedItems, 0);
  const possibleItems = byExercise.reduce((total, item) => total + item.possibleItems, 0);
  return { completedSets, checkedItems, possibleItems, percent: possibleItems ? Math.round((checkedItems / possibleItems) * 100) : 0, byExercise };
}

export function estimatedOneRepMax(weight: number, reps: number) {
  if (weight <= 0 || reps <= 0) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function totalVolume(sessions: WorkoutSession[]) {
  return sessions.reduce((total, session) => total + workoutVolume(session), 0);
}

export type TrainingConsistency = { streakDays: number; activeDays: number; lastCompletedAt?: string };

export function trainingConsistency(sessions: WorkoutSession[], referenceDate = new Date()): TrainingConsistency {
  const days = new Set(sessions.filter((session) => session.completedAt).map((session) => session.completedAt!.slice(0, 10)));
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  let cursor = new Date(today);
  const dateKey = (value: Date) => value.toISOString().slice(0, 10);
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streakDays = 0;
  while (days.has(dateKey(cursor))) { streakDays += 1; cursor.setDate(cursor.getDate() - 1); }
  const lastCompletedAt = sessions.filter((session) => session.completedAt).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))[0]?.completedAt;
  return { streakDays, activeDays: days.size, lastCompletedAt };
}

export type PersonalRecord = {
  exerciseId: string;
  name: string;
  oneRepMax: number;
  weight: number;
  reps: number;
  achievedAt: string;
};

export function personalRecords(sessions: WorkoutSession[]) {
  const records = new Map<string, PersonalRecord>();
  sessions.forEach((session) => {
    session.exercises.forEach((entry) => {
      const exercise = exerciseById(entry.exerciseId);
      entry.sets.filter((set) => set.completed).forEach((set) => {
        const next = estimatedOneRepMax(set.weight, set.reps);
        const current = records.get(entry.exerciseId);
        if (exercise && (!current || next > current.oneRepMax)) {
          records.set(entry.exerciseId, {
            exerciseId: entry.exerciseId,
            name: exercise.name,
            oneRepMax: next,
            weight: set.weight,
            reps: set.reps,
            achievedAt: session.completedAt ?? session.startedAt,
          });
        }
      });
    });
  });
  return Array.from(records.values()).sort((a, b) => b.oneRepMax - a.oneRepMax);
}

export function muscleVolume(sessions: WorkoutSession[]) {
  const result = new Map<MuscleGroup, number>();
  sessions.forEach((session) => {
    session.exercises.forEach((entry) => {
      const exercise = exerciseById(entry.exerciseId);
      if (!exercise) return;
      const volume = entry.sets.filter((set) => set.completed).reduce((total, set) => total + set.reps * set.weight, 0);
      exercise.primaryMuscles.forEach((muscle) => result.set(muscle, (result.get(muscle) ?? 0) + volume / exercise.primaryMuscles.length));
    });
  });
  return Array.from(result.entries()).map(([muscle, volume]) => ({ muscle, volume: Math.round(volume) }));
}

export function bodyWeightChange(entries: BodyWeightEntry[]) {
  if (entries.length < 2) return null;
  const chronological = [...entries].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  return Math.round((chronological.at(-1)!.weight - chronological[0].weight) * 10) / 10;
}

export function progressionHint(sessions: WorkoutSession[], exerciseId: string, unit: string) {
  const sets = sessions
    .flatMap((session) => session.exercises.filter((entry) => entry.exerciseId === exerciseId).flatMap((entry) => entry.sets.filter((set) => set.completed)))
    .slice(-3);
  if (sets.length < 2) return "Öneri için en az iki tamamlanmış set kaydedin.";
  const stable = sets.every((set) => set.reps >= 8 && set.rpe !== undefined && set.rpe <= 8);
  if (stable) return `Bir sonraki sette küçük bir artış deneyin (+2,5 ${unit}).`;
  return "Ağırlığı koruyun; önce kontrollü tekrar kalitesini geliştirin.";
}
