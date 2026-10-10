# File templates (Mode 2 & 6)

Translate all headings and text into the student's language (Uzbek Latin by default for Uzbek speakers). Keep tool names in English. Fill every `<…>` from the interview. Delete sections that truly don't apply (e.g. "Accounts" for a static site) rather than writing "N/A".

---

## TZ.md

```markdown
# <Project name> — TZ (texnik topshiriq)

> <One-sentence pitch: what it is, for whom, what problem it solves.>

**Author:** <student name> · **Date:** <YYYY-MM-DD> · **Type:** <Website / Web app / Telegram bot / Bot + website>

## 1. Problem and who it's for
<2–4 sentences. Who the first user is, what they struggle with today, how this helps.>

## 2. Users and roles
| Who | What they can do |
|---|---|
| <Visitor> | <…> |
| <Admin (me)> | <…> |

## 3. Features — first version (MVP)
Each feature has a simple "done when" check that anyone can test by clicking.

### F1. <Feature name>
- **What:** <one sentence, from the user's view: "A visitor can …">
- **Done when:** <"I open the site on my phone, click X, and see Y.">

### F2. <…>
### F3. <…>

## 4. Later (not in the first version)
- <Parked idea> — <why later, e.g. "needs a registered business for payments">

## 5. Not doing
- <Things explicitly out of scope, so nobody builds them by accident>

## 6. Screens / pages   ← for websites and apps
| Page | What's on it |
|---|---|
| Home `/` | <…> |

## 6. Bot flow   ← for Telegram bots (use instead of / in addition to screens)
| Command / button | Bot answers / does |
|---|---|
| /start | <greeting + main menu buttons> |

<Optional: one full example conversation.>

## 7. What we save (data)
| Thing | Details we save | Who can see / change |
|---|---|---|
| <Order> | <name, phone, product, date, status> | <customer: own only; admin: all> |

## 8. Look and feel
- Mood: <…> · Colours: <…> · Fonts: <default / …>
- Mobile first: <yes/no>
- Content ready: <logo/photos/texts — ready or placeholders>
- Inspiration: <links or names>

## 9. Tech stack (and why, in plain words)
| Tool | Job in this project | Why |
|---|---|---|
| Git + GitHub | Saves every version of the code online | <…> |
| <Netlify / Vercel / Railway> | Puts the project on the internet | <…> |
| <Supabase> | <Database / login / file storage> | <…> |
| <Next.js / HTML / Python + aiogram> | <The language/framework the code is written in> | <…> |

**Accounts to create:** <GitHub, Vercel, Supabase, …>
**Secret keys (never in code, never in chat):** <BOT_TOKEN, NEXT_PUBLIC_SUPABASE_URL, …>

## 10. Project is finished when (demo checklist)
- [ ] It has a live link: <expected: something.vercel.app / bot @name>
- [ ] F1 … works on a phone
- [ ] <…>

## 11. Open questions
- <Anything still unclear — to decide later with the teacher or client>

## Changelog
- <YYYY-MM-DD> — TZ created.
```

---

## PLAN.md

Rules for writing the plan:
- Steps are small (~30–60 min each, 8–15 steps for an MVP).
- Every step ends with something the student can **see** working.
- Each step teaches **one** main concept.
- Step 0 = accounts & tools. A very early step = a live link (even if it only says "Hello").
- Then one feature (F1, F2…) at a time, the most exciting/visible one first where possible.
- Last steps = polish on phone, README, demo.

```markdown
# <Project name> — Build plan

We build step by step. Each step: build → check it works → learn one idea → save (commit).
Say "next step" to your AI helper to continue.

## Step 0 — Setup
- [ ] Create accounts: <list>
- [ ] Install: <VS Code / Git / Node.js or Python / the class's AI tool>
- [ ] Create the project folder and a GitHub repository
**You'll learn:** what a repository is and why we save code on GitHub.
**Check:** you can see your empty repository on github.com.

## Step 1 — <e.g. "Hello, world" live on the internet>
- [ ] <task>
- [ ] <task>
**You'll learn:** <one concept>
**Check:** <what they open/click and see>

## Step 2 — …
```

### Standard step outlines (adapt — don't copy blindly)

**Type A — Static site (Netlify):**
0 setup (GitHub, Netlify, VS Code, Git) → 1 `index.html` "Hello" + push + connect Netlify = live link → 2 page structure (header/sections/footer) → 3 styling with CSS, colours & fonts from TZ → 4 each main section/page from TZ → 5 make it look good on phone → 6 contact form (Netlify Forms) → 7 real content/images → 8 README + demo.

**Type B — Web app (Next.js + Supabase + Vercel):**
0 setup (GitHub, Vercel, Supabase, Node.js, Git) → 1 create Next.js app, push, import to Vercel = live link → 2 layout + pages from TZ with fake data → 3 create Supabase project + first table, show real data on the page (env vars lesson) → 4 add/edit data via a form → 5 login (Supabase Auth, email) → 6 Row Level Security: users only see their own data → 7 remaining features F3… → 8 file uploads if needed → 9 admin view if needed → 10 phone polish, error messages, loading states → 11 README + demo.

**Type C — Telegram bot (Python aiogram + Railway):**
0 setup (GitHub, Railway, Python, Git, BotFather token) → 1 bot replies to /start on your laptop → 2 put it on Railway with BOT_TOKEN variable = works with laptop closed → 3 menu buttons/commands from TZ → 4 conversation flow for F1 (e.g. ordering: ask name → product → confirm) → 5 notify the admin → 6 save data in Supabase (lesson: why the bot forgot everything after restart) → 7 remaining features → 8 scheduled messages if needed → 9 polish texts, errors, /help → 10 README + demo.

**Type D — Bot + website:** do Type C steps 0–6, then Type B steps 1–6 reading the same Supabase tables, then remaining features and demo. (Or reverse if the website is the main product.)

---

## AGENTS.md — "This project" block

The kit's `AGENTS.md` already has the general beginner and safety rules. Replace only the text between the two marker comments with this block (keep the markers):

```markdown
<!-- PROJECT RULES START — the vibe-tz skill fills this in after writing TZ.md -->
## This project

**<Project name>** — <one-sentence pitch>
Type: <Website / Web app / Telegram bot / Bot + website> · Student's language: <Uzbek (Latin) / Russian / English>

Before doing anything, read `TZ.md` (what we build) and `PLAN.md` (where we are). Work only on the first unchecked step unless the student asks for something else.

### Stack (do not add other tools without asking)
<copy the stack table from TZ.md section 9>

### Project-specific rules
- <e.g. "Bot texts are in Uzbek Latin; keep all user-facing strings in texts.py">
- <e.g. "Prices are in so'm; no online payment in v1">
- <e.g. "Admin Telegram chat ID is in the ADMIN_CHAT_ID variable">
<!-- PROJECT RULES END -->
```

## CLAUDE.md

Leave the kit's file as it is — one line, so Claude Code reads the same rules as Codex and Antigravity:

```markdown
@AGENTS.md
```
