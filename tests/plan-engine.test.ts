import { describe, expect, it } from "vitest";

import { buildGeneratedPlan, exerciseById, type PlanPreferences } from "../shared/fitness";

describe("generated plan engine", () => {
  const profile: PlanPreferences = { goal: "Kas kazanımı", physique: "Atletik & dengeli", experience: "Sıfırdan", daysPerWeek: 3, equipment: "Evde vücut ağırlığı", createdAt: "2026-08-27T00:00:00.000Z" };

  it("creates a four-week foundation block, 12-week roadmap and general nutrition guidance", () => {
    const plan = buildGeneratedPlan(profile);
    expect(plan.weeks).toHaveLength(4);
    expect(plan.weeks[0].sessions).toHaveLength(3);
    expect(plan.phases).toHaveLength(3);
    expect(plan.nutrition.safetyNote).toContain("kişiye özel kalori/makro reçetesi değildir");
  });

  it("does not prescribe gym-only movements for a bodyweight-only profile", () => {
    const plan = buildGeneratedPlan(profile);
    const equipment = plan.weeks.flatMap((week) => week.sessions.flatMap((session) => session.exerciseIds.map((id) => exerciseById(id)?.equipment)));
    expect(equipment.every((item) => item === "Bodyweight" || item === "Rope")).toBe(true);
  });
});
