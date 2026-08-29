import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle kimliği .env üzerinden geçersiz kılınabilir; varsayılan yerel geliştirme içindir.
const bundleId = process.env.EXPO_PUBLIC_BUNDLE_ID ?? "com.ironpulse.app";
const scheme = process.env.EXPO_PUBLIC_SCHEME ?? "ironpulse";

const config: ExpoConfig = {
  name: "IronPulse",
  slug: "ironpulse",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme,
  userInterfaceStyle: "dark",
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    package: bundleId,
    adaptiveIcon: {
      backgroundColor: "#0B0E12",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      "POST_NOTIFICATIONS",
      "android.permission.health.READ_STEPS",
      "android.permission.health.READ_WEIGHT",
      "android.permission.health.READ_EXERCISE",
    ],
    intentFilters: [
      { action: "VIEW", autoVerify: true, data: [{ scheme, host: "*" }], category: ["BROWSABLE", "DEFAULT"] },
    ],
  },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: [
    "expo-router",
    ["expo-local-authentication", { faceIDPermission: "IronPulse, antrenman verilerinizi korumak için Face ID kullanır." }],
    ["expo-secure-store", { configureAndroidBackup: true, faceIDPermission: "IronPulse, güvenlik tercihlerinizi korumak için Face ID kullanır." }],
    ["expo-speech-recognition", {
      microphonePermission: "IronPulse, sesli antrenman komutlarını algılamak için mikrofonuna erişir.",
      speechRecognitionPermission: "IronPulse, “seti tamamla” gibi sesli komutları tanımak için konuşma tanıma özelliğini kullanır.",
    }],
    ["expo-camera", {
      cameraPermission: "IronPulse, cihazında çalışan form rehberi için kamerana erişir.",
      microphonePermission: "IronPulse form rehberi video sesi kaydetmez.",
      recordAudioAndroid: false,
    }],
    ["expo-image-picker", {
      photosPermission: "IronPulse, dönüşüm zaman çizelgende göstermek üzere seçtiğin ilerleme fotoğraflarına erişir.",
      cameraPermission: "IronPulse, dönüşüm fotoğrafı çekmek için kamerana erişir.",
    }],
    ["@kingstinct/react-native-healthkit", {
      NSHealthShareUsageDescription: "IronPulse, antrenmanlarını, adım sayını ve vücut ağırlığını kişisel ilerleme analizine eklemek için Apple Health verilerini okur.",
      NSHealthUpdateUsageDescription: "IronPulse, yalnızca sen açıkça seçersen antrenman verilerini Apple Health ile paylaşır.",
      background: false,
    }],
    "react-native-health-connect",
    ["expo-splash-screen", {
      image: "./assets/images/splash-icon.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#0B0E12",
      dark: { backgroundColor: "#0B0E12" },
    }],
    ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
