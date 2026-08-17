import React, { useState, useEffect } from 'react';
import { Flame, Swords, ShieldCheck, Trophy, Users, ArrowRight, CheckCircle2, MessageSquareCode, Phone, FileText, Share2, Heart, ExternalLink, Gift, Globe, Video, Clock, Copy, HelpCircle, ShieldAlert, Megaphone, BellRing, Calendar, ChevronRight, Lock, Coins, Target, Sparkles, Send, RefreshCw, XCircle, Clock3, DollarSign, Bot, Zap } from 'lucide-react';
import { TabType, RegisteredTeam, TournamentInfo, CommunityGroup, HomeConfig, AnnouncementItem, UserAccount, UserWallet, SiteConfig, FeatureRecommendation } from '../../types';
import { TOURNAMENT_FF_INFO, TOURNAMENT_MLBB_INFO, COMMUNITY_GROUPS, ADMIN_WA, INITIAL_ANNOUNCEMENTS } from '../../data/initialData';
import { SaweriaPaymentModal } from '../SaweriaPaymentModal';
import { processRecommendationPaymentSuccess } from '../../lib/saweriaService';
import { LiveBroadcastSection } from '../LiveBroadcastSection';

interface HomeViewProps {
  setActiveTab: (tab: TabType) => void;
  onOpenRegisterModal: (game?: 'FF' | 'MLBB') => void;
  registeredTeams: RegisteredTeam[];
  ffInfo?: TournamentInfo;
  mlbbInfo?: TournamentInfo;
  communityGroups?: CommunityGroup[];
  adminWa?: string;
  homeConfig?: HomeConfig;
  announcements?: AnnouncementItem[];
  currentUser?: UserAccount | null;
  isAdmin?: boolean;
  userWallet?: UserWallet;
  siteConfig?: SiteConfig;
  setSiteConfig?: React.Dispatch<React.SetStateAction<SiteConfig>>;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  setActiveTab, 
  onOpenRegisterModal, 
  registeredTeams,
  ffInfo = TOURNAMENT_FF_INFO,
  mlbbInfo = TOURNAMENT_MLBB_INFO,
  communityGroups = COMMUNITY_GROUPS,
  adminWa = ADMIN_WA,
  homeConfig,
  announcements = INITIAL_ANNOUNCEMENTS,
  currentUser,
  isAdmin = false,
  userWallet,
  siteConfig,
  setSiteConfig
}) => {
  const isUserAdmin = Boolean(isAdmin || currentUser?.role === 'admin' || currentUser?.isSuperAdmin);
  const ffCount = registeredTeams.filter(t => t.game === 'FF' && t.status === 'Sah').length;
  const mlbbCount = registeredTeams.filter(t => t.game === 'MLBB' && t.status === 'Sah').length;

  const ffSlotsRemaining = Math.max(0, (ffInfo.maxSlots || 32) - ffCount);
  const mlbbSlotsRemaining = Math.max(0, (mlbbInfo.maxSlots || 32) - mlbbCount);

  // Countdown timer state to 1 September 2026 - 12:00 WIB (UTC+7)
  const targetDeadline = new Date('2026-09-01T12:00:00+07:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDeadline - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDeadline]);

  // Copy ready-to-use message state
  const [copied, setCopied] = useState(false);

  // Feature Recommendation State
  const [recUserName, setRecUserName] = useState(currentUser?.name || 'Pengguna');
  const [recFeatureText, setRecFeatureText] = useState('');
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showSaweriaRecModal, setShowSaweriaRecModal] = useState(false);
  const [recAlertMsg, setRecAlertMsg] = useState<string | null>(null);

  const featureRecList = siteConfig?.featureRecommendations || [];

  const handleInitiateSaweriaRec = () => {
    if (!recUserName.trim() || !recFeatureText.trim()) {
      alert('Mohon isi nama pengguna dan teks rekomendasi fitur terlebih dahulu!');
      return;
    }
    setShowSaweriaRecModal(true);
  };

  const handleSaweriaRecSuccess = async () => {
    if (!siteConfig) return;
    await processRecommendationPaymentSuccess({
      userName: recUserName.trim(),
      featureText: recFeatureText.trim(),
      siteConfig,
      setSiteConfig
    });

    setRecFeatureText('');
    setRecAlertMsg(`✅ REKOMENDASI TERKIRIM! Ide fitur Anda telah masuk ke Panel Admin dengan status LUNAS & SIAP DITINJAU.`);
    setShowSaweriaRecModal(false);
    setTimeout(() => setRecAlertMsg(null), 10000);
  };

  const handleSendRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recUserName.trim() || !recFeatureText.trim()) {
      alert('Mohon isi nama pengguna dan teks rekomendasi fitur!');
      return;
    }

    const newRec: FeatureRecommendation = {
      id: `rec-${Date.now()}`,
      userName: recUserName.trim(),
      featureText: recFeatureText.trim(),
      fee: 5000,
      paymentStatus: 'LUNAS',
      status: 'DIPROSES',
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };

    if (setSiteConfig && siteConfig) {
      const updated = {
        ...siteConfig,
        featureRecommendations: [newRec, ...(siteConfig.featureRecommendations || [])]
      };
      setSiteConfig(updated);
    }

    setRecFeatureText('');
    setRecAlertMsg(`✅ Rekomendasi fitur berhasil terkirim ke Admin! Status: DIPROSES. Terima kasih atas masukan Anda.`);
    setTimeout(() => setRecAlertMsg(null), 8000);
  };

  const cleanWaNumber = adminWa.replace(/[^0-9]/g, '');

  const readyToUseMessage = `📢 *PENGUMUMAN RESMI TURNAMEN HUNTERS COMMUNITY x DEXZ STORE* 📢
--------------------------------------------------
🔥 *FREE FIRE & ⚔️ MOBILE LEGENDS: BANG BANG*

📅 *HITUNG MUNDUR PENDAFTARAN:*
Pendaftaran ditutup dalam waktu dekat!
Batas Akhir: 1 September 2026 — 12:00 WIB

🔥 *Free Fire*   → ${ffCount}/32 Slot (Masih tersedia ${ffSlotsRemaining} slot)
⚔️ *MLBB*       → ${mlbbCount}/32 Slot (Masih tersedia ${mlbbSlotsRemaining} slot)

⚠️ *Pendaftaran ditutup otomatis saat slot penuh! Segera amankan slot tim kamu sebelum habis!* 💨

💰 Biaya Slot: Rp 50.000 / Tim
🏆 Total Hadiah: Jutaan Rupiah + Trophy & E-Sertifikat

--------------------------------------------------
📲 *DAFTAR & HUBUNGI ADMIN SEKARANG:*
• Link Website: https://hunters.biz.id
• WhatsApp Admin: https://wa.me/${cleanWaNumber}

Ayo buktikan tim kamu yang terkuat! 🏆🔥`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(readyToUseMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const heroBadge = homeConfig?.heroBadge || 'DIKELOLA OLEH DEXZ STORE';
  const heroTitle = homeConfig?.heroTitle || 'HUNTERS COMMUNITY';
  const heroSubtitle = homeConfig?.heroSubtitle || 'Pusat Turnamen Free Fire & Mobile Legends • Resmi, Aman & Terpercaya';
  const heroDescription = homeConfig?.heroDescription || 'Satu-satunya wadah kompetitif esports terdepan yang dikelola profesional oleh DEXZ STORE. Total slot 32 tim per game, fair play terjamin, dan sistem kustom room terbaik!';
  const organizerTitle = homeConfig?.organizerTitle || '✨ DEXZ STORE ORGANIZER';
  const organizerSubtitle = homeConfig?.organizerSubtitle || 'Penyelenggara Turnamen Resmi • Terpercaya • Siap Melayani 24/7';

  // Social, Donation, and Custom Links configuration
  const tiktokUrl = homeConfig?.tiktokUrl || 'https://tiktok.com/@dexzstore.esports';
  const instagramUrl = homeConfig?.instagramUrl || 'https://instagram.com/hunters.community_official';
  const youtubeUrl = homeConfig?.youtubeUrl || 'https://youtube.com/@dexzstoreofficial';
  const donationUrl = homeConfig?.donationUrl || 'https://saweria.co/dexzstore';
  const donationTitle = homeConfig?.donationTitle || 'DONASI & BERI DUKUNGAN RESMI';
  const donationDescription = homeConfig?.donationDescription || 'Dukung perkembangan turnamen esports Hunters Community via Saweria, Trakteer, atau QRIS Resmi.';
  const customLinks = homeConfig?.customLinks || [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* HERO BANNER SECTION */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0f0f0f] border border-orange-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Dark Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="uppercase tracking-wider">{heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">
            {heroTitle}
          </h1>

          <p className="text-sm sm:text-lg text-orange-400 font-bold uppercase tracking-wide">
            {heroSubtitle}
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            {heroDescription}
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenRegisterModal('FF')}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-950/40 active:scale-95 transition-all uppercase tracking-wider"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>Daftar Free Fire</span>
            </button>

            <button
              onClick={() => onOpenRegisterModal('MLBB')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-950/40 active:scale-95 transition-all uppercase tracking-wider"
            >
              <Swords className="w-4 h-4 text-white" />
              <span>Daftar Mobile Legends</span>
            </button>

            <button
              onClick={() => setActiveTab('donasi')}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-lg shadow-rose-950/40 active:scale-95 transition-all uppercase tracking-wider"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>DONASI &amp; BERI DUKUNGAN RESMI</span>
            </button>

            <button
              onClick={() => setActiveTab('cara-daftar')}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all uppercase tracking-wider"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Cara Daftar &amp; Bayar</span>
            </button>
          </div>
        </div>
      </div>

      {/* BANNER UTAMA: DONASI & BERI DUKUNGAN RESMI (BERANDA BAGIAN ATAS) */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1a080e] via-[#0f0f0f] to-[#120817] border-2 border-rose-500/40 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/30 to-pink-600/20 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-950/50">
            <Heart className="w-7 h-7 fill-rose-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300 font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>SAWERIA QRIS RESMI • DUKUNGAN KOMUNITAS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>DONASI &amp; BERI DUKUNGAN RESMI</span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              Dukung kemajuan &amp; prize pool turnamen esports Hunters Community via Saweria QRIS otomatis terverifikasi ke Firebase &amp; tercatat di Top Donatur!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto relative z-10 shrink-0">
          <button
            onClick={() => setActiveTab('donasi')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Buka Donasi &amp; QRIS</span>
          </button>

          {donationUrl && (
            <a
              href={donationUrl.startsWith('http') ? donationUrl : `https://${donationUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all uppercase tracking-wider"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Saweria Web</span>
            </a>
          )}
        </div>
      </div>

      {/* BANNER UTAMA: PUSAT KECERDASAN GEMINI AI */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#17062e] via-[#0b0318] to-[#1a0a2a] border-2 border-purple-500/50 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 border border-purple-400/50 text-white flex items-center justify-center shrink-0 shadow-xl shadow-purple-950/80">
            <Bot className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>GEMINI 3.1 &amp; 3.5 AI STUDIO • RESMI</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>PUSAT KECERDASAN GEMINI AI</span>
            </h2>
            <p className="text-xs text-purple-200/80 max-w-xl leading-relaxed">
              Asisten AI Pintar Turnamen: Chat strategi, live search patch MLBB/FF terkini, generator logo tim 1K/2K/4K, dan analisis mendalam taktik esports High Thinking!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto relative z-10 shrink-0">
          <button
            onClick={() => setActiveTab('gemini-ai')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-purple-950/60 active:scale-95 transition-all uppercase tracking-wider cursor-pointer border border-purple-300/30"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Buka Gemini AI Studio</span>
          </button>
        </div>
      </div>

      {/* NAVIGASI MENU UTAMA BERANDA */}
      <div id="menu-beranda" className="p-4 sm:p-5 bg-[#0f0f0f] border border-amber-500/30 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-amber-400">🧭 MENU BERANDA</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
              Akses Cepat
            </span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">DEXZ STORE Esports</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {/* MENU GEMINI AI */}
          <button
            onClick={() => setActiveTab('gemini-ai')}
            className="p-3 bg-gradient-to-b from-purple-950/90 to-[#0c0217] border border-purple-500/70 hover:border-purple-400 rounded-xl text-left space-y-1.5 group transition-all relative overflow-hidden shadow-lg shadow-purple-950/40"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-500/30 text-amber-300 rounded-lg group-hover:scale-110 transition-transform border border-purple-400/40">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-[9px] bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black px-1.5 py-0.5 rounded uppercase">
                AI HUB
              </span>
            </div>
            <p className="text-xs font-black text-white group-hover:text-purple-300 leading-tight">
              GEMINI AI
            </p>
            <p className="text-[10px] text-amber-300/80 line-clamp-1">
              Chat, Logo &amp; Taktik
            </p>
          </button>

          {/* MENU DONASI & BERI DUKUNGAN RESMI */}
          <button
            onClick={() => setActiveTab('donasi')}
            className="p-3 bg-gradient-to-b from-rose-950/80 to-[#050505] border border-rose-500/60 hover:border-rose-400 rounded-xl text-left space-y-1.5 group transition-all relative overflow-hidden shadow-lg shadow-rose-950/30"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-rose-500/20 text-rose-300 rounded-lg group-hover:scale-110 transition-transform border border-rose-500/30">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              </div>
              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded uppercase">
                RESMI
              </span>
            </div>
            <p className="text-xs font-black text-white group-hover:text-rose-300 leading-tight">
              DONASI RESMI
            </p>
            <p className="text-[10px] text-rose-300/80 line-clamp-1">
              Beri Dukungan
            </p>
          </button>

          <button
            onClick={() => onOpenRegisterModal('MLBB')}
            className="p-3 bg-[#050505] border border-neutral-800 hover:border-blue-500/40 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Swords className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-blue-400 leading-tight">
              Daftar MLBB
            </p>
            <p className="text-[10px] text-neutral-400 line-clamp-1">
              32 Slot Turnamen
            </p>
          </button>

          {/* DRAFT PICK MLBB MENU */}
          <button
            onClick={() => setActiveTab('mlbb')}
            className="p-3 bg-gradient-to-b from-blue-950/80 to-slate-900 border border-blue-500/60 hover:border-blue-400 rounded-xl text-left space-y-1.5 group transition-all shadow-lg shadow-blue-950/30 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform border border-blue-500/30">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-blue-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                HOT S41
              </span>
            </div>
            <p className="text-xs font-black text-white group-hover:text-blue-300 leading-tight">
              Draft Pick MLBB
            </p>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              Counter Hero MLBB
            </p>
          </button>

          <button
            onClick={() => setActiveTab('prediksi')}
            className="p-3 bg-gradient-to-b from-amber-950/40 to-[#050505] border border-amber-500/40 hover:border-amber-400 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg w-fit group-hover:scale-110 transition-transform border border-amber-500/30">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-amber-300 leading-tight">
              Menu Prediksi
            </p>
            <p className="text-[10px] text-amber-400/80 line-clamp-1">
              Bertaruh Match
            </p>
          </button>

          <button
            onClick={() => setActiveTab('saldo')}
            className="p-3 bg-gradient-to-b from-emerald-950/40 to-[#050505] border border-emerald-500/40 hover:border-emerald-400 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition-transform border border-emerald-500/30">
              <Coins className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-emerald-300 leading-tight">
              Menu Saldo
            </p>
            <p className="text-[10px] text-emerald-400 font-bold line-clamp-1">
              Top Up &amp; Kelola
            </p>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('rekomendasi-fitur');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 bg-gradient-to-b from-purple-950/80 to-[#050505] border border-purple-500/60 hover:border-purple-400 rounded-xl text-left space-y-1.5 group transition-all relative overflow-hidden shadow-lg shadow-purple-950/30"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg group-hover:scale-110 transition-transform border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-purple-500 text-white font-black px-1.5 py-0.5 rounded uppercase">
                BARU
              </span>
            </div>
            <p className="text-xs font-black text-white group-hover:text-purple-300 leading-tight">
              Rekomendasi Fitur
            </p>
            <p className="text-[10px] text-purple-300/80 line-clamp-1">
              Usul Menu (Rp 5rb)
            </p>
          </button>

          <button
            onClick={() => onOpenRegisterModal('FF')}
            className="p-3 bg-[#050505] border border-neutral-800 hover:border-orange-500/40 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-orange-600/20 text-orange-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-orange-400 leading-tight">
              Daftar Free Fire
            </p>
            <p className="text-[10px] text-neutral-400 line-clamp-1">
              32 Slot Turnamen
            </p>
          </button>

          <button
            onClick={() => setActiveTab('total-hadiah')}
            className="p-3 bg-[#050505] border border-neutral-800 hover:border-amber-500/40 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-amber-400 leading-tight">
              Total Hadiah
            </p>
            <p className="text-[10px] text-neutral-400 line-clamp-1">
              Prize Pool & Trophy
            </p>
          </button>

          <button
            onClick={() => setActiveTab('info-match')}
            className="p-3 bg-[#050505] border border-neutral-800 hover:border-yellow-500/40 rounded-xl text-left space-y-1.5 group transition-all"
          >
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white group-hover:text-yellow-400 leading-tight">
              Info Match
            </p>
            <p className="text-[10px] text-neutral-400 line-clamp-1">
              Jadwal &amp; Bracket
            </p>
          </button>
        </div>
      </div>

      {/* 1. HITUNG MUNDUR PENDAFTARAN & STATUS KETERISIAN SLOT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* COUNTDOWN TIMER CARD */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-orange-950/40 via-[#0f0f0f] to-red-950/40 border border-orange-500/40 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-orange-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                1. HITUNG MUNDUR PENDAFTARAN
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
              Batas: 1 September 2026 — 12:00 WIB
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-medium">
            Pendaftaran ditutup dalam:
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto sm:mx-0">
            <div className="bg-[#050505] border border-orange-500/30 rounded-xl p-2.5 sm:p-3 text-center shadow-md">
              <span className="text-xl sm:text-3xl font-black text-orange-400 font-mono block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider block mt-1">
                📅 Hari
              </span>
            </div>
            <div className="bg-[#050505] border border-orange-500/30 rounded-xl p-2.5 sm:p-3 text-center shadow-md">
              <span className="text-xl sm:text-3xl font-black text-orange-400 font-mono block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider block mt-1">
                ⏰ Jam
              </span>
            </div>
            <div className="bg-[#050505] border border-orange-500/30 rounded-xl p-2.5 sm:p-3 text-center shadow-md">
              <span className="text-xl sm:text-3xl font-black text-orange-400 font-mono block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider block mt-1">
                ⏱️ Menit
              </span>
            </div>
            <div className="bg-[#050505] border border-orange-500/30 rounded-xl p-2.5 sm:p-3 text-center shadow-md">
              <span className="text-xl sm:text-3xl font-black text-orange-400 font-mono block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider block mt-1">
                ⚡ Detik
              </span>
            </div>
          </div>
        </div>

        {/* STATUS KETERISIAN SLOT CARD */}
        <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>STATUS KETERISIAN SLOT</span>
            </h3>
            <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
              Slot Terbatas!
            </span>
          </div>

          <div className="space-y-3">
            {/* FF Slot */}
            <div className="p-3.5 bg-[#050505] border border-orange-500/30 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" /> 🔥 Free Fire
                </span>
                <span className="text-orange-400 font-mono font-black">{ffCount}/32 Slot</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500" 
                  style={{ width: `${Math.min(100, (ffCount / 32) * 100)}%` }} 
                />
              </div>
              <p className="text-[11px] text-neutral-300 font-medium">
                → <strong className="text-orange-400">{ffCount}/32</strong> — Masih tersedia <strong className="text-emerald-400 font-mono">{ffSlotsRemaining} slot</strong>
              </p>
            </div>

            {/* MLBB Slot */}
            <div className="p-3.5 bg-[#050505] border border-blue-500/30 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-blue-400" /> ⚔️ MLBB
                </span>
                <span className="text-blue-400 font-mono font-black">{mlbbCount}/32 Slot</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500" 
                  style={{ width: `${Math.min(100, (mlbbCount / 32) * 100)}%` }} 
                />
              </div>
              <p className="text-[11px] text-neutral-300 font-medium">
                → <strong className="text-blue-400">{mlbbCount}/32</strong> — Masih tersedia <strong className="text-emerald-400 font-mono">{mlbbSlotsRemaining} slot</strong>
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
            <p className="text-xs font-bold text-amber-300">
              Pendaftaran ditutup otomatis saat penuh! Segera daftar sebelum slot habis! 💨
            </p>
          </div>
        </div>
      </div>

      {/* 📢 PENGUMUMAN TERBARU DI BERANDA */}
      <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400 animate-bounce" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">📢 PENGUMUMAN & INFORMASI TERBARU</h2>
          </div>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Semua Pengumuman</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="p-6 text-center bg-[#050505] border border-neutral-800/80 rounded-xl text-neutral-400 space-y-1.5">
            <Megaphone className="w-7 h-7 text-neutral-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-neutral-300">Belum ada pengumuman resmi</p>
            <p className="text-[11px] text-neutral-500">Silakan pantau informasi dan jadwal terbaru dari panitia DEXZ STORE.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 2).map((item) => (
              <div key={item.id} className="p-4 bg-[#050505] border border-neutral-800 hover:border-amber-500/40 rounded-xl space-y-2 transition-all">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.category}
                  </span>
                  <span className="text-neutral-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SALIN PESAN SIAP PAKAI (AKSES KHUSUS ADMIN) */}
      {isUserAdmin ? (
        <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-emerald-500/30 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>2. Salin Pesan Siap Pakai</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  🛡️ Akses Khusus Admin
                </span>
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              Tampilkan teks pengumuman lengkap → cukup tekan tombol Salin → langsung siap dikirim ke WhatsApp / Grup
            </span>
          </div>

          <div className="relative bg-[#050505] border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border-l-4 border-l-emerald-500">
            {readyToUseMessage}
          </div>

          <button
            onClick={handleCopyMessage}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-wider"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            <span>{copied ? '✅ TEKS BERHASIL DISALIN! SIAP DIKIRIM' : '📋 SALIN PESAN ANNOUNCEMENT WHATSAPP'}</span>
          </button>
        </div>
      ) : (
        <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-black text-white uppercase tracking-tight">2. Salin Pesan Siap Pakai</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  🔒 Akses Khusus Admin
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Fitur generator & salin pesan pengumuman WhatsApp ini khusus untuk Admin Turnamen. Silakan login sebagai Admin untuk menyalin pesan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('login')}
            className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider shrink-0"
          >
            Login Admin 🔑
          </button>
        </div>
      )}

      {/* 📺 SIARAN LANGSUNG (YOUTUBE & TIKTOK LIVE DEXZ STORE) */}
      <LiveBroadcastSection 
        homeConfig={siteConfig?.homeConfig || homeConfig}
        isAdmin={isUserAdmin}
        onOpenAdminLiveTab={() => setActiveTab('admin')}
      />

      {/* QUICK GAME TOURNAMENT CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Trophy className="w-5 h-5 text-orange-500" />
            <span>Turnamen Utama Mendatang</span>
          </h2>
          <span className="text-xs text-orange-400 font-mono font-bold uppercase tracking-wider">Pendaftaran Terbuka</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* FREE FIRE CARD */}
          <div className="bg-[#0f0f0f] border border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl hover:border-orange-500/60 transition-all flex flex-col justify-between">
            <div className="relative h-44 sm:h-52 overflow-hidden bg-neutral-900">
              <img 
                src={ffInfo.bannerImage} 
                alt="Free Fire Tournament Banner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-orange-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Free Fire</span>
              </div>
              <div className="absolute top-3 right-3 bg-[#050505]/90 backdrop-blur-md border border-orange-500/30 text-orange-400 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                {ffInfo.fee} / Tim
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-black text-white italic uppercase underline decoration-2 underline-offset-4 decoration-orange-500">{ffInfo.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">Batas Pendaftaran: <strong className="text-orange-400 font-mono">{ffInfo.deadline}</strong></p>
              </div>

              {/* Rules preview list */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 border-y border-neutral-800/80 py-2.5">
                <p>✓ Falco Only</p>
                <p>✓ Alok/Hayato Only</p>
                <p>❌ No Cheat/Mod</p>
                <p>❌ No Jump Shoes</p>
              </div>

              {/* Slot Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-400">Slot Terisi:</span>
                  <span className="text-orange-400 font-mono">{ffCount} / {ffInfo.maxSlots} Tim</span>
                </div>
                <div className="w-full h-2.5 bg-[#050505] rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500" 
                    style={{ width: `${(ffCount / ffInfo.maxSlots) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenRegisterModal('FF')}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm py-3 rounded-xl text-center shadow-lg shadow-orange-950/40 active:scale-95 transition-all uppercase tracking-wider"
                >
                  Daftar Free Fire
                </button>
                <button
                  onClick={() => setActiveTab('ff')}
                  className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Detail & Aturan
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE LEGENDS CARD */}
          <div className="bg-[#0f0f0f] border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl hover:border-blue-500/60 transition-all flex flex-col justify-between">
            <div className="relative h-44 sm:h-52 overflow-hidden bg-neutral-900">
              <img 
                src={mlbbInfo.bannerImage} 
                alt="Mobile Legends Tournament Banner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5" />
                <span>MLBB</span>
              </div>
              <div className="absolute top-3 right-3 bg-[#050505]/90 backdrop-blur-md border border-blue-500/30 text-blue-400 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                {mlbbInfo.fee} / Tim
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-black text-white italic uppercase underline decoration-2 underline-offset-4 decoration-blue-500">{mlbbInfo.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">Batas Pendaftaran: <strong className="text-blue-400 font-mono">{mlbbInfo.deadline}</strong></p>
              </div>

              {/* Rules preview list */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 border-y border-neutral-800/80 py-2.5">
                <p>✓ Land of Dawn</p>
                <p>✓ Kustom 5v5</p>
                <p>❌ No Trash Talk</p>
                <p>❌ No Lag Protests</p>
              </div>

              {/* Slot Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-400">Slot Terisi:</span>
                  <span className="text-blue-400 font-mono">{mlbbCount} / {mlbbInfo.maxSlots} Tim</span>
                </div>
                <div className="w-full h-2.5 bg-[#050505] rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500" 
                    style={{ width: `${(mlbbCount / mlbbInfo.maxSlots) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenRegisterModal('MLBB')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm py-3 rounded-xl text-center shadow-lg shadow-blue-950/40 active:scale-95 transition-all uppercase tracking-wider"
                >
                  Daftar Mobile Legends
                </button>
                <button
                  onClick={() => setActiveTab('mlbb')}
                  className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Detail & Aturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEBIJAKAN PENGEMBALIAN DANA (REFUND POLICY) */}
      <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            KEBIJAKAN PENGEMBALIAN DANA
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <span className="font-extrabold text-xs text-emerald-400 block uppercase tracking-wider">
              ✅ Dikembalikan Penuh Jika:
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Pendaftaran dibatalkan oleh Panitia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Jadwal diubah & tidak sesuai tim</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Slot penuh sebelum dikonfirmasi</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
            <span className="font-extrabold text-xs text-red-400 block uppercase tracking-wider">
              ❌ TIDAK Dikembalikan Jika:
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Batal sepihak setelah terdaftar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Tidak hadir saat pertandingan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Didiskualifikasi karena pelanggaran</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
          <p className="text-xs text-amber-300 font-mono font-bold">
            ⏳ Waktu proses: Maksimal 2×24 jam setelah alasan disetujui.
          </p>
        </div>
      </div>

      {/* TAMBAHKAN PERTANYAAN (FAQ) */}
      <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            PERTANYAAN FREKUENSI TINGGI (FAQ)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Bisa ganti nama tim?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → Tidak, setelah terdaftar sah TIDAK BISA diubah
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Bisa ganti pemain?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → Hubungi Admin sebelum pertandingan
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Belum menerima kode ruang?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → Pastikan sudah masuk grup WA
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Terlambat hadir?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → 5 menit setelah jam mulai = kemenangan lawan
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Salah bayar / batal daftar?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → Hubungi Admin secepatnya
            </p>
          </div>

          <div className="p-4 bg-[#050505] border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Kapan hadiah dibagikan?
            </h4>
            <p className="text-xs text-amber-400 font-bold pl-3">
              → Maksimal 1×24 jam setelah hasil sah
            </p>
          </div>
        </div>
      </div>

      {/* QUICK MENU GRID */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
          <span>🧭 Navigasi Pusat Informasi</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('cara-daftar')}
            className="p-4 bg-[#0f0f0f] hover:bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-orange-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Cara Daftar</h4>
            <p className="text-[11px] text-neutral-400">Langkah & pembayaran</p>
          </button>

          <button
            onClick={() => setActiveTab('aturan')}
            className="p-4 bg-[#0f0f0f] hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Aturan Lengkap</h4>
            <p className="text-[11px] text-neutral-400">Regulasi & larangan</p>
          </button>

          <button
            onClick={() => setActiveTab('tim')}
            className="p-4 bg-[#0f0f0f] hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Tim Terdaftar</h4>
            <p className="text-[11px] text-neutral-400">Cek daftar peserta</p>
          </button>

          <button
            onClick={() => setActiveTab('grup')}
            className="p-4 bg-[#0f0f0f] hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-emerald-500/20">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Grup Komunitas</h4>
            <p className="text-[11px] text-neutral-400">Link WhatsApp resmi</p>
          </button>
        </div>
      </div>

      {/* WHATSAPP COMMUNITY GROUPS HIGHLIGHT */}
      <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">🔗 Grup Komunitas WhatsApp Resmi</h2>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Aktif 24/7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COMMUNITY_GROUPS.map((grp) => (
            <a
              key={grp.id}
              href={grp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <span className="text-xs font-black text-emerald-400 block mb-1 uppercase tracking-wider">{grp.title}</span>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{grp.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                <span className="uppercase text-[11px] tracking-wider">Gabung Sekarang</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* SOCIAL MEDIA & OFFICIAL LINKS SECTION */}
      <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pink-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">📱 Media Sosial & Komunitas Official</h2>
          </div>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
            Ikuti Kami
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TIKTOK */}
          {tiktokUrl && (
            <a
              href={tiktokUrl.startsWith('http') ? tiktokUrl : `https://${tiktokUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 hover:border-pink-500/50 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">TikTok Official</h4>
                  <p className="text-[11px] text-neutral-400">@dexzstore.esports</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          {/* INSTAGRAM */}
          {instagramUrl && (
            <a
              href={instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Instagram Official</h4>
                  <p className="text-[11px] text-neutral-400">@hunters.community</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          {/* YOUTUBE */}
          {youtubeUrl && (
            <a
              href={youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/50 rounded-xl flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">YouTube Channel</h4>
                  <p className="text-[11px] text-neutral-400">Livestream & Highlights</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>

      {/* CUSTOM LINKS SECTION (TAUTAN LAINNYA) */}
      {customLinks.length > 0 && (
        <div className="p-5 sm:p-6 bg-[#0f0f0f] border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">🌐 Tautan Resmi & Layanan Lainnya</h2>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
              {customLinks.length} Tautan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customLinks.map((link) => (
              <a
                key={link.id}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded uppercase">
                        {link.badge}
                      </span>
                    )}
                    <h4 className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors uppercase">{link.title}</h4>
                  </div>
                  {link.description && <p className="text-[11px] text-neutral-400">{link.description}</p>}
                </div>
                <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FITUR REKOMENDASI MENU / FITUR BARU */}
      <div id="rekomendasi-fitur" className="p-5 sm:p-6 bg-gradient-to-br from-[#0e0c15] via-[#130f1c] to-[#0a0812] border border-purple-500/40 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse text-purple-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-300 font-extrabold uppercase mb-1">
                <span>💡 USULAN PENGGUNA</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">REKOMENDASI MENU / FITUR BARU</h2>
              <p className="text-xs text-neutral-300">Punya ide menu atau fitur baru untuk aplikasi? Kirimkan rekomendasi Anda sekarang!</p>
            </div>
          </div>
          <div className="text-right shrink-0 bg-purple-950/60 border border-purple-500/30 px-3.5 py-2 rounded-xl">
            <span className="text-[10px] text-purple-300 font-extrabold uppercase block">Biaya Rekomendasi</span>
            <strong className="text-sm font-black text-amber-300 font-mono">Rp 5.000</strong>
          </div>
        </div>

        {recAlertMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-between animate-in fade-in">
            <span>{recAlertMsg}</span>
            <button type="button" onClick={() => setRecAlertMsg(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        <form onSubmit={handleSendRecommendation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">👤 Nama Pengguna / Akun:</label>
              <input
                type="text"
                required
                value={recUserName}
                onChange={(e) => setRecUserName(e.target.value)}
                placeholder="Masukkan nama pengguna..."
                className="w-full bg-[#050505] border border-neutral-700 rounded-xl p-3 text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">💵 Biaya Rekomendasi & Pembayaran:</label>
              <div className="bg-[#050505] border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300 font-black font-mono">Rp 5.000</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-extrabold">QRIS DEXZ STORE</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrisModal(true)}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>🖼️ Lihat QRIS (Rp 5.000)</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1">📝 Isi Teks Rekomendasi Fitur:</label>
            <textarea
              required
              rows={3}
              value={recFeatureText}
              onChange={(e) => setRecFeatureText(e.target.value)}
              placeholder="Tuliskan rekomendasi fitur atau ide menu baru secara rinci..."
              className="w-full bg-[#050505] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* DISPLAY QRIS INLINE */}
          <div className="bg-[#050505] border border-purple-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                <span>📲 QRIS Pembayaran Biaya Rekomendasi (Rp 5.000)</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">NMID: {siteConfig?.qrisNmid || 'ID1025383919053'}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center border border-amber-400 shadow-md">
                {siteConfig?.qrisImageUrl ? (
                  <img src={siteConfig.qrisImageUrl} alt="QRIS" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <span className="text-[10px] font-black text-slate-900 block">QRIS DEXZ STORE</span>
                    <span className="text-[8px] text-slate-700 block font-mono">Rp 5.000</span>
                    <div className="mt-1 bg-slate-900 text-white text-[8px] p-1 rounded font-mono">Scan QRIS</div>
                  </div>
                )}
              </div>
              <div className="text-xs space-y-1 text-center sm:text-left">
                <p className="font-bold text-white">Panduan Pembayaran QRIS:</p>
                <ol className="list-decimal list-inside text-[11px] text-neutral-300 space-y-0.5">
                  <li>Scan QRIS menggunakan aplikasi Bank (BCA, Mandiri, BRI, Dll) atau E-Wallet (Dana, Gopay, OVO, ShopeePay).</li>
                  <li>Transfer nominal biaya rekomendasi sebesar <strong className="text-amber-300 font-mono">Rp 5.000</strong>.</li>
                  <li>Setelah transfer selesai, klik tombol <strong>"KIRIM REKOMENDASI FITUR"</strong> di bawah.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* 💰 TOMBOL UTAMA: BAYAR SEKARANG VIA SAWERIA */}
            <button
              type="button"
              onClick={handleInitiateSaweriaRec}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-purple-950/50 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border-2 border-purple-400/50"
            >
              <DollarSign className="w-4 h-4 text-amber-300" />
              <span>💰 BAYAR SEKARANG (SAWERIA QRIS NYATA — RP 5.000 OTOMATIS LUNAS & SIAP DITINJAU ✅)</span>
            </button>

            {/* TOMBOL ALTERNATIF: KIRIM MANUAL */}
            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-purple-400" />
              <span>Kirim Usulan Rekomendasi (Manual Rp 5.000)</span>
            </button>
          </div>
        </form>

        {/* DAFTAR REKOMENDASI TERKIRIM & STATUSNYA */}
        {featureRecList.length > 0 && (
          <div className="pt-3 border-t border-purple-500/20 space-y-3">
            <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-purple-400" />
              <span>DAFTAR REKOMENDASI FITUR TERKIRIM & STATUS ADMIN ({featureRecList.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {featureRecList.map((rec) => (
                <div key={rec.id} className="p-3.5 bg-[#050505] border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{rec.userName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">({rec.createdAt})</span>
                    </div>

                    {/* STATUS BADGE */}
                    <div>
                      {rec.status === 'DIPROSES' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>DIPROSES ADMIN</span>
                        </span>
                      )}
                      {rec.status === 'TIDAK_DAPAT_DIPROSES' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>TIDAK DAPAT DIPROSES</span>
                        </span>
                      )}
                      {rec.status === 'BERHASIL_DITAMBAHKAN' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>BERHASIL DITAMBAHKAN</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-200 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 font-sans">
                    "{rec.featureText}"
                  </p>

                  {/* ADMIN REASON DISPLAY IF NOT PROCESSED OR IMPLEMENTED */}
                  {rec.adminReason && (
                    <div className="p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-300 font-mono">
                      <strong>Alasan Admin:</strong> {rec.adminReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QRIS POPUP MODAL */}
      {showQrisModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
              📲 QRIS PEMBAYARAN REKOMENDASI (RP 5.000)
            </h3>
            <p className="text-xs text-neutral-300">
              Silakan scan QRIS di bawah ini melalui BCA, Mandiri, BRI, Dana, Gopay, OVO, atau ShopeePay.
            </p>

            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center border-2 border-amber-400 shadow-xl">
              {siteConfig?.qrisImageUrl ? (
                <img src={siteConfig.qrisImageUrl} alt="QRIS" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <span className="text-xs font-black text-slate-900 block">QRIS DEXZ STORE</span>
                  <span className="text-xs text-slate-700 font-mono block">NMID: {siteConfig?.qrisNmid || 'ID1025383919053'}</span>
                  <span className="text-xs font-black text-emerald-700 block mt-1">Biaya: Rp 5.000</span>
                </div>
              )}
            </div>

            <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-xs font-mono text-amber-300">
              NMID: {siteConfig?.qrisNmid || 'ID1025383919053'}
            </div>

            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Tutup QRIS
            </button>
          </div>
        </div>
      )}

      {/* FOOTER ORGANIZER CREDENTIALS */}
      <div className="p-5 bg-[#0f0f0f] border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg">
        <div>
          <h4 className="text-xs font-black text-orange-400 uppercase tracking-wider">{organizerTitle}</h4>
          <p className="text-[11px] text-neutral-400">{organizerSubtitle}</p>
        </div>
        <a
          href={`https://wa.me/${cleanWaNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat Admin ({adminWa})</span>
        </a>
      </div>

      {/* SAWERIA RECOMMENDATION PAYMENT MODAL */}
      {showSaweriaRecModal && (
        <SaweriaPaymentModal
          isOpen={showSaweriaRecModal}
          onClose={() => setShowSaweriaRecModal(false)}
          title="Biaya Rekomendasi Menu / Fitur Baru"
          subtitle={`Usulan oleh: ${recUserName}`}
          type="FEATURE_RECOMMENDATION"
          amount={5000}
          payerName={recUserName}
          message={recFeatureText}
          onConfirmSuccess={handleSaweriaRecSuccess}
          successButtonText="Lihat Status Rekomendasi Saya"
        />
      )}
    </div>
  );
};

