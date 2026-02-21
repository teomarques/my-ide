# IDE Agêntico — Plataforma de Desenvolvimento com IA Autónoma

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-v2-blue?style=flat-square&logo=tauri" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Rust-Tauri%20Backend-orange?style=flat-square&logo=rust" />
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=flat-square" />
</p>

---

## Visão

Nos IDEs tradicionais, **o humano conduz todas as ações** e usa ferramentas para acelerar o processo. Neste **IDE Agêntico**, o modelo de IA possui autonomia para conduzir ações complexas através de *Function Calling* (Chamada de Funções).

O motor de inteligência é alimentado pelo **Gemini 2.5 Pro** — o modelo mais poderoso do Google Deepmind, com janela de contexto de 1M tokens, raciocínio nativo, análise multimodal (código, imagem, vídeo, áudio) e execução de código integrada. A plataforma conecta essa inteligência ao sistema operativo real, dando-lhe mãos para criar, modificar e orquestrar projetos de forma autónoma.

> O modelo não sabe nativamente como criar um ficheiro no Ubuntu ou compilar um vídeo. O IDE **ensina** ao modelo as ferramentas que tem disponíveis. Quando o utilizador faz um pedido, a IA processa a intenção, escolhe a ferramenta certa, gera os parâmetros necessários e devolve a instrução ao backend Rust — que executa a ação real no sistema operativo.

---

## Funcionalidades Atuais (Fase 1)

### 💻 Editor de Código — Monaco Editor
- Syntax highlighting para múltiplas linguagens
- Sistema de tabs para múltiplos ficheiros
- Tema escuro por defeito
- Deteção automática de linguagem por extensão
- Guardar com `Ctrl+S`

### 📁 Explorador de Ficheiros
- Navegação em árvore expansível
- Ícones por tipo de ficheiro
- Abertura de ficheiros com clique
- Integração com o sistema de ficheiros local via Tauri

### 🖥️ Terminal Integrado
- Terminal `xterm.js` embutido na interface
- Painel inferior redimensionável
- Shell do sistema (`bash`/`zsh`)

### 🎨 Interface Moderna
- Design escuro inspirado no VS Code
- Painéis redimensionáveis (`react-resizable-panels`)
- Sidebar com navegação por ícones (`lucide-react`)
- Barra de estado com informações do ficheiro ativo
- Tailwind CSS v4 + componentes modulares

---

## Arquitetura Técnica

### Stack de Desenvolvimento

| Camada | Tecnologia | Função |
|--------|------------|--------|
| **Desktop** | Tauri v2 (Rust) | Segurança, desempenho e acesso nativo ao SO |
| **Frontend** | React 19 + TypeScript 5.8 | Interface visual e reatividade |
| **Editor** | Monaco Editor 4.7 | Edição de código com IntelliSense |
| **Terminal** | xterm.js 6.0 | Terminal ANSI completo integrado |
| **Estilo** | Tailwind CSS v4 | Styling moderno e responsivo |
| **Estado** | Zustand 5 | Gestão de estado global leve |
| **Build** | Vite 7 | Build rápido com HMR |

### Anatomia do Motor de Inteligência (Roadmap)

Para a IA ter contexto total do projeto e agir sobre ele, o backend divide-se em **três subsistemas críticos**:

#### 1. 🧠 Motor de Percepção — Memória e Contexto (RAG)
Um LLM não consegue ler 10.000 ficheiros de uma vez. A solução é a arquitetura **RAG (Retrieval-Augmented Generation)**:

1. O IDE monitoriza continuamente a pasta do projeto.
2. Cada ficheiro é lido, fatiado em blocos semânticos e convertido em **embeddings** vetoriais.
3. Os vetores são guardados numa base de dados local (**ChromaDB**).
4. Quando o utilizador pede *"altera a cor do botão de login"*, o sistema procura os ficheiros mais relevantes e injeta esse código diretamente no contexto da IA — antes de ela responder.

#### 2. 🔀 Orquestrador Cognitivo — Roteamento (LangGraph)
O cérebro do IDE é gerido por um framework de agentes (**LangGraph**), que atua como gestor de tráfego:
- Pedido sobre código → **Agente Programador**
- Pedido de relatório de mercado → **Agente de Deep Research**
- Pedido de apresentação → **Agente de Slides**

Este sistema garante que a IA não tenta usar ferramentas de formatação de texto para resolver problemas de compilação.

#### 3. ⚡ Atuadores — Ferramentas Físicas
Scripts locais que executam o que a IA decidiu, expondo-os como ferramentas via *Function Calling*:

- **Manipulação de Ficheiros**: Backend Rust com permissões de leitura/escrita (`create`, `modify`, `delete`, `move`)
- **Terminal Virtual**: Ponte direta ao shell do sistema — instalar pacotes, iniciar servidores, executar `git`
- **Pesquisa Web**: API Tavily + headless browser para extração profunda de conteúdo
- **Gerador de Slides**: Pipeline Marp/Pandoc para converter Markdown estruturado em PDF
- **Geração Multimédia**: Chamadas a APIs de imagem/vídeo com download e integração no explorador

---

## Ferramentas Avançadas

### 🔍 Deep Research — Pesquisa Profunda Autónoma
Não é uma simples pesquisa no Google. O agente opera em ciclo iterativo:

