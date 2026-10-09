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
  Building2,
  LucideIcon,
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

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  highlight?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
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

  const menuGroups: MenuGroup[] = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'booking', label: 'New Customer Booking', icon: UserPlus },
        { id: 'cinema-plots', label: 'Cinema Plot Map', icon: Tv, highlight: true },
      ],
    },
    {
      title: 'SUBSCRIPTIONS & SECURITY',
      items: [
        { id: 'subscriptions', label: 'Name Plate Subscriptions', icon: Tag, badge: expiringCount },
        { id: 'audit', label: 'Supervisor Field Audit', icon: ShieldCheck },
      ],
    },
  ];

  if (isAdmin) {
    menuGroups.push({
      title: 'ADMIN SETTINGS',
      items: [
        { id: 'packages', label: 'Service & Combo Packages', icon: Package },
        { id: 'staff', label: 'Staff & Branch Invites', icon: Users },
      ],
    });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none shadow-xs z-30">
      <div>
        {/* Company Logo & Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🐾
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-tight">
              Peaceful Paws CRM
            </h1>
            <span className="text-[11px] font-medium text-slate-500">
              Pet Memorial Management
            </span>
          </div>
        </div>

        {/* Location Filter Selector */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>Active Branch Scope</span>
          </label>

          {isAdmin ? (
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Branches (Global View)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 truncate">
              {locations.find((l) => l.id === currentUser.assignedLocationId)?.name || 'Local Branch'}
            </div>
          )}
        </div>

        {/* Grouped Navigation Links */}
        <div className="p-3 space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {group.title}
              </span>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-indigo-600' : item.highlight ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser.displayName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-none">{currentUser.displayName}</p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentUser.role === 'ADMIN' ? 'Administrator' : 'Staff Member'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
