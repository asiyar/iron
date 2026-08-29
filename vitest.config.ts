import path from "node:path";
import { defineConfig } from "vitest/config";

const rootDirectory = path.resolve(__dirname);

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDirectory,
      // Testler Node ortamında koşar; react-native Flow ile yazıldığı için
      // web uyarlaması üzerinden çözümlenir.
      "react-native": "react-native-web",
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
