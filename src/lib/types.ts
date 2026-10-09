export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON' | 'ALLOTTED_TODAY' | 'RENEWED_TODAY' | 'UNAUTHORIZED' | 'PENDING_RENEWAL';
export type UserRole = 'ADMIN' | 'STAFF';

export interface Location {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  assignedLocationId?: string;
  invitedBy?: string;
  status: 'ACTIVE' | 'INVITED';
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'BURIAL' | 'CREMATION' | 'NAME_PLATE' | 'MAINTENANCE' | 'ADDON';
  isSubscription?: boolean;
  subscriptionYears?: number;
  active?: boolean;
}

export type ServicePackage = ServiceItem;

export interface ComboPackage {
  id: string;
  packageName: string;
  description: string;
  bundledServiceIds: string[];
  totalOriginalPrice: number;
  comboPrice: number;
  savings: number;
  includesNamePlate: boolean;
  active: boolean;
}

export interface CustomerBooking {
  id: string;
  receiptNo: string;
  locationId: string;
  locationName: string;
  customerName: string;
  ownerName?: string;
  customerPhone: string;
  ownerPhone?: string;
  whatsappNumber: string;
  address: string;
  petName: string;
  petType: 'Dog' | 'Cat' | 'Bird' | 'Other';
  petSpecies?: 'Dog' | 'Cat' | 'Bird' | 'Other';
  petBreed?: string;
  petAge?: string;
  plotSector: string;
  plotRow?: string;
  plotNumber: string;
  selectedServiceIds: string[];
  selectedComboPackageId?: string;
  totalAmount: number;
  paymentMethod: 'QR_CODE' | 'CASH' | 'WHATSAPP_PAY_LINK' | 'ONLINE_UPI';
  paymentStatus: 'PAID' | 'PENDING';
  bookingDate: string;
  burialDate?: string;
  serviceCharge?: number;
  hasNamePlate: boolean;
  createdByStaff: string;
  notes?: string;
}

export type BurialRecord = CustomerBooking;

export interface NamePlateSubscription {
  id: string;
  bookingId?: string;
  burialId?: string;
  locationId: string;
  locationName?: string;
  tagSerial: string;
  qrCodeUrl?: string;
  petName: string;
  customerName: string;
  ownerName?: string;
  customerPhone: string;
  ownerPhone?: string;
  whatsappNumber: string;
  plotSector: string;
  plotNumber: string;
  amountPaid: number;
  allotmentDate?: string;
  startDate?: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: SubscriptionStatus;
  isRenewedToday?: boolean;
  isAllottedToday?: boolean;
  lastReminderSentAt?: string;
  workOrderIssued?: boolean;
  installedBy?: string;
  installationDate?: string;
}

export interface AuditLog {
  id: string;
  locationId: string;
  tagSerial: string;
  plotSector: string;
  plotNumber: string;
  scannedAt: string;
  scannedBy: string;
  statusResult: SubscriptionStatus;
  petName: string;
  actionTaken?: string;
  flaggedForRemoval?: boolean;
}

export interface RevenueStats {
  todayCollection: number;
  sevenDaysCollection: number;
  fifteenDaysCollection: number;
  thirtyDaysCollection: number;
  totalAllottedToday: number;
  totalRenewedToday: number;
  expiringIn1Day: number;
  expiringIn7Days: number;
  expiringIn15Days: number;
  expiringIn30Days: number;
}
