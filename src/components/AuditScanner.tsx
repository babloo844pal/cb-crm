'use client';

import React, { useState } from 'react';
import { NamePlateSubscription, AuditLog, SubscriptionStatus } from '../lib/types';
import { ScanLine, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Camera, Search, User, MapPin, Tag } from 'lucide-react';

interface AuditScannerProps {
  subscriptions: NamePlateSubscription[];
  onLogAudit: (log: AuditLog) => void;
  setActiveTab: (tab: string) => void;
}

export const AuditScanner: React.FC<AuditScannerProps> = ({ subscriptions, onLogAudit, setActiveTab }) => {
  const [tagInput, setTagInput] = useState('');
  const [sectorInput, setSectorInput] = useState('Sector A');
  const [plotInput, setPlotInput] = useState('A-12');
  const [supervisorName, setSupervisorName] = useState('Vikram (Field Supervisor)');
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

    // Search subscription records
    const matchedSub = subscriptions.find((s) => s.tagSerial.toLowerCase() === serial.toLowerCase());

    let statusResult: SubscriptionStatus = 'UNAUTHORIZED';
    let notes = 'UNAUTHORIZED / UNPAID: Tag serial is NOT registered in database. Flagged as illegal staff installation.';

    if (matchedSub) {
      statusResult = matchedSub.status;
      if (matchedSub.status === 'ACTIVE') {
        notes = `VALID & PAID: Subscription valid until ${matchedSub.expiryDate}. Installed by ${matchedSub.installedBy || 'Authorized Staff'}.`;
      } else if (matchedSub.status === 'EXPIRED') {
        notes = `EXPIRED SUBSCRIPTION: Subscription expired on ${matchedSub.expiryDate}. Plate requires payment renewal or removal.`;
      } else {
        notes = `PENDING RENEWAL: Owner notified for renewal.`;
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

    // Automatically record in audit log
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      tagSerial: serial,
      plotSector: matchedSub ? matchedSub.plotSector : sectorInput,
      plotNumber: matchedSub ? matchedSub.plotNumber : plotInput,
      scannedAt: new Date().toLocaleString(),
      scannedBy: supervisorName,
      statusResult,
      petName: matchedSub ? matchedSub.petName : 'Unregistered / Unknown',
      actionTaken: notes,
      flaggedForRemoval: statusResult === 'UNAUTHORIZED',
    };

    onLogAudit(newLog);
  };

  const handleFlagForRemoval = () => {
    setLoggedAlert(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-inner">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Supervisor Ground Audit & QR Verification</h2>
            <p className="text-xs text-slate-400">
              Field verification tool to detect unauthorized name plates placed by staff without cleared payments.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Test Scenarios Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          ⚡ Quick Demo Scenarios (Click to test verification):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setTagInput('NPT-88901');
              handlePerformAudit('NPT-88901');
            }}
            className="p-3 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 text-emerald-200 rounded-lg text-xs font-medium text-left transition"
          >
            <span className="font-bold text-emerald-400 block">🟢 Test Valid Tag (NPT-88901)</span>
            <span className="text-[11px] text-slate-400">Active ₹5,000 paid subscription</span>
          </button>

          <button
            onClick={() => {
              setTagInput('NPT-77123');
              handlePerformAudit('NPT-77123');
            }}
            className="p-3 bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900/60 text-amber-200 rounded-lg text-xs font-medium text-left transition"
          >
            <span className="font-bold text-amber-400 block">🟡 Test Expired Tag (NPT-77123)</span>
            <span className="text-[11px] text-slate-400">Expired subscription, pending renewal</span>
          </button>

          <button
            onClick={() => {
              setTagInput('NPT-ILLEGAL-999');
              handlePerformAudit('NPT-ILLEGAL-999');
            }}
            className="p-3 bg-rose-950/60 border border-rose-700/60 hover:bg-rose-900/60 text-rose-200 rounded-lg text-xs font-medium text-left transition animate-pulse"
          >
            <span className="font-bold text-rose-400 block">🔴 Test Unauthorized Tag (NPT-ILLEGAL)</span>
            <span className="text-[11px] text-slate-400">Fake plate mounted without payment</span>
          </button>
        </div>
      </div>

      {/* Manual Scanner Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <Camera className="w-4 h-4 text-indigo-400" />
          <span>Field Scan or Serial Tag Entry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tag Serial Number (NPT-XXXXX)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. NPT-88901"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Plot Sector</label>
            <select
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Sector A">Sector A</option>
              <option value="Sector B">Sector B</option>
              <option value="Sector C">Sector C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Plot #</label>
            <input
              type="text"
              value={plotInput}
              onChange={(e) => setPlotInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={() => handlePerformAudit()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center space-x-2"
        >
          <ScanLine className="w-5 h-5" />
          <span>Verify Plate Authentication in System</span>
        </button>
      </div>

      {/* Live Scan Verification Result Display Card */}
      {scanResult && (
        <div
          className={`border rounded-2xl p-6 shadow-xl space-y-4 transition-all ${
            scanResult.statusResult === 'ACTIVE'
              ? 'bg-emerald-950/40 border-emerald-600'
              : scanResult.statusResult === 'EXPIRED'
              ? 'bg-amber-950/40 border-amber-600'
              : 'bg-rose-950/40 border-rose-600'
          }`}
        >
          {/* Status Badge Banner */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              {scanResult.statusResult === 'ACTIVE' ? (
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              ) : scanResult.statusResult === 'EXPIRED' ? (
                <div className="p-2 bg-amber-600 text-white rounded-xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              ) : (
                <div className="p-2 bg-rose-600 text-white rounded-xl animate-bounce">
                  <ShieldAlert className="w-8 h-8" />
                </div>
              )}

              <div>
                <span className="text-xs text-slate-400 font-mono">SCAN RESULT FOR TAG #{scanResult.tagSerial}</span>
                <h3
                  className={`text-xl font-extrabold ${
                    scanResult.statusResult === 'ACTIVE'
                      ? 'text-emerald-400'
                      : scanResult.statusResult === 'EXPIRED'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scanResult.statusResult === 'ACTIVE'
                    ? '🟢 VERIFIED LEGITIMATE & PAID'
                    : scanResult.statusResult === 'EXPIRED'
                    ? '🟡 SUBSCRIPTION EXPIRED'
                    : '🔴 FRAUD ALERT: UNAUTHORIZED / UNPAID PLATE'}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
              Audit Time: {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">DATABASE RECORD</div>
              {scanResult.subscription ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pet Name:</span>
                    <span className="font-bold text-slate-100">{scanResult.subscription.petName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Name:</span>
                    <span className="font-bold text-slate-100">{scanResult.subscription.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Plot:</span>
                    <span className="font-mono text-emerald-400">
                      {scanResult.subscription.plotSector} - {scanResult.subscription.plotNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valid Until:</span>
                    <span className="font-mono text-amber-400">{scanResult.subscription.expiryDate}</span>
                  </div>
                </>
              ) : (
                <div className="text-rose-300 space-y-1">
                  <p className="font-bold text-xs">NO VALID DATABASE RECORD FOUND</p>
                  <p className="text-[11px] text-slate-400">
                    Serial tag #{scanResult.tagSerial} does not exist in cleared payment ledger.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">AUDIT SUMMARY & ACTION</div>
              <p className="text-slate-300">{scanResult.notes}</p>
            </div>
          </div>

          {/* Flag & Malpractice Action */}
          {scanResult.statusResult === 'UNAUTHORIZED' && (
            <div className="bg-rose-950 border border-rose-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-rose-200 text-xs">Staff Malpractice Action Protocol</h4>
                <p className="text-[11px] text-rose-300">
                  Flag this plate for physical removal and trigger internal staff accountability review.
                </p>
              </div>

              {!loggedAlert ? (
                <button
                  onClick={handleFlagForRemoval}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow"
                >
                  Flag Plate for Removal & Report Malpractice
                </button>
              ) : (
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg">
                  ✓ Flagged & Logged in Audit System
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
