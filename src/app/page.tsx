'use client';

import React, { useState } from 'react';
import { initialBurials, initialSubscriptions, initialAuditLogs } from '../lib/mockData';
import { BurialRecord, NamePlateSubscription, AuditLog } from '../lib/types';
import { Navbar } from '../components/Navbar';
import { Dashboard } from '../components/Dashboard';
import { BookingForm } from '../components/BookingForm';
import { PlotGrid } from '../components/PlotGrid';
import { SubscriptionManager } from '../components/SubscriptionManager';
import { AuditScanner } from '../components/AuditScanner';
import { AuditLogs } from '../components/AuditLogs';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [burials, setBurials] = useState<BurialRecord[]>(initialBurials);
  const [subscriptions, setSubscriptions] = useState<NamePlateSubscription[]>(initialSubscriptions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Add new burial and optional subscription
  const handleAddBurial = (newBurial: BurialRecord, newSubscription?: NamePlateSubscription) => {
    setBurials((prev) => [newBurial, ...prev]);
    if (newSubscription) {
      setSubscriptions((prev) => [newSubscription, ...prev]);
    }
  };

  // Renew subscription by 1 year (₹5,000)
  const handleRenewSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const currentExp = new Date(sub.expiryDate);
          currentExp.setFullYear(currentExp.getFullYear() + 1);
          const newExpStr = currentExp.toISOString().split('T')[0];

          return {
            ...sub,
            expiryDate: newExpStr,
            status: 'ACTIVE',
            amountPaid: sub.amountPaid + 5000,
          };
        }
        return sub;
      })
    );
  };

  // Log new supervisor ground audit
  const handleLogAudit = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev]);
  };

  const unauthorizedCount = auditLogs.filter(
    (a) => a.statusResult === 'UNAUTHORIZED' || a.flaggedForRemoval
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unauthorizedCount={unauthorizedCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            burials={burials}
            subscriptions={subscriptions}
            auditLogs={auditLogs}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'booking' && (
          <BookingForm
            onAddBurial={handleAddBurial}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'plots' && (
          <PlotGrid
            burials={burials}
            subscriptions={subscriptions}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionManager
            subscriptions={subscriptions}
            onRenew={handleRenewSubscription}
          />
        )}

        {activeTab === 'audit-scanner' && (
          <AuditScanner
            subscriptions={subscriptions}
            onLogAudit={handleLogAudit}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'audit-logs' && (
          <AuditLogs auditLogs={auditLogs} />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Peaceful Paws Pet Crematorium CRM & Anti-Fraud Name Plate Automation System Prototype</p>
        <p className="mt-1 text-slate-600">Built for Automated 1-Year Name Plate Subscriptions & Supervisor Field Verification</p>
      </footer>
    </div>
  );
}
