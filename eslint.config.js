const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "data/audits/*", "android/*", "ios/*"],
  },
  {
    // Node ortamında çalışan yardımcı script'ler ve yapılandırma dosyaları.
    files: ["scripts/**/*.{js,mjs}", "*.config.js", "drizzle.config.ts", "server/**/*.ts"],
    languageOptions: {
      globals: { __dirname: "readonly", __filename: "readonly", Buffer: "readonly", process: "readonly", console: "readonly", module: "writable", require: "readonly" },
    },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // React Compiler'ın katı kuralları, dışa aktarımdan gelen mevcut ekran kodunda
    // çok sayıda uyarı üretiyor. Bunlar derlemeyi engellemez; teknik borç olarak
    // görünür kalsınlar diye kapatmak yerine uyarıya düşürüldü.
    files: ["app/**/*.tsx", "components/**/*.tsx", "lib/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
