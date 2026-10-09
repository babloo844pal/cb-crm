'use client';

import React from 'react';
import { AppUser, Location } from '../lib/types';
import { loginWithGoogle, logoutFirebase } from '../lib/firebase';
import { Shield, User, MapPin, LogIn, LogOut, CheckCircle } from 'lucide-react';

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
      // Find if email exists in system users
      const existing = availableUsers.find((u) => u.email.toLowerCase() === firebaseUser.email?.toLowerCase());
      if (existing) {
        setCurrentUser(existing);
      } else {
        // Default new Google user as Staff
        const newGoogleUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL || undefined,
          role: 'STAFF',
          assignedLocationId: locations[0]?.id,
          status: 'ACTIVE',
        };
        setCurrentUser(newGoogleUser);
      }
    } else {
      // Fallback demo login
      alert("Firebase Google auth initialized. Switching to demo user profile.");
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition text-xs"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-[11px]">
          {currentUser.displayName.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-bold text-slate-200 leading-none flex items-center space-x-1">
            <span>{currentUser.displayName}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                currentUser.role === 'ADMIN' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {currentUser.role === 'ADMIN' ? 'Global Admin' : userLocation ? userLocation.name : 'Operator'}
          </span>
        </div>
      </button>

      {/* Profile Switcher & Firebase Login Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300">Firebase Auth & Role Selector</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
              ✕
            </button>
          </div>

          {/* Active Profile Info */}
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Currently Signed In</div>
            <div className="font-bold text-slate-100 text-sm">{currentUser.displayName}</div>
            <div className="text-slate-400 text-[11px]">{currentUser.email}</div>
            <div className="text-emerald-400 font-semibold mt-1">
              Role: {currentUser.role} | {currentUser.role === 'ADMIN' ? 'All Locations' : userLocation?.name}
            </div>
          </div>

          {/* Firebase Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
            <span>Sign In with Firebase Google Auth</span>
          </button>

          {/* Quick Demo Switcher */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              ⚡ Quick Role Test Switcher:
            </span>

            {availableUsers.map((u) => {
              const isSelected = u.uid === currentUser.uid;
              const loc = locations.find((l) => l.id === u.assignedLocationId);

              return (
                <button
                  key={u.uid}
                  onClick={() => handleSwitchProfile(u)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{u.displayName}</div>
                    <div className="text-[10px] text-slate-400">
                      {u.role === 'ADMIN' ? '👑 Global Admin' : `📍 ${loc?.name || 'Staff'}`}
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
