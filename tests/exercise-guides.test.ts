import { describe, expect, it } from "vitest";

import { detailedGuideFor, EXERCISE_GUIDES, formChecklistFor, guideFor, mediaGuideFor, voiceCoachTextFor } from "../lib/exercise-guides";
import { categoriesForExercise, EXERCISE_REGION_TARGETS, EXERCISES, rankedExercisesForMuscleFocus } from "../shared/fitness";

describe("exercise guides", () => {
  it("provides a structured guide for every exercise in the catalog", () => {
    EXERCISES.forEach((exercise) => {
      const guide = guideFor(exercise.id);
      expect(guide.setup.length).toBeGreaterThan(8);
      expect(guide.action.length).toBeGreaterThan(8);
      expect(guide.cue.length).toBeGreaterThan(8);
      expect(guide.breathing.length).toBeGreaterThan(15);
      expect(guide.caution.length).toBeGreaterThan(8);
      expect(EXERCISE_GUIDES[exercise.id]).toBeDefined();
    });
  });

  it("maps selected muscles to relevant exercise recommendations", () => {
    const chest = EXERCISES.filter((exercise) => exercise.primaryMuscles.includes("Göğüs"));
    const hamstrings = EXERCISES.filter((exercise) => exercise.primaryMuscles.includes("Hamstring"));
    expect(chest.map((exercise) => exercise.id)).toContain("barbell-bench-press");
    expect(hamstrings.map((exercise) => exercise.id)).toContain("romanian-deadlift");
  });

  it("covers the full catalogue with detailed atlas regions and ranks exact targets first", () => {
    expect(Object.keys(EXERCISE_REGION_TARGETS)).toHaveLength(EXERCISES.length);
    const ranked = rankedExercisesForMuscleFocus({ atlasId: "shoulder-side-left", group: "Omuz", region: "Lateral deltoid", label: "Lateral deltoid · sol" });
    expect(ranked[0]?.id).toBe("dumbbell-shoulder-press");
    expect(ranked.map((exercise) => exercise.id)).toContain("lateral-raise");
  });

  it("provides category-first discovery for cardio and regional goals", () => {
    const running = EXERCISES.find((exercise) => exercise.id === "running");
    const bench = EXERCISES.find((exercise) => exercise.id === "barbell-bench-press");
    const squat = EXERCISES.find((exercise) => exercise.id === "barbell-squat");
    expect(running && categoriesForExercise(running)).toContain("Kardiyo");
    expect(bench && categoriesForExercise(bench)).toContain("Göğüs");
    expect(squat && categoriesForExercise(squat)).toContain("Bacak");
  });

  it("only exposes a direct video when the named movement was verified", () => {
    const bench = mediaGuideFor("barbell-bench-press");
    const squat = mediaGuideFor("barbell-squat");
    expect(bench.kind).toBe("verified-video");
    expect(bench.url).toContain("wger.de/media/exercise-video/");
    expect(bench.license).toBe("CC BY-SA 4.0");
    expect(squat.kind).toBe("external-video-guide");
    expect(squat.url).toContain("/exercises/squat.html");
  });

  it("exposes a separately verified technical video page without treating it as downloadable media", () => {
    const pulldown = mediaGuideFor("lat-pulldown");
    expect(pulldown.kind).toBe("external-video-guide");
    expect(pulldown.url).toBe("https://www.muscleandstrength.com/exercises/lat-pull-down.html");
    expect(pulldown.availability).toContain("denetlendi");
    expect(pulldown.license).toBeUndefined();
  });

  it("only attaches external guides where the selected variation is explicit", () => {
    expect(mediaGuideFor("barbell-squat").url).toContain("/exercises/squat.html");
    expect(mediaGuideFor("barbell-row").url).toContain("bent-over-barbell-row");
    expect(mediaGuideFor("skull-crusher").kind).toBe("no-verified-video");
    expect(mediaGuideFor("standing-calf-raise").kind).toBe("no-verified-video");
  });

  it("uses the separately checked ACE technique pages only for exact matching movements", () => {
    const plank = mediaGuideFor("plank");
    const bridge = mediaGuideFor("glute-bridge");
    expect(plank.kind).toBe("external-technique-guide");
    expect(plank.url).toContain("acefitness.org/resources/everyone/exercise-library/32/front-plank");
    expect(bridge.kind).toBe("external-technique-guide");
    expect(bridge.url).toContain("acefitness.org/resources/everyone/exercise-library/49/glute-bridge");
  });

  it("adds only separately checked basic video pages with a matching movement and equipment pattern", () => {
    expect(mediaGuideFor("seated-cable-row").url).toContain("/exercises/seated-row.html");
    expect(mediaGuideFor("face-pull").url).toContain("/exercises/cable-face-pull");
  });

  it("expands every catalogue movement into a detailed, actionable technique guide", () => {
    EXERCISES.forEach((exercise) => {
      const detailed = detailedGuideFor(exercise.id);
      expect(detailed.purpose.length).toBeGreaterThan(20);
      expect(detailed.tempo.length).toBeGreaterThan(20);
      expect(detailed.execution).toHaveLength(4);
      expect(detailed.checkpoints).toHaveLength(2);
      expect(detailed.commonMistakes.length).toBeGreaterThanOrEqual(3);
      expect(detailed.scale.length).toBeGreaterThan(20);
    });
  });

  it("creates a short, actionable pre-set checklist for every exercise", () => {
    EXERCISES.forEach((exercise) => {
      const items = formChecklistFor(exercise.id);
      expect(items.map((item) => item.id)).toEqual(["setup", "form", "breathing"]);
      items.forEach((item) => expect(item.detail.length).toBeGreaterThan(8));
    });
  });

  it("creates coach prompts in the selected language", () => {
    expect(voiceCoachTextFor("barbell-bench-press", "tr-TR")).toContain("Set öncesi");
    expect(voiceCoachTextFor("barbell-bench-press", "en-US")).toContain("Set reminder");
  });
});
