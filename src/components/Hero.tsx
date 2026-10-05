import React from 'react';
import { 
  Terminal, 
  ArrowRight, 
  CalendarCheck,
  Wrench,
  Download,
  Printer,
  ShieldCheck,
  HardDrive,
  Server,
  PhoneCall,
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenSystemArch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section 
      className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-24 border-b border-blue-900/30"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 20%, rgba(0, 242, 254, 0.12), transparent 70%), url('/circuit-bg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background glow and subtle network grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="space-y-7">
          {/* Main Headline */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-1 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ON-SITE &amp; REMOTE IT SUPPORT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[61px] font-extrabold tracking-tight text-white leading-[1.12] text-center">
              On-Site IT Support &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
                Network Design
              </span>
            </h1>
            
            {/* Sub Headline */}
            <p className="text-[18px] text-center text-slate-300 font-normal leading-relaxed pt-2 max-w-2xl mx-auto">
              네트워크 장애부터 복잡한 서버 구축까지, On-Site 에서 완벽한 솔루션을 제공합니다.
            </p>
          </div>

          {/* Trust badge quote */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-start gap-3.5 shadow-lg shadow-black/40">
            <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 shrink-0 mt-0.5">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                "Windows, Linux, Mac OS 및 Virtual Machine(VM) 환경을 아우르는 수십 년의 현장 문제 해결 노하우."
              </p>
              <p className="text-xs text-slate-400 mt-1 text-center">
                Windows, Red Hat, Linux, VMware, Network 자격 보유 정규직 시니어 엔지니어 직접 출동
              </p>
            </div>
          </div>

          {/* CTA Buttons & Service Highlights */}
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="group flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Your On-Site Expert Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="tel:010-2117-7931"
                className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/90 border border-slate-700 hover:border-blue-400 hover:text-white transition-all shadow-lg backdrop-blur-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>24/7 비상출동: <strong className="text-white">010-2117-7931</strong></span>
              </a>
            </div>

            {/* Quick Service Highlights from Poster */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6]">Windows &amp; MAC PC Repair</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6]">OS &amp; Software Installation</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <Printer className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6]">Network Printer, Copier, Scanner</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6]">Virus Cleanup &amp; Protection</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6]">Data Backup &amp; 복구</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-[#f0f2f6] text-center">Data Center Hardware 설치 &amp; Replacement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
