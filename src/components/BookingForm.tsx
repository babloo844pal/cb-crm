'use client';

import React, { useState } from 'react';
import { BurialRecord, NamePlateSubscription, ServicePackage, AppUser, Location } from '../lib/types';
import { Receipt, CheckCircle, Printer, X, ShieldCheck, Tag, Building } from 'lucide-react';
import QRCode from 'qrcode';

interface BookingFormProps {
  onAddBurial: (burial: BurialRecord, subscription?: NamePlateSubscription) => void;
  setActiveTab: (tab: string) => void;
  servicePackages: ServicePackage[];
  currentUser: AppUser;
  locations: Location[];
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onAddBurial,
  setActiveTab,
  servicePackages,
  currentUser,
  locations,
}) => {
  const userLocation = locations.find((l) => l.id === currentUser.assignedLocationId) || locations[0];

  const activeBurialPackages = servicePackages.filter((p) => p.category === 'BURIAL' && p.active);
  const namePlatePackage = servicePackages.find((p) => p.category === 'NAME_PLATE') || { price: 5000 };

  const [selectedPackageId, setSelectedPackageId] = useState(activeBurialPackages[0]?.id || '');
  const selectedPackage = servicePackages.find((p) => p.id === selectedPackageId) || activeBurialPackages[0];

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Other'>('Dog');
  const [plotSector, setPlotSector] = useState('Sector A');
  const [plotNumber, setPlotNumber] = useState('A-18');
  const [includeNamePlate, setIncludeNamePlate] = useState(true);
  const [notes, setNotes] = useState('Standard Burial Service + 1-Year Name Plate Subscription');

  const [receiptData, setReceiptData] = useState<{
    burial: BurialRecord;
    subscription?: NamePlateSubscription;
    qrDataUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const burialId = `BUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const serviceCharge = selectedPackage ? selectedPackage.price : 8000;

    const newBurial: BurialRecord = {
      id: burialId,
      receiptNo,
      locationId: userLocation.id,
      locationName: userLocation.name,
      ownerName,
      ownerPhone,
      petName,
      petSpecies,
      burialDate: todayStr,
      plotSector,
      plotNumber,
      serviceCharge,
      hasNamePlate: includeNamePlate,
      notes: `${selectedPackage?.name || 'Burial'} - ${notes}`,
      createdByStaff: currentUser.displayName,
    };

    let newSub: NamePlateSubscription | undefined = undefined;
    let qrDataUrl = '';

    if (includeNamePlate) {
      const subId = `SUB-${Math.floor(2000 + Math.random() * 9000)}`;
      const tagSerial = `NPT-${Math.floor(10000 + Math.random() * 89999)}`;
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiryStr = nextYear.toISOString().split('T')[0];

      const qrPayload = JSON.stringify({
        tagSerial,
        petName,
        ownerName,
        location: userLocation.name,
        plot: `${plotSector} ${plotNumber}`,
        expiryDate: expiryStr,
        status: 'ACTIVE',
        verificationUrl: `https://cb-crm.internal/verify?tag=${tagSerial}`,
      });

      try {
        qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 200, margin: 1 });
      } catch (err) {
        console.error('QR generation error', err);
      }

      newSub = {
        id: subId,
        burialId,
        locationId: userLocation.id,
        tagSerial,
        petName,
        ownerName,
        ownerPhone,
        plotSector,
        plotNumber,
        amountPaid: namePlatePackage.price,
        startDate: todayStr,
        expiryDate: expiryStr,
        status: 'ACTIVE',
        workOrderIssued: true,
        installedBy: currentUser.displayName,
        qrCodeUrl: qrDataUrl,
      };
    }

    onAddBurial(newBurial, newSub);

    setReceiptData({
      burial: newBurial,
      subscription: newSub,
      qrDataUrl,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAmount = (selectedPackage ? selectedPackage.price : 8000) + (includeNamePlate ? namePlatePackage.price : 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Branch Location Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-inner">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">New Service Booking & Official Billing</h2>
            <p className="text-xs text-slate-400">
              Staff Operator Billing Workflow. Prices populated from Admin Master Catalog.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center space-x-2 text-xs">
          <Building className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Operating Branch</span>
            <span className="font-bold text-emerald-300">{userLocation.name}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              Pet Owner Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Owner Full Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Owner Contact Phone *</label>
              <input
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pet Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              Pet & Plot Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Shadow"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pet Type *</label>
                <select
                  value={petSpecies}
                  onChange={(e) => setPetSpecies(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sector *</label>
                <select
                  value={plotSector}
                  onChange={(e) => setPlotSector(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sector A">Sector A</option>
                  <option value="Sector B">Sector B</option>
                  <option value="Sector C">Sector C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plot Number *</label>
                <input
                  type="text"
                  required
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="e.g. A-18"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Package Selection (Admin Master Pricing) */}
        <div className="border-t border-slate-700 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Select Admin Approved Service Package
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Service Package *</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {activeBurialPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Plate Subscription Option */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start space-x-3">
              <input
                type="checkbox"
                id="namePlateCheck"
                checked={includeNamePlate}
                onChange={(e) => setIncludeNamePlate(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <label htmlFor="namePlateCheck" className="text-sm font-bold text-emerald-400 cursor-pointer">
                  Add Pet Name Plate Subscription (₹{namePlatePackage.price.toLocaleString('en-IN')} / Year)
                </label>
                <p className="text-xs text-slate-400 mt-1">
                  Generates tamper-evident Serial Tag & Scannable QR Code. Valid for 1 year.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary & Submit */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400">Total Payable Amount:</span>
            <div className="text-2xl font-bold text-emerald-400">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-slate-400">
              Processed by operator: <strong>{currentUser.displayName}</strong> ({userLocation.code})
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Issue Bill & Print QR Work Order Token</span>
          </button>
        </div>
      </form>

      {/* Official Receipt & QR Work Order Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setReceiptData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="inline-block p-2 bg-emerald-100 text-emerald-700 rounded-full mb-2">
                🐾
              </div>
              <h2 className="text-xl font-bold text-slate-900">PEACEFUL PAWS PET CREMATORIUM</h2>
              <p className="text-xs text-slate-600 font-semibold">{receiptData.burial.locationName}</p>
              <p className="text-[11px] text-slate-500">Official Payment Receipt & Work Order Authorization</p>
              <div className="mt-2 text-xs font-mono bg-slate-100 px-3 py-1 rounded-full inline-block font-semibold">
                Receipt #: {receiptData.burial.receiptNo}
              </div>
            </div>

            {/* Customer & Pet Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Owner Details:</span>
                <span className="font-bold text-slate-800">{receiptData.burial.ownerName}</span>
                <span className="text-slate-500 block mt-1">{receiptData.burial.ownerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pet & Plot:</span>
                <span className="font-bold text-slate-800">{receiptData.burial.petName} ({receiptData.burial.petSpecies})</span>
                <span className="text-slate-500 block mt-1">Plot: {receiptData.burial.plotSector} - {receiptData.burial.plotNumber}</span>
              </div>
            </div>

            {/* Itemized charges table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-medium">{receiptData.burial.notes}</td>
                    <td className="p-2.5 text-right font-semibold">₹{receiptData.burial.serviceCharge.toLocaleString('en-IN')}</td>
                  </tr>
                  {receiptData.subscription && (
                    <tr className="bg-emerald-50/50">
                      <td className="p-2.5 font-medium text-emerald-900">
                        1-Year Name Plate Subscription
                        <span className="block text-[10px] text-emerald-700 font-mono">
                          Serial Tag: {receiptData.subscription.tagSerial} (Valid thru {receiptData.subscription.expiryDate})
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-semibold text-emerald-900">₹{namePlatePackage.price.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                  <tr className="font-bold bg-slate-50 text-sm">
                    <td className="p-2.5 text-slate-900">Grand Total Paid</td>
                    <td className="p-2.5 text-right text-emerald-600">
                      ₹{(receiptData.burial.serviceCharge + (receiptData.subscription ? namePlatePackage.price : 0)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* QR Code & Work Order Authentication Token */}
            {receiptData.subscription && receiptData.qrDataUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-4">
                <img src={receiptData.qrDataUrl} alt="QR Code Tag" className="w-24 h-24 border border-emerald-300 rounded-lg bg-white p-1" />
                <div className="text-xs space-y-1">
                  <div className="flex items-center space-x-1 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Ground Installation Authorized</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Staff <strong className="font-semibold">{currentUser.displayName}</strong> authorized installation with Serial Sticker <strong className="font-mono">{receiptData.subscription.tagSerial}</strong>.
                  </p>
                  <span className="inline-block bg-emerald-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    Cleared in Central CRM
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => {
                  setReceiptData(null);
                  setActiveTab('subscriptions');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition"
              >
                View Subscriptions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
