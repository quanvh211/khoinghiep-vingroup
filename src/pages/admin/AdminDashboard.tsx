import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ClipboardList, Package, Warehouse, TrendingUp,
  Truck, AlertCircle, ArrowRight, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAppStore } from '../../store/appStore';
import { Card, Badge } from '../../components/ui';
import { bookingStatusLabels, bookingStatusColors, formatVND, formatDate } from '../../utils';
import { mockMonthlyRevenue } from '../../data/mockData';

const PIE_COLORS = ['#1e3a5f', '#0ea5e9', '#f97316', '#10b981'];

export default function AdminDashboard() {
  const { customers, bookings, storageBoxes, pickupRequests, deliveryRequests, payments, packages } = useAppStore();

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const activeBoxes = storageBoxes.filter(b => b.status === 'storing').length;
  const totalCapacity = 100;
  const occupancyRate = Math.round((activeBoxes / totalCapacity) * 100);
  const pendingPickups = pickupRequests.filter(r => r.status === 'pending').length;
  const pendingDeliveries = deliveryRequests.filter(r => r.status === 'pending').length;

  const stats = [
    { label: 'Tổng khách hàng', value: customers.length, icon: <Users className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50', change: '+3 tháng này', link: '/admin/customers' },
    { label: 'Tổng đơn hàng', value: bookings.length, icon: <ClipboardList className="w-5 h-5 text-green-500"/>, bg: 'bg-green-50', change: '+5 tháng này', link: '/admin/orders' },
    { label: 'Thùng đang lưu', value: activeBoxes, icon: <Package className="w-5 h-5 text-orange-500"/>, bg: 'bg-orange-50', change: `${occupancyRate}% công suất`, link: '/admin/warehouse' },
    { label: 'Doanh thu (demo)', value: formatVND(totalRevenue), icon: <TrendingUp className="w-5 h-5 text-purple-500"/>, bg: 'bg-purple-50', change: 'Tổng tích lũy', link: '/admin/reports' },
    { label: 'Chờ lấy hàng', value: pendingPickups, icon: <Truck className="w-5 h-5 text-red-500"/>, bg: 'bg-red-50', change: 'Cần xử lý', link: '/admin/logistics' },
    { label: 'Chờ giao hàng', value: pendingDeliveries, icon: <AlertCircle className="w-5 h-5 text-yellow-500"/>, bg: 'bg-yellow-50', change: 'Cần xử lý', link: '/admin/logistics' },
  ];

  // Package distribution
  const pkgDist = packages.map(pkg => ({
    name: pkg.name,
    value: bookings.filter(b => b.packageId === pkg.id).length,
  }));

  // Order status distribution
  const statusDist = [
    { name: 'Chờ XN', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Đã XN', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Đang lưu', value: bookings.filter(b => b.status === 'storing').length },
    { name: 'Hoàn tất', value: bookings.filter(b => b.status === 'completed').length },
    { name: 'Đã huỷ', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">🏷️ Dữ liệu demo — KEEPBOX Startup Prototype</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-xl font-medium">
          ⚠️ Demo Data Only
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map(s => (
          <Link key={s.label} to={s.link}>
            <Card className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
              <div className="text-xl font-bold text-gray-900 leading-tight">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
              <div className="text-xs text-gray-400 mt-1">{s.change}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue area chart */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Doanh thu theo ngày (Demo)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockMonthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false}/>
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`}/>
              <Tooltip formatter={(v: unknown) => formatVND(v as number)} labelStyle={{ color: '#374151' }}/>
              <Area type="monotone" dataKey="revenue" stroke="#1e3a5f" strokeWidth={2} fill="url(#revGrad)" name="Doanh thu"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Package distribution pie */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Phân bổ gói lưu trữ</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pkgDist} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {pkgDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center">
            {pkgDist.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }}/>
                {d.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Orders bar */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Đơn hàng theo ngày (Demo)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockMonthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false}/>
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}/>
              <Tooltip/>
              <Bar dataKey="orders" fill="#0ea5e9" name="Đơn hàng" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Warehouse occupancy */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Tình trạng kho</h2>
          <div className="space-y-4">
            {[
              { zone: 'Khu A', used: 33, total: 40, color: 'bg-blue-500' },
              { zone: 'Khu B', used: 17, total: 40, color: 'bg-green-500' },
              { zone: 'Khu C', used: 0, total: 20, color: 'bg-gray-200' },
            ].map(z => (
              <div key={z.zone}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{z.zone}</span>
                  <span className="text-gray-500">{z.used}/{z.total} ô</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${z.color} rounded-full transition-all`} style={{ width: `${(z.used / z.total) * 100}%` }}/>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 text-center">
              <div className="text-2xl font-bold text-[#1e3a5f]">{occupancyRate}%</div>
              <div className="text-xs text-gray-400">Tổng công suất sử dụng</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent bookings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookings.map(b => {
              const cust = customers.find(c => c.id === b.customerId);
              return (
                <div key={b.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {cust?.name[0] ?? 'K'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{b.bookingCode}</div>
                      <div className="text-xs text-gray-400">{cust?.name ?? '—'} · {formatDate(b.createdAt)}</div>
                    </div>
                  </div>
                  <Badge className={bookingStatusColors[b.status]}>{bookingStatusLabels[b.status]}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent customers */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Khách hàng mới</h2>
            <Link to="/admin/customers" className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="space-y-2">
            {recentCustomers.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0ea5e9] to-[#1e3a5f] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.phone} · {c.district}</div>
                  </div>
                </div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
