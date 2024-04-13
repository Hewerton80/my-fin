import { create } from "zustand";

type ThemeType = "light" | "dark";

interface State {
  theme: ThemeType;
}

interface Actions {
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<State & Actions>((set) => ({
  theme: "light",
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
  setTheme: (theme: ThemeType) => {
    set(() => ({ theme }));
  },
}));
