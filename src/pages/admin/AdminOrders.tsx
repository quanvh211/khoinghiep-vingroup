import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Select, ConfirmDialog } from '../../components/ui';
import { bookingStatusLabels, bookingStatusColors, formatDate, formatVND, logisticsTypeLabels } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { Booking, BookingStatus } from '../../types';

export default function AdminOrders() {
  const { bookings, customers, packages, updateBookingStatus } = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [viewOrder, setViewOrder] = useState<Booking | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ booking: Booking; action: 'confirm' | 'cancel' | null } | null>(null);
  const [changeStatus, setChangeStatus] = useState<{ booking: Booking; newStatus: BookingStatus } | null>(null);

  const filtered = bookings.filter(b => {
    const cust = customers.find(c => c.id === b.customerId);
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      (cust?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusOptions: { value: BookingStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    ...(['pending','confirmed','picking_up','in_warehouse','storing','delivering','completed','cancelled'] as BookingStatus[])
      .map(s => ({ value: s, label: bookingStatusLabels[s] }))
  ];

  const nextStatus: Partial<Record<BookingStatus, BookingStatus>> = {
    pending: 'confirmed',
    confirmed: 'picking_up',
    picking_up: 'in_warehouse',
    in_warehouse: 'storing',
    storing: 'delivering',
    delivering: 'completed',
  };

  function handleUpdateStatus(booking: Booking, status: BookingStatus) {
    updateBookingStatus(booking.id, status);
    toast.success(`Đơn ${booking.bookingCode} đã cập nhật trạng thái: ${bookingStatusLabels[status]}`);
    setViewOrder(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-500 text-sm">{bookings.length} đơn hàng · {bookings.filter(b => b.status === 'pending').length} chờ xác nhận</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              placeholder="Tìm mã đơn hoặc tên khách..."/>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | 'all')}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Mã đơn', 'Khách hàng', 'Gói', 'Thùng', 'Ngày bắt đầu', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => {
                const cust = customers.find(c => c.id === b.customerId);
                const pkg = packages.find(p => p.id === b.packageId);
                const next = nextStatus[b.status];
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm font-semibold text-[#1e3a5f]">{b.bookingCode}</div>
                      <div className="text-xs text-gray-400">{formatDate(b.createdAt)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{cust?.name ?? '—'}</div>
                      <div className="text-xs text-gray-400">{cust?.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{pkg?.name ?? '—'}</td>
                    <td className="p-4 text-sm font-medium text-gray-900 text-center">{b.numberOfBoxes}</td>
                    <td className="p-4 text-sm text-gray-600">{formatDate(b.startDate)}</td>
                    <td className="p-4 text-sm font-semibold text-gray-900">{formatVND(b.totalAmount)}</td>
                    <td className="p-4">
                      <Badge className={bookingStatusColors[b.status]}>{bookingStatusLabels[b.status]}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => setViewOrder(b)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Chi tiết">
                          <Eye className="w-4 h-4"/>
                        </button>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => { updateBookingStatus(b.id, 'confirmed'); toast.success(`Đã xác nhận ${b.bookingCode}`); }} className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-colors" title="Xác nhận">
                              <CheckCircle className="w-4 h-4"/>
                            </button>
                            <button onClick={() => { updateBookingStatus(b.id, 'cancelled'); toast.success(`Đã huỷ ${b.bookingCode}`); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Huỷ">
                              <XCircle className="w-4 h-4"/>
                            </button>
                          </>
                        )}
                        {next && b.status !== 'cancelled' && (
                          <button onClick={() => handleUpdateStatus(b, next)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors" title={`Chuyển sang: ${bookingStatusLabels[next]}`}>
                            <RefreshCw className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy đơn hàng nào.</div>
          )}
        </div>
      </Card>

      {/* Detail modal */}
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title="Chi tiết đơn hàng" size="lg">
        {viewOrder && (() => {
          const cust = customers.find(c => c.id === viewOrder.customerId);
          const pkg = packages.find(p => p.id === viewOrder.packageId);
          const next = nextStatus[viewOrder.status];
          return (
            <div>
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xs text-gray-400">Mã đơn hàng</div>
                  <div className="font-bold text-xl text-[#1e3a5f] font-mono">{viewOrder.bookingCode}</div>
                </div>
                <Badge className={bookingStatusColors[viewOrder.status]}>{bookingStatusLabels[viewOrder.status]}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {[
                  ['Khách hàng', cust?.name ?? '—'],
                  ['SĐT', cust?.phone ?? '—'],
                  ['Gói lưu trữ', pkg?.name ?? '—'],
                  ['Số thùng', `${viewOrder.numberOfBoxes} thùng`],
                  ['Thời gian', `${viewOrder.estimatedDuration} tháng`],
                  ['Ngày bắt đầu', formatDate(viewOrder.startDate)],
                  ['Ngày kết thúc', formatDate(viewOrder.endDate)],
                  ['Đồ vật', viewOrder.belongingsType],
                  ['Vận chuyển vào', logisticsTypeLabels[viewOrder.dropoffType]],
                  ['Vận chuyển ra', logisticsTypeLabels[viewOrder.pickupType]],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                    <div className="text-sm font-medium text-gray-900">{v}</div>
                  </div>
                ))}
              </div>
              {viewOrder.specialInstructions && (
                <div className="bg-yellow-50 rounded-xl p-3 mb-4 text-sm text-yellow-800">
                  <strong>Ghi chú:</strong> {viewOrder.specialInstructions}
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Phí lưu trữ</span>
                  <span>{formatVND(viewOrder.totalAmount - viewOrder.additionalFees)}</span>
                </div>
                {viewOrder.additionalFees > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Phí dịch vụ thêm</span>
                    <span>{formatVND(viewOrder.additionalFees)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Tổng cộng</span>
                  <span className="text-[#1e3a5f]">{formatVND(viewOrder.totalAmount)}</span>
                </div>
              </div>
              {next && viewOrder.status !== 'cancelled' && (
                <div className="flex gap-3">
                  {viewOrder.status === 'pending' && (
                    <Button variant="danger" onClick={() => { updateBookingStatus(viewOrder.id, 'cancelled'); toast.success('Đã huỷ đơn hàng'); setViewOrder(null); }} className="flex-1">
                      Huỷ đơn
                    </Button>
                  )}
                  <Button variant="primary" onClick={() => { handleUpdateStatus(viewOrder, next); }} className="flex-1">
                    → {bookingStatusLabels[next]}
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

