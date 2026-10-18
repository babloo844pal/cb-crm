'use client';

import React, { useState } from 'react';
import { ServiceItem, ComboPackage } from '../lib/types';
import { Package, Plus, Tag, X } from 'lucide-react';

interface ServicePackageAdminProps {
  services: ServiceItem[];
  combos: ComboPackage[];
  onAddCombo: (combo: ComboPackage) => void;
}

export const ServicePackageAdmin: React.FC<ServicePackageAdminProps> = ({
  services,
  combos,
  onAddCombo,
}) => {
  const [showComboModal, setShowComboModal] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSrvIds, setSelectedSrvIds] = useState<string[]>(['SRV-101', 'SRV-102']);
  const [comboPrice, setComboPrice] = useState<number>(11500);

  const totalOriginal = selectedSrvIds.reduce((sum, id) => {
    const s = services.find((srv) => srv.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  const savings = Math.max(0, totalOriginal - comboPrice);
  const includesNamePlate = selectedSrvIds.includes('SRV-102');

  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    const newCombo: ComboPackage = {
      id: `CMB-${Math.floor(100 + Math.random() * 900)}`,
      packageName,
      description,
      bundledServiceIds: selectedSrvIds,
      totalOriginalPrice: totalOriginal,
      comboPrice,
      savings,
      includesNamePlate,
      active: true,
    };
    onAddCombo(newCombo);
    setShowComboModal(false);
    setPackageName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Admin Service & Combo Package Master
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Create bundled Combo Packages (e.g. Burial + 1-Yr Name Plate) and configure pricing for branch operators.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowComboModal(true)}
          className="min-h-[44px] px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Combo Package</span>
        </button>
      </div>

      {/* Combos Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
          Active Admin Combo Packages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Save ₹{combo.savings}
                  </span>
                  {combo.includesNamePlate && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-amber-600" />
                      <span>Name Plate Included</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-[#1E293B] text-base">{combo.packageName}</h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">{combo.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] line-through font-mono">
                    ₹{combo.totalOriginalPrice.toLocaleString('en-IN')}
                  </span>
                  <div className="text-xl font-extrabold text-[#2563EB] font-mono">
                    ₹{combo.comboPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-blue-200 px-2.5 py-1 rounded-lg">
                  Active Combo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Services Reference Table */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Individual Service Catalog (Base Rates)
          </h3>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-[#F8FAFC] transition-colors"
            >
              <div>
                <span className="font-bold text-[#1E293B] block">{srv.name}</span>
                <span className="text-[11px] text-[#64748B]">{srv.description}</span>
              </div>
              <span className="font-mono font-bold text-[#1E293B] text-sm">
                ₹{srv.price.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Create New Combo */}
      {showComboModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-bold text-base text-[#1E293B]">Create New Combo Package</h3>
              <button
                type="button"
                onClick={() => setShowComboModal(false)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="combo-name"
                  className="block text-[#1E293B] font-semibold mb-1.5"
                >
                  Combo Package Name *
                </label>
                <input
                  id="combo-name"
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. Standard Burial + 1-Yr Name Plate Combo"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="combo-desc"
                  className="block text-[#1E293B] font-semibold mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="combo-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe bundled features..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <span className="block text-[#1E293B] font-semibold mb-1.5">
                  Select Bundled Services
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
                  {services.map((srv) => {
                    const checked = selectedSrvIds.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        className="flex items-center justify-between text-xs font-medium text-[#1E293B] cursor-pointer py-0.5"
                      >
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedSrvIds((prev) =>
                                prev.includes(srv.id)
                                  ? prev.filter((i) => i !== srv.id)
                                  : [...prev, srv.id]
                              );
                            }}
                            className="h-4 w-4 rounded accent-[#2563EB] cursor-pointer"
                          />
                          <span>{srv.name}</span>
                        </div>
                        <span className="font-mono text-[#64748B]">₹{srv.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#EFF6FF] p-3.5 rounded-xl border border-blue-200">
                <div>
                  <span className="text-[10px] text-[#475569] block font-semibold">
                    Total Individual Price:
                  </span>
                  <span className="font-extrabold text-[#1E293B] text-sm font-mono">
                    ₹{totalOriginal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="combo-price"
                    className="block text-[10px] text-[#2563EB] font-bold mb-1"
                  >
                    Bundle Combo Price (₹) *
                  </label>
                  <input
                    id="combo-price"
                    type="number"
                    required
                    value={comboPrice}
                    onChange={(e) => setComboPrice(Number(e.target.value))}
                    className="w-full min-h-[36px] bg-white border border-blue-300 rounded-lg px-2.5 py-1 font-mono font-extrabold text-[#2563EB] text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Combo Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
