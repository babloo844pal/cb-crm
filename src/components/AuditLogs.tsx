'use client';

import React, { useState } from 'react';
import { AuditLog } from '../lib/types';
import { AlertTriangle, ShieldCheck, ShieldAlert, Trash2, Filter } from 'lucide-react';

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ auditLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType === 'UNAUTHORIZED') return log.statusResult === 'UNAUTHORIZED';
    if (filterType === 'VALID') return log.statusResult === 'ACTIVE';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-600 text-white rounded-xl shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Security Audit & Anti-Fraud Logs</h2>
            <p className="text-xs text-slate-400">
              Immutable ledger of field supervisor QR scans and flagged staff malpractice cases.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 space-x-1">
          {['ALL', 'UNAUTHORIZED', 'VALID'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterType === f
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'UNAUTHORIZED' ? '🔴 Flagged Malpractice' : f === 'VALID' ? '🟢 Verified Valid' : 'All Scans'}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Scan Time & Supervisor</th>
                <th className="p-4">Tag Serial</th>
                <th className="p-4">Plot Location</th>
                <th className="p-4">Verification Result</th>
                <th className="p-4">Action Taken / Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{log.scannedAt}</div>
                    <div className="text-slate-400 text-[11px]">By: {log.scannedBy}</div>
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-200">
                    {log.tagSerial}
                  </td>

                  <td className="p-4 font-medium text-slate-300">
                    {log.plotSector} ({log.plotNumber})
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        log.statusResult === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                      }`}
                    >
                      {log.statusResult === 'ACTIVE' ? '🟢 VERIFIED VALID' : '🔴 UNAUTHORIZED / UNPAID'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-300 font-medium">{log.actionTaken}</div>
                    {log.flaggedForRemoval && (
                      <span className="inline-flex items-center space-x-1 mt-1 text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded">
                        <Trash2 className="w-3 h-3" />
                        <span>Flagged for Physical Removal</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
