export type ServiceCategory =
  | 'network_down'
  | 'server_setup'
  | 'os_troubleshoot'
  | 'firewall_vpn'
  | 'rack_cabling'
  | 'disaster_recovery'
  | 'vmware_virtualization';

export type UrgencyLevel = 'emergency_2hr' | 'standard' | 'scheduled';

export type OSEnvironment =
  | 'windows_server'
  | 'linux_server'
  | 'macos'
  | 'vm_proxmox_hyperv'
  | 'hybrid_cloud';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  companyName: string;
  serviceCategory: ServiceCategory;
  urgency: UrgencyLevel;
  osEnvironment: OSEnvironment;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 - 12:00"
  locationAddress: string;
  detailAddress: string;
  description: string;
  status: BookingStatus;
  assignedEngineer?: string;
  estimatedCost: number;
  resolutionNotes?: string;
  isPaid: boolean;
  invoiceNumber: string;
  googleCalendarSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string; // userId or customer id
  email: string;
  name: string;
  companyName: string;
  phone: string;
  role: 'customer' | 'admin';
  networkEquipment?: string;
  staticIpRange?: string;
  firewallModel?: string;
  backupSchedule?: string;
  specialNotes?: string;
  internalCrmNotes?: string;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNotification {
  id: string;
  bookingId?: string;
  title: string;
  message: string;
  type: 'new_booking' | 'booking_update' | 'urgent_request' | 'status_change';
  read: boolean;
  createdAt: string;
}

export interface Engineer {
  id: string;
  name: string;
  title: string;
  certifications: string[];
  phone: string;
  rating: number;
  activeDispatches: number;
  avatarUrl: string;
}
