import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, EmptyState } from '../../components/ui';
import { bookingStatusLabels, bookingStatusColors, formatDate, formatVND } from '../../utils';
import { Package } from 'lucide-react';

export default function AccountOrders() {
  const { currentCustomer, bookings, packages } = useAppStore();
  const myBookings = [...bookings.filter(b => b.customerId === currentCustomer?.id)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
        <p className="text-gray-500 text-sm mt-1">Tất cả đơn đặt lịch của bạn tại KEEPBOX.</p>
      </div>

      {myBookings.length === 0 ? (
        <EmptyState icon={<Package className="w-16 h-16"/>} title="Chưa có đơn hàng" description="Đặt lịch lưu trữ để bắt đầu giải phóng không gian!"/>
      ) : (
        <div className="space-y-4">
          {myBookings.map(b => {
            const pkg = packages.find(p => p.id === b.packageId);
            return (
              <Card key={b.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{b.bookingCode}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDate(b.createdAt)}</div>
                  </div>
                  <Badge className={bookingStatusColors[b.status]}>{bookingStatusLabels[b.status]}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-400">Gói</div>
                    <div className="font-medium text-gray-800">{pkg?.name ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Số thùng</div>
                    <div className="font-medium text-gray-800">{b.numberOfBoxes}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Thời gian</div>
                    <div className="font-medium text-gray-800">{b.estimatedDuration} tháng</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Tổng tiền</div>
                    <div className="font-bold text-[#1e3a5f]">{formatVND(b.totalAmount)}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-3">
                  <Link to={`/tracking?code=${b.bookingCode}`} className="text-xs text-[#0ea5e9] hover:underline">
                    Theo dõi đơn →
                  </Link>
                  <span className="text-xs text-gray-400">{b.belongingsType}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

