'use client';

import React from 'react';
import { AppUser, Location } from '../lib/types';
import {
  LayoutDashboard,
  UserPlus,
  Tv,
  Tag,
  ShieldCheck,
  Package,
  Users,
  Building,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AppUser;
  locations: Location[];
  selectedLocationFilter: string;
  setSelectedLocationFilter: (locId: string) => void;
  expiringCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  locations,
  selectedLocationFilter,
  setSelectedLocationFilter,
  expiringCount,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'booking', label: 'New Customer Booking', icon: UserPlus },
    { id: 'cinema-plots', label: 'Cinema Hall Plot Map', icon: Tv, highlight: true },
    { id: 'subscriptions', label: 'Name Plate Subscriptions', icon: Tag, badge: expiringCount },
    { id: 'audit', label: 'Supervisor QR Scanner', icon: ShieldCheck },
  ];

  if (isAdmin) {
    menuItems.push(
      { id: 'packages', label: 'Service & Combo Packages', icon: Package },
      { id: 'staff', label: 'Staff & Branch Invites', icon: Users }
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm z-30">
      <div>
        {/* Brand Logo & Header */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            🐾
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
              Peaceful Paws
            </h1>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
              <span>CRM & Automation</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </span>
          </div>
        </div>

        {/* Location Scope Switcher Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center space-x-1">
              <Building className="w-3 h-3 text-slate-500" />
              <span>Location Scope</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
              {isAdmin ? 'Multi-Branch' : 'Assigned'}
            </span>
          </div>

          {isAdmin ? (
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            >
              <option value="ALL">🌐 All Locations (Aggregated)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  📍 {loc.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate">
                {locations.find((l) => l.id === currentUser.assignedLocationId)?.name || 'Local Branch'}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation List */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.highlight ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive ? 'bg-white text-emerald-700' : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Role Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
            {currentUser.displayName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.displayName}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
          </div>
          <span
            className={`text-[9px] px-2 py-0.5 rounded font-black tracking-wider ${
              isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {currentUser.role}
          </span>
        </div>
      </div>
    </aside>
  );
};
