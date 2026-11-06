import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f1f36] text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              KEEPBOX
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Giải phóng không gian – An tâm lưu trữ.
            </p>
            <p className="text-xs text-gray-500">
              🏷️ Đây là dữ liệu demo cho mục đích trình bày startup.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0ea5e9] rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xs font-bold">FB</span>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0ea5e9] rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xs font-bold">YT</span>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0ea5e9] rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              {['Gói MINI', 'Gói BASIC', 'Gói STANDARD', 'Gói PLUS', 'Lấy hàng tại nhà', 'Giao hàng tận nhà'].map(item => (
                <li key={item}>
                  <Link to="/services" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/booking', label: 'Đặt lưu trữ' },
                { to: '/tracking', label: 'Theo dõi hàng' },
                { to: '/support', label: 'Hỗ trợ khách hàng' },
                { to: '/login', label: 'Đăng nhập' },
                { to: '/register', label: 'Đăng ký' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#0ea5e9] flex-shrink-0" />
                <span>123 Đường Số 10, KCN Tân Bình, Quận Tân Bình, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
                <span>1800 KEEPBOX (miễn phí)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
                <span>hello@keepbox.vn</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl text-xs text-gray-400">
              Giờ làm việc: Thứ 2 – CN<br />
              7:00 – 20:00
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2024 KEEPBOX. Dữ liệu demo – không phải dịch vụ thực tế.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-gray-300">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

