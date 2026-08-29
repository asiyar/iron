declare module "@/components/glb-anatomy-viewer" {
  import type { MuscleGroup } from "@/shared/fitness";

  export function GlbAnatomyViewer(props: {
    selected?: MuscleGroup;
    onSelect: (muscle: MuscleGroup) => void;
    onReady?: () => void;
    onFailure?: () => void;
  }): React.ReactElement;
}
