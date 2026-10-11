import React from "react";
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
  ShieldCheck
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-extrabold text-xl tracking-wider">
              V
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-orange-500 bg-clip-text text-transparent">
                Vidoor
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                YouTube AI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="#demo"
              className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
            >
              Imkoniyatlar
            </a>
            <button className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2">
              Kirish
            </button>
            <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition">
              Boshlash
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.orange.50),white)] opacity-60" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Blogerlar uchun yangi avlod analitika va AI yordamchi</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            YouTube kanallarni chuqur tahlil qiling va{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              auditoriyangizni o'stiring
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Raqobatchilar videolarni soat nechida qo'yadi? Necha daqiqalik video ko'proq ko'riladi? Yo'nalishdagi <strong>RPM</strong> va daromad qancha? <strong>Vidoor</strong> barchasini ko'rsatadi va izohlarga o'sha tilda do'stona javob qaytaradi.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-2 border-emerald-500/30 p-2 focus-within:border-emerald-500 transition">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Istalgan YouTube kanal linki yoki nomini kiriting... (masalan: @mrbeast)"
                className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base"
                defaultValue="@texnoplov"
              />
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center space-x-2 whitespace-nowrap transition">
                <span>Analiz qilish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              * Bepul va ro'yxatdan o'tmasdan sinab ko'rish mumkin
            </p>
          </div>
        </div>
      </section>

      {/* Feature Preview Cards */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Vidoor platformasining 4 ta asosiy kuchi
          </h2>
          <p className="mt-2 text-slate-600">
            Kanal muvaffaqiyati uchun zarur barcha ma'lumotlar bitta ekranda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Eng optimal vaqtlar</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Kanal videolari haftaning qaysi kuni va soat nechida ko'proq yuklanishi va eng ko'p natija berishini aniqlaydi.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
              <span>Tavsiya: Seshanba, 18:30</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">RPM va Oylik daromad</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Kanal mavzusi (niche) bo'yicha 1000 ko'rish daromadi (RPM) va oyiga qancha topishi mumkinligini hisoblaydi.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-orange-600">
              <span>Taxminiy RPM: $2.40 - $4.80</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Davomiylik va Retention</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Necha daqiqalik videolar auditoriyani ko'proq ushlab turadi va tomoshabinlar videoning qancha qismini ko'ryapti.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
              <span>Eng yaxshi hajm: 11-14 daqiqa</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Do'stona AI javoblar</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Izoh qaysi tilda (o'zbek, rus, ingliz) bo'lsa, o'sha tilda bir zumda samimiy va do'stona javob tayyorlaydi.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-rose-600">
              <span>Avtomat yoki tasdiqlash bilan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Mock Dashboard Preview */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Namunaviy Tahlil</span>
              <h3 className="text-2xl font-bold mt-1">Kanal Tahlili: @Texnoplov</h3>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Faol kanal
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-950 text-orange-400 border border-orange-800">
                Niche: Texnologiya & Gadjetlar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
              <span className="text-xs text-slate-400">O'rtacha video davomiyligi</span>
              <p className="text-3xl font-extrabold text-white mt-2">12 daq 45 son</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">↑ Tomoshabinlar 58% qismini ko'rmoqda</p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
              <span className="text-xs text-slate-400">Eng samarali yuklash vaqti</span>
              <p className="text-3xl font-extrabold text-orange-400 mt-2">18:00 - 19:30</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Payshanba va Yakshanba kunlari</p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700">
              <span className="text-xs text-slate-400">Taxminiy oylik daromad (RPM: $3.20)</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">$1,450 - $2,800</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">So'nggi 30 kunlik ko'rishlar asosida</p>
            </div>
          </div>

          <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-sm">Vidoor AI Tavsiyasi:</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "Ushbu kanalning 10-14 daqiqalik videolari qisqa videolarga qaraganda 42% ko'proq tomosha vaqtini yig'moqda. Texnologiya mavzusida RPM yuqori ($3+). Agar videolarni soat 18:30 da chiqarsangiz, dastlabki 2 soatdagi ko'rishlar maksimal darajada oshadi."
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Vidoor. YouTube ijodkorlari uchun mehr bilan yaratilgan. Muallif: Khan</p>
        </div>
      </footer>
    </div>
  );
}
