'use client';

import React, { useState } from 'react';
import { CustomerBooking, NamePlateSubscription } from '../lib/types';
import { Tv, Send, Compass, X } from 'lucide-react';

interface CinemaPlotViewProps {
  bookings: CustomerBooking[];
  subscriptions: NamePlateSubscription[];
  setActiveTab: (tab: string) => void;
}

export const CinemaPlotView: React.FC<CinemaPlotViewProps> = ({
  bookings,
  subscriptions,
  setActiveTab,
}) => {
  const [selectedSector, setSelectedSector] = useState('Sector A');
  const [seatFilter, setSeatFilter] = useState<'ALL' | 'FREE' | 'OCCUPIED' | 'EXPIRING'>('ALL');

  const [selectedSeat, setSelectedSeat] = useState<{
    plotNumber: string;
    rowName: string;
    seatNum: string;
    booking?: CustomerBooking;
    subscription?: NamePlateSubscription;
  } | null>(null);

  const rows = ['Row 1', 'Row 2', 'Row 3', 'Row 4'];
  const seatsPerRow = 10;

  const sectorPrefix =
    selectedSector === 'Sector A' ? 'A' : selectedSector === 'Sector B' ? 'B' : 'C';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#2563EB] text-white rounded-xl shadow-xs flex items-center justify-center shrink-0">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
              Cinema Hall Style Grave Plot Map
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Interactive seat grid showing real-time plot occupancy, name plate allocations, and upcoming expirations.
            </p>
          </div>
        </div>

        {/* Sector Selector Tabs */}
        <div
          className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] self-start md:self-center"
          role="tablist"
          aria-label="Cemetery sector selector"
        >
          {['Sector A', 'Sector B', 'Sector C'].map((sector) => {
            const isSelected = selectedSector === sector;
            return (
              <button
                key={sector}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedSector(sector)}
                className={`min-h-[38px] px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#1E293B]'
                }`}
              >
                {sector}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Quick Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-[#475569] uppercase tracking-wider text-[11px]">
            Plot Status Legend:
          </span>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border-2 border-emerald-500" />
            <span className="font-semibold text-[#1E293B]">Free / Vacant</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#2563EB]" />
            <span className="font-semibold text-[#1E293B]">Occupied (Paid Plate)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500" />
            <span className="font-semibold text-[#1E293B]">Expiring Soon (1-30d)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#EA580C]" />
            <span className="font-semibold text-[#1E293B]">Allotted / Renewed Today</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
          {(['ALL', 'FREE', 'OCCUPIED', 'EXPIRING'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSeatFilter(st)}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                seatFilter === st
                  ? 'bg-[#1E293B] text-white shadow-2xs'
                  : 'text-[#475569] hover:text-[#1E293B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cinema Hall Stage Screen Container (Clean Light Architectural Card) */}
      <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
        <div className="w-full py-2.5 bg-gradient-to-r from-[#EFF6FF] via-blue-100/80 to-[#EFF6FF] border border-blue-200 text-center rounded-xl font-bold text-xs tracking-widest uppercase text-[#2563EB] flex items-center justify-center space-x-2">
          <Compass className="w-4 h-4" />
          <span>MEMORIAL GARDEN WALKWAY & ENTRANCE ({selectedSector})</span>
        </div>

        {/* Rows Layout */}
        <div className="space-y-4 max-w-4xl mx-auto py-2 overflow-x-auto">
          {rows.map((rowName, rIdx) => {
            const rowCode = `${sectorPrefix}${rIdx + 1}`;

            return (
              <div key={rowName} className="flex items-center space-x-3 sm:space-x-4 min-w-[540px] sm:min-w-0">
                {/* Row Label */}
                <div className="w-12 sm:w-16 font-mono font-bold text-xs text-[#64748B] text-right shrink-0">
                  {rowCode}
                </div>

                {/* Seats Container */}
                <div className="flex-1 grid grid-cols-10 gap-2 sm:gap-2.5">
                  {Array.from({ length: seatsPerRow }).map((_, sIdx) => {
                    const seatNumStr = sIdx + 1 < 10 ? `0${sIdx + 1}` : `${sIdx + 1}`;
                    const plotNumber = `${rowCode}-${seatNumStr}`;

                    const booking = bookings.find(
                      (b) => b.plotSector === selectedSector && b.plotNumber === plotNumber
                    );
                    const subscription = subscriptions.find(
                      (s) => s.plotSector === selectedSector && s.plotNumber === plotNumber
                    );

                    let seatBg =
                      'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-300';
                    let statusLabel = 'FREE';

                    if (booking) {
                      if (subscription) {
                        if (subscription.isAllottedToday || subscription.isRenewedToday) {
                          seatBg =
                            'bg-[#EA580C] hover:bg-[#C2410C] text-white border-[#C2410C] ring-2 ring-orange-300';
                          statusLabel = 'TODAY';
                        } else if (subscription.daysUntilExpiry <= 30) {
                          seatBg =
                            'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
                          statusLabel = 'EXPIRING';
                        } else {
                          seatBg =
                            'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-[#1D4ED8]';
                          statusLabel = 'PAID';
                        }
                      } else {
                        seatBg = 'bg-sky-600 hover:bg-sky-700 text-white border-sky-700';
                        statusLabel = 'OCCUPIED';
                      }
                    }

                    if (seatFilter === 'FREE' && booking) return null;
                    if (seatFilter === 'OCCUPIED' && !booking) return null;
                    if (
                      seatFilter === 'EXPIRING' &&
                      (!subscription || subscription.daysUntilExpiry > 30)
                    )
                      return null;

                    return (
                      <button
                        key={plotNumber}
                        type="button"
                        onClick={() =>
                          setSelectedSeat({
                            plotNumber,
                            rowName,
                            seatNum: seatNumStr,
                            booking,
                            subscription,
                          })
                        }
                        aria-label={`Plot ${plotNumber}, status ${statusLabel}`}
                        className={`min-h-[48px] p-2 rounded-xl border font-mono text-center flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-2xs cursor-pointer ${seatBg}`}
                      >
                        <span className="font-bold text-xs leading-tight">{seatNumStr}</span>
                        <span className="text-[9px] font-bold opacity-90 leading-tight mt-0.5">
                          {statusLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Inspector Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#1E293B] border border-[#E2E8F0] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] border border-blue-200 px-2.5 py-0.5 rounded-md">
                  {selectedSector}
                </span>
                <h3 className="font-bold text-lg text-[#1E293B] mt-1 font-mono">
                  Plot {selectedSeat.plotNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeat(null)}
                aria-label="Close plot inspector"
                className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-xl hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedSeat.booking ? (
              <div className="space-y-4 text-xs">
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Pet Name:</span>
                    <span className="font-bold text-[#1E293B]">
                      {selectedSeat.booking.petName} ({selectedSeat.booking.petType})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Customer Name:</span>
                    <span className="font-bold text-[#1E293B]">
                      {selectedSeat.booking.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">WhatsApp Phone:</span>
                    <span className="font-mono font-bold text-[#2563EB]">
                      {selectedSeat.booking.whatsappNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Address:</span>
                    <span className="text-[#475569] font-medium text-right max-w-[200px]">
                      {selectedSeat.booking.address}
                    </span>
                  </div>
                </div>

                {selectedSeat.subscription ? (
                  <div className="bg-[#EFF6FF] border border-blue-200 p-4 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-[#1E293B] border-b border-blue-200 pb-2">
                      <span>Name Plate Subscription</span>
                      <span className="text-[10px] bg-[#2563EB] text-white px-2 py-0.5 rounded-md font-mono font-bold">
                        {selectedSeat.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Tag Serial:</span>
                      <span className="font-mono font-bold text-[#2563EB]">
                        {selectedSeat.subscription.tagSerial}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Expiry Date:</span>
                      <span className="font-mono font-bold text-amber-800">
                        {selectedSeat.subscription.expiryDate}
                      </span>
                    </div>

                    {/* WhatsApp Action Button */}
                    <a
                      href={`https://wa.me/${selectedSeat.subscription.whatsappNumber.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(selectedSeat.subscription.customerName)},%20your%20Name%20Plate%20Subscription%20for%20${encodeURIComponent(selectedSeat.subscription.petName)}%20(Plot%20${selectedSeat.plotNumber})%20expires%20on%20${selectedSeat.subscription.expiryDate}.%20Please%20renew%20₹5,000.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[42px] py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-center text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send WhatsApp Payment Link</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#64748B]">
                    No active name plate subscription registered for this plot.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-[#475569]">
                  Plot <strong className="font-mono text-[#1E293B]">{selectedSeat.plotNumber}</strong> is{' '}
                  <strong className="text-emerald-700">VACANT & AVAILABLE</strong> for allotment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeat(null);
                    setActiveTab('booking');
                  }}
                  className="w-full min-h-[44px] py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Allot Plot & Register Customer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
