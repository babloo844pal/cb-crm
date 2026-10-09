'use client';

import React, { useState } from 'react';
import { ServicePackage } from '../lib/types';
import { Package, Plus, Edit2, CheckCircle, XCircle, Tag, DollarSign } from 'lucide-react';

interface ServiceManagerProps {
  services: ServicePackage[];
  onAddService: (pkg: ServicePackage) => void;
  onUpdateService: (pkg: ServicePackage) => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onAddService,
  onUpdateService,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServicePackage | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(5000);
  const [category, setCategory] = useState<'CREMATION' | 'BURIAL' | 'NAME_PLATE' | 'MAINTENANCE' | 'ADDON'>('BURIAL');
  const [isSubscription, setIsSubscription] = useState(false);

  const openNewForm = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(5000);
    setCategory('BURIAL');
    setIsSubscription(false);
    setShowForm(true);
  };

  const openEditForm = (pkg: ServicePackage) => {
    setEditingService(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setPrice(pkg.price);
    setCategory(pkg.category);
    setIsSubscription(!!pkg.isSubscription);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const updated: ServicePackage = {
        ...editingService,
        name,
        description,
        price,
        category,
        isSubscription,
      };
      onUpdateService(updated);
    } else {
      const newPkg: ServicePackage = {
        id: `PKG-${Math.floor(100 + Math.random() * 900)}`,
        name,
        description,
        price,
        category,
        isSubscription,
        subscriptionYears: isSubscription ? 1 : undefined,
        active: true,
      };
      onAddService(newPkg);
    }
    setShowForm(false);
  };

  const toggleActive = (pkg: ServicePackage) => {
    onUpdateService({ ...pkg, active: !pkg.active });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-inner">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Admin Service Packages & Price Master</h2>
            <p className="text-xs text-slate-400">
              Manage authorized services, standardized pricing, and subscription packages across all location branches.
            </p>
          </div>
        </div>

        <button
          onClick={openNewForm}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Package</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="font-bold text-lg text-emerald-400">
                {editingService ? 'Edit Service Package' : 'Create New Service Package'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-700 px-2.5 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Name Plate Annual Subscription"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="BURIAL">Burial Service</option>
                  <option value="NAME_PLATE">Name Plate Subscription</option>
                  <option value="CREMATION">Cremation Service</option>
                  <option value="ADDON">Add-on / Shrine Package</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Standardized Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-bold text-emerald-400 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe included features and terms..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 p-3 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  id="subCheck"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 rounded"
                />
                <label htmlFor="subCheck" className="text-slate-200 font-medium cursor-pointer">
                  Is Annual Recurring Subscription (₹5,000 / Year Tagging)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-md"
              >
                Save Package in Master Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Package List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-slate-800 border rounded-2xl p-5 flex flex-col justify-between transition shadow-sm ${
              pkg.active ? 'border-slate-700' : 'border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                  {pkg.category}
                </span>
                <button
                  onClick={() => toggleActive(pkg)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    pkg.active
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {pkg.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h3 className="font-bold text-slate-100 text-base">{pkg.name}</h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{pkg.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Master Price:</span>
                <span className="font-bold text-lg text-emerald-400">₹{pkg.price.toLocaleString('en-IN')}</span>
                {pkg.isSubscription && <span className="text-[10px] text-amber-400 block font-medium">/ year</span>}
              </div>

              <button
                onClick={() => openEditForm(pkg)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
