import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, Package, Truck, Shield, Star } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { mockPackages, mockAdditionalServices } from '../data/mockData';
import { formatVND } from '../utils';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'month' | '3month' | '6month'>('month');

  const discounts = { month: 1, '3month': 0.95, '6month': 0.88 };
  const cycleLabels = { month: '1 tháng', '3month': '3 tháng (–5%)', '6month': '6 tháng (–12%)' };

  const features = [
    'Lưu trữ an toàn 24/7', 'Theo dõi trực tuyến', 'Mã QR mỗi thùng',
    'Ảnh chụp nhập kho', 'Hỗ trợ 7 ngày', 'Hỗ trợ ưu tiên 24/7', 'Báo cáo hàng tháng'
  ];
  const featuresByPkg: Record<string, boolean[]> = {
    'pkg-1': [true,  true,  false, false, false, false, false],
    'pkg-2': [true,  true,  true,  false, true,  false, false],
    'pkg-3': [true,  true,  true,  true,  true,  false, false],
    'pkg-4': [true,  true,  true,  true,  true,  true,  true ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1e3a5f] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Package className="w-4 h-4"/> Dịch vụ & Bảng giá
        </div>
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-3">Chọn gói lưu trữ phù hợp</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Giá tham khảo demo — không phải giá dịch vụ thực tế. Thùng tiêu chuẩn: 60 × 40 × 40 cm.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-6 gap-1">
          {(['month', '3month', '6month'] as const).map(c => (
            <button
              key={c}
              onClick={() => setBillingCycle(c)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                billingCycle === c ? 'bg-white shadow-sm text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {cycleLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Package cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-16">
        {mockPackages.map(pkg => {
          const price = Math.round(pkg.pricePerMonth * discounts[billingCycle]);
          return (
            <Card key={pkg.id} className={`p-6 relative flex flex-col ${pkg.popular ? 'ring-2 ring-[#f97316] shadow-orange-100 shadow-lg' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ Phổ biến nhất
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider mb-1">{pkg.name}</div>
                <div className="text-3xl font-bold text-[#1e3a5f]">{formatVND(price)}</div>
                <div className="text-xs text-gray-400 mb-1">/tháng</div>
                {billingCycle !== 'month' && (
                  <div className="text-xs text-green-600 font-medium mb-2">Tiết kiệm {formatVND(pkg.pricePerMonth - price)}/tháng</div>
                )}
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{pkg.description}</p>
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                  <span className="font-semibold text-gray-800">Tối đa {pkg.maxBoxes} thùng</span>
                  <span className="text-gray-400"> · 60×40×40 cm</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={pkg.popular ? 'primary' : 'outline'}
                size="md"
                className="w-full"
                onClick={() => navigate(`/booking?pkg=${pkg.id}`)}
              >
                Đăng ký ngay
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-8">So sánh các gói</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-48">Tính năng</th>
                  {mockPackages.map(p => (
                    <th key={p.id} className={`p-4 text-center text-sm font-bold ${p.popular ? 'text-[#f97316]' : 'text-[#1e3a5f]'}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm text-gray-600">Số thùng tối đa</td>
                  {mockPackages.map(p => (
                    <td key={p.id} className="p-4 text-center text-sm font-semibold text-gray-800">{p.maxBoxes}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <td className="p-4 text-sm text-gray-600">Giá/tháng</td>
                  {mockPackages.map(p => (
                    <td key={p.id} className={`p-4 text-center text-sm font-bold ${p.popular ? 'text-[#f97316]' : 'text-[#1e3a5f]'}`}>
                      {formatVND(p.pricePerMonth)}
                    </td>
                  ))}
                </tr>
                {features.map((feat, fi) => (
                  <tr key={feat} className={`border-b border-gray-50 ${fi % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="p-4 text-sm text-gray-600">{feat}</td>
                    {mockPackages.map(p => (
                      <td key={p.id} className="p-4 text-center">
                        {featuresByPkg[p.id]?.[fi]
                          ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto"/>
                          : <X className="w-4 h-4 text-gray-300 mx-auto"/>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="p-4"/>
                  {mockPackages.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <Button
                        variant={p.popular ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => navigate(`/booking?pkg=${p.id}`)}
                      >
                        Chọn {p.name}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Additional services */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-3">Dịch vụ bổ sung</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Phí tham khảo demo</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAdditionalServices.map(svc => (
            <Card key={svc.id} className="p-5">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-[#f97316]"/>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{svc.name}</h3>
              <p className="text-[#f97316] font-bold">
                {formatVND(svc.minPrice)} – {formatVND(svc.maxPrice)}
                <span className="text-gray-400 font-normal text-xs">{svc.unit}</span>
              </p>
              {!svc.enabled && <span className="text-xs text-gray-400 mt-1 block">Sắp ra mắt</span>}
            </Card>
          ))}
        </div>
      </div>

      {/* Guarantees */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0ea5e9] rounded-3xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-8">Cam kết của KEEPBOX</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Shield className="w-7 h-7"/>, title: 'Bảo mật tuyệt đối', desc: 'Camera 24/7, kiểm soát ra vào nghiêm ngặt, bảo hiểm hàng hóa cơ bản' },
            { icon: <Star className="w-7 h-7"/>, title: 'Chất lượng đảm bảo', desc: 'Kho sạch sẽ, kiểm soát nhiệt độ-độ ẩm, không ẩm mốc, không côn trùng' },
            { icon: <Truck className="w-7 h-7"/>, title: 'Giao nhận đúng hẹn', desc: 'Cam kết đúng giờ đã đặt lịch. Trễ hơn 30 phút hoàn tiền phí dịch vụ' },
          ].map(g => (
            <div key={g.title} className="text-center">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                {g.icon}
              </div>
              <h3 className="font-bold mb-2">{g.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

