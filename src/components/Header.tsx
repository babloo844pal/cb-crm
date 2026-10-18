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
  Building2,
  Menu,
  X,
  HeartHandshake,
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
  searchTerm,
  setSearchTerm,
  expiringCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState('Today');
  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = currentUser.role === 'MANAGER';
  const isOperator = currentUser.role === 'OPERATOR';

  useEffect(() => {
    setCurrentDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    );
  }, []);

  // Role-based Nav Items
  let navItems: {
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }[] = [];

  if (isOperator) {
    // Operator can ONLY attend New Booking functionality
    navItems = [
      { id: 'booking', label: 'New Booking', icon: UserPlus },
    ];
  } else {
    // Admin and Manager can access Dashboard, Booking, Plot Map, Subscriptions, Audit
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'booking', label: 'New Booking', icon: UserPlus },
      { id: 'cinema-plots', label: 'Plot Map', icon: Tv },
      { id: 'subscriptions', label: 'Subscriptions', icon: Tag, badge: expiringCount },
      { id: 'audit', label: 'Field Audit', icon: ShieldCheck },
    ];

    if (isAdmin) {
      navItems.push(
        { id: 'branches', label: 'Branches', icon: Building2 },
        { id: 'packages', label: 'Packages', icon: Package },
        { id: 'staff', label: 'Staff', icon: Users }
      );
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-30 shadow-2xs">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger & Brand */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1E293B] hover:bg-[#F1F5F9] rounded-xl transition-colors duration-200 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(isOperator ? 'booking' : 'dashboard')}
            className="flex items-center space-x-2 cursor-pointer lg:hidden text-left py-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-[#1E293B] truncate hidden sm:inline">
              Peaceful Paws
            </span>
          </button>
        </div>

        {/* Responsive Global Search Input */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, pet, plot, tag..."
            aria-label="Search customer, pet, plot, or tag"
            className="w-full min-h-[40px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all duration-200"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Quick Navigation Pills */}
        <nav className="hidden xl:flex items-center space-x-1" aria-label="Top navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white text-[#2563EB]' : 'bg-amber-100 text-amber-800'
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
          <div className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
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

      {/* Responsive Mobile/Tablet Horizontal Scroll Navigation Bar */}
      <div
        className="flex lg:hidden overflow-x-auto px-3 py-2 border-t border-[#E2E8F0] space-x-1.5 bg-[#F8FAFC]/90 no-scrollbar"
        role="tablist"
        aria-label="Mobile quick tabs"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`min-h-[38px] flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white text-[#2563EB]' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
