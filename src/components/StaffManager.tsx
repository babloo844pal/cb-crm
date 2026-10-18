'use client';

import React, { useState } from 'react';
import { AppUser, Location } from '../lib/types';
import {
  UserCheck,
  UserPlus,
  Shield,
  MapPin,
  Mail,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react';

interface StaffManagerProps {
  users: AppUser[];
  locations: Location[];
  onInviteStaff: (newUser: AppUser) => void;
  onRemoveUser: (uid: string) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  users,
  locations,
  onInviteStaff,
  onRemoveUser,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'LOC-1');
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newUser: AppUser = {
      uid: `USR-STAFF-${Math.floor(100 + Math.random() * 900)}`,
      email,
      displayName: displayName || email.split('@')[0],
      role: 'STAFF',
      assignedLocationId: locationId,
      invitedBy: 'admin@cb-crm.com',
      status: 'INVITED',
    };

    onInviteStaff(newUser);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteModal(false);
      setEmail('');
      setDisplayName('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Staff Operator & Branch Access Management
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Invite staff operators via Google Workspace email and assign them to specific cemetery branches.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="min-h-[44px] px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-xs cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member (Google Email)</span>
        </button>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 space-y-5 text-[#1E293B] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-base text-[#1E293B]">
                Invite Staff via Google Account
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteSent ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Invitation Dispatched!</h4>
                <p className="text-xs text-emerald-800">
                  Google Account <strong>{email}</strong> has been granted operator access to the selected branch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4 text-xs">
                <div>
                  <label
                    htmlFor="staff-email"
                    className="block text-[#1E293B] font-semibold mb-1.5"
                  >
                    Staff Google Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="staff-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator.name@gmail.com"
                      className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-3.5 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="staff-name"
                    className="block text-[#1E293B] font-semibold mb-1.5"
                  >
                    Full Operator Name
                  </label>
                  <input
                    id="staff-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="staff-branch"
                    className="block text-[#1E293B] font-semibold mb-1.5"
                  >
                    Assigned Cemetery Branch *
                  </label>
                  <select
                    id="staff-branch"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-[#64748B] mt-1.5 block">
                    Staff operator will only view and process bookings for this assigned branch.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs transition-all duration-200 shadow-xs cursor-pointer"
                >
                  Send Invitation & Grant Branch Access
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Staff Directory Table */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="p-4">Staff Member & Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4">Assigned Branch</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {users.map((user) => {
                const assignedLoc = locations.find((l) => l.id === user.assignedLocationId);

                return (
                  <tr key={user.uid} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] font-bold flex items-center justify-center text-xs shrink-0">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1E293B] text-sm">{user.displayName}</div>
                        <div className="text-[#64748B] text-xs font-mono">{user.email}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          user.role === 'ADMIN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>
                          {user.role === 'ADMIN' ? 'System Administrator' : 'Branch Operator'}
                        </span>
                      </span>
                    </td>

                    <td className="p-4">
                      {user.role === 'ADMIN' ? (
                        <span className="text-emerald-700 font-bold">Global (All Branches)</span>
                      ) : (
                        <div className="font-semibold text-[#1E293B] flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span>{assignedLoc ? assignedLoc.name : 'Unassigned'}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <button
                          type="button"
                          onClick={() => onRemoveUser(user.uid)}
                          className="min-h-[36px] min-w-[36px] p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Revoke Access"
                          aria-label={`Revoke access for ${user.displayName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
