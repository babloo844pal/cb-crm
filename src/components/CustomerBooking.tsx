'use client';

import React, { useState } from 'react';
import {
  CustomerBooking,
  ServiceItem,
  ComboPackage,
  Location,
  AppUser,
  NamePlateSubscription,
} from '../lib/types';
import {
  UserPlus,
  Receipt,
  CheckCircle2,
  QrCode,
  Send,
  Printer,
  X,
  ShieldCheck,
  Tag,
  Sparkles,
  Building2,
  HeartHandshake,
  Flame,
} from 'lucide-react';
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
  const userLocation =
    locations.find((l) => l.id === currentUser.assignedLocationId) || locations[0];

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
  const [plotRow, setPlotRow] = useState('A1');
  const [plotSeat, setPlotSeat] = useState('05');

  // Package Selection State (Combo vs Standalone)
  const [selectionType, setSelectionType] = useState<'COMBO' | 'STANDALONE'>('COMBO');
  const [selectedComboId, setSelectedComboId] = useState(combos[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['SRV-101', 'SRV-102']);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<
    'QR_CODE' | 'CASH' | 'WHATSAPP_PAY_LINK' | 'ONLINE_UPI'
  >('QR_CODE');

  // Modal State
  const [receiptModal, setReceiptModal] = useState<{
    booking: CustomerBooking;
    subscription?: NamePlateSubscription;
    qrDataUrl?: string;
  } | null>(null);

  const selectedCombo = combos.find((c) => c.id === selectedComboId) || combos[0];

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
    const cleanRow = plotRow.replace('Row ', '');
    const fullPlotNum = `${cleanRow}-${plotSeat}`;

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
      plotRow: `Row ${cleanRow}`,
      plotNumber: fullPlotNum,
      selectedServiceIds:
        selectionType === 'STANDALONE' ? selectedServiceIds : selectedCombo.bundledServiceIds,
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
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              New Customer Registration & Billing
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Register pet owner, select burial/cremation package, and generate instant QR invoice or WhatsApp link.
            </p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2.5 self-start sm:self-center">
          <Building2 className="w-4 h-4 text-[#2563EB] shrink-0" />
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-bold tracking-wider">
              Branch Office
            </span>
            <span className="font-bold text-[#1E293B]">{userLocation.name}</span>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              1. Customer Personal Information
            </h3>

            <div>
              <label
                htmlFor="cust-name"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Customer Full Name *
              </label>
              <input
                id="cust-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="cust-phone"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Contact Phone *
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="cust-whatsapp"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  WhatsApp Number *
                </label>
                <input
                  id="cust-whatsapp"
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cust-address"
                className="block text-xs font-semibold text-[#1E293B] mb-1.5"
              >
                Full Postal Address *
              </label>
              <textarea
                id="cust-address"
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House No., Street, City..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* Pet & Plot Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              2. Pet & Cinema Hall Plot Selection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="pet-name"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Pet Name *
                </label>
                <input
                  id="pet-name"
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Shadow"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="pet-type"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Pet Type *
                </label>
                <select
                  id="pet-type"
                  value={petType}
                  onChange={(e) =>
                    setPetType(e.target.value as 'Dog' | 'Cat' | 'Bird' | 'Other')
                  }
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white cursor-pointer"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="pet-breed"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Breed
                </label>
                <input
                  id="pet-breed"
                  type="text"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="pet-age"
                  className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                >
                  Age
                </label>
                <input
                  id="pet-age"
                  type="text"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  placeholder="e.g. 7 Years"
                  className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>
            </div>

            {/* Cinema Plot Seat Selection Inputs */}
            <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <div>
                <label
                  htmlFor="plot-sector"
                  className="block text-[11px] font-bold text-[#475569] mb-1"
                >
                  Sector
                </label>
                <select
                  id="plot-sector"
                  value={plotSector}
                  onChange={(e) => setPlotSector(e.target.value)}
                  className="w-full min-h-[38px] bg-white border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs font-bold text-[#1E293B] cursor-pointer"
                >
                  <option value="Sector A">Sector A</option>
                  <option value="Sector B">Sector B</option>
                  <option value="Sector C">Sector C</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="plot-row"
                  className="block text-[11px] font-bold text-[#475569] mb-1"
                >
                  Row
                </label>
                <select
                  id="plot-row"
                  value={plotRow}
                  onChange={(e) => setPlotRow(e.target.value)}
                  className="w-full min-h-[38px] bg-white border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs font-bold text-[#1E293B] cursor-pointer"
                >
                  <option value="A1">Row A1</option>
                  <option value="A2">Row A2</option>
                  <option value="A3">Row A3</option>
                  <option value="B1">Row B1</option>
                  <option value="B2">Row B2</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="plot-seat"
                  className="block text-[11px] font-bold text-[#475569] mb-1"
                >
                  Seat #
                </label>
                <input
                  id="plot-seat"
                  type="text"
                  required
                  value={plotSeat}
                  onChange={(e) => setPlotSeat(e.target.value)}
                  placeholder="05"
                  className="w-full min-h-[38px] bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#1E293B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services & Combo Package Selection Section */}
        <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              3. Service Package & Combo Selection
            </h3>

            {/* Toggle Combo vs Standalone */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] self-start">
              <button
                type="button"
                onClick={() => setSelectionType('COMBO')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectionType === 'COMBO'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#1E293B]'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Admin Combo Packages</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectionType('STANDALONE')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectionType === 'STANDALONE'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#1E293B]'
                }`}
              >
                Custom Service Checkboxes
              </button>
            </div>
          </div>

          {/* Combo Packages View */}
          {selectionType === 'COMBO' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {combos.map((combo) => {
                const isSelected = selectedComboId === combo.id;
                return (
                  <button
                    key={combo.id}
                    type="button"
                    onClick={() => setSelectedComboId(combo.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EFF6FF]/90 border-[#2563EB] ring-2 ring-[#2563EB]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                          Save ₹{combo.savings}
                        </span>
                        {combo.includesNamePlate && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-amber-600" />
                            <span>Name Plate Included</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-[#1E293B] text-sm">{combo.packageName}</h4>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        {combo.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between w-full">
                      <div>
                        <span className="text-[10px] text-[#64748B] line-through font-mono">
                          ₹{combo.totalOriginalPrice.toLocaleString('en-IN')}
                        </span>
                        <div className="text-lg font-extrabold text-[#2563EB] font-mono">
                          ₹{combo.comboPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                          isSelected
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#F1F5F9] text-[#475569]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Services Checkbox List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((srv) => {
                const checked = selectedServiceIds.includes(srv.id);
                return (
                  <label
                    key={srv.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#EFF6FF]/80 border-[#2563EB]'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleServiceId(srv.id)}
                        className="h-4 w-4 accent-[#2563EB] rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#1E293B] block">{srv.name}</span>
                        <span className="text-[11px] text-[#64748B]">{srv.description}</span>
                      </div>
                    </div>

                    <span className="font-bold text-xs text-[#1E293B] font-mono shrink-0">
                      ₹{srv.price.toLocaleString('en-IN')}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
          <h3 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            4. Payment Method & Billing Dispatch
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'QR_CODE', label: 'Instant Payment QR', icon: QrCode },
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
                  onClick={() =>
                    setPaymentMethod(
                      method.id as 'QR_CODE' | 'CASH' | 'WHATSAPP_PAY_LINK' | 'ONLINE_UPI'
                    )
                  }
                  className={`min-h-[64px] p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                      : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Price Bar & Submit */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider block">
              Total Amount Payable
            </span>
            <div className="text-3xl font-extrabold text-[#1E293B] font-mono mt-0.5">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#475569] mt-0.5 block">
              Customer: <strong>{customerName || 'Pending Entry'}</strong> ({whatsappNumber || 'No WhatsApp'})
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Booking & Generate Invoice</span>
          </button>
        </div>
      </form>

      {/* Invoice & Payment Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setReceiptModal(null)}
              aria-label="Close invoice modal"
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-xl hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-[#E2E8F0] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2.5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-[#1E293B]">PEACEFUL PAWS MEMORIAL</h2>
              <p className="text-xs text-[#475569] font-semibold">
                {receiptModal.booking.locationName}
              </p>
              <div className="mt-2 text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full inline-block font-bold">
                Receipt #{receiptModal.booking.receiptNo}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs space-y-2.5 border border-[#E2E8F0]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Customer:</span>
                <span className="font-bold text-[#1E293B]">
                  {receiptModal.booking.customerName} ({receiptModal.booking.whatsappNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Pet & Plot:</span>
                <span className="font-bold text-[#1E293B]">
                  {receiptModal.booking.petName} ({receiptModal.booking.petType}) • Plot{' '}
                  <span className="font-mono">{receiptModal.booking.plotNumber}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Payment Method:</span>
                <span className="font-mono font-bold text-[#2563EB]">
                  {receiptModal.booking.paymentMethod}
                </span>
              </div>
            </div>

            {/* QR Code section */}
            {receiptModal.subscription && receiptModal.qrDataUrl && (
              <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-4 flex items-center space-x-4">
                <img
                  src={receiptModal.qrDataUrl}
                  alt="Name Plate Serial Tag QR Code"
                  className="w-24 h-24 rounded-xl border border-blue-200 bg-white p-1 shrink-0"
                />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#1E293B] flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-mono">Tag #{receiptModal.subscription.tagSerial}</span>
                  </span>
                  <p className="text-[#475569] text-[11px] leading-relaxed">
                    Tamper-evident QR serial tag assigned for ground mounting. Valid for 1 year.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 min-h-[44px] py-3 bg-[#1E293B] hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReceiptModal(null);
                  setActiveTab('cinema-plots');
                }}
                className="flex-1 min-h-[44px] py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
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
