import React from 'react';
import { Server, PhoneCall, Mail, MapPin, Layers, Calendar, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenSystemArch: () => void;
  onOpenMyPage: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenSystemArch,
  onOpenMyPage,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Elite IT Support Specialists
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-md">
              "On-Site IT Support & Network Design, Right at Your location."<br />
              네트워크 장애부터 복잡한 서버 구축까지, 비즈니스가 멈추지 않도록 전문가가 현장에서 직접 완벽한 솔루션을 제공합니다.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-slate-300">
              <a 
                href="tel:010-2117-7931" 
                className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white">24/7 비상출동: 010-2117-7931</span>
              </a>
              <a 
                href="mailto:peter.lee108@gmail.com" 
                className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-slate-200">E-Mail: <span className="text-white font-semibold">peter.lee108@gmail.com</span></span>
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">현장 기술지원 분야</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-blue-400">네트워크 마비 & 스위치 루핑 격리</a></li>
              <li><a href="#services" className="hover:text-blue-400">엔터프라이즈 랙서버 물리 구축</a></li>
              <li><a href="#services" className="hover:text-blue-400">VMWare ESXi 가상화 크러스터</a></li>
              <li><a href="#services" className="hover:text-blue-400">Cat6A LAN Cable 구내 배선 및 Rack 공사</a></li>
              <li><a href="#services" className="hover:text-blue-400">NAS 재해 복구 백업</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">주요 기능</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenBooking} className="hover:text-blue-400 cursor-pointer text-left">
                  현장 방문 예약 (Calendar)
                </button>
              </li>
              <li>
                <button onClick={onOpenMyPage} className="hover:text-blue-400 cursor-pointer text-left">
                  마이페이지 (조치내역 & 영수증)
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-purple-400 cursor-pointer text-left">
                  관리자 관제 CRM (Table / Cal)
                </button>
              </li>
              <li>
                <button onClick={onOpenSystemArch} className="hover:text-blue-400 cursor-pointer text-left">
                  시스템 연동 가이드 (WordPress)
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
