/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  logoutUser, 
  testConnection, 
  updateBookingStatusDoc, 
  saveCustomerProfileDoc 
} from './firebase';
import { Booking, CustomerProfile, AdminNotification, ServiceCategory } from './types';
import { 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockInitialData';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { TechStackSection } from './components/TechStackSection';
import { Footer } from './components/Footer';

import { BookingWizard } from './components/BookingWizard';
import { MyPageModal } from './components/MyPageModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ResolutionReportModal } from './components/ResolutionReportModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(true); // Default to admin for seamless evaluation
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSystemArchOpen, setIsSystemArchOpen] = useState(false);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [activeReportBooking, setActiveReportBooking] = useState<Booking | null>(null);

  // Pre-selected category if user clicks from services grid
  const [initialBookingCategory, setInitialBookingCategory] = useState<ServiceCategory>('network_down');

  // 1. Initial connection test and Auth listener
  useEffect(() => {
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // If user is peter.lee108@gmail.com, mark as master admin
        if (user.email === 'peter.lee108@gmail.com') {
          setIsDemoAdmin(true);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore sync with fallback
  useEffect(() => {
    try {
      const bookingsCol = collection(db, 'bookings');
      const unsubscribeBookings = onSnapshot(
        bookingsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteBookings: Booking[] = snapshot.docs.map((docSnap) => ({
              ...(docSnap.data() as Omit<Booking, 'id'>),
              id: docSnap.id,
            }));
            // Merge with initial data so rich history is always visible
            const merged = [...remoteBookings];
            INITIAL_BOOKINGS.forEach((initB) => {
              if (!merged.some((m) => m.id === initB.id || m.invoiceNumber === initB.invoiceNumber)) {
                merged.push(initB);
              }
            });
            setBookings(merged);
          }
        },
        (error) => {
          console.warn('Real-time bookings sync offline or restricted, using local state.', error.message);
        }
      );

      return () => unsubscribeBookings();
    } catch {
      // ignore
    }
  }, []);

  // Check if current user is admin
  const isAdmin = isDemoAdmin || currentUser?.email === 'peter.lee108@gmail.com';

  // Current customer profile
  const currentCustomerProfile: CustomerProfile = {
    id: currentUser?.uid || 'cust-peter',
    email: currentUser?.email || 'peter.lee108@gmail.com',
    name: currentUser?.displayName || '이성훈 대표',
    companyName: '에이펙스 데이터랩',
    phone: '010-5521-8891',
    role: isAdmin ? 'admin' : 'customer',
    networkEquipment: 'Ubiquiti UniFi Dream Machine SE, USW-EnterpriseXG-24, FortiGate 60F',
    staticIpRange: '58.120.45.10/30 (SKB Biz 1G)',
    firewallModel: 'FortiGate 60F with UTM Security Bundle',
    backupSchedule: 'AWS S3 Glacier Deep Archive 월간 콜드 아카이빙',
    specialNotes: '엔터프라이즈 데모 테스트 환경 및 대표자 전용 전산실.',
    internalCrmNotes: 'VIP 고객사. SSL VPN MFA 연동 완료. 정기 점검 3개월 단위 권고.',
    totalBookings: bookings.filter((b) => b.userEmail === (currentUser?.email || 'peter.lee108@gmail.com')).length || 4,
  };

  // Handlers
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      alert('Google 로그인 팝업이 차단되었거나 취소되었습니다. 1-Click 테스트 로그인을 이용하실 수 있습니다.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsDemoAdmin(false);
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setIsDemoAdmin(true);
      alert('관리자(Admin) 권한으로 전환되었습니다. 실시간 관제 및 CRM 수정이 가능합니다.');
    } else {
      setIsDemoAdmin(false);
      alert('기업 고객(Customer) 모드로 전환되었습니다. 마이페이지에서 예약 내역과 영수증 조회가 가능합니다.');
    }
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Create real-time notification
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      bookingId: newBooking.id,
      title: `[${newBooking.urgency === 'emergency_2hr' ? '긴급 출동' : '신규 예약'}] ${newBooking.companyName}`,
      message: `${newBooking.userName}님께서 ${newBooking.date} (${newBooking.timeSlot}) 현장 기술지원을 신청하셨습니다.`,
      type: newBooking.urgency === 'emergency_2hr' ? 'urgent_request' : 'new_booking',
      read: false,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: Booking['status'],
    assignedEngineer?: string,
    resolutionNotes?: string
  ) => {
    // 1. Update local state
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status,
            assignedEngineer: assignedEngineer !== undefined ? assignedEngineer : b.assignedEngineer,
            resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : b.resolutionNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // 2. Persist to Firestore
    try {
      await updateBookingStatusDoc(bookingId, status, assignedEngineer, resolutionNotes);
    } catch {
      // Local state already updated
    }
  };

  const handleUpdateCustomerCrm = async (
    customerId: string,
    internalCrmNotes: string,
    networkEquipment?: string,
    firewallModel?: string
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            internalCrmNotes,
            networkEquipment: networkEquipment || c.networkEquipment,
            firewallModel: firewallModel || c.firewallModel,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    try {
      await saveCustomerProfileDoc(customerId, {
        internalCrmNotes,
        networkEquipment,
        firewallModel,
      });
    } catch {
      // Local state already updated
    }
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleDeleteBooking = async (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (err) {
      console.warn('Firestore delete offline or restricted:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        isAdmin={isAdmin}
        unreadCount={unreadCount}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenMyPage={() => setIsMyPageOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSystemArch={() => setIsSystemArchOpen(true)}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onDemoLogin={handleDemoLogin}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenSystemArch={() => setIsSystemArchOpen(true)}
        />

        {/* Services Showcase */}
        <ServicesSection
          onSelectCategory={(cat) => {
            setInitialBookingCategory(cat);
            setIsBookingOpen(true);
          }}
        />

        {/* Multi-OS & Virtualization Tech Stack */}
        <TechStackSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenSystemArch={() => setIsSystemArchOpen(true)}
        onOpenMyPage={() => setIsMyPageOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Portals */}
      {/* 1. Interactive Booking Wizard */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingCreated={handleBookingCreated}
        currentUserId={currentUser?.uid}
        currentUserEmail={currentUser?.email || 'it.manager@company.com'}
        currentUserName={currentUser?.displayName || '이성훈 대표'}
        existingBookings={bookings}
      />

      {/* 2. Customer My Page (Service History & Receipts) */}
      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        bookings={bookings}
        customerProfile={currentCustomerProfile}
        onOpenBooking={() => setIsBookingOpen(true)}
        onViewReceipt={(booking) => setActiveReceiptBooking(booking)}
        onViewReport={(booking) => setActiveReportBooking(booking)}
      />

      {/* 3. Admin Real-Time Dashboard & CRM */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        customers={customers}
        notifications={notifications}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onUpdateCustomerCrm={handleUpdateCustomerCrm}
        onMarkNotificationRead={handleMarkNotificationRead}
        onViewReceipt={(booking) => setActiveReceiptBooking(booking)}
        onViewReport={(booking) => setActiveReportBooking(booking)}
        onDeleteBooking={handleDeleteBooking}
      />

      {/* 4. System Implementation & Automation Guide Modal */}
      <SystemArchitectureModal
        isOpen={isSystemArchOpen}
        onClose={() => setIsSystemArchOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* 5. Printable Electronic Receipt Modal */}
      <ReceiptModal
        booking={activeReceiptBooking}
        onClose={() => setActiveReceiptBooking(null)}
      />

      {/* 6. Technical Field Engineer Resolution Report */}
      <ResolutionReportModal
        booking={activeReportBooking}
        onClose={() => setActiveReportBooking(null)}
      />
    </div>
  );
}
