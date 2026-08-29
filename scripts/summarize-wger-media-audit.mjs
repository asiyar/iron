import fs from "node:fs/promises";

const report = JSON.parse(await fs.readFile("/tmp/ironpulse-wger-media-audit.json", "utf8"));
const summary = {
  total: report.length,
  withVideo: report.filter((item) => item.hasVideo).length,
  withoutVideo: report.filter((item) => !item.hasVideo).map((item) => item.id),
};

console.log(JSON.stringify(summary, null, 2));
console.table(report.filter((item) => item.hasVideo).map((item) => ({
  id: item.id,
  sourceName: item.sourceName,
  score: item.score,
  url: item.videos[0]?.url,
  license: item.videos[0]?.license,
  author: item.videos[0]?.author,
  duration: item.videos[0]?.duration,
})));
