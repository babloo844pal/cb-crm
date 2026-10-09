'use client';

import React, { useState } from 'react';
import {
  initialBookings,
  initialSubscriptions,
  initialAuditLogs,
  initialLocations,
  initialUsers,
  initialServices,
  initialCombos,
  initialStats,
} from '../lib/mockData';

import {
  CustomerBooking,
  NamePlateSubscription,
  AuditLog,
  Location,
  AppUser,
  ServiceItem,
  ComboPackage,
  RevenueStats,
} from '../lib/types';

import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { CustomerBookingForm } from '../components/CustomerBooking';
import { CinemaPlotView } from '../components/CinemaPlotView';
import { NamePlateSubscriptions } from '../components/NamePlateSubscriptions';
import { AuditScanner } from '../components/AuditScanner';
import { ServicePackageAdmin } from '../components/ServicePackageAdmin';
import { StaffManager } from '../components/StaffManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Master State
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [combos, setCombos] = useState<ComboPackage[]>(initialCombos);

  // Active User & Location Filter State
  const [currentUser, setCurrentUser] = useState<AppUser>(initialUsers[0]);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Transaction Records State
  const [bookings, setBookings] = useState<CustomerBooking[]>(initialBookings);
  const [subscriptions, setSubscriptions] = useState<NamePlateSubscription[]>(initialSubscriptions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [stats, setStats] = useState<RevenueStats>(initialStats);

  // Effective location filter
  const activeLocationId =
    currentUser.role === 'ADMIN'
      ? selectedLocationFilter
      : currentUser.assignedLocationId || 'LOC-1';

  // Filtered datasets
  const filteredBookings = bookings.filter(
    (b) => activeLocationId === 'ALL' || b.locationId === activeLocationId
  );
  const filteredSubscriptions = subscriptions.filter(
    (s) => activeLocationId === 'ALL' || s.locationId === activeLocationId
  );
  const filteredAuditLogs = auditLogs.filter(
    (a) => activeLocationId === 'ALL' || a.locationId === activeLocationId
  );

  const expiringCount = filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 30).length;

  // Handlers
  const handleAddBooking = (newBooking: CustomerBooking, newSub?: NamePlateSubscription) => {
    setBookings((prev) => [newBooking, ...prev]);
    if (newSub) {
      setSubscriptions((prev) => [newSub, ...prev]);
    }
    // Update stats
    setStats((prev) => ({
      ...prev,
      todayCollection: prev.todayCollection + newBooking.totalAmount,
      totalAllottedToday: newSub ? prev.totalAllottedToday + 1 : prev.totalAllottedToday,
    }));
  };

  const handleRenewSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const currentExp = new Date(sub.expiryDate);
          currentExp.setFullYear(currentExp.getFullYear() + 1);
          return {
            ...sub,
            expiryDate: currentExp.toISOString().split('T')[0],
            daysUntilExpiry: 365,
            status: 'RENEWED_TODAY',
            isRenewedToday: true,
            amountPaid: sub.amountPaid + 5000,
          };
        }
        return sub;
      })
    );

    setStats((prev) => ({
      ...prev,
      todayCollection: prev.todayCollection + 5000,
      totalRenewedToday: prev.totalRenewedToday + 1,
    }));
  };

  const handleLogAudit = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleAddCombo = (newCombo: ComboPackage) => {
    setCombos((prev) => [newCombo, ...prev]);
  };

  const handleInviteStaff = (newUser: AppUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleRemoveUser = (uid: string) => {
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        locations={locations}
        selectedLocationFilter={selectedLocationFilter}
        setSelectedLocationFilter={setSelectedLocationFilter}
        expiringCount={expiringCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          availableUsers={users}
          locations={locations}
          selectedLocationFilter={selectedLocationFilter}
          setSelectedLocationFilter={setSelectedLocationFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expiringCount={expiringCount}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              bookings={filteredBookings}
              subscriptions={filteredSubscriptions}
              locations={locations}
              stats={stats}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'booking' && (
            <CustomerBookingForm
              onAddBooking={handleAddBooking}
              setActiveTab={setActiveTab}
              services={services}
              combos={combos}
              locations={locations}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'cinema-plots' && (
            <CinemaPlotView
              bookings={filteredBookings}
              subscriptions={filteredSubscriptions}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'subscriptions' && (
            <NamePlateSubscriptions
              subscriptions={filteredSubscriptions}
              onRenew={handleRenewSubscription}
            />
          )}

          {activeTab === 'audit' && (
            <AuditScanner
              subscriptions={filteredSubscriptions}
              onLogAudit={handleLogAudit}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'packages' && currentUser.role === 'ADMIN' && (
            <ServicePackageAdmin
              services={services}
              combos={combos}
              onAddCombo={handleAddCombo}
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

        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium">
          Peaceful Paws CRM • Multi-Branch Pet Crematorium & Cinema Plot Seat Automation System
        </footer>
      </div>
    </div>
  );
}
