import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    const term = new XTerminal({
      cursorBlink: true,
      cursorStyle: "bar",
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
      theme: {
        background: "#1a1a1a",
        foreground: "#cccccc",
        cursor: "#aeafad",
        selectionBackground: "#264f78",
        black: "#1e1e1e",
        red: "#f44747",
        green: "#6a9955",
        yellow: "#d7ba7d",
        blue: "#569cd6",
        magenta: "#c586c0",
        cyan: "#4ec9b0",
        white: "#d4d4d4",
        brightBlack: "#808080",
        brightRed: "#f44747",
        brightGreen: "#6a9955",
        brightYellow: "#d7ba7d",
        brightBlue: "#569cd6",
        brightMagenta: "#c586c0",
        brightCyan: "#4ec9b0",
        brightWhite: "#ffffff",
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);

    // Pequeno delay para o DOM atualizar antes de fazer fit
    requestAnimationFrame(() => {
      try {
        fitAddon.fit();
      } catch {
        // Ignorar erro se o container ainda não estiver visível
      }
    });

    // Mensagem de boas-vindas
    term.writeln("\x1b[1;36m╔══════════════════════════════════════╗\x1b[0m");
    term.writeln("\x1b[1;36m║\x1b[0m   \x1b[1;37mIDE-AI Terminal\x1b[0m                   \x1b[1;36m║\x1b[0m");
    term.writeln("\x1b[1;36m║\x1b[0m   \x1b[90mAgente Inteligente Avançado\x1b[0m        \x1b[1;36m║\x1b[0m");
    term.writeln("\x1b[1;36m╚══════════════════════════════════════╝\x1b[0m");
    term.writeln("");
    term.writeln("\x1b[90mTerminal interativo (futuro: integração com shell do sistema)\x1b[0m");
    term.writeln("");

    // Prompt simples local (echo mode — sem shell real por agora)
    let currentLine = "";
    const prompt = "\x1b[1;32m❯\x1b[0m ";

    term.write(prompt);

    term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter
        term.writeln("");
        if (currentLine.trim()) {
          if (currentLine.trim() === "clear") {
            term.clear();
          } else if (currentLine.trim() === "help") {
            term.writeln("\x1b[33mComandos disponíveis:\x1b[0m");
            term.writeln("  \x1b[36mclear\x1b[0m  — Limpar terminal");
            term.writeln("  \x1b[36mhelp\x1b[0m   — Mostrar ajuda");
            term.writeln("");
            term.writeln("\x1b[90mNota: Terminal completo com shell do sistema será");
            term.writeln("integrado numa versão futura via Tauri Shell plugin.\x1b[0m");
          } else {
            term.writeln(`\x1b[90mcomando não reconhecido: ${currentLine.trim()}\x1b[0m`);
          }
        }
        currentLine = "";
        term.write(prompt);
      } else if (code === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write("\b \b");
        }
      } else if (code >= 32) {
        // Caractere imprimível
        currentLine += data;
        term.write(data);
      }
    });

    termRef.current = term;
    fitRef.current = fitAddon;

    // Observer para redimensionar
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // Ignorar
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-[#1a1a1a]"
      style={{ padding: "4px 0 0 8px" }}
    />
  );
}
