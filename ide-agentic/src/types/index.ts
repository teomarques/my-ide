export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  children?: FileEntry[];
  is_expanded?: boolean;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export type SidebarView = "files" | "search" | "git" | "ai";
