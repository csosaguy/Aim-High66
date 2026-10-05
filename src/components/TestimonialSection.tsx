import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: '긴급 출동 시 2시간 이내 도착이 정말 보장되나요?',
      a: '네, 서울 전역 및 판교/분당/수원 등 수도권 주요 IT 거점에 전담 엔지니어가 상시 차량 이동 대기 중입니다. 접수 즉시 관제 센터에서 최단 거리 시니어 엔지니어를 실시간 배정하여 2시간 내 현장 도착을 엄격한 SLA로 보장합니다.'
    },
    {
      q: '현장 방문 예약 시 Google Calendar 연동은 어떻게 동작하나요?',
      a: '예약자가 사이트에서 날짜와 비어있는 시간대를 클릭하여 접수하면, 즉시 관리자 모바일 Google Calendar에 위치, 담당자 연락처, 증상 메모가 자동 기록됩니다. 또한 신청하신 고객님께는 ics 캘린더 파일과 예약 확인 메일, 방문 1시간 전 SMS 알림이 자동 발송됩니다.'
    },
    {
      q: '현장에서 해결되지 않을 경우 비용은 어떻게 되나요?',
      a: '저희는 100% No-Fix, No-Charge 원칙을 엄수합니다. 현장 엔지니어가 기술적 원인을 규명하지 못하거나 문제를 해결하지 못한 경우 기본 출장비를 포함하여 일체의 비용을 청구하지 않습니다.'
    },
    {
      q: '과거 방문 조치 내역과 세금계산서/영수증은 어디서 확인하나요?',
      a: '상단 우측 [마이페이지(My Page)]에서 언제든지 과거 완료된 모든 방문 내역, 엔지니어의 공식 현장 조치 리포트(원인/조치/예방책), 그리고 출력 가능한 전자 결제 영수증을 확인하실 수 있습니다.'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <span>자주 묻는 질문 (FAQ)</span>
            </h3>
            <p className="text-xs text-slate-400">
              방문 예약 및 엔지니어 출동에 대해 궁금하신 점을 확인하세요.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
