import { MaterialIcons } from "@expo/vector-icons";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type VoiceCommand = "complete-set" | "start-rest" | "finish-workout";

export function VoiceCommandControl({ onCommand }: { onCommand: (command: VoiceCommand) => void }) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState<string>();
  const parseCommand = useCallback((transcript: string) => {
    const normalized = transcript.toLocaleLowerCase("tr-TR");
    if (normalized.includes("set") && (normalized.includes("tamam") || normalized.includes("bitir"))) return "complete-set";
    if (normalized.includes("dinlen") || normalized.includes("sayaç")) return "start-rest";
    if (normalized.includes("antrenman") && normalized.includes("bitir")) return "finish-workout";
    return undefined;
  }, []);
  useSpeechRecognitionEvent("start", () => setListening(true));
  useSpeechRecognitionEvent("end", () => setListening(false));
  useSpeechRecognitionEvent("error", (event) => { setListening(false); setMessage(event.error === "not-allowed" ? "Mikrofon veya konuşma izni verilmedi." : "Sesli komut şu an kullanılamıyor."); });
  useSpeechRecognitionEvent("result", (event) => { if (!event.isFinal || !event.results[0]?.transcript) return; const command = parseCommand(event.results[0].transcript); if (command) { onCommand(command); setMessage(command === "complete-set" ? "Set tamamlandı." : command === "start-rest" ? "Dinlenme başladı." : "Antrenman tamamlandı."); } else setMessage("“Seti tamamla”, “dinlenmeyi başlat” veya “antrenmanı bitir” diyebilirsin."); });
  const listen = async () => { const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync(); if (!permission.granted) { setMessage("Mikrofon ve konuşma tanıma izni gerekli."); return; } setMessage("Dinliyorum…"); ExpoSpeechRecognitionModule.start({ lang: "tr-TR", interimResults: false, continuous: false, iosTaskHint: "confirmation", contextualStrings: ["seti tamamla", "dinlenmeyi başlat", "antrenmanı bitir"] }); };
  return <View><TouchableOpacity onPress={listen} style={[styles.button, listening && styles.active]}><MaterialIcons name={listening ? "hearing" : "mic"} color={listening ? "#10150B" : "#B8FF3D"} size={20} /></TouchableOpacity>{message ? <Text style={styles.message}>{message}</Text> : null}</View>;
}
const styles = StyleSheet.create({ button: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#1B2A17", borderWidth: 1, borderColor: "#526D24" }, active: { backgroundColor: "#B8FF3D", borderColor: "#B8FF3D" }, message: { position: "absolute", top: 44, right: 0, width: 210, padding: 8, borderRadius: 10, backgroundColor: "#161F16", color: "#D8F6AA", fontSize: 10, lineHeight: 14 } });
