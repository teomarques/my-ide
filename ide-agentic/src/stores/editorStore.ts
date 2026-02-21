import { create } from "zustand";
import type { Tab, CursorPosition } from "@/types";

interface EditorState {
  tabs: Tab[];
  activeTabId: string | null;
  cursorPosition: CursorPosition;

  openTab: (tab: Omit<Tab, "isDirty">) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  markTabClean: (id: string) => void;
  setCursorPosition: (pos: CursorPosition) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [],
  activeTabId: null,
  cursorPosition: { line: 1, column: 1 },

  openTab: (tab) => {
    const existing = get().tabs.find((t) => t.id === tab.id);
    if (existing) {
      set({ activeTabId: tab.id });
      return;
    }
    set((state) => ({
      tabs: [...state.tabs, { ...tab, isDirty: false }],
      activeTabId: tab.id,
    }));
  },

  closeTab: (id) => {
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      let newActiveId = state.activeTabId;
      if (state.activeTabId === id) {
        const idx = state.tabs.findIndex((t) => t.id === id);
        newActiveId = newTabs[Math.min(idx, newTabs.length - 1)]?.id ?? null;
      }
      return { tabs: newTabs, activeTabId: newActiveId };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabContent: (id, content) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, content, isDirty: true } : t
      ),
    }));
  },

  markTabClean: (id) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, isDirty: false } : t
      ),
    }));
  },

  setCursorPosition: (pos) => set({ cursorPosition: pos }),
}));
