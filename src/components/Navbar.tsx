import React from 'react';
import { 
  Server, 
  ShieldCheck, 
  Calendar, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  Bell, 
  Sliders, 
  Layers, 
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  Mail
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AuthUser } from '../types';

interface NavbarProps {
  user: User | AuthUser | null;
  isAdmin: boolean;
  unreadCount: number;
  onOpenBooking: () => void;
  onOpenMyPage: () => void;
  onOpenAdmin: () => void;
  onOpenSystemArch: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onDemoLogin: (role: 'customer' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAdmin,
  unreadCount,
  onOpenBooking,
  onOpenMyPage,
  onOpenAdmin,
  onOpenSystemArch,
  onLogin,
  onLogout,
  onDemoLogin,
}) => {
  const [showDemoDropdown, setShowDemoDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs text-slate-300 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">ON-Site Support</span>
            <span className="hidden sm:inline text-slate-400">| 서울· 수도권 긴급 2시간 이내 현장 출동 가능</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <a href="tel:010-2117-7931" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-blue-400" />
              <span>24/7 비상출동: <strong className="text-white font-semibold">010-2117-7931</strong></span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="mailto:peter.lee108@gmail.com" className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-blue-400" />
              <span>E-Mail: <strong className="text-slate-200 font-medium">peter.lee108@gmail.com</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">Elite IT Support</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                SPECIALISTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-tight">
              On-Site IT Solutions & Network Architecture
            </p>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#services" className="hover:text-blue-400 transition-colors">
            서비스 영역
          </a>
          <a href="#tech-stack" className="hover:text-blue-400 transition-colors">
            OS & 가상화 스택
          </a>
          <button 
            onClick={onOpenSystemArch} 
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>시스템 연동 가이드</span>
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Dashboard button */}
          <button
            onClick={onOpenAdmin}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isAdmin 
                ? 'bg-purple-950/60 text-purple-200 border-purple-500/40 hover:bg-purple-900/60 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="관리자 캘린더 및 CRM 대시보드"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">관리자 CRM</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* My Page button */}
          <button
            onClick={onOpenMyPage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>마이페이지</span>
          </button>

          {/* Book On-Site CTA */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>현장 예약하기</span>
          </button>

          {/* Auth / Demo menu */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                  className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-500"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>

                {showDemoDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 text-xs z-50">
                    <div className="p-2 border-b border-slate-800">
                      <div className="font-semibold text-slate-200 truncate">{user.displayName || '고객님'}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-purple-500/20 text-purple-300 rounded">
                          MASTER ADMIN
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => { setShowDemoDropdown(false); onOpenMyPage(); }}
                      className="w-full text-left px-2.5 py-2 hover:bg-slate-800 rounded-lg flex items-center gap-2 text-slate-300 mt-1 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>내 예약 & 결제 영수증</span>
                    </button>
                    <button
                      onClick={() => { setShowDemoDropdown(false); onOpenAdmin(); }}
                      className="w-full text-left px-2.5 py-2 hover:bg-slate-800 rounded-lg flex items-center gap-2 text-slate-300 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      <span>관리자 CRM 대시보드</span>
                    </button>
                    <button
                      onClick={() => { setShowDemoDropdown(false); onLogout(); }}
                      className="w-full text-left px-2.5 py-2 hover:bg-red-950/40 text-red-400 rounded-lg flex items-center gap-2 mt-1 border-t border-slate-800 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
