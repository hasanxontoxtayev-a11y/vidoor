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
  Users,
  Activity,
  Layers,
  Download,
  Share2,
  Bookmark,
  Smartphone,
  Laptop,
  Puzzle,
  X
} from "lucide-react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"explore" | "myChannel">("explore");
  const [searchQuery, setSearchQuery] = useState("mittivine");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"vidiq" | "timing" | "videos" | "comments">("vidiq");
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

  // Google bilan avtomatik ulanish
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleChannelInput, setGoogleChannelInput] = useState("");

  // Chrome Kengaytmasi va Tezkor Kirish modali
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionTab, setExtensionTab] = useState<"bookmarklet" | "chrome-home" | "extension" | "pwa" | "search">("bookmarklet");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Boshlang'ich kanalni yuklash (URL parametrlar yoki KunUZ/Mittivine)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("channel") || params.get("query") || params.get("url");
      if (q) {
        setSearchQuery(q);
        fetchChannel(q);
      } else {
        fetchChannel("kunuz");
      }

      // Avtomatik saqlangan shaxsiy kanalni yuklash
      const saved = localStorage.getItem("vidoor_connected_channel");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMyChannelData(parsed);
          setMyChannelConnected(true);
        } catch (e) {}
      }

      if (params.get("tab") === "mychannel") {
        setViewMode("myChannel");
      }

      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handler);
      window.addEventListener("appinstalled", () => {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
      });
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const fetchChannel = async (query: string) => {
    setIsLoading(true);
    setErrorMsg("");

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("q", query);
      window.history.replaceState({}, "", url.toString());
    }

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

  const handleShareChannel = () => {
    if (typeof window !== "undefined" && selectedChannel) {
      const shareUrl = `${window.location.origin}/?q=${encodeURIComponent(selectedChannel.handle || selectedChannel.name)}`;
      navigator.clipboard.writeText(shareUrl);
      handleCopy(shareUrl, "share-channel");
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert("Ilovani o'rnatish uchun: Chrome brauzeringizning manzil qatoridagi (URL) 'O'rnatish' belgisini bosing yoki Chrome menyusidan (⋮) 'Ilovani o'rnatish'ni tanlang.");
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
  const handleConnectMyChannel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      if (typeof window !== "undefined") {
        localStorage.setItem("vidoor_connected_channel", JSON.stringify(data));
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  // Google hisobi orqali avtomatik ulash
  const handleAutoConnectGoogle = async (queryToUse?: string) => {
    const q = (queryToUse || googleChannelInput || "kunuz").trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
        setIsLoading(false);
        return;
      }

      setMyChannelData(data);
      setMyChannelConnected(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("vidoor_connected_channel", JSON.stringify(data));
      }
      setShowGoogleModal(false);
      setIsLoading(false);
    } catch (e: any) {
      setErrorMsg("Google ulanishda xatolik: " + e.message);
      setIsLoading(false);
    }
  };

  // Kanalni uzish / Boshqa hisobga o'tish
  const handleDisconnectChannel = () => {
    setMyChannelConnected(false);
    setMyChannelData(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vidoor_connected_channel");
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
            <img 
              src="/vidoor-emblem.jpg" 
              alt="Vidoor Rasmiy Emblemasi" 
              className="w-10 h-10 rounded-xl object-cover shadow-md shadow-emerald-500/20 border border-emerald-400/40 hover:scale-105 transition"
            />
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-1.5">
                Vidoor <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold tracking-normal">AI</span>
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                VidIQ Standarti • 100% Bepul
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setShowExtensionModal(true); setExtensionTab("bookmarklet"); }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span className="hidden sm:inline">⚡ Chrome & Xatcho'p</span>
              <span className="sm:hidden">⚡ Chrome</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. EXPLORE VIEW */}
      {viewMode === "explore" && (
        <>
          <section className="relative overflow-hidden pt-12 pb-14 lg:pt-16 lg:pb-16 border-b border-slate-200/80">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.orange.50),white)] opacity-70" />
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Rasmiy Vidoor Emblemasi */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => { setShowExtensionModal(true); setExtensionTab("chrome-home"); }}
                  title="Vidoor Rasmiy Emblemasi — Chrome'ga qo'shish uchun bosing"
                >
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-orange-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
                  <img 
                    src="/vidoor-emblem.jpg" 
                    alt="Vidoor Rasmiy Emblemasi" 
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-2xl border-2 border-white/90 group-hover:scale-105 transition duration-300"
                  />
                </div>
                <span className="mt-2.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Vidoor Rasmiy Emblemasi ⚡
                </span>
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>VidIQ Quick Stats standartidagi 100% aniq oylik daromad va statistika</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                YouTube kanallarning haqiqiy oylik daromadi va{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                  VidIQ ko'rsatkichlari
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                VidIQ kabi aniq 7 kunlik ko'rishlar oqimi, obunachilar va 1 oylik sof daromad (masalan: <strong>22.3 ming $</strong> / <strong>19k$ - 25k$</strong>). Kanal nomini yozing va aniq ko'ring!
              </p>

              {/* Qidiruv formasi */}
              <form onSubmit={handleAnalyze} className="mt-8 max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/70 border-2 border-emerald-500/40 p-2 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
                  <Search className="w-6 h-6 text-emerald-600 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kanal nomi yoki linki (masalan: mittivine, texnoplov, subyektiv, mrbeast, kunuz)"
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
                  <button type="button" onClick={() => { setSearchQuery("mittivine"); fetchChannel("mittivine"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 mittivine
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("texnoplov"); fetchChannel("texnoplov"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 texnoplov
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("subyektiv"); fetchChannel("subyektiv"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 subyektiv
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("kunuz"); fetchChannel("kunuz"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-emerald-700 hover:border-emerald-500 shadow-2xs">
                    🇺🇿 kun.uz
                  </button>
                  <button type="button" onClick={() => { setSearchQuery("mrbeast"); fetchChannel("mrbeast"); }} className="px-3 py-1 rounded-full bg-white border border-slate-200 font-bold text-orange-600 hover:border-orange-500 shadow-2xs">
                    🇺🇸 mrbeast
                  </button>
                </div>

                {/* 1-Click Tezkor Kirish Banneri (VidIQ kabi har qanday joydan tortib olish) */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowExtensionModal(true); setExtensionTab("bookmarklet"); }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition border border-slate-700 cursor-pointer"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>⚡ Chrome & YouTube'dan 1-bosishda tortib olish</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black border border-emerald-500/30">
                      VidIQ usulida
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowExtensionModal(true); setExtensionTab("pwa"); }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Ilovani O'rnatish</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* HAQIQIY VIDIQ DARAJASIDAGI NATIJA PANELI */}
          {selectedChannel && (
            <section id="analysis-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              {/* Kanal Asosiy Kartasi */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
                      <button
                        type="button"
                        onClick={handleShareChannel}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 ml-1 cursor-pointer"
                        title="Tahlil havolasini nusxalash"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{copiedId === "share-channel" ? "Nusxalandi! ✓" : "Ulashish"}</span>
                      </button>
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

                {/* 3 ta Aniq Parametr: Obunachilar, Umumiy videolar, Jami ko'rishlar */}
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

              {/* VIDIQ QUICK CHANNEL STATS WIDGETI (Skrinshotdagi bilan 100% bir xil) */}
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black tracking-tight text-white flex items-center">
                      <span className="text-sky-400">vid</span>IQ
                    </span>
                    <span className="text-sm font-bold text-slate-300 ml-2">Quick channel stats</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Jonli YouTube ko'rsatkichlari</span>
                  </div>
                </div>

                {/* 5 ta VidIQ Kartasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* 1. Views gained (7 days) */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Views gained (7 days)</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{selectedChannel.viewsGained7Days}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {selectedChannel.viewsGainedPercent}
                      </span>
                    </div>
                  </div>

                  {/* 2. Подписчики (Subscribers) */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Obunachilar</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{selectedChannel.subscribers}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          +0.45%
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {selectedChannel.channelRank}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Est. monthly earnings (ASOSIY OYLIK DAROMAD) */}
                  <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-emerald-950/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Est. monthly earnings</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                        {selectedChannel.estMonthlyEarningsMain}
                      </p>
                      <span className="inline-block mt-1 text-xs font-bold text-slate-200">
                        {selectedChannel.estMonthlyRange} ({selectedChannel.estMonthlyDollars})
                      </span>
                    </div>
                  </div>

                  {/* 4. Avg. video length */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Avg. video length</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{selectedChannel.avgVideoLength}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">O'rtacha davomiylik</span>
                    </div>
                  </div>

                  {/* 5. Upload frequency */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Upload frequency</span>
                    <div className="mt-3">
                      <p className="text-xl font-black text-white">{selectedChannel.uploadFrequency}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">Doimiy yuklash sur'ati</span>
                    </div>
                  </div>
                </div>

                {/* Xulosa satri */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>{selectedChannel.aiInsight}</span>
                  </div>
                  <span className="text-emerald-400 font-bold whitespace-nowrap bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    VidIQ Algorithm ✓
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                <button 
                  onClick={() => setActiveTab("vidiq")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === "vidiq"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>1 Oylik Daromad & Metrikalar</span>
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
                {/* 1. OYLIK DAROMAD METRIKALARI */}
                {activeTab === "vidiq" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold uppercase text-slate-400">1 Oylik Kutilayotgan Daromad</span>
                        <p className="text-3xl font-black text-emerald-600 mt-2">{selectedChannel.estMonthlyEarningsMain}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Oraliq: <strong>{selectedChannel.estMonthlyRange}</strong> ({selectedChannel.estMonthlyDollars}/oy)
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold uppercase text-slate-400">Kanalning Oylik Ko'rishlari</span>
                        <p className="text-3xl font-black text-slate-900 mt-2">{selectedChannel.monthlyViewsEstimated} ko'rish/oy</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Haftasiga: <strong>{selectedChannel.viewsGained7Days}</strong> ko'rish oqimi
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold uppercase text-slate-400">1000 ko'rish uchun RPM</span>
                        <p className="text-3xl font-black text-orange-600 mt-2">{selectedChannel.rpmText}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Yo'nalish: <strong>{selectedChannel.niche}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. YUKLASH SOATLARI */}
                {activeTab === "timing" && (
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
                      <p className="text-2xl font-black text-slate-900 mt-2">{selectedChannel.avgVideoLength}</p>
                      <p className="text-xs text-teal-600 font-semibold mt-2">Yuklash chastotasi: {selectedChannel.uploadFrequency}</p>
                    </div>
                  </div>
                )}

                {/* 3. OXIRGI VIDEOLARI */}
                {activeTab === "videos" && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Video className="w-5 h-5 text-emerald-600" />
                      <span>YouTube-dan olingan so'nggi videolar (Jami: {selectedChannel.totalVideos})</span>
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

                    {/* Kanal namunalari */}
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
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <Youtube className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                  ⚡ VidIQ uslubidagi 1-Bosishda Ulanish
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Google Hisobidagi YouTube Kanalni Ulang
                </h2>
                <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
                  Saytga kirganingizda Google hisobingizdagi YouTube kanalingiz avtomatik eslab qolinadi va har safar qayta yozmasdan barcha oylik daromad, yuklash soatlari va izohlar VidIQ kabi bir zumda ochiladi.
                </p>
              </div>

              {/* 1-Bosishda Google Ulanish Tugmasi */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 text-left space-y-4 shadow-xl">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Google / YouTube Hisobi</h3>
                    <p className="text-xs text-slate-400">1-bosishda avtomatik ulanish va brauzerda doimiy eslab qolish</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-3 group cursor-pointer"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-sm font-black text-slate-800">Google Hisobi Bilan Ulanish (1-Bosishda)</span>
                </button>
              </div>

              {/* Qo'lda kiritish varianti */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  yoki kanal nomi / havolasini kiriting
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleConnectMyChannel} className="space-y-3">
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    required
                    value={myChannelLink}
                    onChange={(e) => setMyChannelLink(e.target.value)}
                    placeholder="Masalan: @mittivine, @kunuz yoki kanal havolasi"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Kanal yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Kanalni Birlashtirish va Saqlash</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Ulangan kanal kartasi */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-600/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img 
                    src={myChannelData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(myChannelData.name)}&background=10b981&color=fff`} 
                    alt={myChannelData.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Google Hisobi Bilan Avtomatik Ulangan
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black mt-1.5">{myChannelData.name}</h2>
                    <p className="text-xs text-slate-300 mt-1">{myChannelData.handle} • {myChannelData.subscribers} obunachi • {myChannelData.totalVideos} • {myChannelData.totalViews}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-auto">
                  <button 
                    onClick={() => handleAutoConnectGoogle(myChannelData.handle || myChannelData.name)}
                    disabled={isLoading}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 flex items-center space-x-1.5 cursor-pointer"
                    title="Statistikalarni yangilash"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Yangilash</span>
                  </button>
                  <button 
                    onClick={handleDisconnectChannel}
                    className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white text-xs font-bold transition border border-red-500/30 cursor-pointer"
                  >
                    Chiqish / Boshqa hisob
                  </button>
                </div>
              </div>

              {/* VidIQ Quick channel stats Vidjeti (Shaxsiy Kanal uchun) */}
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black tracking-tight text-white flex items-center">
                      <span className="text-sky-400">vid</span>IQ
                    </span>
                    <span className="text-sm font-bold text-slate-300 ml-2">Quick channel stats (Kanalingiz ko'rsatkichlari)</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Haqiqiy YouTube ma'lumotlari</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* 1. Views gained (7 days) */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Views gained (7 days)</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.viewsGained7Days}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Haftalik faollik
                      </span>
                    </div>
                  </div>

                  {/* 2. Obunachilar */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Obunachilar</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.subscribers}</p>
                      <span className="text-[11px] text-slate-400 font-medium block mt-1">
                        {myChannelData.channelRank}
                      </span>
                    </div>
                  </div>

                  {/* 3. Est. monthly earnings */}
                  <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-emerald-950/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Est. monthly earnings</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                        {myChannelData.estMonthlyEarningsMain}
                      </p>
                      <span className="inline-block mt-1 text-xs font-bold text-slate-200">
                        {myChannelData.estMonthlyRange} ({myChannelData.estMonthlyDollars})
                      </span>
                    </div>
                  </div>

                  {/* 4. Avg. video length */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Avg. video length</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.avgVideoLength}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">O'rtacha davomiylik</span>
                    </div>
                  </div>

                  {/* 5. Upload frequency */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Upload frequency</span>
                    <div className="mt-3">
                      <p className="text-xl font-black text-white">{myChannelData.uploadFrequency}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">Yuklash chastotasi</span>
                    </div>
                  </div>
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
            </div>
          )}
        </section>
      )}

      {/* 3. SEO & GOOGLE QIDIRUVIDA TOPISH VA EMBLEMA BO'LIMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center space-x-4">
              <img 
                src="/vidoor-emblem.jpg" 
                alt="Vidoor Emblemasi" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-500/20"
              />
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Vidoor ⚡ Emblemasi va Brendi</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Rasmiy
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Letter V + YouTube Play tugmasi + Moliyaviy tahlil o'sish grafiki mujassamlashgan zamonaviy emblema
                </p>
              </div>
            </div>

            <button
              onClick={() => { setShowExtensionModal(true); setExtensionTab("chrome-home"); }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition shadow-md cursor-pointer self-start md:self-auto"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Chrome Bosh Sahifasiga Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            {/* Muhim Eslatma: Google qidiruvi vs Brauzer manzil qatori */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2.5">
              <span className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Google Qidiruvi va Brauzer Manzil Qatori Farqi:
              </span>
              <p className="leading-relaxed text-slate-300">
                1. <strong>Brauzer manzil qatori (URL bar - yuqoridagi qator):</strong> Ushbu qatorga to'g'ridan-to'g'ri <code className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">vidoor.vercel.app</code> deb yozsangiz, Google qidiruvisiz darhol sayt ochiladi!
              </p>
              <p className="leading-relaxed text-slate-300">
                2. <strong>Google qidiruv maydoni (google.com):</strong> Google qidiruv tizimi yangi saytlarni o'zining indeks bazasiga kiritishi uchun GoogleBot robotlari tomonidan 1-3 kun davomida tekshiriladi. Biz sayt xaritasini (Sitemap) va Rich Snippets'ni Google tizimiga to'liq ulab qo'ydik.
              </p>
            </div>

            {/* Qanday oson eslab qolish mumkin */}
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2.5">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Vidoor-ga 1 soniyada kirish usullari:
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
                <li>Chrome bosh sahifasida (New Tab) <strong>"Yorliq qo'shish"</strong> tugmasiga Vidoor-ni saqlab qo'yish.</li>
                <li><strong>"⚡ Vidoor Tahlil"</strong> xatcho'pini brauzer paneliga sudrab qo'yish.</li>
                <li>Chrome manzil qatoriga <code className="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono">vidoor.vercel.app</code> yozib, <kbd className="bg-slate-700 text-white px-1.5 py-0.5 rounded font-mono">TAB</kbd> bosish.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Vidoor. VidIQ va SocialBlade darajasidagi bepul tahlil platformasi. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* 4. MODAL: CHROME VA TEZKOR KIRISH (VIDIQ KABI HAR QANDAY JOYDAN TORTIB OLISH) */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center font-black text-xl text-white">
                  ⚡
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    VidIQ kabi har qanday joydan tortib olish
                  </h3>
                  <p className="text-xs text-slate-300">
                    Chrome, Google va YouTube sahifalaridan 1 bosishda oson kirish
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExtensionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
              <button
                onClick={() => setExtensionTab("bookmarklet")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  extensionTab === "bookmarklet"
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                ⚡ 1. Tezkor Xatcho'p (Eng osoni)
              </button>
              <button
                onClick={() => setExtensionTab("chrome-home")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  extensionTab === "chrome-home"
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                ⭐ 2. Chrome Bosh Sahifasida 1-o'rinda turish
              </button>
              <button
                onClick={() => setExtensionTab("extension")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  extensionTab === "extension"
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                🧩 3. Chrome Kengaytmasi
              </button>
              <button
                onClick={() => setExtensionTab("pwa")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  extensionTab === "pwa"
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                📱 4. Ilovani O'rnatish
              </button>
              <button
                onClick={() => setExtensionTab("search")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  extensionTab === "search"
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                🔍 5. Google & Chrome Qidiruvi
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* TAB 1: BOOKMARKLET */}
              {extensionTab === "bookmarklet" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-emerald-900">
                        Eng oson va tezkor yo'l — Hech narsa o'rnatish shart emas!
                      </h4>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        Quyidagi yashil tugmani sichqoncha bilan ushlab, brauzeringizning <strong>Xatcho'plar (Bookmarks) paneliga</strong> sudrab qo'ying (Chrome'da <kbd className="px-1.5 py-0.5 bg-white rounded border border-emerald-300 font-mono text-[10px]">Ctrl + Shift + B</kbd> tugmalarini bosing).
                      </p>
                    </div>
                  </div>

                  {/* Drag Button */}
                  <div className="text-center p-6 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-bold text-slate-500">
                      Ushbu tugmani Xatcho'plar paneliga sudrab qo'ying 👇
                    </span>
                    <a
                      href="javascript:(function(){var u=window.location.href;window.open('https://vidoor.vercel.app/?q='+encodeURIComponent(u),'_blank');})();"
                      onClick={(e) => e.preventDefault()}
                      draggable="true"
                      className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 cursor-grab active:cursor-grabbing hover:scale-105 transition"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ Vidoor Tahlil</span>
                    </a>
                    <span className="text-[11px] text-slate-400">
                      (Yoki o'ng tugmani bosib: "Bookmark link" / "Xatcho'pga qo'shish"ni tanlang)
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
                    <span className="font-bold text-orange-400 block">Qanday ishlaydi?</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>YouTube'da xohlagan kanalni, videoni yoki Shorts'ni tomosha qiling.</li>
                      <li>Chrome'ning yuqori panelidagi <strong>"⚡ Vidoor Tahlil"</strong> xatcho'pini 1 marta bosing.</li>
                      <li>Darhol Vidoor ochiladi va shu kanalning barcha oylik daromadi, 7 kunlik ko'rishlari va VidIQ statistikasini tortib oladi!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 2: CHROME BOSH SAHIFASIDA 1-O'RINDA TURISH (SHORTCUTS) */}
              {extensionTab === "chrome-home" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
                    <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 fill-amber-500" />
                    <div>
                      <h4 className="text-sm font-black text-amber-900">
                        Chrome Bosh Sahifasida (Yangi Oynada) 1-O'rinda Ajralib Turish
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Kompyuteringizda Google Chrome ochilganida, YouTube va Google yonida <strong>Vidoor ⚡</strong> eng birinchi yorliq bo'lib turishi uchun 30 soniyada qo'shib oling.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                      Kompyuter Chrome'iga Qo'shish Qadamlari:
                    </span>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs border border-emerald-500/30">1</span>
                        <div>
                          <p className="font-semibold text-slate-100">Chrome'da yangi oyna oching:</p>
                          <p className="text-slate-400 mt-0.5">Klaviaturada <kbd className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">Ctrl + T</kbd> tugmalarini bosing.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs border border-emerald-500/30">2</span>
                        <div>
                          <p className="font-semibold text-slate-100">"+ Yorliq qo'shish" (+ Add shortcut) tugmasini bosing:</p>
                          <p className="text-slate-400 mt-0.5">Qidiruv qatori ostidagi aylana "+" tugmasini bosing.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs border border-emerald-500/30">3</span>
                        <div className="space-y-1.5 w-full">
                          <p className="font-semibold text-slate-100">Ma'lumotlarni kiriting:</p>
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Nom (Name): <strong className="text-white">Vidoor ⚡ (VidIQ)</strong></span>
                              <button
                                onClick={() => handleCopy("Vidoor ⚡ (VidIQ)", "copy-name")}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold cursor-pointer"
                              >
                                {copiedId === "copy-name" ? "Nusxalandi! ✓" : "Nusxalash"}
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">URL (Link): <strong className="text-white">https://vidoor.vercel.app</strong></span>
                              <button
                                onClick={() => handleCopy("https://vidoor.vercel.app", "copy-url")}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold cursor-pointer"
                              >
                                {copiedId === "copy-url" ? "Nusxalandi! ✓" : "Nusxalash"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-emerald-600" />
                      Windows Ish Stoliga (Desktop) Alohida Dastur Yorlig'ini Chiqarish:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Chrome'ning o'ng yuqori burchagidagi <strong>3 ta nuqta (⋮)</strong> menyusini bosing &rarr; <strong>"Translyatsiya, saqlash va ulashish"</strong> (yoki "Boshqa vositalar") &rarr; <strong>"Yorliq yaratish..." (Create shortcut...)</strong> tugmasini bosing. Shunda kompyuteringiz ish stolida Vidoor alohida dastur ikonkasi bo'lib chiqadi!
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: CHROME EXTENSION */}
              {extensionTab === "extension" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start space-x-3">
                    <Puzzle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-orange-900">
                        VidIQ kabi Chrome Kengaytmasi (Extension)
                      </h4>
                      <p className="text-xs text-orange-800 mt-1 leading-relaxed">
                        Chrome brauzeringizga doimiy kengaytma sifatida qo'shib qo'ying va har safar YouTube'da turganingizda 1 bosishda mini-oynadan foydalaning.
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <a
                      href="/vidoor-chrome-extension.zip"
                      download="vidoor-chrome-extension.zip"
                      className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>📥 vidoor-chrome-extension.zip ni yuklab olish (Bepul)</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                    <span className="font-bold text-slate-800 block">O'rnatish 3 qadamda:</span>
                    <div className="space-y-2 text-slate-600">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
                        <span>Yuklab olingan <strong>vidoor-chrome-extension.zip</strong> faylini arxivdan chiqaring (Extract).</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
                        <span>Chrome brauzerida manzil qatoriga <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-emerald-700">chrome://extensions</code> deb yozing va o'ng yuqoridagi <strong>"Developer mode"</strong> (Dasturchi rejimi)ni yoqing.</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
                        <span>Chap yuqoridagi <strong>"Load unpacked"</strong> (Paketsiz yuklash) tugmasini bosing va arxivdan chiqarilgan papkani tanlang — kengaytma Chrome'ingizda tayyor bo'ladi!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PWA APP */}
              {extensionTab === "pwa" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start space-x-3">
                    <Smartphone className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-teal-900">
                        Vidoor Ilovasini Kompyuter yoki Telefonga O'rnatish
                      </h4>
                      <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                        Vidoor to'liq Progressive Web App (PWA) sifatida yaratilgan. Hech qanday Play Market yoki App Store'siz 1 soniyada ekranga dastur bo'lib tushadi!
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <button
                      type="button"
                      onClick={handleInstallPWA}
                      className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 hover:opacity-95 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>📲 Vidoor Ilovasini Ekraningizga O'rnatish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Laptop className="w-4 h-4 text-emerald-600" />
                        Windows / Mac kompyuterda:
                      </span>
                      <p className="text-slate-600">
                        Chrome manzil qatorining (URL) o'ng tomonidagi kichik kompyutercha ("O'rnatish") belgisini bosing.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Smartphone className="w-4 h-4 text-orange-500" />
                        Android / iPhone telefonda:
                      </span>
                      <p className="text-slate-600">
                        Brauzer menyusidagi (3 ta nuqta yoki ulashish) "Bosh ekranga qo'shish" (Add to Home screen) tugmasini bosing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SEARCH ENGINE */}
              {extensionTab === "search" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start space-x-3">
                    <Search className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-sky-900">
                        Google & Chrome Manzil Qatoridan To'g'ridan-To'g'ri Qidirish
                      </h4>
                      <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                        Chrome brauzeringizga Vidoor qidiruv tizimi ulandi (OpenSearch).
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
                    <span className="font-bold text-sky-400 block">Chrome Omnibox Tezkor Qidiruvi:</span>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li>Chrome manzil qatoriga <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">vidoor.vercel.app</code> deb yozing.</li>
                      <li>Klaviaturangizdagi <kbd className="bg-slate-700 text-white px-2 py-0.5 rounded font-mono">TAB</kbd> yoki probel tugmasini bosing.</li>
                      <li>Istalgan kanal nomini (masalan, <em>kunuz</em>, <em>subyektiv</em>) yozing va <kbd className="bg-slate-700 text-white px-2 py-0.5 rounded font-mono">Enter</kbd> bosing — darhol Vidoorda ochiladi!</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Barcha vositalar 100% bepul va cheklovsiz taqdim etiladi.</span>
              <button
                onClick={() => setShowExtensionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. GOOGLE HISOBIDAGI YOUTUBE KANALNI AVTOMATIK ULASH MODALI */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Google / YouTube Ulanishi</h3>
                  <p className="text-xs text-slate-500">VidIQ uslubida avtomatik hisob integratsiyasi</p>
                </div>
              </div>

              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <span className="font-bold text-emerald-900 block mb-0.5">Avtomatik Eslab Qolish Tizimi:</span>
                  Ushbu kanal Vidoor xotirasida (localStorage) saqlanadi. Kelgusida saytni ochganingizda yoki "Mening Kanalim" tugmasini bosganingizda kanalingiz avtomatik ulangan holda turadi!
                </div>
              </div>

              {/* Kanal Tanlash / Kiritish */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Google hisobingizdagi YouTube kanal nomi yoki havolasi:
                </label>
                <div className="relative">
                  <Youtube className="w-5 h-5 text-red-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={googleChannelInput}
                    onChange={(e) => setGoogleChannelInput(e.target.value)}
                    placeholder="Masalan: @mittivine, @kunuz yoki kanalingiz nomi"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAutoConnectGoogle();
                      }
                    }}
                  />
                </div>

                {/* Tezkor tavsiyalar */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Tezkor namunalar:</span>
                  <div className="flex flex-wrap gap-2">
                    {["mittivine", "kunuz", "texnoplov", "subyektiv"].map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          setGoogleChannelInput(handle);
                          handleAutoConnectGoogle(handle);
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 font-medium transition cursor-pointer"
                      >
                        @{handle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <span>🔒 100% Xavfsiz va Maxfiy</span>
                </div>
                <p>Hech qanday parol yoki Google hisob kaliti talab qilinmaydi. Ma'lumotlar faqat sizning brauzeringizda saqlanadi.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleAutoConnectGoogle()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white text-xs font-black shadow-md transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Ulanmoqda...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Google Bilan Ulanish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
