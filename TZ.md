# Vidoor — TZ (texnik topshiriq)

> YouTube blogerlar uchun kanallarni chuqur tahlil qiluvchi (video soatlari, davomiyligi, yo'nalishi, RPM va daromadi, AI tavsiyalar) hamda o'z kanalining statistikasi va izohlariga (kommentlarga) o'sha tilda do'stona AI javob qaytaruvchi veb-platforma.

**Muallif:** Khan · **Sana:** 2026-10-11 · **Turi:** Web app (Veb-ilova)

---

## 1. Muammo va bu kim uchun

Yangi va o'sayotgan YouTube blogerlar ko'pincha quyidagi qiyinchiliklarga duch kelishadi:
- Muvaffaqiyatli kanallar videolarni qaysi soatlarda yuklaydi, necha daqiqalik videolar chiqaradi va ularning yo'nalishida (niche) qancha daromad (RPM) borligini aniqlash qiyin.
- O'z kanallaridagi videolarni tomoshabinlar qancha vaqt ko'rayotgani (retention) va qachon yuklash yaxshiroq ekanini tahlil qilish vaqt oladi.
- Videolarga har xil tillarda kelayotgan yuzlab izohlarga (kommentlarga) o'z vaqtida, do'stona javob qaytarishga ulgurishmaydi.

**Vidoor** — bu blogerning shaxsiy tahlilchisi va AI yordamchisiga aylanadi: kompyuter orqali qulay boshqaruv panelida ham o'z kanalini, ham raqobatchilarni tahlil qilish va barcha izohlarga avtomatik/yordamchi tarzda do'stona javob qaytarish imkonini beradi.

---

## 2. Foydalanuvchilar va rollar

| Kim | Nima qila oladi |
|---|---|
| **Mehmon (Guest)** | Saytga kirib, ro'yxatdan o'tmasdan ham istalgan YouTube kanal linkini kiritib, qisqacha tahlilni ko'ra oladi. |
| **Bloger / Foydalanuvchi** | Email va parol bilan kiradi, o'z kanalini ulaydi, o'z kanalining chuqur tahlili va retention ma'lumotlarini ko'radi, izohlarga AI orqali (qo'lda yoki avtomat) do'stona javob beradi, raqobatchi kanallarni va ularning RPM/daromadini tahlil qilib, saqlab qo'yadi. |

---

## 3. Asosiy imkoniyatlar — 1-versiya (MVP)

### F1. Boshqa kanallarni chuqur tahlil qilish (Kanal Analitikasi)
- **Nima:** Foydalanuvchi istalgan YouTube kanal linkini yoki nomini kiritadi.
- **Ko'rsatiladigan ma'lumotlar:**
  - Videolar yuklanadigan asosiy vaqtlar (soatlar va haftaning kunlari).
  - Videolarning o'rtacha davomiyligi (necha daqiqa) va eng ko'p ko'rilgan top videolar.
  - Kanal yo'nalishi (niche) va ushbu yo'nalish bo'yicha taxminiy **RPM** (1000 ko'rish uchun daromad).
  - Kanalning taxminiy oylik daromadi (daromad kalkulyatori).
  - **AI xulosa va tavsiya:** Masalan: *"Bu kanal asosan soat 18:00 da 10-15 daqiqalik videolar yuklab, moliya mavzusida yuqori RPM bilan muvaffaqiyatga erishgan."*
- **Tekshirish:** Saytda qidiruvga kanal linkini qo'yib, "Analiz qilish" tugmasini bosaman va grafiklar, videolar jadvali, RPM va AI tavsiyani ko'raman.

### F2. O'z kanalini ulash va ichki tahlil
- **Nima:** Bloger o'z YouTube kanalini platformaga ulaydi va o'zining shaxsiy ko'rsatkichlarini ko'radi.
- **Ko'rsatiladigan ma'lumotlar:**
  - Tomoshabinlar videolarning qancha qismini ko'ryapti (tomosha davomiyligi va saqlanishi).
  - O'z kanalidagi eng yaxshi soatlar va eng ommabop videolar.
  - Bloger uchun o'z kanalini o'stirish bo'yicha shaxsiy AI tavsiyalar.
- **Tekshirish:** "Mening kanalim" bo'limiga kiraman va o'z videolarimning tahlili hamda tomoshabinlar faolligini ko'raman.

### F3. Izohlarga (kommentlarga) AI javob qaytarish
- **Nima:** Ulangan kanaldagi barcha videolarga kelgan izohlar ro'yxati va ularga AI javob yozish tizimi.
- **Xususiyatlari:**
  - Izoh yozilgan tilni (o'zbek, rus, ingliz va h.k.) avtomatik aniqlaydi va **aynan o'sha tilda** javob generatsiya qiladi.
  - Javob ohangi: **Doimo do'stona va samimiy** (bloger va obunachi o'rtasidagi iliq munosabat).
  - 2 xil rejim:
    - **Qo'lda tasdiqlash:** AI javobni tayyorlab qo'yadi, bloger "Yuborish" tugmasini bosadi (yoki tahrirlaydi).
    - **To'liq avtomatik rejim:** Yangi izohlar tushishi bilan AI avtomatik javob qaytaradi (yoqish/o'chirish imkoniyati bilan).
