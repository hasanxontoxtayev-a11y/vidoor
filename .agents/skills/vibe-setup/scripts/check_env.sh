#!/usr/bin/env bash
# Audits the tools a vibe-coding student needs (macOS, Linux, Windows Git Bash).
# Read-only: it never installs or changes anything. Prints a Markdown table.

MIN_NODE=20
MIN_PY_MAJOR=3
MIN_PY_MINOR=10

# ---------- computer info ----------
case "$(uname -s)" in
  Darwin) OS="macOS $(sw_vers -productVersion 2>/dev/null)";;
  Linux)
    if grep -qi microsoft /proc/version 2>/dev/null; then OS="Linux (WSL on Windows)"; else OS="Linux"; fi
    if [ -r /etc/os-release ]; then OS="$OS — $(. /etc/os-release; echo "$PRETTY_NAME")"; fi;;
  MINGW*|MSYS*|CYGWIN*) OS="Windows (Git Bash)";;
  *) OS="$(uname -s)";;
esac
ARCH="$(uname -m)"

PM="none found"
for p in brew winget apt dnf pacman zypper; do
  if command -v "$p" >/dev/null 2>&1; then PM="$p"; break; fi
done

# ---------- helpers ----------
ver_of() { # first version-looking number from a command's output
  "$@" 2>&1 | grep -Eo '[0-9]+(\.[0-9]+)+' | head -1
}

ROWS=""
add_row() { # name | needed for | level | status | version
  ROWS="$ROWS| $1 | $2 | $3 | $4 | $5 |
"
}

check() { # name, purpose, level(core|optional), command...
  local name="$1" purpose="$2" level="$3"; shift 3
  if command -v "$1" >/dev/null 2>&1; then
    local v; v="$(ver_of "$@")"
    add_row "$name" "$purpose" "$level" "✅ installed" "${v:-?}"
  else
    if [ "$level" = "core" ]; then add_row "$name" "$purpose" "$level" "❌ missing" "—"
    else add_row "$name" "$purpose" "$level" "➖ not installed" "—"; fi
  fi
}

# ---------- core ----------
check "Git" "saves versions of your code" core git --version

if command -v node >/dev/null 2>&1; then
  v="$(ver_of node --version)"; major="${v%%.*}"
  if [ "${major:-0}" -ge "$MIN_NODE" ] 2>/dev/null; then add_row "Node.js" "runs websites (Next.js) and JS tools" core "✅ installed" "$v"
  else add_row "Node.js" "runs websites (Next.js) and JS tools" core "⚠️ too old (need $MIN_NODE+)" "$v"; fi
else add_row "Node.js" "runs websites (Next.js) and JS tools" core "❌ missing" "—"; fi

check "npm" "installs JavaScript packages" core npm --version

PY=""
for c in python3 python py; do
  if command -v "$c" >/dev/null 2>&1 && "$c" --version 2>&1 | grep -q "Python [0-9]"; then PY="$c"; break; fi
done
if [ -n "$PY" ]; then
  v="$(ver_of "$PY" --version)"; maj="${v%%.*}"; rest="${v#*.}"; min="${rest%%.*}"
  if [ "$maj" -gt "$MIN_PY_MAJOR" ] || { [ "$maj" -eq "$MIN_PY_MAJOR" ] && [ "$min" -ge "$MIN_PY_MINOR" ]; }; then
    add_row "Python" "runs Telegram bots (aiogram)" core "✅ installed" "$v"
  else add_row "Python" "runs Telegram bots (aiogram)" core "⚠️ too old (need $MIN_PY_MAJOR.$MIN_PY_MINOR+)" "$v"; fi
  if "$PY" -m pip --version >/dev/null 2>&1; then add_row "pip" "installs Python packages" core "✅ installed" "$(ver_of "$PY" -m pip --version)"
  else add_row "pip" "installs Python packages" core "❌ missing" "—"; fi
  if "$PY" -c "import venv, ensurepip" >/dev/null 2>&1; then add_row "Python venv" "keeps each project's packages separate" core "✅ installed" "—"
  else add_row "Python venv" "keeps each project's packages separate" core "❌ missing" "—"; fi
else
  add_row "Python" "runs Telegram bots (aiogram)" core "❌ missing" "—"
  add_row "pip" "installs Python packages" core "❌ missing" "—"
fi

if command -v git >/dev/null 2>&1; then
  gn="$(git config --global user.name 2>/dev/null)"; ge="$(git config --global user.email 2>/dev/null)"
  if [ -n "$gn" ] && [ -n "$ge" ]; then add_row "Git name & email" "your name on every save (commit)" core "✅ set" "$gn"
  else add_row "Git name & email" "your name on every save (commit)" core "❌ not set" "—"; fi
fi

# ---------- AI coding tool (one is enough; Antigravity is a desktop app, not checked here) ----------
check "Claude Code" "AI coding helper (one is enough)" ai-tool claude --version
check "Codex CLI" "AI coding helper (one is enough)" ai-tool codex --version

# ---------- optional ----------
check "VS Code" "code editor to see your files" optional code --version
check "GitHub CLI (gh)" "log in to GitHub from the terminal" optional gh --version
check "Vercel CLI" "deploy web apps from the terminal" optional vercel --version
check "Netlify CLI" "deploy static sites from the terminal" optional netlify --version
check "Supabase CLI" "database tools (or use: npx supabase)" optional supabase --version
check "Railway CLI" "deploy bots from the terminal" optional railway --version

# ---------- output ----------
echo "Computer: $OS ($ARCH)"
echo "Package manager: $PM"
echo
echo "| Tool | Needed for | Level | Status | Version |"
echo "|---|---|---|---|---|"
printf "%s" "$ROWS"
