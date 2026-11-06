import React from 'react';
import { Bell, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../components/ui';
import { formatDateTime } from '../../utils';

export default function AccountNotifications() {
  const { notifications, currentUser, markNotificationRead } = useAppStore();
  const myNotifs = [...notifications.filter(n => n.userId === currentUser?.id)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-500 text-sm mt-1">{myNotifs.filter(n => !n.read).length} thông báo chưa đọc</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => myNotifs.forEach(n => markNotificationRead(n.id))}>
          <Check className="w-4 h-4"/> Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div className="space-y-3">
        {myNotifs.map(n => (
          <div key={n.id} onClick={() => markNotificationRead(n.id)}
            className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${
              !n.read ? 'bg-blue-50 border-blue-100 hover:bg-blue-100' : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-[#1e3a5f]' : 'bg-gray-100'}`}>
              <Bell className={`w-5 h-5 ${!n.read ? 'text-white' : 'text-gray-400'}`}/>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">{n.title}</div>
              <div className="text-sm text-gray-600 mt-0.5">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</div>
            </div>
            {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"/>}
          </div>
        ))}
        {myNotifs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p>Không có thông báo nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

