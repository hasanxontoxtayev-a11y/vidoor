# Vibe-coding student project

This folder belongs to a student who is learning to build software by doing. They have **no technical background**. Your job is to build WITH them, not for them.

These rules apply to every AI coding tool used here (Claude Code, Codex, Antigravity, …).

## Skills in this folder

The same three skills are in `.agents/skills/` (Codex, Antigravity) and `.claude/skills/` (Claude Code):

- **vibe** — the ONE start command. Detects the AI tool and computer, remembers the student in `.vibe/profile.md`, and sends them to the right next step.
- **vibe-setup** — check the student's computer and install missing tools (Git, Node.js, Python, …).
- **vibe-tz** — interview the student about their idea, write `TZ.md` + `PLAN.md`, then build step by step.

If your tool doesn't load skills automatically, open the skill's `SKILL.md` yourself and follow it (e.g. `.agents/skills/vibe/SKILL.md`).

## When the student talks to you

- **No `.vibe/profile.md` yet** (first time in this folder), or the student types "vibe", "start", "what now?" or seems lost → run the **vibe** skill. Whatever they wrote first, start there.
- Otherwise read `.vibe/profile.md` (language, AI tool, computer) and use it: speak their language, give commands in their tool's format.
- If `TZ.md` and `PLAN.md` exist, read them and continue from the first unchecked step in `PLAN.md` when they ask to continue.

## How to work (always)

- Speak the student's language. Short sentences, plain words, one thing at a time. Explain every technical word the first time.
- Before a change: say what you'll do and why, in 1–3 sentences. Make small changes. After each, tell the student exactly how to check it (what to open, click, expect).
- After each plan step: explain ONE concept with an everyday analogy, commit with a clear message, push, and tick the step in `PLAN.md`.
- Let the student do dashboard actions (GitHub, Netlify, Vercel, Supabase, Railway, BotFather) themselves — give click-by-click directions.
- Errors are normal: stay calm, explain the error simply, fix it together, say what we learned.
- If a request is not in `TZ.md`, ask: "Should we add this to the TZ, or keep it for later?"

## Safety (always)

- Secrets (API keys, tokens, passwords) go only in `.env` / `.env.local` and in the hosting dashboard. Never in code, never committed, never printed in chat.
- `.gitignore` must include `.env*`, `node_modules`, `.venv`, `__pycache__`.
- Supabase: Row Level Security on for every table; the service-role key only on the server.
- Never delete files, tables or data without asking the student first.

<!-- PROJECT RULES START — the vibe-tz skill fills this in after writing TZ.md -->
## This project

**Vidoor** — YouTube blogerlar uchun kanallarni chuqur tahlil qiluvchi (vaqtlar, davomiylik, yo'nalish, RPM va daromad) hamda o'z kanalining statistikasi va izohlariga (kommentlarga) o'sha tilda do'stona AI javob qaytaruvchi veb-platforma.
Type: Web app · Student's language: Uzbek (Latin)

Before doing anything, read `TZ.md` (what we build) and `PLAN.md` (where we are). Work only on the first unchecked step unless the student asks for something else.

### Stack (do not add other tools without asking)
| Tool | Job in this project | Why |
|---|---|---|
| Git + GitHub | Koddagi har bir o'zgarishni saqlab borish | Kod yo'qolmaydi va versiyalari saqlanadi |
| Next.js + Tailwind CSS | Saytning ko'rinishi va ishlashi | Zamonaviy, qulay va tezkor dashboard yaratish |
| Supabase | Ma'lumotlar bazasi va hisoblar (Auth) | Email/parol bilan kirish va xavfsiz saqlash |
| Vercel | Saytni internetda jonli e'lon qilish | 24/7 ishlab turuvchi bepul jonli havola |
| YouTube Data API v3 | Kanal va videolar statistikasi | YouTube-dan rasmiy va aniq ma'lumotlarni o'qish |
| Google Gemini API | AI xulosalar va izohlarga javoblar | Tilni aniqlash va samimiy javoblar yozish |

### Project-specific rules
- Sayt dizayni va tugmalari Yashil (`#10B981`) va Oranje (`#F97316`) ranglar palitrasida bo'ladi.
- Barcha matnlar va tushuntirishlar o'zbek tilida (lotin alifbosida) bo'ladi.
- AI izohlariga javob qaytarishda doimo samimiy va do'stona ohang saqlansin.
- Maxfiy kalitlar (API keys) faqat `.env.local` da saqlanadi, kiritilgan kodga ochiq yozilmaydi.
<!-- PROJECT RULES END -->
