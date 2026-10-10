# Stack guide (Modes 2 & 3)

## Teacher settings — edit these to match your class

```
CLASS_TOOLS:        Git, GitHub, Netlify, Vercel, Supabase, Railway, Telegram BotFather
WEB_FRAMEWORK:      Next.js (TypeScript) + Tailwind CSS
STATIC_SITE:        plain HTML + CSS + JavaScript (no framework)
STATIC_HOSTING:     Netlify            # or Vercel — pick one so the class is consistent
APP_HOSTING:        Vercel
DATABASE_AUTH:      Supabase
BOT_LANGUAGE:       Python + aiogram 3 # alternative: Node.js + grammY
BOT_HOSTING:        Railway
AI_CODING_TOOLS:    Claude Code, Codex, Antigravity   # any of these works with this kit
```

If a setting here conflicts with the rules below, the setting wins.

Plans and free limits of these services change. Don't promise "free forever"; if a student asks about cost, say the service has a free or trial tier for learning and suggest they check with the teacher. Railway in particular may need a paid plan after the trial.

---

## Step 1 — Pick the project type

Ask yourself these questions from the interview answers, in order:

1. Is it a Telegram bot? → **Type C** (or **D** if it also needs a website/admin panel/Mini App).
2. Does anything need to be saved, or do people log in? → **Type B**.
3. Does something need to run all the time on its own (scheduled jobs, a scraper, a long-running server, live chat over websockets)? → add **Railway** to whatever type it is (**Type E**).
4. Otherwise → **Type A**.

## Project types

### Type A — Static website
Examples: portfolio, CV site, landing page, restaurant menu, event page, school club page.
- **Code:** HTML + CSS + JavaScript. (Upgrade to Next.js only if it grows past ~5 pages or needs reusable parts.)
- **Code home:** GitHub repository.
- **Hosting:** Netlify (connect the GitHub repo → auto-deploys on every push). Vercel works the same way.
- **Contact form without a database:** Netlify Forms (just add `data-netlify="true"` to the form) — the messages appear in the Netlify dashboard.
- **Accounts needed:** GitHub, Netlify.
- **Plain reason:** "Your site only shows information, so it doesn't need a database — the simplest setup is fastest to learn and to launch."

### Type B — Web app with accounts and data
Examples: booking system, to-do/habit tracker, blog with admin, small shop with orders, school marketplace, quiz platform.
- **Code:** Next.js (App Router, TypeScript) + Tailwind CSS.
- **Database, login, file uploads:** Supabase (Postgres database, Auth, Storage).
- **Code home:** GitHub. **Hosting:** Vercel (connect repo → auto-deploy).
- **Secrets:** Supabase URL + publishable/anon key in `.env.local` locally and in Vercel → Project → Settings → Environment Variables. The service-role key is only ever used on the server, never in browser code.
- **Security:** turn on Row Level Security for every table and write policies like "users can only see their own rows".
- **Accounts needed:** GitHub, Vercel, Supabase.
- **Plain reason:** "Your app must remember things and know who is who. Supabase is the notebook and the doorman; Vercel shows the app to the world."

### Type C — Telegram bot
Examples: shop/order bot, quiz bot, reminder bot, FAQ bot for a school, AI assistant bot.
- **Code:** Python + aiogram 3 (default) using **long polling** (simplest — no webhook or domain needed).
- **Get a token:** @BotFather in Telegram → `/newbot`.
- **Code home:** GitHub. **Hosting:** Railway (deploy from GitHub repo; set `BOT_TOKEN` in Railway → Variables). Railway runs it 24/7 so the bot answers when the laptop is closed.
- **Saving data:** if the bot must remember things (orders, users, scores), add Supabase. For a tiny learning bot, a simple in-memory list is fine at first, then move to Supabase as a lesson ("why did the bot forget everything after restart?").
- **Scheduled messages:** aiogram + APScheduler inside the same Railway service.
- **Accounts needed:** GitHub, Railway, Telegram (BotFather); Supabase if saving data.
- **Plain reason:** "A bot has to listen for messages day and night. Railway is a computer in the cloud that never sleeps."

### Type D — Bot + website / admin panel / Mini App
- Bot = Type C on Railway. Website or admin panel = Type B on Vercel. **Both talk to the same Supabase database** — that's how they share data.
- Telegram Mini App = a Next.js page on Vercel opened from a bot button.
- Build order: bot first (quick win), then the website. Or website first if the website is the main product. Decide with the student.

### Type E — Always-running backend
Scrapers, scheduled jobs, websockets/live chat, a separate API server, background workers.
- Host on **Railway**. Keep the web front-end on Vercel/Netlify.
- Use only when the student's idea really needs it; most beginner ideas don't.

---

## Common add-ons

| Need | How |
|---|---|
| AI features (chat, text, images) | Call the AI provider's API **from the server only** (a Next.js route handler, or inside the bot). API key in env variables. Never in browser code. |
| Image/file uploads | Supabase Storage bucket + policies. |
| Login with Google | Supabase Auth → Google provider (needs a Google Cloud OAuth setup — a good later step, email login first). |
| Email notifications | Later. Simple option: send a Telegram message to the owner instead. |
| Admin notified of new orders | Bot sends a message to the admin's Telegram chat ID. Works even for website projects. |
| Multiple languages | Simple dictionary file per language at first. |
| Custom domain (`name.uz`) | Later. Add in Vercel/Netlify domain settings once the student owns a domain. |
| Card payments (Click, Payme, Stripe…) | **Later only** — needs a registered business and merchant contract. v1: show prices, collect orders, pay offline. Telegram Stars is an option for digital goods in bots. |

## What NOT to add for beginners

Docker, Kubernetes, separate microservices, self-built auth, GraphQL, Redux, many libraries "just in case". If it's not in the TZ, it's not in the code.

## Every project, always

- Git from the first step; commit after each plan step; push to GitHub.
- `.gitignore` contains `.env`, `.env.local`, `node_modules`, `__pycache__`, `.venv`.
- A `README.md` with what the project is and the live link.
- Get a live link early (Step 1 or 2), then every push updates it.
