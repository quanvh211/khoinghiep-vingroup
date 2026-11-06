import React, { useState } from 'react';
import { Truck, Calendar, MapPin, Clock, User, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Select } from '../../components/ui';
import { logisticsStatusLabels, logisticsStatusColors, formatDate, formatVND } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { LogisticsStatus } from '../../types';

const STAFF = ['Nguyễn Thế Anh', 'Trần Đình Khoa', 'Lê Minh Trí', 'Phạm Văn Bảo'];

export default function AdminLogistics() {
  const { pickupRequests, deliveryRequests, customers, bookings, updatePickupStatus, updateDeliveryStatus } = useAppStore();
  const toast = useToast();
  const [tab, setTab] = useState<'pickup' | 'delivery'>('pickup');
  const [statusFilter, setStatusFilter] = useState<LogisticsStatus | 'all'>('all');
  const [viewItem, setViewItem] = useState<{ type: 'pickup' | 'delivery'; data: typeof pickupRequests[0] } | null>(null);
  const [assignStaff, setAssignStaff] = useState('');

  const pickups = pickupRequests.filter(r => statusFilter === 'all' || r.status === statusFilter);
  const deliveries = deliveryRequests.filter(r => statusFilter === 'all' || r.status === statusFilter);
  const items = tab === 'pickup' ? pickups : deliveries;

  function updateStatus(type: 'pickup' | 'delivery', id: string, status: LogisticsStatus, staff?: string) {
    if (type === 'pickup') updatePickupStatus(id, status, staff);
    else updateDeliveryStatus(id, status, staff);
    toast.success('Đã cập nhật trạng thái!');
    setViewItem(null);
  }

  const statusOptions: { value: LogisticsStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    ...(['pending','confirmed','in_progress','completed','cancelled'] as LogisticsStatus[]).map(s => ({ value: s, label: logisticsStatusLabels[s] }))
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý giao nhận</h1>
        <p className="text-gray-500 text-sm">
          {pickupRequests.filter(r => r.status === 'pending').length} yêu cầu lấy hàng chờ xử lý ·{' '}
          {deliveryRequests.filter(r => r.status === 'pending').length} yêu cầu giao hàng chờ xử lý
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Chờ lấy hàng', value: pickupRequests.filter(r => r.status === 'pending').length, color: 'text-yellow-500 bg-yellow-50' },
          { label: 'Đang lấy hàng', value: pickupRequests.filter(r => r.status === 'in_progress').length, color: 'text-blue-500 bg-blue-50' },
          { label: 'Chờ giao hàng', value: deliveryRequests.filter(r => r.status === 'pending').length, color: 'text-orange-500 bg-orange-50' },
          { label: 'Đang giao hàng', value: deliveryRequests.filter(r => r.status === 'in_progress').length, color: 'text-green-500 bg-green-50' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs + filter */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['pickup', 'delivery'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? 'bg-white shadow-sm text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'pickup' ? `🚚 Lấy hàng (${pickupRequests.length})` : `📦 Giao hàng (${deliveryRequests.length})`}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as LogisticsStatus | 'all')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map(item => {
          const cust = customers.find(c => c.id === item.customerId);
          const booking = bookings.find(b => b.id === item.bookingId);
          return (
            <Card key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab === 'pickup' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    <Truck className={`w-5 h-5 ${tab === 'pickup' ? 'text-blue-600' : 'text-orange-600'}`}/>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{booking?.bookingCode ?? item.bookingId}</div>
                    <div className="text-xs text-gray-500">{tab === 'pickup' ? 'Yêu cầu lấy hàng' : 'Yêu cầu giao hàng'}</div>
                  </div>
                </div>
                <Badge className={logisticsStatusColors[item.status]}>{logisticsStatusLabels[item.status]}</Badge>
              </div>
              <div className="grid md:grid-cols-4 gap-3 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-600"><User className="w-4 h-4 text-gray-400"/> {cust?.name ?? '—'}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400"/> {formatDate(item.scheduledDate)}</div>
                <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400"/> {item.scheduledTime}</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400"/> {item.address || cust?.address || '—'}</div>
              </div>
              {item.assignedStaff && (
                <div className="text-xs text-gray-500 mb-2">Nhân viên: <span className="font-medium text-gray-700">{item.assignedStaff}</span></div>
              )}
              {item.note && <div className="text-xs text-gray-400 italic mb-2">Ghi chú: {item.note}</div>}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                <div className="text-xs text-gray-400">Phí: <span className="font-medium text-gray-700">{formatVND(item.fee)}</span></div>
                <div className="ml-auto flex gap-2">
                  {item.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => { setViewItem({ type: tab, data: item }); setAssignStaff(item.assignedStaff ?? ''); }}>
                      Phân công
                    </Button>
                  )}
                  {item.status !== 'completed' && item.status !== 'cancelled' && (
                    <Button size="sm" variant="primary" onClick={() => {
                      const nextMap: Partial<Record<LogisticsStatus, LogisticsStatus>> = { pending: 'confirmed', confirmed: 'in_progress', in_progress: 'completed' };
                      const next = nextMap[item.status];
                      if (next) updateStatus(tab, item.id, next);
                    }}>
                      <RefreshCw className="w-3 h-3"/>
                      {item.status === 'pending' ? 'Xác nhận' : item.status === 'confirmed' ? 'Bắt đầu' : 'Hoàn tất'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Truck className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            Không có yêu cầu nào.
          </div>
        )}
      </div>

      {/* Assign modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Phân công nhân viên">
        {viewItem && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div><span className="text-gray-400">Đơn hàng:</span> <span className="font-medium">{bookings.find(b => b.id === viewItem.data.bookingId)?.bookingCode}</span></div>
              <div><span className="text-gray-400">Lịch:</span> <span className="font-medium">{formatDate(viewItem.data.scheduledDate)} · {viewItem.data.scheduledTime}</span></div>
              <div><span className="text-gray-400">Địa chỉ:</span> <span className="font-medium">{viewItem.data.address}</span></div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Chọn nhân viên</label>
              <select value={assignStaff} onChange={e => setAssignStaff(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white">
                <option value="">-- Chọn nhân viên --</option>
                {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setViewItem(null)} className="flex-1">Huỷ</Button>
              <Button variant="primary" onClick={() => { updateStatus(viewItem.type, viewItem.data.id, 'confirmed', assignStaff); }} className="flex-1">
                Xác nhận & Phân công
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

