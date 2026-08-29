/**
 * Web fallback: expo-speech-recognition yalnızca native derlemelerde çalışır.
 * Web'de bileşen hiçbir şey render etmez, böylece çağıran ekranlar değişmeden kalır.
 */
export function VoiceCommandControl(_props: { onCommand: (command: "complete-set" | "start-rest" | "finish-workout") => void }) {
  return null;
}
