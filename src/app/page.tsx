'use client';

import React, { useState, useEffect } from 'react';
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
  // Master State
  const [locations] = useState<Location[]>(initialLocations);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [services] = useState<ServiceItem[]>(initialServices);
  const [combos, setCombos] = useState<ComboPackage[]>(initialCombos);

  // Active User & Location Filter State
  const [currentUser, setCurrentUser] = useState<AppUser>(initialUsers[0]);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Tab State (enforced by role)
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilterPeriod>('ALL');

  // Transaction Records State
  const [bookings, setBookings] = useState<CustomerBooking[]>(initialBookings);
  const [subscriptions, setSubscriptions] =
    useState<NamePlateSubscription[]>(initialSubscriptions);
  const [, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [, setStats] = useState<RevenueStats>(initialStats);

  // Role changes effect: enforce permissions
  useEffect(() => {
    if (currentUser.role === 'OPERATOR') {
      setActiveTab('booking');
    } else if (currentUser.role === 'MANAGER') {
      if (activeTab === 'packages' || activeTab === 'staff') {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser.role]);

  // Effective location filter:
  // - Admin can view ALL or any specific branch.
  // - Manager and Operator are strictly locked to their assigned branch.
  const activeLocationId =
    currentUser.role === 'ADMIN'
      ? selectedLocationFilter
      : currentUser.assignedLocationId || 'LOC-1';

  const activeLocation = locations.find((l) => l.id === activeLocationId);

  // Global search query
  const q = searchTerm.toLowerCase().trim();

  // Filtered datasets strictly scoped to active branch
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

  // Compute location-specific revenue stats
  const branchBookings = bookings.filter(
    (b) => activeLocationId === 'ALL' || b.locationId === activeLocationId
  );
  const branchTodayRevenue = branchBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const dynamicStats: RevenueStats = {
    todayCollection: branchTodayRevenue,
    sevenDaysCollection: activeLocationId === 'ALL' ? initialStats.sevenDaysCollection : Math.round(branchTodayRevenue * 2.8),
    fifteenDaysCollection: activeLocationId === 'ALL' ? initialStats.fifteenDaysCollection : Math.round(branchTodayRevenue * 5.2),
    thirtyDaysCollection: activeLocationId === 'ALL' ? initialStats.thirtyDaysCollection : Math.round(branchTodayRevenue * 10.5),
    totalAllottedToday: filteredSubscriptions.filter((s) => s.isAllottedToday).length,
    totalRenewedToday: filteredSubscriptions.filter((s) => s.isRenewedToday).length,
    expiringIn1Day: filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 1).length,
    expiringIn7Days: filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 7).length,
    expiringIn15Days: filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 15).length,
    expiringIn30Days: filteredSubscriptions.filter((s) => s.daysUntilExpiry <= 30).length,
  };

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

  // Role permission guard for tab changes
  const handleTabChange = (tab: string) => {
    if (currentUser.role === 'OPERATOR' && tab !== 'booking') {
      return; // Operator cannot access other tabs
    }
    if (currentUser.role === 'MANAGER' && (tab === 'packages' || tab === 'staff')) {
      return; // Manager cannot access admin master tabs
    }
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
          {/* Dashboard (Admin & Manager only) */}
          {activeTab === 'dashboard' && currentUser.role !== 'OPERATOR' && (
            <Dashboard
              bookings={filteredBookings}
              subscriptions={filteredSubscriptions}
              locations={locations}
              stats={dynamicStats}
              currentUser={currentUser}
              setActiveTab={handleTabChange}
              onNavigateSubscriptions={handleNavigateSubscriptions}
              onSelectLocationFromDashboard={(locId) => {
                if (currentUser.role === 'ADMIN') {
                  setSelectedLocationFilter(locId);
                }
              }}
            />
          )}

          {/* New Customer Booking (Admin, Manager, and Operator) */}
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

          {/* Plot Map (Admin & Manager only) */}
          {activeTab === 'cinema-plots' && currentUser.role !== 'OPERATOR' && (
            <CinemaPlotView
              bookings={filteredBookings}
              subscriptions={filteredSubscriptions}
              setActiveTab={handleTabChange}
              locationName={activeLocation?.name || 'All Branches'}
            />
          )}

          {/* Subscriptions Hub (Admin & Manager only) */}
          {activeTab === 'subscriptions' && currentUser.role !== 'OPERATOR' && (
            <NamePlateSubscriptions
              subscriptions={filteredSubscriptions}
              onRenew={handleRenewSubscription}
              initialFilterPeriod={subscriptionFilter}
              globalSearchTerm={searchTerm}
            />
          )}

          {/* Field Audit Scanner (Admin & Manager only) */}
          {activeTab === 'audit' && currentUser.role !== 'OPERATOR' && (
            <AuditScanner
              subscriptions={filteredSubscriptions}
              onLogAudit={handleLogAudit}
              setActiveTab={handleTabChange}
            />
          )}

          {/* Packages Master (Admin only) */}
          {activeTab === 'packages' && currentUser.role === 'ADMIN' && (
            <ServicePackageAdmin
              services={services}
              combos={combos}
              onAddCombo={handleAddCombo}
            />
          )}

          {/* Staff Manager (Admin only) */}
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
          Peaceful Paws CRM • Multi-Branch Pet Memorial & Grave Plot Allotment System
        </footer>
      </div>
    </div>
  );
}
