import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  User, 
  Sliders, 
  AlertTriangle, 
  Copy, 
  Check, 
  Mail, 
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AuthUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onDirectLogin: (user: AuthUser, isAdminRole?: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onDirectLogin,
}) => {
  const [emailInput, setEmailInput] = useState('peter.lee108@gmail.com');
  const [nameInput, setNameInput] = useState('이성훈 대표');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<{
    code?: string;
    message: string;
    domain?: string;
  } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  const handleGoogleSubmit = async () => {
    setIsLoadingGoogle(true);
    setAuthError(null);
    try {
      await onGoogleLogin();
      onClose();
    } catch (err: unknown) {
      console.error('Google login error in modal:', err);
      const errObj = err as { code?: string; message?: string };
      const code = errObj.code || '';
      let message = 'Google 로그인 팝업을 열 수 없습니다.';

      if (code === 'auth/unauthorized-domain' || (errObj.message && errObj.message.includes('unauthorized-domain'))) {
        message = `현재 배포 도메인(${currentHostname})이 Firebase의 승인된 도메인(Authorized Domains)에 등록되지 않아 팝업이 차단되었습니다.`;
      } else if (code === 'auth/popup-blocked' || (errObj.message && errObj.message.includes('popup-blocked'))) {
        message = '브라우저 보안 설정에 의해 팝업 창이 차단되었습니다. 팝업 허용 후 다시 시도하거나 간편 이메일 로그인을 이용하세요.';
      } else if (code === 'auth/popup-closed-by-user') {
        message = '사용자가 로그인 팝업 창을 닫았습니다.';
      } else if (errObj.message) {
        message = errObj.message;
      }

      setAuthError({
        code,
        message,
        domain: currentHostname
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleCustomEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const isAdmin = emailInput.trim().toLowerCase() === 'peter.lee108@gmail.com';
    const userObj: AuthUser = {
      uid: `user-${Date.now()}`,
      email: emailInput.trim(),
      displayName: nameInput.trim() || emailInput.split('@')[0],
      photoURL: null
    };

    onDirectLogin(userObj, isAdmin);
    onClose();
  };

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      onDirectLogin({
        uid: 'cust-peter',
        email: 'peter.lee108@gmail.com',
        displayName: '이성훈 대표 (관리자)',
        photoURL: null
      }, true);
    } else {
      onDirectLogin({
        uid: 'user-sample-02',
        email: 'finance.admin@nexuskr.com',
        displayName: '김수연 이사 (기업 고객)',
        photoURL: null
      }, false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">IT 플랫폼 로그인</h2>
              <p className="text-xs text-slate-400">Enterprise IT Support Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Error Banner if Google Auth failed */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-white text-[11px]">배포 환경 Google 로그인 안내</div>
                  <div className="text-[11px] text-amber-300 leading-relaxed">
                    {authError.message}
                  </div>
                </div>
              </div>

              {authError.domain && (
                <div className="p-2 rounded bg-slate-950/80 border border-amber-900/50 flex items-center justify-between gap-2 text-[10px]">
                  <span className="font-mono text-slate-300 truncate">도메인: {authError.domain}</span>
                  <button
                    onClick={handleCopyHostname}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold shrink-0 cursor-pointer"
                  >
                    {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDomain ? '복사됨' : '도메인 복사'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => handleQuickDemo('admin')}
                className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>peter.lee108@gmail.com 계정으로 즉시 로그인</span>
              </button>
            </div>
          )}

          {/* 1. Primary Google Auth Button */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSubmit}
              disabled={isLoadingGoogle}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 transition-all shadow-md shadow-white/5 cursor-pointer disabled:opacity-70"
            >
              {isLoadingGoogle ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span>Google 계정으로 공식 로그인</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              Google Workspace 계정 및 일반 구글 계정으로 연동됩니다.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium shrink-0">또는 간편 로그인</span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* 2. Direct Email Login Form */}
          <form onSubmit={handleCustomEmailLogin} className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>이메일 주소</span>
                <span className="text-slate-500 font-normal">비밀번호 불필요</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="peter.lee108@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">
                사용자 / 담당자명
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="이성훈 대표"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>이메일로 즉시 로그인</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* 3. Quick Role Selection */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              빠른 1-Click 역할 체험
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-950/60 border border-purple-800/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>최고 관리자</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Admin</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  peter.lee108@gmail.com
                </div>
                <div className="text-[10px] text-purple-400 font-medium mt-1">
                  전체 CRM 관제 & 엔지니어 배정
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-3 rounded-xl bg-blue-950/30 hover:bg-blue-950/60 border border-blue-800/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>기업 고객</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Client</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  finance.admin@nexuskr.com
                </div>
                <div className="text-[10px] text-blue-400 font-medium mt-1">
                  마이페이지 & 결제 영수증 조회
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>인증 보안: 256-bit SSL 암호화</span>
          <span className="font-mono text-slate-400">v2.4 Live</span>
        </div>

      </div>
    </div>
  );
};
