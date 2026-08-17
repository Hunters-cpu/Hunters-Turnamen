import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Globe, Mail, Phone, MessageSquare, Send, Check, Copy, ShieldCheck, Bot, Sparkles, ArrowRight, User, Trash2, HelpCircle, Zap } from 'lucide-react';
import { ADMIN_WA, ADMIN_WA_CLEAN, OFFICIAL_EMAIL, OFFICIAL_DOMAIN } from '../../data/initialData';
import { TabType } from '../../types';

interface HubungiKamiViewProps {
  adminWa?: string;
  adminWaClean?: string;
  officialEmail?: string;
  officialDomain?: string;
  setActiveTab?: (tab: TabType) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  actionTab?: TabType;
  actionLabel?: string;
}

export const HubungiKamiView: React.FC<HubungiKamiViewProps> = ({
  adminWa = ADMIN_WA,
  adminWaClean = ADMIN_WA_CLEAN,
  officialEmail = OFFICIAL_EMAIL,
  officialDomain = OFFICIAL_DOMAIN,
  setActiveTab
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message in chat history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Halo! Saya AI Customer Service Admin DEXZ STORE. Saya siap menjawab pertanyaan Anda seputar turnamen, pendaftaran, saldo, jadwal, dan aturan HUNTERS COMMUNITY secara otomatis & instan.',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Preset example questions from user prompt
  const presetQuestions = [
    "Dimana saya bisa lihat jadwal?",
    "Bagaimana cara menambah saldo?",
    "Apakah Admin bisa mengubah saldo saya?",
    "Bagaimana cara mendaftar?",
    "Saya belum dapat kode ruang",
    "Apa bedanya Admin dan Member?",
    "Siapa yang mengelola website ini?",
    "Apakah saldo saya aman?"
  ];

  // Comprehensive AI Knowledge Base Engine
  const generateAiAnswer = (queryText: string): { text: string; actionTab?: TabType; actionLabel?: string } => {
    const q = queryText.toLowerCase().trim();

    // 1. Jadwal Pertandingan
    if (q.includes('jadwal') || q.includes('kapan tanding') || q.includes('jam berapa') || q.includes('lihat jadwal') || q.includes('jadwal tim')) {
      return {
        text: 'Silakan buka menu 📋 Jadwal Pertandingan. Di sana tertera semua pertandingan, tanggal, jam, babak, dan tim yang bertanding.',
        actionTab: 'info-match',
        actionLabel: 'Buka Menu 📋 Jadwal Pertandingan'
      };
    }

    // 2. Saldo & Top Up
    if (q.includes('tambah saldo') || q.includes('top up') || q.includes('topup') || q.includes('isi saldo') || q.includes('tambahkan saldo') || q.includes('menambah saldo')) {
      return {
        text: 'Buka menu 💰 Saldo → pilih Top Up → masukkan jumlah → bayar sesuai QRIS yang muncul → saldo akan bertambah otomatis setelah pembayaran terkonfirmasi.',
        actionTab: 'saldo',
        actionLabel: 'Buka Menu 💰 Saldo'
      };
    }

    // 3. Admin Mengubah Saldo
    if ((q.includes('admin') && q.includes('ubah') && q.includes('saldo')) || q.includes('admin bisa mengubah saldo') || q.includes('admin edit saldo') || q.includes('admin ganti saldo')) {
      return {
        text: 'TIDAK BISA. Saldo tersimpan aman di Firebase dan hanya bisa berubah secara otomatis dari pembayaran masuk, taruhan, atau hadiah kemenangan. Admin tidak dapat mengubah saldo secara manual.',
        actionTab: 'saldo',
        actionLabel: 'Cek Status Saldo'
      };
    }

    // 4. Cara Pendaftaran / Daftar
    if (q.includes('mendaftar') || q.includes('cara daftar') || q.includes('pendaftaran') || q.includes('daftar turnamen') || q.includes('ikut turnamen')) {
      return {
        text: 'Buka menu 📋 Pendaftaran → pilih Free Fire atau Mobile Legends → isi data lengkap tim → tekan KIRIM → tunggu status menjadi ✅ SAH → lakukan pembayaran → unggah bukti pembayaran → tunggu konfirmasi selesai.',
        actionTab: 'form-pendaftaran',
        actionLabel: 'Buka Menu 📋 Pendaftaran'
      };
    }

    // 5. Kode Ruang / Room ID
    if (q.includes('kode ruang') || q.includes('kode room') || q.includes('room id') || q.includes('password room') || q.includes('sandi room') || q.includes('belum dapat kode')) {
      return {
        text: 'Kode ruang dikirim ke nomor WhatsApp kapten tim 20 menit sebelum pertandingan dimulai. Pastikan nomor WhatsApp yang terdaftar benar dan sudah masuk grup resmi.',
        actionTab: 'info-match',
        actionLabel: 'Lihat Info Match & Kode'
      };
    }

    // 6. Perbedaan Admin & Member
    if (q.includes('bedanya admin') || q.includes('beda admin') || q.includes('perbedaan admin') || q.includes('hak akses') || q.includes('role')) {
      return {
        text: 'Admin: Mengelola semua data, konfirmasi pendaftaran, ubah jadwal, tetapkan pemenang, kirim pengumuman. Member: Hanya dapat mendaftar, melihat informasi, pasang taruhan, cek saldo — tidak dapat mengubah data apa pun.'
      };
    }

    // 7. Pengelola / Siapa DEXZ STORE
    if (q.includes('mengelola') || q.includes('pemilik') || q.includes('siapa dexz') || q.includes('siapa yang mengelola') || q.includes('penyelenggara')) {
      return {
        text: 'HUNTERS COMMUNITY dikelola oleh DEXZ STORE. Pusat Turnamen Free Fire & Mobile Legends yang resmi, aman, dan terpercaya.'
      };
    }

    // 8. Keamanan Saldo
    if (q.includes('saldo saya aman') || q.includes('keamanan saldo') || q.includes('saldo aman')) {
      return {
        text: 'Ya, saldo Anda tersimpan aman di Firebase. Setiap pengguna memiliki saldo sendiri-sendiri dan tidak dapat diubah oleh siapa pun kecuali sistem pembayaran otomatis.',
        actionTab: 'saldo',
        actionLabel: 'Buka Menu 💰 Saldo'
      };
    }

    // 9. Biaya Pendaftaran / Biaya Slot
    if (q.includes('biaya') || q.includes('harga slot') || q.includes('bayar berapa')) {
      return {
        text: 'Biaya pendaftaran turnamen adalah Rp50.000/Tim untuk game Free Fire maupun Mobile Legends.',
        actionTab: 'form-pendaftaran',
        actionLabel: 'Daftar Sekarang'
      };
    }

    // 10. Ubah Nama Tim / Ubah Pemain / Roster
    if (q.includes('ubah nama') || q.includes('ganti pemain') || q.includes('ubah data') || q.includes('ganti tim') || q.includes('roster')) {
      return {
        text: 'Nama tim TIDAK BISA diubah setelah berstatus ✅ SAH. Namun, data pemain/roster BISA diubah SEBELUM pertandingan dimulai melalui menu 📝 Ubah Data Pendaftaran.',
        actionTab: 'form-pendaftaran',
        actionLabel: 'Buka Menu Pendaftaran / Ubah Data'
      };
    }

    // 11. Penarikan Saldo / Withdraw
    if (q.includes('penarikan') || q.includes('withdraw') || q.includes('tarik dana') || q.includes('pencairan')) {
      return {
        text: 'Buka menu 💰 Saldo → pilih Penarikan → masukkan jumlah nominal & nomor rekening/e-wallet tujuan. Penarikan akan diproses maksimal 1×24 jam.',
        actionTab: 'saldo',
        actionLabel: 'Buka Menu 💰 Saldo'
      };
    }

    // 12. Pasang Taruhan / Prediksi
    if (q.includes('taruhan') || q.includes('prediksi') || q.includes('pasang bet') || q.includes('betting')) {
      return {
        text: 'Pilih pertandingan → pilih tim yang diprediksi menang → masukkan jumlah taruhan melalui menu 🎲 Prediksi & Taruhan. Saldo otomatis tertahan saat taruhan dipasang, dan hadiah langsung masuk ke akun pemenang saat Admin menetapkan hasil match.',
        actionTab: 'prediksi',
        actionLabel: 'Buka Menu 🎲 Prediksi & Taruhan'
      };
    }

    // 13. Keterlambatan / Diskualifikasi
    if (q.includes('terlambat') || q.includes('telat') || q.includes('diskualifikasi')) {
      return {
        text: 'Wajib masuk room/ruang pertandingan 10–15 menit sebelum jam mulai. Keterlambatan lebih dari 5 menit akan berakibat diskualifikasi dan kemenangan otomatis diberikan kepada tim lawan.',
        actionTab: 'aturan',
        actionLabel: 'Baca Aturan Lengkap'
      };
    }

    // 14. Sengketa & Banding
    if (q.includes('sengketa') || q.includes('banding') || q.includes('cheater') || q.includes('kecurangan') || q.includes('bukti')) {
      return {
        text: 'Buka menu ⚖️ Sengketa & Banding → isi nama tim pelapor, lawan, penjelasan sengketa, dan unggah foto/bukti tangkapan layar. Panitia akan meninjau bukti dalam 15–30 menit.',
        actionTab: 'info-match',
        actionLabel: 'Buka Info Match & Sengketa'
      };
    }

    // 15. Grup WA
    if (q.includes('grup') || q.includes('link grup') || q.includes('whatsapp group')) {
      return {
        text: 'Silakan buka menu 🔗 Grup Komunitas. Di sana terdapat tautan ke 3 grup WhatsApp resmi turnamen Hunters Community.',
        actionTab: 'grup',
        actionLabel: 'Buka Menu 🔗 Grup Komunitas'
      };
    }

    // 16. Login / Akses Admin / PIN
    if (q.includes('login') || q.includes('masuk') || q.includes('pin') || q.includes('email admin')) {
      return {
        text: 'Login dilakukan dengan Akun Google. Untuk Member, cukup masuk dengan Google. Untuk Admin, masuk dengan Google menggunakan email mumumimi353@gmail.com dan masukkan PIN 122009 untuk membuka Panel Admin Penuh.'
      };
    }

    // 17. Unduh Aplikasi / APK
    if (q.includes('aplikasi') || q.includes('apk') || q.includes('download') || q.includes('unduh')) {
      return {
        text: 'Buka menu 📱 Unduh Aplikasi. Anda dapat memasang aplikasi langsung ke layar utama HP melalui browser atau mengunduh file APK resmi.',
        actionTab: 'unduh-apk',
        actionLabel: 'Buka Menu 📱 Unduh Aplikasi'
      };
    }

    // 18. Bot WhatsApp Admin
    if (q.includes('bot') || q.includes('.menu panel') || q.includes('perintah wa')) {
      return {
        text: 'Bot WhatsApp Admin terhubung langsung ke Firebase, Website, dan Aplikasi. Admin dapat mengetik perintah seperti `.menu panel`, `.cek daftar`, `.topup 1 sah`, `.kode ruang`, atau `.menang 1 Tim A` langsung dari WhatsApp untuk memperbarui data secara realtime.'
      };
    }

    // 19. Konfirmasi Kehadiran / Tukar Jadwal
    if (q.includes('kehadiran') || q.includes('absen') || q.includes('tukar jadwal') || q.includes('siapa tanding')) {
      return {
        text: 'Buka menu ✅ Konfirmasi Kehadiran. Kapten tim memilih Siap atau Belum Siap. Jika Belum Siap, Anda dapat mengajukan permintaan tukar jadwal dengan tim lain.',
        actionTab: 'info-match',
        actionLabel: 'Buka Menu Info Match & Kehadiran'
      };
    }

    // 20. Sinkronisasi Data / Firebase
    if (q.includes('sinkron') || q.includes('firebase') || q.includes('realtime')) {
      return {
        text: 'Website, Aplikasi HP, dan Firebase tersinkronisasi 100% secara realtime. Perubahan yang dilakukan di satu tempat akan langsung berubah di semua tempat serentak.'
      };
    }

    // Default Fallback strictly matching prompt rule:
    return {
      text: 'Mohon maaf, informasi tersebut belum tersedia. Silakan baca menu yang tersedia atau hubungi Admin lewat halaman Kontak.'
    };
  };

  const handleAskQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: questionText.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserQuery('');
    setIsTyping(true);

    // Instant AI response execution (0ms wait, instant answer on screen!)
    setTimeout(() => {
      const aiResult = generateAiAnswer(questionText);
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiResult.text,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        actionTab: aiResult.actionTab,
        actionLabel: aiResult.actionLabel
      };

      setChatHistory(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 150);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(userQuery);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 border border-emerald-500/40 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>JAWABAN OTOMATIS & INSTAN DETIK ITU JUGA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Bot className="w-8 h-8 text-emerald-400 shrink-0" />
            <span>HUBUNGI CS ADMIN DEXZ STORE</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Silakan tulis pertanyaan Anda di bawah ini, AI akan menjawab secara otomatis berdasarkan seluruh isi, menu, aturan, dan cara kerja website HUNTERS COMMUNITY. Tanpa perlu mengirim pesan ke Admin &amp; tanpa menunggu balasan!
          </p>
        </div>
      </div>

      {/* AI CS INTERACTIVE CHAT CONTAINER */}
      <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* CHAT HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase">AI CS DEXZ STORE</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold uppercase">ONLINE 24/7</span>
              </div>
              <span className="text-[11px] text-slate-400 block">Menjawab pertanyaan secara otomatis &amp; instan</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setChatHistory([
              {
                id: 'welcome-1',
                sender: 'ai',
                text: 'Halo! Saya AI Customer Service Admin DEXZ STORE. Saya siap menjawab pertanyaan Anda seputar turnamen, pendaftaran, saldo, jadwal, dan aturan HUNTERS COMMUNITY secara otomatis & instan.',
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              }
            ])}
            className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-red-500/40 transition-all font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Chat</span>
          </button>
        </div>

        {/* CHAT MESSAGES FEED */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[480px] overflow-y-auto bg-[#0a0f12]/80">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 border-b border-white/10 pb-1">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? 'Pertanyaan Anda' : '🤖 Jawaban AI CS DEXZ STORE'}
                  </span>
                  <span>{msg.time}</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </p>

                {msg.actionTab && setActiveTab && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setActiveTab(msg.actionTab!)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-md uppercase tracking-wider cursor-pointer"
                    >
                      <span>{msg.actionLabel || 'Buka Menu Terkait'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-emerald-400 font-mono bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30 w-fit">
              <Bot className="w-4 h-4 animate-spin" />
              <span>AI sedang menyusun jawaban instan...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK PRESET QUESTION CHIPS */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekomendasi Pertanyaan Sering Diajukan (Klik untuk Tanya):</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskQuestion(q)}
                className="bg-slate-950 hover:bg-emerald-950/80 hover:border-emerald-500/60 border border-slate-800 text-slate-300 hover:text-emerald-300 text-xs px-3 py-1.5 rounded-xl transition-all font-medium text-left cursor-pointer"
              >
                ❓ {q}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT QUESTION FORM */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form onSubmit={handleSubmitForm} className="space-y-3">
            <p className="text-xs text-slate-300 font-bold flex items-center gap-1">
              <span>Silakan tulis pertanyaan Anda di bawah ini, AI akan menjawab secara otomatis:</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Tuliskan pertanyaan Anda seputar turnamen, jadwal, pendaftaran, saldo..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-all placeholder:text-slate-500 font-medium"
              />

              <button
                type="submit"
                disabled={!userQuery.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OFFICIAL HUMAN CONTACT CHANNELS GRID */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Atau Hubungi Admin Resmi Via WhatsApp / Email
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WEBSITE */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Website Resmi</span>
              <strong className="text-sm text-white font-extrabold">{officialDomain}</strong>
            </div>
            <a
              href={`https://${officialDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 font-bold hover:underline block pt-1"
            >
              Kunjungi Website Portal →
            </a>
          </div>

          {/* EMAIL */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-pink-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Email Official</span>
              <strong className="text-xs sm:text-sm text-white font-mono font-bold break-all">{officialEmail}</strong>
            </div>
            <button
              onClick={copyEmail}
              className="text-xs text-pink-400 font-bold hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'Email Tersalin' : 'Salin Email'}</span>
            </button>
          </div>

          {/* WHATSAPP ADMIN */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-lg hover:border-emerald-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">WhatsApp Fast Response</span>
              <strong className="text-sm text-emerald-400 font-extrabold">{adminWa}</strong>
            </div>
            <a
              href={`https://wa.me/${adminWaClean}?text=${encodeURIComponent('Halo Admin DEXZ STORE Hunters Community!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 font-bold hover:underline block pt-1"
            >
              Chat Direct WhatsApp Admin →
            </a>
          </div>
        </div>
      </div>

      {/* ORGANIZER DEXZ STORE BRANDING */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DEXZ STORE</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
          Penyelenggara Resmi • Terpercaya • Siap Melayani
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Mendukung perkembangan e-sports Indonesia dengan menyelenggarakan turnamen Free Fire &amp; Mobile Legends yang adil, terjangkau, adil, transparan, dan profesional.
        </p>
      </div>
    </div>
  );
};
