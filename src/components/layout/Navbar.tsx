import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui';
import { Bell, Menu, X, Package, LogOut, User, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, currentCustomer, logout, notifications } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/services', label: 'Dịch vụ & Giá' },
    { href: '/booking', label: 'Đặt lưu trữ' },
    { href: '/tracking', label: 'Theo dõi hàng' },
    { href: '/support', label: 'Hỗ trợ' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#1e3a5f]">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            KEEPBOX
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#1e3a5f] bg-blue-50'
                    : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {/* Notification bell */}
                <Link to="/account/notifications" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-7 h-7 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {currentCustomer?.name ?? 'Admin'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-fadeIn">
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" /> Tài khoản
                      </Link>
                      {currentUser.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Package className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Đăng nhập</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Đăng ký</Button>
              </div>
            )}
            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 pb-4 animate-fadeIn">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl mb-1 ${
                  location.pathname === link.href ? 'text-[#1e3a5f] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!currentUser && (
              <div className="flex gap-2 mt-3 px-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Đăng nhập</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => { navigate('/register'); setMenuOpen(false); }}>Đăng ký</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

