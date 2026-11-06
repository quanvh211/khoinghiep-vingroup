import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Package, LayoutDashboard, Archive, ClipboardList, Truck, Settings, Bell, LogOut, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/account', label: 'Tổng quan', icon: <LayoutDashboard className="w-4 h-4"/> },
  { to: '/account/storage', label: 'Đồ lưu trữ', icon: <Archive className="w-4 h-4"/> },
  { to: '/account/orders', label: 'Lịch sử đơn', icon: <ClipboardList className="w-4 h-4"/> },
  { to: '/account/delivery', label: 'Lịch giao nhận', icon: <Truck className="w-4 h-4"/> },
  { to: '/account/notifications', label: 'Thông báo', icon: <Bell className="w-4 h-4"/> },
  { to: '/account/settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4"/> },
];

export function AccountLayout() {
  const { currentUser, currentCustomer, logout, notifications } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'customer') return <Navigate to="/login?redirect=/account"/>;

  const unread = notifications.filter(n => !n.read && n.userId === currentUser.id).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 font-bold text-[#1e3a5f]">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white"/>
            </div>
            KEEPBOX
          </Link>
        </div>
        {/* Customer info */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
              {currentCustomer?.name[0] ?? 'K'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{currentCustomer?.name}</div>
              <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/account'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                isActive
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.icon}
              {link.label}
              {link.to === '/account/notifications' && unread > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4"/> Đăng xuất
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl">
            <Menu className="w-5 h-5"/>
          </button>
          <span className="font-bold text-[#1e3a5f]">Tài khoản</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

