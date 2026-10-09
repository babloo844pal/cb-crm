'use client';

import React, { useState } from 'react';
import { ServiceItem, ComboPackage } from '../lib/types';
import { Package, Plus, Edit2, Tag, Check, Sparkles } from 'lucide-react';

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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Admin Service & Combo Package Master</h2>
            <p className="text-xs text-slate-500">
              Create bundled Combo Packages (e.g. Burial + Name Plate) and set standard prices for operators.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowComboModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Combo Package</span>
        </button>
      </div>

      {/* Combos Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Active Admin Combo Packages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Save ₹{combo.savings}
                  </span>
                  {combo.includesNamePlate && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Name Plate Included
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">{combo.packageName}</h4>
                <p className="text-xs text-slate-500 mt-1">{combo.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through">₹{combo.totalOriginalPrice}</span>
                  <div className="text-xl font-black text-emerald-700">₹{combo.comboPrice.toLocaleString('en-IN')}</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  Active Combo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Create New Combo */}
      {showComboModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">Create New Combo Package</h3>
              <button onClick={() => setShowComboModal(false)} className="text-slate-400 text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Combo Package Name *</label>
                <input
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. Standard Burial + 1-Yr Name Plate Combo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe bundled features..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Bundled Services</label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {services.map((srv) => {
                    const checked = selectedSrvIds.includes(srv.id);
                    return (
                      <label key={srv.id} className="flex items-center justify-between text-xs font-medium text-slate-800 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedSrvIds((prev) =>
                                prev.includes(srv.id) ? prev.filter((i) => i !== srv.id) : [...prev, srv.id]
                              );
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>{srv.name}</span>
                        </div>
                        <span className="font-mono text-slate-500">₹{srv.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Individual Price:</span>
                  <span className="font-extrabold text-slate-800 text-sm">₹{totalOriginal}</span>
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-800 font-bold">Bundle Combo Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={comboPrice}
                    onChange={(e) => setComboPrice(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2 py-1 font-extrabold text-emerald-800 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition"
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
