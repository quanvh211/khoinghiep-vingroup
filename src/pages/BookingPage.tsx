import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, User, Archive, Truck, FileText, ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react';
import { Button, Card, Input, Select, Textarea } from '../components/ui';
import { useAppStore } from '../store/appStore';
import { mockPackages } from '../data/mockData';
import { formatVND } from '../utils';
import { useToast } from '../components/ui/Toast';
import type { LogisticsType } from '../types';

const STEPS = [
  { id: 1, label: 'Chọn gói', icon: <Package className="w-4 h-4"/> },
  { id: 2, label: 'Thông tin', icon: <User className="w-4 h-4"/> },
  { id: 3, label: 'Chi tiết', icon: <Archive className="w-4 h-4"/> },
  { id: 4, label: 'Vận chuyển', icon: <Truck className="w-4 h-4"/> },
  { id: 5, label: 'Xác nhận', icon: <FileText className="w-4 h-4"/> },
];

interface BookingForm {
  packageId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  storageLocation: string;
  numberOfBoxes: number;
  belongingsType: string;
  estimatedDuration: number;
  startDate: string;
  specialInstructions: string;
  dropoffType: LogisticsType;
  pickupType: LogisticsType;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, currentCustomer, createBooking } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<BookingForm>({
    packageId: searchParams.get('pkg') ?? '',
    name: currentCustomer?.name ?? '',
    phone: currentCustomer?.phone ?? '',
    email: currentCustomer?.email ?? '',
    address: currentCustomer?.address ?? '',
    district: currentCustomer?.district ?? '',
    storageLocation: 'Kho KEEPBOX Tân Bình',
    numberOfBoxes: 1,
    belongingsType: '',
    estimatedDuration: 1,
    startDate: new Date().toISOString().split('T')[0],
    specialInstructions: '',
    dropoffType: 'self_drop',
    pickupType: 'self_collect',
  });

  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  const selectedPkg = mockPackages.find(p => p.id === form.packageId);
  const pickupFee = form.dropoffType === 'pickup_request' ? 50000 : 0;
  const deliveryFee = form.pickupType === 'delivery_request' ? 50000 : 0;
  const additionalFees = pickupFee + deliveryFee;
  const totalAmount = (selectedPkg ? selectedPkg.pricePerMonth * form.estimatedDuration : 0) + additionalFees;

  function update<K extends keyof BookingForm>(key: K, val: BookingForm[K]) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof BookingForm, string>> = {};
    if (step === 1 && !form.packageId) e.packageId = 'Vui lòng chọn gói';
    if (step === 2) {
      if (!form.name) e.name = 'Vui lòng nhập họ tên';
      if (!form.phone) e.phone = 'Vui lòng nhập số điện thoại';
      if (!form.email) e.email = 'Vui lòng nhập email';
      if (!form.address) e.address = 'Vui lòng nhập địa chỉ';
    }
    if (step === 3 && !form.belongingsType) e.belongingsType = 'Vui lòng mô tả đồ vật';
    setErrors(e as Partial<BookingForm>);
    return Object.keys(e).length === 0;
  }

  async function handleNext() {
    if (!validate()) return;
    if (step === 5) {
      if (!currentUser) { navigate('/login?redirect=/booking'); return; }
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      const booking = createBooking({
        customerId: currentCustomer!.id,
        packageId: form.packageId,
        status: 'pending',
        numberOfBoxes: form.numberOfBoxes,
        belongingsType: form.belongingsType,
        estimatedDuration: form.estimatedDuration,
        startDate: form.startDate,
        endDate: new Date(new Date(form.startDate).getTime() + form.estimatedDuration * 30 * 86400000).toISOString().split('T')[0],
        specialInstructions: form.specialInstructions,
        dropoffType: form.dropoffType,
        pickupType: form.pickupType,
        totalAmount,
        additionalFees,
      });
      setSubmittedCode(booking.bookingCode);
      setLoading(false);
      setStep(6);
      return;
    }
    setStep(s => s + 1);
  }

  const copyCode = () => {
    navigator.clipboard.writeText(submittedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 6) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h1>
          <p className="text-gray-500 mb-6 text-sm">Chúng tôi sẽ xác nhận đơn hàng và liên hệ với bạn trong vòng 2 giờ làm việc.</p>
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-400 mb-1">Mã đơn hàng của bạn</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-[#1e3a5f] tracking-wider">{submittedCode}</span>
              <button onClick={copyCode} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4 text-gray-400"/>}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-blue-50 rounded-xl p-4 mb-6 text-left space-y-1">
            <div><span className="font-medium">Gói:</span> {selectedPkg?.name}</div>
            <div><span className="font-medium">Ngày bắt đầu:</span> {form.startDate}</div>
            <div><span className="font-medium">Tổng tiền (ước tính):</span> {formatVND(totalAmount)}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/account/orders')}>
              Xem đơn hàng của tôi
            </Button>
            <Button variant="outline" size="md" className="w-full" onClick={() => navigate('/tracking?code=' + submittedCode)}>
              Theo dõi đơn hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"/>
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
              step > s.id ? 'bg-green-500 border-green-500 text-white' :
              step === s.id ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white' :
              'bg-white border-gray-200 text-gray-400'
            }`}>
              {step > s.id ? <Check className="w-4 h-4"/> : s.id}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === s.id ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="p-6 sm:p-8">
        {/* Step 1: Select package */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Chọn gói lưu trữ</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mockPackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => { update('packageId', pkg.id); update('numberOfBoxes', 1); }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    form.packageId === pkg.id
                      ? 'border-[#1e3a5f] bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">{pkg.name}</span>
                      {pkg.popular && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Phổ biến</span>}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.packageId === pkg.id ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                      {form.packageId === pkg.id && <div className="w-2 h-2 bg-white rounded-full"/>}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#1e3a5f]">{formatVND(pkg.pricePerMonth)}<span className="text-sm font-normal text-gray-400">/tháng</span></div>
                  <div className="text-sm text-gray-500 mt-1">Tối đa {pkg.maxBoxes} thùng · 60×40×40 cm</div>
                </div>
              ))}
            </div>
            {errors.packageId && <p className="text-red-500 text-sm mt-3">{errors.packageId}</p>}
          </div>
        )}

        {/* Step 2: Customer info */}
        {step === 2 && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin khách hàng</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Họ và tên" required value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} placeholder="Nguyễn Văn A"/>
              <Input label="Số điện thoại" required value={form.phone} onChange={e => update('phone', e.target.value)} error={errors.phone} placeholder="0901234567"/>
            </div>
            <Input label="Email" required type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} placeholder="email@gmail.com"/>
            <Input label="Địa chỉ" required value={form.address} onChange={e => update('address', e.target.value)} error={errors.address} placeholder="Số nhà, tên đường"/>
            <div className="grid md:grid-cols-2 gap-4">
              <Select label="Quận/Huyện" value={form.district} onChange={e => update('district', e.target.value)}
                options={['', 'Quận 1','Quận 3','Quận 4','Quận 5','Quận 10','Quận 11','Bình Thạnh','Phú Nhuận','Tân Bình','Gò Vấp'].map(d => ({ value: d, label: d || 'Chọn quận...' }))}
              />
              <Select label="Vị trí kho" value={form.storageLocation} onChange={e => update('storageLocation', e.target.value)}
                options={[{ value: 'Kho KEEPBOX Tân Bình', label: 'Kho Tân Bình (123 Đường số 10)' }]}
              />
            </div>
          </div>
        )}

        {/* Step 3: Storage info */}
        {step === 3 && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin lưu trữ</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Số thùng <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  max={selectedPkg?.maxBoxes ?? 10}
                  value={form.numberOfBoxes}
                  onChange={e => update('numberOfBoxes', Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
                />
                <p className="text-xs text-gray-400 mt-1">Tối đa {selectedPkg?.maxBoxes ?? '—'} thùng theo gói {selectedPkg?.name}</p>
              </div>
              <Select label="Thời gian lưu trữ (tháng)" value={String(form.estimatedDuration)} onChange={e => update('estimatedDuration', Number(e.target.value))}
                options={[1,2,3,4,5,6].map(n => ({ value: String(n), label: `${n} tháng` }))}
              />
            </div>
            <Textarea label="Loại đồ vật" value={form.belongingsType} onChange={e => update('belongingsType', e.target.value)} error={errors.belongingsType}
              placeholder="VD: Sách vở, quần áo, đồ điện tử..." required/>
            <Input label="Ngày bắt đầu" type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} required min={new Date().toISOString().split('T')[0]}/>
            <Textarea label="Ghi chú đặc biệt" value={form.specialInstructions} onChange={e => update('specialInstructions', e.target.value)}
              placeholder="Đồ dễ vỡ, cần xử lý đặc biệt..."/>
          </div>
        )}

        {/* Step 4: Logistics */}
        {step === 4 && (
          <div className="animate-fadeIn space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hình thức vận chuyển</h2>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📦 Mang đồ đến kho</h3>
              <div className="space-y-2">
                {([
                  { value: 'self_drop', label: 'Tự mang đến kho', desc: 'Miễn phí · Bạn tự vận chuyển đồ đến kho KEEPBOX', free: true },
                  { value: 'pickup_request', label: 'Yêu cầu lấy hàng tại nhà', desc: '+50,000 VND · Nhân viên đến địa chỉ của bạn lấy đồ', free: false },
                ] as const).map(opt => (
                  <div key={opt.value} onClick={() => update('dropoffType', opt.value)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex gap-3 ${form.dropoffType === opt.value ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${form.dropoffType === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                      {form.dropoffType === opt.value && <div className="w-2 h-2 bg-white rounded-full"/>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🚚 Nhận đồ về</h3>
              <div className="space-y-2">
                {([
                  { value: 'self_collect', label: 'Tự đến kho lấy', desc: 'Miễn phí · Bạn tự đến kho KEEPBOX lấy đồ về', free: true },
                  { value: 'delivery_request', label: 'Giao hàng tận nhà', desc: '+50,000 VND · Chúng tôi giao đồ đến địa chỉ bạn', free: false },
                ] as const).map(opt => (
                  <div key={opt.value} onClick={() => update('pickupType', opt.value)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex gap-3 ${form.pickupType === opt.value ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${form.pickupType === opt.value ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-gray-300'}`}>
                      {form.pickupType === opt.value && <div className="w-2 h-2 bg-white rounded-full"/>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Xác nhận đơn hàng</h2>
            <div className="space-y-3">
              {[
                ['Gói lưu trữ', selectedPkg?.name ?? '—'],
                ['Số thùng', `${form.numberOfBoxes} thùng`],
                ['Thời gian', `${form.estimatedDuration} tháng`],
                ['Ngày bắt đầu', form.startDate],
                ['Đồ vật', form.belongingsType || '—'],
                ['Lấy hàng', form.dropoffType === 'pickup_request' ? 'Tại nhà (+50,000₫)' : 'Tự mang đến kho'],
                ['Nhận hàng', form.pickupType === 'delivery_request' ? 'Giao tận nhà (+50,000₫)' : 'Tự lấy tại kho'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800 text-right max-w-48">{v}</span>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí lưu trữ ({form.estimatedDuration} tháng)</span>
                  <span>{formatVND(selectedPkg ? selectedPkg.pricePerMonth * form.estimatedDuration : 0)}</span>
                </div>
                {pickupFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí lấy hàng</span>
                    <span>{formatVND(pickupFee)}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí giao hàng</span>
                    <span>{formatVND(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                  <span className="text-gray-900">Tổng ước tính</span>
                  <span className="text-[#1e3a5f] text-lg">{formatVND(totalAmount)}</span>
                </div>
              </div>
              {!currentUser && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700">
                  ⚠️ Bạn cần <strong>đăng nhập</strong> để hoàn tất đặt lịch. Thông tin đã nhập sẽ được lưu lại.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="w-4 h-4"/> Quay lại
            </Button>
          )}
          <Button
            variant="primary"
            className="ml-auto"
            loading={loading}
            onClick={handleNext}
          >
            {step === 5
              ? (currentUser ? 'Xác nhận đặt lịch' : 'Đăng nhập để đặt lịch')
              : (<>Tiếp theo <ArrowRight className="w-4 h-4"/></>)
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}

