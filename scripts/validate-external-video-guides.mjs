import fs from "node:fs/promises";

const guides = [
  ["barbell-bench-press", "Barbell Bench Press", "https://www.muscleandstrength.com/exercises/barbell-bench-press.html"],
  ["incline-dumbbell-press", "Incline Dumbbell Bench Press", "https://www.muscleandstrength.com/exercises/incline-dumbbell-bench-press.html"],
  ["cable-fly", "Standing Cable Flys", "https://www.muscleandstrength.com/exercises/standing-cable-flys.html"],
  ["barbell-row", "Bent Over Barbell Row", "https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html"],
  ["lat-pulldown", "Lat Pull Down", "https://www.muscleandstrength.com/exercises/lat-pull-down.html"],
  ["overhead-press", "Military Press", "https://www.muscleandstrength.com/exercises/military-press.html"],
  ["lateral-raise", "Dumbbell Lateral Raise", "https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html"],
  ["romanian-deadlift", "Stiff Leg Deadlift AKA Romanian Deadlift", "https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html"],
  ["leg-press", "45 Degree Leg Press", "https://www.muscleandstrength.com/exercises/45-degree-leg-press.html"],
  ["leg-curl", "Leg Curl", "https://www.muscleandstrength.com/exercises/leg-curl.html"],
  ["standing-calf-raise", "Standing Calf Raise", "https://www.muscleandstrength.com/exercises/standing-calf-raise.html"],
  ["cable-crunch", "Cable Crunch", "https://www.muscleandstrength.com/exercises/cable-crunch.html"],
  ["push-up", "Push Up", "https://www.muscleandstrength.com/exercises/push-up.html"],
  ["dumbbell-row", "One Arm Dumbbell Row", "https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html"],
  ["reverse-fly", "Dumbbell Reverse Fly", "https://www.muscleandstrength.com/exercises/dumbbell-reverse-fly.html"],
  ["walking-lunge", "Dumbbell Walking Lunge", "https://www.muscleandstrength.com/exercises/dumbbell-walking-lunge.html"],
  ["hip-thrust", "Barbell Hip Thrust", "https://www.muscleandstrength.com/exercises/barbell-hip-thrust"],
  ["dumbbell-deadlift", "Dumbbell Deadlift", "https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html"],
  ["step-up", "Dumbbell Step Up", "https://www.muscleandstrength.com/exercises/dumbbell-step-up.html"],
  ["leg-extension", "Leg Extension", "https://www.muscleandstrength.com/exercises/leg-extension.html"],
  ["jump-rope", "Jump Rope", "https://www.muscleandstrength.com/exercises/jump-rope"],
  ["barbell-row-variant", "Bent Over Row", "https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html"],
  ["barbell-squat-variant", "Squat", "https://www.muscleandstrength.com/exercises/squat.html"],
  ["leg-press-variant", "Leg Press", "https://www.muscleandstrength.com/exercises/45-degree-leg-press.html"],
  ["barbell-curl-variant", "Standing Barbell Curl", "https://www.muscleandstrength.com/exercises/standing-barbell-curl.html"],
  ["triceps-pushdown-variant", "Tricep Pushdown", "https://www.muscleandstrength.com/exercises/tricep-pushdown.html"],
  ["machine-chest-press-variant", "Machine Chest Press", "https://www.muscleandstrength.com/exercises/machine-chest-press.html"],
  ["seated-cable-row", "Seated Cable Row", "https://www.muscleandstrength.com/exercises/seated-row.html"],
  ["face-pull", "Cable Face Pull", "https://www.muscleandstrength.com/exercises/cable-face-pull"],
  ["dumbbell-shoulder-press-variant", "Dumbbell Shoulder Press", "https://www.muscleandstrength.com/exercises/dumbbell-shoulder-press.html"],
  ["skull-crusher-variant", "Skullcrusher", "https://www.muscleandstrength.com/exercises/ez-bar-skullcrusher.html"],
  ["glute-bridge-variant", "Glute Bridge", "https://www.muscleandstrength.com/exercises/glute-bridge.html"],
  ["plank-variant", "Plank", "https://www.muscleandstrength.com/exercises/plank.html"],
  ["incline-walk-variant", "Treadmill Incline Walk", "https://www.muscleandstrength.com/exercises/incline-treadmill-walk.html"],
  ["running-variant", "Running", "https://www.muscleandstrength.com/exercises/running.html"],
  ["cycling-variant", "Stationary Cycling", "https://www.muscleandstrength.com/exercises/stationary-cycling.html"],
  ["rowing-erg-variant", "Rowing Machine", "https://www.muscleandstrength.com/exercises/rowing-machine.html"],
  ["burpee-variant", "Burpee", "https://www.muscleandstrength.com/exercises/burpee.html"],
];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const results = [];
for (const [id, expectedTitle, url] of guides) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const html = await response.text();
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
    const expected = normalize(expectedTitle).split(" ");
    const actual = normalize(title);
    const matchedWords = expected.filter((word) => actual.includes(word)).length;
    results.push({ id, url, status: response.status, title, expectedTitle, matchedWords, expectedWords: expected.length, verified: response.ok && matchedWords === expected.length });
  } catch (error) {
    results.push({ id, url, status: 0, title: String(error), expectedTitle, matchedWords: 0, expectedWords: normalize(expectedTitle).split(" ").length, verified: false });
  }
}

await fs.writeFile("/tmp/ironpulse-external-video-guide-validation.json", JSON.stringify(results, null, 2));
console.table(results.map(({ id, status, title, verified }) => ({ id, status, title, verified })));
console.log(`${results.filter((result) => result.verified).length}/${results.length} links verified`);
