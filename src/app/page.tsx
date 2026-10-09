'use client';

import React, { useState } from 'react';
import {
  initialBurials,
  initialSubscriptions,
  initialAuditLogs,
  initialLocations,
  initialUsers,
  initialServicePackages,
} from '../lib/mockData';
import {
  BurialRecord,
  NamePlateSubscription,
  AuditLog,
  Location,
  AppUser,
  ServicePackage,
} from '../lib/types';

import { Navbar } from '../components/Navbar';
import { Dashboard } from '../components/Dashboard';
import { BookingForm } from '../components/BookingForm';
import { PlotGrid } from '../components/PlotGrid';
import { SubscriptionManager } from '../components/SubscriptionManager';
import { AuditScanner } from '../components/AuditScanner';
import { AuditLogs } from '../components/AuditLogs';
import { ServiceManager } from '../components/ServiceManager';
import { StaffManager } from '../components/StaffManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Master Data State
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>(initialServicePackages);

  // Active User Profile State (Default Admin, toggleable via AuthModal)
  const [currentUser, setCurrentUser] = useState<AppUser>(initialUsers[0]);

  // Location Filter State (Default 'ALL' for Admin, or scoped to Staff assignedLocationId)
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');

  // Transaction Records State
  const [burials, setBurials] = useState<BurialRecord[]>(initialBurials);
  const [subscriptions, setSubscriptions] = useState<NamePlateSubscription[]>(initialSubscriptions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Effective location scope for calculations & table filtering
  const activeLocationId =
    currentUser.role === 'ADMIN'
      ? selectedLocationFilter
      : currentUser.assignedLocationId || 'LOC-1';

  // Filtered records based on location scope
  const filteredBurials = burials.filter(
    (b) => activeLocationId === 'ALL' || b.locationId === activeLocationId
  );
  const filteredSubscriptions = subscriptions.filter(
    (s) => activeLocationId === 'ALL' || s.locationId === activeLocationId
  );
  const filteredAuditLogs = auditLogs.filter(
    (a) => activeLocationId === 'ALL' || a.locationId === activeLocationId
  );

  // Handlers
  const handleAddBurial = (newBurial: BurialRecord, newSubscription?: NamePlateSubscription) => {
    setBurials((prev) => [newBurial, ...prev]);
    if (newSubscription) {
      setSubscriptions((prev) => [newSubscription, ...prev]);
    }
  };

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

  const handleLogAudit = (log: AuditLog) => {
    const scopedLog = {
      ...log,
      locationId: activeLocationId === 'ALL' ? 'LOC-1' : activeLocationId,
    };
    setAuditLogs((prev) => [scopedLog, ...prev]);
  };

  const handleAddService = (newPkg: ServicePackage) => {
    setServicePackages((prev) => [newPkg, ...prev]);
  };

  const handleUpdateService = (updatedPkg: ServicePackage) => {
    setServicePackages((prev) =>
      prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
    );
  };

  const handleInviteStaff = (newUser: AppUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleRemoveUser = (uid: string) => {
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  };

  const unauthorizedCount = filteredAuditLogs.filter(
    (a) => a.statusResult === 'UNAUTHORIZED' || a.flaggedForRemoval
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unauthorizedCount={unauthorizedCount}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        availableUsers={users}
        locations={locations}
        selectedLocationFilter={selectedLocationFilter}
        setSelectedLocationFilter={setSelectedLocationFilter}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            burials={filteredBurials}
            subscriptions={filteredSubscriptions}
            auditLogs={filteredAuditLogs}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'booking' && (
          <BookingForm
            onAddBurial={handleAddBurial}
            setActiveTab={setActiveTab}
            servicePackages={servicePackages}
            currentUser={currentUser}
            locations={locations}
          />
        )}

        {activeTab === 'plots' && (
          <PlotGrid
            burials={filteredBurials}
            subscriptions={filteredSubscriptions}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionManager
            subscriptions={filteredSubscriptions}
            onRenew={handleRenewSubscription}
          />
        )}

        {activeTab === 'audit-scanner' && (
          <AuditScanner
            subscriptions={filteredSubscriptions}
            onLogAudit={handleLogAudit}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'audit-logs' && (
          <AuditLogs auditLogs={filteredAuditLogs} />
        )}

        {activeTab === 'services' && currentUser.role === 'ADMIN' && (
          <ServiceManager
            services={servicePackages}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
          />
        )}

        {activeTab === 'staff' && currentUser.role === 'ADMIN' && (
          <StaffManager
            users={users}
            locations={locations}
            onInviteStaff={handleInviteStaff}
            onRemoveUser={handleRemoveUser}
          />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Peaceful Paws Pet Crematorium CRM & Multi-Location Anti-Fraud Automation System</p>
        <p className="mt-1 text-slate-600">
          Firebase Google Auth • Admin Price Master • Location Scoped Staff Operators
        </p>
      </footer>
    </div>
  );
}
