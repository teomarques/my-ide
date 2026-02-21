import { create } from "zustand";
import type { FileEntry, SidebarView } from "@/types";

interface FileState {
  rootPath: string | null;
  fileTree: FileEntry[];
  sidebarView: SidebarView;
  isSidebarOpen: boolean;
  isTerminalOpen: boolean;

  setRootPath: (path: string) => void;
  setFileTree: (tree: FileEntry[]) => void;
  toggleEntry: (path: string) => void;
  setSidebarView: (view: SidebarView) => void;
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
}

function toggleNode(entries: FileEntry[], path: string): FileEntry[] {
  return entries.map((entry) => {
    if (entry.path === path) {
      return { ...entry, is_expanded: !entry.is_expanded };
    }
    if (entry.children) {
      return { ...entry, children: toggleNode(entry.children, path) };
    }
    return entry;
  });
}

export const useFileStore = create<FileState>((set) => ({
  rootPath: null,
  fileTree: [],
  sidebarView: "files",
  isSidebarOpen: true,
  isTerminalOpen: true,

  setRootPath: (path) => set({ rootPath: path }),
  setFileTree: (tree) => set({ fileTree: tree }),

  toggleEntry: (path) => {
    set((state) => ({
      fileTree: toggleNode(state.fileTree, path),
    }));
  },

  setSidebarView: (view) => set({ sidebarView: view }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
  setTerminalOpen: (open) => set({ isTerminalOpen: open }),
}));
