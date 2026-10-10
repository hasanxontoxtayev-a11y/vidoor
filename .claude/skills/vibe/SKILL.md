---
name: vibe
description: The single start command of the vibe-coding student kit. Detects which AI tool the student is using (Antigravity, Codex or Claude Code) and their computer, asks if it can't tell, remembers it in .vibe/profile.md, shows the exact commands for that tool, and sends the student to the right next step — computer check, project interview (TZ), or the next build step. Use whenever the student types "vibe", "/vibe", "$vibe", "start", "boshlash", "boshla", "начать", "help", "what now?", "nima qilay?", opens this kit for the first time, or seems lost about what to do next.
---

# Vibe — the one start command

The student types **one word** — `vibe` — and you figure out the rest. They have no technical background, so they should never need to remember more than this.

## Step 1 — Look around (silently)

Run the detection script from this skill's `scripts/` folder, in the project root (the folder with `AGENTS.md`). It only reads; it changes nothing.

- macOS / Linux / Git Bash: `bash "<this skill's folder>/scripts/detect.sh"`
- Windows PowerShell: `powershell -NoProfile -ExecutionPolicy Bypass -File "<this skill's folder>\scripts\detect.ps1"`

It reports: computer, `ai_tool`, whether `.vibe/profile.md`, `TZ-draft.md`, `TZ.md`, `PLAN.md` exist, and how many plan tasks are done.

If you can't run commands, skip the script and use what you know (Step 2).

## Step 2 — Find out the AI tool

Work out which tool you are running in, in this order:

1. `.vibe/profile.md` already says it → use that (but if the script detects a *different* tool now, the student switched — ask once and update).
2. You know which product you are (Claude Code, Codex, Antigravity) → trust that.
3. The script's `ai_tool` line names one → use it.
4. Still unsure → ask, with options: **Antigravity / Codex / Claude Code / Something else**.

If it's "something else" (Cursor, Gemini CLI, …): the kit still works — tell the student to type `vibe` or describe what they want in normal words; skills may need to be opened by name ("follow `.agents/skills/vibe-tz/SKILL.md`").

## Step 3 — First time only: meet the student

If `.vibe/profile.md` does not exist:

1. Greet them warmly. Detect their language from how they wrote (Uzbek Latin, Russian, English); if they only typed "vibe", ask in Uzbek with Russian and English options: "Qaysi tilda gaplashamiz? / На каком языке? / Which language?"
2. Ask their first name (optional — "or skip").
3. Confirm what you detected in one line: "I see you're on **Windows** using **Codex** — right?" Fix it if they say no.
4. Create `.vibe/profile.md`:

```markdown
# Student profile (used by the vibe skills — you can edit this)
- Name: <name or "—">
- Language: <Uzbek (Latin) / Russian / English>
- AI tool: <Antigravity / Codex / Claude Code / other>
- Computer: <Windows 11 / macOS 15 / Ubuntu 24.04 …>
- Computer check: not done yet
- Started: <YYYY-MM-DD>
```

This file has no secrets and is fine to commit to Git.

## Step 4 — Show "your commands"

Show a small card for **their tool only** (don't show the other tools — it confuses beginners). Translate the left column to their language.

| What you want | Antigravity | Codex | Claude Code |
|---|---|---|---|
| Start / "what now?" | type `vibe` | type `$vibe` | type `/vibe` |
| Check my computer | type `vibe-setup` | `$vibe-setup` | `/vibe-setup` |
| Plan my project (TZ) | type `vibe-tz` | `$vibe-tz` | `/vibe-tz` |
| Next build step | type `next step` | `next step` | `next step` |
| Explain a word | `what is …?` | `what is …?` | `what is …?` |

Add: "You can also just write normally — in your own language. I'll understand." Show this card on the first run, and later only if they ask or seem lost.

## Step 5 — Route to the next thing

Pick the first that applies, say it in one sentence, and ask "Shall we start?" before continuing:

1. **Computer check not done** (profile says "not done yet") → run the **vibe-setup** skill. When it finishes, update the profile line to `Computer check: done <date> — all core tools OK` (or list what's still missing).
2. **`TZ-draft.md` exists** → "We paused your project interview — let's continue." Run **vibe-tz** (it resumes from the draft).
3. **No `TZ.md`** → "Let's plan your project." Run **vibe-tz** (grill mode).
4. **`PLAN.md` has unchecked tasks** → show progress ("You've done 7 of 23 tasks — great!"), name the next step from `PLAN.md`, then run **vibe-tz** in build mode for that step.
5. **Everything in `PLAN.md` is ticked** → celebrate properly 🎉, show their live link, then offer: polish, or pick a feature from the "Later" list in `TZ.md` (vibe-tz change-idea mode adds new steps).

If a skill doesn't load automatically in this tool, open its `SKILL.md` from `.agents/skills/<name>/` (or `.claude/skills/<name>/`) and follow it.

## Every later run

When `.vibe/profile.md` exists: skip the questions, greet the student by name in their language, give the one-line progress status, and route (Step 5). Keep it to 2–4 short lines before the next action.

## Rules

- Never ask technical questions. The student only chooses things they understand (language, tool, "shall we start?").
- One question per message.
- Don't install or change anything in this skill — installing belongs to vibe-setup, building to vibe-tz.
