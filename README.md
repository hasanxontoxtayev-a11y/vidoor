# Vibe-coding starter kit

This folder is your project. Everything you build will live here.
It works with **Claude Code**, **Codex** and **Antigravity** — use the one your teacher shows you.

## How to start

1. **Unzip** this kit and rename the folder to your project name (for example `my-bakery-bot`).
   Don't delete the hidden folders `.agents` and `.claude` — your AI helper's instructions live there.
   (On Mac press `Cmd + Shift + .` in Finder to see hidden folders. On Windows: View → Show → Hidden items.)
2. **Open the folder in your AI tool:**
   - **Antigravity:** File → Open Folder → pick this folder.
   - **Codex:** open a terminal in this folder and type `codex`.
   - **Claude Code:** open a terminal in this folder and type `claude`.
3. **Type the one command:**

| Antigravity | Codex | Claude Code |
|---|---|---|
| `vibe` | `$vibe` | `/vibe` |

That's all you need to remember. The first time, it finds out which AI tool and computer you have (or asks you), checks your computer, then plans your project with you. Every time after that, type the same command and it continues where you stopped.

You can also just write normally, in Uzbek, Russian or English: *"Keyingi qadam"*, *"Nima qilay?"*, *"Что дальше?"*.

**Open a terminal in a folder:**
- Windows: open the folder in File Explorer, click the address bar, type `cmd`, press Enter.
- Mac: right-click the folder → "New Terminal at Folder".

## Files you'll see after planning

| File | What it is |
|---|---|
| `TZ.md` | Your project plan: what we build, for whom, which features. |
| `PLAN.md` | Step-by-step build roadmap. Steps get ticked ✅ as you finish them. |
| `AGENTS.md` | Rules for the AI helper, so it teaches you instead of just doing everything. All three tools read it. |
| `CLAUDE.md` | One line that tells Claude Code to read `AGENTS.md`. Don't edit it. |
| `.vibe/profile.md` | Your name, language, AI tool and computer, so the AI remembers you. |

## Golden rules

- You decide **what** to build. The AI helps with **how**.
- One small step at a time. Check it works. Then save (commit).
- Errors are normal. Read them calmly with your AI helper.
- Never paste passwords, tokens or API keys into chat.
- Stuck? Ask your teacher and show them your `TZ.md` and `PLAN.md`.

---

## For the teacher

- **Skills:** `vibe` (start command), `vibe-setup` (computer check), `vibe-tz` (interview + build).
- **Where the skills live:** `.agents/skills/` is read by Codex and Antigravity; `.claude/skills/` is read by Claude Code. They are identical copies.
- **Editing a skill:** edit `.agents/skills/…`, then run `sync-skills` to copy it into `.claude/skills/`:
  - Mac/Linux: `bash sync-skills.sh`
  - Windows: `powershell -ExecutionPolicy Bypass -File sync-skills.ps1`
- **Class defaults** (hosting choice, bot language, …) are at the top of `.agents/skills/vibe-tz/references/stack-guide.md`.
- **Instructions every tool reads:** `AGENTS.md`. The vibe-tz skill only rewrites the "This project" part at the bottom.
