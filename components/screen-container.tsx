import type { PropsWithChildren } from "react";
import { View, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  edges?: Edge[];
  containerClassName?: string;
  style?: ViewStyle;
}>;

/** Güvenli alan + sayfa arka planını tek yerden yöneten sarmalayıcı. */
export function ScreenContainer({ children, edges = ["top", "bottom"], containerClassName, style }: Props) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: "#0B0E12" }, style]}>
      <View className={containerClassName} style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
