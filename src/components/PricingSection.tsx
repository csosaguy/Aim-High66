import React from 'react';
import { Check, ShieldCheck, Zap, Clock, ArrowRight, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  onOpenBooking: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking }) => {
  const plans = [
    {
      name: '인프라 프로젝트 & 정기 유지보수',
      englishName: 'Project & Enterprise Retainer',
      price: '협의 (견적서 발행)',
      sla: '전담 엔지니어 배정',
      desc: '신규 전산실 랙 배선 공사, 대규모 서버 마이그레이션, 방화벽 이중화, 월 정기 전산 외주 관리.',
      features: [
        '현장 사전 실사 및 네트워크 설계도(Topology) 제작',
        'Cat6A/Cat7 배선 및 랙 케이블 테스터 전수 검증',
        '3-2-1 정기 백업 및 재해 복구 훈련',
        '고객 전용 인프라 CRM 대시보드 무제한 열람',
        '24/7 전용 비상 연락망 및 원격 관제 지원'
      ],
      popular: true,
      ctaText: '프로젝트 상담 및 예약',
      badge: '중견/엔터프라이즈'
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            투명한 단가표 & 엔터프라이즈 보증
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            숨겨진 비용 없는 정직한 출장 및 기술지원 단가
          </h2>
          <p className="text-base text-slate-300">
            현장 방문 전 정찰제 기본 견적을 확인하실 수 있으며, 조치 완료 후 투명한 세금계산서 및 전자 영수증을 즉시 발행합니다.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className={`grid gap-8 items-stretch ${
          plans.length === 1 
            ? 'max-w-2xl mx-auto' 
            : plans.length === 2 
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
              : 'grid-cols-1 md:grid-cols-3'
        }`}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl flex flex-col justify-between p-7 transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-blue-500 shadow-2xl shadow-blue-500/20'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-md">
                  ★ 기업 맞춤 인프라 전담 엔지니어
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {plan.englishName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {plan.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">
                    {plan.price}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{plan.sla}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                  {plan.desc}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    제공 내역 & SLA
                  </div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onOpenBooking}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
