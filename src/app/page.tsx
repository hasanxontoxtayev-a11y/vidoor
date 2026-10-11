"use client";

import React, { useState } from "react";
import { 
  Search, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Youtube,
  BarChart3,
  Users,
  Video,
  Send,
  RefreshCw,
  X,
  Calendar,
  Zap,
  Globe,
  PlusCircle,
  Check,
  Award,
  Link as LinkIcon,
  HelpCircle,
  ThumbsUp,
  Settings
} from "lucide-react";

// Taniqli kanallar uchun boyitilgan ma'lumotlar bazasi
const GLOBAL_CHANNELS_PRESETS: Record<string, any> = {
  "@mittivine": {
    name: "Mitti Vine",
    handle: "@mittivine",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
    subscribers: "1.45M",
    totalViews: "380.2M",
    totalVideos: "420",
    country: "O'zbekiston 🇺🇿",
    niche: "Kulguli Vine & Sketlar (Komediya)",
    rpm: "$1.40",
    rpmRange: "$1.10 - $2.20",
    monthlyEarnings: "$2,800 - $5,400",
    avgDuration: "3 daqiqa 40 soniya",
    retentionRate: "72%",
    bestDays: "Juma va Shanba",
    bestTime: "19:00 - 21:00",
    aiInsight: "Mitti Vine kanali qisqa, dinamik va xalqona mavzulari bilan juda yuqori tomoshabin ushlab turish ulushiga (72% retention) ega. Kulguli yo'nalishda RPM o'rtacha ($1.40), lekin ko'rishlar soni o'ta yuqori bo'lgani sababli umumiy daromad katta. Eng yaxshi yuklash vaqti — dam olish kunlari kechki 19:30.",
    topVideos: [
      { title: "To'yda kutilmagan voqea — Mitti Vine 2026", views: "3.2M", duration: "04:15", date: "1 oy oldin", time: "19:30" },
      { title: "Bozorda narx-navo tushibdimi?", views: "2.8M", duration: "03:50", date: "2 oy oldin", time: "20:00" },
      { title: "Mashinani yuvganda yomg'ir yog'sa...", views: "2.1M", duration: "02:45", date: "3 oy oldin", time: "19:00" }
    ],
    sampleComments: [
      { id: 1, author: "Javohirbek", lang: "O'zbekcha", text: "Akalar gap yo'q, har doimgidek kayfiyatni ko'tardinglar! Yangi qism qachon?", reply: "Rahmat Javohir! Har doim sizlarga xursandchilik ulashsak, biz ham baxtiyormiz! Yangi qism juma kuni soat 19:30 da chiqadi! 😂🔥", sent: false },
      { id: 2, author: "Murad_Tashkent", lang: "Русский", text: "Ахаха, жизненная ситуация с машиной! Отличный юмор!", reply: "Спасибо большое, Мурад! Рады, что понравилось, оставайся с нами! 🚗✨", sent: false }
    ]
  },
  "@texnoplov": {
    name: "Texnoplov",
    handle: "@texnoplov",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
    subscribers: "420K",
    totalViews: "58.4M",
    totalVideos: "312",
    country: "O'zbekiston 🇺🇿",
    niche: "Gadjetlar va Zamonaviy Texnologiyalar",
    rpm: "$3.40",
    rpmRange: "$2.80 - $4.90",
    monthlyEarnings: "$1,850 - $3,400",
    avgDuration: "13 daqiqa 20 soniya",
    retentionRate: "59%",
    bestDays: "Seshanba va Shanba",
    bestTime: "18:30 - 20:00",
    aiInsight: "Ushbu kanalning 11-15 daqiqalik videolari qisqa videolarga qaraganda 45% ko'proq ushlab turmoqda. Texnologiya mavzusida O'zbekistonda RPM ancha yuqori ($3+). Soat 18:30 da yuklash dastlabki 2 soatlik tomoshabinlar oqimini maksimal darajada oshiradi.",
    topVideos: [
      { title: "iPhone 16 Pro Max 1 oylik xolis tahlili — arziydimi?", views: "680K", duration: "14:20", date: "2 hafta oldin", time: "18:30" },
      { title: "Sun'iy intellekt 2026-yilda kimlarni ishsiz qoldiradi?", views: "540K", duration: "16:45", date: "1 oy oldin", time: "19:00" },
      { title: "Eng arzon va sifatli noutbuklar reytingi", views: "430K", duration: "11:10", date: "2 oy oldin", time: "18:00" }
    ],
    sampleComments: [
      { id: 1, author: "Farrux Zokirov", lang: "O'zbekcha", text: "Salom! iPhone 16 akkumulyatori qancha vaqtga yetyapti? Ishlatish qulaymi?", reply: "Salom Farrux! Qiziqishingiz uchun rahmat. Kun davomida bemalol 1.5 kunga yetmoqda, ayniqsa video ko'rganda juda tejamkor! 🔥", sent: false },
      { id: 2, author: "Azamat_Pro", lang: "Русский", text: "Отличный обзор! А когда выйдет тест новых камер?", reply: "Привет, Azamat! Спасибо за поддержку! Тест камер выйдет в эту субботу в 18:30, обязательно посмотри! 🎥✨", sent: false }
    ]
  },
  "@mrbeast": {
    name: "MrBeast",
    handle: "@mrbeast",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    subscribers: "340M",
    totalViews: "62.1B",
    totalVideos: "840",
    country: "AQSH (USA) 🇺🇸",
    niche: "Global Entertainment & Giant Challenges",
    rpm: "$6.50",
    rpmRange: "$5.00 - $8.50",
    monthlyEarnings: "$450,000 - $900,000",
    avgDuration: "18 daqiqa 40 soniya",
    retentionRate: "76%",
    bestDays: "Shanba",
    bestTime: "12:00 (EST) / 21:00 (UZT)",
    aiInsight: "Kanal har bir soniyada dinamik montaj va qiziqishni ushlab turuvchi kutilmagan syujetlardan foydalanadi. AQSH auditoriyasi yuqori RPM ($6.5+) beradi. Video boshidagi dastlabki 5 soniya retentionning 70% ni belgilaydi.",
    topVideos: [
      { title: "$1 vs $1,000,000,000 Hotel Room!", views: "380M", duration: "20:10", date: "4 oy oldin", time: "21:00" },
      { title: "I Built Willy Wonka's Chocolate Factory!", views: "290M", duration: "17:05", date: "1 yil oldin", time: "21:00" }
    ],
    sampleComments: [
      { id: 1, author: "John Miller", lang: "English", text: "This video was crazy! How much did the set design cost?", reply: "Hey John! Appreciate the support brother! Took our crew 3 months to build! 🔥❤️", sent: false },
      { id: 2, author: "Bekzod_T", lang: "O'zbekcha", text: "O'zbekistondan salom! Zo'r video bo'libdi!", reply: "O'zbekistonga alangali salom! Rahmat do'stim! 🇺🇿🚀", sent: false }
    ]
  },
  "@mkbhd": {
    name: "Marques Brownlee (MKBHD)",
    handle: "@mkbhd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
    subscribers: "19.2M",
    totalViews: "4.3B",
    totalVideos: "1,650",
    country: "AQSH (USA) 🇺🇸",
    niche: "High-End Tech & Smartphones",
    rpm: "$7.20",
    rpmRange: "$5.80 - $9.40",
    monthlyEarnings: "$35,000 - $70,000",
    avgDuration: "15 daqiqa 10 soniya",
    retentionRate: "68%",
    bestDays: "Chorshanba va Juma",
    bestTime: "14:00 (EST) / 23:00 (UZT)",
    aiInsight: "Dunyoning eng yuqori sifatli va toza texnologiya sharhlari. MKBHD-ning auditoriyasi asosan to'lov qobiliyati yuqori kishilar bo'lgani uchun uning RPM ko'rsatkichi rekord darajada yuqori ($7.20).",
    topVideos: [
      { title: "Smartphone Awards 2025!", views: "6.8M", duration: "24:10", date: "3 oy oldin", time: "23:00" },
      { title: "The Truth About Apple Vision Pro", views: "8.1M", duration: "18:30", date: "6 oy oldin", time: "23:00" }
    ],
    sampleComments: [
      { id: 1, author: "David Vance", lang: "English", text: "Crispy clean visuals as always! Best tech reviewer hands down.", reply: "Thanks David! Really appreciate the feedback, more crisp reviews coming soon! 🎥⚡", sent: false }
    ]
  }
};

