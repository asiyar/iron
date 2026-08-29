import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

type Props = { title: string; detail: string; icon?: "accessibility-new" | "play-circle-filled" };

export function PremiumLoadingState({ title, detail, icon = "accessibility-new" }: Props) {
  const phase = useSharedValue(0.45);
  useEffect(() => {
    phase.value = withRepeat(withSequence(withTiming(1, { duration: 720, easing: Easing.inOut(Easing.quad) }), withTiming(0.45, { duration: 720, easing: Easing.inOut(Easing.quad) })), -1, false);
    return () => cancelAnimation(phase);
  }, [phase]);
  const halo = useAnimatedStyle(() => ({ opacity: phase.value * 0.38, transform: [{ scale: 0.9 + phase.value * 0.16 }] }));
  const dotOne = useAnimatedStyle(() => ({ opacity: 0.35 + phase.value * 0.65, transform: [{ translateY: -phase.value * 3 }] }));
  const dotTwo = useAnimatedStyle(() => ({ opacity: 0.35 + (1 - phase.value) * 0.65, transform: [{ translateY: -(1 - phase.value) * 3 }] }));

  return <View accessibilityRole="progressbar" accessibilityLabel={title} style={styles.wrap}>
    <Animated.View style={[styles.halo, halo]} /><View style={styles.icon}><MaterialIcons name={icon} size={26} color="#11170C" /></View>
    <Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text>
    <View style={styles.dots}><Animated.View style={[styles.dot, dotOne]} /><Animated.View style={[styles.dot, dotTwo]} /><Animated.View style={[styles.dot, dotOne]} /></View>
  </View>;
}

const styles = StyleSheet.create({ wrap: { minHeight: 168, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, overflow: "hidden" }, halo: { position: "absolute", width: 96, height: 96, borderRadius: 48, backgroundColor: "#B8FF3D" }, icon: { width: 54, height: 54, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#B8FF3D", borderColor: "#E7FFB7", borderWidth: 2 }, title: { marginTop: 14, color: "#F5F7FA", fontSize: 15, fontWeight: "900" }, detail: { marginTop: 5, color: "#AAB5C3", fontSize: 12, lineHeight: 18, textAlign: "center" }, dots: { marginTop: 13, flexDirection: "row", gap: 6 }, dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#B8FF3D" } });
