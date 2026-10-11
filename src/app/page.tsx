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
  Info,
  Check,
  Award
} from "lucide-react";

// Namunaviy kanallar ma'lumotlari bazasi
const CHANNELS_DATABASE: Record<string, any> = {
  "@texnoplov": {
    name: "Texnoplov",
    handle: "@texnoplov",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
    subscribers: "420K",
    totalViews: "58.4M",
    totalVideos: "312",
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
      { id: 2, author: "Azamat_Pro", lang: "Русский", text: "Отличный обзор! А когда выйдет тест новых камер?", reply: "Привет, Azamat! Спасибо за поддержку! Тест камер выйдет в эту субботу в 18:30, обязательно посмотри! 🎥✨", sent: false },
      { id: 3, author: "TechGuru_99", lang: "English", text: "Great video quality and audio! What microphone do you use?", reply: "Hey TechGuru! Thank you so much! I use the DJI Mic 2, highly recommend it for clean audio! 🎙️🚀", sent: false }
    ]
  },
  "@mrbeast": {
    name: "MrBeast",
    handle: "@mrbeast",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    subscribers: "340M",
    totalViews: "62.1B",
    totalVideos: "840",
    niche: "Entertainment & Challenges",
    rpm: "$6.50",
    rpmRange: "$5.00 - $8.50",
    monthlyEarnings: "$450,000 - $900,000",
    avgDuration: "18 daqiqa 40 soniya",
    retentionRate: "76%",
    bestDays: "Shanba",
    bestTime: "12:00 (EST) / 21:00 (UZT)",
    aiInsight: "Kanal har bir soniyada dinamik montaj va qiziqishni ushlab turuvchi kutilmagan syujetlardan foydalanadi. Video boshidagi dastlabki 5 soniya retentionning 70% ni belgilaydi.",
    topVideos: [
      { title: "$1 vs $1,000,000,000 Hotel Room!", views: "380M", duration: "20:10", date: "4 oy oldin", time: "21:00" },
      { title: "I Built Willy Wonka's Chocolate Factory!", views: "290M", duration: "17:05", date: "1 yil oldin", time: "21:00" }
    ],
    sampleComments: [
      { id: 1, author: "John Doe", lang: "English", text: "This video was absolutely insane! How much did it cost?", reply: "Haha thanks John! It took us 3 months of non-stop work! Glad you loved it! 🔥❤️", sent: false },
      { id: 2, author: "Jasur_Uz", lang: "O'zbekcha", text: "O'zbekistondan salom! Videolaringiz shunchaki bomba!", reply: "O'zbekistonga alangali salom! Sizlarning qo'llab-quvvatlashingiz biz uchun juda qadrli! 🇺🇿✨", sent: false }
    ]
  }
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("@texnoplov");
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS_DATABASE["@texnoplov"]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"timing" | "earnings" | "videos" | "comments">("timing");
  const [comments, setComments] = useState<any[]>(CHANNELS_DATABASE["@texnoplov"].sampleComments);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autoReplyMode, setAutoReplyMode] = useState(false);

  // Kanalni analiz qilish
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const query = searchQuery.trim().toLowerCase();
      let matched = CHANNELS_DATABASE[query] || CHANNELS_DATABASE["@" + query];
      
      if (!matched) {
        // Agar topilmasa, dinamik tahlil generatori
        matched = {
          name: searchQuery.replace("@", ""),
          handle: searchQuery.startsWith("@") ? searchQuery : `@${searchQuery}`,
          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=60",
          subscribers: "85K",
          totalViews: "11.2M",
          totalVideos: "148",
          niche: "Blog & Ta'lim",
          rpm: "$2.60",
          rpmRange: "$2.10 - $3.80",
          monthlyEarnings: "$650 - $1,400",
          avgDuration: "10 daqiqa 15 soniya",
          retentionRate: "52%",
          bestDays: "Dushanba va Payshanba",
          bestTime: "19:00 - 20:30",
          aiInsight: `"${searchQuery}" kanali uchun asosiy o'sish nuqtasi — 8-12 daqiqalik muntazam videolar. Tomoshabinlar kechki 19:00 dan so'ng eng yuqori faollikni ko'rsatmoqda. Doimiy izohlarga javob qaytarish auditoriya sodiqligini 28% ga oshiradi.`,
          topVideos: [
            { title: `${searchQuery} — Eng mashhur va tomosha qilingan video`, views: "240K", duration: "11:30", date: "3 hafta oldin", time: "19:00" },
            { title: "Yangi boshlovchilar uchun foydali maslahatlar", views: "180K", duration: "09:45", date: "1 oy oldin", time: "19:30" }
          ],
          sampleComments: [
            { id: 101, author: "Otabek", lang: "O'zbekcha", text: "Juda foydali bo'libdi, keyingi qismini kutib qolamiz!", reply: "Katta rahmat, Otabek! Keyingi qism ustida ishlayapmiz, tez kunlarda chiqadi! 😊🔥", sent: false },
            { id: 102, author: "Dmitriy", lang: "Русский", text: "Спасибо за инфу! Все четко и по делу.", reply: "Привет, Дмитрий! Рад, что было полезно! Оставайся на связи! 🚀", sent: false }
          ]
        };
      }

      setSelectedChannel(matched);
      setComments(matched.sampleComments);
      setIsLoading(false);

      // Pastki dashboard bo'limiga yumshoq o'tish
      const el = document.getElementById("dashboard-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  // Izohga javob yuborish
  const handleSendReply = (id: number) => {
    setComments((prev: any[]) => prev.map(c => c.id === id ? { ...c, sent: true } : c));
  };

  // Auth simulyatsiyasi
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail) {
      setIsLoggedIn(true);
      setAuthModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-black text-xl tracking-wider">
              V
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-orange-500 bg-clip-text text-transparent">
                Vidoor
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                YouTube AI Platform
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                const el = document.getElementById("dashboard-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 px-3 py-1.5 transition"
            >
              Tahlil Paneli
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{authEmail.split("@")[0]} (Faol)</span>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="ml-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition"
                >
                  Kirish
                </button>
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
                >
                  Ro'yxatdan o'tish
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero & Real Qidiruv Maydoni */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.orange.50),white)] opacity-70" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-800 text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>YouTube kanallarni tahlil qilish va do'stona AI izohlar</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Kanal qanday o'sadi?{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              Vidoor bilan bilib oling!
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Videolarni soat nechida yuklash kerak? Yo'nalishdagi <strong>RPM</strong> va daromad qancha? Kanal linkini kiriting va barcha sirlarni oching.
          </p>

          {/* Qidiruv formasi */}
          <form onSubmit={handleAnalyze} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/70 border-2 border-emerald-500/40 p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
              <Search className="w-6 h-6 text-emerald-600 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="YouTube kanal nomi yoki linkini yozing (masalan: @texnoplov, @mrbeast)"
                className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base font-medium"
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
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500">
              <span>Tezkor namunalar:</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery("@texnoplov"); }} 
                className="font-bold text-emerald-600 hover:underline"
              >
                @texnoplov
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery("@mrbeast"); }} 
                className="font-bold text-orange-600 hover:underline"
              >
                @mrbeast
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Dinamik Tahlil Dashboard Bo'limi */}
      <section id="dashboard-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                <span>Yo'nalish: <strong className="text-slate-800">{selectedChannel.niche}</strong></span>
              </p>
            </div>
          </div>

          {/* Asosiy 3 ko'rsatkich */}
          <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="text-center px-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Obunachilar</span>
              <p className="text-xl font-extrabold text-slate-900">{selectedChannel.subscribers}</p>
            </div>
            <div className="text-center px-4 border-x border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase">Ko'rishlar</span>
              <p className="text-xl font-extrabold text-slate-900">{selectedChannel.totalViews}</p>
            </div>
            <div className="text-center px-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">Videolar</span>
              <p className="text-xl font-extrabold text-slate-900">{selectedChannel.totalVideos}</p>
            </div>
          </div>
        </div>

        {/* Tab Menyu (Interactive Tabs) */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-6">
          <button 
            onClick={() => setActiveTab("timing")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "timing"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
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
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
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
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
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
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Do'stona AI Izohlar ({comments.length})</span>
          </button>
        </div>

        {/* Tab Kontenti */}
        <div className="transition-all">
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
                  <p className="text-xs text-emerald-600 font-semibold mt-2">Dastlabki 2 soatda eng ko'p ko'rilgan</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase text-slate-400">Eng faol haftalik kunlar</span>
                  <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.bestDays}</p>
                  <p className="text-xs text-orange-600 font-semibold mt-2">Auditoriya dam olish kunlari faol</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase text-slate-400">O'rtacha video davomiyligi</span>
                  <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.avgDuration}</p>
                  <p className="text-xs text-teal-600 font-semibold mt-2">Retention: {selectedChannel.retentionRate} (Tomosha ulushi)</p>
                </div>
              </div>

              {/* AI Tavsiyasi */}
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
                  <span className="text-xs font-bold uppercase text-slate-400">Mavzu bo'yicha RPM (1000 ko'rish uchun daromad)</span>
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
                    So'nggi 30 kunlik ko'rishlar va reklama zichligi hisob-kitobi asosida.
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-sm text-orange-900 leading-relaxed">
                <strong>💡 Blogerlar uchun foydali maslahat:</strong> Har bir mavzuning RPM daromadi har xil bo'ladi. Masalan, Texnologiya va Moliya mavzularida reklama beruvchilar ko'p to'laydi (RPM $3 - $5+), kulgili videolar yoki memlarda esa ko'rishlar ko'p bo'lsa-da, RPM biroz pastroq ($1 - $2) bo'lishi mumkin.
              </div>
            </div>
          )}

          {/* TAB 3: Eng yaxshi videolar */}
          {activeTab === "videos" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <span>Kanalning eng ko'p ko'rilgan videolari sirlari</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {selectedChannel.topVideos.map((video: any, idx: number) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 hover:text-emerald-600 transition cursor-pointer">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span>Yuklangan vaqti: <strong>{video.time}</strong></span>
                          <span>Davomiyligi: <strong>{video.duration}</strong></span>
                          <span>Yuklangan sana: {video.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-sm">
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
                    AI izoh qaysi tilda yozilganini avtomatik aniqlab, o'sha tilda javob taklif qiladi.
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                  <span className="text-xs font-bold text-slate-700">To'liq avtomatik javob rejimi:</span>
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

              {/* Izohlar ro'yxati */}
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
                          Yuborildi
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

      {/* 4. Auth Modal (Kirish / Ro'yxatdan o'tish) */}
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

            <form onSubmit={handleAuthSubmit} className="space-y-4">
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
          <p>© 2026 Vidoor. YouTube ijodkorlari uchun mehr bilan yaratilgan. Muallif: <strong>Khan</strong></p>
        </div>
      </footer>
    </div>
  );
}
