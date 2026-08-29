import { estimatedOneRepMax, workoutVolume } from "@/lib/fitness-analytics";
import { exerciseById, type CoachTask, type WellnessEntry, type WorkoutSession } from "@/shared/fitness";

export type AdaptiveTarget = { exerciseId: string; exerciseName: string; weight: number; reps: number; note: string };
export type Badge = { id: string; title: string; detail: string; icon: "local-fire-department" | "emoji-events" | "bolt" | "done-all"; unlocked: boolean };

export function latestWellness(entries: WellnessEntry[]) {
  return [...entries].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0];
}

export function recoveryScore(entry?: WellnessEntry) {
  if (!entry) return null;
  const sleep = Math.min(entry.sleepHours / 8, 1) * 40;
  const hydration = Math.min(entry.waterLiters / 2.5, 1) * 25;
  const readiness = Math.min(entry.readiness / 5, 1) * 35;
  return Math.round(sleep + hydration + readiness);
}

export function adaptiveTargets(sessions: WorkoutSession[], limit = 3): AdaptiveTarget[] {
  const completed = sessions.filter((session) => session.completedAt);
  const byExercise = new Map<string, { weight: number; reps: number; rpe?: number }[]>();
  completed.forEach((session) => session.exercises.forEach((entry) => {
    const values = entry.sets.filter((set) => set.completed).map((set) => ({ weight: set.weight, reps: set.reps, rpe: set.rpe }));
    if (values.length) byExercise.set(entry.exerciseId, [...(byExercise.get(entry.exerciseId) ?? []), ...values]);
  }));
  return Array.from(byExercise.entries()).slice(-limit).map(([exerciseId, sets]) => {
    const recent = sets.slice(-3);
    const averageWeight = recent.reduce((sum, set) => sum + set.weight, 0) / recent.length;
    const averageReps = Math.round(recent.reduce((sum, set) => sum + set.reps, 0) / recent.length);
    const stable = recent.length >= 2 && recent.every((set) => set.reps >= 8 && (set.rpe ?? 9) <= 8);
    const weight = Math.round((averageWeight + (stable ? 2.5 : 0)) * 2) / 2;
    const exercise = exerciseById(exerciseId);
    return { exerciseId, exerciseName: exercise?.name ?? "Egzersiz", weight, reps: averageReps, note: stable ? "Kontrollü tekrarların güçlü; küçük yük artışı önerildi." : "Yükü koru ve tekrar kalitesini sabitle." };
  });
}

export function performanceBadges(sessions: WorkoutSession[], tasks: CoachTask[]): Badge[] {
  const completed = sessions.filter((session) => session.completedAt);
  const totalSets = completed.flatMap((session) => session.exercises.flatMap((entry) => entry.sets.filter((set) => set.completed))).length;
  const totalVolume = completed.reduce((sum, session) => sum + workoutVolume(session), 0);
  const prCount = new Set(completed.flatMap((session) => session.exercises.flatMap((entry) => entry.sets.filter((set) => set.completed).map((set) => `${entry.exerciseId}:${estimatedOneRepMax(set.weight, set.reps)}`)))).size;
  return [
    { id: "starter", title: "İlk Adım", detail: "İlk tamamlanan antrenman", icon: "bolt", unlocked: completed.length >= 1 },
    { id: "volume", title: "Hacim Ustası", detail: "10.000 kg toplam hacim", icon: "local-fire-department", unlocked: totalVolume >= 10000 },
    { id: "sets", title: "Set Avcısı", detail: "100 tamamlanan set", icon: "done-all", unlocked: totalSets >= 100 },
    { id: "coach", title: "Plan Disiplini", detail: "Tüm koç görevlerini tamamla", icon: "emoji-events", unlocked: tasks.length > 0 && tasks.every((task) => task.completed) },
    { id: "pr", title: "Rekor Rotası", detail: "5 performans kaydı", icon: "emoji-events", unlocked: prCount >= 5 },
  ];
}
