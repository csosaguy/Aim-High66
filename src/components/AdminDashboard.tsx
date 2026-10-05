import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Calendar as CalendarIcon, 
  Table as TableIcon, 
  Bell, 
  UserCheck, 
  Building2, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Save, 
  Edit3, 
  Phone, 
  Mail, 
  Server, 
  ShieldAlert, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  User,
  Plus,
  Trash2
} from 'lucide-react';
import { Booking, CustomerProfile, AdminNotification, Engineer } from '../types';
import { INITIAL_ENGINEERS } from '../data/mockInitialData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  customers: CustomerProfile[];
  notifications: AdminNotification[];
  onUpdateBookingStatus: (bookingId: string, status: Booking['status'], assignedEngineer?: string, resolutionNotes?: string) => void;
  onUpdateCustomerCrm: (customerId: string, internalCrmNotes: string, networkEquipment?: string, firewallModel?: string) => void;
  onMarkNotificationRead: (notificationId: string) => void;
  onViewReceipt: (booking: Booking) => void;
  onViewReport: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  bookings,
  customers,
  notifications,
  onUpdateBookingStatus,
  onUpdateCustomerCrm,
  onMarkNotificationRead,
  onViewReceipt,
  onViewReport,
  onDeleteBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'crm' | 'notifications'>('bookings');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Booking for Detailed Dispatch Management
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(bookings[0] || null);
  const [editResolutionText, setEditResolutionText] = useState<string>('');

  // Selected Customer for CRM Note Editing
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(customers[0] || null);
  const [editCrmNotes, setEditCrmNotes] = useState<string>('');
  const [editNetworkEquip, setEditNetworkEquip] = useState<string>('');
  const [editFirewall, setEditFirewall] = useState<string>('');
  const [isSavingCrm, setIsSavingCrm] = useState(false);

  // Calendar View month state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleSelectCustomer = (c: CustomerProfile) => {
    setSelectedCustomer(c);
    setEditCrmNotes(c.internalCrmNotes || '');
    setEditNetworkEquip(c.networkEquipment || '');
    setEditFirewall(c.firewallModel || '');
  };

  const handleSaveCrm = () => {
    if (!selectedCustomer) return;
    setIsSavingCrm(true);
    onUpdateCustomerCrm(selectedCustomer.id, editCrmNotes, editNetworkEquip, editFirewall);
    setTimeout(() => {
      setIsSavingCrm(false);
      alert('고객사 IT 인프라 및 내부 CRM 메모가 성공적으로 업데이트되었습니다.');
    }, 400);
  };

  const handleSelectBooking = (b: Booking) => {
    setSelectedBooking(b);
    setEditResolutionText(b.resolutionNotes || '');
  };

  // Calendar calculations
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  엔터프라이즈 통합 관리자 관제센터 & CRM
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                실시간 예약 알림, 캘린더/테이블 뷰어, 현장 엔지니어 배정, 고객사 인프라 관리
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 cursor-pointer"
              title="실시간 알림 내역"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation & KPI Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              예약 관리 대시보드 ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              고객사 인프라 CRM ({customers.length})
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>실시간 수신 알림</span>
              {unreadNotifCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>
              <span>총 예약: </span>
              <strong className="text-white">{bookings.length}건</strong>
            </div>
            <div>
              <span>현장 출동중: </span>
              <strong className="text-blue-400">
                {bookings.filter((b) => b.status === 'in_progress').length}건
              </strong>
            </div>
            <div>
              <span>SLA 준수율: </span>
              <strong className="text-emerald-400">99.8%</strong>
            </div>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Bookings Management */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Controls bar: Table vs Calendar switch & Search/Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                {/* View switcher requested by user */}
                <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>표(Table) 형태</span>
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      viewMode === 'calendar'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>캘린더(Calendar) 형태</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="고객사, 담당자, 증상 검색..."
                      className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">전체 상태 보기</option>
                    <option value="pending">접수 대기 (Pending)</option>
                    <option value="confirmed">방문 확정 (Confirmed)</option>
                    <option value="in_progress">현장 조치중 (In Progress)</option>
                    <option value="completed">해결 완료 (Completed)</option>
                    <option value="cancelled">취소됨 (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* View 1: Table View */}
              {viewMode === 'table' ? (
                <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                        <tr>
                          <th className="py-3 px-4">고객사 / 담당자</th>
                          <th className="py-3 px-3">카테고리</th>
                          <th className="py-3 px-3">방문 일시</th>
                          <th className="py-3 px-3">긴급도</th>
                          <th className="py-3 px-3">배정 엔지니어</th>
                          <th className="py-3 px-3 text-center">진행 상태</th>
                          <th className="py-3 px-4 text-right">관리 작업</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredBookings.map((b) => (
                          <tr 
                            key={b.id} 
                            onClick={() => handleSelectBooking(b)}
                            className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                              selectedBooking?.id === b.id ? 'bg-blue-950/20' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{b.companyName}</div>
                              <div className="text-[11px] text-slate-400">{b.userName} ({b.userPhone})</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono text-blue-400 font-medium">
                                {b.serviceCategory.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div>{b.date}</div>
                              <div className="text-[10px] text-slate-400">{b.timeSlot}</div>
                            </td>
                            <td className="py-3 px-3">
                              {b.urgency === 'emergency_2hr' ? (
                                <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>긴급 2H</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">일반 방문</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-emerald-400 font-medium">
                                {b.assignedEngineer || '미배정'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.status === 'completed'
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                  : b.status === 'in_progress'
                                  ? 'bg-blue-950/80 text-blue-400 border border-blue-800 animate-pulse'
                                  : b.status === 'confirmed'
                                  ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800'
                                  : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                              }`}>
                                {b.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectBooking(b);
                                  }}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                                >
                                  조치/배정
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`'${b.companyName}'의 예약 내역(${b.invoiceNumber})을 삭제하시겠습니까?`)) {
                                      if (onDeleteBooking) {
                                        onDeleteBooking(b.id);
                                      }
                                      if (selectedBooking?.id === b.id) {
                                        setSelectedBooking(null);
                                      }
                                    }
                                  }}
                                  className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/80 text-rose-400 hover:text-white border border-rose-800/40 transition-colors cursor-pointer"
                                  title="예약 내역 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* View 2: Calendar View */
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-sm text-white">
                        {calYear}년 {calMonth + 1}월 현장 기술지원 스케줄 캘린더
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                      <div key={day} className="text-center font-bold text-slate-400 py-1">
                        {day}
                      </div>
                    ))}

                    {Array.from({ length: calFirstDay }).map((_, i) => (
                      <div key={`cal-empty-${i}`} className="min-h-24 bg-slate-950/30 rounded-lg border border-transparent p-1" />
                    ))}

                    {Array.from({ length: calDaysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const dayBookings = bookings.filter((b) => b.date === dateStr);

                      return (
                        <div
                          key={`day-${dayNum}`}
                          className="min-h-24 bg-slate-900/60 hover:bg-slate-800/40 rounded-lg border border-slate-800 p-1.5 flex flex-col justify-between transition-colors"
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-300">
                            <span>{dayNum}</span>
                            {dayBookings.length > 0 && (
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                                {dayBookings.length}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-18">
                            {dayBookings.map((b) => (
                              <div
                                key={b.id}
                                onClick={() => handleSelectBooking(b)}
                                className={`p-1 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                                  b.urgency === 'emergency_2hr'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : b.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                                }`}
                                title={`${b.companyName} (${b.timeSlot}) - ${b.serviceCategory}`}
                              >
                                {b.timeSlot.split(' ')[0]} {b.companyName}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Booking Detail Inspector & Dispatch Action Box */}
              {selectedBooking && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">
                        선택된 예약 상세 및 엔지니어 현장 조치 관제: {selectedBooking.companyName}
                      </span>
                      <span className="text-slate-500 font-mono">({selectedBooking.invoiceNumber})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewReceipt(selectedBooking)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-semibold cursor-pointer"
                      >
                        영수증 열람
                      </button>
                      {selectedBooking.status === 'completed' && (
                        <button
                          onClick={() => onViewReport(selectedBooking)}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-semibold cursor-pointer"
                        >
                          조치 리포트 열람
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`'${selectedBooking.companyName}'의 예약 내역(${selectedBooking.invoiceNumber})을 정말 삭제하시겠습니까?`)) {
                            if (onDeleteBooking) {
                              onDeleteBooking(selectedBooking.id);
                            }
                            setSelectedBooking(null);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/60 font-semibold cursor-pointer"
                        title="예약 내역 영구 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Status updater */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">진행 상태 변경</label>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as Booking['status'];
                          onUpdateBookingStatus(selectedBooking.id, newStatus);
                          setSelectedBooking({ ...selectedBooking, status: newStatus });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold cursor-pointer"
                      >
                        <option value="pending">접수 대기 (Pending)</option>
                        <option value="confirmed">방문 확정 (Confirmed)</option>
                        <option value="in_progress">현장 조치중 (In Progress)</option>
                        <option value="completed">해결 완료 (Completed)</option>
                        <option value="cancelled">예약 취소 (Cancelled)</option>
                      </select>
                    </div>

                    {/* Assigned Engineer selector */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">담당 출동 엔지니어 배정</label>
                      <select
                        value={selectedBooking.assignedEngineer || ''}
                        onChange={(e) => {
                          const newEng = e.target.value;
                          onUpdateBookingStatus(selectedBooking.id, selectedBooking.status, newEng);
                          setSelectedBooking({ ...selectedBooking, assignedEngineer: newEng });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold cursor-pointer"
                      >
                        <option value="">엔지니어 선택...</option>
                        {INITIAL_ENGINEERS.map((eng) => (
                          <option key={eng.id} value={eng.name}>
                            {eng.name} ({eng.certifications[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contact & Location info */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">현장 출동지 및 연락처</label>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 truncate">
                        {selectedBooking.locationAddress} {selectedBooking.detailAddress}
                      </div>
                    </div>
                  </div>

                  {/* Resolution Report Writer */}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      현장 엔지니어 조치 리포트 & 원인 규명 메모 (고객 완료 보고서에 반영됨)
                    </label>
                    <textarea
                      rows={3}
                      value={editResolutionText}
                      onChange={(e) => setEditResolutionText(e.target.value)}
                      placeholder="현장 도착 시간, 점검 장비, 조치 내용, 교체 부품, 향후 예방책 기록..."
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          onUpdateBookingStatus(
                            selectedBooking.id,
                            selectedBooking.status,
                            selectedBooking.assignedEngineer,
                            editResolutionText
                          );
                          alert('현장 조치 내역서가 저장되었습니다.');
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>현장 조치 리포트 저장</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Customer CRM & Infrastructure */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              {/* Customer Directory */}
              <div className="md:col-span-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="font-bold text-sm text-white flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>고객사 전산 목록</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">총 {customers.length}개사</span>
                </div>

                <div className="space-y-2">
                  {customers.map((c) => {
                    const isSelected = selectedCustomer?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCustomer(c)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                          isSelected
                            ? 'bg-purple-950/30 border-purple-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-white">{c.companyName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.name} · {c.phone}</div>
                        <div className="text-[10px] text-purple-400 font-mono mt-1">
                          누적 지원: {c.totalBookings || 1}회
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Infrastructure Profile & CRM Editor */}
              <div className="md:col-span-8 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                {selectedCustomer ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="font-bold text-base text-white">{selectedCustomer.companyName}</h3>
                        <p className="text-xs text-slate-400">
                          담당자: {selectedCustomer.name} ({selectedCustomer.email} | {selectedCustomer.phone})
                        </p>
                      </div>

                      <button
                        onClick={handleSaveCrm}
                        disabled={isSavingCrm}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingCrm ? '저장 중...' : 'CRM 정보 저장'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          네트워크 & 스위칭 장비
                        </label>
                        <input
                          type="text"
                          value={editNetworkEquip}
                          onChange={(e) => setEditNetworkEquip(e.target.value)}
                          placeholder="Cisco Catalyst 9300 48P x 3, Ubiquiti AP"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          방화벽 / UTM / VPN 모델
                        </label>
                        <input
                          type="text"
                          value={editFirewall}
                          onChange={(e) => setEditFirewall(e.target.value)}
                          placeholder="Fortinet FortiGate 100F HA"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        고정 IP 대역 및 백업 주기
                      </label>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] space-y-1">
                        <div><strong className="text-slate-400">고정 IP:</strong> {selectedCustomer.staticIpRange || '211.234.112.64/28'}</div>
                        <div><strong className="text-slate-400">백업 주기:</strong> {selectedCustomer.backupSchedule || '일일 02:00 증분 백업'}</div>
                        <div><strong className="text-slate-400">특이사항:</strong> {selectedCustomer.specialNotes || '보안실 사전 출입 신청 필요'}</div>
                      </div>
                    </div>

                    {/* Internal CRM Notes (Core requirement) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-400 font-medium">
                          내부 관리자 전용 CRM 메모 & 조치 이력 (고객 미공개)
                        </label>
                        <span className="text-[10px] text-purple-400">ADMIN INTERNAL ONLY</span>
                      </div>
                      <textarea
                        rows={5}
                        value={editCrmNotes}
                        onChange={(e) => setEditCrmNotes(e.target.value)}
                        placeholder="고객사 특이 성향, 서버 관리자 연락 가능 시간대, 결제 승인 권한자 정보, 다음 달 정기 점검 제안 내용..."
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500 text-xs leading-relaxed"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    좌측에서 고객사를 선택하세요.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 text-xs max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">실시간 접수 및 출동 알림 피드</span>
                </div>
                <span className="text-slate-400">새로운 예약 등록 시 즉각 동기화</span>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">새로운 알림이 없습니다.</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      notif.read
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                        : 'bg-blue-950/30 border-blue-600/50 text-slate-200 shadow-md shadow-blue-500/5'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-600' : 'bg-rose-500'}`} />
                        <span className="font-bold text-white text-xs">{notif.title}</span>
                        {notif.type === 'urgent_request' && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">
                            긴급 출동
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{notif.message}</p>
                      <div className="text-[10px] text-slate-500 pt-1">{notif.createdAt}</div>
                    </div>

                    {!notif.read && (
                      <span className="text-[10px] text-blue-400 font-semibold shrink-0">
                        읽음 처리
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
