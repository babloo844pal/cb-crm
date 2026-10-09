'use client';

import React, { useState } from 'react';
import { AppUser, Location } from '../lib/types';
import { UserCheck, UserPlus, Shield, MapPin, Mail, CheckCircle, Trash2 } from 'lucide-react';

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
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-inner">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Staff Operator & Location Access Management</h2>
            <p className="text-xs text-slate-400">
              Invite staff members via Google accounts and restrict their operational access to specific cemetery branches.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member (Google Email)</span>
        </button>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-lg text-indigo-400">Invite Staff via Google Account</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-700 px-2.5 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {inviteSent ? (
              <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-4 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm">Invitation Sent!</h4>
                <p className="text-xs text-slate-300">
                  Google Account <strong className="text-emerald-300">{email}</strong> can now log in and operate assigned branch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Staff Google Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator.name@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Location Branch *</label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Staff operator will only see and process bookings for this location.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition shadow-md"
                >
                  Send Invitation & Grant Location Access
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Staff Member & Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4">Assigned Location</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {users.map((user) => {
                const assignedLoc = locations.find((l) => l.id === user.assignedLocationId);

                return (
                  <tr key={user.uid} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300 font-bold flex items-center justify-center text-xs">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-sm">{user.displayName}</div>
                        <div className="text-slate-400 text-[11px]">{user.email}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          user.role === 'ADMIN'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{user.role === 'ADMIN' ? 'System Administrator' : 'Staff Operator'}</span>
                      </span>
                    </td>

                    <td className="p-4">
                      {user.role === 'ADMIN' ? (
                        <span className="text-emerald-400 font-bold">Global (All Locations)</span>
                      ) : (
                        <div className="font-medium text-slate-300 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{assignedLoc ? assignedLoc.name : 'Unassigned'}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => onRemoveUser(user.uid)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs transition"
                          title="Revoke Access"
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
