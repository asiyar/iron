import { describe, expect, it } from "vitest";

import { adaptiveTargets, performanceBadges, recoveryScore } from "../lib/performance-engine";
import type { WellnessEntry, WorkoutSession } from "../shared/fitness";

const completed: WorkoutSession = {
  id: "session-1", name: "Push", startedAt: "2026-08-23T08:00:00.000Z", completedAt: "2026-08-23T09:00:00.000Z",
  exercises: [{ id: "entry-1", exerciseId: "barbell-bench-press", sets: [{ id: "set-1", weight: 80, reps: 8, rpe: 8, completed: true }, { id: "set-2", weight: 80, reps: 8, rpe: 8, completed: true }] }],
};

describe("performance engine", () => {
  it("adds a conservative adaptive load target after repeatable submaximal work", () => {
    const target = adaptiveTargets([completed])[0];
    expect(target.weight).toBe(82.5);
    expect(target.reps).toBe(8);
  });

  it("scores sleep, hydration and readiness without exceeding 100", () => {
    const wellness: WellnessEntry = { id: "wellness-1", recordedAt: "2026-08-23T07:00:00.000Z", proteinGrams: 140, waterLiters: 2.5, sleepHours: 8, readiness: 5 };
    expect(recoveryScore(wellness)).toBe(100);
  });

  it("unlocks the starter badge from a completed session", () => {
    const badges = performanceBadges([completed], []);
    expect(badges.find((badge) => badge.id === "starter")?.unlocked).toBe(true);
  });
});
