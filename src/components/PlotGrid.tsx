'use client';

import React, { useState } from 'react';
import { BurialRecord, NamePlateSubscription } from '../lib/types';
import { MapPin, ShieldCheck, ShieldAlert, User, Calendar, Tag, CheckCircle2, XCircle } from 'lucide-react';

interface PlotGridProps {
  burials: BurialRecord[];
  subscriptions: NamePlateSubscription[];
  setActiveTab: (tab: string) => void;
}

export const PlotGrid: React.FC<PlotGridProps> = ({ burials, subscriptions, setActiveTab }) => {
  const [selectedSector, setSelectedSector] = useState('Sector A');
  const [selectedPlot, setSelectedPlot] = useState<{
    plotNumber: string;
    burial?: BurialRecord;
    subscription?: NamePlateSubscription;
  } | null>(null);

  // Generate 20 plots per sector
  const sectorPlots = Array.from({ length: 20 }, (_, i) => {
    const num = i + 1;
    const prefix = selectedSector === 'Sector A' ? 'A' : selectedSector === 'Sector B' ? 'B' : 'C';
    const plotNumber = `${prefix}-${num < 10 ? '0' + num : num}`;

    const burial = burials.find((b) => b.plotSector === selectedSector && b.plotNumber === plotNumber);
    const subscription = subscriptions.find((s) => s.plotSector === selectedSector && s.plotNumber === plotNumber);

    return {
      plotNumber,
      burial,
      subscription,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-inner">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Cemetery Plot Grid Map</h2>
            <p className="text-xs text-slate-400">
              Visual spatial mapping of grave plots & real-time Name Plate subscription validity.
            </p>
          </div>
        </div>

        {/* Sector Selector */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 space-x-1">
          {['Sector A', 'Sector B', 'Sector C'].map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                selectedSector === sector
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-300">Plot Status Legend:</span>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
          <span className="text-slate-300">Active Name Plate (Paid ₹5,000/yr)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
          <span className="text-slate-300">Subscription Expired / Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-sm"></span>
          <span className="text-slate-300">Occupied (No Name Plate)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-slate-700 inline-block border border-slate-600"></span>
          <span className="text-slate-400">Vacant Plot</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center justify-between">
          <span>{selectedSector} Map Layout</span>
          <span className="text-xs text-slate-400">Click any plot card to view owner & subscription details</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {sectorPlots.map((plot) => {
            const isOccupied = !!plot.burial;
            const sub = plot.subscription;
            let statusColor = 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-400';
            let badgeText = 'Vacant';
            let badgeClass = 'bg-slate-700/50 text-slate-400';

            if (isOccupied) {
              if (sub?.status === 'ACTIVE') {
                statusColor = 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-600/50 text-emerald-100';
                badgeText = 'Paid Plate';
                badgeClass = 'bg-emerald-600 text-white';
              } else if (sub?.status === 'EXPIRED' || sub?.status === 'PENDING_RENEWAL') {
                statusColor = 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-600/50 text-amber-100';
                badgeText = 'Expired Plate';
                badgeClass = 'bg-amber-600 text-white';
              } else {
                statusColor = 'bg-sky-950/40 hover:bg-sky-900/50 border-sky-600/50 text-sky-100';
                badgeText = 'Buried';
                badgeClass = 'bg-sky-600 text-white';
              }
            }

            return (
              <div
                key={plot.plotNumber}
                onClick={() => setSelectedPlot(plot)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between h-28 ${statusColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm">{plot.plotNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>

                {isOccupied ? (
                  <div>
                    <div className="font-bold text-xs truncate">{plot.burial?.petName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{plot.burial?.ownerName}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">Available Plot</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-lg text-emerald-400">
                  Plot Details: {selectedPlot.plotNumber} ({selectedSector})
                </h3>
                <span className="text-xs text-slate-400">Peaceful Paws Registered Plot</span>
              </div>
              <button
                onClick={() => setSelectedPlot(null)}
                className="text-slate-400 hover:text-white text-sm bg-slate-700 px-2 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            {selectedPlot.burial ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pet Name:</span>
                    <span className="font-bold text-slate-200">{selectedPlot.burial.petName} ({selectedPlot.burial.petSpecies})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Name:</span>
                    <span className="font-bold text-slate-200">{selectedPlot.burial.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="font-bold text-slate-200">{selectedPlot.burial.ownerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Burial Date:</span>
                    <span className="font-mono text-slate-300">{selectedPlot.burial.burialDate}</span>
                  </div>
                </div>

                {selectedPlot.subscription ? (
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-200 border-b border-slate-800 pb-2">
                      <span>Name Plate Subscription</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          selectedPlot.subscription.status === 'ACTIVE'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {selectedPlot.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tag Serial:</span>
                      <span className="font-mono font-bold text-emerald-400">{selectedPlot.subscription.tagSerial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Fee Paid:</span>
                      <span className="font-semibold text-slate-200">₹{selectedPlot.subscription.amountPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expiry Date:</span>
                      <span className="font-mono text-amber-400">{selectedPlot.subscription.expiryDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-sky-950/30 border border-sky-800/50 p-4 rounded-xl text-sky-200">
                    <p className="font-semibold text-xs">No Name Plate Subscription Registered</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      This grave plot does not have an active name plate subscription. Any physical name plate mounted here must be verified by ground audit.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-3">
                <p>This plot is vacant and ready for new burial booking.</p>
                <button
                  onClick={() => {
                    setSelectedPlot(null);
                    setActiveTab('booking');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Book New Burial Here
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
