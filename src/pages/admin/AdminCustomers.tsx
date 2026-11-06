import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, UserX, UserCheck } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Input, ConfirmDialog } from '../../components/ui';
import { formatDate, formatVND } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { Customer } from '../../types';

export default function AdminCustomers() {
  const { customers, bookings, toggleCustomerStatus, updateCustomer } = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', district: '' });
  const [confirmToggle, setConfirmToggle] = useState<Customer | null>(null);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openEdit(c: Customer) {
    setEditCustomer(c);
    setEditForm({ name: c.name, phone: c.phone, address: c.address, district: c.district });
  }

  function saveEdit() {
    if (!editCustomer) return;
    updateCustomer(editCustomer.id, editForm);
    toast.success('Cập nhật thông tin khách hàng thành công!');
    setEditCustomer(null);
  }

  function handleToggle(c: Customer) {
    toggleCustomerStatus(c.id);
    toast.success(c.status === 'active' ? `Đã khoá tài khoản ${c.name}` : `Đã mở khóa tài khoản ${c.name}`);
    setConfirmToggle(null);
  }

  const getCustomerBookings = (id: string) => bookings.filter(b => b.customerId === id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-500 text-sm">{customers.length} khách hàng · {customers.filter(c => c.status === 'active').length} đang hoạt động</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              placeholder="Tìm theo tên, SĐT, email..."/>
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${statusFilter === s ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {s === 'all' ? 'Tất cả' : s === 'active' ? 'Hoạt động' : 'Tạm khóa'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Khách hàng', 'Liên hệ', 'Quận/Huyện', 'Đơn hàng', 'Chi tiêu', 'Trạng thái', 'Ngày đăng ký', 'Thao tác'].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const myBookings = getCustomerBookings(c.id);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                          <div className="text-xs text-gray-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{c.phone}</td>
                    <td className="p-4 text-sm text-gray-600">{c.district}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{myBookings.length}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{formatVND(c.totalSpending)}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">{formatDate(c.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => setViewCustomer(c)} title="Xem chi tiết" className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors">
                          <Eye className="w-4 h-4"/>
                        </button>
                        <button onClick={() => openEdit(c)} title="Chỉnh sửa" className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors">
                          <Edit className="w-4 h-4"/>
                        </button>
                        <button onClick={() => setConfirmToggle(c)} title={c.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                          {c.status === 'active' ? <UserX className="w-4 h-4"/> : <UserCheck className="w-4 h-4"/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy khách hàng nào.</div>
          )}
        </div>
      </Card>

      {/* View modal */}
      <Modal open={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Chi tiết khách hàng" size="lg">
        {viewCustomer && (() => {
          const myBookings = getCustomerBookings(viewCustomer.id);
          return (
            <div>
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {viewCustomer.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{viewCustomer.name}</h3>
                  <p className="text-gray-500 text-sm">{viewCustomer.email}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${viewCustomer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {viewCustomer.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                {[
                  ['Số điện thoại', viewCustomer.phone],
                  ['Địa chỉ', `${viewCustomer.address}, ${viewCustomer.district}`],
                  ['Ngày đăng ký', formatDate(viewCustomer.createdAt)],
                  ['Tổng chi tiêu', formatVND(viewCustomer.totalSpending)],
                  ['Tổng đơn hàng', myBookings.length + ' đơn'],
                  ['Thành phố', viewCustomer.city],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                    <div className="text-sm font-medium text-gray-900">{v}</div>
                  </div>
                ))}
              </div>
              <h4 className="font-semibold text-gray-800 mb-3">Lịch sử đơn hàng ({myBookings.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {myBookings.map(b => (
                  <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
                    <span className="font-medium">{b.bookingCode}</span>
                    <span className="text-gray-400">{formatDate(b.startDate)}</span>
                    <Badge className="text-xs bg-blue-100 text-blue-700">{b.numberOfBoxes} thùng</Badge>
                    <span className="font-medium">{formatVND(b.totalAmount)}</span>
                  </div>
                ))}
                {myBookings.length === 0 && <p className="text-gray-400 text-xs text-center py-4">Chưa có đơn hàng</p>}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editCustomer} onClose={() => setEditCustomer(null)} title="Chỉnh sửa khách hàng">
        {editCustomer && (
          <div className="space-y-4">
            <Input label="Họ tên" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}/>
            <Input label="Số điện thoại" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}/>
            <Input label="Địa chỉ" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}/>
            <Input label="Quận/Huyện" value={editForm.district} onChange={e => setEditForm(f => ({ ...f, district: e.target.value }))}/>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditCustomer(null)} className="flex-1">Huỷ</Button>
              <Button variant="primary" onClick={saveEdit} className="flex-1">Lưu thay đổi</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm toggle */}
      <ConfirmDialog
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => confirmToggle && handleToggle(confirmToggle)}
        title={confirmToggle?.status === 'active' ? 'Khoá tài khoản?' : 'Mở khóa tài khoản?'}
        message={`Bạn có chắc muốn ${confirmToggle?.status === 'active' ? 'khoá' : 'mở khóa'} tài khoản của ${confirmToggle?.name}?`}
        confirmVariant={confirmToggle?.status === 'active' ? 'danger' : 'primary'}
        confirmLabel={confirmToggle?.status === 'active' ? 'Khoá' : 'Mở khóa'}
      />
    </div>
  );
}

