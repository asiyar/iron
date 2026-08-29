import { describe, expect, it } from "vitest";

import { checklistCompliance, estimatedOneRepMax, muscleVolume, personalRecords, progressionHint, trainingConsistency, workoutVolume } from "../lib/fitness-analytics";
import type { WorkoutSession } from "../shared/fitness";

const session: WorkoutSession = {
  id: "session-1",
  name: "Push",
  startedAt: "2026-08-20T09:00:00.000Z",
  completedAt: "2026-08-20T10:00:00.000Z",
  exercises: [
    { id: "entry-1", exerciseId: "barbell-bench-press", sets: [
      { id: "set-1", weight: 80, reps: 8, rpe: 8, completed: true },
      { id: "set-2", weight: 80, reps: 8, rpe: 8, completed: true },
    ] },
    { id: "entry-2", exerciseId: "lateral-raise", sets: [
      { id: "set-3", weight: 10, reps: 12, rpe: 7, completed: true },
    ] },
  ],
};

describe("fitness analytics", () => {
  it("calculates volume only from completed sets", () => {
    expect(workoutVolume(session)).toBe(1400);
  });

  it("summarizes completed form and breathing checks only for completed sets", () => {
    const withChecklist: WorkoutSession = { ...session, exercises: [{ ...session.exercises[0], sets: [{ ...session.exercises[0].sets[0], formChecklist: ["setup", "form", "breathing"] }, { ...session.exercises[0].sets[1], formChecklist: ["setup"] }] }, { ...session.exercises[1], sets: [{ ...session.exercises[1].sets[0], completed: false, formChecklist: ["setup", "form", "breathing"] }] }] };
    const report = checklistCompliance(withChecklist);
    expect(report.completedSets).toBe(2);
    expect(report.checkedItems).toBe(4);
    expect(report.possibleItems).toBe(6);
    expect(report.percent).toBe(67);
    expect(report.byExercise).toHaveLength(1);
  });

  it("calculates Epley estimated 1RM", () => {
    expect(estimatedOneRepMax(80, 8)).toBe(101.3);
    expect(estimatedOneRepMax(0, 8)).toBe(0);
  });

  it("keeps the best personal record for each exercise", () => {
    const stronger: WorkoutSession = { ...session, id: "session-2", completedAt: "2026-08-21T10:00:00.000Z", exercises: [{ id: "entry-3", exerciseId: "barbell-bench-press", sets: [{ id: "set-4", weight: 85, reps: 8, rpe: 8, completed: true }] }] };
    const record = personalRecords([session, stronger]).find((item) => item.exerciseId === "barbell-bench-press");
    expect(record?.weight).toBe(85);
    expect(record?.oneRepMax).toBe(107.7);
  });

  it("distributes compound movement volume across its muscle groups", () => {
    const distribution = muscleVolume([session]);
    expect(distribution.find((item) => item.muscle === "Göğüs")?.volume).toBe(640);
    expect(distribution.find((item) => item.muscle === "Omuz")?.volume).toBe(120);
  });

  it("recommends progressive overload for repeatable submaximal sets", () => {
    expect(progressionHint([session], "barbell-bench-press", "kg")).toContain("+2,5 kg");
  });

  it("counts distinct completed training days and an adjacent-day streak", () => {
    const nextDay: WorkoutSession = { ...session, id: "session-2", completedAt: "2026-08-21T10:00:00.000Z" };
    const consistency = trainingConsistency([session, nextDay], new Date("2026-08-22T12:00:00.000Z"));
    expect(consistency.activeDays).toBe(2);
    expect(consistency.streakDays).toBe(2);
    expect(consistency.lastCompletedAt).toBe("2026-08-21T10:00:00.000Z");
  });
});
