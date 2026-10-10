---
name: vibe-setup
description: Audits the student's computer (Windows, macOS or Linux) for everything needed to vibe-code — Git, Node.js, npm, Python, pip, the AI coding tool (Claude Code / Codex / Antigravity), VS Code and the GitHub/Vercel/Netlify/Supabase/Railway command-line tools — shows a clear table of what they have and what's missing, then installs the missing pieces step by step with the student's OK. Use whenever a student runs /vibe-setup or $vibe-setup, asks "is my computer ready?", "check my computer", "what do I need to install", gets "command not found" / "is not recognized" errors for node, npm, git, python or pip, or is about to start Step 0 of their PLAN.md.
---

# Vibe Setup — check and prepare the student's computer

The student has no technical background. Installing tools is often the scariest part of learning to code, so make it calm, visual and step by step. Speak in the student's language (read it from `.vibe/profile.md` if it exists; otherwise match how they write — Uzbek Latin, Russian or English). Short sentences, explain each tool in a few words.

## Step 1 — Run the audit

The audit scripts are in this skill's `scripts/` folder. They only **look**; they never install or change anything, so it's safe to run them straight away.

Pick by computer:
- **macOS, Linux, or Windows with Git Bash:** `bash "<this skill's folder>/scripts/check_env.sh"`
- **Windows without Git Bash (PowerShell):** `powershell -NoProfile -ExecutionPolicy Bypass -File "<this skill's folder>\scripts\check_env.ps1"`

If you're unsure which computer it is, try the bash one first; if `bash` doesn't exist, use the PowerShell one.

If the student is not in an environment where you can run commands (e.g. plain chat), give them the right command to paste into their terminal and ask them to paste back the result.

## Step 2 — Show the table

Show the result as a table in the student's language, with a short heading like "Here's what your computer has:". Keep the tool names in English, translate the "Needed for" and "Status" words.

Add a column **"For your project?"** if `TZ.md` exists in the project folder — read its stack section and mark what this project actually needs:
- Website only (Netlify/Vercel, no Python) → Python and pip are "not needed now".
- Telegram bot → Node.js is still useful (for npx tools), Python is required.
- Command-line tools (Vercel/Netlify/Railway/Supabase CLI) are **optional** — the class deploys through the websites' dashboards. Only recommend one if the TZ or teacher needs it.

**AI tool rows:** the student only needs one AI coding tool. If they're talking to you from inside Antigravity, Codex or Claude Code, that tool is obviously installed — mark it ✅ in the table yourself even if the script couldn't detect it (Antigravity is a desktop app, so the script doesn't look for it). Never push them to install a second AI tool.

Then one line of summary: "You have X of Y required tools. Missing: …"

If everything required is ✅, celebrate briefly and point to the next step (usually "Now let's plan your project with the vibe-tz skill" or "Say 'next step' to continue your PLAN.md").

## Step 3 — Ask before installing

List what you'd install, in order, with one plain sentence each ("Node.js — lets your computer run websites you build"). Ask once: "Shall I install these now?" Use a multiple-choice question tool if available (Install all / Let me choose / Not now).

Install order matters: **Git → Node.js → Python → Git name & email → optional tools**. (npm comes with Node.js; pip comes with Python.)

## Step 4 — Install one by one

Use `references/install-commands.md` for the exact command per computer type. For each tool:

1. Say what you're installing.
2. Run the command — or, if it's marked 🔐 (needs a password/admin), ask the student to paste it into their **own terminal window**, because you can't type their password. Tell them a password typed in a terminal shows no dots — that's normal.
3. Tell the student about any pop-up they may see (e.g. Windows "allow changes?" → click Yes).
4. Check it worked (`node --version` etc.). If the command isn't found right after installing, that's usually because the terminal needs reopening — explain, and ask them to close and reopen the terminal (and restart their AI tool if it runs in that terminal), then run the vibe-setup check again.

For **Git name & email**: ask the student which name and email to use (the same email as their GitHub account is best), then set them.

If an install fails: read the error, explain it in one or two plain sentences, try the alternative in the guide. If it still fails, or the computer doesn't allow installs (school/office computer without admin rights), stop and tell the student to show the table to the teacher. Never try to get around computer restrictions.

## Step 5 — Final table

Run the audit again and show the updated table. If `.vibe/profile.md` exists, update its `Computer check:` line (e.g. `done 2026-10-12 — all core tools OK`, or list what's still missing). End with what's next: "Your computer is ready! Next: let's plan your project (vibe-tz)" (or continue their PLAN.md if one exists, and tick its setup item).

## Rules

- Only install from the official sources listed in the guide. Never use random scripts from the internet.
- Never uninstall, downgrade or replace a tool the student already has without asking. If a version is too old, explain and ask before upgrading.
- Don't change system or security settings beyond what the guide lists (e.g. the PowerShell execution policy for the current user), and only after the student agrees.
- Don't install optional tools "just in case".
- Never ask for or handle passwords — the student types them in their own terminal.
