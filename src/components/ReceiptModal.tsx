import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, Calendar, FileText } from 'lucide-react';
import { Booking } from '../types';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const vat = Math.round(booking.estimatedCost * 0.1);
  const supplyPrice = booking.estimatedCost - vat;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full">
        
        {/* Modal Top Control Bar (hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">전자 결제 영수증 / 세금계산서 청구 내역</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>영수증 출력</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Content */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-950">
                ELITE IT SUPPORT SPECIALISTS
              </div>
              <div className="text-xs text-slate-500 mt-1">
                (주)엘리트 아이티 서포트 스페셜리스트 | 사업자등록번호: 214-88-90142
              </div>
              <div className="text-xs text-slate-500">
                서울특별시 강남구 테헤란로 152 | 엔터프라이즈 전산관제센터
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded border border-emerald-600 text-emerald-700 bg-emerald-50">
                {booking.isPaid ? '결제 완료 (PAID)' : '현장 조치 청구서 (INVOICE)'}
              </span>
              <div className="text-xs text-slate-500 font-mono mt-2">
                영수증 번호: <span className="font-bold text-slate-900">{booking.invoiceNumber}</span>
              </div>
              <div className="text-xs text-slate-500">
                발행일자: {booking.date}
              </div>
            </div>
          </div>

          {/* Customer & Service Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-medium">수신 (고객사/의뢰인)</div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{booking.companyName || booking.userName}</div>
              <div className="text-slate-600 mt-1">담당자: {booking.userName} ({booking.userPhone})</div>
              <div className="text-slate-600">이메일: {booking.userEmail}</div>
              <div className="text-slate-600 truncate mt-1">주소: {booking.locationAddress} {booking.detailAddress}</div>
            </div>

            <div>
              <div className="text-slate-500 font-medium">현장 조치 내역 정보</div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">
                {booking.serviceCategory.toUpperCase().replace('_', ' ')}
              </div>
              <div className="text-slate-600 mt-1">방문 일시: {booking.date} ({booking.timeSlot})</div>
              <div className="text-slate-600">담당 엔지니어: {booking.assignedEngineer || '시니어 네트워크 엔지니어'}</div>
              <div className="text-slate-600">대상 환경: {booking.osEnvironment.replace('_', ' ').toUpperCase()}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-2.5 px-3">품목 / 서비스 내용</th>
                  <th className="py-2.5 px-3 text-center">수량</th>
                  <th className="py-2.5 px-3 text-right">단가</th>
                  <th className="py-2.5 px-3 text-right">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      엔터프라이즈 현장 방문 진단 및 기술지원
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {booking.description.slice(0, 70)}...
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">1식</td>
                  <td className="py-3 px-3 text-right">{supplyPrice.toLocaleString()}원</td>
                  <td className="py-3 px-3 text-right font-medium">{supplyPrice.toLocaleString()}원</td>
                </tr>
                {booking.urgency === 'emergency_2hr' && (
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">
                        긴급 2시간 이내 우선 출동 할증
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">1식</td>
                    <td className="py-2.5 px-3 text-right">포함</td>
                    <td className="py-2.5 px-3 text-right font-medium">포함</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>공급가액:</span>
                <span>{supplyPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>부가가치세 (10%):</span>
                <span>{vat.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-300">
                <span>총 청구 금액:</span>
                <span className="text-blue-700">{booking.estimatedCost.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* Seal / Legal footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="space-y-0.5">
              <div>본 영수증은 전자상거래법 및 부가가치세법 규정에 따라 발행된 전자 영수증입니다.</div>
              <div>문의: 02-589-9119 | support@elite-itsupport.kr</div>
            </div>
            <div className="text-center font-bold text-slate-700">
              <span className="text-xs">Elite IT Support Specialists</span>
              <div className="text-[10px] text-slate-400">[직인 생략]</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
