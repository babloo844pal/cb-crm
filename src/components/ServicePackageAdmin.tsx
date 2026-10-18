'use client';

import React, { useState } from 'react';
import { ServiceItem, ComboPackage } from '../lib/types';
import {
  Package,
  Plus,
  Tag,
  X,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ServicePackageAdminProps {
  services: ServiceItem[];
  combos: ComboPackage[];
  onAddService: (service: ServiceItem) => void;
  onUpdateService: (service: ServiceItem) => void;
  onAddCombo: (combo: ComboPackage) => void;
  onUpdateCombo: (combo: ComboPackage) => void;
}

export const ServicePackageAdmin: React.FC<ServicePackageAdminProps> = ({
  services,
  combos,
  onAddService,
  onUpdateService,
  onAddCombo,
  onUpdateCombo,
}) => {
  // Modal states
  const [showComboModal, setShowComboModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingCombo, setEditingCombo] = useState<ComboPackage | null>(null);

  // New Combo state
  const [comboName, setComboName] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [selectedSrvIds, setSelectedSrvIds] = useState<string[]>(['SRV-101', 'SRV-102']);
  const [comboPrice, setComboPrice] = useState<number>(11500);
  const [comboEffectiveFrom, setComboEffectiveFrom] = useState('2026-01-01');
  const [comboEffectiveTo, setComboEffectiveTo] = useState('2026-12-31');

  // New Service state
  const [srvName, setSrvName] = useState('');
  const [srvDescription, setSrvDescription] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceItem['category']>('BURIAL');
  const [srvPrice, setSrvPrice] = useState<number>(5000);
  const [srvIsSubscription, setSrvIsSubscription] = useState(false);
  const [srvEffectiveFrom, setSrvEffectiveFrom] = useState('2026-01-01');
  const [srvEffectiveTo, setSrvEffectiveTo] = useState('2026-12-31');

  // Edit Service state
  const [editSrvName, setEditSrvName] = useState('');
  const [editSrvDescription, setEditSrvDescription] = useState('');
  const [editSrvCategory, setEditSrvCategory] = useState<ServiceItem['category']>('BURIAL');
  const [editSrvPrice, setEditSrvPrice] = useState<number>(0);
  const [editSrvEffectiveFrom, setEditSrvEffectiveFrom] = useState('');
  const [editSrvEffectiveTo, setEditSrvEffectiveTo] = useState('');
  const [editSrvActive, setEditSrvActive] = useState(true);

  // Edit Combo state
  const [editComboName, setEditComboName] = useState('');
  const [editComboDescription, setEditComboDescription] = useState('');
  const [editComboSrvIds, setEditComboSrvIds] = useState<string[]>([]);
  const [editComboPrice, setEditComboPrice] = useState<number>(0);
  const [editComboEffectiveFrom, setEditComboEffectiveFrom] = useState('');
  const [editComboEffectiveTo, setEditComboEffectiveTo] = useState('');
  const [editComboActive, setEditComboActive] = useState(true);

  // Calculations for New Combo
  const totalOriginal = selectedSrvIds.reduce((sum, id) => {
    const s = services.find((srv) => srv.id === id);
    return sum + (s ? s.price : 0);
  }, 0);
  const savings = Math.max(0, totalOriginal - comboPrice);
  const includesNamePlate = selectedSrvIds.includes('SRV-102');

  // Calculations for Edit Combo
  const editComboTotalOriginal = editComboSrvIds.reduce((sum, id) => {
    const s = services.find((srv) => srv.id === id);
    return sum + (s ? s.price : 0);
  }, 0);
  const editComboSavings = Math.max(0, editComboTotalOriginal - editComboPrice);
  const editComboIncludesNamePlate = editComboSrvIds.includes('SRV-102');

  // Handlers for New Combo
  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    const newCombo: ComboPackage = {
      id: `CMB-${Math.floor(100 + Math.random() * 900)}`,
      packageName: comboName,
      description: comboDescription,
      bundledServiceIds: selectedSrvIds,
      totalOriginalPrice: totalOriginal,
      comboPrice,
      savings,
      includesNamePlate,
      active: true,
      effectiveFrom: comboEffectiveFrom,
      effectiveTo: comboEffectiveTo,
    };
    onAddCombo(newCombo);
    setShowComboModal(false);
    setComboName('');
    setComboDescription('');
  };

  // Handlers for New Service
  const handleOpenAddService = () => {
    setSrvName('');
    setSrvDescription('');
    setSrvCategory('BURIAL');
    setSrvPrice(5000);
    setSrvIsSubscription(false);
    setSrvEffectiveFrom(new Date().toISOString().slice(0, 10));
    setSrvEffectiveTo('2026-12-31');
    setShowAddServiceModal(true);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: ServiceItem = {
      id: `SRV-${Math.floor(100 + Math.random() * 900)}`,
      name: srvName,
      description: srvDescription,
      category: srvCategory,
      price: Number(srvPrice) || 0,
      isSubscription: srvIsSubscription,
      active: true,
      effectiveFrom: srvEffectiveFrom,
      effectiveTo: srvEffectiveTo,
    };
    onAddService(newService);
    setShowAddServiceModal(false);
  };

  // Handlers for Edit Service
  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setEditSrvName(srv.name);
    setEditSrvDescription(srv.description);
    setEditSrvCategory(srv.category);
    setEditSrvPrice(srv.price);
    setEditSrvEffectiveFrom(srv.effectiveFrom || '2026-01-01');
    setEditSrvEffectiveTo(srv.effectiveTo || '2026-12-31');
    setEditSrvActive(srv.active !== false);
  };

  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated: ServiceItem = {
      ...editingService,
      name: editSrvName,
      description: editSrvDescription,
      category: editSrvCategory,
      price: Number(editSrvPrice) || 0,
      effectiveFrom: editSrvEffectiveFrom,
      effectiveTo: editSrvEffectiveTo,
      active: editSrvActive,
    };
    onUpdateService(updated);
    setEditingService(null);
  };

  // Handlers for Edit Combo
  const handleOpenEditCombo = (combo: ComboPackage) => {
    setEditingCombo(combo);
    setEditComboName(combo.packageName);
    setEditComboDescription(combo.description);
    setEditComboSrvIds(combo.bundledServiceIds || []);
    setEditComboPrice(combo.comboPrice);
    setEditComboEffectiveFrom(combo.effectiveFrom || '2026-01-01');
    setEditComboEffectiveTo(combo.effectiveTo || '2026-12-31');
    setEditComboActive(combo.active !== false);
  };

  const handleSaveEditCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;
    const updated: ComboPackage = {
      ...editingCombo,
      packageName: editComboName,
      description: editComboDescription,
      bundledServiceIds: editComboSrvIds,
      totalOriginalPrice: editComboTotalOriginal,
      comboPrice: Number(editComboPrice) || 0,
      savings: editComboSavings,
      includesNamePlate: editComboIncludesNamePlate,
      effectiveFrom: editComboEffectiveFrom,
      effectiveTo: editComboEffectiveTo,
      active: editComboActive,
    };
    onUpdateCombo(updated);
    setEditingCombo(null);
  };

  const categoryBadgeColors: Record<ServiceItem['category'], string> = {
    BURIAL: 'bg-blue-50 text-blue-700 border-blue-200',
    CREMATION: 'bg-amber-50 text-amber-700 border-amber-200',
    NAME_PLATE: 'bg-purple-50 text-purple-700 border-purple-200',
    MAINTENANCE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ADDON: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
              Add individual services, configure effective dates and base rates, and assemble discounted multi-service combo bundles.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenAddService}
            className="min-h-[44px] px-4 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#1E293B] border border-[#CBD5E1] font-bold text-xs rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2563EB]" />
            <span>Add New Service</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComboModal(true)}
            className="min-h-[44px] px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create New Combo Package</span>
          </button>
        </div>
      </div>

      {/* Combos Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center space-x-2">
            <span>Active Admin Combo Packages</span>
            <span className="text-[10px] bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded-full font-mono font-bold">
              {combos.length}
            </span>
          </h3>
        </div>

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
                  <div className="flex items-center space-x-2">
                    {combo.includesNamePlate && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-amber-600" />
                        <span>Name Plate Included</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenEditCombo(combo)}
                      aria-label={`Edit combo ${combo.packageName}`}
                      className="min-h-[32px] px-2 py-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-[#1E293B] text-base">{combo.packageName}</h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">{combo.description}</p>

                {/* Effective Dates Info */}
                <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-[#64748B]">
                  <Calendar className="w-3 h-3 text-[#2563EB]" />
                  <span>Effective:</span>
                  <span className="font-mono font-medium text-[#1E293B]">
                    {combo.effectiveFrom || '2026-01-01'} to {combo.effectiveTo || '2026-12-31'}
                  </span>
                </div>
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
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  combo.active !== false
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-slate-500 bg-slate-100 border-slate-300'
                }`}>
                  {combo.active !== false ? 'Active Bundle' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Services Catalog */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Individual Service Catalog & Price End Effective Dates
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Configure service rates, subscription tags, and valid effective periods for staff quotation.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddService}
            className="min-h-[36px] px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F9] text-[#475569] font-bold border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Service Code & Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Effective Date Range</th>
                <th className="px-4 py-3 text-right">Price (₹)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-[#475569] px-1.5 py-0.5 rounded">
                        {srv.id}
                      </span>
                      <span className="font-bold text-[#1E293B]">{srv.name}</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      {srv.description}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        categoryBadgeColors[srv.category] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {srv.category.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px] text-[#475569]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{srv.effectiveFrom || '2026-01-01'}</span>
                      <span>→</span>
                      <span className="font-bold text-[#1E293B]">{srv.effectiveTo || '2026-12-31'}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-extrabold text-[#1E293B] text-sm">
                    ₹{srv.price.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        srv.active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {srv.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEditService(srv)}
                      className="min-h-[32px] px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Price & Dates</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#1E293B]">Add New Service</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label htmlFor="srv-name" className="block text-[#1E293B] font-semibold mb-1">
                  Service Name *
                </label>
                <input
                  id="srv-name"
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="e.g. Eco-Friendly Biodegradable Urn"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="srv-desc" className="block text-[#1E293B] font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  id="srv-desc"
                  rows={2}
                  required
                  value={srvDescription}
                  onChange={(e) => setSrvDescription(e.target.value)}
                  placeholder="Details of what this service includes..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="srv-category" className="block text-[#1E293B] font-semibold mb-1">
                    Service Category *
                  </label>
                  <select
                    id="srv-category"
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value as any)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer"
                  >
                    <option value="BURIAL">Burial Plot Services</option>
                    <option value="CREMATION">Cremation Services</option>
                    <option value="NAME_PLATE">Name Plate & Tags</option>
                    <option value="MAINTENANCE">Maintenance & Flowers</option>
                    <option value="ADDON">Add-on / Keepsake</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="srv-price" className="block text-[#1E293B] font-semibold mb-1">
                    Standard Price (₹) *
                  </label>
                  <input
                    id="srv-price"
                    type="number"
                    min={0}
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(Number(e.target.value))}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="srv-eff-from" className="block text-[#1E293B] font-semibold mb-1">
                    Effective From *
                  </label>
                  <input
                    id="srv-eff-from"
                    type="date"
                    required
                    value={srvEffectiveFrom}
                    onChange={(e) => setSrvEffectiveFrom(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="srv-eff-to" className="block text-[#1E293B] font-semibold mb-1">
                    Effective To / End Date *
                  </label>
                  <input
                    id="srv-eff-to"
                    type="date"
                    required
                    value={srvEffectiveTo}
                    onChange={(e) => setSrvEffectiveTo(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={srvIsSubscription}
                  onChange={(e) => setSrvIsSubscription(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#2563EB] cursor-pointer"
                />
                <span className="font-semibold text-[#1E293B]">
                  Requires Annual Recurring Subscription (e.g. Name Plate renewal)
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Service */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#1E293B]">
                  Edit Service: {editingService.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditService} className="space-y-4 text-xs">
              <div>
                <label htmlFor="edit-srv-name" className="block text-[#1E293B] font-semibold mb-1">
                  Service Name *
                </label>
                <input
                  id="edit-srv-name"
                  type="text"
                  required
                  value={editSrvName}
                  onChange={(e) => setEditSrvName(e.target.value)}
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="edit-srv-desc" className="block text-[#1E293B] font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  id="edit-srv-desc"
                  rows={2}
                  required
                  value={editSrvDescription}
                  onChange={(e) => setEditSrvDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-srv-cat" className="block text-[#1E293B] font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    id="edit-srv-cat"
                    value={editSrvCategory}
                    onChange={(e) => setEditSrvCategory(e.target.value as any)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer"
                  >
                    <option value="BURIAL">Burial Plot Services</option>
                    <option value="CREMATION">Cremation Services</option>
                    <option value="NAME_PLATE">Name Plate & Tags</option>
                    <option value="MAINTENANCE">Maintenance & Flowers</option>
                    <option value="ADDON">Add-on / Keepsake</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-srv-price" className="block text-[#1E293B] font-semibold mb-1">
                    Service Rate Price (₹) *
                  </label>
                  <input
                    id="edit-srv-price"
                    type="number"
                    min={0}
                    required
                    value={editSrvPrice}
                    onChange={(e) => setEditSrvPrice(Number(e.target.value))}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-srv-eff-from" className="block text-[#1E293B] font-semibold mb-1">
                    Effective From *
                  </label>
                  <input
                    id="edit-srv-eff-from"
                    type="date"
                    required
                    value={editSrvEffectiveFrom}
                    onChange={(e) => setEditSrvEffectiveFrom(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-srv-eff-to" className="block text-[#1E293B] font-semibold mb-1">
                    Effective To / End Date *
                  </label>
                  <input
                    id="edit-srv-eff-to"
                    type="date"
                    required
                    value={editSrvEffectiveTo}
                    onChange={(e) => setEditSrvEffectiveTo(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={editSrvActive}
                  onChange={(e) => setEditSrvActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#2563EB] cursor-pointer"
                />
                <span className="font-semibold text-[#1E293B]">
                  Active in CRM Service Catalog
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Combo Package */}
      {showComboModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#EA580C]" />
                <h3 className="font-bold text-base text-[#1E293B]">Create New Combo Package</h3>
              </div>
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
                <label htmlFor="combo-name" className="block text-[#1E293B] font-semibold mb-1">
                  Combo Package Name *
                </label>
                <input
                  id="combo-name"
                  type="text"
                  required
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  placeholder="e.g. Standard Burial + 1-Yr Name Plate Combo"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="combo-desc" className="block text-[#1E293B] font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  id="combo-desc"
                  rows={2}
                  required
                  value={comboDescription}
                  onChange={(e) => setComboDescription(e.target.value)}
                  placeholder="Describe bundled features and key value propositions..."
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
                        className="flex items-center justify-between text-xs font-medium text-[#1E293B] cursor-pointer py-1 px-1.5 rounded-lg hover:bg-white transition-colors"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="combo-eff-from" className="block text-[#1E293B] font-semibold mb-1">
                    Effective From *
                  </label>
                  <input
                    id="combo-eff-from"
                    type="date"
                    required
                    value={comboEffectiveFrom}
                    onChange={(e) => setComboEffectiveFrom(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="combo-eff-to" className="block text-[#1E293B] font-semibold mb-1">
                    Effective To / End Date *
                  </label>
                  <input
                    id="combo-eff-to"
                    type="date"
                    required
                    value={comboEffectiveTo}
                    onChange={(e) => setComboEffectiveTo(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
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
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    Customer Saves ₹{savings.toLocaleString('en-IN')}
                  </div>
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
                    className="w-full min-h-[38px] bg-white border border-blue-300 rounded-lg px-2.5 py-1 font-mono font-extrabold text-[#2563EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowComboModal(false)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Combo Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Combo Package */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#1E293B]">
                  Edit Combo: {editingCombo.packageName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCombo(null)}
                aria-label="Close modal"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCombo} className="space-y-4 text-xs">
              <div>
                <label htmlFor="edit-combo-name" className="block text-[#1E293B] font-semibold mb-1">
                  Combo Package Name *
                </label>
                <input
                  id="edit-combo-name"
                  type="text"
                  required
                  value={editComboName}
                  onChange={(e) => setEditComboName(e.target.value)}
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="edit-combo-desc" className="block text-[#1E293B] font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  id="edit-combo-desc"
                  rows={2}
                  required
                  value={editComboDescription}
                  onChange={(e) => setEditComboDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <span className="block text-[#1E293B] font-semibold mb-1.5">
                  Bundled Services
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
                  {services.map((srv) => {
                    const checked = editComboSrvIds.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        className="flex items-center justify-between text-xs font-medium text-[#1E293B] cursor-pointer py-1 px-1.5 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setEditComboSrvIds((prev) =>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-combo-eff-from" className="block text-[#1E293B] font-semibold mb-1">
                    Effective From *
                  </label>
                  <input
                    id="edit-combo-eff-from"
                    type="date"
                    required
                    value={editComboEffectiveFrom}
                    onChange={(e) => setEditComboEffectiveFrom(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-combo-eff-to" className="block text-[#1E293B] font-semibold mb-1">
                    Effective To / End Date *
                  </label>
                  <input
                    id="edit-combo-eff-to"
                    type="date"
                    required
                    value={editComboEffectiveTo}
                    onChange={(e) => setEditComboEffectiveTo(e.target.value)}
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#EFF6FF] p-3.5 rounded-xl border border-blue-200">
                <div>
                  <span className="text-[10px] text-[#475569] block font-semibold">
                    Total Individual Price:
                  </span>
                  <span className="font-extrabold text-[#1E293B] text-sm font-mono">
                    ₹{editComboTotalOriginal.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    Customer Saves ₹{editComboSavings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-combo-price"
                    className="block text-[10px] text-[#2563EB] font-bold mb-1"
                  >
                    Bundle Combo Price (₹) *
                  </label>
                  <input
                    id="edit-combo-price"
                    type="number"
                    required
                    value={editComboPrice}
                    onChange={(e) => setEditComboPrice(Number(e.target.value))}
                    className="w-full min-h-[38px] bg-white border border-blue-300 rounded-lg px-2.5 py-1 font-mono font-extrabold text-[#2563EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={editComboActive}
                  onChange={(e) => setEditComboActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#2563EB] cursor-pointer"
                />
                <span className="font-semibold text-[#1E293B]">
                  Active Combo Package
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCombo(null)}
                  className="min-h-[44px] px-4 py-2 border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Combo Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