- **Tekshirish:** Izohlar ro'yxatida bitta izoh yonidagi "AI javob" tugmasini bosaman, AI o'sha tilda do'stona javob taklif qiladi va uni tasdiqlayman.

### F4. Tahlillar tarixi va sevimli kanallar
- **Nima:** Bloger kuzatib borayotgan raqobatchi kanallarni bitta ro'yxatda saqlab qo'yishi va istalgan payt qayta ko'rishi mumkin.
- **Tekshirish:** Tahlil qilingan kanalni "Saqlash" tugmasi orqali saqlayman va "Saqlanganlar" ro'yxatida ko'raman.

### F5. Foydalanuvchi hisobi (Email va Parol)
- **Nima:** Bloger oddiy email va parol bilan ro'yxatdan o'tadi va o'z shaxsiy hisobiga kiradi.
- **Tekshirish:** Email va parol kiritib yangi hisob ochaman, chiqib yana qayta kiraman.

---

## 4. Keyingi bosqichlar (Later — MVP dan keyin)
- Pullik obunalar va tariflar (Click, Payme, Stripe orqali).
- Bir nechta kanallarni yonma-yon solishtirish (Compare Channels).
- Yangi izohlar kelganda Telegram bot orqali bildirishnoma yuborish.
- Video muqovalari (Thumbnail) dizaynini tahlil qilish.

---

## 5. Hozir qilinmaydigan narsalar (Not doing)
- YouTube-ga to'g'ridan-to'g'ri video yuklash yoki video tahrirlash (Vidoor faqat tahlil va izohlar uchun).
- Noqonuniy nakrutka yoki sun'iy obunachilar qo'shish.
- Murakkab to'lov tizimlari (birinchi bosqichda hamma narsa bepul sinovda ishlaydi).

---

## 6. Sahifalar (Screens & Pages)

| Sahifa | Nima joylashgan |
|---|---|
| **Bosh sahifa `/`** | Vidoor taqdimoti, tezkor kanal qidiruvi (link kiritish), asosiy imkoniyatlar va kirish tugmasi. |
| **Kanal tahlili `/analyze/[id]`** | Tanlangan kanalning to'liq tahlili: yuklash soatlari grafigi, video davomiyligi, top videolar, yo'nalish (niche), taxminiy RPM va oylik daromad, AI xulosasi. |
| **Mening kanalim `/dashboard`** | Blogerning o'z kanali: tomosha vaqti (retention), yuklash soatlari samarasi, shaxsiy o'sish tavsiyalari. |
| **Izohlar boshqaruvi `/comments`** | Barcha kelgan izohlar ro'yxati, avtomatik rejim tugmasi (ON/OFF), AI javob takliflari va yuborish tugmasi. |
| **Saqlangan kanallar `/saved`** | Saqlab qo'yilgan raqobatchi kanallar ro'yxati va ularning o'zgarishlari. |
| **Kirish / Ro'yxatdan o'tish `/auth`** | Oddiy Email va parol orqali tizimga kirish va hisob yaratish formasi. |

