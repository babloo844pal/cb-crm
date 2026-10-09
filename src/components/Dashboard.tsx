'use client';

import React from 'react';
import { CustomerBooking, NamePlateSubscription, Location, RevenueStats } from '../lib/types';
import {
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building,
  ArrowUpRight,
  Tv,
  Send,
  Plus,
} from 'lucide-react';

interface DashboardProps {
  bookings: CustomerBooking[];
  subscriptions: NamePlateSubscription[];
  locations: Location[];
  stats: RevenueStats;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  bookings,
  subscriptions,
  locations,
  stats,
  setActiveTab,
}) => {
  const allottedToday = subscriptions.filter((s) => s.isAllottedToday).length;
  const renewedToday = subscriptions.filter((s) => s.isRenewedToday).length;

  const expiring1Day = subscriptions.filter((s) => s.daysUntilExpiry <= 1);
  const expiring7Days = subscriptions.filter((s) => s.daysUntilExpiry <= 7);
  const expiring15Days = subscriptions.filter((s) => s.daysUntilExpiry <= 15);
  const expiring30Days = subscriptions.filter((s) => s.daysUntilExpiry <= 30);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider text-emerald-100">
            Executive Operations Dashboard
          </span>
          <h2 className="text-2xl font-black mt-2">Peaceful Paws CRM & Name Plate Automation</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Real-time financial collections, Cinema Hall grave plot mapping, and automated annual subscription renewals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-extrabold text-xs transition shadow-md flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>New Customer Booking</span>
          </button>
          <button
            onClick={() => setActiveTab('cinema-plots')}
            className="px-4 py-2.5 bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-400/40 rounded-xl font-extrabold text-xs transition shadow-md flex items-center space-x-2"
          >
            <Tv className="w-4 h-4 text-emerald-300" />
            <span>Cinema Plot Map</span>
          </button>
        </div>
      </div>

      {/* Financial Revenue Collections Breakdown Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
          <IndianRupee className="w-4 h-4 text-emerald-600" />
          <span>Financial Collections Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Today's Collection</span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">Today</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                ₹{stats.todayCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {allottedToday} Name Plates Allotted Today
              </p>
            </div>
          </div>

          {/* 7 Days */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Last 7 Days Collection</span>
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">7 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                ₹{stats.sevenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Aggregated bookings & renewals</p>
            </div>
          </div>

          {/* 15 Days */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Last 15 Days Collection</span>
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">15 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                ₹{stats.fifteenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Mid-month cumulative ledger</p>
            </div>
          </div>

          {/* 30 Days */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Last 30 Days Collection</span>
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">30 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                ₹{stats.thirtyDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Monthly total revenue stream</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Renewal & Expiry Alert Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Name Plate Expiry & Renewal Forecast</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Next 1 Day */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-rose-50 border border-rose-200 rounded-2xl p-5 cursor-pointer hover:bg-rose-100/80 transition shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs text-rose-800 font-extrabold">
              <span>Expiring in Next 1 Day</span>
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold animate-pulse text-[10px]">
                Urgent
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-rose-900">{expiring1Day.length}</div>
              <p className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center">
                <Send className="w-3 h-3 mr-1" />
                Click to send WhatsApp alert
              </p>
            </div>
          </div>

          {/* Next 7 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 cursor-pointer hover:bg-amber-100/80 transition shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs text-amber-800 font-extrabold">
              <span>Expiring in Next 7 Days</span>
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded font-bold text-[10px]">
                High
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-amber-900">{expiring7Days.length}</div>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Requires renewal notice</p>
            </div>
          </div>

          {/* Next 15 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-sky-50 border border-sky-200 rounded-2xl p-5 cursor-pointer hover:bg-sky-100/80 transition shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs text-sky-800 font-extrabold">
              <span>Expiring in Next 15 Days</span>
              <span className="px-2 py-0.5 bg-sky-600 text-white rounded font-bold text-[10px]">
                Medium
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-sky-900">{expiring15Days.length}</div>
              <p className="text-[11px] text-sky-700 font-medium mt-1">Upcoming renewal list</p>
            </div>
          </div>

          {/* Next 30 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 cursor-pointer hover:bg-emerald-100/80 transition shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs text-emerald-800 font-extrabold">
              <span>Expiring in Next 30 Days</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">
                Normal
              </span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-emerald-900">{expiring30Days.length}</div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">30-day projection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Location Performance & Cinema Plot Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Multi-Location Branch Performance</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">{locations.length} Active Branches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => {
              const locBookings = bookings.filter((b) => b.locationId === loc.id);
              const locRevenue = locBookings.reduce((sum, b) => sum + b.totalAmount, 0);
              const occPercent = Math.round((loc.occupiedPlots / loc.totalPlots) * 100);

              return (
                <div key={loc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                      <p className="text-[11px] text-slate-500">{loc.address}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {loc.code}
                    </span>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">Grave Plot Occupancy</span>
                      <span className="font-bold text-slate-900">
                        {loc.occupiedPlots} / {loc.totalPlots} ({occPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${occPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Branch Revenue:</span>
                      <span className="font-extrabold text-slate-900">₹{locRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('cinema-plots')}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold text-[11px] transition flex items-center space-x-1"
                    >
                      <span>Plot Map</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Allotment & Renewal Tracker */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Today's Activity Summary</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Name Plates Allotted Today</span>
                <span className="text-[11px] text-emerald-700">New 1-year subscriptions created</span>
              </div>
              <span className="text-2xl font-black text-emerald-950">{allottedToday}</span>
            </div>

            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900 block">Name Plates Renewed Today</span>
                <span className="text-[11px] text-indigo-700">Existing subscriptions extended +1 yr</span>
              </div>
              <span className="text-2xl font-black text-indigo-950">{renewedToday}</span>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recent Customer Registrations</h4>
            <div className="space-y-2">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{b.customerName}</span>
                    <span className="text-slate-500 block text-[11px]">Pet: {b.petName} ({b.plotNumber})</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
