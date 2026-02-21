import { invoke } from "@tauri-apps/api/core";
import type { FileEntry } from "@/types";

export async function readDir(path: string): Promise<FileEntry[]> {
  return invoke<FileEntry[]>("read_dir", { path });
}

export async function readFileContent(path: string): Promise<string> {
  return invoke<string>("read_file_content", { path });
}

export async function writeFileContent(
  path: string,
  content: string
): Promise<void> {
  return invoke("write_file_content", { path, content });
}

export async function getHomeDir(): Promise<string> {
  return invoke<string>("get_home_dir");
}

/**
 * Detecta a linguagem a partir da extensão do ficheiro.
 */
export function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescriptreact",
    js: "javascript",
    jsx: "javascriptreact",
    rs: "rust",
    py: "python",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    md: "markdown",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
    lua: "lua",
    rb: "ruby",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    dart: "dart",
    dockerfile: "dockerfile",
    makefile: "makefile",
    gitignore: "plaintext",
    env: "plaintext",
    txt: "plaintext",
    svg: "xml",
    lock: "plaintext",
  };
  return map[ext] || "plaintext";
}