---

## 7. Saqlanadigan ma'lumotlar (Data)

| Ma'lumot | Qaysi ustunlar saqlanadi | Kim ko'ra oladi / o'zgartira oladi |
|---|---|---|
| **Users** | id, email, created_at | Faqat foydalanuvchining o'zi |
| **ConnectedChannels** | id, user_id, channel_id, channel_title, auto_reply_enabled, created_at | Foydalanuvchining o'zi |
| **SavedChannels** | id, user_id, channel_id, channel_name, niche, rpm_estimate, created_at | Foydalanuvchining o'zi |
| **CommentReplies** | id, channel_id, comment_id, author_name, comment_text, language, reply_text, status (pending/sent), created_at | Foydalanuvchining o'zi |

---

## 8. Tashqi ko'rinish va dizayn (Look & feel)

- **Ranglar:** 
  - **Yashil** (`#10B981` / `#059669`) — o'sish, muvaffaqiyat, analitika va natijalar.
  - **Oranje (To'q sariq)** (`#F97316` / `#EA580C`) — energiya, YouTube ijodkorligi, chaqiriq tugmalari (CTA).
  - **Fon:** Toza, zamonaviy, ko'zni toliqtirmaydigan fon va aniq kontrastli kartalar.
- **Qurilma:** Asosan **kompyuter/noutbuk** ekraniga moslashgan keng va qulay analitik dashboard (mobil qurilmalarda ham to'g'ri ko'rinadi).
- **Kayfiyat:** Kuchli, professional, tushunarli va do'stona.

---

## 9. Texnologiyalar to'plami (Tech stack)

| Texnologiya | Loyihadagi vazifasi | Nega aynan shu (oddiy so'z bilan) |
|---|---|---|
| **Git + GitHub** | Koddagi har bir o'zgarishni saqlab borish | Kod hech qachon yo'qolmaydi va versiyalari saqlanadi. |
| **Next.js (TypeScript) + Tailwind CSS** | Saytning ko'rinishi va ishlashi | Tezkor, chiroyli va qulay zamonaviy veb-ilova yaratish uchun. |
| **Supabase** | Ma'lumotlar bazasi va hisoblar (Auth) | Email va parol bilan kirishni oson ta'minlaydi va bloger ma'lumotlarini xavfsiz saqlaydi. |
| **Vercel** | Saytni internetda jonli e'lon qilish | Sayt doimo 24/7 ishlab turadi va bepul havola beradi. |
| **YouTube Data API v3** | Kanal va videolar statistikasini olish | YouTube-dan rasmiy va aniq ma'lumotlarni o'qish uchun. |
| **Google Gemini API** | Sun'iy intellekt xulosalari va izoh javoblari | Tilni aniqlash, samimiy javoblar yozish va kanal tavsiyalarini berish uchun. |

**Ochiladigan hisoblar:** GitHub, Vercel, Supabase.  
**Maxfiy kalitlar:** `.env.local` faylida saqlanadi, hech qachon ochiq ko'rsatilmaydi.

---

## 10. Loyiha qachon tayyor hisoblanadi (Demo tekshiruvi)

- [ ] Jonli havola mavjud: `vidoor.vercel.app` (yoki Vercel bergan link).
- [ ] Email va parol bilan ro'yxatdan o'tish va kirish ishlaydi.
- [ ] Har qanday kanal linki kiritilganda uning vaqtlari, davomiyligi, yo'nalishi (niche), RPM va daromadi chiqadi.
- [ ] Bloger o'z kanalini ulab, izohlarni ko'ra oladi va do'stona AI javoblar generatsiya bo'ladi.
- [ ] Barcha sahifalar yashil va oranje ranglar bilan ko'rkam ishlaydi.

---

## O'zgarishlar tarixi (Changelog)
- **2026-10-11** — Vidoor loyihasining ilk TZ (texnik topshiriq) hujjati yaratildi.
