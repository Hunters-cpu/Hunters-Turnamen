import React, { useState } from 'react';
import { MessageSquareCode, Flame, Swords, Users, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { COMMUNITY_GROUPS, ADMIN_WA } from '../../data/initialData';
import { CommunityGroup } from '../../types';

interface GrupKomunitasViewProps {
  communityGroups?: CommunityGroup[];
}

export const GrupKomunitasView: React.FC<GrupKomunitasViewProps> = ({
  communityGroups = COMMUNITY_GROUPS
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* HEADER */}
      <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-bold">
          <MessageSquareCode className="w-4 h-4" />
          <span>PORTAL WHATSAPP RESMI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase">
          🔗 GRUP KOMUNITAS WHATSAPP
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Silakan bergabung ke grup WhatsApp resmi sesuai game yang kamu ikuti untuk mendapatkan update Room ID, Password, dan pengumuman jadwal dari Admin DEXZ STORE.
        </p>
      </div>

      {/* THREE SPECIAL GROUPS CARDS WITH DIRECT BUTTONS */}
      <div className="space-y-4">
        {/* GROUP 1: FREE FIRE */}
        <div className="bg-slate-950 border border-red-500/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-red-500/70 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-slate-950 shadow-md">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white uppercase">
                  MASUK GRUP TURNAMEN FF
                </h2>
                <p className="text-xs text-red-400 font-bold">Grup Khusus Kapten & Peserta Free Fire</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-extrabold">
              Resmi FF
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pembagian Room ID & Password kustom, jadwal tanding per group, verifikasi tim, dan koordinasi dengan panitia turnamen Free Fire Hunters Community.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <a
              href={communityGroups[0]?.link || "https://chat.whatsapp.com/LSwfHMPmbbNIOsBUzNYwi4"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>MASUK GRUP TURNAMEN FF</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleCopyLink(communityGroups[0]?.link || 'https://chat.whatsapp.com/LSwfHMPmbbNIOsBUzNYwi4', 'ff-link')}
              className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {copiedId === 'ff-link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'ff-link' ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* GROUP 2: MOBILE LEGENDS */}
        <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-cyan-500/70 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
                <Swords className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white uppercase">
                  MASUK GRUP TURNAMEN MLBB
                </h2>
                <p className="text-xs text-cyan-400 font-bold">Grup Khusus Kapten & Peserta Mobile Legends</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-extrabold">
              Resmi MLBB
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Koordinasi room kustom 5v5 Land of Dawn, pembagian jadwal jam 13.00 WIB, verifikasi akun peserta, dan pengumuman pemenang Mobile Legends.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <a
              href={communityGroups[1]?.link || "https://chat.whatsapp.com/F5gLtMN4lZ3Ki9SPEa7s7k"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>MASUK GRUP TURNAMEN MLBB</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleCopyLink(communityGroups[1]?.link || 'https://chat.whatsapp.com/F5gLtMN4lZ3Ki9SPEa7s7k', 'ml-link')}
              className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {copiedId === 'ml-link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'ml-link' ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* GROUP 3: INFORMASI UMUM */}
        <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-emerald-500/70 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white uppercase">
                  MASUK GRUP INFORMASI UMUM
                </h2>
                <p className="text-xs text-emerald-400 font-bold">Komunitas Hunters Community x DEXZ STORE</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-extrabold">
              Umum & Event
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Wadah diskusi komunitas, mabar santai, info event turnamen mendatang, giveaway diamond/voucher, dan berita terbaru dari DEXZ STORE.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <a
              href={communityGroups[2]?.link || "https://chat.whatsapp.com/Gi1ByCCTtCr9izwzfmQZlV"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>MASUK GRUP INFORMASI UMUM</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleCopyLink(communityGroups[2]?.link || 'https://chat.whatsapp.com/Gi1ByCCTtCr9izwzfmQZlV', 'umum-link')}
              className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {copiedId === 'umum-link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'umum-link' ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
