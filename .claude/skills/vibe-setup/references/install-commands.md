# Install commands by computer type

Use only these official sources. Install one tool at a time, check it worked, then move on.
After installing on **Windows or macOS**, the student usually has to **close and reopen the terminal (and restart the AI tool if it runs inside that terminal)** before the new command is found — say this every time, it's the #1 beginner confusion.

Commands marked 🔐 ask for the computer password or admin rights. You can't type passwords for them, so ask the student to copy the command into their **own terminal window** (outside Claude Code), run it there, and tell you when it's done.

---

## Windows (winget — built into Windows 10/11)

Check winget exists: `winget --version`. If missing, ask the student to install/update "App Installer" from the Microsoft Store.

Add these flags to every winget command: `-e --source winget --accept-package-agreements --accept-source-agreements`

| Tool | Command |
|---|---|
| Git | `winget install --id Git.Git` (includes Git Bash) |
| Node.js + npm | `winget install --id OpenJS.NodeJS.LTS` |
| Python + pip | `winget install --id Python.Python.3.13` |
| VS Code | `winget install --id Microsoft.VisualStudioCode` |
| GitHub CLI | `winget install --id GitHub.cli` |

Windows notes:
- winget may show a "Do you want to allow this app to make changes?" (admin) window — the student clicks **Yes**.
- If `python` opens the Microsoft Store instead of running: Settings → Apps → Advanced app settings → App execution aliases → turn **off** "python.exe" and "python3.exe". Then use `py` or reopen the terminal.
- PowerShell may block npm scripts ("running scripts is disabled"). Fix for the current user only: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (ask the student first; it's a common, safe setting for developers).

## macOS (Homebrew)

1. **Homebrew** 🔐 (if `brew` is missing) — student runs in their own Terminal:
   `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   At the end it prints "Next steps" with 1–2 commands (adds brew to PATH on Apple Silicon Macs). The student must run those too, then reopen Terminal.
2. Then:

| Tool | Command |
|---|---|
| Git | `brew install git` (or `xcode-select --install` 🔐) |
| Node.js + npm | `brew install node` |
| Python + pip | `brew install python` (use `python3` and `pip3`) |
| VS Code | `brew install --cask visual-studio-code` |
| GitHub CLI | `brew install gh` |

## Linux — Ubuntu / Debian / Linux Mint / WSL

| Tool | Command |
|---|---|
| Git, Python, pip, venv 🔐 | `sudo apt update && sudo apt install -y git python3 python3-pip python3-venv curl` |
| Node.js + npm (no password needed) | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh \| bash` → reopen terminal → `nvm install --lts` |
| GitHub CLI 🔐 | `sudo apt install -y gh` |
| VS Code | download the .deb from code.visualstudio.com, or `sudo snap install code --classic` 🔐 |

Prefer nvm for Node on Linux: the apt version is often too old, and nvm lets `npm install -g` work without sudo.

## Linux — Fedora

`sudo dnf install -y git nodejs npm python3 python3-pip gh` 🔐

---

## AI coding tool — the student needs only ONE (the one the class uses)

| Tool | Windows | macOS / Linux |
|---|---|---|
| Claude Code | PowerShell: `irm https://claude.ai/install.ps1 \| iex` | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Codex CLI | `npm install -g @openai/codex` (needs Node.js) | `npm install -g @openai/codex` (or `brew install codex` on Mac) |
| Antigravity | Desktop app — download from antigravity.google and run the installer | Same — download from antigravity.google |

## Same on every computer (after Node.js is installed)

| Tool | Command | Note |
|---|---|---|
| Vercel CLI | `npm install -g vercel` | optional — GitHub → Vercel dashboard works without it |
| Netlify CLI | `npm install -g netlify-cli` | optional |
| Railway CLI | `npm install -g @railway/cli` | optional |
| Supabase CLI | don't install globally — use `npx supabase <command>` | npm global install is not supported by Supabase |

## Git name & email (always do this once)

Ask the student for the name and email they used (or will use) on GitHub, then:
```
git config --global user.name "Their Name"
git config --global user.email "their@email.com"
```

## No admin rights (school / office computer)

- Python from python.org installs "just for me" without admin.
- Node.js: on Linux/macOS use nvm (no admin). On Windows ask the teacher or IT to install Node.js LTS.
- Git: "Portable" version from git-scm.com works without admin.
- If nothing works: tell the student to ask the teacher — don't try to bypass computer restrictions.
