import React, { useState } from 'react';
import { Save, User, Warehouse, Phone, Bell } from 'lucide-react';
import { Card, Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

export default function AdminSettings() {
  const toast = useToast();
  const [profile, setProfile] = useState({ name: 'Admin KEEPBOX', email: 'admin@keepbox.vn', phone: '0901999888' });
  const [warehouse, setWarehouse] = useState({ name: 'Kho KEEPBOX Tân Bình', address: '123 Đường Số 10, KCN Tân Bình', city: 'TP. Hồ Chí Minh', capacity: '100', hotline: '1800 KEEPBOX' });
  const [notifs, setNotifs] = useState({ newOrder: true, newCustomer: true, deliveryAlert: true, lowCapacity: false });
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });

  function save(msg: string) { toast.success(msg); }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-500 text-sm">Quản lý thông tin admin và cấu hình KEEPBOX.</p>
      </div>

      {/* Admin profile */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><User className="w-4 h-4 text-blue-600"/></div>
          <h2 className="font-semibold text-gray-900">Hồ sơ Admin</h2>
        </div>
        <div className="space-y-4">
          <Input label="Tên hiển thị" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}/>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}/>
            <Input label="Số điện thoại" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}/>
          </div>
          <Button variant="primary" size="sm" onClick={() => save('Đã cập nhật hồ sơ!')}><Save className="w-4 h-4"/> Lưu hồ sơ</Button>
        </div>
      </Card>

      {/* Warehouse info */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center"><Warehouse className="w-4 h-4 text-orange-600"/></div>
          <h2 className="font-semibold text-gray-900">Thông tin kho</h2>
        </div>
        <div className="space-y-4">
          <Input label="Tên kho" value={warehouse.name} onChange={e => setWarehouse(w => ({ ...w, name: e.target.value }))}/>
          <Input label="Địa chỉ" value={warehouse.address} onChange={e => setWarehouse(w => ({ ...w, address: e.target.value }))}/>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Thành phố" value={warehouse.city} onChange={e => setWarehouse(w => ({ ...w, city: e.target.value }))}/>
            <Input label="Tổng công suất (thùng)" type="number" value={warehouse.capacity} onChange={e => setWarehouse(w => ({ ...w, capacity: e.target.value }))}/>
          </div>
          <Input label="Hotline" value={warehouse.hotline} onChange={e => setWarehouse(w => ({ ...w, hotline: e.target.value }))}/>
          <Button variant="primary" size="sm" onClick={() => save('Đã cập nhật thông tin kho!')}><Save className="w-4 h-4"/> Lưu</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center"><Bell className="w-4 h-4 text-purple-600"/></div>
          <h2 className="font-semibold text-gray-900">Cài đặt thông báo</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'newOrder', label: 'Đơn hàng mới', desc: 'Thông báo khi có đơn đặt mới' },
            { key: 'newCustomer', label: 'Khách hàng mới', desc: 'Thông báo khi có khách đăng ký' },
            { key: 'deliveryAlert', label: 'Cảnh báo giao nhận', desc: 'Thông báo yêu cầu giao nhận chờ xử lý' },
            { key: 'lowCapacity', label: 'Cảnh báo đầy kho', desc: 'Thông báo khi kho đạt 80% công suất' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[item.key as keyof typeof notifs] ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </div>
          ))}
          <Button variant="primary" size="sm" onClick={() => save('Đã lưu cài đặt thông báo!')} className="mt-2"><Save className="w-4 h-4"/> Lưu cài đặt</Button>
        </div>
      </Card>

      {/* Change password */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center"><User className="w-4 h-4 text-green-600"/></div>
          <h2 className="font-semibold text-gray-900">Đổi mật khẩu Admin</h2>
        </div>
        <div className="space-y-4">
          <Input label="Mật khẩu hiện tại" type="password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))}/>
          <Input label="Mật khẩu mới" type="password" value={pw.newPw} onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))}/>
          <Input label="Xác nhận mật khẩu mới" type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}/>
          <Button variant="primary" size="sm" onClick={() => { save('Đổi mật khẩu thành công! (Demo)'); setPw({ current: '', newPw: '', confirm: '' }); }}><Save className="w-4 h-4"/> Đổi mật khẩu</Button>
        </div>
      </Card>
    </div>
  );
}

