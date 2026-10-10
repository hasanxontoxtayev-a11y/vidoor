# Question bank (Mode 1 — Grill)

Ask in the student's language, one question per message. You don't need every question — skip what's already clear, and go deeper where answers are vague. The **[decides]** note says what the answer tells you (for you, not the student).

Order: Idea → People → Must-haves → Screens/flow → Data & accounts → Extras → Look → Wrap-up.

---

## 1. The idea

- "In one sentence: what do you want to build, and what problem does it fix?"
  - Follow-up if vague: "Imagine it's finished. Someone uses it for the first time — what happens?"
- "What will it be?" — options:
  - A website people visit (like a shop page, portfolio, school site)
  - An app where people log in and do things (like a booking system, to-do list, mini social network)
  - A Telegram bot
  - A Telegram bot + a website/admin panel
  - Not sure — help me decide
  **[decides]** project type (see stack-guide.md).
- "Is this for a real person or business, or a practice project for you?"
  **[decides]** how real the content needs to be; whether a real client will give feedback.
- "Is there an app or site that's a bit like your idea? What do you like about it, and what would you do differently?"

## 2. People

- "Who is the very first person who will use it? Describe them." (age, job, where they are, phone or computer)
- "Are there different kinds of users?" — options:
  - Just one kind (everyone sees the same thing)
  - Visitors + me as the owner/admin who adds content
  - Two sides (e.g. sellers and buyers, teachers and students)
  **[decides]** roles, whether an admin panel is needed.
- "Will they mostly use a phone or a computer?" **[decides]** mobile-first design.

## 3. Must-haves (the MVP)

- "List everything you dream it could do. Don't hold back." (Let them brainstorm — then sort together.)
- "If it could only do THREE things on launch day, which three?" → these become MVP; the rest goes to "Later".
- For each must-have: "How will we know it works? Describe what you click and what you see."
  **[decides]** acceptance checks for the TZ.
- Push back gently on scope: "That's a great feature — it's big, so let's put it in 'Later' and finish the core first. OK?"

## 4. Screens / flow

**Website or app:**
- "What pages do you imagine?" Offer typical ones for their type, e.g. Home, About, Products/Services, Contact, Login, Profile, Admin.
- "When someone opens the site, what's the first thing they should see and do?"
- "Walk me through one person's journey from opening the site to finishing what they came for."

**Telegram bot:**
- "When someone presses /start, what should the bot say?"
- "What buttons or commands should it have?" (offer: menu buttons, /help, /order, /settings…)
- "Walk me through one full conversation with the bot."
- "Should the bot message people on its own (reminders, news), or only answer?" **[decides]** scheduled jobs.
- "Should you (the owner) get a message when something happens, e.g. a new order?"

## 5. Data & accounts

Ask about behaviour, never "do you need a database?".

- "Does anything need to be remembered after the person leaves?" — options:
  - No, it just shows information
  - Yes — things people send (messages, orders, bookings, comments)
  - Yes — things I add (products, posts, events)
  - Both
  **[decides]** Supabase or not.
- "What details do we save about one [order / product / booking]?" (help them list fields: name, price, photo, date…)
- "Should people create an account and log in?" — options:
  - No, anyone can use it
  - Yes, with email
  - Yes, with Google
  - Only I (the admin) log in
  **[decides]** Supabase Auth, roles.
- "Can people upload pictures or files?" **[decides]** Supabase Storage.
- "Who is allowed to see or change what?" (e.g. "Can a customer see other customers' orders?") **[decides]** Row Level Security rules.

## 6. Extras / connections

Ask only the relevant ones:
- "Should people pay money inside it?" → explain gently that real payments need a registered business and contracts, so v1 shows prices and takes orders; payment comes "Later". (For bots, Telegram Stars can be mentioned as a later option for digital goods.)
- "Should it use AI (chatbot, image generation, text writing)?" **[decides]** AI API call from server side; needs an API key.
- "A map? Sending emails? Notifications to Telegram?"
- "Should it work in several languages (Uzbek / Russian / English)?"
- "Does it need its own address like `myshop.uz`, or is a free address like `myshop.vercel.app` fine for now?" (Custom domain → Later unless they already own one.)

## 7. Look & feel

- "Pick a mood:" — options: Clean & minimal / Bright & playful / Dark & modern / Classic & serious
- "Any colours you love or must use (brand colours)?"
- "Do you have a logo, photos, texts ready? Or should we use placeholders for now?"
- "Show me a site whose look you like (a link or name)."

## 8. Wrap-up

- "What's your deadline or goal date? (a demo day, a client meeting…)"
- "How will you know the project is a success?" (e.g. "my uncle's shop gets orders through it")
- Final summary → "Shall I write your TZ now?"

---

## Handling tricky answers

| Student says | You do |
|---|---|
| "I don't know" | Offer 2–3 concrete options with a short example for each. |
| "Like Instagram / Uber / Amazon" | "Which ONE part matters most?" Build that part only. |
| "Everything is important" | "If launch was tomorrow and only 3 things worked, which 3?" |
| Uses a tech word they don't understand | Gently explain it and ask the behavioural version instead. |
| Idea is huge (marketplace with payments, delivery tracking, chat…) | Praise it, then carve out a small first slice that's still useful and exciting. |
| Idea might be unsafe or illegal (scraping private data, gambling, cheating tools) | Say kindly that this direction isn't OK and help find a similar legal idea. |
