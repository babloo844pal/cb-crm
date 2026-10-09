export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL' | 'UNAUTHORIZED';

export interface BurialRecord {
  id: string;
  receiptNo: string;
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
}

export interface NamePlateSubscription {
  id: string;
  burialId: string;
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
