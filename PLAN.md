# Vidoor — Qadam-baqadam qurish rejasi (Build plan)

Biz loyihani kichik va tushunarli qadamlar bilan birgalikda quramiz. Har bir qadam: quramiz → natijani ko'zimiz bilan ko'rib tekshiramiz → bitta yangi tushunchani o'rganamiz → o'zgarishlarni saqlaymiz (commit).
Davom etish uchun sun'iy intellekt yordamchingizga **"keyingi qadam"** deb yozishingiz kifoya.

---

## Step 0 — Hisoblar va asboblarni tayyorlash
- [ ] Bepul hisoblarni ochish: **GitHub**, **Vercel** va **Supabase**.
- [ ] Kompyuterni tekshirish: Git, Node.js va Antigravity to'liq tayyor.
- [ ] GitHub-da `vidoor` nomli yangi bo'sh repozitoriy (ombor) yaratish.
**Nimani o'rganasiz:** Repozitoriy (repo) nima va nega dasturchilar o'z kodlarini GitHub-da saqlaydi.  
**Qanday tekshirasiz:** `github.com` saytida o'zingizning yangi `vidoor` repozitoriyangizni ko'rasiz.

---

## Step 1 — "Salom Vidoor" sahifasini internetda jonli e'lon qilish
- [ ] Next.js va Tailwind CSS yordamida Vidoor loyihasining boshlang'ich poydevorini qurish.
- [ ] Yashil va Oranje ranglar bilan chiroyli "Vidoor — YouTube Blogerlar Yordamchisi" deb yozilgan bosh sahifani chiqarish.
- [ ] Kodni GitHub-ga saqlash va Vercel-ga ulab internetda jonli ishga tushirish.
**Nimani o'rganasiz:** Deploy nima va qanday qilib o'z kompyuteringizdagi kod butun dunyoga ko'rinadigan veb-saytga aylanadi.  
**Qanday tekshirasiz:** Brauzerda shaxsiy `vidoor.vercel.app` havolangizni ochib, sayt ishlayotganini ko'rasiz.

---

## Step 2 — Bosh sahifa va qulay boshqaruv paneli (Dashboard UI)
- [ ] Qidiruv maydoni: YouTube kanalining linkini yoki nomini kiritish paneli.
- [ ] Yashil va oranje ranglar uyg'unligidagi zamonaviy kartalar, menyular va tugmalar.
- [ ] Namuna (mock) sifatida bitta kanalning chiroyli statistikasini ekranga chiqarish.
**Nimani o'rganasiz:** Komponentlar nima va zamonaviy veb-sahifa qanday qismlarga bo'linadi.  
**Qanday tekshirasiz:** Saytda kanal qidirish maydoniga nom yozib ko'rasiz va chiroyli dizayndagi natija kartalarini ko'rasiz.

---

## Step 3 — Kanal tahlilchisi (Analitika: vaqtlar, davomiylik, RPM va daromad)
- [ ] YouTube kanallari ma'lumotlarini tahlil qilish funksiyasini ulash.
- [ ] Videolar asosan qaysi soatlarda yuklanishi va necha daqiqalik ekanligini hisoblash.
- [ ] Kanal yo'nalishi (niche) bo'yicha taxminiy **RPM** (1000 ko'rish narxi) va oylik daromad kalkulyatorini chiqarish.
- [ ] AI xulosa va tavsiya blokini qo'shish (Gemini orqali).
**Nimani o'rganasiz:** API (Application Programming Interface) nima va u orqali qanday qilib ma'lumotlar olinadi.  
**Qanday tekshirasiz:** Haqiqiy YouTube kanal linkini kiritasiz va uning soatlari, RPM va AI tavsiyalari chiqadi.

---

## Step 4 — Supabase ma'lumotlar bazasi va kanallarni saqlash
- [ ] Supabase-da `vidoor` loyihasini ochish va ma'lumotlar bazasini ulash.
- [ ] Maxfiy kalitlarni `.env.local` fayliga xavfsiz joylashtirish.
- [ ] Bloger tahlil qilgan muhim kanallarini "Saqlash" tugmasi orqali eslab qolish tizimini qurish.
**Nimani o'rganasiz:** Ma'lumotlar bazasi (Database) nima va maxfiy kalitlarni nima uchun ehtiyot qilish kerak.  
**Qanday tekshirasiz:** Kanalni "Saqlash"ni bosasiz, saytni yangilasangiz ham u saqlanganlar ro'yxatida turadi.

---

## Step 5 — Foydalanuvchi hisobi (Email va Parol bilan kirish)
- [ ] Supabase Auth orqali ro'yxatdan o'tish va tizimga kirish sahifasini qurish (`/auth`).
- [ ] Har bir bloger faqat o'zi saqlagan ma'lumotlarni ko'rishi uchun xavfsizlik (Row Level Security) qoidalarini yoqish.
**Nimani o'rganasiz:** Autentifikatsiya nima va foydalanuvchilar parollari qanday himoyalanadi.  
**Qanday tekshirasiz:** Yangi email va parol bilan ro'yxatdan o'tasiz, tizimga kirasiz va chiqasiz.

---

## Step 6 — Mening kanalim: shaxsiy kanal tahlili (Retention va ko'rishlar)
- [ ] Bloger o'z YouTube kanalini profiliga ulashi uchun qulay bo'lim yaratish.
- [ ] O'z videolarining tomoshabinlar tomonidan ko'rilish davomiyligi (retention) va yuklash soatlari samaradorligini ko'rsatish.
- [ ] Blogerga o'z kanalini o'stirish bo'yicha shaxsiy AI tavsiyalarini chiqarish.
**Nimani o'rganasiz:** Foydalanuvchiga moslashgan shaxsiy panel (User Dashboard) qanday ishlaydi.  
**Qanday tekshirasiz:** O'z kanalingiz sahifasiga kirib, videolaringizning tahlili va AI maslahatlarini ko'rasiz.

---

## Step 7 — Izohlar (kommentlar) va do'stona AI javoblar
- [ ] Ulangan kanaldagi videolarga kelgan yangi izohlarni bir joyda ro'yxat qilib ko'rsatish.
- [ ] Izoh qaysi tilda (o'zbek, rus, ingliz) yozilgan bo'lsa, o'sha tilda do'stona va samimiy AI javob matnini generatsiya qilish.
- [ ] Bitta tugma bilan javobni tasdiqlash yoki to'liq avtomatik javob berish rejimini yoqish (ON/OFF).
**Nimani o'rganasiz:** Katta til modellari (LLM / AI) orqali matnlarni tahlil qilish va avtomatlashtirish.  
**Qanday tekshirasiz:** Izoh yonidagi "AI javob" tugmasini bosasiz va do'stona tayyor javobni ko'rasiz.

---

## Step 8 — Saytni sinovdan o'tkazish, pardozlash va Demo! 🎉
- [ ] Sayt dizayni va tugmalarini to'liq tekshirish (kompyuter va telefon ekranlarida).
- [ ] Loyiha haqida tushunarli `README.md` qo'llanmasini yozish.
- [ ] Jonli havolani ochib, barcha imkoniyatlarni o'qituvchi va do'stlarga ko'rsatish (Demo)!
**Nimani o'rganasiz:** Tayyor loyihani taqdim qilish, xatolarni tekshirish va birinchi foydalanuvchilarni jalb qilish.  
**Qanday tekshirasiz:** Tayyor va chiroyli Vidoor platformangiz internetda xatosiz ishlayotganini ko'rasiz.
