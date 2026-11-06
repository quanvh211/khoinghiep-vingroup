import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button, Card, Input, Badge } from '../components/ui';
import { useAppStore } from '../store/appStore';
import { bookingStatusLabels, bookingStatusColors, formatDate, formatVND } from '../utils';
import type { BookingStatus } from '../types';

const timeline: BookingStatus[] = ['pending','confirmed','picking_up','in_warehouse','storing','delivering','completed'];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('code') ?? '');
  const [searched, setSearched] = useState(false);
  const { bookings, storageBoxes, customers } = useAppStore();

  const booking = bookings.find(b =>
    b.bookingCode.toLowerCase() === query.toLowerCase() ||
    b.id === query
  );
  const boxes = booking ? storageBoxes.filter(bx => bx.bookingId === booking.id) : [];
  const customer = booking ? customers.find(c => c.id === booking.customerId) : null;

  useEffect(() => {
    if (searchParams.get('code')) { setQuery(searchParams.get('code')!); setSearched(true); }
  }, []);

  function handleSearch() {
    if (query.trim()) setSearched(true);
  }

  const currentStepIdx = booking ? timeline.indexOf(booking.status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">Theo dõi đơn hàng</h1>
        <p className="text-gray-500">Nhập mã đơn hàng hoặc mã thùng để xem trạng thái</p>
      </div>

      <div className="flex gap-3 mb-8">
        <Input
          value={query}
          onChange={e => { setQuery(e.target.value); setSearched(false); }}
          placeholder="VD: KB-2024-0001 hoặc KB-BOX-001"
          className="flex-1"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="primary" onClick={handleSearch}>
          <Search className="w-4 h-4"/> Tìm kiếm
        </Button>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm text-gray-400">Thử:</span>
        {['KB-2024-0001','KB-2024-0007','KB-2024-0014'].map(code => (
          <button key={code} onClick={() => { setQuery(code); setSearched(true); }}
            className="text-sm text-[#0ea5e9] hover:underline">
            {code}
          </button>
        ))}
      </div>

      {searched && !booking && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300"/>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-400 text-sm">Kiểm tra lại mã đơn hoặc mã thùng của bạn.</p>
        </div>
      )}

      {booking && (
        <div className="space-y-5 animate-fadeIn">
          {/* Booking info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Mã đơn hàng</div>
                <div className="text-xl font-bold text-[#1e3a5f]">{booking.bookingCode}</div>
              </div>
              <Badge className={bookingStatusColors[booking.status]}>
                {bookingStatusLabels[booking.status]}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400"/>
                Bắt đầu: {formatDate(booking.startDate)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400"/>
                Kết thúc: {formatDate(booking.endDate)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-4 h-4 text-gray-400"/>
                {boxes.length} thùng lưu trữ
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400"/>
                Kho KEEPBOX Tân Bình
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-5">Hành trình đơn hàng</h3>
            <div className="space-y-0">
              {timeline.map((status, idx) => {
                const done = idx <= currentStepIdx;
                const current = idx === currentStepIdx;
                const isCancelled = booking.status === 'cancelled';
                return (
                  <div key={status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isCancelled ? 'border-red-300 bg-red-50' :
                        done ? 'border-green-500 bg-green-500' :
                        'border-gray-200 bg-white'
                      }`}>
                        {done && !isCancelled ? (
                          current
                            ? <div className="w-3 h-3 bg-white rounded-full animate-pulse"/>
                            : <CheckCircle className="w-4 h-4 text-white"/>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-200"/>
                        )}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${done && idx < currentStepIdx ? 'bg-green-400' : 'bg-gray-100'}`}/>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className={`font-medium text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {bookingStatusLabels[status]}
                      </div>
                      {current && (
                        <div className="text-xs text-[#0ea5e9] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3"/> Trạng thái hiện tại
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Boxes */}
          {boxes.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Danh sách thùng ({boxes.length})</h3>
              <div className="space-y-3">
                {boxes.map(box => (
                  <div key={box.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white"/>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{box.boxCode}</div>
                      <div className="text-xs text-gray-500">{box.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3"/> {box.warehouseLocationId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

