'use client';

import React from 'react';
import { AppUser, Location } from '../lib/types';
import { loginWithGoogle } from '../lib/firebase';
import { ShieldCheck, MapPin, CheckCircle2, X, ChevronDown, Zap, UserCheck, UserPlus } from 'lucide-react';

interface AuthModalProps {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  locations: Location[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  setCurrentUser,
  availableUsers,
  locations,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleGoogleLogin = async () => {
    const firebaseUser = await loginWithGoogle();
    if (firebaseUser && firebaseUser.email) {
      const existing = availableUsers.find(
        (u) => u.email.toLowerCase() === firebaseUser.email?.toLowerCase()
      );
      if (existing) {
        setCurrentUser(existing);
      } else {
        const newGoogleUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL || undefined,
          role: 'OPERATOR',
          assignedLocationId: locations[0]?.id,
          status: 'ACTIVE',
        };
        setCurrentUser(newGoogleUser);
      }
    }
    setIsOpen(false);
  };

  const handleSwitchProfile = (user: AppUser) => {
    setCurrentUser(user);
    setIsOpen(false);
  };

  const userLocation = locations.find((l) => l.id === currentUser.assignedLocationId);

  return (
    <div className="relative">
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Open user role and account switcher"
        className="min-h-[40px] flex items-center space-x-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl transition-all duration-200 text-xs shadow-2xs cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center font-bold text-white text-xs shrink-0">
          {currentUser.displayName.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-bold text-[#1E293B] leading-tight flex items-center space-x-1.5">
            <span className="truncate max-w-[110px]">{currentUser.displayName.split(' ')[0]}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                currentUser.role === 'ADMIN'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : currentUser.role === 'MANAGER'
                  ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block leading-tight">
            {currentUser.role === 'ADMIN'
              ? 'Global Admin'
              : currentUser.role === 'MANAGER'
              ? `${userLocation?.name?.split(' ')[0] || 'Branch'} Manager`
              : `${userLocation?.name?.split(' ')[0] || 'Branch'} Operator`}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
      </button>

      {/* Profile Switcher & Firebase Login Dropdown Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-84 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-xl z-50 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div>
                <span className="font-bold text-[#1E293B] text-sm block">Account & Role Switcher</span>
                <span className="text-[10px] text-[#64748B]">Admin • Manager • Operator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close account switcher"
                className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Profile Info */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                Currently Signed In
              </div>
              <div className="font-bold text-[#1E293B] text-sm">{currentUser.displayName}</div>
              <div className="text-[#475569] text-xs font-mono">{currentUser.email}</div>
              <div className="pt-1 flex items-center space-x-1.5 text-xs font-semibold">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : currentUser.role === 'MANAGER'
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {currentUser.role}
                </span>
                <span className="text-[#475569]">
                  {currentUser.role === 'ADMIN'
                    ? 'All Locations Access'
                    : currentUser.role === 'MANAGER'
                    ? `${userLocation?.name} (Branch Operations)`
                    : `${userLocation?.name} (New Booking Only)`}
                </span>
              </div>
            </div>

            {/* Firebase Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full min-h-[42px] py-2.5 bg-white hover:bg-[#F8FAFC] text-[#1E293B] border border-[#CBD5E1] rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-2xs cursor-pointer"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-4 h-4"
                alt="Google"
              />
              <span>Sign In with Google Account</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider flex items-center space-x-1">
                <Zap className="w-3 h-3 text-[#EA580C]" />
                <span>Test Role Switcher (Admin / Manager / Operator):</span>
              </span>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {availableUsers.map((u) => {
                  const isSelected = u.uid === currentUser.uid;
                  const loc = locations.find((l) => l.id === u.assignedLocationId);

                  return (
                    <button
                      key={u.uid}
                      type="button"
                      onClick={() => handleSwitchProfile(u)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E293B]'
                          : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-[#1E293B] truncate">{u.displayName}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold shrink-0 ${
                              u.role === 'ADMIN'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : u.role === 'MANAGER'
                                ? 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B] flex items-center space-x-1 mt-0.5">
                          {u.role === 'ADMIN' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Global Access (All Locations)</span>
                            </>
                          ) : u.role === 'MANAGER' ? (
                            <>
                              <UserCheck className="w-3 h-3 text-[#2563EB] shrink-0" />
                              <span className="truncate">{loc?.name}: Full Branch Manager</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 text-[#EA580C] shrink-0" />
                              <span className="truncate">{loc?.name}: Booking Only</span>
                            </>
                          )}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
