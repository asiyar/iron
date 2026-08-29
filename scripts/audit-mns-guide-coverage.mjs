import fs from "node:fs/promises";

const catalog = [
  ["barbell-bench-press", ["barbell bench press", "bench press"]], ["incline-dumbbell-press", ["incline dumbbell press"]], ["cable-fly", ["cable fly", "cable flys"]], ["pull-up", ["pull up"]], ["barbell-row", ["bent over barbell row", "barbell row"]], ["lat-pulldown", ["lat pull down", "lat pulldown"]], ["overhead-press", ["barbell overhead press", "military press"]], ["lateral-raise", ["dumbbell lateral raise"]], ["barbell-squat", ["barbell squat", "back squat"]], ["romanian-deadlift", ["romanian deadlift", "stiff leg deadlift"]], ["leg-press", ["leg press"]], ["leg-curl", ["lying leg curl", "leg curl"]], ["barbell-curl", ["barbell curl"]], ["triceps-pushdown", ["triceps pushdown", "cable pushdown"]], ["standing-calf-raise", ["standing calf raise"]], ["cable-crunch", ["cable crunch"]], ["push-up", ["push up"]], ["machine-chest-press", ["machine chest press", "chest press"]], ["dumbbell-row", ["one arm dumbbell row", "dumbbell row"]], ["seated-cable-row", ["seated cable row"]], ["face-pull", ["face pull"]], ["dumbbell-shoulder-press", ["dumbbell shoulder press"]], ["reverse-fly", ["dumbbell reverse fly", "reverse fly"]], ["hammer-curl", ["hammer curl"]], ["skull-crusher", ["skullcrusher", "skull crusher"]], ["walking-lunge", ["dumbbell walking lunge", "walking lunge"]], ["hip-thrust", ["barbell hip thrust", "hip thrust"]], ["dumbbell-deadlift", ["dumbbell deadlift"]], ["step-up", ["dumbbell step up", "step up"]], ["leg-extension", ["leg extension"]], ["glute-bridge", ["glute bridge"]], ["plank", ["plank"]], ["incline-walk", ["incline treadmill walk"]], ["running", ["running"]], ["cycling", ["stationary cycling"]], ["rowing-erg", ["rowing"]], ["jump-rope", ["jump rope"]], ["burpee", ["burpee"]],
];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const score = (url, alias) => {
  const words = normalize(url).split(" ");
  const aliasWords = normalize(alias).split(" ");
  if (aliasWords.every((word) => words.includes(word))) return aliasWords.length * 20;
  return aliasWords.filter((word) => words.includes(word)).length * 10;
};

const urls = (await fs.readFile("/tmp/mns-exercise-urls.txt", "utf8")).trim().split("\n");
const report = catalog.map(([id, aliases]) => ({
  id,
  candidates: urls.map((url) => ({ url, score: Math.max(...aliases.map((alias) => score(url, alias))) }))
    .filter((candidate) => candidate.score >= 20)
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
    .slice(0, 8),
}));

await fs.writeFile("/tmp/ironpulse-mns-guide-audit.json", JSON.stringify(report, null, 2));
console.table(report.map((item) => ({ id: item.id, firstCandidate: item.candidates[0]?.url ?? "—", score: item.candidates[0]?.score ?? 0, candidates: item.candidates.length })));
