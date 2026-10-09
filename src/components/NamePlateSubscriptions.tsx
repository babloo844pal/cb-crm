'use client';

import React, { useState } from 'react';
import { NamePlateSubscription } from '../lib/types';
import { Tag, Calendar, Send, RefreshCw, Search, CheckCircle, Clock, Filter, Phone, IndianRupee } from 'lucide-react';

interface NamePlateSubscriptionsProps {
  subscriptions: NamePlateSubscription[];
  onRenew: (subId: string) => void;
}

export const NamePlateSubscriptions: React.FC<NamePlateSubscriptionsProps> = ({ subscriptions, onRenew }) => {
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | '1d' | '7d' | '15d' | '30d' | 'TODAY_ALLOTTED' | 'TODAY_RENEWED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sentWhatsappId, setSentWhatsappId] = useState<string | null>(null);

  const filtered = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.tagSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterPeriod === '1d') matchesFilter = sub.daysUntilExpiry <= 1;
    if (filterPeriod === '7d') matchesFilter = sub.daysUntilExpiry <= 7;
    if (filterPeriod === '15d') matchesFilter = sub.daysUntilExpiry <= 15;
    if (filterPeriod === '30d') matchesFilter = sub.daysUntilExpiry <= 30;
    if (filterPeriod === 'TODAY_ALLOTTED') matchesFilter = !!sub.isAllottedToday;
    if (filterPeriod === 'TODAY_RENEWED') matchesFilter = !!sub.isRenewedToday;

    return matchesSearch && matchesFilter;
  });

  const handleSendWhatsappReminder = (sub: NamePlateSubscription) => {
    setSentWhatsappId(sub.id);
    const msg = `Dear ${sub.customerName}, your Name Plate Subscription for ${sub.petName} (Plot ${sub.plotNumber}) expires on ${sub.expiryDate}. Please renew ₹5,000 via WhatsApp link: https://cb-crm.internal/pay?sub=${sub.id}`;
    const url = `https://wa.me/${sub.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setTimeout(() => setSentWhatsappId(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Name Plate Subscriptions & Expiry Hub</h2>
            <p className="text-xs text-slate-500">
              Track annual ₹5,000 subscriptions, send 1-click WhatsApp reminders, and process renewals.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center space-x-1">
          {[
            { id: 'ALL', label: 'All Subscriptions' },
            { id: '1d', label: 'Expiring 1 Day' },
            { id: '7d', label: 'Expiring 7 Days' },
            { id: '15d', label: 'Expiring 15 Days' },
            { id: '30d', label: 'Expiring 30 Days' },
            { id: 'TODAY_ALLOTTED', label: 'Allotted Today' },
            { id: 'TODAY_RENEWED', label: 'Renewed Today' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                filterPeriod === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by customer, pet, tag..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Serial Tag & Pet</th>
                <th className="p-4">Customer & WhatsApp</th>
                <th className="p-4">Plot Location</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status Badge</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 text-sm">{sub.petName}</div>
                    <div className="font-mono text-emerald-600 font-extrabold text-[11px]">
                      {sub.tagSerial}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-800">{sub.customerName}</div>
                    <div className="text-slate-500 text-[11px] font-mono">{sub.whatsappNumber}</div>
                  </td>

                  <td className="p-4 font-bold text-slate-700">
                    {sub.plotSector} ({sub.plotNumber})
                  </td>

                  <td className="p-4 font-mono font-bold text-amber-700">
                    {sub.expiryDate}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({sub.daysUntilExpiry} days left)
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        sub.isAllottedToday
                          ? 'bg-purple-100 text-purple-800'
                          : sub.isRenewedToday
                          ? 'bg-indigo-100 text-indigo-800'
                          : sub.daysUntilExpiry <= 7
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sub.isAllottedToday
                        ? 'Allotted Today'
                        : sub.isRenewedToday
                        ? 'Renewed Today'
                        : sub.daysUntilExpiry <= 7
                        ? 'Expiring Soon'
                        : 'Active'}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleSendWhatsappReminder(sub)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-extrabold text-xs transition inline-flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Link</span>
                    </button>

                    <button
                      onClick={() => onRenew(sub.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs transition inline-flex items-center space-x-1"
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
