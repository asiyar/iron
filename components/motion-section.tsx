import type { PropsWithChildren } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

export function MotionSection({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  return <Animated.View entering={FadeInDown.delay(delay).duration(280)}>{children}</Animated.View>;
}
