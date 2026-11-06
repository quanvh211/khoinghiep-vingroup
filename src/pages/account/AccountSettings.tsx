import React, { useState } from 'react';
import { User, Lock, MapPin, Save } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Input, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

export default function AccountSettings() {
  const { currentCustomer, currentUser, updateCustomer } = useAppStore();
  const toast = useToast();
  const [profile, setProfile] = useState({
    name: currentCustomer?.name ?? '',
    phone: currentCustomer?.phone ?? '',
    email: currentCustomer?.email ?? '',
    address: currentCustomer?.address ?? '',
    district: currentCustomer?.district ?? '',
  });
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });

  function saveProfile() {
    if (currentCustomer) {
      updateCustomer(currentCustomer.id, { name: profile.name, phone: profile.phone, address: profile.address, district: profile.district });
      toast.success('Cập nhật thông tin thành công!');
    }
  }

  function changePassword() {
    if (!pw.current) { toast.error('Vui lòng nhập mật khẩu hiện tại'); return; }
    if (pw.newPw !== pw.confirm) { toast.error('Mật khẩu mới không khớp'); return; }
    if (pw.newPw.length < 6) { toast.error('Mật khẩu tối thiểu 6 ký tự'); return; }
    toast.success('Đổi mật khẩu thành công! (Demo)');
    setPw({ current: '', newPw: '', confirm: '' });
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
      </div>

      {/* Profile */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600"/>
          </div>
          <h2 className="font-semibold text-gray-900">Thông tin cá nhân</h2>
        </div>
        <div className="space-y-4">
          <Input label="Họ và tên" value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))}/>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Số điện thoại" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))}/>
            <Input label="Email" value={profile.email} disabled className="bg-gray-50 text-gray-400"/>
          </div>
          <Button variant="primary" size="sm" onClick={saveProfile}><Save className="w-4 h-4"/> Lưu thay đổi</Button>
        </div>
      </Card>

      {/* Address */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-600"/>
          </div>
          <h2 className="font-semibold text-gray-900">Địa chỉ</h2>
        </div>
        <div className="space-y-4">
          <Input label="Địa chỉ" value={profile.address} onChange={e => setProfile(p=>({...p,address:e.target.value}))} placeholder="Số nhà, tên đường"/>
          <Input label="Quận/Huyện" value={profile.district} onChange={e => setProfile(p=>({...p,district:e.target.value}))} placeholder="Quận 1"/>
          <Button variant="primary" size="sm" onClick={saveProfile}><Save className="w-4 h-4"/> Lưu địa chỉ</Button>
        </div>
      </Card>

      {/* Password */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-green-600"/>
          </div>
          <h2 className="font-semibold text-gray-900">Đổi mật khẩu</h2>
        </div>
        <div className="space-y-4">
          <Input label="Mật khẩu hiện tại" type="password" value={pw.current} onChange={e => setPw(p=>({...p,current:e.target.value}))}/>
          <Input label="Mật khẩu mới" type="password" value={pw.newPw} onChange={e => setPw(p=>({...p,newPw:e.target.value}))} hint="Tối thiểu 6 ký tự"/>
          <Input label="Xác nhận mật khẩu mới" type="password" value={pw.confirm} onChange={e => setPw(p=>({...p,confirm:e.target.value}))}/>
          <Button variant="primary" size="sm" onClick={changePassword}><Lock className="w-4 h-4"/> Đổi mật khẩu</Button>
        </div>
      </Card>
    </div>
  );
}

