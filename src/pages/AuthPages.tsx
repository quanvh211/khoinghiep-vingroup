import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Package, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/ui/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = searchParams.get('redirect') ?? '/';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    if (result.success) {
      toast.success('Đăng nhập thành công!');
      navigate(result.role === 'admin' ? '/admin' : redirect);
    } else {
      setError(result.message ?? 'Đăng nhập thất bại');
      toast.error('Email hoặc mật khẩu không đúng');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#1e3a5f]">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white"/>
            </div>
            KEEPBOX
          </Link>
          <p className="text-gray-500 mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>
        <Card className="p-6 sm:p-8">
          {/* Demo accounts */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-xs">
            <p className="font-semibold text-blue-800 mb-2">🔑 Tài khoản demo:</p>
            <div className="space-y-1 text-blue-700">
              <div className="flex justify-between"><span>Admin:</span><span className="font-mono">admin@keepbox.vn / admin123</span></div>
              <div className="flex justify-between"><span>Khách hàng:</span><span className="font-mono">nguyen.thi.lan@gmail.com / 123456</span></div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@gmail.com"/>
            <div className="relative">
              <Input label="Mật khẩu" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Nhập mật khẩu"/>
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Đăng nhập
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#0ea5e9] font-medium hover:underline">Đăng ký ngay</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { registerCustomer, login } = useAppStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.name) e2.name = 'Vui lòng nhập họ tên';
    if (!form.email) e2.email = 'Vui lòng nhập email';
    if (!form.phone) e2.phone = 'Vui lòng nhập số điện thoại';
    if (form.password.length < 6) e2.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirm) e2.confirm = 'Mật khẩu không khớp';
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = registerCustomer({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    if (result.success) {
      login(form.email, form.password);
      toast.success('Đăng ký thành công! Chào mừng đến KEEPBOX!');
      navigate('/account');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#1e3a5f]">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white"/>
            </div>
            KEEPBOX
          </Link>
          <p className="text-gray-500 mt-2">Tạo tài khoản mới</p>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Họ và tên" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required error={errors.name} placeholder="Nguyễn Văn A"/>
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required error={errors.email} placeholder="email@gmail.com"/>
            <Input label="Số điện thoại" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} required error={errors.phone} placeholder="0901234567"/>
            <Input label="Mật khẩu" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} required error={errors.password} placeholder="Tối thiểu 6 ký tự"/>
            <Input label="Xác nhận mật khẩu" type="password" value={form.confirm} onChange={e => setForm(f=>({...f,confirm:e.target.value}))} required error={errors.confirm} placeholder="Nhập lại mật khẩu"/>
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Đăng ký
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#0ea5e9] font-medium hover:underline">Đăng nhập</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

