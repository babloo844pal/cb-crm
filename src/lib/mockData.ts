import { BurialRecord, NamePlateSubscription, AuditLog } from './types';

export const initialBurials: BurialRecord[] = [
  {
    id: 'BUR-1001',
    receiptNo: 'REC-2026-001',
    ownerName: 'Rajesh Sharma',
    ownerPhone: '+91 98765 43210',
    petName: 'Bruno',
    petSpecies: 'Dog',
    burialDate: '2025-11-15',
    plotSector: 'Sector A',
    plotNumber: 'A-12',
    serviceCharge: 12000,
    hasNamePlate: true,
    notes: 'Premium wooden casket & 1-Year Name Plate'
  },
  {
    id: 'BUR-1002',
    receiptNo: 'REC-2026-002',
    ownerName: 'Priya Verma',
    ownerPhone: '+91 98123 45678',
    petName: 'Whiskers',
    petSpecies: 'Cat',
    burialDate: '2024-10-10',
    plotSector: 'Sector A',
    plotNumber: 'A-15',
    serviceCharge: 8000,
    hasNamePlate: true,
    notes: 'Standard burial with Name Plate'
  },
  {
    id: 'BUR-1003',
    receiptNo: 'REC-2026-003',
    ownerName: 'Amit Patel',
    ownerPhone: '+91 99887 76655',
    petName: 'Max',
    petSpecies: 'Dog',
    burialDate: '2026-02-01',
    plotSector: 'Sector B',
    plotNumber: 'B-04',
    serviceCharge: 10000,
    hasNamePlate: true,
    notes: 'Burial with 1-Year Name Plate'
  },
  {
    id: 'BUR-1004',
    receiptNo: 'REC-2026-004',
    ownerName: 'Sneha Roy',
    ownerPhone: '+91 97654 32109',
    petName: 'Coco',
    petSpecies: 'Bird',
    burialDate: '2026-05-20',
    plotSector: 'Sector B',
    plotNumber: 'B-08',
    serviceCharge: 5000,
    hasNamePlate: false,
    notes: 'Basic Burial service only'
  },
  {
    id: 'BUR-1005',
    receiptNo: 'REC-2026-005',
    ownerName: 'Venkatesh Rao',
    ownerPhone: '+91 91234 56789',
    petName: 'Rocky',
    petSpecies: 'Dog',
    burialDate: '2025-10-25',
    plotSector: 'Sector C',
    plotNumber: 'C-02',
    serviceCharge: 11000,
    hasNamePlate: true,
    notes: 'Burial + Name Plate'
  }
];

export const initialSubscriptions: NamePlateSubscription[] = [
  {
    id: 'SUB-2001',
    burialId: 'BUR-1001',
    tagSerial: 'NPT-88901',
    petName: 'Bruno',
    ownerName: 'Rajesh Sharma',
    ownerPhone: '+91 98765 43210',
    plotSector: 'Sector A',
    plotNumber: 'A-12',
    amountPaid: 5000,
    startDate: '2025-11-15',
    expiryDate: '2026-11-15',
    status: 'ACTIVE',
    workOrderIssued: true,
    installedBy: 'Suresh (Ground Staff)',
    installationDate: '2025-11-16'
  },
  {
    id: 'SUB-2002',
    burialId: 'BUR-1002',
    tagSerial: 'NPT-77123',
    petName: 'Whiskers',
    ownerName: 'Priya Verma',
    ownerPhone: '+91 98123 45678',
    plotSector: 'Sector A',
    plotNumber: 'A-15',
    amountPaid: 5000,
    startDate: '2024-10-10',
    expiryDate: '2025-10-10',
    status: 'EXPIRED',
    workOrderIssued: true,
    installedBy: 'Ramesh (Ground Staff)',
    installationDate: '2024-10-11'
  },
  {
    id: 'SUB-2003',
    burialId: 'BUR-1003',
    tagSerial: 'NPT-99452',
    petName: 'Max',
    ownerName: 'Amit Patel',
    ownerPhone: '+91 99887 76655',
    plotSector: 'Sector B',
    plotNumber: 'B-04',
    amountPaid: 5000,
    startDate: '2026-02-01',
    expiryDate: '2027-02-01',
    status: 'ACTIVE',
    workOrderIssued: true,
    installedBy: 'Suresh (Ground Staff)',
    installationDate: '2026-02-02'
  },
  {
    id: 'SUB-2005',
    burialId: 'BUR-1005',
    tagSerial: 'NPT-66321',
    petName: 'Rocky',
    ownerName: 'Venkatesh Rao',
    ownerPhone: '+91 91234 56789',
    plotSector: 'Sector C',
    plotNumber: 'C-02',
    amountPaid: 5000,
    startDate: '2025-10-25',
    expiryDate: '2026-10-25',
    status: 'PENDING_RENEWAL',
    workOrderIssued: true,
    installedBy: 'Mukesh (Ground Staff)',
    installationDate: '2025-10-26'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'AUD-501',
    tagSerial: 'NPT-88901',
    plotSector: 'Sector A',
    plotNumber: 'A-12',
    scannedAt: '2026-10-08 11:30 AM',
    scannedBy: 'Vikram (Manager)',
    statusResult: 'ACTIVE',
    petName: 'Bruno',
    actionTaken: 'Verified Legit - No action needed'
  },
  {
    id: 'AUD-502',
    tagSerial: 'NPT-UNKNOWN-999',
    plotSector: 'Sector C',
    plotNumber: 'C-09',
    scannedAt: '2026-10-09 09:15 AM',
    scannedBy: 'Vikram (Manager)',
    statusResult: 'UNAUTHORIZED',
    petName: 'Unknown / Fake Plate',
    actionTaken: 'Flagged Illegal Installation - Staff Warning Issued',
    flaggedForRemoval: true
  }
];
