#!/bin/bash
# ============================================
# IDE-AI — Script de lançamento para desenvolvimento
# ============================================
# Resolve conflitos entre VS Code Snap e WebKit2GTK
# que causam erros de símbolo ao iniciar o Tauri.
#
# Uso: ./dev.sh          (a partir de qualquer terminal)
#      bash dev.sh        (de dentro do VS Code)
# ============================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Detectar node — procurar nvm, fnm ou PATH do sistema
NODE_DIR=""
if [ -d "$HOME/.nvm" ]; then
  # shellcheck disable=SC1091
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --no-use 2>/dev/null
  NODE_BIN="$(nvm which current 2>/dev/null || find "$NVM_DIR/versions/node" -maxdepth 2 -name node -type f 2>/dev/null | sort -V | tail -1)"
  NODE_DIR="$(dirname "$NODE_BIN" 2>/dev/null)"
fi
[ -z "$NODE_DIR" ] && NODE_DIR="$(dirname "$(command -v node 2>/dev/null)" 2>/dev/null)"

# Detectar cargo
CARGO_DIR="$HOME/.cargo/bin"
[ ! -d "$CARGO_DIR" ] && CARGO_DIR="$(dirname "$(command -v cargo 2>/dev/null)" 2>/dev/null)"

# Construir PATH limpo (sem referências a snap)
CLEAN_PATH="$CARGO_DIR:$NODE_DIR:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

echo "🚀 A iniciar IDE-AI em modo de desenvolvimento..."
echo "   Cargo: $($CARGO_DIR/cargo --version 2>/dev/null || echo 'não encontrado')"
echo "   Node:  $($NODE_DIR/node --version 2>/dev/null || echo 'não encontrado')"
echo "   Dir:   $SCRIPT_DIR"
echo ""

# Lançar com ambiente limpo (env -i) para evitar conflitos do Snap com WebKit2GTK
exec env -i \
  HOME="$HOME" \
  USER="${USER:-$(whoami)}" \
  LOGNAME="${USER:-$(whoami)}" \
  SHELL="/bin/bash" \
  TERM="${TERM:-xterm-256color}" \
  DISPLAY="${DISPLAY:-}" \
  WAYLAND_DISPLAY="${WAYLAND_DISPLAY:-}" \
  XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}" \
  DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-}" \
  XDG_DATA_DIRS="/usr/share/gnome:/usr/local/share:/usr/share" \
  XDG_DATA_HOME="$HOME/.local/share" \
  XDG_CONFIG_HOME="$HOME/.config" \
  XDG_CACHE_HOME="$HOME/.cache" \
  PATH="$CLEAN_PATH" \
  WEBKIT_DISABLE_DMABUF_RENDERER=1 \
  bash -c "cd '$SCRIPT_DIR' && npm run tauri dev"
