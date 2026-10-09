'use client';

import React from 'react';
import { BurialRecord, NamePlateSubscription, AuditLog } from '../lib/types';
import { ShieldAlert, ShieldCheck, Receipt, AlertCircle, Plus, ScanLine, MapPin, IndianRupee, BellRing } from 'lucide-react';

interface DashboardProps {
  burials: BurialRecord[];
  subscriptions: NamePlateSubscription[];
  auditLogs: AuditLog[];
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  burials,
  subscriptions,
  auditLogs,
  setActiveTab,
}) => {
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const pendingRenewalSubs = subscriptions.filter((s) => s.status === 'PENDING_RENEWAL' || s.status === 'EXPIRED').length;
  const totalSubscriptionRevenue = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0);
  const totalBurialRevenue = burials.reduce((sum, b) => sum + b.serviceCharge, 0);
  const totalRevenue = totalSubscriptionRevenue + totalBurialRevenue;

  const flaggedAudits = auditLogs.filter((a) => a.statusResult === 'UNAUTHORIZED' || a.flaggedForRemoval);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Fraud Flagged */}
      {flaggedAudits.length > 0 && (
        <div className="bg-rose-900/40 border border-rose-600/50 rounded-xl p-4 flex items-center justify-between text-rose-200 shadow-sm animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600 rounded-lg text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-rose-100">Security Alert: {flaggedAudits.length} Unauthorized Installation(s) Detected</h3>
              <p className="text-xs text-rose-300">
                Ground supervisor flagged unverified name plates on plots without cleared payment records.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('audit-logs')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Inspect Audit Logs
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Burials Logged</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{burials.length}</div>
            <p className="text-xs text-emerald-400 mt-1">₹{totalBurialRevenue.toLocaleString('en-IN')} service revenue</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Name Plates</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{activeSubs}</div>
            <p className="text-xs text-blue-400 mt-1">₹5,000 / year recurring active</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Expirations</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400">{pendingRenewalSubs}</div>
            <p className="text-xs text-slate-400 mt-1">Requires renewal notification</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue Logged</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-indigo-400 mt-1">100% digital audit trace</p>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Operations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('booking')}
            className="flex items-center justify-center space-x-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Burial & Receipt</span>
          </button>
          <button
            onClick={() => setActiveTab('audit-scanner')}
            className="flex items-center justify-center space-x-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan & Verify Plate QR</span>
          </button>
          <button
            onClick={() => setActiveTab('plots')}
            className="flex items-center justify-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium text-sm transition shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore Plot Sector Map</span>
          </button>
        </div>
      </div>

      {/* Anti-Fraud Workflow Mechanism Visualizer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-emerald-400 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>How Anti-Fraud & Name Plate Automation Protects Business Revenue</span>
          </h3>
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full">
            Active Protection System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
            <div className="text-xs font-bold text-emerald-400 mb-1">STEP 1</div>
            <h4 className="font-semibold text-slate-200 text-sm">Digital Bill Gating</h4>
            <p className="text-xs text-slate-400 mt-1">
              Name Plate Work Order is locked until ₹5,000 payment is received & verified in the CRM.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
            <div className="text-xs font-bold text-emerald-400 mb-1">STEP 2</div>
            <h4 className="font-semibold text-slate-200 text-sm">QR Serial Token Tag</h4>
            <p className="text-xs text-slate-400 mt-1">
              System generates tamper-evident Serial Sticker (e.g. NPT-88901) & unique QR code printed on plate.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
            <div className="text-xs font-bold text-emerald-400 mb-1">STEP 3</div>
            <h4 className="font-semibold text-slate-200 text-sm">Mobile Ground Audit</h4>
            <p className="text-xs text-slate-400 mt-1">
              Supervisor scans plate QR code with phone camera. Green = VALID, Red = FRAUD / UNPAID.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
            <div className="text-xs font-bold text-emerald-400 mb-1">STEP 4</div>
            <h4 className="font-semibold text-slate-200 text-sm">Auto Annual Renewal</h4>
            <p className="text-xs text-slate-400 mt-1">
              Automated 1-year subscription tracker alerts pet owner for ₹5,000 renewal before expiry.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-200">Recent Name Plate Subscriptions</h3>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {subscriptions.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-200">{sub.petName} ({sub.ownerName})</div>
                  <div className="text-xs text-slate-400">
                    Tag: <span className="font-mono text-slate-300">{sub.tagSerial}</span> | {sub.plotSector} ({sub.plotNumber})
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                      sub.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : sub.status === 'EXPIRED'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                  <div className="text-xs text-slate-400 mt-0.5">Exp: {sub.expiryDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Feed */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-200">Ground Security Audit Logs</h3>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full Log History
            </button>
          </div>
          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-200 flex items-center space-x-2">
                    <span>Tag {log.tagSerial}</span>
                    <span className="text-xs text-slate-400">[{log.plotSector} {log.plotNumber}]</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Scanned by {log.scannedBy} at {log.scannedAt}
                  </div>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      log.statusResult === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {log.statusResult}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
