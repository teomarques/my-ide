import {
  Files,
  Search,
  GitBranch,
  Bot,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/stores/fileStore";
import type { SidebarView } from "@/types";

interface SidebarButtonProps {
  icon: React.ReactNode;
  view: SidebarView;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarButton({ icon, label, active, onClick }: SidebarButtonProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-center py-3 text-[#858585] hover:text-white transition-colors relative",
        active && "text-white"
      )}
      onClick={onClick}
      title={label}
    >
      {active && (
        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-white rounded-r" />
      )}
      {icon}
    </button>
  );
}

export default function Sidebar() {
  const { sidebarView, setSidebarView, isSidebarOpen, toggleSidebar } =
    useFileStore();

  const handleClick = (view: SidebarView) => {
    if (sidebarView === view && isSidebarOpen) {
      toggleSidebar();
    } else {
      setSidebarView(view);
      if (!isSidebarOpen) toggleSidebar();
    }
  };

  const items: { view: SidebarView; icon: React.ReactNode; label: string }[] = [
    {
      view: "files",
      icon: <Files className="size-5" />,
      label: "Explorador de Ficheiros",
    },
    {
      view: "search",
      icon: <Search className="size-5" />,
      label: "Pesquisa (em breve)",
    },
    {
      view: "git",
      icon: <GitBranch className="size-5" />,
      label: "Controlo de Versão (em breve)",
    },
    {
      view: "ai",
      icon: <Bot className="size-5" />,
      label: "Assistente IA (em breve)",
    },
  ];

  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-1 shrink-0 border-r border-[#252526]">
      <div className="flex flex-col flex-1">
        {items.map((item) => (
          <SidebarButton
            key={item.view}
            view={item.view}
            icon={item.icon}
            label={item.label}
            active={sidebarView === item.view && isSidebarOpen}
            onClick={() => handleClick(item.view)}
          />
        ))}
      </div>

      {/* Settings no fundo */}
      <div className="mt-auto pb-2">
        <button
          className="w-full flex items-center justify-center py-3 text-[#858585] hover:text-white transition-colors"
          title="Definições (em breve)"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </div>
  );
}
