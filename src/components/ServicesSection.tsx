import React from 'react';
import { 
  Activity, 
  Server, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Database, 
  ArrowRight, 
  Check, 
  Clock, 
  Zap 
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockInitialData';
import { ServiceCategory } from '../types';

interface ServicesSectionProps {
  onSelectCategory: (cat: ServiceCategory) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6 text-rose-400" />;
      case 'Server': return <Server className="w-6 h-6 text-blue-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
      case 'Terminal': return <Terminal className="w-6 h-6 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'Database': return <Database className="w-6 h-6 text-emerald-400" />;
      default: return <Server className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[18px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            엔터프라이즈 현장 지원 솔루션
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            전문 엔지니어가 직접 방문하는 확실한 해결책
          </h2>
          <p className="text-base text-slate-300">
            원격으로는 해결 불가능한 하드웨어 장애, Rack Cabling, 가상화 클러스터 복구까지 현장에서 즉각 정상화합니다
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {service.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {service.koreanTitle}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">{service.title}</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{service.sla}</span>
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectCategory(service.id as ServiceCategory)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>이 분야 현장 예약하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
