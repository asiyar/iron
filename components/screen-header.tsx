import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ui } from "@/components/fitness-ui";

/** Alt sayfalarda tekrar eden geri düğmesi + başlık bloğu. */
export function ScreenHeader({ back, eyebrow, title, copy }: { back: string; eyebrow: string; title: string; copy?: string }) {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <MaterialIcons name="arrow-back" size={20} color="#D7DEE8" />
        <Text style={styles.backText}>{back}</Text>
      </TouchableOpacity>
      <Text style={ui.eyebrow}>{eyebrow}</Text>
      <Text style={ui.h1}>{title}</Text>
      {copy ? <Text style={[ui.body, { marginTop: 8 }]}>{copy}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: "row", alignItems: "center", gap: 7, paddingTop: 58, paddingBottom: 22 },
  backText: { color: "#D7DEE8", fontSize: 14, fontWeight: "700" },
});
