"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  Youtube,
  Video,
  RefreshCw,
  Calendar,
  Zap,
  Globe,
  PlusCircle,
  Check,
  Award,
  Link as LinkIcon,
  AlertCircle,
  ExternalLink,
  Flame,
  Star,
  Copy,
  CheckCircle,
  BarChart3,
  Users
} from "lucide-react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"explore" | "myChannel">("explore");
  const [searchQuery, setSearchQuery] = useState("texnoplov");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"earnings" | "timing" | "videos" | "comments">("earnings");
  const [comments, setComments] = useState<any[]>([]);

  // AI Izoh Yordamchisi uchun maxsus izoh sinovi
  const [customCommentText, setCustomCommentText] = useState("");
  const [customCommentAuthor, setCustomCommentAuthor] = useState("");
  const [customCommentLang, setCustomCommentLang] = useState<"O'zbekcha" | "Русский" | "English">("O'zbekcha");
  const [customCommentTone, setCustomCommentTone] = useState<"warm" | "professional" | "funny" | "gratitude">("warm");
  const [generatedCustomReply, setGeneratedCustomReply] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  // Blogerning o'z kanali
  const [myChannelConnected, setMyChannelConnected] = useState(false);
  const [myChannelLink, setMyChannelLink] = useState("");
  const [myChannelData, setMyChannelData] = useState<any>(null);

  // Boshlang'ich kanalni yuklash
  useEffect(() => {
    fetchChannel("texnoplov");
  }, []);

  const fetchChannel = async (query: string) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setIsLoading(false);
        return;
      }

      setSelectedChannel(data);
      setComments(data.sampleComments || []);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMsg("Internet xatoligi: " + err.message);
      setIsLoading(false);
    }
  };

  // Kanalni qidirish
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    fetchChannel(searchQuery);
    const el = document.getElementById("analysis-results");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // O'z kanalini ulash
  const handleConnectMyChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myChannelLink.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(myChannelLink)}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setIsLoading(false);
        return;
      }

      setMyChannelData(data);
      setMyChannelConnected(true);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  // Nusxalash funksiyasi
  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  // Maxsus izohga AI javob yaratish
  const handleGenerateCustomReply = async () => {
    if (!customCommentText.trim()) return;
    setIsGeneratingReply(true);

    try {
      const res = await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: customCommentText,
          author: customCommentAuthor.trim() || "Muxlis",
          lang: customCommentLang,
          tone: customCommentTone,
          channelName: selectedChannel?.name || "Kanalimiz"
        })
      });
      const data = await res.json();
      if (data.reply) {
        setGeneratedCustomReply(data.reply);
      }
    } catch (e: any) {
      setGeneratedCustomReply("AI javob yaratishda xatolik yuz berdi: " + e.message);
    } finally {
      setIsGeneratingReply(false);
    }
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
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                VidIQ Raqobatchisi • 100% Bepul
              </span>
            </div>
          </div>

          {/* Rejimlar: Dunyo kanallari vs Mening kanalim */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("explore")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "explore"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Kanal Analitikasi & Daromad</span>
            </button>
            <button
              onClick={() => setViewMode("myChannel")}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "myChannel"
                  ? "bg-gradient-to-r from-emerald-600 to-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Mening Kanalim {myChannelConnected && "✓"}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3.5 h-3.5 mr-1 text-orange-500" />
              100% Bepul & Limitsiz
            </span>
          </div>
        </div>
      </header>

      {/* 2. EXPLORE VIEW */}
      {viewMode === "explore" && (
        <>
          <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200/80">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.orange.50),white)] opacity-70" />
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Kanalning barcha videolari hisoblangan aniq 1 oylik daromad tahlili</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Kanal 1 oyda o'rtacha qancha daromad oladi?{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                  Aniq ko'ring
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Kanalda nechta obunachi bor? Nechta umumiy video qo'yilgan? Barcha videolari hisobga olinganda 1 oyda taxminan qancha (masalan: <strong>19k$ - 25k$</strong>) daromad oladi? Kanal nomini yozing va aniq ko'ring!
              </p>

              {/* Qidiruv formasi */}
              <form onSubmit={handleAnalyze} className="mt-8 max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/70 border-2 border-emerald-500/40 p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
                  <Search className="w-6 h-6 text-emerald-600 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kanal nomi yoki linki (masalan: texnoplov, mittivine, mrbeast, subyektiv, kunuz)"
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

                {errorMsg && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">Tezkor namunalar:</span>
                  <button type="button" onClick={() => { setSearchQuery("texnoplov"); fetchChannel("texnoplov"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 texnoplov
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("mittivine"); fetchChannel("mittivine"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 mittivine
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("subyektiv"); fetchChannel("subyektiv"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 subyektiv
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("mrbeast"); fetchChannel("mrbeast"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-orange-600 hover:border-orange-500 shadow-2xs">
                    🇺🇸 mrbeast
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("kunuz"); fetchChannel("kunuz"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 kun.uz
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* HAQIQIY VIDIQ DARAJASIDAGI NATIJA PANELI */}
          {selectedChannel && (
            <section id="analysis-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Kanal Asosiy Kartasi: Obunachilar, Umumiy videolar, Jami ko'rishlar */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img 
                    src={selectedChannel.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChannel.name)}&background=10b981&color=fff`} 
                    alt={selectedChannel.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-emerald-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedChannel.name}</h2>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {selectedChannel.handle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-3">
                      <span>Mintaqa: <strong className="text-slate-800">{selectedChannel.country}</strong></span>
                      <span>•</span>
                      <span>Yo'nalish: <strong className="text-slate-800">{selectedChannel.niche}</strong></span>
                      <span>•</span>
                      <span>Ochilgan sana: <strong className="text-slate-800">{selectedChannel.joinedDate}</strong></span>
                    </div>
                  </div>
                </div>

                {/* ANIQ KO'RSATKICHLAR: Obunachilar, Barcha videolar, Jami ko'rishlar */}
                <div className="flex items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <div className="text-center px-3">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Obunachilar
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{selectedChannel.subscribers}</p>
                  </div>

                  <div className="text-center px-3 border-x border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Video className="w-3.5 h-3.5 text-orange-500" />
                      Umumiy Videolar
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{selectedChannel.totalVideos}</p>
                  </div>

                  <div className="text-center px-3">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                      Jami Ko'rishlar
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{selectedChannel.totalViews}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-6">
                <button 
                  onClick={() => setActiveTab("earnings")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === "earnings"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>1 Oylik Daromad (Barcha videolar)</span>
                </button>

                <button 
                  onClick={() => setActiveTab("timing")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === "timing"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Yuklash Soatlari & Davomiylik (UZT)</span>
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
                  <span>Oxirgi Videolari ({selectedChannel.topVideos?.length || 0})</span>
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
                  <span>AI Izohlar Yordamchisi</span>
                </button>
              </div>

              {/* Tab Contenti */}
              <div>
                {/* 1. 1 OYLIK O'RTACHA DAROMAD VA BARCHA VIDEOLAR HISOBI */}
                {activeTab === "earnings" && (
                  <div className="space-y-6">
                    {/* BOSH HERO KARTA: 1 Oylik Daromad Diapazoni (masalan: 19k$ - 25k$) */}
                    <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-8 shadow-xl shadow-emerald-700/20 relative overflow-hidden">
                      <div className="absolute right-4 top-4 opacity-10">
                        <DollarSign className="w-36 h-36" />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Kanalning barcha videolari hisoblangan holda</span>
                          </div>
                          <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-200 block">
                            1 Oylik O'rtacha Taxminiy Daromad:
                          </span>
                          {/* FOYDALANUVCHI SO'RAGAN ANIQ FORMAT (masalan: 19k$ - 25k$) */}
                          <div className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-2">
                            {selectedChannel.monthlyEarningsK}
                          </div>
                          <p className="text-sm text-emerald-100 mt-2 font-semibold">
                            Aniq oraliq: <strong>{selectedChannel.monthlyEarningsFull}</strong>
                          </p>
                        </div>

                        {/* Oylik hisob-kitob ko'rsatkichlari */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-3 min-w-[240px]">
                          <div>
                            <span className="text-xs text-emerald-200 block">Katalog oylik ko'rishlari:</span>
                            <span className="text-xl font-black text-white">{selectedChannel.estimatedMonthlyViews} ko'rish/oy</span>
                          </div>
                          <div className="border-t border-white/10 pt-2">
                            <span className="text-xs text-emerald-200 block">1 ta video uchun o'rtacha tushum:</span>
                            <span className="text-lg font-black text-orange-300">{selectedChannel.perVideoEarnings}</span>
                          </div>
                          <div className="border-t border-white/10 pt-2">
                            <span className="text-xs text-emerald-200 block">1 000 ko'rish uchun RPM:</span>
                            <span className="text-sm font-bold text-white">{selectedChannel.rpmRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KANALNING BARCHA VIDEOLARI BO'YICHA STATISTIKA KARTALARI */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Kanal Obunachilari</span>
                        <p className="text-3xl font-black text-slate-900 mt-1">{selectedChannel.subscribers}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          YouTube rasmiy hisoblagichidan
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                          <Video className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Umumiy Qo'yilgan Videolar</span>
                        <p className="text-3xl font-black text-orange-600 mt-1">{selectedChannel.totalVideos}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Kanalning barcha videolari soni
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Jami Ko'rishlar</span>
                        <p className="text-2xl font-black text-slate-900 mt-1">{selectedChannel.totalViews}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Kanal ochilganidan buyon barcha ko'rishlar
                        </p>
                      </div>
                    </div>

                    {/* Shaffof hisob-kitob izohi */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span>VidIQ & SocialBlade algoritmi bo'yicha hisob-kitob asosi:</span>
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        Ushbu hisob-kitob faqat oxirgi videolar bilan cheklanmay, kanalning <strong>barcha {selectedChannel.totalVideos}</strong>, <strong>{selectedChannel.subscribers} obunachilar bazasi</strong> va <strong>{selectedChannel.totalViews}</strong> ko'rishlari oqimiga tayangan holda chiqarildi. Kanalning yo'nalishi (<strong>{selectedChannel.niche}</strong>) va mintaqasi bo'yicha 1 000 ko'rish uchun RPM stavkasi {selectedChannel.rpmRange} oralig'ida baholandi.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. YUKLASH SOATLARI VA DAVOMIYLIK */}
                {activeTab === "timing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Eng ko'p yuklangan soat</span>
                        <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.bestTime}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-2">O'zbekiston vaqti (Toshkent UTC+5) bilan</p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Eng faol haftalik kun</span>
                        <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.bestDays}</p>
                        <p className="text-xs text-orange-600 font-semibold mt-2">Auditoriya eng ko'p kiradigan kunlar</p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Optimal Video Davomiyligi</span>
                        <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.avgDuration}</p>
                        <p className="text-xs text-teal-600 font-semibold mt-2">Auditoriya saqlanishi: {selectedChannel.retentionRate}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-800 shadow-lg">
                      <div className="flex items-center space-x-2 text-emerald-400 mb-2 font-bold text-sm">
                        <Sparkles className="w-5 h-5 text-orange-400" />
                        <span>AI Tavsiyasi:</span>
                      </div>
                      <p className="text-slate-200 text-base leading-relaxed">
                        {selectedChannel.aiInsight}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. OXIRGI VIDEOLARI */}
                {activeTab === "videos" && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-5 h-5 text-emerald-600" />
                        <span>YouTube-dan olingan so'nggi videolar</span>
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">
                        Umumiy videolar: <strong className="text-slate-900">{selectedChannel.totalVideos}</strong>
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {selectedChannel.topVideos?.map((video: any, idx: number) => (
                        <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <a 
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition text-sm sm:text-base"
                              >
                                <span>{video.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                              </a>
                              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                <span>Yuklangan soati: <strong className="text-slate-800">{video.time}</strong></span>
                                <span>Kuni: <strong className="text-slate-800">{video.day}</strong></span>
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

                {/* 4. AI IZOHLAR YORDAMCHISI */}
                {activeTab === "comments" && (
                  <div className="space-y-8">
                    {/* Maxsus yangi izoh sinash paneli */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-200 shadow-sm space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-orange-500" />
                        <div>
                          <h3 className="text-lg font-black text-slate-900">Yordamchi AI Dasturi: Izohlarga Do'stona Javob Yaratish</h3>
                          <p className="text-xs text-slate-500">
                            Muxlisingiz yozgan izohni kiriting, AI unga mos tilda (o'zbek, rus, ingliz) va kerakli ohangda do'stona javob tayyorlaydi.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Muxlis ismi / Taxallusi:</label>
                          <input 
                            type="text" 
                            value={customCommentAuthor}
                            onChange={(e) => setCustomCommentAuthor(e.target.value)}
                            placeholder="Masalan: Sardor_99 yoki Alex"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="text-xs font-bold text-slate-700 block mb-1">Javob tili:</label>
                            <select 
                              value={customCommentLang}
                              onChange={(e: any) => setCustomCommentLang(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm bg-white focus:outline-none focus:border-emerald-500"
                            >
                              <option value="O'zbekcha">O'zbekcha</option>
                              <option value="Русский">Русский</option>
                              <option value="English">English</option>
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="text-xs font-bold text-slate-700 block mb-1">Javob ohangi:</label>
                            <select 
                              value={customCommentTone}
                              onChange={(e: any) => setCustomCommentTone(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm bg-white focus:outline-none focus:border-emerald-500"
                            >
                              <option value="warm">🔥 Samimiy va do'stona</option>
                              <option value="professional">💼 Professional</option>
                              <option value="funny">😂 Hazilomuz</option>
                              <option value="gratitude">❤️ Minnatdorchilik</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Kelgan izoh matni:</label>
                        <textarea
                          rows={2}
                          value={customCommentText}
                          onChange={(e) => setCustomCommentText(e.target.value)}
                          placeholder="Muxlis yozgan izohni bu yerga qo'ying (masalan: Yangi video qachon chiqadi? Juda kutmoqdamiz!)"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={handleGenerateCustomReply}
                        disabled={isGeneratingReply || !customCommentText.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2 text-sm disabled:opacity-50"
                      >
                        {isGeneratingReply ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>AI Javob yozmoqda...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>AI Javob Yaratish</span>
                          </>
                        )}
                      </button>

                      {/* Generatsiya qilingan javob */}
                      {generatedCustomReply && (
                        <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              Tayyor bo'lgan javob ({customCommentLang}):
                            </span>
                            <button
                              onClick={() => handleCopy(generatedCustomReply, "custom-reply")}
                              className="flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
                            >
                              {copiedId === "custom-reply" ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Nusxalandi! ✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Nusxalash</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-900 font-medium text-sm leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-200">
                            {generatedCustomReply}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Kanalning namunalari */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <h4 className="text-base font-bold text-slate-900">Ushbu kanalning so'nggi izohlari va AI javoblari:</h4>
                      <div className="space-y-4">
                        {comments.map((comment: any) => (
                          <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-slate-800">{comment.author}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                                  {comment.lang}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-slate-700 mb-3 bg-white p-3 rounded-lg border border-slate-200/60 font-medium">
                              "{comment.text}"
                            </p>

                            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-lg">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                  <span>AI do'stona javobi ({comment.lang}):</span>
                                </span>
                                <button
                                  onClick={() => handleCopy(comment.reply, comment.id)}
                                  className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition"
                                >
                                  {copiedId === comment.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Nusxalandi!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-600" />
                                      <span>Nusxalash</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-sm text-slate-800 font-medium italic">
                                {comment.reply}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* 3. MY CHANNEL VIEW */}
      {viewMode === "myChannel" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!myChannelConnected ? (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-500/50 shadow-xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Youtube className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">O'z YouTube Kanalingizni Birlashtiring</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Kanal nomingizni yoki havolangizni kiriting. Vidoor kanalingizdagi barcha videolar bo'yicha 1 oylik o'rtacha daromadni, yuklash soatlarini va izohlarga javob beruvchi AI dasturini ochib beradi. 100% bepul.
              </p>

              <form onSubmit={handleConnectMyChannel} className="mt-6 space-y-3">
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    required
                    value={myChannelLink}
                    onChange={(e) => setMyChannelLink(e.target.value)}
                    placeholder="Masalan: texnoplov, mittivine yoki kanalingiz nomi"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Kanal yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Kanalni Birlashtirish</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Ulangan kanal kartasi */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-orange-950 text-white rounded-3xl p-8 border border-emerald-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img 
                    src={myChannelData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(myChannelData.name)}&background=10b981&color=fff`} 
                    alt={myChannelData.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ulangan Shaxsiy Kanal</span>
                    <h2 className="text-3xl font-black mt-1">{myChannelData.name}</h2>
                    <p className="text-xs text-slate-300 mt-1">{myChannelData.handle} • {myChannelData.subscribers} obunachi • {myChannelData.totalVideos} • {myChannelData.niche}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setMyChannelConnected(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 self-start md:self-auto"
                >
                  Boshqa kanal ulash
                </button>
              </div>

              {/* Shaxsiy kanal ko'rsatkichlari */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">1 Oylik O'rtacha Daromadingiz</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{myChannelData.monthlyEarningsK}</p>
                  <p className="text-xs text-slate-500 mt-2">{myChannelData.monthlyEarningsFull}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Optimal yuklash soatingiz</span>
                  <p className="text-3xl font-black text-orange-500 mt-2">{myChannelData.bestTime}</p>
                  <p className="text-xs text-slate-500 mt-2">{myChannelData.bestDays} kunlari auditoriya eng faol</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">1 ta video uchun daromad</span>
                  <p className="text-3xl font-black text-slate-900 mt-2">{myChannelData.perVideoEarnings}</p>
                  <p className="text-xs text-slate-500 mt-2">1000 ko'rish uchun RPM: {myChannelData.rpmRange}</p>
                </div>
              </div>

              {/* Auditoriyani ushlab qolish (Retention) checklisti */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Auditoriyani Ushlab Qolish (Retention) Bo'yicha Maxsus Maslahatlar</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-xs font-black text-emerald-800 block mb-1">1. Dastlabki 30 soniya (Hook)</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Kirish so'zlarini cho'zmang. Videoning eng qiziq nuqtasini birinchi 5 soniyada ko'rsatib, tomoshabinni ekranga mixlang.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
                    <span className="text-xs font-black text-orange-800 block mb-1">2. Dinamik kadrlarni almashtirish</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Har 4-6 soniyada kamera burchagini yoki matn/sound effektlarini yangilang. Bu miyaning charchashini oldini oladi.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                    <span className="text-xs font-black text-teal-800 block mb-1">3. Yakuniy tavsiya (End Screen)</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "Xayr salomat bo'ling" demasdan, darhol keyingi tomosha qilinishi kerak bo'lgan videongizga o'tishni tavsiya qiling.
                    </p>
                  </div>
                </div>
              </div>

              {/* O'z kanalidagi videolar */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span>Kanalingizdagi so'nggi videolar ({myChannelData.topVideos?.length || 0})</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  {myChannelData.topVideos?.map((video: any, idx: number) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <a 
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition text-sm"
                        >
                          <span>{video.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                        <div className="text-xs text-slate-500 mt-1">
                          Yuklangan: <strong>{video.time}</strong> • {video.day} • {video.date}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs self-start sm:self-auto">
                        {video.views} ko'rish
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Vidoor. VidIQ va SocialBlade darajasidagi bepul tahlil platformasi. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
