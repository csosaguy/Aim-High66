import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Calendar, 
  Mail, 
  Smartphone, 
  Server, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Zap, 
  Code2, 
  Workflow
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'wordpress' | 'workspace' | 'react_firebase'>('workspace');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                실제 시스템 구축 아키텍처 & 자동화 가이드
              </h2>
              <p className="text-xs text-slate-400">
                WordPress 플러그인(Amelia/Bookly) vs React+Firebase 풀스택 비교 & Google Workspace 자동화
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="px-6 bg-slate-950/40 border-b border-slate-800 flex items-center gap-6 text-xs">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'workspace'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Google Workspace 일정 자동화 (추천)</span>
          </button>

          <button
            onClick={() => setActiveTab('wordpress')}
            className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'wordpress'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>WordPress + Amelia / Bookly 플러그인</span>
          </button>

          <button
            onClick={() => setActiveTab('react_firebase')}
            className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'react_firebase'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>React + Firebase 풀스택 (현재 시스템)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 text-xs space-y-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: Google Workspace 일정 자동화 */}
          {activeTab === 'workspace' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-300">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Google Workspace 캘린더 동기화 & 무인 CS 파이프라인</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  고객이 웹사이트에서 원하는 날짜와 시간대를 클릭하여 접수하면, 관리자의 스마트폰 Google Calendar에 실시간 일정 및 현장 주소, 증상 메모가 즉시 동기화됩니다. 동시에 고객에게는 확인 메일과 방문 1시간 전 리마인더가 발송됩니다.
                </p>
              </div>

              {/* Step Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                  <div className="font-bold text-white text-xs">고객 방문 일정 선택</div>
                  <p className="text-slate-400 text-[11px]">
                    직관적 캘린더에서 비어있는 시간대 클릭 후 증상 및 주소 입력
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">2</div>
                  <div className="font-bold text-white text-xs">Google Calendar API</div>
                  <p className="text-slate-400 text-[11px]">
                    관리자 스마트폰 캘린더에 일정 자동 생성 및 네비게이션 주소 연동
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                  <div className="font-bold text-white text-xs">예약 확정 이메일 즉시 발송</div>
                  <p className="text-slate-400 text-[11px]">
                    접수 내역, 담당 엔지니어 프로필, 전자 영수증 링크 자동 동봉
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">4</div>
                  <div className="font-bold text-white text-xs">방문 1시간 전 리마인더</div>
                  <p className="text-slate-400 text-[11px]">
                    "엔지니어가 출발했습니다" SMS 및 이메일 자동 발송으로 부재 방지
                  </p>
                </div>
              </div>

              {/* Implementation Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Google Calendar API 연동 예시 코드 (Node / Cloud Function)</span>
                  <button
                    onClick={() => handleCopy(`const event = {
  summary: 'IT Support 현장 출동: ' + booking.companyName,
  location: booking.locationAddress,
  description: '증상: ' + booking.description + '\\n담당: ' + booking.assignedEngineer,
  start: { dateTime: booking.startISO, timeZone: 'Asia/Seoul' },
  end: { dateTime: booking.endISO, timeZone: 'Asia/Seoul' },
  reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }] }
};`)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '복사됨!' : '코드 복사'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{`// Google Calendar v3 API Event Injection
const event = {
  summary: 'IT Support 현장 출동: ' + booking.companyName,
  location: booking.locationAddress,
  description: '증상: ' + booking.description + '\\n담당: ' + booking.assignedEngineer,
  start: { dateTime: booking.startISO, timeZone: 'Asia/Seoul' },
  end: { dateTime: booking.endISO, timeZone: 'Asia/Seoul' },
  reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }] }
};`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WordPress + Amelia / Bookly 플러그인 가이드 */}
          {activeTab === 'wordpress' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-sm text-white">
                  워드프레스(WordPress) 기반 신속 구축 가이드
                </div>
                <p className="text-slate-300 leading-relaxed">
                  처음부터 커스텀 개발을 하지 않고도 WordPress와 전문 플러그인(Amelia 또는 Bookly)을 결합하면 1~2일 내에 완성도 높은 달력 예약 UI, 고객 로그인 포털, 관리자 캘린더 대시보드를 바로 서비스할 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="font-bold text-blue-400 text-sm">Amelia 플러그인 추천 이유</div>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>모던하고 유려한 반응형 캘린더 UI (모바일 완벽 지원)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Google Calendar 및 Outlook 2-way 양방향 동기화 내장</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>결제 게이트웨이(토스페이먼츠, Stripe, PayPal) 연동 지원</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>카카오 알림톡/SMS 및 이메일 자동 리마인더 발송</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="font-bold text-indigo-400 text-sm">Bookly 플러그인 장점</div>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>다양한 엔지니어별 개별 스케줄 및 휴일 관리 특화</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>고객 커스텀 필드(인프라 사양, 서버실 위치 등) 자유로운 추가</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>풍부한 애드온 생태계와 안정적인 장기 지원</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: React + Firebase 비교 */}
          {activeTab === 'react_firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-sm text-white">
                  현재 본 웹 애플리케이션 (React 19 + Firebase Firestore + Auth)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  플러그인의 제약 없이 완벽하게 커스터마이징된 엔터프라이즈급 방문 예약, 실시간 CRM 메모, 전자 영수증 발급, 및 Google 로그인 시스템입니다.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">비교 항목</th>
                      <th className="py-2.5 px-3">WordPress + Amelia 플러그인</th>
                      <th className="py-2.5 px-3 text-blue-400">현재 React + Firebase 풀스택</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">초기 런칭 속도</td>
                      <td className="py-2.5 px-3">1~2일 내 플러그인 설치로 즉시 완료</td>
                      <td className="py-2.5 px-3 text-blue-400">자체 커스텀 UI/UX 즉각 구동</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">인프라 CRM 커스텀</td>
                      <td className="py-2.5 px-3">플러그인 옵션 내에서 제한적 설정</td>
                      <td className="py-2.5 px-3 text-blue-400">사내 고정 IP, 방화벽, 백업 이력 완전 제어</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">반응 속도 & 보안</td>
                      <td className="py-2.5 px-3">PHP/MySQL 서버 리소스에 종속</td>
                      <td className="py-2.5 px-3 text-blue-400">서버리스 실시간 Firestore & 무결점 보안 규칙</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-slate-400">
              실제 비즈니스 적용 시 원하시는 방식으로 즉시 구축을 지원해 드립니다.
            </span>
            <button
              onClick={() => { onClose(); onOpenBooking(); }}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
            >
              현장 기술지원 예약 체험하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
