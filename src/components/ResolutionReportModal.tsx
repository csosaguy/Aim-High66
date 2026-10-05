import React from 'react';
import { X, CheckCircle, ShieldAlert, Cpu, Wrench, FileCheck, Printer } from 'lucide-react';
import { Booking } from '../types';

interface ResolutionReportModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ResolutionReportModal: React.FC<ResolutionReportModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">현장 기술지원 조치 완료 보고서</h3>
              <p className="text-xs text-slate-400">Field Engineer Technical Resolution Report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <div className="text-slate-500">예약 번호</div>
              <div className="font-mono font-semibold text-slate-200 mt-0.5">{booking.invoiceNumber}</div>
            </div>
            <div>
              <div className="text-slate-500">조치 완료일</div>
              <div className="font-semibold text-slate-200 mt-0.5">{booking.date}</div>
            </div>
            <div>
              <div className="text-slate-500">배정 엔지니어</div>
              <div className="font-semibold text-emerald-400 mt-0.5">{booking.assignedEngineer || '현장 기술팀'}</div>
            </div>
            <div>
              <div className="text-slate-500">상태</div>
              <div className="font-bold text-emerald-400 mt-0.5 uppercase">{booking.status}</div>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>접수 증상 및 초기 장애 현상</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {booking.description}
            </div>
          </div>

          {/* Engineer Field Actions */}
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>현장 조치 상세 내역 & 원인 분석 (Root Cause)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-mono whitespace-pre-line">
              {booking.resolutionNotes || '엔지니어 현장 원인 규명 및 조치 테스트 완료. 네트워크 패킷 분석 정상화 완료.'}
            </div>
          </div>

          {/* Quality & Recommendations */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>엔터프라이즈 지속 예방 권고사항</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>L2 스위치 루핑 방지를 위해 전 포트 STP BPDU Guard 상시 활성화 유지 권장</li>
              <li>정기적 펌웨어 보안 패치 및 주간 자동 백업 무결성 테스트 실행</li>
              <li>동일 이슈 재발 시 24시간 이내 무상 리콜 현장 지원 SLA 적용</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
