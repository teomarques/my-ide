import { useCallback, useEffect } from "react";
import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import Sidebar from "@/components/sidebar/Sidebar";
import FileTree from "@/components/file-tree/FileTree";
import CodeEditor from "@/components/editor/CodeEditor";
import Terminal from "@/components/terminal/Terminal";
import StatusBar from "@/components/status-bar/StatusBar";
import { useFileStore } from "@/stores/fileStore";
import { getHomeDir } from "@/services/tauriCommands";
import { Search, GitBranch, Bot } from "lucide-react";

function SidebarContent() {
  const { sidebarView } = useFileStore();

  switch (sidebarView) {
    case "files":
      return <FileTree />;
    case "search":
      return (
        <PlaceholderPanel
          icon={<Search className="size-8 text-[#555]" />}
          title="Pesquisa"
          description="Pesquisa global em ficheiros — disponível em breve."
        />
      );
    case "git":
      return (
        <PlaceholderPanel
          icon={<GitBranch className="size-8 text-[#555]" />}
          title="Controlo de Versão"
          description="Integração Git completa — disponível em breve."
        />
      );
    case "ai":
      return (
        <PlaceholderPanel
          icon={<Bot className="size-8 text-[#555]" />}
          title="Assistente IA"
          description="Chat com IA para ajuda no código — disponível em breve."
        />
      );
    default:
      return <FileTree />;
  }
}

function PlaceholderPanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      {icon}
      <h3 className="text-sm font-medium text-[#aaa] mt-3">{title}</h3>
      <p className="text-xs text-[#666] mt-1 max-w-[180px]">{description}</p>
    </div>
  );
}

function SidebarPanelHeader() {
  const { sidebarView } = useFileStore();
  const labels: Record<string, string> = {
    files: "EXPLORADOR",
    search: "PESQUISA",
    git: "CONTROLO DE VERSÃO",
    ai: "ASSISTENTE IA",
  };

  return (
    <div className="h-8 flex items-center px-4 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase shrink-0 bg-[#252526]">
      {labels[sidebarView] ?? "EXPLORADOR"}
    </div>
  );
}

export default function IDELayout() {
  const { rootPath, setRootPath, isSidebarOpen, isTerminalOpen } =
    useFileStore();

  // Carregar a diretória home como raiz por defeito
  const loadRoot = useCallback(async () => {
    if (!rootPath) {
      try {
        const home = await getHomeDir();
        setRootPath(home);
      } catch (err) {
        console.error("Erro ao obter diretória home:", err);
      }
    }
  }, [rootPath, setRootPath]);

  useEffect(() => {
    loadRoot();
  }, [loadRoot]);

  // Atalho global: Ctrl+` para toggle terminal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        useFileStore.getState().toggleTerminal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Corpo principal */}
      <div className="flex flex-1 min-h-0">
        {/* Activity Bar (sidebar ícones) */}
        <Sidebar />

        {/* Conteúdo com painéis redimensionáveis */}
        <Group orientation="horizontal" className="flex-1">
          {/* Painel lateral (File Tree, etc.) */}
          {isSidebarOpen && (
            <>
              <Panel
                defaultSize={20}
                minSize={15}
                maxSize={40}
                className="bg-[#252526]"
              >
                <div className="flex flex-col h-full">
                  <SidebarPanelHeader />
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <SidebarContent />
                  </div>
                </div>
              </Panel>
              <Separator className="w-[3px] bg-[#1e1e1e] hover:bg-[#007acc] transition-colors cursor-col-resize" />
            </>
          )}

          {/* Painel principal (Editor + Terminal) */}
          <Panel minSize={30}>
            <Group orientation="vertical">
              {/* Editor */}
              <Panel minSize={20}>
                <CodeEditor />
              </Panel>

              {/* Terminal */}
              {isTerminalOpen && (
                <>
                  <Separator className="h-[3px] bg-[#1e1e1e] hover:bg-[#007acc] transition-colors cursor-row-resize" />
                  <Panel
                    defaultSize={30}
                    minSize={10}
                    maxSize={70}
                  >
                    <div className="h-full flex flex-col bg-[#1a1a1a]">
                      <div className="h-7 flex items-center px-3 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase bg-[#252526] shrink-0 border-t border-[#1e1e1e]">
                        TERMINAL
                      </div>
                      <div className="flex-1 min-h-0">
                        <Terminal />
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </Group>
          </Panel>
        </Group>
      </div>

      {/* Barra de estado */}
      <StatusBar />
    </div>
  );
}
