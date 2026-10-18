'use client';

import React, { useState } from 'react';
import { NamePlateSubscription, AuditLog, SubscriptionStatus } from '../lib/types';
import {
  ScanLine,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Zap,
  Clock,
  ArrowRight,
  Flag,
} from 'lucide-react';

interface AuditScannerProps {
  subscriptions: NamePlateSubscription[];
  onLogAudit: (log: AuditLog) => void;
  setActiveTab: (tab: string) => void;
}

export const AuditScanner: React.FC<AuditScannerProps> = ({
  subscriptions,
  onLogAudit,
  setActiveTab,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [sectorInput, setSectorInput] = useState('Sector A');
  const [plotInput, setPlotInput] = useState('A1-05');
  const [supervisorName] = useState('Vikram (Field Supervisor)');
  const [scanResult, setScanResult] = useState<{
    tagSerial: string;
    subscription?: NamePlateSubscription;
    statusResult: SubscriptionStatus;
    notes: string;
  } | null>(null);

  const [loggedAlert, setLoggedAlert] = useState(false);

  const handlePerformAudit = (tagToVerify?: string) => {
    const serial = (tagToVerify || tagInput).trim();
    if (!serial) return;

    const matchedSub = subscriptions.find(
      (s) => s.tagSerial.toLowerCase() === serial.toLowerCase()
    );

    let statusResult: SubscriptionStatus = 'UNAUTHORIZED';
    let notes =
      'UNAUTHORIZED / UNPAID: Tag serial is NOT registered in the cleared payment ledger. Flagged as unauthorized installation.';

    if (matchedSub) {
      statusResult = matchedSub.status;
      if (
        matchedSub.status === 'ACTIVE' ||
        matchedSub.status === 'ALLOTTED_TODAY' ||
        matchedSub.status === 'RENEWED_TODAY'
      ) {
        notes = `VALID & PAID: Annual subscription verified until ${matchedSub.expiryDate}. Registered to ${matchedSub.customerName}.`;
      } else if (matchedSub.status === 'EXPIRED' || matchedSub.daysUntilExpiry <= 7) {
        statusResult = 'EXPIRED';
        notes = `EXPIRING / RENEWAL DUE: Subscription expires on ${matchedSub.expiryDate}. Owner reminder required.`;
      } else {
        notes = `PENDING RENEWAL: Owner notified for annual ₹5,000 renewal.`;
      }
    }

    const resultObj = {
      tagSerial: serial,
      subscription: matchedSub,
      statusResult,
      notes,
    };

    setScanResult(resultObj);
    setLoggedAlert(false);

    const newLog: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      locationId: matchedSub ? matchedSub.locationId : 'LOC-1',
      tagSerial: serial,
      plotSector: matchedSub ? matchedSub.plotSector : sectorInput,
      plotNumber: matchedSub ? matchedSub.plotNumber : plotInput,
      scannedAt: new Date().toLocaleString('en-IN'),
      scannedBy: supervisorName,
      statusResult,
      petName: matchedSub ? matchedSub.petName : 'Unregistered / Unknown',
      actionTaken: notes,
      flaggedForRemoval: statusResult === 'UNAUTHORIZED',
    };

    onLogAudit(newLog);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Supervisor Ground Audit & QR Tag Verification
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Field verification tool to audit physical name plates against cleared ₹5,000 subscription records.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Test Scenarios Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#475569] uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Quick Field Verification Presets (Click to simulate scan):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setTagInput('NPT-88901');
              handlePerformAudit('NPT-88901');
            }}
            className="min-h-[56px] p-3.5 bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-start space-x-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs text-emerald-900 block">
                Valid Paid Tag (NPT-88901)
              </span>
              <span className="text-[11px] text-emerald-700">
                Active ₹5,000 paid subscription
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setTagInput('NPT-77123');
              handlePerformAudit('NPT-77123');
            }}
            className="min-h-[56px] p-3.5 bg-amber-50/70 hover:bg-amber-50 border border-amber-200 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-start space-x-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs text-amber-900 block">
                Expiring Tag (NPT-77123)
              </span>
              <span className="text-[11px] text-amber-700">
                Due for annual ₹5,000 renewal
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setTagInput('NPT-ILLEGAL-999');
              handlePerformAudit('NPT-ILLEGAL-999');
            }}
            className="min-h-[56px] p-3.5 bg-rose-50/70 hover:bg-rose-50 border border-rose-200 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-start space-x-2.5"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs text-rose-900 block">
                Unauthorized Tag (NPT-ILLEGAL)
              </span>
              <span className="text-[11px] text-rose-700">
                Unregistered plate without payment
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Manual Scanner Form */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center space-x-2">
          <Camera className="w-4 h-4 text-[#2563EB]" />
          <span>Manual Serial Tag or QR Code Entry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="audit-tag-serial"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Tag Serial Number (NPT-XXXXX)
            </label>
            <input
              id="audit-tag-serial"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. NPT-88901"
              className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#1E293B] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="audit-sector"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Plot Sector
            </label>
            <select
              id="audit-sector"
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Sector A">Sector A</option>
              <option value="Sector B">Sector B</option>
              <option value="Sector C">Sector C</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="audit-plot"
              className="block text-xs font-semibold text-[#1E293B] mb-1.5"
            >
              Ground Plot Number
            </label>
            <input
              id="audit-plot"
              type="text"
              value={plotInput}
              onChange={(e) => setPlotInput(e.target.value)}
              className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#1E293B] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => handlePerformAudit()}
          className="w-full min-h-[46px] py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
        >
          <ScanLine className="w-5 h-5" />
          <span>Verify Plate Authentication in Ledger</span>
        </button>
      </div>

      {/* Live Scan Verification Result Display Card */}
      {scanResult && (
        <div
          className={`border rounded-2xl p-5 sm:p-6 shadow-md space-y-4 transition-all duration-200 ${
            scanResult.statusResult === 'ACTIVE' ||
            scanResult.statusResult === 'ALLOTTED_TODAY' ||
            scanResult.statusResult === 'RENEWED_TODAY'
              ? 'bg-emerald-50/90 border-emerald-300'
              : scanResult.statusResult === 'EXPIRED'
              ? 'bg-amber-50/90 border-amber-300'
              : 'bg-rose-50/90 border-rose-300'
          }`}
        >
          {/* Status Badge Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-4 gap-3">
            <div className="flex items-center space-x-3.5">
              {scanResult.statusResult === 'ACTIVE' ||
              scanResult.statusResult === 'ALLOTTED_TODAY' ||
              scanResult.statusResult === 'RENEWED_TODAY' ? (
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              ) : scanResult.statusResult === 'EXPIRED' ? (
                <div className="p-2.5 bg-amber-600 text-white rounded-xl shrink-0">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              ) : (
                <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
                  <ShieldAlert className="w-7 h-7" />
                </div>
              )}

              <div>
                <span className="text-xs text-[#475569] font-mono font-semibold">
                  SCAN RESULT FOR TAG #{scanResult.tagSerial}
                </span>
                <h3
                  className={`text-lg sm:text-xl font-extrabold ${
                    scanResult.statusResult === 'ACTIVE' ||
                    scanResult.statusResult === 'ALLOTTED_TODAY' ||
                    scanResult.statusResult === 'RENEWED_TODAY'
                      ? 'text-emerald-900'
                      : scanResult.statusResult === 'EXPIRED'
                      ? 'text-amber-900'
                      : 'text-rose-900'
                  }`}
                >
                  {scanResult.statusResult === 'ACTIVE' ||
                  scanResult.statusResult === 'ALLOTTED_TODAY' ||
                  scanResult.statusResult === 'RENEWED_TODAY'
                    ? 'VERIFIED LEGITIMATE & PAID'
                    : scanResult.statusResult === 'EXPIRED'
                    ? 'SUBSCRIPTION RENEWAL REQUIRED'
                    : 'FRAUD ALERT: UNAUTHORIZED / UNPAID PLATE'}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono bg-white/90 border border-[#CBD5E1] px-3 py-1.5 rounded-full text-[#475569] inline-flex items-center space-x-1.5 self-start sm:self-center">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Audited: {new Date().toLocaleTimeString('en-IN')}</span>
            </span>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-2 shadow-2xs">
              <div className="font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-1.5">
                Database Ledger Record
              </div>
              {scanResult.subscription ? (
                <>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#64748B]">Pet Name:</span>
                    <span className="font-bold text-[#1E293B]">
                      {scanResult.subscription.petName}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#64748B]">Customer Name:</span>
                    <span className="font-bold text-[#1E293B]">
                      {scanResult.subscription.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#64748B]">Registered Plot:</span>
                    <span className="font-mono font-bold text-[#2563EB]">
                      {scanResult.subscription.plotSector} • {scanResult.subscription.plotNumber}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#64748B]">Valid Until:</span>
                    <span className="font-mono font-bold text-amber-700">
                      {scanResult.subscription.expiryDate}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-rose-800 space-y-1 py-1">
                  <p className="font-bold text-xs">NO VALID DATABASE RECORD FOUND</p>
                  <p className="text-xs text-[#475569]">
                    Serial tag <strong className="font-mono">{scanResult.tagSerial}</strong> does not
                    exist in the cleared payment ledger.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-2 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-1.5">
                  Audit Summary & Recommended Action
                </div>
                <p className="text-[#1E293B] mt-2 leading-relaxed">{scanResult.notes}</p>
              </div>
              {scanResult.subscription && (
                <button
                  type="button"
                  onClick={() => setActiveTab('subscriptions')}
                  className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center space-x-1 pt-2 cursor-pointer self-start"
                >
                  <span>Open in Subscriptions Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Flag & Malpractice Action */}
          {scanResult.statusResult === 'UNAUTHORIZED' && (
            <div className="bg-white border border-rose-300 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-rose-900 text-xs">
                  Staff Accountability & Removal Protocol
                </h4>
                <p className="text-xs text-[#475569] mt-0.5">
                  Flag this unauthorized plate for physical removal and log an internal branch audit alert.
                </p>
              </div>

              {!loggedAlert ? (
                <button
                  type="button"
                  onClick={() => setLoggedAlert(true)}
                  className="min-h-[42px] px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-xs inline-flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Flag Plate for Removal</span>
                </button>
              ) : (
                <span className="min-h-[40px] px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Flagged & Logged in Audit Ledger</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
