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
import { Dashboard, SubscriptionFilterPeriod } from '../components/Dashboard';
import { CustomerBookingForm } from '../components/CustomerBooking';
import { CinemaPlotView } from '../components/CinemaPlotView';
import { NamePlateSubscriptions } from '../components/NamePlateSubscriptions';
import { AuditScanner } from '../components/AuditScanner';
import { ServicePackageAdmin } from '../components/ServicePackageAdmin';
import { StaffManager } from '../components/StaffManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilterPeriod>('ALL');

  // Master State
  const [locations] = useState<Location[]>(initialLocations);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [services] = useState<ServiceItem[]>(initialServices);
  const [combos, setCombos] = useState<ComboPackage[]>(initialCombos);

  // Active User & Location Filter State
  const [currentUser, setCurrentUser] = useState<AppUser>(initialUsers[0]);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Transaction Records State
  const [bookings, setBookings] = useState<CustomerBooking[]>(initialBookings);
  const [subscriptions, setSubscriptions] =
    useState<NamePlateSubscription[]>(initialSubscriptions);
  const [, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [stats, setStats] = useState<RevenueStats>(initialStats);

  // Effective location filter
  const activeLocationId =
    currentUser.role === 'ADMIN'
      ? selectedLocationFilter
      : currentUser.assignedLocationId || 'LOC-1';

  // Global search helper
  const q = searchTerm.toLowerCase().trim();

  // Filtered datasets
  const filteredBookings = bookings.filter((b) => {
    const matchesLoc = activeLocationId === 'ALL' || b.locationId === activeLocationId;
    const matchesQuery =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.petName.toLowerCase().includes(q) ||
      b.plotNumber.toLowerCase().includes(q) ||
      b.receiptNo.toLowerCase().includes(q);
    return matchesLoc && matchesQuery;
  });

  const filteredSubscriptions = subscriptions.filter((s) => {
    const matchesLoc = activeLocationId === 'ALL' || s.locationId === activeLocationId;
    return matchesLoc;
  });

  const expiringCount = filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 30).length;

  // Handlers
  const handleAddBooking = (newBooking: CustomerBooking, newSub?: NamePlateSubscription) => {
    setBookings((prev) => [newBooking, ...prev]);
    if (newSub) {
      setSubscriptions((prev) => [newSub, ...prev]);
    }
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

  const handleNavigateSubscriptions = (filter: SubscriptionFilterPeriod) => {
    setSubscriptionFilter(filter);
    setActiveTab('subscriptions');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'subscriptions' && activeTab !== 'subscriptions') {
      setSubscriptionFilter('ALL');
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex font-sans antialiased">
      {/* Responsive Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        locations={locations}
        selectedLocationFilter={selectedLocationFilter}
        setSelectedLocationFilter={setSelectedLocationFilter}
        expiringCount={expiringCount}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          availableUsers={users}
          locations={locations}
          selectedLocationFilter={selectedLocationFilter}
          setSelectedLocationFilter={setSelectedLocationFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expiringCount={expiringCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              bookings={filteredBookings}
              subscriptions={filteredSubscriptions}
              locations={locations}
              stats={stats}
              setActiveTab={handleTabChange}
              onNavigateSubscriptions={handleNavigateSubscriptions}
              onSelectLocationFromDashboard={(locId) => {
                if (currentUser.role === 'ADMIN') {
                  setSelectedLocationFilter(locId);
                }
              }}
            />
          )}

          {activeTab === 'booking' && (
            <CustomerBookingForm
              onAddBooking={handleAddBooking}
              setActiveTab={handleTabChange}
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
              setActiveTab={handleTabChange}
            />
          )}

          {activeTab === 'subscriptions' && (
            <NamePlateSubscriptions
              subscriptions={filteredSubscriptions}
              onRenew={handleRenewSubscription}
              initialFilterPeriod={subscriptionFilter}
              globalSearchTerm={searchTerm}
            />
          )}

          {activeTab === 'audit' && (
            <AuditScanner
              subscriptions={filteredSubscriptions}
              onLogAudit={handleLogAudit}
              setActiveTab={handleTabChange}
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

        <footer className="bg-white/90 backdrop-blur-md border-t border-[#E2E8F0] py-3.5 sm:py-4 text-center text-xs text-[#64748B] font-medium px-4">
          Peaceful Paws CRM • Multi-Branch Pet Crematorium & Cinema Plot Seat Automation System
        </footer>
      </div>
    </div>
  );
}
