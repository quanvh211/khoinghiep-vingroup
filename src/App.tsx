import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AccountLayout } from './pages/account/AccountLayout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Customer pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import SupportPage from './pages/SupportPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

// Account pages
import AccountOverview from './pages/account/AccountOverview';
import AccountStorage from './pages/account/AccountStorage';
import AccountOrders from './pages/account/AccountOrders';
import AccountDelivery from './pages/account/AccountDelivery';
import AccountNotifications from './pages/account/AccountNotifications';
import AccountSettings from './pages/account/AccountSettings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminWarehouse from './pages/admin/AdminWarehouse';
import AdminLogistics from './pages/admin/AdminLogistics';
import AdminPayments from './pages/admin/AdminPayments';
import AdminPricing from './pages/admin/AdminPricing';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer website */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          {/* Customer account */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="storage" element={<AccountStorage />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="delivery" element={<AccountDelivery />} />
            <Route path="notifications" element={<AccountNotifications />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="warehouse" element={<AdminWarehouse />} />
            <Route path="logistics" element={<AdminLogistics />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
