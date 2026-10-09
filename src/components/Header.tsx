'use client';

import React, { useEffect, useState } from 'react';
import { AppUser, Location } from '../lib/types';
import { AuthModal } from './AuthModal';
import { Search, Bell, Calendar } from 'lucide-react';

interface HeaderProps {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  locations: Location[];
  selectedLocationFilter: string;
  setSelectedLocationFilter: (locId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  setCurrentUser,
  availableUsers,
  locations,
  selectedLocationFilter,
  setSelectedLocationFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState('Today');

  useEffect(() => {
    setCurrentDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Search Input */}
      <div className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Customer, Pet Name, Plot #, WhatsApp..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
        />
      </div>

      {/* Right Action Icons & Auth Profile */}
      <div className="flex items-center space-x-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentDateStr}</span>
        </div>

        {/* Notifications */}
        <button
          className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 relative transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-ping"></span>
        </button>

        {/* Auth Profile Modal & Switcher */}
        <AuthModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          availableUsers={availableUsers}
          locations={locations}
        />
      </div>
    </header>
  );
};
