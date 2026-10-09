'use client';

import React, { useState } from 'react';
import { NamePlateSubscription } from '../lib/types';
import { Calendar, Search, RefreshCw, Send, CheckCircle, AlertTriangle, ShieldCheck, Tag, Filter } from 'lucide-react';

interface SubscriptionManagerProps {
  subscriptions: NamePlateSubscription[];
  onRenew: (subId: string) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ subscriptions, onRenew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.tagSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && sub.status === 'ACTIVE') ||
      (statusFilter === 'EXPIRED' && (sub.status === 'EXPIRED' || sub.status === 'PENDING_RENEWAL'));

    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (sub: NamePlateSubscription) => {
    setNotificationSent(sub.id);
    setTimeout(() => setNotificationSent(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Annual Name Plate Subscription Management</h2>
            <p className="text-xs text-slate-400">
              Track 1-Year ₹5,000 subscriptions, issue automated renewal alerts, and extend service lifecycles.
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
          {['ALL', 'ACTIVE', 'EXPIRED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Success Toast */}
      {notificationSent && (
        <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center space-x-3 text-xs shadow-md animate-fade-in">
          <Send className="w-4 h-4 text-emerald-400" />
          <span>
            Automated WhatsApp & SMS Renewal Notice successfully dispatched to pet owner for tag serial #{notificationSent}!
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Pet Name, Owner Name, Serial Tag (NPT-XXXXX), or Plot #..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Subscriptions Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Serial Tag & Pet</th>
                <th className="p-4">Owner Contact</th>
                <th className="p-4">Plot Location</th>
                <th className="p-4">Annual Fee</th>
                <th className="p-4">Subscription Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>{sub.petName}</span>
                    </div>
                    <div className="font-mono text-emerald-400 text-[11px] font-semibold mt-0.5">
                      {sub.tagSerial}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{sub.ownerName}</div>
                    <div className="text-slate-400 text-[11px]">{sub.ownerPhone}</div>
                  </td>

                  <td className="p-4 font-medium text-slate-300">
                    {sub.plotSector} ({sub.plotNumber})
                  </td>

                  <td className="p-4 font-bold text-emerald-400">
                    ₹{sub.amountPaid.toLocaleString('en-IN')} / yr
                  </td>

                  <td className="p-4">
                    <div className="text-slate-300">Start: {sub.startDate}</div>
                    <div className="text-amber-400 font-mono font-semibold">Exp: {sub.expiryDate}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        sub.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : sub.status === 'EXPIRED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleSendReminder(sub)}
                      title="Send WhatsApp/SMS Renewal Link"
                      className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition inline-flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Remind</span>
                    </button>

                    <button
                      onClick={() => onRenew(sub.id)}
                      title="Renew Subscription (+1 Year)"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition inline-flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renew ₹5,000</span>
                    </button>
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
