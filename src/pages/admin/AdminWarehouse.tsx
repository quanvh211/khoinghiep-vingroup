import React, { useState } from 'react';
import { Plus, Package, MapPin, Calendar, Edit, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Select, Input, Textarea } from '../../components/ui';
import { boxStatusLabels, boxStatusColors, formatDate } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { BoxStatus } from '../../types';

export default function AdminWarehouse() {
  const { storageBoxes, customers, bookings, warehouseLocations, updateBoxStatus, addStorageBox } = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BoxStatus | 'all'>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [addModal, setAddModal] = useState(false);
  const [viewBox, setViewBox] = useState<typeof storageBoxes[0] | null>(null);
  const [newBox, setNewBox] = useState({ bookingId: '', description: '', warehouseLocationId: 'wh-A1', checkInDate: new Date().toISOString().split('T')[0], checkOutDate: '' });

  const filtered = storageBoxes.filter(b => {
    const matchSearch = b.boxCode.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchZone = zoneFilter === 'all' || b.warehouseLocationId.startsWith(`wh-${zoneFilter}`);
    return matchSearch && matchStatus && matchZone;
  });

  function handleAddBox() {
    if (!newBox.bookingId || !newBox.description) { toast.error('Vui lòng điền đầy đủ thông tin'); return; }
    const booking = bookings.find(b => b.bookingCode === newBox.bookingId || b.id === newBox.bookingId);
    if (!booking) { toast.error('Không tìm thấy đơn hàng'); return; }
    addStorageBox({ ...newBox, customerId: booking.customerId, status: 'checked_in' });
    toast.success('Đã thêm thùng mới thành công!');
    setAddModal(false);
    setNewBox({ bookingId: '', description: '', warehouseLocationId: 'wh-A1', checkInDate: new Date().toISOString().split('T')[0], checkOutDate: '' });
  }

  const zones = ['A', 'B', 'C'];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kho hàng</h1>
          <p className="text-gray-500 text-sm">{storageBoxes.length} thùng · {storageBoxes.filter(b => b.status === 'storing').length} đang lưu trữ</p>
        </div>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <Plus className="w-4 h-4"/> Thêm thùng mới
        </Button>
      </div>

      {/* Zone overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {warehouseLocations.map(loc => (
          <Card key={loc.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">Khu {loc.shelf}</div>
                <div className="text-xs text-gray-400">{loc.address.split('–')[0]}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1e3a5f]">{loc.occupied}/{loc.capacity}</div>
                <div className="text-xs text-gray-400">ô đã dùng</div>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${loc.occupied / loc.capacity > 0.8 ? 'bg-red-500' : loc.occupied / loc.capacity > 0.5 ? 'bg-orange-400' : 'bg-green-500'}`}
                style={{ width: `${(loc.occupied / loc.capacity) * 100}%` }}/>
            </div>
            <div className="text-xs text-gray-400 mt-1">{Math.round((loc.occupied / loc.capacity) * 100)}% sử dụng</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              placeholder="Tìm mã thùng hoặc mô tả..."/>
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as BoxStatus | 'all')}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
            <option value="all">Tất cả trạng thái</option>
            {(['pending','checked_in','storing','delivered','returned'] as BoxStatus[]).map(s => (
              <option key={s} value={s}>{boxStatusLabels[s]}</option>
            ))}
          </select>
          <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
            <option value="all">Tất cả khu</option>
            {zones.map(z => <option key={z} value={z}>Khu {z}</option>)}
          </select>
        </div>
      </Card>

      {/* Grid of boxes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(box => {
          const cust = customers.find(c => c.id === box.customerId);
          const booking = bookings.find(b => b.id === box.bookingId);
          return (
            <Card key={box.id} className="p-4 hover:shadow-md transition-all" hover onClick={() => setViewBox(box)}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="font-bold text-gray-900 text-sm">{box.boxCode}</div>
                    <Badge className={boxStatusColors[box.status]}>{boxStatusLabels[box.status]}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{box.description}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Khu {box.warehouseLocationId.replace('wh-', '')}</div>
                {box.checkInDate && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Nhập kho: {formatDate(box.checkInDate)}</div>}
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-200 flex items-center justify-center text-[8px] font-bold text-blue-700">K</div>
                  {cust?.name ?? '—'}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">Không tìm thấy thùng nào.</div>
        )}
      </div>

      {/* View/Edit box modal */}
      <Modal open={!!viewBox} onClose={() => setViewBox(null)} title="Chi tiết thùng" size="md">
        {viewBox && (() => {
          const cust = customers.find(c => c.id === viewBox.customerId);
          const booking = bookings.find(b => b.id === viewBox.bookingId);
          return (
            <div>
              <div className="text-center mb-5">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-10 h-10 text-white"/>
                </div>
                <div className="font-bold text-xl text-gray-900">{viewBox.boxCode}</div>
                <Badge className={boxStatusColors[viewBox.status]}>{boxStatusLabels[viewBox.status]}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ['Mô tả', viewBox.description],
                  ['Khách hàng', cust?.name ?? '—'],
                  ['Đơn hàng', booking?.bookingCode ?? '—'],
                  ['Vị trí kho', `Khu ${viewBox.warehouseLocationId.replace('wh-', '')}`],
                  ['Nhập kho', viewBox.checkInDate ? formatDate(viewBox.checkInDate) : '—'],
                  ['Dự kiến trả', viewBox.checkOutDate ? formatDate(viewBox.checkOutDate) : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400">{k}</div>
                    <div className="text-sm font-medium text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Cập nhật trạng thái:</div>
                <div className="flex flex-wrap gap-2">
                  {(['pending','checked_in','storing','delivered','returned'] as BoxStatus[]).map(s => (
                    <button key={s} onClick={() => { updateBoxStatus(viewBox.id, s); toast.success(`Đã cập nhật trạng thái thùng ${viewBox.boxCode}`); setViewBox(null); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${viewBox.status === s ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {boxStatusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-600 flex items-center gap-2">
                <QrCode className="w-4 h-4"/> Mã QR: <span className="font-mono font-bold">{viewBox.boxCode}</span>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Add box modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Thêm thùng mới">
        <div className="space-y-4">
          <Input label="Mã đơn hàng" value={newBox.bookingId} onChange={e => setNewBox(n => ({ ...n, bookingId: e.target.value }))} placeholder="VD: KB-2026-0001" required/>
          <Textarea label="Mô tả nội dung" value={newBox.description} onChange={e => setNewBox(n => ({ ...n, description: e.target.value }))} placeholder="VD: Quần áo, sách vở..." required/>
          <Select label="Vị trí kho" value={newBox.warehouseLocationId} onChange={e => setNewBox(n => ({ ...n, warehouseLocationId: e.target.value }))}
            options={warehouseLocations.map(l => ({ value: l.id, label: `Khu ${l.shelf}` }))}/>
          <Input label="Ngày nhập kho" type="date" value={newBox.checkInDate} onChange={e => setNewBox(n => ({ ...n, checkInDate: e.target.value }))}/>
          <Input label="Ngày dự kiến trả" type="date" value={newBox.checkOutDate} onChange={e => setNewBox(n => ({ ...n, checkOutDate: e.target.value }))}/>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setAddModal(false)} className="flex-1">Huỷ</Button>
            <Button variant="primary" onClick={handleAddBox} className="flex-1">Thêm thùng</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

