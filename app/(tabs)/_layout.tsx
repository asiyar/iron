import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#B8FF3D", tabBarInactiveTintColor: "#788596", tabBarStyle: { backgroundColor: "#10151C", borderTopColor: "#263141", height: 60 + bottom, paddingTop: 7, paddingBottom: bottom }, tabBarLabelStyle: { fontSize: 11, fontWeight: "700" } }}>
    <Tabs.Screen name="index" options={{ title: "Bugün", tabBarIcon: ({ color }) => <MaterialIcons name="bolt" size={23} color={color} /> }} />
    <Tabs.Screen name="train" options={{ title: "Antrenman", tabBarIcon: ({ color }) => <MaterialIcons name="fitness-center" size={23} color={color} /> }} />
    <Tabs.Screen name="progress" options={{ title: "İlerleme", tabBarIcon: ({ color }) => <MaterialIcons name="query-stats" size={23} color={color} /> }} />
    <Tabs.Screen name="performance" options={{ title: "Performans", tabBarIcon: ({ color }) => <MaterialIcons name="auto-graph" size={23} color={color} /> }} />
    <Tabs.Screen name="community" options={{ title: "Topluluk", tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={23} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: "Profil", tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={23} color={color} /> }} />
  </Tabs>;
}
