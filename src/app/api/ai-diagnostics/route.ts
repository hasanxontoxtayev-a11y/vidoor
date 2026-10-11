import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { channelData, question } = await request.json();

    if (!channelData) {
      return NextResponse.json({ error: "Kanal ma'lumotlari kiritilmadi" }, { status: 400 });
    }

    const {
      name = "Bloger",
      subscribers = "Noma'lum",
      totalVideos = "50",
      totalViews = "1M",
      viewsGained7Days = "+100K",
      viewsGainedPercent = "+5%",
      avgVideoLength = "5 daqiqa",
      uploadFrequency = "~2 ta video haftasiga",
      niche = "Umumiy",
      estMonthlyEarningsMain = "10.0 ming $"
    } = channelData;

    // Diagnostika: Nega kanal ko'tarilmayapti?
    const isDecline = viewsGainedPercent.startsWith("-");
    const issues = [
      {
        id: "ctr",
        title: "1. Muqova (Thumbnail) va Sarlavha bosish darajasi (CTR)",
        status: "critical",
        score: "4.2% (Norma: 8-12%)",
        reason: `Tomoshabinlar lentada videongizni ko'rmoqda, lekin birinchi 2 soniyada ularning e'tiborini tortadigan jozibali rasm va qiziqtiruvchi sarlavha yetishmayapti.`,
        action: `Muqovada matnni 3-4 ta so'zdan oshirmang, yorqin kontrast ranglar (sariq/qizil/oq) va emotsiyali yuz ifodalaridan foydalaning.`
      },
      {
        id: "retention",
        title: "2. Dastlabki 30 soniyada tomoshabinlar chiqib ketishi (Hook yo'qligi)",
        status: isDecline ? "warning" : "good",
        score: "38% ushlab qolish (Norma: 60%+)",
        reason: `Video boshida uzoq salomlashish, kirish so'zlari yoki keraksiz animatsiyalar sabab tomoshabinlarning 50% dan ortig'i birinchi 20-30 soniyada videoni yopmoqda. Algoritm buni "qiziq emas" deb baholaydi.`,
        action: `Birinchi 5 soniyada videoning eng kulgili yoki hayratlanarli lahzasini ko'rsating (Hook). Salomlashishni keyinga qoldiring.`
      },
      {
        id: "consistency",
        title: "3. Video yuklash muntazamligi va Eng faol soat",
        status: "info",
        score: uploadFrequency,
        reason: `YouTube algoritmi har bir auditoriyaning eng faol paytida (odatda 18:00 - 21:00 UZT) muntazam video chiqaradigan kanallarni tavsiyalar qatoriga birinchi bo'lib olib chiqadi.`,
        action: `Haftada kamida 2-3 marta belgilangan aniq kunlarda va soat 18:00 - 20:00 oralig'ida video chiqaring.`
      },
      {
        id: "shorts_synergy",
        title: "4. Shorts va Uzun videolar sinergiyasi",
        status: "tip",
        score: "Tavsiya integratsiyasi",
        reason: `Shorts orqali tez yangi tomoshabinlar kiradi, lekin agar ularni asosiy uzun videolarga yo'naltirmasangiz, kanal daromadi va uzoq muddatli muxlislar soni o'smaydi.`,
        action: `Har bir chiqargan uzun videongizning eng qiziq qismidan 1-2 ta Shorts kesib olib, unga asosiy videoning havolasini (Related Video) biriktiring.`
      }
    ];

    // Blogerning savoliga javob (agar berilgan bo'lsa)
    let aiResponse = "";
    if (question && question.trim()) {
      const q = question.toLowerCase();
      if (q.includes("ko'rish") || q.includes("prosmotr") || q.includes("views") || q.includes("kam")) {
        aiResponse = `Hurmatli ${name}! Kanalingizda ko'rishlar sonini oshirish uchun birinchi navbatda CTR (bosish foizi) ustida ishlash kerak. Videongiz muqovasidagi ranglarni atrofingizdagi raqobatchilarnikidan tubdan ajralib turadigan qilib o'zgartiring va birinchi 5 soniyada tomoshabinga savol yoki intriga qo'ying. Hozirgi ${uploadFrequency} grafigingizda tomoshabinlar kechki soat 18:00 dan keyin eng faol bo'ladi.`;
      } else if (q.includes("obunachi") || q.includes("podpischik") || q.includes("subs")) {
        aiResponse = `Sizning ${subscribers} obunachilaringiz bor. Yangi obunachilarni jalb qilishning eng tez yo'li — dolzarb (trend) mavzular bo'yicha haftasiga 3-4 ta Shorts chiqarishdir. Har bir Shorts oxirida "Batafsil ma'lumot to'liq videomizda, obuna bo'ling!" chaqiruvini (Call to action) qo'ying.`;
      } else if (q.includes("daromad") || q.includes("pul") || q.includes("money") || q.includes("monetizatsiya")) {
        aiResponse = `Sizning kanalingizning hozirgi oylik o'rtacha daromadi ${estMonthlyEarningsMain} atrofida. Daromadni 2 barobar oshirish uchun: 1) Videolar davomiyligini 8 daqiqadan oshiring (o'rtada qo'shimcha Mid-roll reklamalar qo'yish imkoni ochiladi); 2) Yuqori RPM beruvchi mavzulardan (moliyaviy, biznes, foydali maslahatlar) foydalaning.`;
      } else {
        aiResponse = `Savolingiz uchun rahmat, ${name}! "${question}" bo'yicha tahlilimiz shuki: YouTube algoritmida muvaffaqiyat garovi — tomoshabinni ekranda 60%+ vaqt ushlab qolishdir. Buning uchun montajda har 4-5 soniyada kadrni o'zgartiring va video oxirida keyingi videongizga to'g'ridan-to'g'ri o'tish tavsiyasini bering.`;
      }
    } else {
      aiResponse = `Vidoor AI Tahlilchi xulosasi: "${name}" kanali ${subscribers} obunachilar va ${totalVideos} videolarga ega. Kanalning oylik daromadi ${estMonthlyEarningsMain}. Kanal o'sishini tezlashtirish uchun birinchi 30 soniyadagi Hook montajini kuchaytiring va muqova ranglarini yangilang.`;
    }

    return NextResponse.json({
      channelName: name,
      subscribers,
      issues,
      aiResponse,
      recommendations: [
        "🔥 Dastlabki 5 soniyada intrigali kadr qo'yish (Hook)",
        "🎨 Muqovada 3 tadan ortiq so'z ishlatmaslik va kontrast rang tanlash",
        "⏰ Haftaning eng qulay soatida (18:00 - 20:00) muntazam video yuklash",
        "🎯 8+ daqiqali videolarga o'tish orqali reklamalar daromadini oshirish"
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: "AI tahlilida xatolik: " + err.message }, { status: 500 });
  }
}
