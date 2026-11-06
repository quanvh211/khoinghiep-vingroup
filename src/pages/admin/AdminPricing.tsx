import React, { useState } from 'react';
import { Edit, Save, X, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Button, Input, Badge } from '../../components/ui';
import { formatVND } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { StoragePackage, AdditionalService } from '../../types';

export default function AdminPricing() {
  const { packages, additionalServices, updatePackage, updateAdditionalService } = useAppStore();
  const toast = useToast();
  const [editingPkg, setEditingPkg] = useState<string | null>(null);
  const [editingPkgData, setEditingPkgData] = useState<Partial<StoragePackage>>({});
  const [editingSvc, setEditingSvc] = useState<string | null>(null);
  const [editingSvcData, setEditingSvcData] = useState<Partial<AdditionalService>>({});

  function startEditPkg(pkg: StoragePackage) {
    setEditingPkg(pkg.id);
    setEditingPkgData({ name: pkg.name, pricePerMonth: pkg.pricePerMonth, maxBoxes: pkg.maxBoxes, description: pkg.description });
  }

  function savePkg() {
    if (!editingPkg) return;
    updatePackage(editingPkg, editingPkgData);
    toast.success('Đã cập nhật gói lưu trữ!');
    setEditingPkg(null);
  }

  function startEditSvc(svc: AdditionalService) {
    setEditingSvc(svc.id);
    setEditingSvcData({ minPrice: svc.minPrice, maxPrice: svc.maxPrice });
  }

  function saveSvc() {
    if (!editingSvc) return;
    updateAdditionalService(editingSvc, editingSvcData);
    toast.success('Đã cập nhật dịch vụ bổ sung!');
    setEditingSvc(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bảng giá</h1>
        <p className="text-gray-500 text-sm">Chỉnh sửa giá và cấu hình gói lưu trữ. Dữ liệu demo.</p>
      </div>

      {/* Packages */}
      <h2 className="font-semibold text-gray-800 mb-4 text-lg">Gói lưu trữ</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {packages.map(pkg => (
          <Card key={pkg.id} className={`p-5 relative ${!pkg.enabled ? 'opacity-60' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-2 left-4 bg-[#f97316] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                Phổ biến
              </div>
            )}
            {editingPkg === pkg.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Tên gói</label>
                  <input value={editingPkgData.name ?? ''} onChange={e => setEditingPkgData(d => ({ ...d, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Giá/tháng (VND)</label>
                  <input type="number" value={editingPkgData.pricePerMonth ?? 0} onChange={e => setEditingPkgData(d => ({ ...d, pricePerMonth: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Số thùng tối đa</label>
                  <input type="number" value={editingPkgData.maxBoxes ?? 0} onChange={e => setEditingPkgData(d => ({ ...d, maxBoxes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"/>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setEditingPkg(null)} className="flex-1"><X className="w-3 h-3"/></Button>
                  <Button size="sm" variant="primary" onClick={savePkg} className="flex-1"><Save className="w-3 h-3"/> Lưu</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">{pkg.name}</div>
                  <button onClick={() => updatePackage(pkg.id, { enabled: !pkg.enabled })} className="text-gray-400 hover:text-gray-600 transition-colors" title={pkg.enabled ? 'Tắt gói' : 'Bật gói'}>
                    {pkg.enabled ? <ToggleRight className="w-5 h-5 text-green-500"/> : <ToggleLeft className="w-5 h-5"/>}
                  </button>
                </div>
                <div className="text-2xl font-bold text-[#1e3a5f] mb-0.5">{formatVND(pkg.pricePerMonth)}</div>
                <div className="text-xs text-gray-400 mb-3">/tháng · tối đa {pkg.maxBoxes} thùng</div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{pkg.description}</p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pkg.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pkg.enabled ? 'Đang hiện thị' : 'Đã ẩn'}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => startEditPkg(pkg)}>
                    <Edit className="w-3.5 h-3.5"/>
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Additional services */}
      <h2 className="font-semibold text-gray-800 mb-4 text-lg">Dịch vụ bổ sung</h2>
      <div className="space-y-3">
        {additionalServices.map(svc => (
          <Card key={svc.id} className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{svc.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">Đơn vị: {svc.unit}</div>
              </div>
              {editingSvc === svc.id ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Giá tối thiểu</label>
                    <input type="number" value={editingSvcData.minPrice ?? 0} onChange={e => setEditingSvcData(d => ({ ...d, minPrice: Number(e.target.value) }))}
                      className="w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Giá tối đa</label>
                    <input type="number" value={editingSvcData.maxPrice ?? 0} onChange={e => setEditingSvcData(d => ({ ...d, maxPrice: Number(e.target.value) }))}
                      className="w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"/>
                  </div>
                  <div className="flex gap-1 mt-4">
                    <Button size="sm" variant="outline" onClick={() => setEditingSvc(null)}><X className="w-3 h-3"/></Button>
                    <Button size="sm" variant="primary" onClick={saveSvc}><Save className="w-3 h-3"/></Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-[#f97316]">
                    {formatVND(svc.minPrice)} – {formatVND(svc.maxPrice)}
                    <span className="font-normal text-gray-400 text-xs">{svc.unit}</span>
                  </div>
                  <button onClick={() => updateAdditionalService(svc.id, { enabled: !svc.enabled })} className="text-gray-400 hover:text-gray-600" title={svc.enabled ? 'Tắt' : 'Bật'}>
                    {svc.enabled ? <ToggleRight className="w-5 h-5 text-green-500"/> : <ToggleLeft className="w-5 h-5"/>}
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => startEditSvc(svc)}><Edit className="w-3.5 h-3.5"/></Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

