import React, { useState } from 'react';
import { Search, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Select } from '../../components/ui';
import { paymentStatusLabels, paymentStatusColors, paymentMethodLabels, formatDate, formatDateTime, formatVND } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { PaymentStatus } from '../../types';

export default function AdminPayments() {
  const { payments, customers, bookings, updatePaymentStatus } = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [viewPay, setViewPay] = useState<typeof payments[0] | null>(null);

  const filtered = payments.filter(p => {
    const cust = customers.find(c => c.id === p.customerId);
    const booking = bookings.find(b => b.id === p.bookingId);
    const matchSearch = p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      (cust?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (booking?.bookingCode ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  function handleUpdateStatus(id: string, status: PaymentStatus) {
    updatePaymentStatus(id, status);
    toast.success(`Đã cập nhật trạng thái thanh toán!`);
    setViewPay(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thanh toán</h1>
        <p className="text-gray-500 text-sm">{payments.length} giao dịch · Dữ liệu demo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Đã thanh toán', value: formatVND(totalPaid), sub: `${payments.filter(p => p.status === 'paid').length} GD`, color: 'text-green-600 bg-green-50' },
          { label: 'Chờ thanh toán', value: formatVND(totalPending), sub: `${payments.filter(p => p.status === 'pending').length} GD`, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Chuyển khoản', value: payments.filter(p => p.method === 'bank_transfer').length, sub: 'giao dịch', color: 'text-blue-600 bg-blue-50' },
          { label: 'QR Payment', value: payments.filter(p => p.method === 'qr_payment').length, sub: 'giao dịch', color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={`text-lg font-bold ${s.color.split(' ')[0]} leading-tight`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              placeholder="Tìm mã GD, tên khách, mã đơn..."/>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as PaymentStatus | 'all')}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
            <option value="all">Tất cả trạng thái</option>
            {(['pending','paid','failed','refunded'] as PaymentStatus[]).map(s => (
              <option key={s} value={s}>{paymentStatusLabels[s]}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Mã GD', 'Khách hàng', 'Đơn hàng', 'Số tiền', 'Phương thức', 'Ngày tạo', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const cust = customers.find(c => c.id === p.customerId);
                const booking = bookings.find(b => b.id === p.bookingId);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs font-semibold text-gray-700">{p.transactionId}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{cust?.name ?? '—'}</td>
                    <td className="p-4 text-sm font-medium text-[#1e3a5f]">{booking?.bookingCode ?? '—'}</td>
                    <td className="p-4 text-sm font-bold text-gray-900">{formatVND(p.amount)}</td>
                    <td className="p-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{paymentMethodLabels[p.method]}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">{formatDate(p.createdAt)}</td>
                    <td className="p-4">
                      <Badge className={paymentStatusColors[p.status]}>{paymentStatusLabels[p.status]}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {p.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(p.id, 'paid')} className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-colors" title="Xác nhận đã thanh toán">
                              <CheckCircle className="w-4 h-4"/>
                            </button>
                            <button onClick={() => handleUpdateStatus(p.id, 'failed')} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Đánh dấu thất bại">
                              <XCircle className="w-4 h-4"/>
                            </button>
                          </>
                        )}
                        {p.status === 'paid' && (
                          <button onClick={() => handleUpdateStatus(p.id, 'refunded')} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors" title="Hoàn tiền">
                            <CreditCard className="w-4 h-4"/>
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
            <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy giao dịch nào.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

