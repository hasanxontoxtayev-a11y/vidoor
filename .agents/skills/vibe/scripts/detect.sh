#!/usr/bin/env bash
# Read-only: reports the computer, the AI tool this is running in, and the kit's progress.
# Usage: bash detect.sh [project-folder]   (default: current folder)

DIR="${1:-.}"

# ---------- computer ----------
case "$(uname -s)" in
  Darwin) OS="macOS $(sw_vers -productVersion 2>/dev/null)";;
  Linux)
    if grep -qi microsoft /proc/version 2>/dev/null; then OS="Linux (WSL on Windows)"; else OS="Linux"; fi
    [ -r /etc/os-release ] && OS="$OS — $(. /etc/os-release; echo "$PRETTY_NAME")";;
  MINGW*|MSYS*|CYGWIN*) OS="Windows (Git Bash)";;
  *) OS="$(uname -s)";;
esac

# ---------- AI tool ----------
TOOL="unknown"; HOW="no known environment variable found"
if [ -n "$ANTIGRAVITY_AGENT" ] || [ -n "$ANTIGRAVITY_CLI_ALIAS" ]; then TOOL="Antigravity"; HOW="ANTIGRAVITY_* variable"
elif [ -n "$CODEX_SANDBOX" ] || [ -n "$CODEX_THREAD_ID" ] || [ -n "$CODEX_CI" ] || [ -n "$CODEX_SANDBOX_NETWORK_DISABLED" ]; then TOOL="Codex"; HOW="CODEX_* variable"
elif [ -n "$CLAUDECODE" ] || [ -n "$CLAUDE_CODE" ]; then TOOL="Claude Code"; HOW="CLAUDECODE variable"
elif [ -n "$GEMINI_CLI" ]; then TOOL="Gemini CLI"; HOW="GEMINI_CLI variable"
elif [ -n "$CURSOR_AGENT" ]; then TOOL="Cursor"; HOW="CURSOR_AGENT variable"
elif [ -n "$AI_AGENT" ]; then TOOL="$AI_AGENT"; HOW="AI_AGENT variable"
fi

# ---------- kit progress ----------
has() { [ -f "$DIR/$1" ] && echo yes || echo no; }
STEPS_DONE=0; STEPS_TOTAL=0
if [ -f "$DIR/PLAN.md" ]; then
  STEPS_DONE=$(grep -cE '^\s*- \[[xX]\]' "$DIR/PLAN.md")
  STEPS_TOTAL=$(grep -cE '^\s*- \[[ xX]\]' "$DIR/PLAN.md")
fi

echo "computer: $OS ($(uname -m))"
echo "ai_tool: $TOOL ($HOW)"
echo "profile (.vibe/profile.md): $(has .vibe/profile.md)"
echo "TZ-draft.md: $(has TZ-draft.md)"
echo "TZ.md: $(has TZ.md)"
echo "PLAN.md: $(has PLAN.md) — tasks done: $STEPS_DONE / $STEPS_TOTAL"
echo "git repository: $([ -d "$DIR/.git" ] && echo yes || echo no)"
