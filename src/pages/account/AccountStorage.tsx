import React from 'react';
import { Package, MapPin, Calendar } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, EmptyState } from '../../components/ui';
import { boxStatusLabels, boxStatusColors, formatDate } from '../../utils';

export default function AccountStorage() {
  const { currentCustomer, storageBoxes, bookings } = useAppStore();
  const myBoxes = storageBoxes.filter(b => b.customerId === currentCustomer?.id);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Đồ lưu trữ của tôi</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách các thùng đồ đang lưu trữ tại KEEPBOX.</p>
      </div>

      {myBoxes.length === 0 ? (
        <EmptyState
          icon={<Package className="w-16 h-16"/>}
          title="Chưa có thùng đồ nào"
          description="Bạn chưa có đồ lưu trữ tại KEEPBOX. Hãy đặt lịch để bắt đầu!"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myBoxes.map(box => {
            const booking = bookings.find(b => b.id === box.bookingId);
            return (
              <Card key={box.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-7 h-7 text-white"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-bold text-gray-900 text-sm">{box.boxCode}</div>
                      <Badge className={boxStatusColors[box.status]}>{boxStatusLabels[box.status]}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3 line-clamp-2">{box.description}</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5"/> Khu {box.warehouseLocationId.replace('wh-', '')} · Kho Tân Bình
                      </div>
                      {box.checkInDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5"/> Nhập kho: {formatDate(box.checkInDate)}
                        </div>
                      )}
                      {box.checkOutDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5"/> Dự kiến trả: {formatDate(box.checkOutDate)}
                        </div>
                      )}
                    </div>
                    {booking && (
                      <div className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5">
                        Đơn hàng: <span className="font-medium text-gray-600">{booking.bookingCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

