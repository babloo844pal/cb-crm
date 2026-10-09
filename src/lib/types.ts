export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL' | 'UNAUTHORIZED';
export type UserRole = 'ADMIN' | 'STAFF';

export interface Location {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  activePlotsCount: number;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  assignedLocationId?: string; // If STAFF, restricted to this location
  invitedBy?: string;
  status: 'ACTIVE' | 'INVITED';
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'CREMATION' | 'BURIAL' | 'NAME_PLATE' | 'ADDON';
  isSubscription?: boolean;
  subscriptionYears?: number;
  active: boolean;
}

export interface BurialRecord {
  id: string;
  receiptNo: string;
  locationId: string;
  locationName: string;
  ownerName: string;
  ownerPhone: string;
  petName: string;
  petSpecies: 'Dog' | 'Cat' | 'Bird' | 'Other';
  burialDate: string;
  plotSector: string;
  plotNumber: string;
  serviceCharge: number;
  hasNamePlate: boolean;
  notes?: string;
  createdByStaff: string;
}

export interface NamePlateSubscription {
  id: string;
  burialId: string;
  locationId: string;
  tagSerial: string;
  qrCodeUrl?: string;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  plotSector: string;
  plotNumber: string;
  amountPaid: number;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  workOrderIssued: boolean;
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
