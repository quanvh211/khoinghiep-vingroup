import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Card, Badge, Button, Modal, Textarea } from '../../components/ui';
import { formatDate } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import type { Feedback, FeedbackStatus } from '../../types';

const typeLabels = { complaint: '🔴 Khiếu nại', suggestion: '💡 Góp ý', praise: '⭐ Khen ngợi' };
const statusConfig: Record<FeedbackStatus, { label: string; color: string }> = {
  open:      { label: 'Chờ xử lý',   color: 'bg-yellow-100 text-yellow-700' },
  in_review: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700'   },
  resolved:  { label: 'Đã giải quyết',color: 'bg-green-100 text-green-700'  },
};

export default function AdminFeedback() {
  const { feedback, customers, replyToFeedback, updateFeedbackStatus } = useAppStore();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewFb, setViewFb] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = feedback.filter(f => {
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchType = typeFilter === 'all' || f.type === typeFilter;
    return matchStatus && matchType;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function handleReply() {
    if (!viewFb || !replyText.trim()) return;
    replyToFeedback(viewFb.id, replyText);
    toast.success('Đã phản hồi thành công!');
    setViewFb(null);
    setReplyText('');
  }

  function markReview(id: string) {
    updateFeedbackStatus(id, 'in_review');
    toast.info('Đã chuyển sang đang xem xét');
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phản hồi</h1>
        <p className="text-gray-500 text-sm">
          {feedback.filter(f => f.status === 'open').length} chờ xử lý ·{' '}
          {feedback.filter(f => f.type === 'complaint').length} khiếu nại
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Chờ xử lý', value: feedback.filter(f => f.status === 'open').length, icon: <Clock className="w-5 h-5 text-yellow-500"/>, bg: 'bg-yellow-50' },
          { label: 'Đang xem xét', value: feedback.filter(f => f.status === 'in_review').length, icon: <AlertCircle className="w-5 h-5 text-blue-500"/>, bg: 'bg-blue-50' },
          { label: 'Đã giải quyết', value: feedback.filter(f => f.status === 'resolved').length, icon: <CheckCircle className="w-5 h-5 text-green-500"/>, bg: 'bg-green-50' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {(['all','open','in_review','resolved'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${statusFilter === s ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {s === 'all' ? 'Tất cả' : statusConfig[s]?.label}
              </button>
            ))}
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
            <option value="all">Tất cả loại</option>
            <option value="complaint">Khiếu nại</option>
            <option value="suggestion">Góp ý</option>
            <option value="praise">Khen ngợi</option>
          </select>
        </div>
      </Card>

      {/* Feedback list */}
      <div className="space-y-3">
        {filtered.map(fb => {
          const cust = customers.find(c => c.id === fb.customerId);
          return (
            <Card key={fb.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {cust?.name[0] ?? 'K'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{cust?.name ?? '—'}</div>
                    <div className="text-xs text-gray-400">{formatDate(fb.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{typeLabels[fb.type]}</span>
                  <Badge className={statusConfig[fb.status].color}>{statusConfig[fb.status].label}</Badge>
                </div>
              </div>
              <div className="font-medium text-gray-900 mb-1">{fb.subject}</div>
              <div className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{fb.message}</div>
              {fb.adminReply && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-800 mb-3">
                  <strong>KEEPBOX phản hồi:</strong> {fb.adminReply}
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-gray-50">
                {fb.status === 'open' && (
                  <Button size="sm" variant="outline" onClick={() => markReview(fb.id)}>
                    <Clock className="w-3.5 h-3.5"/> Đang xem xét
                  </Button>
                )}
                {fb.status !== 'resolved' && (
                  <Button size="sm" variant="primary" onClick={() => { setViewFb(fb); setReplyText(''); }}>
                    <Send className="w-3.5 h-3.5"/> Phản hồi
                  </Button>
                )}
                {fb.status === 'resolved' && (
                  <span className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5"/> Đã giải quyết
                  </span>
                )}
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            Không có phản hồi nào.
          </div>
        )}
      </div>

      {/* Reply modal */}
      <Modal open={!!viewFb} onClose={() => setViewFb(null)} title="Phản hồi khách hàng" size="md">
        {viewFb && (
          <div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="font-medium text-gray-900 mb-1">{viewFb.subject}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{viewFb.message}</div>
            </div>
            {viewFb.adminReply && (
              <div className="bg-green-50 rounded-xl p-3 mb-4 text-sm text-green-800">
                <strong>Phản hồi trước:</strong> {viewFb.adminReply}
              </div>
            )}
            <Textarea
              label="Nội dung phản hồi"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Nhập nội dung phản hồi đến khách hàng..."
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setViewFb(null)} className="flex-1">Huỷ</Button>
              <Button variant="primary" onClick={handleReply} disabled={!replyText.trim()} className="flex-1">
                <Send className="w-4 h-4"/> Gửi phản hồi
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

