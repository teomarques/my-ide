# IDE-AI — Frontend

Frontend da aplicação **IDE-AI** (Agente Inteligente Avançado), construído com **React 19 + TypeScript + Vite 7**, integrado com **Tauri v2** para acesso nativo ao sistema.

## Stack

- **React 19** + **TypeScript 5.8** — UI reativa
- **Monaco Editor** — Editor de código (motor do VS Code)
- **xterm.js** — Terminal integrado
- **Tailwind CSS v4** — Styling
- **Zustand** — Gestão de estado
- **Vite 7** — Build e HMR
- **Tauri v2** — Backend nativo em Rust

## Desenvolvimento

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

## IDE Setup Recomendado

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
