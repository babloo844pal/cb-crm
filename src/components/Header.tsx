'use client';

import React, { useEffect, useState } from 'react';
import { AppUser, Location } from '../lib/types';
import { AuthModal } from './AuthModal';
import {
  Search,
  Calendar,
  LayoutDashboard,
  UserPlus,
  Tv,
  Tag,
  ShieldCheck,
  Package,
  Users,
  Menu,
  X,
  Building2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  locations: Location[];
  selectedLocationFilter: string;
  setSelectedLocationFilter: (locId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expiringCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  availableUsers,
  locations,
  selectedLocationFilter,
  setSelectedLocationFilter,
  searchTerm,
  setSearchTerm,
  expiringCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState('Today');
  const isAdmin = currentUser.role === 'ADMIN';

  useEffect(() => {
    setCurrentDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    );
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'New Booking', icon: UserPlus },
    { id: 'cinema-plots', label: 'Cinema Map', icon: Tv },
    { id: 'subscriptions', label: 'Subscriptions', icon: Tag, badge: expiringCount },
    { id: 'audit', label: 'Field Audit', icon: ShieldCheck },
  ];

  if (isAdmin) {
    navItems.push(
      { id: 'packages', label: 'Packages', icon: Package },
      { id: 'staff', label: 'Staff', icon: Users }
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2 cursor-pointer lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              🐾
            </div>
            <span className="font-bold text-xs text-slate-900 truncate hidden xs:inline">
              Peaceful Paws
            </span>
          </div>
        </div>

        {/* Responsive Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, pet, plot..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 sm:pl-9 pr-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Desktop Top Header Navigation Pills */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right User Tools & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{currentDateStr}</span>
          </div>

          <AuthModal
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            availableUsers={availableUsers}
            locations={locations}
          />
        </div>
      </div>

      {/* Responsive Mobile Horizontal Scroll Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto px-3 py-2 border-t border-slate-100 space-x-1 bg-slate-50 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
