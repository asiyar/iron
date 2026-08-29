import { describe, expect, it } from "vitest";

import { deloadGuidance, monthlyReport } from "../lib/planning-analytics";
import type { NutritionEntry, WellnessEntry, WorkoutSession } from "../shared/fitness";

const now = new Date();
const session: WorkoutSession = { id: "session-current", name: "Legs", startedAt: now.toISOString(), completedAt: now.toISOString(), exercises: [{ id: "entry-1", exerciseId: "barbell-squat", sets: [{ id: "set-1", weight: 100, reps: 8, rpe: 8, completed: true }, { id: "set-2", weight: 100, reps: 8, rpe: 8, completed: true }] }] };
const lowRecovery: WellnessEntry = { id: "wellness-low", recordedAt: now.toISOString(), proteinGrams: 80, waterLiters: 0.8, sleepHours: 4.5, readiness: 1 };
const meal: NutritionEntry = { id: "meal-1", recordedAt: now.toISOString(), label: "Yoğurt", calories: 180, proteinGrams: 20, carbsGrams: 11, fatGrams: 6, source: "manual" };

describe("planning analytics", () => {
  it("warns users to prioritize recovery when readiness is low", () => {
    expect(deloadGuidance([session], [lowRecovery]).level).toBe("medium");
  });

  it("summarizes the last 30 days using recorded sessions and nutrition", () => {
    const report = monthlyReport([session], [meal]);
    expect(report.sessions).toBe(1);
    expect(report.sets).toBe(2);
    expect(report.averageProtein).toBe(20);
  });
});
