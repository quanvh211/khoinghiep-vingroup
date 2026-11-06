import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Archive, Truck, DollarSign, ArrowRight, Bell } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge } from '../../components/ui';
import { bookingStatusLabels, bookingStatusColors, formatVND, formatDate } from '../../utils';

export default function AccountOverview() {
  const { currentCustomer, bookings, storageBoxes, deliveryRequests, notifications, currentUser, markNotificationRead } = useAppStore();

  const myBookings = bookings.filter(b => b.customerId === currentCustomer?.id);
  const activeBookings = myBookings.filter(b => !['completed','cancelled'].includes(b.status));
  const myBoxes = storageBoxes.filter(b => b.customerId === currentCustomer?.id && b.status === 'storing');
  const myDeliveries = deliveryRequests.filter(d => d.customerId === currentCustomer?.id && d.status !== 'completed');
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id && !n.read);
  const totalSpending = currentCustomer?.totalSpending ?? myBookings.reduce((s, b) => s + b.totalAmount, 0);

  const stats = [
    { label: 'Đơn hàng đang hoạt động', value: activeBookings.length, icon: <Package className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50', link: '/account/orders' },
    { label: 'Thùng đang lưu trữ', value: myBoxes.length, icon: <Archive className="w-5 h-5 text-green-500"/>, bg: 'bg-green-50', link: '/account/storage' },
    { label: 'Lịch giao hàng sắp tới', value: myDeliveries.length, icon: <Truck className="w-5 h-5 text-orange-500"/>, bg: 'bg-orange-50', link: '/account/delivery' },
    { label: 'Tổng chi tiêu', value: formatVND(totalSpending), icon: <DollarSign className="w-5 h-5 text-purple-500"/>, bg: 'bg-purple-50', link: '#' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xin chào, {currentCustomer?.name ?? 'bạn'}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Đây là tổng quan tài khoản KEEPBOX của bạn.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Link key={s.label} to={s.link}>
            <Card className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <Link to="/account/orders" className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="space-y-3">
            {myBookings.slice(0, 4).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-sm text-gray-900">{b.bookingCode}</div>
                  <div className="text-xs text-gray-400">{b.numberOfBoxes} thùng · {formatDate(b.startDate)}</div>
                </div>
                <Badge className={bookingStatusColors[b.status]}>{bookingStatusLabels[b.status]}</Badge>
              </div>
            ))}
            {myBookings.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                Chưa có đơn hàng nào.{' '}
                <Link to="/booking" className="text-[#0ea5e9] hover:underline">Đặt lịch ngay!</Link>
              </div>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Thông báo mới</h2>
            <Link to="/account/notifications" className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="space-y-3">
            {myNotifications.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl cursor-pointer" onClick={() => markNotificationRead(n.id)}>
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-white"/>
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</div>
                </div>
              </div>
            ))}
            {myNotifications.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">Không có thông báo mới.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

