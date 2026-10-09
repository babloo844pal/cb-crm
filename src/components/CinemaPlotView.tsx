'use client';

import React, { useState } from 'react';
import { CustomerBooking, NamePlateSubscription } from '../lib/types';
import { Tv, MapPin, Tag, Clock, User, Phone, Send, CheckCircle, Sparkles, Filter, ShieldAlert } from 'lucide-react';

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
  const seatsPerRow = 10; // 10 seats per row = 40 seats per sector layout like a cinema hall

  const sectorPrefix = selectedSector === 'Sector A' ? 'A' : selectedSector === 'Sector B' ? 'B' : 'C';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Cinema Hall Style Grave Plot Map</h2>
            <p className="text-xs text-slate-500">
              Interactive seat grid view showing real-time plot occupancy, name plate allocations, and upcoming expirations.
            </p>
          </div>
        </div>

        {/* Sector Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {['Sector A', 'Sector B', 'Sector C'].map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                selectedSector === sector
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Quick Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">Seat Legend:</span>
          
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-2xs"></span>
            <span className="font-bold text-slate-700">Free / Vacant</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 shadow-2xs"></span>
            <span className="font-bold text-slate-700">Occupied (Paid Plate)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-2xs animate-pulse"></span>
            <span className="font-bold text-slate-700">Expiring Soon (1-30d)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shadow-2xs"></span>
            <span className="font-bold text-slate-700">Allotted / Renewed Today</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['ALL', 'FREE', 'OCCUPIED', 'EXPIRING'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSeatFilter(st)}
              className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition ${
                seatFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cinema Hall Stage Screen Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
        <div className="w-full py-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-center rounded-xl font-extrabold text-xs tracking-widest uppercase text-white shadow-inner">
          🌸 MEMORIAL ENTRANCE & SECTOR SCREEN 🌸
        </div>

        {/* Rows Layout */}
        <div className="space-y-6 max-w-4xl mx-auto py-2">
          {rows.map((rowName, rIdx) => {
            const rowCode = `${sectorPrefix}${rIdx + 1}`;

            return (
              <div key={rowName} className="flex items-center space-x-4">
                {/* Row Label */}
                <div className="w-16 font-mono font-bold text-xs text-slate-400 text-right shrink-0">
                  {rowCode}
                </div>

                {/* Seats Container */}
                <div className="flex-1 grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                  {Array.from({ length: seatsPerRow }).map((_, sIdx) => {
                    const seatNumStr = sIdx + 1 < 10 ? `0${sIdx + 1}` : `${sIdx + 1}`;
                    const plotNumber = `${rowCode}-${seatNumStr}`;

                    const booking = bookings.find(
                      (b) => b.plotSector === selectedSector && b.plotNumber === plotNumber
                    );
                    const subscription = subscriptions.find(
                      (s) => s.plotSector === selectedSector && s.plotNumber === plotNumber
                    );

                    let seatBg = 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-600';
                    let statusLabel = 'FREE';

                    if (booking) {
                      if (subscription) {
                        if (subscription.isAllottedToday || subscription.isRenewedToday) {
                          seatBg = 'bg-purple-600 hover:bg-purple-500 text-white border-purple-700 ring-2 ring-purple-400/40';
                          statusLabel = 'TODAY';
                        } else if (subscription.daysUntilExpiry <= 30) {
                          seatBg = 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border-amber-600 animate-pulse';
                          statusLabel = 'EXPIRING';
                        } else {
                          seatBg = 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700';
                          statusLabel = 'PAID';
                        }
                      } else {
                        seatBg = 'bg-sky-600 hover:bg-sky-500 text-white border-sky-700';
                        statusLabel = 'BURIED';
                      }
                    }

                    // Apply filter
                    if (seatFilter === 'FREE' && booking) return null;
                    if (seatFilter === 'OCCUPIED' && !booking) return null;
                    if (seatFilter === 'EXPIRING' && (!subscription || subscription.daysUntilExpiry > 30)) return null;

                    return (
                      <button
                        key={plotNumber}
                        onClick={() =>
                          setSelectedSeat({
                            plotNumber,
                            rowName,
                            seatNum: seatNumStr,
                            booking,
                            subscription,
                          })
                        }
                        className={`p-2.5 rounded-xl border font-mono text-center flex flex-col items-center justify-center transition-all transform hover:scale-105 shadow-md ${seatBg}`}
                      >
                        <span className="font-extrabold text-xs">{seatNumStr}</span>
                        <span className="text-[9px] font-bold opacity-80">{statusLabel}</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedSector}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Seat Plot {selectedSeat.plotNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-xl"
              >
                Close
              </button>
            </div>

            {selectedSeat.booking ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pet Name:</span>
                    <span className="font-extrabold text-slate-900">{selectedSeat.booking.petName} ({selectedSeat.booking.petType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <span className="font-bold text-slate-800">{selectedSeat.booking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WhatsApp Phone:</span>
                    <span className="font-mono font-bold text-emerald-700">{selectedSeat.booking.whatsappNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="text-slate-700 font-medium">{selectedSeat.booking.address}</span>
                  </div>
                </div>

                {selectedSeat.subscription ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between font-extrabold text-emerald-950 border-b border-emerald-200 pb-2">
                      <span>Name Plate Subscription</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                        {selectedSeat.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tag Serial:</span>
                      <span className="font-mono font-extrabold text-emerald-800">{selectedSeat.subscription.tagSerial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Expiry Date:</span>
                      <span className="font-mono font-bold text-amber-700">{selectedSeat.subscription.expiryDate}</span>
                    </div>

                    {/* WhatsApp Action Button */}
                    <a
                      href={`https://wa.me/${selectedSeat.subscription.whatsappNumber.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(selectedSeat.subscription.customerName)},%20your%20Name%20Plate%20Subscription%20for%20${encodeURIComponent(selectedSeat.subscription.petName)}%20(Plot%20${selectedSeat.plotNumber})%20expires%20on%20${selectedSeat.subscription.expiryDate}.%20Please%20renew%20₹5,000.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center space-x-2 transition shadow-md mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send WhatsApp Payment Link</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    No name plate subscription registered.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-slate-500">This Cinema Seat Plot is <strong>FREE & AVAILABLE</strong> for booking.</p>
                <button
                  onClick={() => {
                    setSelectedSeat(null);
                    setActiveTab('booking');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition shadow-md"
                >
                  Book New Customer Here
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
