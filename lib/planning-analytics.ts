import { totalVolume } from "@/lib/fitness-analytics";
import { latestWellness, recoveryScore } from "@/lib/performance-engine";
import type { NutritionEntry, WellnessEntry, WorkoutSession } from "@/shared/fitness";

export function deloadGuidance(sessions: WorkoutSession[], wellness: WellnessEntry[]) {
  const now = new Date();
  const last7 = sessions.filter((session) => session.completedAt && now.getTime() - new Date(session.completedAt).getTime() <= 7 * 86_400_000);
  const previous7 = sessions.filter((session) => session.completedAt && now.getTime() - new Date(session.completedAt).getTime() > 7 * 86_400_000 && now.getTime() - new Date(session.completedAt).getTime() <= 14 * 86_400_000);
  const currentVolume = totalVolume(last7);
  const previousVolume = totalVolume(previous7);
  const recovery = recoveryScore(latestWellness(wellness));
  const highJump = previousVolume > 0 && currentVolume > previousVolume * 1.25;
  const lowRecovery = recovery !== null && recovery < 55;
  if (lowRecovery && highJump) return { level: "high" as const, title: "Deload penceresi", detail: "Hazır oluşun düşük ve haftalık yük artışın yüksek. Önümüzdeki antrenmanda setleri azaltmayı veya yükü düşürmeyi değerlendir." };
  if (lowRecovery) return { level: "medium" as const, title: "Toparlanmayı öncele", detail: "Bugünkü günlük düşük toparlanma gösteriyor. RPE hedefini azaltmayı ve teknik odaklı çalışmayı değerlendir." };
  if (highJump) return { level: "medium" as const, title: "Yük artışı hızlı", detail: "Bu haftaki hacim önceki haftaya göre belirgin yükseldi. Bir sonraki oturumda hareket kalitesini izlemeyi unutma." };
  return { level: "low" as const, title: "Yük dengeli", detail: "Mevcut antrenman ve toparlanma sinyalleri dengeli görünüyor. Programını planlandığı gibi sürdürebilirsin." };
}

export function monthlyReport(sessions: WorkoutSession[], nutrition: NutritionEntry[]) {
  const threshold = Date.now() - 30 * 86_400_000;
  const month = sessions.filter((session) => session.completedAt && new Date(session.completedAt).getTime() >= threshold);
  const totalSets = month.flatMap((session) => session.exercises.flatMap((entry) => entry.sets.filter((set) => set.completed))).length;
  const meals = nutrition.filter((entry) => new Date(entry.recordedAt).getTime() >= threshold);
  const protein = meals.reduce((sum, entry) => sum + entry.proteinGrams, 0);
  return { sessions: month.length, sets: totalSets, volume: Math.round(totalVolume(month)), meals: meals.length, averageProtein: meals.length ? Math.round(protein / meals.length) : 0 };
}
