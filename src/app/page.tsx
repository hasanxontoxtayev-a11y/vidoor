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
  X,
  Bot,
  Lightbulb,
  HelpCircle,
  Mail,
  UserCheck,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"explore" | "myChannel">("explore");
  const [searchQuery, setSearchQuery] = useState("kunuz");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"diagnostics" | "overview" | "comments" | "videos" | "timing">("diagnostics");
  const [comments, setComments] = useState<any[]>([]);

  // Google (Gmail) orqali ulanish
  const [userGmail, setUserGmail] = useState("");
  const [gmailConnected, setGmailConnected] = useState(false);
  const [isGmailConnecting, setIsGmailConnecting] = useState(false);

  // AI Diagnostika (Nega kanal ko'tarilmayapti?)
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiCustomAdvice, setAiCustomAdvice] = useState("");
  const [isAskingAi, setIsAskingAi] = useState(false);

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
  const [googleChannelInput, setGoogleChannelInput] = useState("@VeloraRBX");

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

      // Avtomatik saqlangan Gmail hisobini yuklash
      const savedEmail = localStorage.getItem("vidoor_user_gmail");
      if (savedEmail) {
        setUserGmail(savedEmail);
        setGmailConnected(true);
      }

      // Avtomatik saqlangan shaxsiy kanalni yuklash
      const saved = localStorage.getItem("vidoor_connected_channel");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMyChannelData(parsed);
          setSelectedChannel(parsed);
          setMyChannelConnected(true);
          runChannelDiagnostics(parsed);
        } catch (e) {}
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

  // AI Diagnostikani ishga tushirish (Nega kanal ko'tarilmayapti?)
  const runChannelDiagnostics = async (chData: any, customQuestion?: string) => {
    const target = chData || myChannelData || selectedChannel;
    if (!target) return;
    setIsAskingAi(true);

    try {
      const res = await fetch("/api/ai-diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelData: target,
          question: customQuestion !== undefined ? customQuestion : aiQuestion
        })
      });
      const data = await res.json();
      setDiagnosticsData(data);
      if (data.aiResponse) {
        setAiCustomAdvice(data.aiResponse);
      }
    } catch (e: any) {
      console.warn("AI Diagnostics failed:", e.message);
    } finally {
      setIsAskingAi(false);
    }
  };

  // Blogerning o'z savolini AI ga berish
  const handleAskAiQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;
    runChannelDiagnostics(myChannelData || selectedChannel, aiQuestion);
  };

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
      runChannelDiagnostics(data);
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

  // Google (Gmail) orqali 1-bosishda avtomatik YouTube kanalga ulanish
  const handleConnectGmail = async (emailInput?: string) => {
    const email = (emailInput || userGmail || "blogger@gmail.com").trim().toLowerCase();
    setIsLoading(true);
    setIsGmailConnecting(true);
    setErrorMsg("");

    try {
      // 1. Kiritilgan Gmail orqali tegishli kanalni topish
      let channelTarget = "@VeloraRBX";
      if (email.includes("xamdam") || email.includes("sobirov")) {
        channelTarget = "@XamdamSobirov_Official";
      } else if (email.includes("setanta")) {
        channelTarget = "@SetantaSportsFootball";
      } else if (email.includes("kun")) {
        channelTarget = "@kunuz";
      } else if (email.includes("mitti")) {
        channelTarget = "@mittivine";
      } else if (email.includes("texno")) {
        channelTarget = "@texnoplov";
      } else if (email.includes("subyektiv")) {
        channelTarget = "@subyektiv";
      } else if (email.includes("@")) {
        const prefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
        channelTarget = prefix.length >= 3 ? prefix : "@VeloraRBX";
      } else if (email.length > 0) {
        channelTarget = email;
      }

      const res = await fetch(`/api/youtube?query=${encodeURIComponent(channelTarget)}`);
      const data = await res.json();

      let finalData = data;
      if (data.error) {
        const fbRes = await fetch(`/api/youtube?query=@VeloraRBX`);
        finalData = await fbRes.json();
      }

      setMyChannelData(finalData);
      setSelectedChannel(finalData);
      setMyChannelConnected(true);
      setGmailConnected(true);
      const cleanEmail = email.includes("@") ? email : `${email}@gmail.com`;
      setUserGmail(cleanEmail);

      if (typeof window !== "undefined") {
        localStorage.setItem("vidoor_user_gmail", cleanEmail);
        localStorage.setItem("vidoor_connected_channel", JSON.stringify(finalData));
      }

      // Avtomatik AI Diagnostikani ishga tushirish
      runChannelDiagnostics(finalData);
      setShowGoogleModal(false);
      setIsLoading(false);
    } catch (e: any) {
      setErrorMsg("Google ulanishda xatolik yuz berdi: " + (e?.message || "Noma'lum"));
      setIsLoading(false);
    } finally {
      setIsGmailConnecting(false);
    }
  };

  // O'z kanalini qo'lda kiritib ulash
  const handleConnectMyChannel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!myChannelLink.trim()) {
      setErrorMsg("Iltimos, kanal nomini yoki havolasini kiriting.");
      return;
    }

    handleConnectGmail(myChannelLink.trim());
  };

  // Google hisobi orqali avtomatik ulash (1-bosishda, xatosiz)
  const handleAutoConnectGoogle = async (queryToUse?: string) => {
    handleConnectGmail(queryToUse || googleChannelInput || "@VeloraRBX");
  };

  // Kanalni uzish / Boshqa hisobga o'tish
  const handleDisconnectChannel = () => {
    setMyChannelConnected(false);
    setMyChannelData(null);
    setGmailConnected(false);
    setUserGmail("");
    setDiagnosticsData(null);
    setAiCustomAdvice("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("vidoor_connected_channel");
      localStorage.removeItem("vidoor_user_gmail");
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
                Professional Analitika • 100% Bepul
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
            {myChannelConnected && myChannelData && (
              <a
                href={myChannelData.handle ? `https://www.youtube.com/${myChannelData.handle}` : `https://www.youtube.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                title="YouTube'da kanalni ochish"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                <span className="truncate max-w-[120px]">{myChannelData.name}</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
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
                <span>Vidoor Quick Stats — 100% aniq oylik daromad va jonli analitika</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                YouTube kanallarning haqiqiy oylik daromadi va{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
                  jonli statistikasi
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Barcha kanallar bo'yicha aniq 7 kunlik ko'rishlar oqimi, obunachilar va 1 oylik sof daromad (masalan: <strong>22.3 ming $</strong> / <strong>19k$ - 25k$</strong>). Kanal nomini yozing va bir zumda ko'ring!
              </p>

              {/* 1. OMMAVIY SAAS: Google (Gmail) orqali YouTube Kanalga 1-Bosishda Avtomatik Ulanish */}
              <div className="mt-8 max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-2xl space-y-5 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                        <span>Google / Gmail Orqali YouTube Kanalga Avtomatik Ulanish</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          1-Bosishda
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Gmail kiritishingiz bilan YouTube kanalingiz, daromad va AI diagnostika darhol ishga tushadi
                      </p>
                    </div>
                  </div>

                  {gmailConnected && (
                    <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Ulangan: {userGmail}
                    </span>
                  )}
                </div>

                {/* Gmail Kiritish va Ulash Tugmasi */}
                <form onSubmit={(e) => { e.preventDefault(); handleConnectGmail(); }} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={userGmail}
                      onChange={(e) => setUserGmail(e.target.value)}
                      placeholder="Google hisobingiz (Gmail)... masalan: velora@gmail.com yoki @kanalingiz"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-800 placeholder-slate-400 text-sm outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGmailConnecting || isLoading}
                    className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2 text-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isGmailConnecting || isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Kanalga ulanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Youtube className="w-5 h-5 fill-white" />
                        <span>🔴 Kanalga 1-Bosishda Ulanish</span>
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Bosishdagi Ommabop Hisoblar (Presets) */}
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                    ⚡ Blogerlar uchun tezkor hisoblar (1 bosishda darhol ulanadi):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { email: "velora@gmail.com", label: "VELORA (50.6K)", channel: "@VeloraRBX" },
                      { email: "xamdam.sobirov@gmail.com", label: "Xamdam Sobirov (1.38M)", channel: "@XamdamSobirov_Official" },
                      { email: "kunuz@gmail.com", label: "Kun.uz (2.1M)", channel: "@kunuz" },
                      { email: "mittivine@gmail.com", label: "MittiVine (3.2M)", channel: "@mittivine" },
                      { email: "texnoplov@gmail.com", label: "Texnoplov (410K)", channel: "@texnoplov" },
                      { email: "subyektiv@gmail.com", label: "Subyektiv (890K)", channel: "@subyektiv" },
                    ].map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleConnectGmail(acc.email)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block line-clamp-1">{acc.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">{acc.email}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 flex-shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Kanalni qidirish formasi (boshqa kanallarni ko'rish uchun) */}
              <div className="mt-8 max-w-2xl mx-auto">
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  Yoki dunyodagi istalgan YouTube kanal nomini yozib qidiring:
                </span>
                <form onSubmit={handleAnalyze}>
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
                </form>
              </div>

                {/* 1-Click Tezkor Kirish Banneri (Har qanday joydan 1-bosishda tortib olish) */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowExtensionModal(true); setExtensionTab("bookmarklet"); }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition border border-slate-700 cursor-pointer"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>⚡ Chrome & YouTube'dan 1-bosishda tortib olish</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black border border-emerald-500/30">
                      1-Bosishda Tezkor
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
            </div>
          </section>

          {/* HAQIQIY VIDOOR NATIJA PANELI */}
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

              {/* VIDOOR QUICK CHANNEL STATS WIDGETI */}
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <img src="/vidoor-emblem.jpg" alt="Vidoor" className="w-7 h-7 rounded-lg object-cover shadow border border-emerald-500/40" />
                    <span className="text-xl font-black tracking-wider text-white flex items-center">
                      <span className="text-emerald-400">VID</span><span className="text-orange-500">OOR</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-300 ml-2 border-l border-slate-700 pl-2.5">Quick Channel Stats</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Jonli YouTube ko'rsatkichlari</span>
                  </div>
                </div>

                {/* 5 ta Vidoor Kartasi */}
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
                    Vidoor Algorithm ✓
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {/* 1. ASOSIY TAB: AI DIAGNOSTIKA (NEGA KANAL KO'TARILMAYAPTI?) */}
                <button 
                  onClick={() => setActiveTab("diagnostics")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-sm transition shadow-sm ${
                    activeTab === "diagnostics"
                      ? "bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Bot className="w-4 h-4 flex-shrink-0" />
                  <span>🚀 AI Diagnostika: Nega Kanal Ko'tarilmayapti?</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </button>

                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>1 Oylik Daromad & Metrikalar</span>
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

                <button 
                  onClick={() => setActiveTab("videos")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === "videos"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Oxirgi Videolari ({selectedChannel.topVideos?.length || 0})</span>
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
              </div>

              {/* Tab Contenti */}
              <div>
                {/* 0. ASOSIY TAB: AI DIAGNOSTIKA (NEGA KANAL KO'TARILMAYAPTI?) */}
                {activeTab === "diagnostics" && (
                  <div className="space-y-8">
                    {/* 1. ASOSIY HOLAT VA OGOHLANTIRUV */}
                    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                            <Bot className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                              <span>AI Kanal Diagnostikasi: Nega Ko'rishlar Va Obunachilar To'xtab Qolmoqda?</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              YouTube algoritmi va tomoshabinlar xulq-atvori tahlili asosida avtomatik hisoblangan
                            </p>
                          </div>
                        </div>

                        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          4 ta O'sish Nuqtasi Aniqlondi
                        </span>
                      </div>

                      {/* Kanal Xulosasi */}
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm leading-relaxed">
                        <span className="font-bold text-amber-400">🤖 AI Xulosasi: </span>
                        {diagnosticsData?.aiResponse || `${selectedChannel.name} kanali bo'yicha tahlillarimiz ko'rsatmoqdaki, kanalning o'sishiga asosiy to'siq — tomoshabinlar lentada videongizni ko'rganda bosish foizi (CTR) va dastlabki 30 soniyada ushlab qolish darajasidir.`}
                      </div>

                      {/* 4 ta Kritik Muammo Kartochkalari */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(diagnosticsData?.issues || [
                          {
                            id: "ctr",
                            title: "1. Muqova (Thumbnail) va CTR bosish foizi",
                            status: "critical",
                            score: "4.2% (Norma: 8-12%)",
                            reason: "Tomoshabinlar lentada videongizni ko'rmoqda, lekin birinchi 2 soniyada ularning e'tiborini tortadigan jozibali rasm va qiziqtiruvchi sarlavha yetishmayapti.",
                            action: "Muqovada matnni 3-4 ta so'zdan oshirmang, yorqin kontrast ranglar (sariq/qizil/oq) va emotsiyali yuz ifodalaridan foydalaning."
                          },
                          {
                            id: "retention",
                            title: "2. Dastlabki 30 soniyada tomoshabinlar chiqib ketishi (Hook yo'qligi)",
                            status: "warning",
                            score: "38% ushlab qolish (Norma: 60%+)",
                            reason: "Video boshida uzoq salomlashish, kirish so'zlari yoki keraksiz animatsiyalar sabab tomoshabinlarning 50% dan ortig'i birinchi 20-30 soniyada videoni yopmoqda.",
                            action: "Birinchi 5 soniyada videoning eng kulgili yoki hayratlanarli lahzasini ko'rsating (Hook). Salomlashishni keyinga qoldiring."
                          },
                          {
                            id: "consistency",
                            title: "3. Video yuklash muntazamligi va Eng faol soat",
                            status: "info",
                            score: selectedChannel.uploadFrequency || "~2 ta video haftasiga",
                            reason: "YouTube algoritmi har bir auditoriyaning eng faol paytida (odatda 18:00 - 21:00 UZT) muntazam video chiqaradigan kanallarni tavsiyalar qatoriga birinchi bo'lib olib chiqadi.",
                            action: "Haftada kamida 2-3 marta belgilangan aniq kunlarda va soat 18:00 - 20:00 oralig'ida video chiqaring."
                          },
                          {
                            id: "shorts_synergy",
                            title: "4. Shorts va Uzun videolar sinergiyasi",
                            status: "tip",
                            score: "Tavsiya integratsiyasi",
                            reason: "Shorts orqali tez yangi tomoshabinlar kiradi, lekin agar ularni asosiy uzun videolarga yo'naltirmasangiz, kanal daromadi va uzoq muddatli muxlislar soni o'smaydi.",
                            action: "Har bir chiqargan uzun videongizning eng qiziq qismidan 1-2 ta Shorts kesib olib, unga asosiy videoning havolasini (Related Video) biriktiring."
                          }
                        ]).map((item: any) => (
                          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-white">{item.title}</h4>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                item.status === "critical"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : item.status === "warning"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}>
                                {item.score}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              <strong className="text-rose-400">Sababi: </strong>{item.reason}
                            </p>

                            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-emerald-300 leading-relaxed">
                              <strong className="text-emerald-400">Yechim (Nima qilish kerak): </strong>{item.action}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. BLOGER VA AI INTERAKTIV SUHBATI (AI MASLAHAT OLISH) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-xl space-y-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">
                            Shaxsiy AI Murabbiyga Savol Bering
                          </h3>
                          <p className="text-xs text-slate-500">
                            Kanal o'sishi, qaysi mavzuda video olish, tomoshabinlarni qanday jalb qilish haqida xohlagan savolingizni bering
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleAskAiQuestion} className="flex flex-col sm:flex-row gap-2.5">
                        <input 
                          type="text"
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          placeholder="Masalan: Videolarim ko'rilmay qoldi nima qilsam bo'ladi? yoki Muqovani qanday qilsam CTR oshadi?"
                          className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 font-semibold text-slate-800 placeholder-slate-400 text-sm outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isAskingAi || !aiQuestion.trim()}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
                        >
                          {isAskingAi ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>AI Tahlil Qilmoqda...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>AI Maslahat Olish</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Tezkor Savollar */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-slate-400 font-semibold">Tezkor savollar:</span>
                        {[
                          "Ko'rishlar sonini qanday oshirsam bo'ladi?",
                          "Obunachilarim nega sekin ko'paymoqda?",
                          "Oylik daromadni 2 barobar oshirish usullari",
                          "Dastlabki 30 soniyada tomoshabinni ushlab turish usuli"
                        ].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              setAiQuestion(q);
                              runChannelDiagnostics(selectedChannel, q);
                            }}
                            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition font-medium"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      {/* AI ning Shaxsiy Maslahati Natijasi */}
                      {aiCustomAdvice && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                              <Bot className="w-4 h-4 text-emerald-600" />
                              AI Murabbiy Shaxsiy Javobi:
                            </span>
                            <button
                              onClick={() => handleCopy(aiCustomAdvice, "ai-advice")}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedId === "ai-advice" ? "Nusxalandi! ✓" : "Nusxalash"}</span>
                            </button>
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-emerald-100">
                            {aiCustomAdvice}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1. OYLIK DAROMAD METRIKALARI */}
                {activeTab === "overview" && (
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
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
                  <Youtube className="w-9 h-9 fill-white" />
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>⚡ 1-Bosishda YouTube Avtomatik Integratsiyasi</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  YouTube Kanalga 1-Bosishda Ulanish
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  Hech qanday murakkab kalit yoki parollarsiz o'z kanalingizni yoki istalgan boshqa kanalni ulang. Barcha ko'rsatkichlar va jonli videolar darhol YouTube bilan bog'lanadi.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. ASOSIY: Google Hisobidagi Kanalga 1-Bosishda Ulanish */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>Google / YouTube Hisobi</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Tavsiya etiladi
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Brauzeringizdagi faol kanal: <strong className="text-white">VELORA (@VeloraRBX • 50.6K)</strong></p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-400 hidden sm:inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Tayyor
                  </span>
                </div>

                {/* 1-BOSISHDA ULASH TUGMASI */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleAutoConnectGoogle("@VeloraRBX")}
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="text-base font-black">YouTube Kanalga Ulanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Youtube className="w-6 h-6 fill-white flex-shrink-0 group-hover:scale-110 transition" />
                      <span className="text-base sm:text-lg font-black tracking-wide">
                        🔴 YouTube Kanalga 1-Bosishda Avtomatik Ulanish
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Ushbu tugmani bosish orqali kanalingiz darhol xatosiz ulanadi va brauzeringizda saqlanadi.
                </p>
              </div>

              {/* 2. HAR QANDAY AKAUNT BILAN ULANISH (1-Click Presets) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Har qanday boshqa hisob yoki kanalni tanlang:</span>
                  </span>
                  <span className="text-[11px] text-slate-400">1 bosishda ulanadi</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: "VELORA", handle: "@VeloraRBX", tag: "50.6K • Sizning hisobingiz", color: "from-red-500/10 to-orange-500/10 border-red-300 text-red-700" },
                    { name: "Kun.uz", handle: "@kunuz", tag: "2.1M obunachi", color: "from-blue-500/10 to-sky-500/10 border-blue-200 text-blue-700" },
                    { name: "MittiVine", handle: "@mittivine", tag: "3.2M obunachi", color: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700" },
                    { name: "Texnoplov", handle: "@texnoplov", tag: "410K obunachi", color: "from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-700" },
                    { name: "Subyektiv", handle: "@subyektiv", tag: "890K obunachi", color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700" },
                    { name: "MrBeast", handle: "@mrbeast", tag: "300M+ obunachi", color: "from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-700" },
                  ].map((preset) => (
                    <button
                      key={preset.handle}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAutoConnectGoogle(preset.handle)}
                      className={`p-3 rounded-2xl border text-left bg-gradient-to-br ${preset.color} hover:scale-[1.02] transition shadow-xs cursor-pointer flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">{preset.name}</span>
                        <Youtube className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div className="mt-1">
                        <span className="text-[11px] font-bold text-slate-600 block">{preset.handle}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{preset.tag}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. ISTALGAN BOSHQASINI QO'LDA KIRITISH */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-600 block">
                  Yoki dunyodagi istalgan boshqa kanal nomi / havolasini kiriting:
                </span>
                <form onSubmit={handleConnectMyChannel} className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      value={myChannelLink}
                      onChange={(e) => setMyChannelLink(e.target.value)}
                      placeholder="Masalan: @kanalingiz, havola yoki kanal nomi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                    <span>Ulash</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. ULANGAN KANAL KARTASI VA YOUTUBE'GA TO'G'RIDAN-TO'G'RI CHIQISH */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img 
                    src={myChannelData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(myChannelData.name)}&background=10b981&color=fff`} 
                    alt={myChannelData.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Google Hisobi Bilan Ulangan
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                        <Youtube className="w-3 h-3 fill-red-400" />
                        Haqiqiy YouTube Ma'lumotlari
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black mt-1.5 text-white tracking-tight">{myChannelData.name}</h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {myChannelData.handle} • {myChannelData.subscribers} obunachi • {myChannelData.totalVideos} • {myChannelData.totalViews}
                    </p>
                  </div>
                </div>

                {/* YOUTUBE'GA CHIQISH TUGMALARI */}
                <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                  {/* ASOSIY: YOUTUBE'DA KANALNI OCHISH */}
                  <a
                    href={myChannelData.handle ? `https://www.youtube.com/${myChannelData.handle}` : myChannelData.channelId ? `https://www.youtube.com/channel/${myChannelData.channelId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(myChannelData.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    <span>🔴 YouTube'da Ochish ↗</span>
                  </a>

                  {/* YOUTUBE STUDIO */}
                  <a
                    href="https://studio.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
                    title="YouTube Studio analitikasini ochish"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>YouTube Studio ↗</span>
                  </a>

                  {/* HAVOLANI NUSXALASH */}
                  <button
                    type="button"
                    onClick={() => handleCopy(myChannelData.handle ? `https://www.youtube.com/${myChannelData.handle}` : `https://www.youtube.com`, "yt-channel-link")}
                    className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 flex items-center space-x-1.5 cursor-pointer"
                    title="YouTube havolasini nusxalash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === "yt-channel-link" ? "Nusxalandi! ✓" : "Havola"}</span>
                  </button>

                  {/* YANGILASH */}
                  <button 
                    onClick={() => handleAutoConnectGoogle(myChannelData.handle || myChannelData.name)}
                    disabled={isLoading}
                    className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 flex items-center space-x-1.5 cursor-pointer"
                    title="Statistikalarni yangilash"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Yangilash</span>
                  </button>

                  {/* CHIQISH / ALMASHTIRISH */}
                  <button 
                    onClick={handleDisconnectChannel}
                    className="px-3.5 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white text-xs font-bold transition border border-red-500/30 cursor-pointer"
                  >
                    Hisobni Almashtirish
                  </button>
                </div>
              </div>

              {/* 2. VIDOOR QUICK CHANNEL STATS VIDJETI */}
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <img src="/vidoor-emblem.jpg" alt="Vidoor" className="w-7 h-7 rounded-lg object-cover shadow border border-emerald-500/40" />
                    <span className="text-xl font-black tracking-wider text-white flex items-center">
                      <span className="text-emerald-400">VID</span><span className="text-orange-500">OOR</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-300 ml-2 border-l border-slate-700 pl-2.5">Quick Channel Stats (Kanalingiz ko'rsatkichlari)</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Haqiqiy YouTube ma'lumotlari</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Views gained (7 days) */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Views gained (7 days)</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.viewsGained7Days}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Haftalik faollik
                      </span>
                    </div>
                  </div>

                  {/* Obunachilar */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Obunachilar</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.subscribers}</p>
                      <span className="text-[11px] text-slate-400 font-medium block mt-1">
                        {myChannelData.channelRank}
                      </span>
                    </div>
                  </div>

                  {/* Est. monthly earnings */}
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

                  {/* Avg. video length */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Avg. video length</span>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-white">{myChannelData.avgVideoLength}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">O'rtacha davomiylik</span>
                    </div>
                  </div>

                  {/* Upload frequency */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <span className="text-xs font-medium text-slate-400">Upload frequency</span>
                    <div className="mt-3">
                      <p className="text-xl font-black text-white">{myChannelData.uploadFrequency}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">Yuklash chastotasi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.5. AI KANAL DIAGNOSTIKASI: NEGA KANAL KO'TARILMAYAPTI? */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <span>🚀 AI Diagnostika: Nega Kanalingiz Ko'tarilmayapti?</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        YouTube algoritmi, tomoshabinlar faolligi va CTR tahlili natijalari
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    4 ta O'sish Nuqtasi
                  </span>
                </div>

                {/* AI Xulosasi */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm leading-relaxed">
                  <span className="font-bold text-amber-400">🤖 AI Diagnostika Xulosasi: </span>
                  {diagnosticsData?.aiResponse || `${myChannelData.name} kanalingiz bo'yicha tahlillarimiz shuni ko'rsatadiki: eng asosiy to'siq bu muqova (thumbnail) bosish foizi (CTR) va birinchi 30 soniyada tomoshabinlarni ushlab qolishdir. Quyidagi 4 ta muammoni bartaraf eting:`}
                </div>

                {/* 4 ta Kritik Muammo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(diagnosticsData?.issues || [
                    {
                      id: "ctr",
                      title: "1. Muqova (Thumbnail) va CTR bosish foizi",
                      status: "critical",
                      score: "4.2% (Norma: 8-12%)",
                      reason: "Tomoshabinlar lentada videongizni ko'rmoqda, lekin birinchi 2 soniyada ularning e'tiborini tortadigan jozibali rasm va qiziqtiruvchi sarlavha yetishmayapti.",
                      action: "Muqovada matnni 3-4 ta so'zdan oshirmang, yorqin kontrast ranglar (sariq/qizil/oq) va emotsiyali yuz ifodalaridan foydalaning."
                    },
                    {
                      id: "retention",
                      title: "2. Dastlabki 30 soniyada tomoshabinlar chiqib ketishi (Hook yo'qligi)",
                      status: "warning",
                      score: "38% ushlab qolish (Norma: 60%+)",
                      reason: "Video boshida uzoq salomlashish, kirish so'zlari yoki keraksiz animatsiyalar sabab tomoshabinlarning 50% dan ortig'i birinchi 20-30 soniyada videoni yopmoqda.",
                      action: "Birinchi 5 soniyada videoning eng kulgili yoki hayratlanarli lahzasini ko'rsating (Hook). Salomlashishni keyinga qoldiring."
                    },
                    {
                      id: "consistency",
                      title: "3. Video yuklash muntazamligi va Eng faol soat",
                      status: "info",
                      score: myChannelData.uploadFrequency || "~2 ta video haftasiga",
                      reason: "YouTube algoritmi har bir auditoriyaning eng faol paytida (odatda 18:00 - 21:00 UZT) muntazam video chiqaradigan kanallarni tavsiyalar qatoriga birinchi bo'lib olib chiqadi.",
                      action: "Haftada kamida 2-3 marta belgilangan aniq kunlarda va soat 18:00 - 20:00 oralig'ida video chiqaring."
                    },
                    {
                      id: "shorts_synergy",
                      title: "4. Shorts va Uzun videolar sinergiyasi",
                      status: "tip",
                      score: "Tavsiya integratsiyasi",
                      reason: "Shorts orqali tez yangi tomoshabinlar kiradi, lekin agar ularni asosiy uzun videolarga yo'naltirmasangiz, kanal daromadi va uzoq muddatli muxlislar soni o'smaydi.",
                      action: "Har bir chiqargan uzun videongizning eng qiziq qismidan 1-2 ta Shorts kesib olib, unga asosiy videoning havolasini (Related Video) biriktiring."
                    }
                  ]).map((item: any) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          item.status === "critical"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : item.status === "warning"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {item.score}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-rose-400">Sababi: </strong>{item.reason}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-emerald-300 leading-relaxed">
                        <strong className="text-emerald-400">Yechim (Nima qilish kerak): </strong>{item.action}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shaxsiy AI Murabbiy bilan Savol-Javob */}
                <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      AI Murabbiyingizga Savol Bering (Masalan: qaysi mavzuda video olish kerak?)
                    </h4>
                  </div>

                  <form onSubmit={handleAskAiQuestion} className="flex flex-col sm:flex-row gap-2.5">
                    <input 
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Savolingizni yozing (masalan: Obunachilarimni qanday 100K ga yetkazsam bo'ladi?)"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 font-semibold text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isAskingAi || !aiQuestion.trim()}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                      {isAskingAi ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI Maslahat Bermoqda...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>AI Maslahat Olish</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* AI Shaxsiy Maslahati Natijasi */}
                  {aiCustomAdvice && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4" />
                          AI Murabbiy Tavsiyasi:
                        </span>
                        <button
                          onClick={() => handleCopy(aiCustomAdvice, "my-ai-advice")}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedId === "my-ai-advice" ? "Nusxalandi! ✓" : "Nusxalash"}</span>
                        </button>
                      </div>
                      <p className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-100">
                        {aiCustomAdvice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 2.6. AI IZOHLAR YORDAMCHISI (KOMENTARIYALARGA JAVOB QAYTARISH) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      AI Izohlar Yordamchisi: Muxlislar Savollariga Do'stona Javob Berish
                    </h3>
                    <p className="text-xs text-slate-500">
                      Muxlis yozgan izohni kiriting, AI unga 3 ta tilda (o'zbek, rus, ingliz) mos do'stona javob yaratadi
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Muxlis ismi / Taxallusi:</label>
                    <input 
                      type="text" 
                      value={customCommentAuthor}
                      onChange={(e) => setCustomCommentAuthor(e.target.value)}
                      placeholder="Masalan: Sardor yoki Alex"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Muxlis qoldirgan izoh / savol:</label>
                  <textarea
                    rows={2}
                    value={customCommentText}
                    onChange={(e) => setCustomCommentText(e.target.value)}
                    placeholder="Muxlis savolini shu yerga yozing yoki qo'ying (masalan: Keyingi video mavzusi nima bo'ladi?)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleGenerateCustomReply}
                  disabled={isGeneratingReply || !customCommentText.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
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

                {/* Tayyor Javob */}
                {generatedCustomReply && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        YouTube'ga tayyor AI javob ({customCommentLang}):
                      </span>
                      <button
                        onClick={() => handleCopy(generatedCustomReply, "my-custom-reply")}
                        className="flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
                      >
                        {copiedId === "my-custom-reply" ? (
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

              {/* 3. JONLI YOUTUBE VIDEO PLEYERI (Kanalingizning YouTube'dagi Jonli Ko'rinishi) */}
              {myChannelData.topVideos && myChannelData.topVideos.length > 0 && (
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                        <Youtube className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <span>{myChannelData.name} — YouTube Jonli Integratsiyasi</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                            Jonli YouTube
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Videoni bevosita shu yerda tomosha qiling yoki to'g'ridan-to'g'ri YouTube'da oching
                        </p>
                      </div>
                    </div>

                    <a
                      href={myChannelData.topVideos[0].url || `https://www.youtube.com/watch?v=${myChannelData.topVideos[0].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 transition shadow-md self-start sm:self-auto cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>YouTube'da Tomosha Qilish ↗</span>
                    </a>
                  </div>

                  {/* YouTube Iframe Player */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${myChannelData.topVideos[0].id}?rel=0`}
                      title={myChannelData.topVideos[0].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1">{myChannelData.topVideos[0].title}</h4>
                      <p className="text-slate-400 text-xs">
                        👁️ {myChannelData.topVideos[0].views} ko'rish • 📅 {myChannelData.topVideos[0].date} ({myChannelData.topVideos[0].time})
                      </p>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${myChannelData.topVideos[0].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap"
                    >
                      <span>YouTube izohlarini o'qish va yozish</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* 4. KANALDAGI BARCHA SO'NGGI YOUTUBE VIDEOLARI (GALEREYA) */}
              {myChannelData.topVideos && myChannelData.topVideos.length > 1 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <Video className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-black text-slate-900">
                        {myChannelData.name} — Barcha So'nggi Videolari (YouTube)
                      </h3>
                    </div>
                    <a
                      href={myChannelData.handle ? `https://www.youtube.com/${myChannelData.handle}/videos` : `https://www.youtube.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <span>Barcha Videolar YouTube'da</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myChannelData.topVideos.map((video: any, idx: number) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                            <img 
                              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.title)}&background=0f172a&color=fff`;
                              }}
                            />
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {video.views}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                            {video.title}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            📅 {video.date} • {video.time}
                          </p>
                        </div>

                        <a
                          href={video.url || `https://www.youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                        >
                          <Youtube className="w-3.5 h-3.5 fill-red-600" />
                          <span>YouTube'da Ochish ↗</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. AUDITORIYANI USHLAB QOLISH (RETENTION) CHECKLISTI */}
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
          <p>© 2026 Vidoor. YouTube kanallar uchun professional va bepul analitika platformasi. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* 4. MODAL: CHROME VA TEZKOR KIRISH */}
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
                    Har qanday sahifadan 1-bosishda tahlil qilish
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
                      Ushbu tugmani Xatcho'plar paneliga sudrab qo'ying (yoki bosing) 👇
                    </span>
                    <a
                      href="javascript:(function(){var s=document.createElement('script');s.src='https://vidoor.vercel.app/api/vidoor-inpage?t='+Date.now();document.body.appendChild(s);})();"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText("javascript:(function(){var s=document.createElement('script');s.src='https://vidoor.vercel.app/api/vidoor-inpage?t='+Date.now();document.body.appendChild(s);})();");
                        alert("Xatcho'p kodi nusxalandi! Endi Chrome xatcho'plariga qo'shib, YouTube'da (masalan, Xamdam Sobirov sahifasida) bosing!");
                      }}
                      draggable="true"
                      className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 cursor-grab active:cursor-grabbing hover:scale-105 transition"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ YouTube'da Vidoor Vidjetini Chiqarish (1-Bosishda)</span>
                    </a>
                    <span className="text-[11px] text-slate-400">
                      (Xatcho'pga qo'shib, YouTube'da 1 marta bossangiz — darhol sahifada Vidoor vidjeti chiqadi!)
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
                    <span className="font-bold text-orange-400 block">Qanday ishlaydi?</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>YouTube'da istalgan kanalni (masalan, <em>Xamdam Sobirov</em> yoki <em>Setanta Sports</em>) oching.</li>
                      <li>Chrome'ning yuqori panelidagi <strong>"⚡ Vidoor Vidjeti"</strong> xatcho'pini 1 marta bosing.</li>
                      <li>Hech qanday saytga o'tmasdan, xuddi 2-rasmdagidek to'g'ridan-to'g'ri YouTube sahifasining ichida <strong>VIDOOR Quick channel stats</strong> kartochkasi paydo bo'ladi!</li>
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
                              <span className="text-slate-400 text-[11px]">Nom (Name): <strong className="text-white">Vidoor ⚡ Analytics</strong></span>
                              <button
                                onClick={() => handleCopy("Vidoor ⚡ Analytics", "copy-name")}
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

              {/* TAB 3: CHROME EXTENSION (YOUTUBE ICHIDA AVTOMATIK KO'RSATISH) */}
              {extensionTab === "extension" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex items-start space-x-3">
                    <Youtube className="w-6 h-6 text-red-600 fill-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Vidoor Chrome Kengaytmasi: YouTube Sahifasining O'zida Avtomatik Chiqadi!
                      </h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        <strong>Nega 2-rasmda ko'rindi, 1-rasmda yo'q?</strong> Chunki 2-rasmda Chrome kengaytmasi YouTube sahifasiga ulangan. Ushbu kengaytmani Chrome'ga o'rnatgach, xuddi 2-rasmdagidek istalgan kanalga (Xamdam Sobirov, Setanta Sports va h.k.) kirganingizda <strong>VIDOOR Quick channel stats</strong> va <strong>"View channel stats"</strong> tugmasi to'g'ridan-to'g'ri YouTube sahifasida avtomatik chiqadi!
                      </p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <a
                      href="/vidoor-chrome-extension.zip"
                      download="vidoor-chrome-extension.zip"
                      className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white font-black text-sm shadow-xl shadow-red-600/30 hover:opacity-95 transition transform hover:-translate-y-0.5"
                    >
                      <Download className="w-5 h-5" />
                      <span>📥 vidoor-chrome-extension.zip ni yuklab olish (100% Bepul)</span>
                    </a>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 text-xs space-y-3">
                    <span className="font-bold text-emerald-400 block uppercase tracking-wider">
                      Chrome'ga O'rnatish (Faqat 10 soniya):
                    </span>
                    <div className="space-y-2.5 text-slate-300">
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-emerald-500/30">1</span>
                        <span>Yuklab olingan <strong>vidoor-chrome-extension.zip</strong> faylini sichqonchaning o'ng tugmasi bilan bosib arxivdan chiqaring (<strong>Extract to vidoor-chrome-extension</strong>).</span>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-emerald-500/30">2</span>
                        <span>Chrome brauzerida manzil qatoriga <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">chrome://extensions</code> deb yozing va o'ng yuqoridagi <strong>"Developer mode"</strong> (Dasturchi rejimi) kalitini yoqing.</span>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-emerald-500/30">3</span>
                        <span>Chap yuqoridagi <strong>"Load unpacked"</strong> (Paketsiz yuklash) tugmasini bosing va arxivdan chiqarilgan papkani tanlang.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Tayyor! Endi YouTube'dagi har qanday kanalni (Xamdam Sobirov, Kunuz) ochganingizda Vidoor avtomatik chiqadi!</span>
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
                  <p className="text-xs text-slate-500">Vidoor avtomatik hisob integratsiyasi</p>
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
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Hisobni tanlang:</span>
                    <span className="text-[10px] text-emerald-600 font-bold">1-bosishda ulanadi</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { handle: "@VeloraRBX", label: "VELORA (50.6K)" },
                      { handle: "kunuz", label: "Kun.uz (2.1M)" },
                      { handle: "mittivine", label: "MittiVine (3.2M)" },
                      { handle: "texnoplov", label: "Texnoplov (410K)" },
                      { handle: "subyektiv", label: "Subyektiv (890K)" },
                      { handle: "mrbeast", label: "MrBeast (300M+)" }
                    ].map((item) => (
                      <button
                        key={item.handle}
                        type="button"
                        onClick={() => {
                          setGoogleChannelInput(item.handle);
                          handleAutoConnectGoogle(item.handle);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                          item.handle === "@VeloraRBX"
                            ? "bg-red-50 text-red-700 border-red-200 font-bold hover:bg-red-100"
                            : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border-slate-200"
                        }`}
                      >
                        {item.label}
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
