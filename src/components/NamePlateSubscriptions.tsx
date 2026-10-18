'use client';

import React, { useState, useEffect } from 'react';
import { NamePlateSubscription } from '../lib/types';
import { SubscriptionFilterPeriod } from './Dashboard';
import { Tag, Send, RefreshCw, Search, CheckCircle2, X } from 'lucide-react';

interface NamePlateSubscriptionsProps {
  subscriptions: NamePlateSubscription[];
  onRenew: (subId: string) => void;
  initialFilterPeriod?: SubscriptionFilterPeriod;
  globalSearchTerm?: string;
}

export const NamePlateSubscriptions: React.FC<NamePlateSubscriptionsProps> = ({
  subscriptions,
  onRenew,
  initialFilterPeriod = 'ALL',
  globalSearchTerm = '',
}) => {
  const [filterPeriod, setFilterPeriod] = useState<SubscriptionFilterPeriod>(initialFilterPeriod);
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm);
  const [sentWhatsappId, setSentWhatsappId] = useState<string | null>(null);

  useEffect(() => {
    setFilterPeriod(initialFilterPeriod);
  }, [initialFilterPeriod]);

  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const filtered = subscriptions.filter((sub) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sub.petName.toLowerCase().includes(q) ||
      sub.customerName.toLowerCase().includes(q) ||
      sub.tagSerial.toLowerCase().includes(q) ||
      sub.plotNumber.toLowerCase().includes(q);

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
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Name Plate Subscriptions & Expiry Hub
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Track annual ₹5,000 name plate subscriptions, send 1-click WhatsApp reminders, and process renewals.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Tabs */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Subscription expiry filters">
          {[
            { id: 'ALL', label: 'All Subscriptions' },
            { id: '1d', label: 'Expiring 1 Day' },
            { id: '7d', label: 'Expiring 7 Days' },
            { id: '15d', label: 'Expiring 15 Days' },
            { id: '30d', label: 'Expiring 30 Days' },
            { id: 'TODAY_ALLOTTED', label: 'Allotted Today' },
            { id: 'TODAY_RENEWED', label: 'Renewed Today' },
          ].map((tab) => {
            const isSelected = filterPeriod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFilterPeriod(tab.id as SubscriptionFilterPeriod)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by customer, pet, tag..."
            aria-label="Filter subscriptions by customer, pet, or tag"
            className="w-full min-h-[40px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear filter"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="p-4">Serial Tag & Pet</th>
                <th className="p-4">Customer & WhatsApp</th>
                <th className="p-4">Plot Location</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B] text-xs">
                    No subscriptions match the selected filter.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setFilterPeriod('ALL');
                        setSearchTerm('');
                      }}
                      className="text-[#2563EB] font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1E293B] text-sm">{sub.petName}</div>
                      <div className="font-mono text-[#2563EB] font-bold text-[11px]">
                        {sub.tagSerial}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#1E293B]">{sub.customerName}</div>
                      <div className="text-[#64748B] text-[11px] font-mono">{sub.whatsappNumber}</div>
                    </td>

                    <td className="p-4 font-bold text-[#475569] font-mono">
                      {sub.plotSector} • {sub.plotNumber}
                    </td>

                    <td className="p-4 font-mono font-bold text-amber-800">
                      {sub.expiryDate}
                      <span className="block text-[10px] text-[#64748B] font-sans font-medium">
                        ({sub.daysUntilExpiry} days remaining)
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.isAllottedToday
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : sub.isRenewedToday
                            ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                            : sub.daysUntilExpiry <= 7
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendWhatsappReminder(sub)}
                          className="min-h-[38px] px-3 py-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] border border-blue-200 rounded-xl font-bold text-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                        >
                          {sentWhatsappId === sub.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Link Opened</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>WhatsApp Link</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onRenew(sub.id)}
                          className="min-h-[38px] px-3 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl font-bold text-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Renew ₹5,000</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
