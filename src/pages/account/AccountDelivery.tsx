import React from 'react';
import { Truck, Calendar, MapPin, Clock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, EmptyState } from '../../components/ui';
import { logisticsStatusLabels, logisticsStatusColors, formatDate, formatVND } from '../../utils';

export default function AccountDelivery() {
  const { currentCustomer, pickupRequests, deliveryRequests, bookings } = useAppStore();
  const myPickups = pickupRequests.filter(r => r.customerId === currentCustomer?.id);
  const myDeliveries = deliveryRequests.filter(r => r.customerId === currentCustomer?.id);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch giao nhận</h1>
        <p className="text-gray-500 text-sm mt-1">Các yêu cầu lấy hàng và giao hàng của bạn.</p>
      </div>

      {/* Pickup */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4"/> Yêu cầu lấy hàng ({myPickups.length})
        </h2>
        {myPickups.length === 0 ? (
          <EmptyState icon={<Truck className="w-12 h-12"/>} title="Không có yêu cầu lấy hàng" description="Các yêu cầu lấy hàng tại nhà sẽ hiển thị tại đây."/>
        ) : (
          <div className="space-y-3">
            {myPickups.map(r => {
              const booking = bookings.find(b => b.id === r.bookingId);
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{booking?.bookingCode ?? r.bookingId}</div>
                      <div className="text-xs text-gray-400">Yêu cầu lấy hàng</div>
                    </div>
                    <Badge className={logisticsStatusColors[r.status]}>{logisticsStatusLabels[r.status]}</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400"/> {formatDate(r.scheduledDate)}</div>
                    <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400"/> {r.scheduledTime}</div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400"/> {r.address || 'Địa chỉ đã đăng ký'}</div>
                  </div>
                  {r.assignedStaff && (
                    <div className="mt-2 text-xs text-gray-400">Nhân viên: <span className="font-medium text-gray-600">{r.assignedStaff}</span></div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delivery */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4"/> Yêu cầu giao hàng ({myDeliveries.length})
        </h2>
        {myDeliveries.length === 0 ? (
          <EmptyState icon={<Truck className="w-12 h-12"/>} title="Không có yêu cầu giao hàng" description="Yêu cầu giao hàng tận nhà sẽ hiển thị tại đây."/>
        ) : (
          <div className="space-y-3">
            {myDeliveries.map(r => {
              const booking = bookings.find(b => b.id === r.bookingId);
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{booking?.bookingCode ?? r.bookingId}</div>
                      <div className="text-xs text-gray-400">Yêu cầu giao hàng</div>
                    </div>
                    <Badge className={logisticsStatusColors[r.status]}>{logisticsStatusLabels[r.status]}</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400"/> {formatDate(r.scheduledDate)}</div>
                    <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400"/> {r.scheduledTime}</div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400"/> {r.address || 'Địa chỉ đã đăng ký'}</div>
                  </div>
                  {r.assignedStaff && (
                    <div className="mt-2 text-xs text-gray-400">Nhân viên: <span className="font-medium text-gray-600">{r.assignedStaff}</span></div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

