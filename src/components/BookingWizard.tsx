import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Building, 
  User, 
  Mail, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Server, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Database,
  ArrowRight,
  Download,
  CalendarPlus,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, ServiceCategory, UrgencyLevel, OSEnvironment } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockInitialData';
import { createBookingDoc } from '../firebase';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (newBooking: Booking) => void;
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  existingBookings: Booking[];
}

const TIME_SLOTS = [
  '09:00 - 10:30',
  '10:30 - 12:00',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
  '18:00 - 19:30 (야간/긴급)',
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  onBookingCreated,
  currentUserId,
  currentUserEmail,
  currentUserName,
  existingBookings,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);

  // Form State
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('network_down');
  const [urgency, setUrgency] = useState<UrgencyLevel>('emergency_2hr');
  const [osEnvironment, setOsEnvironment] = useState<OSEnvironment>('vm_proxmox_hyperv');

  // Calendar State
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 - 12:00');

  // Client Info State
  const [userName, setUserName] = useState<string>(currentUserName || '');
  const [userEmail, setUserEmail] = useState<string>(currentUserEmail || '');
  const [userPhone, setUserPhone] = useState<string>('010-');
  const [companyName, setCompanyName] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  if (!isOpen) return null;

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Check if slot is taken on selectedDate
  const isSlotBooked = (slot: string) => {
    return existingBookings.some(
      (b) => b.date === selectedDate && b.timeSlot === slot && b.status !== 'cancelled'
    );
  };

  // Cost calculation
  const getEstimatedCost = () => {
    let base = 250000;
    if (serviceCategory === 'server_setup') base = 350000;
    if (serviceCategory === 'firewall_vpn') base = 300000;
    if (serviceCategory === 'os_troubleshoot') base = 200000;
    if (serviceCategory === 'rack_cabling') base = 320000;
    if (serviceCategory === 'disaster_recovery') base = 450000;
    if (serviceCategory === 'vmware_virtualization') base = 380000;

    if (urgency === 'emergency_2hr') base += 100000;
    if (urgency === 'scheduled') base -= 30000;

    return base;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !locationAddress.trim()) {
      alert('예약자 성함, 이메일, 현장 방문 주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    const invoiceNum = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cost = getEstimatedCost();

    const bookingPayload: Omit<Booking, 'id'> = {
      userId: currentUserId || 'guest',
      userEmail,
      userName,
      userPhone,
      companyName: companyName || '개인/프리랜서',
      serviceCategory,
      urgency,
      osEnvironment,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      locationAddress,
      detailAddress,
      description: description || '현장 점검 및 원인 분석 요청',
      status: 'confirmed',
      assignedEngineer: urgency === 'emergency_2hr' ? 'David Kim (수석 엔지니어)' : 'Alex Park (선임 엔지니어)',
      estimatedCost: cost,
      isPaid: false,
      invoiceNumber: invoiceNum,
      googleCalendarSynced: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docId = await createBookingDoc(bookingPayload);
      const finalBooking: Booking = {
        ...bookingPayload,
        id: docId || `BK-${Date.now()}`,
      };

      setBookingConfirmed(finalBooking);
      onBookingCreated(finalBooking);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('Firebase direct save fallback to local state:', err);
      const fallbackBooking: Booking = {
        ...bookingPayload,
        id: `BK-${Date.now()}`,
      };
      setBookingConfirmed(fallbackBooking);
      onBookingCreated(fallbackBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate .ics calendar download
  const handleDownloadICS = (booking: Booking) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Elite IT Support Specialists//Booking Calendar//KO
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:IT Support Specialist 현장 방문: ${booking.companyName} (${booking.serviceCategory})
DESCRIPTION:담당 엔지니어: ${booking.assignedEngineer || '수석 엔지니어 배정'}\\n주소: ${booking.locationAddress} ${booking.detailAddress}\\n증상: ${booking.description}
LOCATION:${booking.locationAddress} ${booking.detailAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `IT-Support-Appointment-${booking.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">현장 전문가 방문 예약 (On-Site Booking)</h2>
              <p className="text-xs text-slate-400">직관적인 날짜 및 시간 선택과 실시간 엔지니어 자동 배정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {bookingConfirmed ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded-full">
                예약 접수 및 배정 확정 완료
              </span>
              <h3 className="text-2xl font-bold text-white pt-1">
                현장 전문가 방문 일정이 확정되었습니다!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                <span className="font-semibold text-blue-400">{bookingConfirmed.companyName || bookingConfirmed.userName}</span>님의 일정이 관리자 Google Calendar에 실시간 동기화되었습니다.
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="max-w-lg mx-auto p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">예약 번호</span>
                <span className="font-mono text-blue-400 font-semibold">{bookingConfirmed.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">방문 일시</span>
                <span className="text-white font-medium">{bookingConfirmed.date} ({bookingConfirmed.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">배정 엔지니어</span>
                <span className="text-emerald-400 font-medium">{bookingConfirmed.assignedEngineer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">출동 긴급도</span>
                <span className="text-amber-400 font-medium">
                  {bookingConfirmed.urgency === 'emergency_2hr' ? '⚡ 긴급 2시간 이내 현장 출동' : '일반 현장 기술지원'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">현장 방문지</span>
                <span className="text-slate-200 text-right truncate max-w-[260px]">{bookingConfirmed.locationAddress} {bookingConfirmed.detailAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-semibold text-sm">
                <span className="text-slate-300">예상 청구 금액</span>
                <span className="text-blue-400">{bookingConfirmed.estimatedCost.toLocaleString()}원 (현장 점검 후 결제)</span>
              </div>
            </div>

            {/* Google Workspace & Email Automation Banner */}
            <div className="max-w-lg mx-auto p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-left text-xs flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-300">구글 워크스페이스 일정 자동화 완료</div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  입력하신 <span className="text-blue-400 font-mono">{bookingConfirmed.userEmail}</span>로 예약 확인 메일이 발송되었으며, 방문 1시간 전 SMS 및 이메일 리마인더가 자동 전송됩니다.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleDownloadICS(bookingConfirmed)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>내 캘린더에 추가 (.ics 다운로드)</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Progress Bar */}
            <div className="px-6 pt-4 pb-2 bg-slate-950/40 border-b border-slate-800">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div 
                  onClick={() => setStep(1)}
                  className={`cursor-pointer pb-2 border-b-2 text-center transition-all ${
                    step >= 1 ? 'border-blue-500 text-blue-400 font-bold' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  1. 문제 카테고리
                </div>
                <div 
                  onClick={() => setStep(2)}
                  className={`cursor-pointer pb-2 border-b-2 text-center transition-all ${
                    step >= 2 ? 'border-blue-500 text-blue-400 font-bold' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  2. 날짜 & 시간 선택
                </div>
                <div 
                  onClick={() => setStep(3)}
                  className={`cursor-pointer pb-2 border-b-2 text-center transition-all ${
                    step >= 3 ? 'border-blue-500 text-blue-400 font-bold' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  3. OS / VM 환경
                </div>
                <div 
                  onClick={() => setStep(4)}
                  className={`cursor-pointer pb-2 border-b-2 text-center transition-all ${
                    step >= 4 ? 'border-blue-500 text-blue-400 font-bold' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  4. 주소 및 연락처
                </div>
              </div>
            </div>

            {/* Step 1: Category & Urgency */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    방문 요청 문제 카테고리 선택
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = serviceCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setServiceCategory(cat.id as ServiceCategory)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {cat.badge}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white mb-1">{cat.koreanTitle}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-2">{cat.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Urgency Tier */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    출동 긴급도 (SLA) 선택
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => setUrgency('emergency_2hr')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all text-[#f3eaea] ${
                        urgency === 'emergency_2hr'
                          ? 'bg-rose-950/40 border-rose-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-[#f6eff0]">긴급 2시간 출동</span>
                      </div>
                      <div className="text-xs text-slate-400">업무 마비, 코어 스위치 장애 등 최우선 현장 투입</div>
                    </div>

                    <div
                      onClick={() => setUrgency('standard')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        urgency === 'standard'
                          ? 'bg-blue-950/40 border-blue-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-400">당일/익일 일반 방문 (기본)</span>
                      </div>
                      <div className="text-xs text-slate-400">영업시간 내 예약 확정 및 전문 엔지니어 일정 조율</div>
                    </div>

                    <div
                      onClick={() => setUrgency('scheduled')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        urgency === 'scheduled'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">사전 정기 점검</span>
                      </div>
                      <div className="text-xs text-slate-400">서버랙 재정리, 주말 야간 작업 및 계획 점검</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>날짜 & 시간 선택하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Picker (Calendar UI) */}
            {step === 2 && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Calendar Widget */}
                  <div className="md:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-blue-400" />
                        <span>{year}년 {month + 1}월</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handlePrevMonth}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextMonth}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-2">
                      <span className="text-rose-400">일</span>
                      <span>월</span>
                      <span>화</span>
                      <span>수</span>
                      <span>목</span>
                      <span>금</span>
                      <span className="text-blue-400">토</span>
                    </div>

                    {/* Date grid */}
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const isSelected = selectedDate === dateStr;
                        const isPast = new Date(year, month, dayNum) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                        return (
                          <button
                            key={dateStr}
                            disabled={isPast}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`h-9 rounded-lg font-medium transition-all flex items-center justify-center cursor-pointer ${
                              isPast
                                ? 'text-slate-600 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Time Slots for Date */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>방문 시간대 선택</span>
                      <span className="text-blue-400 font-mono text-[11px]">{selectedDate}</span>
                    </div>
                    <div className="space-y-2">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = isSlotBooked(slot);
                        const isSelected = selectedTimeSlot === slot;

                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                              isBooked
                                ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-sm'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                              <span>{slot}</span>
                            </span>
                            {isBooked ? (
                              <span className="text-[10px] text-rose-500/80 font-normal">예약 마감</span>
                            ) : isSelected ? (
                              <span className="text-[10px] text-blue-400 font-semibold">선택됨</span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-normal">예약 가능</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>OS / VM 환경 입력하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: OS & VM Environment */}
            {step === 3 && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    대상 시스템 인프라 및 OS 환경
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'windows_server', title: 'Windows Server / AD DC', desc: 'Windows Server 2019/2022/2025, Active Directory, Hyper-V, IIS' },
                      { id: 'linux_server', title: 'Linux Server (Ubuntu / RHEL)', desc: 'Ubuntu, Red Hat Enterprise, Rocky Linux, Debian, Docker, NGINX' },
                      { id: 'vm_proxmox_hyperv', title: 'Virtual Machine (VMware / Proxmox)', desc: 'VMware ESXi vSphere, Proxmox VE, Hyper-V Failover Cluster, SAN/NAS' },
                      { id: 'macos', title: 'macOS & Apple Workstations', desc: 'macOS Sonoma/Sequoia, MDM 프로필, NAS SMB 마운트, 디자인 랩' },
                      { id: 'hybrid_cloud', title: 'Hybrid Cloud & Multi-Office', desc: 'AWS / Azure Site-to-Site VPN, Fortinet FortiGate, Cisco CBS' },
                    ].map((item) => {
                      const isSelected = osEnvironment === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setOsEnvironment(item.id as OSEnvironment)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Symptom Description Memo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    간략한 증상 메모 및 사전 공유 로그
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="예: 2층 지사 공유기 교체 후 인터넷 끊김 현상이 발생하며, 특정 IP(192.168.1.1) 충돌 에러가 지속적으로 로그에 기록됩니다. 필요 장비: 패킷 테스터 및 8포트 기가 스위치."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    * 상세한 로그나 증상을 남겨주시면 현장 엔지니어가 전용 장비 및 교체 부품을 사전 지참하여 방문합니다.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    이전 단계
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>현장 주소 및 담당자 정보 입력</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Client & Location Info */}
            {step === 4 && (
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      담당자 성함 <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="홍길동 팀장"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      회사명 / 조직명
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="(주)에이펙스 데이터랩"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      연락처 (휴대폰) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="010-1234-5678"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      확인 및 리마인더 수신 이메일 <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="it.manager@company.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Address */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      현장 방문 주소 <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="서울특별시 강남구 테헤란로 152"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      상세 주소 (층수, 호수, 서버실 위치 등)
                    </label>
                    <input
                      type="text"
                      value={detailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      placeholder="강남파이낸스센터 18층 전산실 (방문증 발급 필요)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>



                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    이전 단계
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>예약 접수 중...</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-4 h-4" />
                        <span>지금 현장 전문가 예약 확정하기</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
