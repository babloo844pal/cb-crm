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
  X,
  HeartHandshake,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AppUser;
  locations: Location[];
  selectedLocationFilter: string;
  setSelectedLocationFilter: (locId: string) => void;
  expiringCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
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
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = currentUser.role === 'MANAGER';
  const isOperator = currentUser.role === 'OPERATOR';

  // Role-based menu groups
  const menuGroups: MenuGroup[] = [];

  if (isOperator) {
    // Operator can ONLY attend New Booking functionality
    menuGroups.push({
      title: 'FRONT DESK',
      items: [
        { id: 'booking', label: 'New Customer Booking', icon: UserPlus, highlight: true },
      ],
    });
  } else {
    // Admin and Manager operations
    menuGroups.push({
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'booking', label: 'New Customer Booking', icon: UserPlus },
        { id: 'cinema-plots', label: 'Plot Map', icon: Tv, highlight: true },
      ],
    });

    menuGroups.push({
      title: 'SUBSCRIPTIONS & AUDIT',
      items: [
        { id: 'subscriptions', label: 'Name Plate Subscriptions', icon: Tag, badge: expiringCount },
        { id: 'audit', label: 'Supervisor Field Audit', icon: ShieldCheck },
      ],
    });

    if (isAdmin) {
      menuGroups.push({
        title: 'ADMIN SETTINGS',
        items: [
          { id: 'packages', label: 'Service & Combo Packages', icon: Package },
          { id: 'staff', label: 'Staff & Branch Invites', icon: Users },
        ],
      });
    }
  }

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const assignedLoc = locations.find((l) => l.id === currentUser.assignedLocationId);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        aria-label="Primary Sidebar Navigation"
        className={`fixed lg:static top-0 left-0 bottom-0 w-72 lg:w-64 bg-white/95 backdrop-blur-md border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 select-none shadow-lg lg:shadow-2xs z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Company Logo & Brand Header */}
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleSelectTab(isOperator ? 'booking' : 'dashboard')}
              className="flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] group-hover:bg-[#1D4ED8] flex items-center justify-center text-white shadow-sm transition-colors duration-200">
                <HeartHandshake className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-bold text-[#1E293B] text-sm leading-tight">
                  Peaceful Paws CRM
                </h1>
                <span className="text-[11px] font-medium text-[#475569]">
                  {isAdmin
                    ? 'Global Admin Scope'
                    : isManager
                    ? 'Branch Manager Scope'
                    : 'Branch Operator Desk'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation drawer"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#475569] hover:text-[#1E293B] rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Location Filter Selector */}
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <label
              htmlFor="sidebar-branch-select"
              className="text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                <span>Branch Location Scope</span>
              </span>
              {!isAdmin && (
                <span className="flex items-center space-x-1 text-[10px] text-amber-700 font-mono font-bold">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Locked</span>
                </span>
              )}
            </label>

            {isAdmin ? (
              <select
                id="sidebar-branch-select"
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="w-full min-h-[44px] bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#2563EB] shadow-2xs cursor-pointer transition-colors"
              >
                <option value="ALL">All Locations (Global Admin)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="min-h-[44px] flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-2xs">
                <span className="truncate">{assignedLoc?.name || 'Assigned Branch'}</span>
                <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] border border-blue-200 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                  {assignedLoc?.code || 'BRANCH'}
                </span>
              </div>
            )}
          </div>

          {/* Grouped Navigation Links */}
          <div className="p-3 space-y-5">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="px-3 text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                  {group.title}
                </span>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                          : 'text-[#475569] hover:bg-[#E9EFF8] hover:text-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : item.highlight ? 'text-[#2563EB]' : 'text-[#475569]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white text-[#2563EB]'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
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
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
              {currentUser.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1E293B] truncate leading-none">{currentUser.displayName}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : currentUser.role === 'MANAGER'
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {currentUser.role}
                </span>
                <span className="text-[11px] text-[#475569] truncate">
                  {currentUser.role === 'ADMIN' ? 'Global Admin' : assignedLoc?.name || 'Operator'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
