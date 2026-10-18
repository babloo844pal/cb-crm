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
  ArrowRight,
  ArrowLeft,
  User,
  Tv,
  Package,
  Check,
  AlertCircle,
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

  // Slide Wizard Step State: 1 | 2 | 3 | 4
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Customer Form State (Slide 1)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');

  // Pet Details State (Slide 2)
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Bird' | 'Other'>('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');

  // Plot Details State (Slide 2)
  const [plotSector, setPlotSector] = useState('Sector A');
  const [plotRow, setPlotRow] = useState('A1');
  const [plotSeat, setPlotSeat] = useState('05');

  // Package Selection State (Slide 3)
  const [selectionType, setSelectionType] = useState<'COMBO' | 'STANDALONE'>('COMBO');
  const [selectedComboId, setSelectedComboId] = useState(combos[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['SRV-101', 'SRV-102']);

  // Payment Options State (Slide 4)
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

  // Step Validation & Navigation
  const validateAndProceed = (targetSlide: number) => {
    setValidationError(null);

    // Validate Slide 1
    if (currentSlide === 1 && targetSlide > 1) {
      if (!customerName.trim()) {
        setValidationError('Please enter customer full name.');
        return;
      }
      if (!customerPhone.trim()) {
        setValidationError('Please enter a contact phone number.');
        return;
      }
      if (!address.trim()) {
        setValidationError('Please enter customer postal address.');
        return;
      }
    }

    // Validate Slide 2
    if (currentSlide === 2 && targetSlide > 2) {
      if (!petName.trim()) {
        setValidationError('Please enter pet name.');
        return;
      }
      if (!plotSeat.trim()) {
        setValidationError('Please enter plot seat number.');
        return;
      }
    }

    // Validate Slide 3
    if (currentSlide === 3 && targetSlide > 3) {
      if (selectionType === 'STANDALONE' && selectedServiceIds.length === 0) {
        setValidationError('Please select at least one service from the list.');
        return;
      }
    }

    setCurrentSlide(targetSlide);
  };

  const handleNext = () => {
    if (currentSlide < 4) {
      validateAndProceed(currentSlide + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSlide !== 4) {
      return;
    }

    // Final Validation Check
    if (!customerName.trim() || !customerPhone.trim()) {
      setCurrentSlide(1);
      setValidationError('Customer information is incomplete.');
      return;
    }
    if (!petName.trim() || !plotSeat.trim()) {
      setCurrentSlide(2);
      setValidationError('Pet & plot details are incomplete.');
      return;
    }

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

  const slides = [
    { number: 1, title: 'Customer Details', short: 'Customer', icon: User },
    { number: 2, title: 'Pet & Plot Map', short: 'Pet & Plot', icon: Tv },
    { number: 3, title: 'Package Selection', short: 'Packages', icon: Package },
    { number: 4, title: 'Payment & Review', short: 'Review & Pay', icon: Receipt },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Branch Location Header */}
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
              Step-by-step registration wizard for customer details, grave plot allotment, service selection, and instant invoice.
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

      {/* Slide Progression Indicator / Stepper Header */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="font-bold text-[#1E293B] flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-blue-200 rounded-md font-mono text-[11px]">
              Slide {currentSlide} of 4
            </span>
            <span className="hidden sm:inline text-[#475569]">
              {slides[currentSlide - 1].title}
            </span>
          </div>
          <span className="text-[#64748B] font-mono font-bold text-xs">
            {currentSlide === 1 ? '25%' : currentSlide === 2 ? '50%' : currentSlide === 3 ? '75%' : '100%'} Completed
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#2563EB] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentSlide / 4) * 100}%` }}
          />
        </div>

        {/* Slide Step Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {slides.map((s) => {
            const Icon = s.icon;
            const isActive = currentSlide === s.number;
            const isCompleted = currentSlide > s.number;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => validateAndProceed(s.number)}
                className={`min-h-[44px] p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : isCompleted
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-blue-200 hover:bg-blue-100/70'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-white text-[#2563EB]'
                      : isCompleted
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : s.number}
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  <span className="hidden md:inline">{s.title}</span>
                  <span className="md:hidden">{s.short}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 rounded-xl text-xs flex items-center space-x-2.5 shadow-2xs animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Interactive Form Slides Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs min-h-[380px] flex flex-col justify-between">
          {/* SLIDE 1: Customer Personal Information */}
          {currentSlide === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Slide 1: Customer Personal Information</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                  Enter customer contact details for billing & WhatsApp receipts
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="slide-cust-name"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Customer Full Name *
                  </label>
                  <input
                    id="slide-cust-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slide-cust-phone"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Primary Contact Phone *
                  </label>
                  <input
                    id="slide-cust-phone"
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
                    htmlFor="slide-cust-whatsapp"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    WhatsApp Number (for receipts & reminders)
                  </label>
                  <input
                    id="slide-cust-whatsapp"
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210 (Defaults to phone if empty)"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="slide-cust-address"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Full Postal Residential Address *
                  </label>
                  <textarea
                    id="slide-cust-address"
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Street, Landmark, City, Pincode..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Pet & Cinema Hall Plot Selection */}
          {currentSlide === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <Tv className="w-4 h-4" />
                  <span>Slide 2: Pet Profile & Cinema Plot Allotment</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                  Record pet details and allocate a Cinema Hall style plot seat
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="slide-pet-name"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Pet Name *
                  </label>
                  <input
                    id="slide-pet-name"
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
                    htmlFor="slide-pet-type"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Pet Category *
                  </label>
                  <select
                    id="slide-pet-type"
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

                <div>
                  <label
                    htmlFor="slide-pet-breed"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Pet Breed
                  </label>
                  <input
                    id="slide-pet-breed"
                    type="text"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slide-pet-age"
                    className="block text-xs font-semibold text-[#1E293B] mb-1.5"
                  >
                    Age / Lifespan
                  </label>
                  <input
                    id="slide-pet-age"
                    type="text"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    placeholder="e.g. 7 Years"
                    className="w-full min-h-[44px] bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                  />
                </div>
              </div>

              {/* Cinema Plot Seat Selection Grid Inputs */}
              <div className="bg-[#EFF6FF]/60 border border-blue-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                  <span className="flex items-center space-x-1.5">
                    <Tv className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Cinema Plot Seat Designation</span>
                  </span>
                  <span className="font-mono text-[#2563EB] bg-white border border-blue-200 px-2.5 py-0.5 rounded-md">
                    Allocated: {plotSector} • {plotRow.replace('Row ', '')}-{plotSeat}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="slide-plot-sector"
                      className="block text-[11px] font-bold text-[#475569] mb-1"
                    >
                      Sector
                    </label>
                    <select
                      id="slide-plot-sector"
                      value={plotSector}
                      onChange={(e) => setPlotSector(e.target.value)}
                      className="w-full min-h-[40px] bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E293B] cursor-pointer"
                    >
                      <option value="Sector A">Sector A</option>
                      <option value="Sector B">Sector B</option>
                      <option value="Sector C">Sector C</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="slide-plot-row"
                      className="block text-[11px] font-bold text-[#475569] mb-1"
                    >
                      Cinema Row
                    </label>
                    <select
                      id="slide-plot-row"
                      value={plotRow}
                      onChange={(e) => setPlotRow(e.target.value)}
                      className="w-full min-h-[40px] bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E293B] cursor-pointer"
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
                      htmlFor="slide-plot-seat"
                      className="block text-[11px] font-bold text-[#475569] mb-1"
                    >
                      Seat # *
                    </label>
                    <input
                      id="slide-plot-seat"
                      type="text"
                      required
                      value={plotSeat}
                      onChange={(e) => setPlotSeat(e.target.value)}
                      placeholder="05"
                      className="w-full min-h-[40px] bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#1E293B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Service Package & Combo Selection */}
          {currentSlide === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-2">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    <Package className="w-4 h-4" />
                    <span>Slide 3: Service Package & Combo Selection</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                    Choose bundled packages or customized individual services
                  </h3>
                </div>

                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectionType('COMBO')}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      selectionType === 'COMBO'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#1E293B]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Admin Combos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectionType('STANDALONE')}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectionType === 'STANDALONE'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#1E293B]'
                    }`}
                  >
                    Custom Checkboxes
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
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                              Save ₹{combo.savings}
                            </span>
                            {combo.includesNamePlate && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                                <Tag className="w-3 h-3 text-amber-600" />
                                <span>Plate Included</span>
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
          )}

          {/* SLIDE 4: Payment Method, Review & Billing Confirmation */}
          {currentSlide === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <Receipt className="w-4 h-4" />
                  <span>Slide 4: Order Summary, Payment & Billing Dispatch</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                  Review booking details, select payment method, and generate official invoice
                </h3>
              </div>

              {/* Order Summary Recap Card */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-3">
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block border-b border-[#E2E8F0] pb-2">
                  Registration Recap:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Customer & Contact:</span>
                    <strong className="text-[#1E293B] block font-bold">{customerName || '—'}</strong>
                    <span className="text-[#475569] font-mono text-[11px]">{customerPhone || '—'}</span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[11px]">Pet & Allocated Plot:</span>
                    <strong className="text-[#1E293B] block font-bold">
                      {petName || '—'} ({petType})
                    </strong>
                    <span className="font-mono text-[#2563EB] text-[11px] font-bold">
                      {plotSector} • {plotRow.replace('Row ', '')}-{plotSeat}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[11px]">Chosen Plan:</span>
                    <strong className="text-[#1E293B] block font-bold">
                      {selectionType === 'COMBO' ? selectedCombo?.packageName : `${selectedServiceIds.length} Services Selected`}
                    </strong>
                    <span className="text-emerald-700 font-bold text-[11px]">
                      {hasNamePlate ? '✓ Includes 1-Yr Name Plate' : 'No Name Plate'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Select Payment Method:
                </label>

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

              {/* Total Summary */}
              <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#475569] font-bold uppercase tracking-wider block">
                    Total Amount Due
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-mono">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-xs text-[#475569]">
                  <span>Branch: <strong>{userLocation.name}</strong></span>
                  <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                    Ready to finalize registration
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Slide Navigation Buttons Footer */}
          <div className="border-t border-[#E2E8F0] pt-6 mt-6 flex items-center justify-between gap-3">
            <div>
              {currentSlide > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#1E293B] border border-[#CBD5E1] rounded-xl font-bold text-xs transition-all duration-200 shadow-2xs flex items-center space-x-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Slide</span>
                </button>
              )}
            </div>

            <div>
              {currentSlide < 4 ? (
                <button
                  key={`continue-slide-btn-${currentSlide}`}
                  type="button"
                  onClick={handleNext}
                  className="min-h-[44px] px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs transition-all duration-200 shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue to Slide {currentSlide + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  key="submit-booking-btn"
                  type="submit"
                  className="min-h-[46px] px-8 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Complete Booking & Generate Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Invoice & Payment Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setReceiptModal(null);
                setCurrentSlide(1);
              }}
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
                  setCurrentSlide(1);
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
