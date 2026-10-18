'use client';

import React, { useState } from 'react';
import { Location } from '../lib/types';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Layers,
  Edit3,
  X,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface BranchLocationAdminProps {
  locations: Location[];
  onAddLocation: (loc: Location) => void;
  onUpdateLocation: (loc: Location) => void;
}

export const BranchLocationAdmin: React.FC<BranchLocationAdminProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);

  // Form states for Add Location
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [totalPlots, setTotalPlots] = useState<number>(50);

  // Form states for Edit Location
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTotalPlots, setEditTotalPlots] = useState<number>(50);
  const [editOccupiedPlots, setEditOccupiedPlots] = useState<number>(0);

  const handleOpenAdd = () => {
    setName('');
    setCode(`LOC-${locations.length + 1}`);
    setAddress('');
    setPhone('+91 ');
    setTotalPlots(50);
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `LOC-${Date.now().toString().slice(-4)}`;
    const newLocation: Location = {
      id: newId,
      name,
      code: code.toUpperCase(),
      address,
      phone,
      totalPlots: Number(totalPlots) || 50,
      occupiedPlots: 0,
      availablePlots: Number(totalPlots) || 50,
    };
    onAddLocation(newLocation);
    setShowAddModal(false);
  };

  const handleOpenEdit = (loc: Location) => {
    setEditingLoc(loc);
    setEditName(loc.name);
    setEditCode(loc.code);
    setEditAddress(loc.address);
    setEditPhone(loc.phone);
    setEditTotalPlots(loc.totalPlots);
    setEditOccupiedPlots(loc.occupiedPlots);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc) return;
    const tot = Number(editTotalPlots) || 0;
    const occ = Number(editOccupiedPlots) || 0;
    const updated: Location = {
      ...editingLoc,
      name: editName,
      code: editCode.toUpperCase(),
      address: editAddress,
      phone: editPhone,
      totalPlots: tot,
      occupiedPlots: occ,
      availablePlots: Math.max(0, tot - occ),
    };
    onUpdateLocation(updated);
    setEditingLoc(null);
  };

  const totalCapacity = locations.reduce((sum, l) => sum + l.totalPlots, 0);
  const totalOccupied = locations.reduce((sum, l) => sum + l.occupiedPlots, 0);
  const totalAvailable = locations.reduce((sum, l) => sum + l.availablePlots, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Branch Locations Master
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Manage cemetery branch facilities, plot capacities, contact details, and location codes across all regions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch Location</span>
        </button>
      </div>

      {/* Network Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Total Branches
          </span>
          <div className="text-2xl font-black text-[#1E293B] mt-1 font-mono">
            {locations.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active Facilities</span>
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Total Plots Capacity
          </span>
          <div className="text-2xl font-black text-[#2563EB] mt-1 font-mono">
            {totalCapacity}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium mt-1 block">
            Across network
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Available Plots
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
            {totalAvailable}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            Ready for allotment
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Average Occupancy
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
            {avgOccupancy}%
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-1 inline-flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{totalOccupied} Plots occupied</span>
          </span>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
          Active Branch Locations ({locations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.map((loc) => {
            const occupancyRate =
              loc.totalPlots > 0 ? Math.round((loc.occupiedPlots / loc.totalPlots) * 100) : 0;

            return (
              <div
                key={loc.id}
                className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded-md">
                      {loc.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(loc)}
                      className="min-h-[32px] px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <h4 className="font-bold text-[#1E293B] text-base leading-tight">
                    {loc.name}
                  </h4>

                  <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{loc.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span className="font-mono">{loc.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Plot Metrics */}
                <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1E293B]">
                    <div className="flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Plot Capacity:</span>
                    </div>
                    <span className="font-mono">
                      {loc.occupiedPlots} / {loc.totalPlots} ({occupancyRate}%)
                    </span>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        occupancyRate > 80
                          ? 'bg-rose-500'
                          : occupancyRate > 50
                          ? 'bg-amber-500'
                          : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#64748B]">
                      Available: <strong className="text-emerald-700 font-mono">{loc.availablePlots}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                      Active Facility
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#1E293B]">Add New Branch Location</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="branch-name" className="block text-[#1E293B] font-semibold mb-1">
                  Branch Location Name *
                </label>
                <input
                  id="branch-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. West Serenity Pet Memorial Park"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="branch-code" className="block text-[#1E293B] font-semibold mb-1">
                    Branch Code *
                  </label>
                  <input
                    id="branch-code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. WSP-WEST"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white uppercase"
                  />
                </div>

                <div>
                  <label htmlFor="branch-phone" className="block text-[#1E293B] font-semibold mb-1">
                    Contact Phone *
                  </label>
                  <input
                    id="branch-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00004"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="branch-address" className="block text-[#1E293B] font-semibold mb-1">
                  Full Physical Address *
                </label>
                <textarea
                  id="branch-address"
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot number, Sector, Road, City, Pincode"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="branch-capacity" className="block text-[#1E293B] font-semibold mb-1">
                  Total Grave Plot Capacity *
                </label>
                <input
                  id="branch-capacity"
                  type="number"
                  min={1}
                  required
                  value={totalPlots}
                  onChange={(e) => setTotalPlots(Number(e.target.value))}
                  placeholder="50"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Initially all plots will be marked as available for booking.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Add Branch Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Location Modal */}
      {editingLoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#1E293B]">
                  Edit Branch: {editingLoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLoc(null)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="edit-branch-name" className="block text-[#1E293B] font-semibold mb-1">
                  Branch Location Name *
                </label>
                <input
                  id="edit-branch-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-branch-code" className="block text-[#1E293B] font-semibold mb-1">
                    Branch Code *
                  </label>
                  <input
                    id="edit-branch-code"
                    type="text"
                    required
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white uppercase"
                  />
                </div>

                <div>
                  <label htmlFor="edit-branch-phone" className="block text-[#1E293B] font-semibold mb-1">
                    Contact Phone *
                  </label>
                  <input
                    id="edit-branch-phone"
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-branch-address" className="block text-[#1E293B] font-semibold mb-1">
                  Full Physical Address *
                </label>
                <textarea
                  id="edit-branch-address"
                  rows={2}
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-total-plots" className="block text-[#1E293B] font-semibold mb-1">
                    Total Plots Capacity *
                  </label>
                  <input
                    id="edit-total-plots"
                    type="number"
                    min={1}
                    required
                    value={editTotalPlots}
                    onChange={(e) => setEditTotalPlots(Number(e.target.value))}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-occupied-plots" className="block text-[#1E293B] font-semibold mb-1">
                    Occupied Plots
                  </label>
                  <input
                    id="edit-occupied-plots"
                    type="number"
                    min={0}
                    required
                    value={editOccupiedPlots}
                    onChange={(e) => setEditOccupiedPlots(Number(e.target.value))}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingLoc(null)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Branch Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
