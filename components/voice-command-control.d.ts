export type VoiceCommand = "complete-set" | "start-rest" | "finish-workout";

export function VoiceCommandControl(props: { onCommand: (command: VoiceCommand) => void }): import("react").ReactElement | null;
