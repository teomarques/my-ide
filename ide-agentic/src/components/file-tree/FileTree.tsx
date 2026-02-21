import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileJson,
  File,
  FileType,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/stores/fileStore";
import { useEditorStore } from "@/stores/editorStore";
import {
  readDir,
  readFileContent,
  detectLanguage,
} from "@/services/tauriCommands";
import type { FileEntry } from "@/types";

function getFileIcon(name: string, isDir: boolean, isExpanded: boolean) {
  if (isDir) {
    return isExpanded ? (
      <FolderOpen className="size-4 text-yellow-400 shrink-0" />
    ) : (
      <Folder className="size-4 text-yellow-400 shrink-0" />
    );
  }

  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  switch (ext) {
    case "ts":
    case "tsx":
      return <FileCode className="size-4 text-blue-400 shrink-0" />;
    case "js":
    case "jsx":
      return <FileCode className="size-4 text-yellow-300 shrink-0" />;
    case "rs":
      return <FileCode className="size-4 text-orange-400 shrink-0" />;
    case "py":
      return <FileCode className="size-4 text-green-400 shrink-0" />;
    case "json":
    case "toml":
    case "yaml":
    case "yml":
      return <FileJson className="size-4 text-amber-300 shrink-0" />;
    case "html":
      return <FileCode className="size-4 text-orange-500 shrink-0" />;
    case "css":
    case "scss":
      return <FileCode className="size-4 text-purple-400 shrink-0" />;
    case "md":
      return <FileText className="size-4 text-gray-400 shrink-0" />;
    case "svg":
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "ico":
    case "icns":
      return <Image className="size-4 text-green-300 shrink-0" />;
    case "lock":
      return <File className="size-4 text-gray-500 shrink-0" />;
    case "sh":
    case "bash":
    case "zsh":
      return <FileType className="size-4 text-green-500 shrink-0" />;
    default:
      return <File className="size-4 text-gray-400 shrink-0" />;
  }
}

interface TreeNodeProps {
  entry: FileEntry;
  depth: number;
}

function TreeNode({ entry, depth }: TreeNodeProps) {
  const [children, setChildren] = useState<FileEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const openTab = useEditorStore((s) => s.openTab);
  const activeTabId = useEditorStore((s) => s.activeTabId);

  const handleClick = useCallback(async () => {
    if (entry.is_dir) {
      if (!isExpanded && children.length === 0) {
        setIsLoading(true);
        try {
          const result = await readDir(entry.path);
          setChildren(result);
        } catch (err) {
          console.error("Erro ao ler diretória:", err);
        }
        setIsLoading(false);
      }
      setIsExpanded((prev) => !prev);
    } else {
      try {
        const content = await readFileContent(entry.path);
        const language = detectLanguage(entry.name);
        openTab({
          id: entry.path,
          name: entry.name,
          path: entry.path,
          content,
          language,
        });
      } catch (err) {
        console.error("Erro ao abrir ficheiro:", err);
      }
    }
  }, [entry, isExpanded, children.length, openTab]);

  const isActive = activeTabId === entry.path;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-[#2a2d2e] text-sm select-none",
          isActive && "bg-[#37373d]"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {entry.is_dir ? (
          <span className="shrink-0 w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="size-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="size-3.5 text-gray-400" />
            )}
          </span>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {getFileIcon(entry.name, entry.is_dir, isExpanded)}
        <span className="truncate text-[#cccccc]">
          {entry.name}
          {isLoading && " ..."}
        </span>
      </div>

      {isExpanded &&
        children.map((child) => (
          <TreeNode key={child.path} entry={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function FileTree() {
  const { rootPath, fileTree, setFileTree } = useFileStore();

  useEffect(() => {
    if (!rootPath) return;
    readDir(rootPath)
      .then(setFileTree)
      .catch((err) => console.error("Erro ao carregar ficheiros:", err));
  }, [rootPath, setFileTree]);

  if (!rootPath) {
    return (
      <div className="p-4 text-sm text-[#858585]">
        Nenhuma pasta aberta.
      </div>
    );
  }

  return (
    <div className="py-1 overflow-y-auto h-full text-sm">
      {fileTree.map((entry) => (
        <TreeNode key={entry.path} entry={entry} depth={0} />
      ))}
    </div>
  );
}
