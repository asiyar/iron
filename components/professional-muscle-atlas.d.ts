import type { ComponentType } from "react";
import type { MuscleFocus } from "@/shared/fitness";

export const ProfessionalMuscleAtlas: ComponentType<{
  selected?: MuscleFocus;
  onSelect: (muscle: MuscleFocus) => void;
  view: "front" | "back";
  onViewChange: (view: "front" | "back") => void;
}>;
