import { useState } from "react";

import type { MuscleGroup } from "@/shared/fitness";
import { ProfessionalMuscleAtlas } from "./professional-muscle-atlas";

export function GlbAnatomyViewer({ selected, onSelect }: { selected?: MuscleGroup; onSelect: (muscle: MuscleGroup) => void; onReady?: () => void; onFailure?: () => void }) {
  const [view, setView] = useState<"front" | "back">("front");
  return <ProfessionalMuscleAtlas selected={undefined} onSelect={(focus) => onSelect(focus.group)} view={view} onViewChange={setView} />;
}
