"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"explore" | "myChannel">("explore");
  const [searchQuery, setSearchQuery] = useState("@mittivine");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"timing" | "earnings" | "videos" | "comments">("timing");
  const [comments, setComments] = useState<any[]>([]);

  // Blogerning o'z kanali
  const [myChannelConnected, setMyChannelConnected] = useState(false);
  const [myChannelLink, setMyChannelLink] = useState("");
  const [myChannelData, setMyChannelData] = useState<any>(null);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Boshlang'ich kanalni yuklash
  useEffect(() => {
    fetchChannel("@mittivine");
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

  // Kanalni tahlil qilish
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
                100% Bepul va Limitsiz
              </span>
            </div>
          </div>

          {/* Rejimlar tugmasi */}
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

          {/* Bepul badge va Auth */}
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3.5 h-3.5 mr-1 text-orange-500" />
              VidIQ-ga bepul muqobil
            </span>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700">
                <span>{authEmail.split("@")[0]}</span>
                <button onClick={() => setIsLoggedIn(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                Kirish
              </button>
            )}
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
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>100% Bepul, limitsiz va kalitlarsiz jonli YouTube tahlili</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Dunyodagi istalgan YouTube kanalini{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                  bepul va limitsiz analiz qiling
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                VidIQ kabi pullik dasturlarga pul to'lamasdan — real yuklangan soatlar, haqiqiy videolar, taxminiy <strong>RPM</strong> va daromadni bepul bilib oling!
              </p>

              {/* Universal Free Search Bar */}
              <form onSubmit={handleAnalyze} className="mt-8 max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/70 border-2 border-emerald-500/40 p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
                  <Search className="w-6 h-6 text-emerald-600 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="YouTube kanal nomi yoki linkini yozing (masalan: mittivine, mrbeast, subhoniy, texnoplov)"
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
                  <span className="font-semibold text-slate-400">Sinab ko'ring:</span>
                  <button type="button" onClick={() => { setSearchQuery("mittivine"); fetchChannel("mittivine"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500">
                    🇺🇿 mittivine
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("texnoplov"); fetchChannel("texnoplov"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500">
                    🇺🇿 texnoplov
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("subhoniy"); fetchChannel("subhoniy"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500">
                    🇺🇿 subhoniy
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("mrbeast"); fetchChannel("mrbeast"); }} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-bold text-orange-600 hover:border-orange-500">
                    🇺🇸 mrbeast
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* HAQIQIY NATIJA PANELI */}
          {selectedChannel && (
            <section id="analysis-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                    {selectedChannel.name.charAt(0)}
                  </div>
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
                      <span>Mavzu: <strong className="text-slate-800">{selectedChannel.niche}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <div className="text-center px-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Kanal Holati</span>
                    <p className="text-xl font-black text-emerald-600">Faol ✓</p>
                  </div>
                  <div className="text-center px-4 border-x border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">So'nggi Ko'rishlar</span>
                    <p className="text-xl font-black text-slate-900">{selectedChannel.totalViews}</p>
                  </div>
                  <div className="text-center px-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tahlil Qilingan</span>
                    <p className="text-xl font-black text-slate-900">{selectedChannel.totalVideos}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
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
                  <span>Haqiqiy So'nggi Videolar ({selectedChannel.topVideos?.length || 0})</span>
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

              {/* Tab Contenti */}
              <div>
                {/* 1. VAQT VA DAVOMIYLIK */}
                {activeTab === "timing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Eng ko'p video yuklangan soat</span>
                        <p className="text-3xl font-black text-slate-900 mt-2">{selectedChannel.bestTime}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-2">So'nggi videolar sanalari tahlili asosida</p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Eng faol haftalik kun</span>
                        <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.bestDays}</p>
                        <p className="text-xs text-orange-600 font-semibold mt-2">Kanalning video chiqarish odati</p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Optimal davomiylik</span>
                        <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.avgDuration}</p>
                        <p className="text-xs text-teal-600 font-semibold mt-2">Retention ulushi: {selectedChannel.retentionRate}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-800 shadow-lg">
                      <div className="flex items-center space-x-2 text-emerald-400 mb-2 font-bold text-sm">
                        <Sparkles className="w-5 h-5 text-orange-400" />
                        <span>Vidoor AI Xulosasi:</span>
                      </div>
                      <p className="text-slate-200 text-base leading-relaxed">
                        {selectedChannel.aiInsight}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. RPM VA DAROMAD */}
                {activeTab === "earnings" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Yo'nalish bo'yicha hisoblangan RPM</span>
                        <p className="text-4xl font-black text-orange-500 mt-2">{selectedChannel.rpm}</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Kanal mavzusi (<strong>{selectedChannel.niche}</strong>) bo'yicha 1000 ko'rish narxi: <strong className="text-slate-700">{selectedChannel.rpmRange}</strong>
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400">Taxminiy oylik daromad</span>
                        <p className="text-4xl font-black text-emerald-600 mt-2">{selectedChannel.monthlyEarnings}</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Kanalning so'nggi faolligi va reklama daromadlari hisob-kitobi.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HAQIQIY VIDEOLAR */}
                {activeTab === "videos" && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-emerald-600" />
                      <span>YouTube-dan olingan haqiqiy jonli videolar</span>
                    </h3>

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
                                className="font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition"
                              >
                                <span>{video.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                              </a>
                              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                <span>Yuklangan vaqti: <strong>{video.time} ({video.day})</strong></span>
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

                {/* 4. DO'STONA AI IZOHLAR */}
                {activeTab === "comments" && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Izohlarga do'stona va samimiy AI javoblar</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Izoh tili bo'yicha (o'zbek, rus, ingliz) moslashgan samimiy AI javoblar.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {comments.map((comment: any) => (
                        <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
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
                              <span>AI do'stona javob taklifi ({comment.lang}):</span>
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
              <h2 className="text-2xl font-black text-slate-900">O'z YouTube Kanalingizni Ulang</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Kanal nomingizni kiriting. Vidoor sizning videolaringizning yuklanish soatlari va izohlarga o'sha tilda avtomatik javob berishni yoqadi. 100% bepul.
              </p>

              <form onSubmit={handleConnectMyChannel} className="mt-6 space-y-3">
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={myChannelLink}
                    onChange={(e) => setMyChannelLink(e.target.value)}
                    placeholder="Masalan: mittivine yoki kanalingiz nomi"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Kanalni Birlashtirish</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-orange-950 text-white rounded-3xl p-8 border border-emerald-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ulangan Shaxsiy Kanal</span>
                  <h2 className="text-3xl font-black mt-1">{myChannelData.name}</h2>
                  <p className="text-xs text-slate-300 mt-1">{myChannelData.handle} • {myChannelData.niche}</p>
                </div>

                <button 
                  onClick={() => setMyChannelConnected(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10"
                >
                  Boshqa kanal ulash
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Eng optimal soatingiz</span>
                  <p className="text-3xl font-black text-orange-500 mt-2">{myChannelData.bestTime}</p>
                  <p className="text-xs text-slate-500 mt-2">{myChannelData.bestDays} kunlari eng faol</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Optimal davomiylik</span>
                  <p className="text-3xl font-black text-slate-900 mt-2">{myChannelData.avgDuration}</p>
                  <p className="text-xs text-slate-500 mt-2">Eng yaxshi natija beruvchi hajm</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400">Yo'nalishingiz RPM ko'rsatkichi</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{myChannelData.rpm}</p>
                  <p className="text-xs text-slate-500 mt-2">1000 ta ko'rish uchun daromad</p>
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
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (authEmail) { setIsLoggedIn(true); setAuthModalOpen(false); } }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input 
                  type="email"
                  required
                  placeholder="khan@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parol</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md text-sm"
              >
                Kirish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Vidoor. Bepul va limitsiz YouTube tahlil platformasi. Muallif: <strong>Khan</strong></p>
        </div>
      </footer>
    </div>
  );
}
