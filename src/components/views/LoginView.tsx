import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  LogIn, 
  Lock, 
  Mail, 
  User, 
  Info, 
  LogOut, 
  Sparkles,
  Settings,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Globe
} from 'lucide-react';
import { TabType, UserAccount, SiteConfig } from '../../types';

interface LoginViewProps {
  currentUser: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  setActiveTab: (tab: TabType) => void;
  siteConfig?: SiteConfig;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  setActiveTab,
  siteConfig
}) => {
  const [selectedRoleMode, setSelectedRoleMode] = useState<'admin' | 'anggota'>('anggota');

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Anggota form state
  const [pesertaName, setPesertaName] = useState('');
  const [pesertaEmail, setPesertaEmail] = useState('');
  const [pesertaPhone, setPesertaPhone] = useState('');
  const [pesertaPassword, setPesertaPassword] = useState('');
  const [pesertaError, setPesertaError] = useState<string | null>(null);
  const [pesertaSuccess, setPesertaSuccess] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Modal / Sub-views for Password Reset & Change Password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [sentCode, setSentCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  // Change password state
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState<string | null>(null);
  const [changePassError, setChangePassError] = useState<string | null>(null);

  // Admin login handler
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const inputEmail = adminEmail.trim().toLowerCase();

    if (inputEmail === 'mumumimi353@gmail.com') {
      if (adminPassword !== 'Kampoeng51') {
        setAdminError('Email atau kata sandi salah');
        return;
      }

      const adminAccount: UserAccount = {
        name: 'Admin Utama DEXZ STORE',
        email: 'mumumimi353@gmail.com',
        role: 'admin',
        isSuperAdmin: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        googleId: 'admin_official_dexz',
        registeredAt: new Date().toISOString()
      };

      onLogin(adminAccount);
      localStorage.setItem('hunters_community_user', JSON.stringify(adminAccount));
      setActiveTab('admin');
      return;
    }

    // Check registered custom admins
    const customAdmins = siteConfig?.adminAccounts || [];
    const matchedAdmin = customAdmins.find(a => a.email.trim().toLowerCase() === inputEmail);

    if (matchedAdmin && matchedAdmin.password === adminPassword) {
      const adminAccount: UserAccount = {
        name: matchedAdmin.name || 'Admin DEXZ STORE',
        email: matchedAdmin.email,
        role: 'admin',
        isSuperAdmin: Boolean(matchedAdmin.isSuperAdmin),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        googleId: matchedAdmin.id,
        registeredAt: new Date().toISOString()
      };

      onLogin(adminAccount);
      localStorage.setItem('hunters_community_user', JSON.stringify(adminAccount));
      setActiveTab('admin');
      return;
    }

    setAdminError('Email atau kata sandi salah');
  };

  // Google Login Simulation
  const handleGoogleSignIn = (googleUserEmail: string, googleUserName: string) => {
    setShowGoogleModal(false);
    setPesertaError(null);

    const emailClean = googleUserEmail.trim().toLowerCase();
    const existingMembers = siteConfig?.memberAccounts || [];
    const existing = existingMembers.find(m => m.email.toLowerCase() === emailClean);

    if (existing) {
      onLogin(existing);
      localStorage.setItem('hunters_community_user', JSON.stringify(existing));
      setPesertaSuccess(`Selamat datang kembali ${existing.name}! Berhasil masuk sebagai Anggota.`);
    } else {
      const newMember: UserAccount = {
        id: `member-${Date.now()}`,
        name: googleUserName,
        email: emailClean,
        role: 'peserta',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        googleId: 'google_' + Math.random().toString(36).substring(2, 9),
        registeredAt: new Date().toISOString()
      };

      onLogin(newMember);
      localStorage.setItem('hunters_community_user', JSON.stringify(newMember));
      setPesertaSuccess(`Akun baru terbuat secara otomatis untuk ${googleUserName}! Saldo awal Rp0.`);
    }

    setTimeout(() => {
      setActiveTab('beranda');
    }, 1200);
  };

  // Member login / signup
  const handlePesertaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setPesertaError('Akun dikunci sementara karena 5 kali salah kata sandi. Gunakan Lupa Kata Sandi untuk membuka.');
      return;
    }

    if (!pesertaEmail || !pesertaPassword) {
      setPesertaError('Silakan isi email dan kata sandi.');
      return;
    }

    const emailClean = pesertaEmail.trim().toLowerCase();

    if (pesertaPassword.length < 4) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= 5) {
        setIsLocked(true);
        setPesertaError('Terlalu banyak percobaan (5x salah). Akun terkunci sementara! Silakan reset kata sandi.');
      } else {
        setPesertaError(`Kata sandi salah! Percobaan ${attempts}/5.`);
      }
      return;
    }

    const displayName = pesertaName.trim() || emailClean.split('@')[0] || 'Anggota Hunters';

    const memberAccount: UserAccount = {
      id: `member-${Date.now()}`,
      name: displayName,
      email: emailClean,
      phone: pesertaPhone.trim() || undefined,
      role: 'peserta',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      googleId: 'member_' + Math.random().toString(36).substring(2, 9),
      registeredAt: new Date().toISOString()
    };

    onLogin(memberAccount);
    localStorage.setItem('hunters_community_user', JSON.stringify(memberAccount));
    setPesertaSuccess(`Selamat datang ${displayName}! Berhasil masuk sebagai Anggota (Saldo awal Rp0).`);
    setTimeout(() => {
      setActiveTab('beranda');
    }, 1200);
  };

  // Send reset code
  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg(null);
    if (!resetEmail.trim()) {
      setResetErrorMsg('Masukkan email terdaftar Anda.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setResetStep(2);
    setResetSuccessMsg(`Kode verifikasi 6-digit telah dikirim ke email ${resetEmail.trim()} (Kode Demo: ${code})`);
  };

  // Verify code & reset pass
  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg(null);

    if (inputCode !== sentCode) {
      setResetErrorMsg('Kode verifikasi salah! Silakan periksa kembali.');
      return;
    }

    if (!newPass || newPass.length < 5) {
      setResetErrorMsg('Kata sandi baru minimal 5 karakter.');
      return;
    }

    setResetSuccessMsg('Kata sandi berhasil diperbarui! Silakan masuk kembali.');
    setIsLocked(false);
    setLoginAttempts(0);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetStep(1);
    }, 1500);
  };

  // Change password for logged in user
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError(null);
    setChangePassSuccess(null);

    if (!oldPasswordInput) {
      setChangePassError('Masukkan kata sandi lama Anda.');
      return;
    }

    if (newPasswordInput.length < 5) {
      setChangePassError('Kata sandi baru minimal 5 karakter.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePassError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setChangePassSuccess('Kata sandi berhasil diubah!');
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => {
      setShowChangePassword(false);
    }, 1500);
  };

  const handleLogoutConfirm = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      onLogout();
      localStorage.removeItem('hunters_community_user');
      setActiveTab('login');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-[#0f0f0f] border border-orange-500/30 rounded-2xl p-6 sm:p-8 space-y-3 text-center sm:text-left relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4 text-orange-400" />
          <span>🔐 HALAMAN MASUK / DAFTAR AKUN</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          HUNTERS COMMUNITY
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
          Pilihan Akses Resmi: Masuk sebagai Admin atau Masuk / Daftar sebagai Anggota dengan Google.
        </p>
      </div>

      {/* LOGGED IN USER CARD */}
      {currentUser ? (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                alt="Avatar" 
                className="w-14 h-14 rounded-full border-2 border-orange-500 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-lg">{currentUser.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    currentUser.role === 'admin' ? 'bg-orange-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {currentUser.role === 'admin' ? 'ADMIN DEXZ STORE' : 'PESERTA / ANGGOTA'}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogoutConfirm}
              className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 font-black text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>KELUAR AKUN</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider shadow-lg"
              >
                <Settings className="w-4 h-4" />
                <span>Buka Panel Admin</span>
              </button>
            )}

            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-neutral-700"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>📝 Ubah Kata Sandi</span>
            </button>
          </div>
        </div>
      ) : (
        /* LOGIN ROLE MODE SELECTION TABS */
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#0f0f0f] border border-neutral-800 rounded-2xl">
            <button
              onClick={() => setSelectedRoleMode('admin')}
              className={`p-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                selectedRoleMode === 'admin'
                  ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-950/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>🔐 MASUK SEBAGAI ADMIN</span>
            </button>

            <button
              onClick={() => setSelectedRoleMode('anggota')}
              className={`p-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                selectedRoleMode === 'anggota'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>👤 MASUK SEBAGAI ANGGOTA</span>
            </button>
          </div>

          {/* ADMIN FORM */}
          {selectedRoleMode === 'admin' && (
            <div className="bg-[#0f0f0f] border border-orange-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  <span>🔐 FORM LOGIN ADMIN</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Gunakan email resmi: <code className="text-orange-400 font-mono">mumumimi353@gmail.com</code>
                </p>
              </div>

              {adminError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Email Admin:</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="mumumimi353@gmail.com"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-orange-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Kata Sandi Admin:</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-orange-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-lg shadow-orange-950/50 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>MASUK SEBAGAI ADMIN</span>
                </button>
              </form>
            </div>
          )}

          {/* ANGGOTA FORM */}
          {selectedRoleMode === 'anggota' && (
            <div className="bg-[#0f0f0f] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span>👤 LOGIN / DAFTAR ANGGOTA</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Setiap pendaftar baru otomatis mendapatkan saldo awal Rp0.
                </p>
              </div>

              {pesertaError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pesertaError}</span>
                </div>
              )}

              {pesertaSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pesertaSuccess}</span>
                </div>
              )}

              {/* GOOGLE SIGN IN BUTTON */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-3.5 bg-white hover:bg-neutral-100 text-slate-900 font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>🌐 MASUK DENGAN GOOGLE</span>
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="h-px bg-neutral-800 flex-1"></div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">ATAU MASUK DENGAN EMAIL</span>
                  <div className="h-px bg-neutral-800 flex-1"></div>
                </div>
              </div>

              {/* MANUAL EMAIL FORM */}
              <form onSubmit={handlePesertaSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Nama Lengkap / Nickname:</label>
                  <input
                    type="text"
                    value={pesertaName}
                    onChange={(e) => setPesertaName(e.target.value)}
                    placeholder="Contoh: Hunters Pro"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-emerald-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Alamat Email:</label>
                  <input
                    type="email"
                    required
                    value={pesertaEmail}
                    onChange={(e) => setPesertaEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-emerald-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Nomor WhatsApp (Opsional):</label>
                  <input
                    type="tel"
                    value={pesertaPhone}
                    onChange={(e) => setPesertaPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-emerald-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300 uppercase block">Kata Sandi:</label>
                  <input
                    type="password"
                    required
                    value={pesertaPassword}
                    onChange={(e) => setPesertaPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-emerald-500 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    🔑 Lupa Kata Sandi?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLocked}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>MASUK / DAFTAR ANGGOTA</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* GOOGLE MODAL SIMULATION */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>PILIH AKUN GOOGLE</span>
              </h3>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-neutral-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Pilih akun Google Anda untuk masuk atau mendaftar di Hunters Community:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleSignIn('mumumimi353@gmail.com', 'Mumu Mimi')}
                className="w-full p-3 bg-[#181818] hover:bg-neutral-800 border border-neutral-700 rounded-xl text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-orange-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  MM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Mumu Mimi</p>
                  <p className="text-[11px] text-neutral-400 font-mono">mumumimi353@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => handleGoogleSignIn('member.hunters@gmail.com', 'Member Hunters Official')}
                className="w-full p-3 bg-[#181818] hover:bg-neutral-800 border border-neutral-700 rounded-xl text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  MH
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Member Hunters Official</p>
                  <p className="text-[11px] text-neutral-400 font-mono">member.hunters@gmail.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-black text-amber-400 text-base flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                <span>🔑 LUPA KATA SANDI</span>
              </h3>
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="text-neutral-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {resetErrorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold">
                {resetErrorMsg}
              </div>
            )}

            {resetSuccessMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                {resetSuccessMsg}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <p className="text-xs text-neutral-300">
                  Masukkan email terdaftar Anda. Sistem akan mengirimkan Kode Verifikasi 6-digit.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">Alamat Email:</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full bg-[#181818] border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider"
                >
                  Kirim Kode Verifikasi
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyResetCode} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">Masukkan Kode Verifikasi 6-Digit:</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#181818] border border-neutral-700 text-amber-400 font-mono text-center text-lg font-black tracking-widest rounded-xl p-2.5 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 block">Kata Sandi Baru:</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl uppercase tracking-wider"
                >
                  Perbarui Kata Sandi
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>📝 UBAH KATA SANDI</span>
              </h3>
              <button 
                onClick={() => setShowChangePassword(false)}
                className="text-neutral-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {changePassError && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold">
                {changePassError}
              </div>
            )}

            {changePassSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                {changePassSuccess}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">Kata Sandi Lama:</label>
                <input
                  type="password"
                  required
                  value={oldPasswordInput}
                  onChange={(e) => setOldPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181818] border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">Kata Sandi Baru:</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181818] border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 block">Konfirmasi Kata Sandi Baru:</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181818] border border-neutral-700 text-white rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl uppercase tracking-wider"
              >
                Simpan Kata Sandi Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
