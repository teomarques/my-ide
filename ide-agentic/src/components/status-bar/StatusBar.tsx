import { useEditorStore } from "@/stores/editorStore";
import { useFileStore } from "@/stores/fileStore";

export default function StatusBar() {
  const { tabs, activeTabId, cursorPosition } = useEditorStore();
  const { rootPath, isTerminalOpen, toggleTerminal } = useFileStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const projectName = rootPath?.split("/").pop() ?? "IDE-AI";

  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-[11px] text-white shrink-0 select-none">
      {/* Lado esquerdo */}
      <div className="flex items-center gap-3">
        <span className="font-medium">{projectName}</span>
        {activeTab && (
          <>
            <span className="opacity-70">·</span>
            <span className="opacity-80">
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
          </>
        )}
      </div>

      {/* Lado direito */}
      <div className="flex items-center gap-3">
        {activeTab && (
          <>
            <span className="opacity-80">{activeTab.language}</span>
            <span className="opacity-70">·</span>
            <span className="opacity-80">UTF-8</span>
          </>
        )}
        <button
          className="opacity-80 hover:opacity-100 transition-opacity"
          onClick={toggleTerminal}
        >
          {isTerminalOpen ? "Ocultar Terminal" : "Mostrar Terminal"}
        </button>
      </div>
    </div>
  );
}
