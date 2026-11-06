import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronDown } from 'lucide-react';
import { Button, Card, Input, Select, Textarea } from '../components/ui';
import { useToast } from '../components/ui/Toast';

const faqs = [
  { q: 'Làm thế nào để hủy đơn đặt lịch?', a: 'Bạn có thể hủy đơn hàng trong vòng 24 giờ sau khi đặt mà không mất phí. Liên hệ hotline hoặc gửi yêu cầu qua trang này.' },
  { q: 'Tôi có thể thêm thùng vào đơn hiện tại không?', a: 'Có, bạn có thể nâng cấp gói lưu trữ hoặc đặt thêm thùng trong phạm vi gói hiện tại. Liên hệ chúng tôi để được hỗ trợ.' },
  { q: 'Quy trình nhập kho diễn ra như thế nào?', a: 'Nhân viên sẽ kiểm tra, chụp ảnh và gán mã QR cho mỗi thùng trước khi nhập kho. Bạn sẽ nhận xác nhận qua email khi hoàn tất.' },
  { q: 'KEEPBOX có nhận đồ điện tử không?', a: 'Có, chúng tôi nhận thiết bị điện tử. Khuyến nghị đóng gói cẩn thận trong bao bì chống sốc. Chúng tôi sẽ kiểm tra kỹ trước khi nhận.' },
  { q: 'Phương thức thanh toán nào được chấp nhận?', a: 'Chúng tôi chấp nhận chuyển khoản ngân hàng, tiền mặt và thanh toán QR. Hóa đơn sẽ được gửi qua email.' },
];

const chatMessages = [
  { from: 'bot', text: 'Xin chào! Tôi là trợ lý KEEPBOX. Tôi có thể giúp gì cho bạn hôm nay?' },
];

export default function SupportPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', type: 'question', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [submitted, setSubmitted] = useState(false);

  const botReplies = [
    'Cảm ơn bạn! Chúng tôi sẽ liên hệ hỗ trợ trong vòng 2 giờ làm việc.',
    'Bạn có thể gọi hotline 1800 KEEPBOX để được hỗ trợ ngay lập tức.',
    'Tôi đã ghi nhận yêu cầu của bạn và chuyển đến bộ phận hỗ trợ.',
    'Bạn có thể xem câu hỏi thường gặp bên dưới trang này để tìm câu trả lời nhanh hơn.',
  ];

  function sendChat() {
    if (!chatInput.trim()) return;
    setMessages(m => [...m, { from: 'user', text: chatInput }]);
    const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
    setTimeout(() => setMessages(m => [...m, { from: 'bot', text: reply }]), 800);
    setChatInput('');
  }

  function submitForm() {
    toast.success('Phản hồi của bạn đã được gửi thành công!');
    setSubmitted(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">Hỗ trợ khách hàng</h1>
        <p className="text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ bạn 7 ngày/tuần</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: <Phone className="w-5 h-5 text-[#0ea5e9]"/>, title: 'Hotline', desc: '1800 KEEPBOX', sub: 'Miễn phí · 7:00–20:00' },
            { icon: <Mail className="w-5 h-5 text-[#0ea5e9]"/>, title: 'Email', desc: 'hello@keepbox.vn', sub: 'Phản hồi trong 2h' },
            { icon: <MapPin className="w-5 h-5 text-[#0ea5e9]"/>, title: 'Kho KEEPBOX', desc: '123 Đường Số 10', sub: 'KCN Tân Bình, TP.HCM' },
            { icon: <Clock className="w-5 h-5 text-[#0ea5e9]"/>, title: 'Giờ làm việc', desc: 'Thứ 2 – Chủ nhật', sub: '7:00 – 20:00' },
          ].map(item => (
            <Card key={item.title} className="p-4 flex gap-3 items-start">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <div className="text-sm text-gray-700">{item.desc}</div>
                <div className="text-xs text-gray-400">{item.sub}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-7 h-7 text-green-500"/>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Gửi thành công!</h3>
                <p className="text-gray-500 text-sm">Chúng tôi sẽ liên hệ bạn trong vòng 2 giờ làm việc.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSubmitted(false); setForm({ name:'',email:'',type:'question',subject:'',message:'' }); }}>Gửi yêu cầu khác</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-bold text-gray-900 text-lg">Gửi yêu cầu hỗ trợ</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Họ tên" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Nguyễn Văn A"/>
                  <Input label="Email" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="email@gmail.com"/>
                </div>
                <Select label="Loại yêu cầu" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}
                  options={[
                    { value: 'question', label: 'Câu hỏi chung' },
                    { value: 'complaint', label: 'Khiếu nại' },
                    { value: 'suggestion', label: 'Góp ý / Đề xuất' },
                    { value: 'booking', label: 'Hỗ trợ đặt lịch' },
                    { value: 'delivery', label: 'Vấn đề giao nhận' },
                  ]}
                />
                <Input label="Chủ đề" value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))} placeholder="Tóm tắt vấn đề của bạn"/>
                <Textarea label="Nội dung" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi..." rows={5}/>
                <Button variant="primary" onClick={submitForm} disabled={!form.name || !form.email || !form.message}>
                  <Send className="w-4 h-4"/> Gửi yêu cầu
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-8">Câu hỏi thường gặp</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}/>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed animate-fadeIn">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn overflow-hidden">
            <div className="bg-[#1e3a5f] text-white p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4"/>
              </div>
              <div>
                <div className="font-semibold text-sm">Hỗ trợ KEEPBOX</div>
                <div className="text-xs text-blue-200 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>Online</div>
              </div>
            </div>
            <div className="h-56 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-56 px-3 py-2 rounded-xl text-sm ${
                    msg.from === 'user' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                placeholder="Nhập tin nhắn..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
              />
              <button onClick={sendChat} className="w-9 h-9 bg-[#1e3a5f] text-white rounded-xl flex items-center justify-center hover:bg-[#1a3254]">
                <Send className="w-4 h-4"/>
              </button>
            </div>
            <p className="text-center text-xs text-gray-300 pb-2">Demo chat – không phải hỗ trợ thực</p>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-[#f97316] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#ea580c] transition-colors">
          <MessageCircle className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
}

