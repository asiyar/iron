import type { MaterialIcons } from "@expo/vector-icons";
import type { DashboardMetricId } from "@/shared/fitness";

export type DashboardMetricCard = {
  id: DashboardMetricId;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  detail: string;
  tone: string;
};

export function DraggableMetricList(props: {
  data: DashboardMetricCard[];
  editing: boolean;
  onOrderChange: (order: DashboardMetricId[]) => void;
}): React.ReactElement;
