'use client';

import React, { useState } from 'react';
import { CustomerBooking, ServiceItem, ComboPackage, Location, AppUser, NamePlateSubscription } from '../lib/types';
import { UserPlus, Receipt, CheckCircle, QrCode, Send, Printer, X, ShieldCheck, Tag, Sparkles, Building, Phone } from 'lucide-react';
import QRCode from 'qrcode';

interface CustomerBookingProps {
  onAddBooking: (booking: CustomerBooking, subscription?: NamePlateSubscription) => void;
  setActiveTab: (tab: string) => void;
  services: ServiceItem[];
  combos: ComboPackage[];
  locations: Location[];
  currentUser: AppUser;
}

export const CustomerBookingForm: React.FC<CustomerBookingProps> = ({
  onAddBooking,
  setActiveTab,
  services,
  combos,
  locations,
  currentUser,
}) => {
  const userLocation = locations.find((l) => l.id === currentUser.assignedLocationId) || locations[0];

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');

  // Pet Details State
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Bird' | 'Other'>('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');

  // Plot Details State
  const [plotSector, setPlotSector] = useState('Sector A');
  const [plotRow, setPlotRow] = useState('Row A1');
  const [plotSeat, setPlotSeat] = useState('05');

  // Package Selection State (Combo vs Standalone)
  const [selectionType, setSelectionType] = useState<'COMBO' | 'STANDALONE'>('COMBO');
  const [selectedComboId, setSelectedComboId] = useState(combos[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['SRV-101', 'SRV-102']);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<'QR_CODE' | 'CASH' | 'WHATSAPP_PAY_LINK' | 'ONLINE_UPI'>('QR_CODE');

  // Modal State
  const [receiptModal, setReceiptModal] = useState<{
    booking: CustomerBooking;
    subscription?: NamePlateSubscription;
    qrDataUrl?: string;
  } | null>(null);

  const selectedCombo = combos.find((c) => c.id === selectedComboId) || combos[0];

  // Calculate total amount
  let totalAmount = 0;
  let hasNamePlate = false;

  if (selectionType === 'COMBO' && selectedCombo) {
    totalAmount = selectedCombo.comboPrice;
    hasNamePlate = selectedCombo.includesNamePlate;
  } else {
    totalAmount = selectedServiceIds.reduce((sum, sId) => {
      const s = services.find((srv) => srv.id === sId);
      return sum + (s ? s.price : 0);
    }, 0);
    hasNamePlate = selectedServiceIds.includes('SRV-102');
  }

  const toggleServiceId = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingId = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const fullPlotNum = `${plotRow}-${plotSeat}`;

    const newBooking: CustomerBooking = {
      id: bookingId,
      receiptNo,
      locationId: userLocation.id,
      locationName: userLocation.name,
      customerName,
      customerPhone,
      whatsappNumber: whatsappNumber || customerPhone,
      address,
      petName,
      petType,
      petBreed,
      petAge,
      plotSector,
      plotRow,
      plotNumber: fullPlotNum,
      selectedServiceIds: selectionType === 'STANDALONE' ? selectedServiceIds : selectedCombo.bundledServiceIds,
      selectedComboPackageId: selectionType === 'COMBO' ? selectedComboId : undefined,
      totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      bookingDate: todayStr,
      hasNamePlate,
      createdByStaff: currentUser.displayName,
    };

    let newSub: NamePlateSubscription | undefined = undefined;
    let qrDataUrl = '';

    if (hasNamePlate) {
      const subId = `SUB-${Math.floor(5000 + Math.random() * 4000)}`;
      const tagSerial = `NPT-${Math.floor(10000 + Math.random() * 89999)}`;
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiryStr = nextYear.toISOString().split('T')[0];

      const qrPayload = JSON.stringify({
        tagSerial,
        petName,
        customerName,
        plot: fullPlotNum,
        expiryDate: expiryStr,
        status: 'ACTIVE',
        location: userLocation.name,
      });

      try {
        qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 200, margin: 1 });
      } catch (err) {
        console.error('QR generation error', err);
      }

      newSub = {
        id: subId,
        bookingId,
        locationId: userLocation.id,
        locationName: userLocation.name,
        tagSerial,
        petName,
        customerName,
        customerPhone,
        whatsappNumber: whatsappNumber || customerPhone,
        plotSector,
        plotNumber: fullPlotNum,
        amountPaid: 5000,
        allotmentDate: todayStr,
        expiryDate: expiryStr,
        daysUntilExpiry: 365,
        status: 'ALLOTTED_TODAY',
        isAllottedToday: true,
      };
    }

    onAddBooking(newBooking, newSub);

    setReceiptModal({
      booking: newBooking,
      subscription: newSub,
      qrDataUrl,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Location Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">New Customer Registration & Billing</h2>
            <p className="text-xs text-slate-500">
              Register customer, select burial/cremation package, generate instant payment QR or WhatsApp link.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs flex items-center space-x-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Branch Office</span>
            <span className="font-extrabold text-slate-900">{userLocation.name}</span>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Customer Personal Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Postal Address *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No., Street, City..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Pet & Plot Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Pet & Cinema Hall Plot Selection
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Shadow"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pet Type *</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                <input
                  type="text"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="text"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  placeholder="e.g. 7 Years"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Cinema Plot Seat Selection Inputs */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sector</label>
                <select
                  value={plotSector}
                  onChange={(e) => setPlotSector(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                >
                  <option value="Sector A">Sector A</option>
                  <option value="Sector B">Sector B</option>
                  <option value="Sector C">Sector C</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Row</label>
                <select
                  value={plotRow}
                  onChange={(e) => setPlotRow(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                >
                  <option value="Row A1">Row A1</option>
                  <option value="Row A2">Row A2</option>
                  <option value="Row A3">Row A3</option>
                  <option value="Row B1">Row B1</option>
                  <option value="Row B2">Row B2</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Seat #</label>
                <input
                  type="text"
                  required
                  value={plotSeat}
                  onChange={(e) => setPlotSeat(e.target.value)}
                  placeholder="05"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services & Combo Package Selection Section */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              3. Service Package & Combo Selection
            </h3>

            {/* Toggle Combo vs Standalone */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectionType('COMBO')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                  selectionType === 'COMBO'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔥 Admin Combo Packages (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setSelectionType('STANDALONE')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                  selectionType === 'STANDALONE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Service Checkbox List
              </button>
            </div>
          </div>

          {/* Combo Packages View */}
          {selectionType === 'COMBO' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {combos.map((combo) => {
                const isSelected = selectedComboId === combo.id;
                return (
                  <div
                    key={combo.id}
                    onClick={() => setSelectedComboId(combo.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Save ₹{combo.savings}
                        </span>
                        {combo.includesNamePlate && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-amber-500" />
                            <span>Name Plate Included</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{combo.packageName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{combo.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through">₹{combo.totalOriginalPrice}</span>
                        <div className="text-lg font-black text-emerald-700">₹{combo.comboPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Services Checkbox List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((srv) => {
                const checked = selectedServiceIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleServiceId(srv.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      checked ? 'bg-emerald-50/80 border-emerald-500' : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="h-4 w-4 text-emerald-600 rounded"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{srv.name}</span>
                        <span className="text-[11px] text-slate-500">{srv.description}</span>
                      </div>
                    </div>

                    <span className="font-extrabold text-xs text-slate-900">₹{srv.price.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
            4. Payment Method & Billing Dispatch
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'QR_CODE', label: 'Instant Payment QR Code', icon: QrCode },
              { id: 'WHATSAPP_PAY_LINK', label: 'WhatsApp Pay Link', icon: Send },
              { id: 'CASH', label: 'Cash / Counter', icon: Receipt },
              { id: 'ONLINE_UPI', label: 'Online Bank UPI', icon: Sparkles },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-extrabold">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Price Bar & Submit */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-xs text-slate-400 font-bold block">Total Amount Payable</span>
            <div className="text-3xl font-black text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</div>
            <span className="text-xs text-slate-300 mt-0.5 block">
              Customer: {customerName || 'Pending'} ({whatsappNumber || 'No WhatsApp'})
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5 text-slate-950" />
            <span>Complete Booking & Generate Invoice</span>
          </button>
        </div>
      </form>

      {/* Invoice & Payment Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setReceiptModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center mx-auto mb-2">
                🐾
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">PEACEFUL PAWS MEMORIAL</h2>
              <p className="text-xs text-slate-500 font-bold">{receiptModal.booking.locationName}</p>
              <div className="mt-2 text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full inline-block font-extrabold">
                Receipt #{receiptModal.booking.receiptNo}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-extrabold text-slate-900">{receiptModal.booking.customerName} ({receiptModal.booking.whatsappNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pet & Plot:</span>
                <span className="font-extrabold text-slate-900">{receiptModal.booking.petName} ({receiptModal.booking.petType}) — Plot {receiptModal.booking.plotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-mono font-bold text-emerald-700">{receiptModal.booking.paymentMethod}</span>
              </div>
            </div>

            {/* QR Code section */}
            {receiptModal.subscription && receiptModal.qrDataUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-4">
                <img src={receiptModal.qrDataUrl} alt="QR Token" className="w-24 h-24 rounded-xl border border-emerald-300 bg-white p-1" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold text-emerald-900 block flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Serial Tag #{receiptModal.subscription.tagSerial}</span>
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Tamper-evident serial sticker assigned for ground mounting. Valid for 1 year.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
              <button
                onClick={() => {
                  setReceiptModal(null);
                  setActiveTab('cinema-plots');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition"
              >
                View Cinema Plot Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
