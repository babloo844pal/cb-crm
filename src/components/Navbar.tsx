'use client';

import React from 'react';
import { AppUser, Location } from '../lib/types';
import { AuthModal } from './AuthModal';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Receipt,
  AlertTriangle,
  LayoutDashboard,
  Package,
  UserCheck,
  Building,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unauthorizedCount: number;
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  locations: Location[];
  selectedLocationFilter: string;
  setSelectedLocationFilter: (locId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unauthorizedCount,
  currentUser,
  setCurrentUser,
  availableUsers,
  locations,
  selectedLocationFilter,
  setSelectedLocationFilter,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'New Booking & Bill', icon: Receipt },
    { id: 'plots', label: 'Sector Grid Map', icon: MapPin },
    { id: 'subscriptions', label: 'Name Plate Subscriptions', icon: Calendar },
    { id: 'audit-scanner', label: 'Supervisor QR Scanner', icon: ShieldCheck },
    { id: 'audit-logs', label: 'Security Logs', icon: AlertTriangle, badge: unauthorizedCount },
  ];

  if (isAdmin) {
    navItems.push(
      { id: 'services', label: 'Service Price Master', icon: Package },
      { id: 'staff', label: 'Staff & Locations', icon: UserCheck }
    );
  }

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
              🐾
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-slate-100">Peaceful Paws CRM</h1>
              <span className="text-xs text-emerald-400 font-medium">Pet Burial & Anti-Fraud Automation</span>
            </div>
          </div>

          {/* Location Selector (Admin Multi-Location vs Staff Fixed Branch) */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
            <Building className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Location:</span>
            {isAdmin ? (
              <select
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg px-2 py-1 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">🌐 All Locations (Aggregated)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-bold text-emerald-400">
                📍 {locations.find((l) => l.id === currentUser.assignedLocationId)?.name || 'Assigned Branch'}
              </span>
            )}
          </div>

          {/* Navigation & Profile */}
          <div className="flex items-center space-x-3">
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <AuthModal
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              availableUsers={availableUsers}
              locations={locations}
            />
          </div>
        </div>

        {/* Mobile Location & Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
