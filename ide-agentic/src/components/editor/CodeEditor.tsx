import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { writeFileContent } from "@/services/tauriCommands";

function EditorTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

  if (tabs.length === 0) return null;

  return (
    <div className="flex bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto shrink-0">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer border-r border-[#1e1e1e] min-w-0 group",
            activeTabId === tab.id
              ? "bg-[#1e1e1e] text-white"
              : "bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2a2a]"
          )}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="truncate max-w-[140px]">
            {tab.isDirty && (
              <span className="text-white mr-1">●</span>
            )}
            {tab.name}
          </span>
          <button
            className="opacity-0 group-hover:opacity-100 hover:bg-[#444] rounded p-0.5 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function CodeEditor() {
  const {
    tabs,
    activeTabId,
    updateTabContent,
    markTabClean,
    setCursorPosition,
  } = useEditorStore();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Ctrl+S para guardar
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
        const tab = useEditorStore.getState().tabs.find(
          (t) => t.id === useEditorStore.getState().activeTabId
        );
        if (tab && tab.isDirty) {
          try {
            await writeFileContent(tab.path, tab.content);
            markTabClean(tab.id);
          } catch (err) {
            console.error("Erro ao guardar:", err);
          }
        }
      });

      // Atualizar posição do cursor
      editor.onDidChangeCursorPosition((e) => {
        setCursorPosition({
          line: e.position.lineNumber,
          column: e.position.column,
        });
      });
    },
    [markTabClean, setCursorPosition]
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (activeTabId && value !== undefined) {
        updateTabContent(activeTabId, value);
      }
    },
    [activeTabId, updateTabContent]
  );

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <EditorTabs />

      {activeTab ? (
        <div className="flex-1 min-h-0">
          <Editor
            key={activeTab.id}
            height="100%"
            language={activeTab.language}
            value={activeTab.content}
            theme="vs-dark"
            onChange={handleChange}
            onMount={handleMount}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
              padding: { top: 8 },
              lineNumbers: "on",
              wordWrap: "off",
              tabSize: 2,
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-[#5a5a5a]">
          <div className="text-6xl font-light mb-4 text-[#3c3c3c]">IDE-AI</div>
          <div className="text-sm space-y-1 text-center">
            <p>Abra um ficheiro no explorador para começar a editar</p>
            <p className="text-xs text-[#454545]">
              Ctrl+S para guardar · Ctrl+` para terminal
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
