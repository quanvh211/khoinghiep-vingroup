import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Shield, Clock, ChevronRight, Star, 
  ArrowRight, CheckCircle, Truck, Warehouse, QrCode,
  MapPin, Phone, ChevronDown 
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { mockPackages } from '../data/mockData';
import { formatVND } from '../utils';

const testimonials = [
  { name: 'Nguyễn Thị Lan', role: 'Sinh viên ĐH Bách Khoa', rating: 5, text: 'KEEPBOX giúp mình tiết kiệm rất nhiều không gian trong phòng trọ. Dịch vụ lấy hàng tận nơi quá tiện lợi!' },
  { name: 'Trần Minh Đức', role: 'Nhân viên văn phòng, Q.3', rating: 5, text: 'Giá cả hợp lý, nhân viên chuyên nghiệp. Hàng được lưu trữ cẩn thận, an toàn. Rất hài lòng!' },
  { name: 'Bùi Thị Thu', role: 'Hộ gia đình, Phú Nhuận', rating: 5, text: 'Có con nhỏ, đồ chơi nhiều quá. KEEPBOX giúp gia đình tôi dọn dẹp không gian sống rất hiệu quả.' },
];

const faqs = [
  { q: 'Kích thước thùng tiêu chuẩn là bao nhiêu?', a: 'Thùng tiêu chuẩn của KEEPBOX có kích thước 60 × 40 × 40 cm, đủ để chứa quần áo, sách vở và nhiều đồ dùng thông thường.' },
  { q: 'Tôi có thể lấy đồ ra bất kỳ lúc nào không?', a: 'Có! Bạn có thể yêu cầu giao trả hàng bất kỳ lúc nào trong giờ làm việc (7h–20h mỗi ngày). Chi phí giao hàng sẽ được tính thêm.' },
  { q: 'KEEPBOX có bảo hiểm cho hàng lưu trữ không?', a: 'Hiện tại KEEPBOX có gói bảo hiểm cơ bản tích hợp. Bạn có thể xem thêm các gói bảo hiểm nâng cao tại trang Dịch vụ.' },
  { q: 'Tôi có thể lưu những loại đồ gì?', a: 'Bạn có thể lưu hầu hết đồ dùng gia đình, quần áo, sách vở, thiết bị điện tử. Chúng tôi không nhận đồ dễ cháy, chất lỏng, thực phẩm.' },
  { q: 'Làm thế nào để theo dõi hàng của tôi?', a: 'Mỗi thùng đồ có mã QR riêng. Bạn có thể scan QR hoặc nhập mã đơn hàng trên trang Theo Dõi Hàng để xem trạng thái realtime.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0f1f36] via-[#1e3a5f] to-[#1a3254] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-32 h-32 border border-white/20 rounded-2xl"
              style={{ left: `${(i % 5) * 22}%`, top: `${Math.floor(i / 5) * 28}%`, transform: 'rotate(15deg)' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                Dịch vụ lưu trữ #1 TP.HCM
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Không gian nhỏ?<br />
                <span className="text-[#f97316]">Để KEEPBOX lo!</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-md leading-relaxed">
                Lưu trữ đồ đạc an toàn, linh hoạt và tiết kiệm dành cho sinh viên và người thuê trọ tại TP.HCM.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-[#f97316] hover:bg-[#ea580c] text-white border-0 shadow-lg shadow-orange-500/30" onClick={() => navigate('/booking')}>
                  Đăng ký lưu trữ ngay <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" onClick={() => navigate('/services')}>
                  Khám phá dịch vụ
                </Button>
              </div>
              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/15">
                {[['500+', 'Khách hàng'], ['1,200+', 'Thùng lưu trữ'], ['4.9/5', 'Đánh giá']].map(([val, lab]) => (
                  <div key={lab}>
                    <div className="text-2xl font-bold text-[#f97316]">{val}</div>
                    <div className="text-sm text-blue-200">{lab}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/5 rounded-3xl border border-white/15 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-3 p-6">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        i % 3 === 0 ? 'bg-[#0ea5e9]/30' : i % 3 === 1 ? 'bg-[#f97316]/20' : 'bg-white/10'
                      }`}>
                        <Package className="w-7 h-7 text-white/60" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* floating badges */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg">
                  ✓ An toàn 24/7
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#f97316] text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg">
                  từ 49.000₫/tháng
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z"/>
          </svg>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Tại sao chọn KEEPBOX?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Giải pháp lưu trữ hiện đại, an toàn và linh hoạt cho cuộc sống đô thị</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Package className="w-7 h-7 text-[#0ea5e9]"/>, title: 'Tiết kiệm không gian', desc: 'Giải phóng không gian sống, biến phòng nhỏ thành không gian thoáng đãng và dễ chịu hơn.', color: 'bg-blue-50' },
            { icon: <Shield className="w-7 h-7 text-green-500"/>, title: 'Lưu trữ an toàn', desc: 'Kho bảo mật 24/7, camera giám sát toàn thời gian, kiểm soát nhiệt độ và độ ẩm phù hợp.', color: 'bg-green-50' },
            { icon: <Clock className="w-7 h-7 text-[#f97316]"/>, title: 'Linh hoạt thời gian', desc: 'Lưu trữ ngắn hạn từ 1 tháng. Lấy hàng và giao hàng theo lịch bạn muốn, 7 ngày/tuần.', color: 'bg-orange-50' },
          ].map(b => (
            <Card key={b.title} className="p-6" hover>
              <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center mb-4`}>
                {b.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Cách thức hoạt động</h2>
            <p className="text-gray-500">Chỉ 4 bước đơn giản để lưu trữ đồ đạc</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <QrCode className="w-6 h-6"/>, title: 'Chọn gói & đặt lịch', desc: 'Chọn gói lưu trữ phù hợp và điền thông tin đặt lịch trực tuyến.' },
              { step: '02', icon: <Truck className="w-6 h-6"/>, title: 'Nhân viên đến lấy hàng', desc: 'Đội ngũ của chúng tôi đến địa chỉ bạn, đóng gói và vận chuyển an toàn.' },
              { step: '03', icon: <Warehouse className="w-6 h-6"/>, title: 'Nhập kho & theo dõi', desc: 'Đồ được nhập kho, gán mã QR. Theo dõi trạng thái mọi lúc, mọi nơi.' },
              { step: '04', icon: <Package className="w-6 h-6"/>, title: 'Nhận lại khi cần', desc: 'Đặt lịch giao trả hoặc đến kho tự lấy khi bạn cần đồ trở lại.' },
            ].map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#0ea5e9] to-transparent"/>
                )}
                <div className="relative inline-flex">
                  <div className="w-20 h-20 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#f97316] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ──────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Gói lưu trữ</h2>
          <p className="text-gray-500">Giá tham khảo. Lựa chọn gói phù hợp với nhu cầu của bạn.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {mockPackages.map(pkg => (
            <Card key={pkg.id} className={`p-5 relative ${pkg.popular ? 'ring-2 ring-[#f97316]' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Phổ biến nhất
                </div>
              )}
              <div className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider mb-2">{pkg.name}</div>
              <div className="text-3xl font-bold text-[#1e3a5f] mb-0.5">
                {formatVND(pkg.pricePerMonth)}
              </div>
              <div className="text-xs text-gray-400 mb-4">/tháng · tối đa {pkg.maxBoxes} thùng</div>
              <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
              <ul className="space-y-2 mb-5">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={pkg.popular ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => navigate(`/booking?pkg=${pkg.id}`)}
              >
                Chọn gói này
              </Button>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/services" className="inline-flex items-center gap-1 text-sm text-[#0ea5e9] hover:underline font-medium">
            Xem chi tiết và so sánh tất cả gói <ChevronRight className="w-4 h-4"/>
          </Link>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-20 bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Khách hàng nói gì?</h2>
            <p className="text-blue-200">Hơn 500 khách hàng tin tưởng KEEPBOX</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#f97316] text-[#f97316]"/>)}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0ea5e9] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-blue-300">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Câu hỏi thường gặp</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0ea5e9] rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Sẵn sàng giải phóng không gian?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">Đăng ký ngay hôm nay – nhận tư vấn miễn phí và ưu đãi cho khách hàng mới.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-[#f97316] hover:bg-[#ea580c] text-white border-0 shadow-lg" onClick={() => navigate('/booking')}>
              Đặt lưu trữ ngay <ArrowRight className="w-5 h-5"/>
            </Button>
            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent" onClick={() => navigate('/support')}>
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

