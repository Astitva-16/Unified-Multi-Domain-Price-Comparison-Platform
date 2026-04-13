import { create } from "zustand";

interface AppState {
  selectedCategory: string | null;
  searchQuery: string;
  isDark: boolean;
  setSelectedCategory: (cat: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleDark: () => void;
}

export const useStore = create<AppState>((set) => ({
  selectedCategory: null,
  searchQuery: "",
  isDark: false,
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleDark: () =>
    set((s) => {
      const next = !s.isDark;
      document.documentElement.classList.toggle("dark", next);
      return { isDark: next };
    }),
}));