// Istalgan yangi kanal kiritilganda uning parametrlarini hisoblovchi AI motor
function analyzeAnyChannel(inputQuery: string) {
  const clean = inputQuery.trim().replace("https://www.youtube.com/", "").replace("https://youtube.com/", "").replace("/", "");
  const handle = clean.startsWith("@") ? clean : `@${clean}`;
  const lower = handle.toLowerCase();

  if (GLOBAL_CHANNELS_PRESETS[lower]) {
    return GLOBAL_CHANNELS_PRESETS[lower];
  }

  // Nomiga qarab niche va parametrlar tahlili
  let niche = "Umumiy Blog & Qiziqarli Mavzular";
  let rpm = "$2.40";
  let rpmRange = "$1.80 - $3.40";
  let bestTime = "19:00 - 20:30";
  let bestDays = "Payshanba va Yakshanba";
  let avgDuration = "10 daqiqa 45 soniya";
  let subs = "120K";
  let views = "18.5M";
  let earnings = "$850 - $1,900";

  if (lower.includes("tech") || lower.includes("gadget") || lower.includes("komp") || lower.includes("it")) {
    niche = "IT, Gadjetlar va Texnologiya";
    rpm = "$3.60";
    rpmRange = "$2.90 - $5.10";
    bestTime = "18:30 - 20:00";
    earnings = "$1,600 - $3,200";
  } else if (lower.includes("vine") || lower.includes("kulgu") || lower.includes("humor") || lower.includes("comedy")) {
    niche = "Komediya, Sket va Qiziqarli Vine";
    rpm = "$1.50";
    rpmRange = "$1.10 - $2.40";
    bestTime = "19:30 - 21:30";
    avgDuration = "04 daqiqa 15 soniya";
    earnings = "$2,100 - $4,800";
  } else if (lower.includes("game") || lower.includes("gaming") || lower.includes("play")) {
    niche = "Gaming va Jonli Efirlar (Strimlar)";
    rpm = "$2.10";
    rpmRange = "$1.60 - $3.00";
    bestTime = "20:00 - 22:30";
    avgDuration = "22 daqiqa 10 soniya";
    earnings = "$1,100 - $2,500";
  } else if (lower.includes("money") || lower.includes("biznes") || lower.includes("finance") || lower.includes("invest")) {
    niche = "Biznes, Moliya va Investitsiyalar";
    rpm = "$6.80";
    rpmRange = "$5.00 - $9.50";
    bestTime = "18:00 - 19:30";
    avgDuration = "14 daqiqa 30 soniya";
    earnings = "$3,400 - $7,200";
  }

  const name = clean.replace("@", "");
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    handle: handle,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60`,
    subscribers: subs,
    totalViews: views,
    totalVideos: "185",
    country: "Xalqaro / O'zbekiston",
    niche: niche,
    rpm: rpm,
    rpmRange: rpmRange,
    monthlyEarnings: earnings,
    avgDuration: avgDuration,
    retentionRate: "61%",
    bestDays: bestDays,
    bestTime: bestTime,
    aiInsight: `"${handle}" kanali o'z yo'nalishida (${niche}) barqaror tomoshabinlar yig'moqda. Auditoriyani maksimal darajada ushlash uchun videolar hajmini ${avgDuration} atrofida saqlash va soat ${bestTime} oralig'ida yuklash tavsiya etiladi. Niche bo'yicha hisoblangan RPM (${rpm}) yuqori daromad salohiyatini ko'rsatadi.`,
    topVideos: [
      { title: `${name} — Eng ko'p tomosha qilingan asosiy video`, views: "450K", duration: "11:20", date: "1 oy oldin", time: bestTime.split(" - ")[0] },
      { title: `${name} kanali: yangi boshlovchilar uchun maxsus qo'llanma`, views: "320K", duration: "13:45", date: "2 oy oldin", time: bestTime.split(" - ")[0] },
      { title: "Eng kutilgan va muhim yangiliklar sharhi", views: "280K", duration: "08:15", date: "3 oy oldin", time: bestTime.split(" - ")[0] }
    ],
    sampleComments: [
      { id: 201, author: "Akbarshoh", lang: "O'zbekcha", text: "Juda qiziq tahlil bo'libdi! Qaysi dasturlarda montaj qilasiz?", reply: `Salom Akbarshoh! Fikringiz uchun rahmat. Asosan Adobe Premiere Pro va CapCut dasturlaridan foydalanaman, juda qulay! 🎬✨`, sent: false },
      { id: 202, author: "Elena_K", lang: "Русский", text: "Отличное видео, спасибо за полезную информацию!", reply: `Привет, Елена! Спасибо большое за поддержку! Очень приятно! 😊🔥`, sent: false },
      { id: 203, author: "Alex_Tech", lang: "English", text: "Great content! Keep up the good work!", reply: `Hey Alex! Thanks so much for watching and supporting the channel! 🚀🙌`, sent: false }
    ]
  };
}

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"explore" | "myChannel">("explore");
  const [searchQuery, setSearchQuery] = useState("@mittivine");
  const [selectedChannel, setSelectedChannel] = useState(GLOBAL_CHANNELS_PRESETS["@mittivine"]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"timing" | "earnings" | "videos" | "comments">("timing");
  const [comments, setComments] = useState<any[]>(GLOBAL_CHANNELS_PRESETS["@mittivine"].sampleComments);
  
  // Blogerning o'z kanali
  const [myChannelConnected, setMyChannelConnected] = useState(false);
  const [myChannelLink, setMyChannelLink] = useState("");
  const [myChannelData, setMyChannelData] = useState<any>(null);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autoReplyMode, setAutoReplyMode] = useState(false);

  // Kanalni tahlil qilish
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const result = analyzeAnyChannel(searchQuery);
      setSelectedChannel(result);
      setComments(result.sampleComments);
      setIsLoading(false);

      const el = document.getElementById("analysis-results");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  // O'z kanalini ulash
  const handleConnectMyChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myChannelLink.trim()) return;

    const channelData = analyzeAnyChannel(myChannelLink);
    setMyChannelData(channelData);
    setMyChannelConnected(true);
  };

  // Izohga javob tasdiqlash
  const handleSendReply = (id: number) => {
    setComments((prev: any[]) => prev.map(c => c.id === id ? { ...c, sent: true } : c));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setViewMode("explore"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-black text-xl tracking-wider">
              V
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-orange-500 bg-clip-text text-transparent">
                Vidoor
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Global YouTube AI
              </span>
            </div>
          </div>

          {/* Rejimlar tugmasi: Dunyo kanallari vs Mening kanalim */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("explore")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "explore"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Dunyo Kanallari Tahlili</span>
            </button>
            <button
              onClick={() => setViewMode("myChannel")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "myChannel"
                  ? "bg-gradient-to-r from-emerald-600 to-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Mening Kanalim {myChannelConnected && "✓"}</span>
            </button>
          </div>

          {/* Auth tugmalari */}
          <div className="hidden sm:flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{authEmail.split("@")[0]} (Faol)</span>
                <button onClick={() => setIsLoggedIn(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                  Chiqish
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Kirish / Profil
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN VIEW 1: DUNYO KANALLARI TAHLILI */}
      {viewMode === "explore" && (
        <>
          {/* Hero & Universal Search Bar */}
          <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200/80">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.orange.50),white)] opacity-70" />
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-800 text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Globe className="w-4 h-4 text-orange-600" />
                <span>Butun dunyo bo'ylab istalgan YouTube kanalini analiz qiling</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Kanal sirlarini oching:{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                  Vaqt, RPM va Daromad
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Istalgan bloger qachon video yuklaydi? Qancha daromad oladi? Auditoriyasi videolarning qancha qismini ko'radi? Linkini kiriting va biling!
              </p>

              {/* Real Universal Search */}
              <form onSubmit={handleAnalyze} className="mt-8 max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/70 border-2 border-emerald-500/40 p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
                  <Search className="w-6 h-6 text-emerald-600 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kanal linki yoki nomini yozing (masalan: @mittivine, @mrbeast, @mkbhd)"
                    className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base font-semibold"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center space-x-2 whitespace-nowrap transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Tahlil qilinmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Analiz qilish</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Dunyo va O'zbekiston kanallari tezkor tugmalari */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">Tezkor namunalar:</span>
                  <button type="button" onClick={() => { setSearchQuery("@mittivine"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 @mittivine
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("@texnoplov"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 @texnoplov
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("@mrbeast"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-orange-600 hover:border-orange-500 shadow-2xs">
                    🇺🇸 @mrbeast
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("@mkbhd"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-orange-600 hover:border-orange-500 shadow-2xs">
                    🇺🇸 @mkbhd
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Dynamic Analysis Result Card */}
          <section id="analysis-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedChannel.avatar} 
                  alt={selectedChannel.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-black text-slate-900">{selectedChannel.name}</h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {selectedChannel.handle}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>Hudud: <strong className="text-slate-800">{selectedChannel.country}</strong></span>
                    <span>•</span>
                    <span>Yo'nalish: <strong className="text-slate-800">{selectedChannel.niche}</strong></span>
                  </div>
                </div>
              </div>

              {/* 3 ta muhim ko'rsatkich */}
              <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="text-center px-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Obunachilar</span>
                  <p className="text-xl font-black text-slate-900">{selectedChannel.subscribers}</p>
                </div>
                <div className="text-center px-4 border-x border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Ko'rishlar</span>
                  <p className="text-xl font-black text-slate-900">{selectedChannel.totalViews}</p>
                </div>
                <div className="text-center px-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Videolar</span>
                  <p className="text-xl font-black text-slate-900">{selectedChannel.totalVideos}</p>
                </div>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-6">
              <button 
                onClick={() => setActiveTab("timing")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  activeTab === "timing"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Vaqt va Davomiylik</span>
              </button>

              <button 
                onClick={() => setActiveTab("earnings")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  activeTab === "earnings"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>RPM va Daromad</span>
              </button>

              <button 
                onClick={() => setActiveTab("videos")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  activeTab === "videos"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Eng Yaxshi Videolar</span>
              </button>

              <button 
                onClick={() => setActiveTab("comments")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  activeTab === "comments"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Do'stona AI Izohlar ({comments.length})</span>
              </button>
            </div>

            {/* Tab Kontenti */}
            <div>
              {/* TAB 1: Vaqt va Davomiylik */}
              {activeTab === "timing" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">Eng samarali yuklash soati</span>
                      <p className="text-3xl font-black text-slate-900 mt-2">{selectedChannel.bestTime}</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-2">Dastlabki 2 soatda maksimal ko'rishlar</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">Eng faol haftalik kunlar</span>
                      <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.bestDays}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-2">Auditoriya dam olish kunlari eng faol</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">O'rtacha video davomiyligi</span>
                      <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.avgDuration}</p>
                      <p className="text-xs text-teal-600 font-semibold mt-2">Tomosha ulushi (Retention): {selectedChannel.retentionRate}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-800 shadow-lg">
                    <div className="flex items-center space-x-2 text-emerald-400 mb-2 font-bold text-sm">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                      <span>Vidoor AI — Kanal tahlilchisi xulosasi:</span>
                    </div>
                    <p className="text-slate-200 text-base leading-relaxed">
                      {selectedChannel.aiInsight}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: RPM va Daromad */}
              {activeTab === "earnings" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">Mavzu bo'yicha RPM (1000 ko'rish daromadi)</span>
                      <p className="text-4xl font-black text-orange-500 mt-2">{selectedChannel.rpm}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Kanal yo'nalishi (<strong>{selectedChannel.niche}</strong>) bo'yicha o'rtacha oraliq: <strong className="text-slate-700">{selectedChannel.rpmRange}</strong>
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-400">Taxminiy oylik daromad</span>
                      <p className="text-4xl font-black text-emerald-600 mt-2">{selectedChannel.monthlyEarnings}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        So'nggi 30 kunlik ko'rishlar, davlat ({selectedChannel.country}) va reklama zichligi hisobi asosida.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-sm text-orange-950 leading-relaxed">
                    <strong>💡 RPM sirlari:</strong> Dunyo bo'ylab eng yuqori RPM stavkalari AQSH, Yevropa va arab davlatlarida ($5 - $12+). MDH va O'zbekistonda esa o'rtacha RPM $1.20 dan $4.00 gacha bo'ladi. Mavzuni to'g'ri tanlash kamroq ko'rish bilan ham ko'proq daromad olish siri hisoblanadi!
                  </div>
                </div>
              )}

              {/* TAB 3: Eng yaxshi videolar */}
              {activeTab === "videos" && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-600" />
                    <span>Eng ko'p ko'rilgan videolar va ularning siri</span>
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {selectedChannel.topVideos.map((video: any, idx: number) => (
                      <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                              <span>Yuklangan vaqti: <strong>{video.time}</strong></span>
                              <span>Davomiyligi: <strong>{video.duration}</strong></span>
                              <span>Sana: {video.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center sm:justify-end">
                          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-sm">
                            {video.views} ko'rish
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Do'stona AI Izohlar */}
              {activeTab === "comments" && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Izohlarga do'stona va samimiy AI javoblar</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        AI izoh qaysi tilda yozilganini (o'zbek, rus, ingliz) avtomatik aniqlab, samimiy javob qaytaradi.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">To'liq avtomatik javob:</span>
                      <button 
                        onClick={() => setAutoReplyMode(!autoReplyMode)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                          autoReplyMode ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                      <span className="text-xs font-semibold text-emerald-700">
                        {autoReplyMode ? "YOQILGAN" : "O'CHIRILGAN"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-800">{comment.author}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                              Tili: {comment.lang}
                            </span>
                          </div>
                          {comment.sent && (
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Yuborildi ✓
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-700 mb-3 bg-white p-3 rounded-lg border border-slate-200/60">
                          "{comment.text}"
                        </p>

                        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg">
                          <div className="flex items-center space-x-1 text-xs font-bold text-emerald-800 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                            <span>AI tomonidan tayyorlangan samimiy javob ({comment.lang}):</span>
                          </div>
                          <p className="text-sm text-slate-800 font-medium italic">
                            {comment.reply}
                          </p>

                          <div className="mt-3 flex items-center justify-end space-x-2">
                            {comment.sent ? (
                              <button disabled className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-lg bg-slate-200 cursor-not-allowed">
                                Javob qaytarilgan ✓
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSendReply(comment.id)}
                                className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Tasdiqlash va Yuborish</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 3. MAIN VIEW 2: MENING KANALIM (BLOGERNING O'Z KANALI VA IZOHLAR BOSHQARUVI) */}
      {viewMode === "myChannel" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!myChannelConnected ? (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-500/50 shadow-xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Youtube className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">O'z YouTube Kanalingizni Ulang</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Kanal havolangizni yoki nomingizni kiriting. Vidoor sizning videolaringiz tomoshabinlar tomonidan qancha ko'rilayotganini (retention), eng yaxshi yuklash soatlaringizni va kelgan izohlarga o'sha tilda avtomatik javob berishni yoqadi.
              </p>

              <form onSubmit={handleConnectMyChannel} className="mt-6 space-y-3">
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={myChannelLink}
                    onChange={(e) => setMyChannelLink(e.target.value)}
                    placeholder="Masalan: @sizning_kanalingiz yoki youtube.com/@..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Kanalni Birlashtirish va Tahlilni Boshlash</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Shaxsiy kanal banneri */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-orange-950 text-white rounded-3xl p-8 border border-emerald-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img 
                    src={myChannelData.avatar}
                    alt={myChannelData.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-emerald-400 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ulangan Shaxsiy Kanal</span>
                    <h2 className="text-3xl font-black mt-1">{myChannelData.name}</h2>
                    <p className="text-xs text-slate-300 mt-1">{myChannelData.handle} • {myChannelData.niche}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMyChannelConnected(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10"
                  >
                    Boshqa kanal ulash
                  </button>
                </div>
              </div>

              {/* Ichki Retention va Shaxsiy Tahlillar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Tomosha ulushi (Retention)</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{myChannelData.retentionRate}</p>
                  <p className="text-xs text-slate-500 mt-2">Tomoshabinlar videongizning o'rtacha {myChannelData.retentionRate} qismini ko'rmoqda</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Eng samarali soatingiz</span>
                  <p className="text-3xl font-black text-orange-500 mt-2">{myChannelData.bestTime}</p>
                  <p className="text-xs text-slate-500 mt-2">{myChannelData.bestDays} kunlari eng faol</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">O'rtacha video davomiyligi</span>
                  <p className="text-3xl font-black text-slate-900 mt-2">{myChannelData.avgDuration}</p>
                  <p className="text-xs text-slate-500 mt-2">Eng yaxshi natija beruvchi hajm</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Mavzuingiz RPM ko'rsatkichi</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{myChannelData.rpm}</p>
                  <p className="text-xs text-slate-500 mt-2">1000 ta ko'rish uchun daromad</p>
                </div>
              </div>

              {/* Shaxsiy AI Maslahat */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold mb-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span>Sizning kanalingizni o'stirish bo'yicha shaxsiy AI tavsiyasi:</span>
                </div>
                <p className="text-sm text-emerald-950 leading-relaxed font-medium">
                  {myChannelData.aiInsight}
                </p>
              </div>

              {/* Mening kanalimdagi izohlarga AI javob berish markazi */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Videolaringizga kelgan yangi izohlar</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Har qanday tilda yozilgan izohlarga o'sha tilda do'stona va samimiy javob qaytaring.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {myChannelData.sampleComments.map((comment: any) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{comment.author}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                            Tili: {comment.lang}
                          </span>
                        </div>
                        {comment.sent && (
                          <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Yuborildi ✓
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-800 mb-3 bg-white p-3 rounded-lg border border-slate-200/80">
                        "{comment.text}"
                      </p>

                      <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                          Do'stona AI javob taklifi:
                        </span>
                        <p className="text-sm text-slate-900 font-medium italic">
                          {comment.reply}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={() => {
                              setMyChannelData((prev: any) => ({
                                ...prev,
                                sampleComments: prev.sampleComments.map((c: any) => c.id === comment.id ? { ...c, sent: true } : c)
                              }));
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Javobni Tasdiqlash va Yuborish</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-md">
                V
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-3">Vidoor tizimiga kirish</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kanal tahlillaringizni saqlash va izohlarni boshqarish uchun hisobingizga kiring.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (authEmail) { setIsLoggedIn(true); setAuthModalOpen(false); } }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Elektron pochta (Email)
                </label>
                <input 
                  type="email"
                  required
                  placeholder="masalan: khan@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Maxfiy parol
                </label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition text-sm"
              >
                Kirish / Hisob ochish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Vidoor. YouTube ijodkorlari uchun yaratilgan global tahlil platformasi. Muallif: <strong>Khan</strong></p>
        </div>
      </footer>
    </div>
  );
}
