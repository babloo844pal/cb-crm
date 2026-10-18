'use client';

import React, { useState } from 'react';
import { CustomerBooking, NamePlateSubscription, Location, RevenueStats } from '../lib/types';
import {
  CheckCircle2,
  Building2,
  ArrowRight,
  Tv,
  Send,
  UserPlus,
  Printer,
  X,
  HeartHandshake,
  TrendingUp,
  Clock,
} from 'lucide-react';

export type SubscriptionFilterPeriod =
  | 'ALL'
  | '1d'
  | '7d'
  | '15d'
  | '30d'
  | 'TODAY_ALLOTTED'
  | 'TODAY_RENEWED';

import { AppUser } from '../lib/types';

interface DashboardProps {
  bookings: CustomerBooking[];
  subscriptions: NamePlateSubscription[];
  locations: Location[];
  stats: RevenueStats;
  currentUser?: AppUser;
  setActiveTab: (tab: string) => void;
  onNavigateSubscriptions?: (filter: SubscriptionFilterPeriod) => void;
  onSelectLocationFromDashboard?: (locationId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  bookings,
  subscriptions,
  locations,
  stats,
  currentUser,
  setActiveTab,
  onNavigateSubscriptions,
  onSelectLocationFromDashboard,
}) => {
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<CustomerBooking | null>(null);

  const allottedToday = subscriptions.filter((s) => s.isAllottedToday).length;
  const renewedToday = subscriptions.filter((s) => s.isRenewedToday).length;

  const expiring1Day = subscriptions.filter((s) => s.daysUntilExpiry <= 1);
  const expiring7Days = subscriptions.filter((s) => s.daysUntilExpiry <= 7);
  const expiring15Days = subscriptions.filter((s) => s.daysUntilExpiry <= 15);
  const expiring30Days = subscriptions.filter((s) => s.daysUntilExpiry <= 30);

  const openSubscriptionsWithFilter = (period: SubscriptionFilterPeriod) => {
    if (onNavigateSubscriptions) {
      onNavigateSubscriptions(period);
    } else {
      setActiveTab('subscriptions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Action Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Branch Operations & Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
            Welcome to Peaceful Paws CRM
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Real-time overview of customer bookings, financial collections, grave plot occupancy, and annual ₹5,000 name plate renewals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className="min-h-[44px] px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl font-bold text-xs transition-all duration-200 shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Customer Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cinema-plots')}
            className="min-h-[44px] px-4 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#1E293B] border border-[#CBD5E1] rounded-xl font-bold text-xs transition-all duration-200 shadow-2xs flex items-center space-x-2 cursor-pointer"
          >
            <Tv className="w-4 h-4 text-[#2563EB]" />
            <span>Plot Map</span>
          </button>
        </div>
      </div>

      {/* Financial Collections Cards (Clickable) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
          Financial Collections Breakdown (Click card to inspect records)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today */}
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className="text-left bg-white/90 backdrop-blur-md border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-[#475569] font-semibold">
              <span>Today&apos;s Revenue</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold rounded-md text-[10px]">
                Today
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#1E293B] font-mono">
                ₹{stats.todayCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#2563EB] font-semibold mt-1.5 flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>Issue new customer booking</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>

          {/* 7 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('7d')}
            className="text-left bg-white/90 backdrop-blur-md border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-[#475569] font-semibold">
              <span>Last 7 Days Revenue</span>
              <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-blue-200 font-mono font-bold rounded-md text-[10px]">
                7 Days
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#1E293B] font-mono">
                ₹{stats.sevenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#2563EB] font-semibold mt-1.5 flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>View 7-day renewals</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>

          {/* 15 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('15d')}
            className="text-left bg-white/90 backdrop-blur-md border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-[#475569] font-semibold">
              <span>Last 15 Days Revenue</span>
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold rounded-md text-[10px]">
                15 Days
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#1E293B] font-mono">
                ₹{stats.fifteenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#2563EB] font-semibold mt-1.5 flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>View 15-day ledger</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>

          {/* 30 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('ALL')}
            className="text-left bg-white/90 backdrop-blur-md border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between text-xs text-[#475569] font-semibold">
              <span>Last 30 Days Revenue</span>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 font-mono font-bold rounded-md text-[10px]">
                30 Days
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#1E293B] font-mono">
                ₹{stats.thirtyDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#2563EB] font-semibold mt-1.5 flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>View monthly subscriptions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Subscription Expiry Forecast Cards (Clickable) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Name Plate Expiry & Renewal Forecast (Click card to filter & send WhatsApp reminder)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1 Day */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('1d')}
            className="text-left bg-rose-50/90 border border-rose-200 hover:border-rose-400 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
              <span>Expiring in Next 1 Day</span>
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md font-bold text-[10px]">
                Urgent
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-rose-950 font-mono">
                {expiring1Day.length}
              </div>
              <p className="text-xs text-rose-800 font-semibold mt-1.5 flex items-center">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Send WhatsApp payment link</span>
              </p>
            </div>
          </button>

          {/* 7 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('7d')}
            className="text-left bg-amber-50/90 border border-amber-200 hover:border-amber-400 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
              <span>Expiring in Next 7 Days</span>
              <span className="px-2 py-0.5 bg-amber-600 text-white rounded-md font-bold text-[10px]">
                High
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-amber-950 font-mono">
                {expiring7Days.length}
              </div>
              <p className="text-xs text-amber-800 font-semibold mt-1.5 flex items-center">
                <span>Inspect 7-day expiry list</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>

          {/* 15 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('15d')}
            className="text-left bg-sky-50/90 border border-sky-200 hover:border-sky-400 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-sky-900 font-bold">
              <span>Expiring in Next 15 Days</span>
              <span className="px-2 py-0.5 bg-sky-600 text-white rounded-md font-bold text-[10px]">
                Medium
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-sky-950 font-mono">
                {expiring15Days.length}
              </div>
              <p className="text-xs text-sky-800 font-semibold mt-1.5 flex items-center">
                <span>Inspect 15-day expiry list</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>

          {/* 30 Days */}
          <button
            type="button"
            onClick={() => openSubscriptionsWithFilter('30d')}
            className="text-left bg-emerald-50/90 border border-emerald-200 hover:border-emerald-400 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
              <span>Expiring in Next 30 Days</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md font-bold text-[10px]">
                Normal
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-emerald-950 font-mono">
                {expiring30Days.length}
              </div>
              <p className="text-xs text-emerald-800 font-semibold mt-1.5 flex items-center">
                <span>View 30-day projection</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Multi-Location Branches & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Location Branch Cards */}
        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-[#1E293B] text-sm flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>
                {currentUser?.role === 'MANAGER'
                  ? 'Assigned Branch Plot Occupancy'
                  : 'Branch Office Plot Occupancy (Click branch to open Plot Map)'}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('cinema-plots')}
              className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Open Plot Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentUser?.role === 'MANAGER'
              ? locations.filter((l) => l.id === currentUser.assignedLocationId)
              : locations
            ).map((loc) => {
              const locBookings = bookings.filter((b) => b.locationId === loc.id);
              const locRevenue = locBookings.reduce((sum, b) => sum + b.totalAmount, 0);
              const occPercent = Math.round((loc.occupiedPlots / loc.totalPlots) * 100);

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    if (onSelectLocationFromDashboard) {
                      onSelectLocationFromDashboard(loc.id);
                    }
                    setActiveTab('cinema-plots');
                  }}
                  className="text-left bg-[#F8FAFC] hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl p-4 space-y-3 cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-[#1E293B] text-xs">{loc.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{loc.address}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white text-[#2563EB] border border-[#CBD5E1] px-2 py-0.5 rounded-md shrink-0">
                      {loc.code}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-[#475569]">Grave Plot Occupancy</span>
                      <span className="font-bold text-[#1E293B] font-mono">
                        {loc.occupiedPlots} / {loc.totalPlots} ({occPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[10px]">Branch Revenue:</span>
                      <span className="font-bold text-[#1E293B] font-mono">
                        ₹{locRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB] flex items-center">
                      <span>Open Map</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Summary & Recent Customer Registrations */}
        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-[#1E293B] text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Today&apos;s Allotment & Renewal Tracker</span>
            </h3>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openSubscriptionsWithFilter('TODAY_ALLOTTED')}
              className="w-full text-left p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-all duration-200 shadow-2xs"
            >
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Name Plates Allotted Today
                </span>
                <span className="text-[11px] text-emerald-800">Click to view new allotments</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                {allottedToday}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openSubscriptionsWithFilter('TODAY_RENEWED')}
              className="w-full text-left p-3.5 bg-[#EFF6FF] border border-blue-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-all duration-200 shadow-2xs"
            >
              <div>
                <span className="text-xs font-bold text-[#1E293B] block">
                  Name Plates Renewed Today
                </span>
                <span className="text-[11px] text-[#2563EB]">Click to view today&apos;s renewals</span>
              </div>
              <span className="text-2xl font-extrabold text-[#2563EB] font-mono">
                {renewedToday}
              </span>
            </button>
          </div>

          {/* Recent Bookings Feed (Clickable) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
                Recent Registrations (Click for receipt)
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                + Add New
              </button>
            </div>

            <div className="space-y-2">
              {bookings.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedReceiptBooking(b)}
                  className="w-full text-left p-3 bg-[#F8FAFC] hover:bg-[#EFF6FF]/70 border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all duration-200 shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-[#1E293B] block">{b.customerName}</span>
                    <span className="text-[#64748B] block text-[11px]">
                      Pet: {b.petName} • Plot <strong className="font-mono">{b.plotNumber}</strong>
                    </span>
                  </div>
                  <span className="font-bold text-[#2563EB] font-mono">
                    ₹{b.totalAmount.toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Customer Booking Receipt Inspection Modal */}
      {selectedReceiptBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedReceiptBooking(null)}
              aria-label="Close receipt modal"
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-xl hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-[#E2E8F0] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-[#1E293B]">PEACEFUL PAWS MEMORIAL</h2>
              <p className="text-xs text-[#475569] font-semibold">
                {selectedReceiptBooking.locationName}
              </p>
              <div className="mt-2 text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] px-3 py-1 rounded-full inline-block font-bold">
                Receipt #{selectedReceiptBooking.receiptNo}
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs space-y-2.5 border border-[#E2E8F0]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Customer Name:</span>
                <span className="font-bold text-[#1E293B]">{selectedReceiptBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">WhatsApp Phone:</span>
                <span className="font-mono font-bold text-[#2563EB]">
                  {selectedReceiptBooking.whatsappNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Pet & Plot:</span>
                <span className="font-bold text-[#1E293B]">
                  {selectedReceiptBooking.petName} ({selectedReceiptBooking.petType}) •{' '}
                  <span className="font-mono">{selectedReceiptBooking.plotNumber}</span>
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0]">
                <span className="text-[#64748B] font-semibold">Total Paid:</span>
                <span className="font-extrabold text-emerald-700 font-mono text-sm">
                  ₹{selectedReceiptBooking.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 min-h-[44px] py-3 bg-[#1E293B] hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReceiptBooking(null);
                  setActiveTab('cinema-plots');
                }}
                className="flex-1 min-h-[44px] py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                View Plot Location Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
