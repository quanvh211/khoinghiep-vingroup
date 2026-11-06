import React, { useState } from 'react';
import { BarChart2, Download, TrendingUp, Users, Package, CheckCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppStore } from '../../store/appStore';
import { Card } from '../../components/ui';
import { formatVND } from '../../utils';
import { mockMonthlyRevenue } from '../../data/mockData';

const PIE_COLORS = ['#1e3a5f','#0ea5e9','#f97316','#10b981','#8b5cf6'];

export default function AdminReports() {
  const { customers, bookings, payments, packages } = useAppStore();
  const [dateRange, setDateRange] = useState({ from: '2024-02-01', to: '2024-09-30' });

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const completedOrders = bookings.filter(b => b.status === 'completed').length;
  const newCustomers = customers.length;
  const topPkg = packages.reduce((top, pkg) => {
    const count = bookings.filter(b => b.packageId === pkg.id).length;
    return count > (bookings.filter(b => b.packageId === top.id).length) ? pkg : top;
  }, packages[0]);

  const pkgData = packages.map(pkg => ({
    name: pkg.name,
    value: bookings.filter(b => b.packageId === pkg.id).length,
    revenue: bookings.filter(b => b.packageId === pkg.id).reduce((s, b) => s + b.totalAmount, 0),
  }));

  const statusData = [
    { name: 'Đang lưu', value: bookings.filter(b => b.status === 'storing').length, color: '#10b981' },
    { name: 'Hoàn tất', value: bookings.filter(b => b.status === 'completed').length, color: '#1e3a5f' },
    { name: 'Chờ XN', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
    { name: 'Đã huỷ', value: bookings.filter(b => b.status === 'cancelled').length, color: '#ef4444' },
  ];

  function exportCSV() {
    const rows = [
      ['Tháng', 'Doanh thu (VND)', 'Số đơn'],
      ...mockMonthlyRevenue.map(r => [r.month, r.revenue, r.orders]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'keepbox-revenue-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 text-sm">Dữ liệu demo — KEEPBOX Prototype</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <input type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none"/>
            <span className="text-gray-400 text-sm">–</span>
            <input type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none"/>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4"/> Xuất CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tổng doanh thu', value: formatVND(totalRevenue), icon: <TrendingUp className="w-5 h-5 text-green-500"/>, bg: 'bg-green-50', note: 'Tích lũy demo' },
          { label: 'Khách hàng mới', value: newCustomers, icon: <Users className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50', note: 'Tổng đăng ký' },
          { label: 'Đơn hoàn tất', value: completedOrders, icon: <CheckCircle className="w-5 h-5 text-purple-500"/>, bg: 'bg-purple-50', note: 'Tổng cộng' },
          { label: 'Gói phổ biến nhất', value: topPkg?.name ?? '—', icon: <Package className="w-5 h-5 text-orange-500"/>, bg: 'bg-orange-50', note: `${pkgData.find(p=>p.name===topPkg?.name)?.value ?? 0} đơn` },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-xl font-bold text-gray-900 leading-tight">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.note}</div>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="p-5 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockMonthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false}/>
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`}/>
            <Tooltip formatter={(v: unknown) => [formatVND(v as number), 'Doanh thu']}/>
            <Area type="monotone" dataKey="revenue" stroke="#1e3a5f" strokeWidth={2.5} fill="url(#revGrad2)" name="Doanh thu"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Package revenue */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Doanh thu theo gói</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pkgData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false}/>
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`}/>
              <Tooltip formatter={(v: unknown) => [formatVND(v as number), 'Doanh thu']}/>
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {pkgData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Order status */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Phân bổ trạng thái đơn hàng</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {statusData.map((d, i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}/>
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
