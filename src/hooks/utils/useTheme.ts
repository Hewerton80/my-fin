import { useThemeStore } from "@/stores/useThemeStore";
import { useShallow } from "zustand/react/shallow";

export function useTheme() {
  return useThemeStore(useShallow((state) => state));
}
