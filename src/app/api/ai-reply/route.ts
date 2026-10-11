import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { comment, author, lang, tone, channelName } = await request.json();

    if (!comment) {
      return NextResponse.json({ error: "Izoh matni kiritilmadi" }, { status: 400 });
    }

    const detectedLang = lang || (/[а-яА-ЯёЁ]/.test(comment) ? "Русский" : /[a-zA-Z]/.test(comment) ? "English" : "O'zbekcha");
    const name = author || "Do'stim";
    const chName = channelName || "Bizning kanal";

    let reply = "";

    if (detectedLang === "O'zbekcha") {
      switch (tone) {
        case "professional":
          reply = `Assalomu alaykum ${name}! Fikringiz va qimmatli mulohazangiz uchun tashakkur. ${chName} jamoasi auditoriya fikrini doimo yuksak qadrlaydi. Yangi loyihalarimizda buni albatta inobatga olamiz.`;
          break;
        case "funny":
          reply = `Salom ${name}! 😄 Gap yo'q, izohingiz kayfiyatni ko'tardi! Sizdek quvnoq muxlislar bor ekan, biz tinimsiz yangi videolarni portlatishda davom etamiz! 🔥`;
          break;
        case "gratitude":
          reply = `Katta rahmat sizga ${name}! Sizlarning shunday iliq qo'llab-quvvatlovingiz bizga katta kuch va ilhom beradi. Biz bilan birga ekanligingizdan xursandmiz! ❤️🙏`;
          break;
        case "warm":
        default:
          reply = `Salom ${name}! Fikringiz va qo'llab-quvvatlaganingiz uchun katta rahmat! Yangi videomiz tez kunda chiqadi, kuzatishda davom eting! 🔥`;
          break;
      }
    } else if (detectedLang === "Русский") {
      switch (tone) {
        case "professional":
          reply = `Здравствуйте, ${name}! Благодарим за ваш комментарий и интерес к нашему контенту. Мы внимательно прислушиваемся к отзывам аудитории и стараемся делать каждый выпуск лучше.`;
          break;
        case "funny":
          reply = `Привет, ${name}! 😂 Отличный комментарий, подняли настроение на весь день! Спасибо, что с нами, впереди еще много крутого контента! 🚀`;
          break;
        case "gratitude":
          reply = `Огромное спасибо, ${name}! Ваша поддержка невероятно мотивирует всю нашу команду работать еще усерднее. Спасибо, что вы с нами! ❤️✨`;
          break;
        case "warm":
        default:
          reply = `Привет, ${name}! Большое спасибо за поддержку и теплые слова! Новый выпуск уже в монтаже, оставайтесь на связи! 👍🔥`;
          break;
      }
    } else {
      // English
      switch (tone) {
        case "professional":
          reply = `Hello ${name}! Thank you for your thoughtful comment and valuable feedback. We truly appreciate our viewers' engagement and strive to deliver top-tier content.`;
          break;
        case "funny":
          reply = `Haha hey ${name}! 😂 That really made our day! Thanks for the awesome vibe and support, more crazy content is coming soon! 🚀🔥`;
          break;
        case "gratitude":
          reply = `Thank you so much, ${name}! Your kind words and support mean the world to our team. We're truly grateful to have you in our community! ❤️✨`;
          break;
        case "warm":
        default:
          reply = `Hey ${name}! Thanks a lot for watching and supporting the channel! New video is dropping very soon, stay tuned! 🎥⚡`;
          break;
      }
    }

    return NextResponse.json({
      reply,
      lang: detectedLang,
      tone: tone || "warm"
    });
  } catch (err: any) {
    return NextResponse.json({ error: "AI javob yaratishda xatolik: " + err.message }, { status: 500 });
  }
}
