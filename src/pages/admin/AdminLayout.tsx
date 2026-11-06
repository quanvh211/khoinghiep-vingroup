import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  LayoutDashboard, Users, ClipboardList, Warehouse, Truck,
  CreditCard, BarChart2, MessageSquare, Settings, Package,
  Bell, Search, LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

const navGroups = [
  {
    label: 'Tổng quan',
    items: [
      { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4"/> },
    ]
  },
  {
    label: 'Quản lý',
    items: [
      { to: '/admin/customers', label: 'Khách hàng', icon: <Users className="w-4 h-4"/> },
      { to: '/admin/orders', label: 'Đơn hàng', icon: <ClipboardList className="w-4 h-4"/> },
      { to: '/admin/warehouse', label: 'Kho hàng', icon: <Warehouse className="w-4 h-4"/> },
      { to: '/admin/logistics', label: 'Giao nhận', icon: <Truck className="w-4 h-4"/> },
    ]
  },
  {
    label: 'Tài chính',
    items: [
      { to: '/admin/payments', label: 'Thanh toán', icon: <CreditCard className="w-4 h-4"/> },
      { to: '/admin/pricing', label: 'Bảng giá', icon: <Package className="w-4 h-4"/> },
      { to: '/admin/reports', label: 'Báo cáo', icon: <BarChart2 className="w-4 h-4"/> },
    ]
  },
  {
    label: 'Hỗ trợ',
    items: [
      { to: '/admin/feedback', label: 'Phản hồi', icon: <MessageSquare className="w-4 h-4"/> },
      { to: '/admin/settings', label: 'Cài đặt', icon: <Settings className="w-4 h-4"/> },
    ]
  },
];

export function AdminLayout() {
  const { currentUser, logout, notifications } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login"/>;

  const unread = notifications.filter(n => !n.read && n.userId === currentUser.id).length;

  const SidebarContent = () => (
    <>
      <div className={`p-4 border-b border-white/10 flex items-center ${collapsed ? 'justify-center' : 'gap-3 justify-between'}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 font-bold text-white">
            <div className="w-7 h-7 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white"/>
            </div>
            KEEPBOX
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white hidden lg:flex">
          {collapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
        </button>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            {!collapsed && <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">{group.label}</div>}
            <div className="space-y-1">
              {group.items.map(item => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    {item.icon}
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4"/>
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#0f1f36] transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent/>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setMobileOpen(false)}/>
          <aside className="fixed inset-y-0 left-0 w-60 bg-[#0f1f36] z-30 flex flex-col lg:hidden animate-fadeIn">
            <SidebarContent/>
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu className="w-5 h-5"/>
          </button>
          <div className="flex-1 relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input className="w-full max-w-xs pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:bg-white" placeholder="Tìm kiếm..."/>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/admin/notifications" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-500"/>
              {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-800">Admin</div>
                <div className="text-xs text-gray-400">KEEPBOX</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

