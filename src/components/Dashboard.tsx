'use client';

import React, { useState } from 'react';
import { CustomerBooking, NamePlateSubscription, Location, RevenueStats } from '../lib/types';
import {
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle,
  Building,
  ArrowRight,
  Tv,
  Send,
  Plus,
  Tag,
  Receipt,
  UserPlus,
  ShieldCheck,
  Package,
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
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<CustomerBooking | null>(null);

  const allottedToday = subscriptions.filter((s) => s.isAllottedToday).length;
  const renewedToday = subscriptions.filter((s) => s.isRenewedToday).length;

  const expiring1Day = subscriptions.filter((s) => s.daysUntilExpiry <= 1);
  const expiring7Days = subscriptions.filter((s) => s.daysUntilExpiry <= 7);
  const expiring15Days = subscriptions.filter((s) => s.daysUntilExpiry <= 15);
  const expiring30Days = subscriptions.filter((s) => s.daysUntilExpiry <= 30);

  return (
    <div className="space-y-6">
      {/* Top Welcome Action Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Welcome to Peaceful Paws CRM
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Overview of customer bookings, financial collections, Cinema Hall plot maps, and annual subscriptions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Customer Booking</span>
          </button>
          <button
            onClick={() => setActiveTab('cinema-plots')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-semibold text-xs transition shadow-2xs flex items-center space-x-2 cursor-pointer"
          >
            <Tv className="w-4 h-4 text-slate-600" />
            <span>Cinema Plot Map</span>
          </button>
        </div>
      </div>

      {/* Financial Collections Cards (Clickable) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Financial Collections Breakdown (Click to view records)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today */}
          <div
            onClick={() => setActiveTab('booking')}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Today's Revenue</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">Today</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.todayCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                <span>Click to issue new booking</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
              </p>
            </div>
          </div>

          {/* 7 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Last 7 Days Revenue</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[10px]">7 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.sevenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                <span>View subscription renewals</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
              </p>
            </div>
          </div>

          {/* 15 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Last 15 Days Revenue</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px]">15 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.fifteenDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                <span>View ledger history</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
              </p>
            </div>
          </div>

          {/* 30 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Last 30 Days Revenue</span>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded text-[10px]">30 Days</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.thirtyDaysCollection.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                <span>View monthly totals</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-400" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Expiry Forecast Cards (Fully Interactive Tabs Switcher) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Name Plate Expiry & Renewal Forecast (Click card to inspect & send WhatsApp link)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1 Day */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-2xl p-5 cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
              <span>Expiring in Next 1 Day</span>
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]">Urgent</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-rose-900">{expiring1Day.length}</div>
              <p className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center">
                <Send className="w-3 h-3 mr-1" />
                Click to send WhatsApp reminder
              </p>
            </div>
          </div>

          {/* 7 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-2xl p-5 cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
              <span>Expiring in Next 7 Days</span>
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded font-bold text-[10px]">High</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-amber-900">{expiring7Days.length}</div>
              <p className="text-[11px] text-amber-700 font-medium mt-1">View 7-day expiration list</p>
            </div>
          </div>

          {/* 15 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-sky-50 border border-sky-200 hover:border-sky-300 rounded-2xl p-5 cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-sky-800 font-bold">
              <span>Expiring in Next 15 Days</span>
              <span className="px-2 py-0.5 bg-sky-600 text-white rounded font-bold text-[10px]">Medium</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-sky-900">{expiring15Days.length}</div>
              <p className="text-[11px] text-sky-700 font-medium mt-1">View 15-day expiration list</p>
            </div>
          </div>

          {/* 30 Days */}
          <div
            onClick={() => setActiveTab('subscriptions')}
            className="bg-emerald-50 border border-emerald-200 hover:border-emerald-300 rounded-2xl p-5 cursor-pointer transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>Expiring in Next 30 Days</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">Normal</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-emerald-900">{expiring30Days.length}</div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">View 30-day projection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Location Branches & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Location Branch Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Location Branch Occupancy & Performance</span>
            </h3>
            <button
              onClick={() => setActiveTab('cinema-plots')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Open Cinema Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => {
              const locBookings = bookings.filter((b) => b.locationId === loc.id);
              const locRevenue = locBookings.reduce((sum, b) => sum + b.totalAmount, 0);
              const occPercent = Math.round((loc.occupiedPlots / loc.totalPlots) * 100);

              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveTab('cinema-plots')}
                  className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 space-y-3 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{loc.name}</h4>
                      <p className="text-[11px] text-slate-500">{loc.address}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white text-indigo-700 border border-slate-200 px-2 py-0.5 rounded">
                      {loc.code}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-slate-600">Grave Plot Occupancy</span>
                      <span className="font-bold text-slate-900">
                        {loc.occupiedPlots} / {loc.totalPlots} ({occPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${occPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Branch Revenue:</span>
                      <span className="font-bold text-slate-900">₹{locRevenue.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 flex items-center">
                      <span>View Map</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Summary & Recent Customer Registrations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Today's Allotment & Renewal Tracker</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setActiveTab('subscriptions')}
              className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition"
            >
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Name Plates Allotted Today</span>
                <span className="text-[11px] text-emerald-700">Click to view new allotments</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-950">{allottedToday}</span>
            </div>

            <div
              onClick={() => setActiveTab('subscriptions')}
              className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-indigo-100/70 transition"
            >
              <div>
                <span className="text-xs font-bold text-indigo-900 block">Name Plates Renewed Today</span>
                <span className="text-[11px] text-indigo-700">Click to view renewals</span>
              </div>
              <span className="text-2xl font-extrabold text-indigo-950">{renewedToday}</span>
            </div>
          </div>

          {/* Recent Bookings Feed (Clickable) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recent Registrations</h4>
              <button
                onClick={() => setActiveTab('booking')}
                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                + Add New
              </button>
            </div>

            <div className="space-y-2">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedReceiptBooking(b)}
                  className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl text-xs flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <span className="font-bold text-slate-900">{b.customerName}</span>
                    <span className="text-slate-500 block text-[11px]">Pet: {b.petName} ({b.plotNumber})</span>
                  </div>
                  <span className="font-bold text-indigo-700">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
