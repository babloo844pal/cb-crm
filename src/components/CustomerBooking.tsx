'use client';

import React, { useState } from 'react';
import {
  CustomerBooking,
  ServiceItem,
  ComboPackage,
  Location,
  AppUser,
  NamePlateSubscription,
  ServiceType,
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

const generateBookingId = () => `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
const generateReceiptNo = () => `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
const generateSubId = () => `SUB-${Math.floor(5000 + Math.random() * 4000)}`;
const generateTagSerial = () => `NPT-${Math.floor(10000 + Math.random() * 89999)}`;

export const CustomerBookingForm: React.FC<CustomerBookingProps> = ({
  onAddBooking,
  setActiveTab,
  services,
  combos,
  locations,
  currentUser,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    currentUser.assignedLocationId || locations[0]?.id || 'LOC-1'
  );
  const userLocation =
    locations.find((l) => l.id === selectedLocationId) || locations[0];

  const supportedServices = userLocation?.supportedServices || ['BURIAL'];
  const canDoBurial = supportedServices.includes('BURIAL');
  const canDoCremation = supportedServices.includes('CREMATION');
  const canDoBoth = canDoBurial && canDoCremation;

  const [serviceType, setServiceType] = useState<ServiceType>(
    canDoBurial ? 'BURIAL' : 'CREMATION'
  );

  // Cremation-specific Preferences
  const [cremationDisposition, setCremationDisposition] = useState<string>(
    'Ceramic Keepsake Urn (Handover to Family)'
  );
  const [cremationWitness, setCremationWitness] = useState<boolean>(true);

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

  // Plot Details State (Slide 2 - for Burial only)
  const [plotSector, setPlotSector] = useState('Sector A');
  const [plotRow, setPlotRow] = useState('A1');
  const [plotSeat, setPlotSeat] = useState('05');

  // Filter Combos & Standalone Services by selected serviceType
  const availableCombos = combos.filter((c) => {
    if (serviceType === 'BURIAL') return c.category !== 'CREMATION';
    if (serviceType === 'CREMATION') return c.category !== 'BURIAL';
    return true;
  });

  const availableServices = services.filter((s) => {
    if (serviceType === 'BURIAL') return s.category !== 'CREMATION';
    if (serviceType === 'CREMATION') return s.category !== 'BURIAL' && s.category !== 'MAINTENANCE';
    return true;
  });

  // Package Selection State (Slide 3)
  const [selectionType, setSelectionType] = useState<'COMBO' | 'STANDALONE'>('COMBO');
  const [selectedComboId, setSelectedComboId] = useState(availableCombos[0]?.id || combos[0]?.id || '');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    serviceType === 'BURIAL' ? ['SRV-101', 'SRV-102'] : ['SRV-103', 'SRV-102']
  );

  const handleLocationChange = (newLocId: string) => {
    setSelectedLocationId(newLocId);
    const loc = locations.find((l) => l.id === newLocId) || locations[0];
    const locServices = loc?.supportedServices || ['BURIAL'];
    if (!locServices.includes(serviceType)) {
      const fallbackType = locServices[0] || 'BURIAL';
      handleServiceTypeChange(fallbackType);
    }
  };

  const handleServiceTypeChange = (newType: ServiceType) => {
    setServiceType(newType);
    const validCombos = combos.filter((c) => {
      if (newType === 'BURIAL') return c.category !== 'CREMATION';
      if (newType === 'CREMATION') return c.category !== 'BURIAL';
      return true;
    });
    if (validCombos.length > 0) {
      setSelectedComboId(validCombos[0].id);
    }
    if (newType === 'BURIAL') {
      setSelectedServiceIds(['SRV-101', 'SRV-102']);
    } else {
      setSelectedServiceIds(['SRV-103', 'SRV-102']);
    }
  };

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

  const selectedCombo = availableCombos.find((c) => c.id === selectedComboId) || availableCombos[0];

  let totalAmount = 0;
  let hasNamePlate = false;

  if (selectionType === 'COMBO' && selectedCombo) {
    totalAmount = selectedCombo.comboPrice;
    hasNamePlate = selectedCombo.includesNamePlate;
  } else {
    totalAmount = selectedServiceIds.reduce((sum, sId) => {
      const s = availableServices.find((srv) => srv.id === sId) || services.find((srv) => srv.id === sId);
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
      if (serviceType === 'BURIAL' && !plotSeat.trim()) {
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
    if (!petName.trim() || (serviceType === 'BURIAL' && !plotSeat.trim())) {
      setCurrentSlide(2);
      setValidationError('Pet & registration details are incomplete.');
      return;
    }

    const bookingId = generateBookingId();
    const receiptNo = generateReceiptNo();
    const todayStr = new Date().toISOString().split('T')[0];
    const cleanRow = plotRow.replace('Row ', '');
    const fullPlotNum = serviceType === 'BURIAL' ? `${cleanRow}-${plotSeat}` : 'CREMATION-URN';
    const finalSector = serviceType === 'BURIAL' ? plotSector : 'Crematorium Facility';

    const newBooking: CustomerBooking = {
      id: bookingId,
      receiptNo,
      locationId: userLocation.id,
      locationName: userLocation.name,
      serviceType,
      customerName,
      customerPhone,
      whatsappNumber: whatsappNumber || customerPhone,
      address,
      petName,
      petType,
      petBreed,
      petAge,
      plotSector: finalSector,
      plotRow: serviceType === 'BURIAL' ? `Row ${cleanRow}` : undefined,
      plotNumber: fullPlotNum,
      selectedServiceIds:
        selectionType === 'STANDALONE' ? selectedServiceIds : (selectedCombo?.bundledServiceIds || []),
      selectedComboPackageId: selectionType === 'COMBO' ? selectedCombo?.id : undefined,
      totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      bookingDate: todayStr,
      hasNamePlate,
      createdByStaff: currentUser.displayName,
      notes:
        serviceType === 'CREMATION'
          ? `Cremation Ceremony • ${cremationDisposition} • ${cremationWitness ? 'Family Attending Viewing Room' : 'Direct Incineration'}`
          : undefined,
    };

    let newSub: NamePlateSubscription | undefined = undefined;
    let qrDataUrl = '';

    if (hasNamePlate) {
      const subId = generateSubId();
      const tagSerial = generateTagSerial();
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiryStr = nextYear.toISOString().split('T')[0];

      const qrPayload = JSON.stringify({
        tagSerial,
        petName,
        customerName,
        serviceType,
        plot: serviceType === 'BURIAL' ? fullPlotNum : `Memorial Plaque (${userLocation.name})`,
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
        plotSector: finalSector,
        plotNumber: fullPlotNum,
        amountPaid: 5000,
        allotmentDate: todayStr,
        expiryDate: expiryStr,
        daysUntilExpiry: 365,
        status: 'ALLOTTED_TODAY',
        isAllottedToday: true,
        qrCodeUrl: qrDataUrl,
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
    {
      number: 2,
      title: serviceType === 'BURIAL' ? 'Pet & Plot Map' : 'Pet & Cremation',
      short: serviceType === 'BURIAL' ? 'Pet & Plot' : 'Pet & Memorial',
      icon: serviceType === 'BURIAL' ? Tv : Flame,
    },
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
              Branch Facility
            </span>
            {currentUser.role === 'ADMIN' ? (
              <select
                aria-label="Select Branch Facility"
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="font-bold text-[#1E293B] bg-transparent border-0 p-0 pr-2 focus:ring-0 cursor-pointer text-xs"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-bold text-[#1E293B]">{userLocation.name}</span>
            )}
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
          {/* SLIDE 1: Customer Personal Information & Service Type Selection */}
          {currentSlide === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Slide 1: Customer Details & Service Type</span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                  Select service category and enter customer contact information
                </h3>
              </div>

              {/* Service Type Selection Section */}
              {canDoBoth ? (
                <div className="space-y-2 bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                      Select Memorial Service Type *
                    </label>
                    <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] border border-blue-200 px-2 py-0.5 rounded-md">
                      Dual-Facility Branch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleServiceTypeChange('BURIAL')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start space-x-3 ${
                        serviceType === 'BURIAL'
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white border-[#CBD5E1] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          serviceType === 'BURIAL'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        🪦
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-[#1E293B]">
                            Ground Burial Service
                          </span>
                          {serviceType === 'BURIAL' && (
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                          Grave plot preparation, casket burial, outdoor ceremony, and ground mounting nameplate.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleServiceTypeChange('CREMATION')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start space-x-3 ${
                        serviceType === 'CREMATION'
                          ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                          : 'bg-white border-[#CBD5E1] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          serviceType === 'CREMATION'
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-[#1E293B]">
                            Dignified Cremation Service
                          </span>
                          {serviceType === 'CREMATION' && (
                            <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                          Private furnace incineration, family viewing room ceremony, and keepsake ash urn.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    {canDoBurial ? (
                      <>
                        <span className="text-xl">🪦</span>
                        <div>
                          <span className="font-bold text-[#1E293B] block">
                            Facility Type: Ground Burial Only
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            This location exclusively provides ground casket burials & plots.
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#1E293B] block">
                            Facility Type: Dedicated Crematorium Only
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            This location exclusively provides private cremation & urn services.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-blue-200 px-2 py-0.5 rounded-md shrink-0">
                    Location Bound
                  </span>
                </div>
              )}

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

          {/* SLIDE 2: Pet Profile & Grave Plot / Cremation Selection */}
          {currentSlide === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E2E8F0] pb-3">
                <div
                  className={`inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider ${
                    serviceType === 'CREMATION' ? 'text-amber-600' : 'text-[#2563EB]'
                  }`}
                >
                  {serviceType === 'CREMATION' ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    <Tv className="w-4 h-4" />
                  )}
                  <span>
                    {serviceType === 'CREMATION'
                      ? 'Slide 2: Pet Profile & Cremation Arrangements'
                      : 'Slide 2: Pet Profile & Grave Plot Allotment'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mt-0.5">
                  {serviceType === 'CREMATION'
                    ? 'Record pet details, select memorial keepsake urn, and family attendance preferences'
                    : 'Record pet details and allocate a designated grave plot seat'}
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

              {/* Conditional: Burial Grave Plot Allotment VS Cremation Memorial Preferences */}
              {serviceType === 'BURIAL' ? (
                <div className="bg-[#EFF6FF]/60 border border-blue-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                    <span className="flex items-center space-x-1.5">
                      <Tv className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Grave Plot Seat Designation</span>
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
                        Plot Row
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
              ) : (
                <div className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                    <span className="flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span>Crematorium Memorial Preferences</span>
                    </span>
                    <span className="font-mono text-amber-800 bg-white border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px]">
                      Dedicated Cremation Facility
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cremation-disposition-select"
                        className="block text-xs font-bold text-[#1E293B] mb-1.5"
                      >
                        Ash Disposition & Memorial Urn *
                      </label>
                      <select
                        id="cremation-disposition-select"
                        value={cremationDisposition}
                        onChange={(e) => setCremationDisposition(e.target.value)}
                        className="w-full min-h-[44px] bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
                      >
                        <option value="Ceramic Keepsake Urn (Handover to Family)">
                          Ceramic Keepsake Urn (Handover to Family)
                        </option>
                        <option value="Eco-Friendly Biodegradable Urn (Soil / Water Soluble)">
                          Eco-Friendly Biodegradable Urn (Soil / Water Soluble)
                        </option>
                        <option value="Premium Marble Urn with Brass Inlay">
                          Premium Marble Urn with Brass Inlay
                        </option>
                        <option value="Scattering in Memorial Garden (No Urn Retention)">
                          Scattering in Memorial Garden (No Urn Retention)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                        Family Viewing & Witness Ceremony *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCremationWitness(true)}
                          className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                            cremationWitness
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          ✓ Attended Viewing
                        </button>
                        <button
                          type="button"
                          onClick={() => setCremationWitness(false)}
                          className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                            !cremationWitness
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          Direct Unattended
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 flex items-center justify-between">
                    <span className="font-semibold">Selected Configuration:</span>
                    <span className="font-medium">
                      {cremationDisposition} • {cremationWitness ? 'Family viewing room ceremony booked' : 'Private direct cremation scheduled'}
                    </span>
                  </div>
                </div>
              )}
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
                availableCombos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableCombos.map((combo) => {
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
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-center text-xs text-[#64748B]">
                    No combo packages found for {serviceType.toLowerCase()} service at this location.
                  </div>
                )
              ) : (
                /* Custom Services Checkbox List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableServices.map((srv) => {
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
                    <span className="text-[#64748B] block text-[11px]">
                      {serviceType === 'BURIAL' ? 'Pet & Allocated Plot:' : 'Pet & Memorial Arrangement:'}
                    </span>
                    <strong className="text-[#1E293B] block font-bold">
                      {petName || '—'} ({petType})
                    </strong>
                    {serviceType === 'BURIAL' ? (
                      <span className="font-mono text-[#2563EB] text-[11px] font-bold">
                        {plotSector} • {plotRow.replace('Row ', '')}-{plotSeat}
                      </span>
                    ) : (
                      <span className="text-amber-800 text-[11px] font-semibold block">
                        Cremation • {cremationWitness ? 'Attended Viewing' : 'Direct Incineration'}
                      </span>
                    )}
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
                    const MethodIcon = method.icon;
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
                        <MethodIcon className="w-5 h-5" />
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
                <span className="text-[#64748B]">
                  {receiptModal.booking.serviceType === 'CREMATION' ? 'Pet & Service:' : 'Pet & Plot:'}
                </span>
                <span className="font-bold text-[#1E293B]">
                  {receiptModal.booking.petName} ({receiptModal.booking.petType}) •{' '}
                  {receiptModal.booking.serviceType === 'CREMATION' ? (
                    <span className="text-amber-700 font-semibold">Cremation Keepsake Urn</span>
                  ) : (
                    <>Plot <span className="font-mono">{receiptModal.booking.plotNumber}</span></>
                  )}
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
                View Plot Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
