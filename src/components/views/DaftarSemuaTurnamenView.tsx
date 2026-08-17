import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Swords, 
  Calendar, 
  Clock, 
  Users, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SiteConfig, RegisteredTeam, TabType } from '../../types';

interface DaftarSemuaTurnamenViewProps {
  siteConfig: SiteConfig;
  registeredTeams: RegisteredTeam[];
  setActiveTab: (tab: TabType) => void;
  onOpenRegisterModal: (game?: 'FF' | 'MLBB') => void;
  onSelectInfoMatchSubTab?: (subTab: string) => void;
}

export const DaftarSemuaTurnamenView: React.FC<DaftarSemuaTurnamenViewProps> = ({
  siteConfig,
  registeredTeams,
  setActiveTab,
  onOpenRegisterModal,
  onSelectInfoMatchSubTab,
}) => {
  const [selectedGameFilter, setSelectedGameFilter] = useState<'ALL' | 'FF' | 'MLBB'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract team counts
  const ffTeamsCount = registeredTeams.filter(t => t.game === 'Free Fire' || t.game === 'FF').length;
  const mlbbTeamsCount = registeredTeams.filter(t => t.game === 'Mobile Legends' || t.game === 'MLBB').length;

  const ffMaxSlots = siteConfig.prizePoolConfig?.totalSlots || 32;
  const mlbbMaxSlots = siteConfig.prizePoolConfig?.totalSlots || 32;

  // Build tournament list
  const tournaments = [
    {
      id: 'tourney-ff',
      game: 'FF' as const,
      gameTitle: 'Free Fire Battle Royale',
      tournamentTitle: siteConfig.ffInfo?.title || 'FREE FIRE NATIONAL TOURNAMENT S12',
      stage: siteConfig.ffInfo?.tournamentStage || 'Pendaftaran Terbuka',
      status: 'OPEN' as const,
      statusLabel: '🟢 Pendaftaran Dibuka',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      bannerImage: siteConfig.ffInfo?.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      dates: siteConfig.ffInfo?.matchDates || '5 - 8 September 2026',
      time: siteConfig.ffInfo?.matchTime || '19:00 WIB - Selesai',
      entryFee: siteConfig.paymentMethods?.feeFf || siteConfig.prizePoolConfig?.feePerSlot || 50000,
      totalPrize: siteConfig.ffInfo?.totalPrize || 'Rp 1.440.000',
      prize1st: siteConfig.ffInfo?.prize1st || 'Rp 720.000 + E-Sertifikat',
      prize2nd: siteConfig.ffInfo?.prize2nd || 'Rp 432.000 + E-Sertifikat',
      prize3rd: siteConfig.ffInfo?.prize3rd || 'Rp 288.000 + E-Sertifikat',
      prizeMvp: siteConfig.ffInfo?.prizeMvp || 'Rp 100.000 (MVP Final)',
      formatRules: siteConfig.ffInfo?.formatRules || 'Custom Room Squad 4-Man • Battle Royale 4 Map (Bermuda, Purgatory, Kalahari, Alpine) • Gun Property OFF • No Flare / Airdrop Abuse',
      slotsFilled: ffTeamsCount,
      slotsTotal: ffMaxSlots,
      themeColor: 'from-orange-600 via-red-600 to-amber-600',
      accentBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400'
    },
    {
      id: 'tourney-mlbb',
      game: 'MLBB' as const,
      gameTitle: 'Mobile Legends: Bang Bang',
      tournamentTitle: siteConfig.mlbbInfo?.title || 'MOBILE LEGENDS CHAMPIONSHIP S8',
      stage: siteConfig.mlbbInfo?.tournamentStage || 'Pendaftaran Terbuka',
      status: 'OPEN' as const,
      statusLabel: '🟢 Pendaftaran Dibuka',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      bannerImage: siteConfig.mlbbInfo?.bannerImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      dates: siteConfig.mlbbInfo?.matchDates || '6 - 9 September 2026',
      time: siteConfig.mlbbInfo?.matchTime || '19:30 WIB - Selesai',
      entryFee: siteConfig.paymentMethods?.feeMlbb || siteConfig.prizePoolConfig?.feePerSlot || 50000,
      totalPrize: siteConfig.mlbbInfo?.totalPrize || 'Rp 1.440.000',
      prize1st: siteConfig.mlbbInfo?.prize1st || 'Rp 720.000 + E-Sertifikat',
      prize2nd: siteConfig.mlbbInfo?.prize2nd || 'Rp 432.000 + E-Sertifikat',
      prize3rd: siteConfig.mlbbInfo?.prize3rd || 'Rp 288.000 + E-Sertifikat',
      prizeMvp: siteConfig.mlbbInfo?.prizeMvp || 'Rp 100.000 (MVP Final)',
      formatRules: siteConfig.mlbbInfo?.formatRules || 'Custom Draft Pick 5v5 • Single Elimination BO3 • Grand Final BO5 • All Hero Open • Skin ON / Chat All OFF',
      slotsFilled: mlbbTeamsCount,
      slotsTotal: mlbbMaxSlots,
      themeColor: 'from-blue-600 via-indigo-600 to-cyan-600',
      accentBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    },
    {
      id: 'tourney-upcoming-ff',
      game: 'FF' as const,
      gameTitle: 'Free Fire Season 13 (Akan Datang)',
      tournamentTitle: 'FREE FIRE NATIONAL MASTER SERIES S13',
      stage: 'Akan Datang / Early Pre-Order',
      status: 'UPCOMING' as const,
      statusLabel: '🟡 Akan Datang',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      dates: '20 - 24 Oktober 2026',
      time: '19:00 WIB',
      entryFee: 50000,
      totalPrize: 'Rp 2.000.000',
      prize1st: 'Rp 1.000.000 + Trophy E-Sertifikat',
      prize2nd: 'Rp 600.000 + E-Sertifikat',
      prize3rd: 'Rp 400.000 + E-Sertifikat',
      prizeMvp: 'Rp 150.000',
      formatRules: 'Battle Royale Squad 4-Man • 48 Tim Multi-Group Stage • 6 Match Final',
      slotsFilled: 0,
      slotsTotal: 48,
      themeColor: 'from-amber-600 via-yellow-600 to-orange-700',
      accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'tourney-upcoming-mlbb',
      game: 'MLBB' as const,
      gameTitle: 'MLBB Pro League Community S9 (Akan Datang)',
      tournamentTitle: 'MLBB PRO LEAGUE COMMUNITY INVITATIONAL S9',
      stage: 'Akan Datang / Early Pre-Order',
      status: 'UPCOMING' as const,
      statusLabel: '🟡 Akan Datang',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      dates: '1 - 5 November 2026',
      time: '20:00 WIB',
      entryFee: 75000,
      totalPrize: 'Rp 3.000.000',
      prize1st: 'Rp 1.500.000 + Trophy E-Sertifikat',
      prize2nd: 'Rp 900.000 + E-Sertifikat',
      prize3rd: 'Rp 600.000 + E-Sertifikat',
      prizeMvp: 'Rp 250.000',
      formatRules: 'Custom Draft Pick 5v5 • Double Elimination Upper/Lower Bracket • BO3/BO5 Final',
      slotsFilled: 0,
      slotsTotal: 32,
      themeColor: 'from-purple-600 via-indigo-600 to-blue-700',
      accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
    }
  ];

  // Filtering
  const filteredTournaments = tournaments.filter(t => {
    // Game filter
    if (selectedGameFilter !== 'ALL' && t.game !== selectedGameFilter) return false;

    // Status filter
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

    // Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.tournamentTitle.toLowerCase().includes(q) ||
        t.gameTitle.toLowerCase().includes(q) ||
        t.stage.toLowerCase().includes(q) ||
        t.formatRules.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0518] to-purple-950/80 border border-purple-900/60 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>DAFTAR LENGKAP TURNAMEN RESMI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
              TURNAMEN FREE FIRE &amp; MOBILE LEGENDS
            </h1>
            <p className="text-sm text-neutral-300">
              Pilih turnamen favorit tim Anda, cek rincian hadiah, sisa kuota slot, jadwal pertandingan, dan daftar secara langsung dengan konfirmasi kilat.
            </p>
          </div>

          {/* QUICK STATS CARDS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            <div className="p-3 bg-neutral-900/80 border border-purple-800/40 rounded-2xl text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Total Turnamen</p>
              <p className="text-lg font-black text-amber-400">{tournaments.length}</p>
            </div>
            <div className="p-3 bg-neutral-900/80 border border-purple-800/40 rounded-2xl text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Slot Terisi</p>
              <p className="text-lg font-black text-emerald-400">{ffTeamsCount + mlbbTeamsCount}</p>
            </div>
            <div className="p-3 bg-neutral-900/80 border border-purple-800/40 rounded-2xl text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Hadiah Aktif</p>
              <p className="text-lg font-black text-white">Rp 2.88 Jt</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#0c0c14] border border-neutral-800 p-4 rounded-2xl space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* GAME TABS */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 rounded-xl border border-neutral-800 overflow-x-auto">
            <button
              onClick={() => setSelectedGameFilter('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedGameFilter === 'ALL'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Semua Game</span>
            </button>

            <button
              onClick={() => setSelectedGameFilter('FF')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedGameFilter === 'FF'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-orange-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Free Fire ({ffTeamsCount}/{ffMaxSlots})</span>
            </button>

            <button
              onClick={() => setSelectedGameFilter('MLBB')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedGameFilter === 'MLBB'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-blue-400'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Mobile Legends ({mlbbTeamsCount}/{mlbbMaxSlots})</span>
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari turnamen / format aturan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors shrink-0 cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Semua Status
          </button>

          <button
            onClick={() => setStatusFilter('OPEN')}
            className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
              statusFilter === 'OPEN'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-neutral-900 text-emerald-400 hover:bg-neutral-800 border border-emerald-500/30'
            }`}
          >
            🟢 Pendaftaran Dibuka
          </button>

          <button
            onClick={() => setStatusFilter('UPCOMING')}
            className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
              statusFilter === 'UPCOMING'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-neutral-900 text-amber-400 hover:bg-neutral-800 border border-amber-500/30'
            }`}
          >
            🟡 Akan Datang
          </button>

          <button
            onClick={() => setStatusFilter('CLOSED')}
            className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors shrink-0 cursor-pointer flex items-center gap-1 ${
              statusFilter === 'CLOSED'
                ? 'bg-red-500 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            🔴 Tutup / Selesai
          </button>
        </div>
      </div>

      {/* TOURNAMENT CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tourney) => {
          const slotPercentage = Math.min(100, Math.round((tourney.slotsFilled / tourney.slotsTotal) * 100));
          const remainingSlots = Math.max(0, tourney.slotsTotal - tourney.slotsFilled);

          return (
            <div
              key={tourney.id}
              className="bg-[#0b0b12] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl hover:border-neutral-700 transition-all duration-300 flex flex-col group"
            >
              {/* CARD BANNER & HEADER */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img 
                  src={tourney.bannerImage} 
                  alt={tourney.tournamentTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/60 to-transparent" />

                {/* TOP TAGS */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <div className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg border ${
                    tourney.game === 'FF' 
                      ? 'bg-orange-600/90 text-white border-orange-400/50' 
                      : 'bg-blue-600/90 text-white border-blue-400/50'
                  }`}>
                    {tourney.game === 'FF' ? '🔥 FREE FIRE' : '⚔️ MOBILE LEGENDS'}
                  </div>

                  <div className={`px-3 py-1 rounded-xl text-xs font-black backdrop-blur-md border ${tourney.statusColor}`}>
                    {tourney.statusLabel}
                  </div>
                </div>

                {/* BOTTOM TITLE ON BANNER */}
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{tourney.gameTitle}</p>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {tourney.tournamentTitle}
                  </h3>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
                {/* METRICS ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Biaya Daftar</p>
                    <p className="text-xs font-black text-amber-400 truncate">{formatRupiah(tourney.entryFee)}</p>
                  </div>

                  <div className="p-2.5 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Total Hadiah</p>
                    <p className="text-xs font-black text-emerald-400 truncate">{tourney.totalPrize}</p>
                  </div>

                  <div className="p-2.5 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Jadwal Tanding</p>
                    <p className="text-xs font-black text-white truncate">{tourney.dates}</p>
                  </div>

                  <div className="p-2.5 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Jam Main</p>
                    <p className="text-xs font-black text-purple-300 truncate">{tourney.time}</p>
                  </div>
                </div>

                {/* SLOT CAPACITY PROGRESS */}
                <div className="space-y-1.5 p-3 bg-neutral-900/50 rounded-2xl border border-neutral-800/80">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Kuota Slot Tim:
                    </span>
                    <span className="text-white font-extrabold">
                      {tourney.slotsFilled} / {tourney.slotsTotal} Tim 
                      {remainingSlots > 0 ? (
                        <span className="text-amber-400 ml-1.5">(Sisa {remainingSlots} Slot)</span>
                      ) : (
                        <span className="text-red-400 ml-1.5">(KUOTA PENUH)</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-neutral-700">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        tourney.game === 'FF' ? 'from-orange-500 to-red-500' : 'from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${Math.max(8, slotPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* PRIZE BREAKDOWN ACCORDION/LIST */}
                <div className="p-3.5 bg-gradient-to-r from-neutral-900/80 to-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                  <p className="text-[11px] font-black text-amber-400 uppercase flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    RINCIAN HADIAH JUARA:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="text-[9px] text-amber-400 font-extrabold">🥇 JUARA 1</p>
                      <p className="font-black text-white text-[11px] truncate">{tourney.prize1st}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-500/10 border border-slate-500/30">
                      <p className="text-[9px] text-slate-300 font-extrabold">🥈 JUARA 2</p>
                      <p className="font-black text-white text-[11px] truncate">{tourney.prize2nd}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
                      <p className="text-[9px] text-orange-400 font-extrabold">🥉 JUARA 3</p>
                      <p className="font-black text-white text-[11px] truncate">{tourney.prize3rd}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                      <p className="text-[9px] text-purple-300 font-extrabold">⭐ MVP FINAL</p>
                      <p className="font-black text-white text-[11px] truncate">{tourney.prizeMvp}</p>
                    </div>
                  </div>
                </div>

                {/* RULES & FORMAT SUMMARY */}
                <div className="text-[11px] text-neutral-300 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/80 leading-relaxed">
                  <p className="font-bold text-neutral-400 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Format Pertandingan:
                  </p>
                  {tourney.formatRules}
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  {tourney.status === 'OPEN' ? (
                    <button
                      onClick={() => onOpenRegisterModal(tourney.game)}
                      className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-xs text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-r ${tourney.themeColor}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>DAFTAR {tourney.game} SEKARANG</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (onSelectInfoMatchSubTab) {
                          onSelectInfoMatchSubTab('mendatang');
                        }
                        setActiveTab('info-match');
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>DAFTAR AWAL (WAITING LIST)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (onSelectInfoMatchSubTab) {
                        onSelectInfoMatchSubTab('jadwal');
                      }
                      setActiveTab('info-match');
                    }}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Cek Jadwal &amp; Bagan</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-black text-white">Tidak Ada Turnamen Yang Sesuai Filter</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Coba ubah opsi pilihan game atau reset pencarian untuk menampilkan seluruh turnamen yang tersedia.
          </p>
          <button
            onClick={() => {
              setSelectedGameFilter('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold rounded-xl border border-neutral-700"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
