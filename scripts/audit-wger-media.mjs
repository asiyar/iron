import fs from "node:fs/promises";

const catalog = [
  ["barbell-bench-press", ["barbell bench press", "bench press"]],
  ["incline-dumbbell-press", ["incline dumbbell press"]],
  ["cable-fly", ["cable fly", "standing cable fly"]],
  ["pull-up", ["pull up", "pull-up"]],
  ["barbell-row", ["barbell row", "bent over barbell row"]],
  ["lat-pulldown", ["lat pulldown", "lat pull down"]],
  ["overhead-press", ["overhead press", "barbell shoulder press"]],
  ["lateral-raise", ["lateral raise", "dumbbell lateral raise"]],
  ["barbell-squat", ["barbell squat", "squat"]],
  ["romanian-deadlift", ["romanian deadlift"]],
  ["leg-press", ["leg press"]],
  ["leg-curl", ["leg curl", "lying leg curl"]],
  ["barbell-curl", ["barbell curl"]],
  ["triceps-pushdown", ["triceps pushdown", "cable triceps pushdown"]],
  ["standing-calf-raise", ["standing calf raise", "calf raise"]],
  ["cable-crunch", ["cable crunch"]],
  ["push-up", ["push up", "push-up"]],
  ["machine-chest-press", ["chest press machine", "machine chest press"]],
  ["dumbbell-row", ["one arm dumbbell row", "one-arm dumbbell row"]],
  ["seated-cable-row", ["seated cable row"]],
  ["face-pull", ["face pull"]],
  ["dumbbell-shoulder-press", ["dumbbell shoulder press"]],
  ["reverse-fly", ["reverse fly", "dumbbell reverse fly"]],
  ["hammer-curl", ["hammer curl"]],
  ["skull-crusher", ["skull crusher", "lying triceps extension"]],
  ["walking-lunge", ["walking lunge"]],
  ["hip-thrust", ["barbell hip thrust", "hip thrust"]],
  ["dumbbell-deadlift", ["dumbbell deadlift"]],
  ["step-up", ["dumbbell step up", "step-up"]],
  ["leg-extension", ["leg extension"]],
  ["glute-bridge", ["glute bridge"]],
  ["plank", ["plank"]],
  ["incline-walk", ["incline treadmill walk", "incline walk"]],
  ["running", ["running intervals", "running"]],
  ["cycling", ["stationary cycling", "cycling"]],
  ["rowing-erg", ["rowing ergometer", "rowing"]],
  ["jump-rope", ["jump rope", "skipping rope"]],
  ["burpee", ["burpee"]],
];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const nameFor = (entry) => entry.translations.find((translation) => translation.language === 2)?.name ?? entry.translations[0]?.name ?? "";
const score = (candidate, alias) => {
  const haystack = normalize(candidate);
  const needle = normalize(alias);
  if (haystack === needle) return 100;
  if (haystack.includes(needle)) return 80;
  const words = needle.split(" ");
  return words.filter((word) => haystack.split(" ").includes(word)).length / words.length * 60;
};

let url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100";
const records = [];
while (url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Wger API failed: ${response.status}`);
  const page = await response.json();
  records.push(...page.results);
  url = page.next;
}

const report = catalog.map(([id, aliases]) => {
  const candidates = records.map((entry) => {
    const name = nameFor(entry);
    return { entry, name, quality: Math.max(...aliases.map((alias) => score(name, alias))) };
  }).filter((candidate) => candidate.quality >= 55).sort((a, b) => b.quality - a.quality);
  const best = candidates[0];
  const verifiedVideoCandidate = candidates.find((candidate) => candidate.quality >= 80 && candidate.entry.videos?.length);
  const selected = verifiedVideoCandidate ?? best;
  return {
    id,
    aliases,
    sourceName: selected?.name ?? null,
    score: selected?.quality ?? 0,
    uuid: selected?.entry.uuid ?? null,
    hasVideo: Boolean(selected?.entry.videos?.length),
    videos: (selected?.entry.videos ?? []).map((video) => ({ url: video.video, license: video.license, author: video.license_author, duration: video.duration })),
    alternatives: candidates.filter((candidate) => candidate !== selected).slice(0, 6).map((candidate) => ({ name: candidate.name, score: candidate.quality, hasVideo: Boolean(candidate.entry.videos?.length), uuid: candidate.entry.uuid })),
  };
});

await fs.writeFile("/tmp/ironpulse-wger-media-audit.json", JSON.stringify(report, null, 2));
console.table(report.map((item) => ({ id: item.id, source: item.sourceName, score: item.score, video: item.hasVideo, uuid: item.uuid })));