1. Formula **3 a 5 termos de pesquisa otimizados** a partir da pergunta.
2. Usa a **API Tavily** para encontrar URLs relevantes.
3. Invoca um **headless browser** para extrair o texto completo das páginas.
4. O modelo lê, resume e decide se precisa de aprofundar mais.
5. Formata tudo num **relatório Markdown** e guarda-o no projeto via atuador de ficheiros.

### 📊 Slides Maker — Renderização Multimédia
A IA não gera ficheiros `.pptx` ou `.mp4` nativamente. O IDE atua como **tradutor**:

- **Slides**: A IA estrutura o conteúdo em Markdown (Marp). O IDE corre a conversão em background e renderiza o PDF numa aba dedicada.
- **Imagem/Vídeo**: A IA define prompts e parâmetros técnicos. O IDE faz a chamada à API de geração multimédia, faz download do resultado e exibe-o no explorador.

---

## Segurança — Filosofia "Human-in-the-Loop"

Dar controlo de terminal e sistema de ficheiros a uma IA num ambiente Linux exige **barreiras de segurança intransigentes**.

### 🔴 Diff View (Visão de Diferenças)
A IA **nunca reescreve um ficheiro instantaneamente**. Ela gera as alterações e o IDE apresenta um painel lado a lado:
- 🔴 Código antigo (vermelho)
- 🟢 Código novo (verde)

A alteração **só é aplicada ao disco** após o utilizador clicar em **"Aceitar"**.

### 🔐 Guarita de Terminal
Se a IA decidir executar um comando (ex: `rm -rf dist/`), o comando aparece no painel do terminal em **modo de espera** — exigindo que o utilizador pressione `Enter` para autorizar a execução.

---

## Estrutura do Projeto

```
my-ide/
├── README.md
└── ide-agentic/
    ├── package.json          # Dependências e scripts npm
    ├── vite.config.ts        # Configuração Vite + Tauri
    ├── tsconfig.json         # Configuração TypeScript
    ├── index.html
    ├── src/
    │   ├── main.tsx          # Ponto de entrada React
    │   ├── App.tsx           # Componente raiz
    │   ├── components/
    │   │   ├── editor/       # Monaco Editor wrapper
    │   │   ├── file-tree/    # Explorador de ficheiros
    │   │   ├── terminal/     # Terminal xterm.js
    │   │   ├── sidebar/      # Barra lateral com ícones
    │   │   └── status-bar/   # Barra de estado inferior
    │   ├── stores/           # Estado global (Zustand)
    │   ├── services/         # Wrappers dos comandos Tauri
    │   ├── types/            # Tipos TypeScript globais
    │   ├── hooks/            # React hooks personalizados
    │   └── layouts/          # Layouts da aplicação
    └── src-tauri/
        ├── Cargo.toml        # Dependências Rust
        ├── tauri.conf.json   # Configuração Tauri (permissões, plugins)
        ├── capabilities/     # Declaração de capabilities de segurança
        └── src/
            ├── main.rs       # Entry point Tauri
            └── lib.rs        # Comandos Tauri (FS, shell, etc.)
```

---

## Instalação e Execução

### Requisitos
- **Node.js** v18+
- **Rust** v1.70+ ([rustup.rs](https://rustup.rs))
- **Tauri CLI v2**: `cargo install tauri-cli`

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/teomarques/my-ide.git
cd my-ide/ide-agentic

# 2. Instale as dependências
npm install

# 3. Execute em modo de desenvolvimento
npm run tauri dev

# 4. Build de produção
npm run tauri build
```

---

## Roadmap

### ✅ Fase 1 — Fundação (Concluída)
- [x] Editor Monaco com syntax highlighting e tabs
- [x] Explorador de ficheiros com árvore expansível
- [x] Terminal xterm.js integrado
- [x] Interface modular com painéis redimensionáveis
- [x] Backend Tauri v2 + Rust com acesso ao sistema de ficheiros

### 🚧 Fase 2 — Motor de IA (Em Desenvolvimento)
- [ ] Integração com **Gemini 2.5 Pro** via API
- [ ] Painel de chat IA na sidebar
- [ ] Autocompletar assistido por IA no editor
- [ ] Explicação e refatoração de código com IA
- [ ] **Diff View** com aprovação explícita de alterações
- [ ] **Guarita de Terminal** para aprovação de comandos

### 🔮 Fase 3 — Agentes Autónomos
- [ ] Arquitetura RAG com **ChromaDB** (Motor de Percepção)
- [ ] Orquestrador de agentes com **LangGraph**
- [ ] Agente de **Deep Research** com headless browser e API Tavily
- [ ] Agente **Programador** com execução autónoma de fluxos de trabalho
- [ ] Agente de **Slides** com pipeline Marp/Pandoc

### 🌟 Fase 4 — Funcionalidades Avançadas
- [ ] Integração Git completa (status, commit, diff, branches)
- [ ] Geração de imagens e vídeo via APIs multimédia
- [ ] Sistema de extensões/plugins
- [ ] CI/CD integrado
- [ ] Depuração visual integrada

---

## Contribuição

Contribuições são bem-vindas! Abra uma *issue* ou *pull request*.

---

**Desenvolvido com ❤️ por Teodoro Marques**

| | |
|---|---|
| **Email** | teomarques@gmail.com |
| **GitHub** | [github.com/teomarques](https://github.com/teomarques) |
| **Licença** | MIT |
