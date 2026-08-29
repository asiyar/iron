// app.config.ts değerlendirilmeden önce .env dosyalarını process.env'e yükler.
// Harici bağımlılık yok; yalnızca KEY=VALUE satırları desteklenir.
const fs = require("node:fs");
const path = require("node:path");

const files = [".env", ".env.local", `.env.${process.env.NODE_ENV ?? "development"}`];

for (const file of files) {
  const fullPath = path.resolve(__dirname, "..", file);
  if (!fs.existsSync(fullPath)) continue;

  for (const rawLine of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}
