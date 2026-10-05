import React, { useState } from 'react';
import { 
  X, 
  User, 
  Receipt, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Server, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Booking, CustomerProfile } from '../types';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  customerProfile: CustomerProfile | null;
  onOpenBooking: () => void;
  onViewReceipt: (booking: Booking) => void;
  onViewReport: (booking: Booking) => void;
}

export const MyPageModal: React.FC<MyPageModalProps> = ({
  isOpen,
  onClose,
  bookings,
  customerProfile,
  onOpenBooking,
  onViewReceipt,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'infra' | 'receipts'>('bookings');

  if (!isOpen) return null;

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
            해결 완료
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60 rounded animate-pulse">
            현장 조치중
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 rounded">
            방문 확정
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded">
            취소됨
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded">
            접수 대기
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {customerProfile?.companyName || '고객 전용 My Page'}
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {customerProfile?.name || '기업 회원'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                과거 및 진행 중인 기술지원 내역, 전자 결제 영수증, 등록된 IT 인프라 환경
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

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              예약 및 조치 내역 ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              결제 영수증 조회
            </button>
            <button
              onClick={() => setActiveTab('infra')}
              className={`py-3.5 border-b-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'infra'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              사내 IT 인프라 프로필 (CRM)
            </button>
          </div>

          <button
            onClick={() => { onClose(); onOpenBooking(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>신규 예약</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Bookings list */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm">아직 예약된 현장 방문 내역이 없습니다.</p>
                  <button
                    onClick={() => { onClose(); onOpenBooking(); }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    지금 첫 현장 방문 예약하기
                  </button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400">{booking.invoiceNumber}</span>
                        {getStatusBadge(booking.status)}
                        {booking.urgency === 'emergency_2hr' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                            긴급 2H
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{booking.date}</span>
                        <Clock className="w-3.5 h-3.5 text-blue-400 ml-1" />
                        <span>{booking.timeSlot}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-8 space-y-1">
                        <div className="font-bold text-sm text-white">
                          {booking.serviceCategory.toUpperCase().replace('_', ' ')}
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {booking.description}
                        </p>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                          <span>현장: {booking.locationAddress} {booking.detailAddress}</span>
                          {booking.assignedEngineer && (
                            <span className="text-emerald-400 font-medium">| 담당: {booking.assignedEngineer}</span>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-4 flex md:flex-col items-center md:items-end justify-between gap-2">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">청구 금액</div>
                          <div className="text-base font-bold text-blue-400">
                            {booking.estimatedCost.toLocaleString()}원
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.status === 'completed' && (
                            <button
                              onClick={() => onViewReport(booking)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>조치 리포트</span>
                            </button>
                          )}

                          <button
                            onClick={() => onViewReceipt(booking)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Receipt className="w-3 h-3 text-blue-400" />
                            <span>영수증 보기</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Receipts only */}
          {activeTab === 'receipts' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-slate-300">
                현장 기술지원 결제 내역 및 세금계산서 청구 영수증을 언제든지 조회하고 PDF로 인쇄/저장할 수 있습니다.
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">영수증 번호</th>
                      <th className="py-3 px-4">방문일</th>
                      <th className="py-3 px-4">서비스 내용</th>
                      <th className="py-3 px-4 text-right">금액</th>
                      <th className="py-3 px-4 text-center">상태</th>
                      <th className="py-3 px-4 text-center">열람</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {bookings.map((b) => (
                      <tr key={`receipt-row-${b.id}`} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{b.invoiceNumber}</td>
                        <td className="py-3 px-4">{b.date}</td>
                        <td className="py-3 px-4 font-medium text-white">{b.serviceCategory.replace('_', ' ').toUpperCase()}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-100">{b.estimatedCost.toLocaleString()}원</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.isPaid ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {b.isPaid ? '결제 완료' : '청구 대기'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onViewReceipt(b)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                          >
                            영수증 출력
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Infrastructure Profile (CRM View for Customer) */}
          {activeTab === 'infra' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm text-white">등록된 사내 전산 인프라 사양</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ 엔지니어 현장 참조용 데이터</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium">네트워크 & 스위칭 장비:</span>
                    <div className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {customerProfile?.networkEquipment || 'Cisco Catalyst 9300 48P x 3, Ubiquiti U6 Pro AP'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium">사내 고정 IP 대역 / 전용회선:</span>
                    <div className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono">
                      {customerProfile?.staticIpRange || '211.234.112.64/28 (KT GigaOffice 1Gbps)'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium">차세대 방화벽 / VPN 솔루션:</span>
                    <div className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {customerProfile?.firewallModel || 'Fortinet FortiGate 100F (Cluster HA Active-Passive)'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium">정기 백업 주기 및 스토리지:</span>
                    <div className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {customerProfile?.backupSchedule || '매일 02:00 Synology Active Backup 증분 백업 + Wasabi S3'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-slate-500 font-medium">서버실 출입 및 현장 특이사항:</span>
                  <div className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {customerProfile?.specialNotes || '서버실 랙 출입 시 1층 보안실 방문증 수령 필요. 긴급 출입 시 사전 연락 요망.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
