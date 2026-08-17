import React, { useState } from 'react';
import { Megaphone, Calendar, Tag, BellRing, Info, ShieldAlert, Sparkles, Filter, ChevronRight, Lock } from 'lucide-react';
import { AnnouncementItem, TabType } from '../../types';

interface PengumumanViewProps {
  announcements?: AnnouncementItem[];
  setActiveTab: (tab: TabType) => void;
  isAdmin?: boolean;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  announcements = [],
  setActiveTab,
  isAdmin = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Info Penting', 'Perubahan Jadwal', 'Pengingat Match', 'Umum'];

  const filtered = announcements.filter(item => {
    if (selectedCategory === 'Semua') return true;
    if (selectedCategory === 'Pengingat Match') {
      return item.category === 'Pengingat Match' || item.category === 'Pengingat' || item.category === 'pengingat';
    }
    if (selectedCategory === 'Info Penting') {
      return item.category === 'Info Penting' || item.category === 'info';
    }
    if (selectedCategory === 'Perubahan Jadwal') {
      return item.category === 'Perubahan Jadwal' || item.category === 'jadwal';
    }
    return item.category === selectedCategory;
  });

  const getCategoryBadge = (category: string) => {
    if (category === 'Info Penting' || category === 'info') return 'bg-red-500/20 text-red-400 border-red-500/40';
    if (category === 'Perubahan Jadwal' || category === 'jadwal') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (category === 'Pengingat Match' || category === 'Pengingat' || category === 'pengingat') return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    return 'bg-neutral-800 text-neutral-300 border-neutral-700';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 p-6 sm:p-8 border border-red-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span className="uppercase tracking-wider">PAPAN PENGUMUMAN RESMI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-amber-400 shrink-0" />
            <span>📢 PENGUMUMAN & INFORMASI PENTING</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Update berita terkini, instruksi khusus room ID, perubahan jadwal, dan pengingat turnamen resmi DEXZ STORE & Hunters Community.
          </p>
        </div>
      </div>

      {/* FILTER CATEGORY */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0a0a0a] p-2 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-400">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Kategori:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md scale-105'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#0a0a0a] border border-neutral-800 rounded-2xl text-neutral-400 space-y-2">
            <Info className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm font-bold">Belum ada pengumuman dalam kategori ini.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f0f0f] border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-3 transition-all shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {item.date}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-[10px] text-amber-400 font-bold hover:underline flex items-center gap-1 w-fit"
                  >
                    <span>Edit di Admin</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h3 className="text-base font-black text-white leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ADMIN CONTROL LINK FOOTER */}
      {isAdmin && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300">
          <span className="font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mode Admin Aktif: Anda dapat menambah/mengedit pengumuman di Dashboard Admin.</span>
          </span>
          <button
            onClick={() => setActiveTab('admin')}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider text-[11px]"
          >
            Kelola Pengumuman
          </button>
        </div>
      )}
    </div>
  );
};
