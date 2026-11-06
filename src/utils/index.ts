import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BookingStatus, BoxStatus, LogisticsStatus, PaymentStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending:      'Chờ xác nhận',
  confirmed:    'Đã xác nhận',
  picking_up:   'Đang lấy hàng',
  in_warehouse: 'Đã nhập kho',
  storing:      'Đang lưu trữ',
  delivering:   'Đang giao trả',
  completed:    'Hoàn tất',
  cancelled:    'Đã huỷ',
};

export const bookingStatusColors: Record<BookingStatus, string> = {
  pending:      'bg-yellow-100 text-yellow-700',
  confirmed:    'bg-blue-100 text-blue-700',
  picking_up:   'bg-orange-100 text-orange-700',
  in_warehouse: 'bg-indigo-100 text-indigo-700',
  storing:      'bg-green-100 text-green-700',
  delivering:   'bg-purple-100 text-purple-700',
  completed:    'bg-gray-100 text-gray-600',
  cancelled:    'bg-red-100 text-red-600',
};

export const boxStatusLabels: Record<BoxStatus, string> = {
  pending:    'Chờ nhận',
  checked_in: 'Đã nhận',
  storing:    'Đang lưu',
  delivered:  'Đã giao',
  returned:   'Đã trả',
};

export const boxStatusColors: Record<BoxStatus, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  checked_in: 'bg-blue-100 text-blue-700',
  storing:    'bg-green-100 text-green-700',
  delivered:  'bg-purple-100 text-purple-700',
  returned:   'bg-gray-100 text-gray-600',
};

export const logisticsStatusLabels: Record<LogisticsStatus, string> = {
  pending:     'Chờ xác nhận',
  confirmed:   'Đã xác nhận',
  in_progress: 'Đang thực hiện',
  completed:   'Hoàn tất',
  cancelled:   'Đã huỷ',
};

export const logisticsStatusColors: Record<LogisticsStatus, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  confirmed:   'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  completed:   'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-600',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending:  'Chờ thanh toán',
  paid:     'Đã thanh toán',
  failed:   'Thất bại',
  refunded: 'Đã hoàn tiền',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  paid:     'bg-green-100 text-green-700',
  failed:   'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
};

export const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Chuyển khoản',
  cash:          'Tiền mặt',
  qr_payment:    'QR Payment',
};

export const logisticsTypeLabels: Record<string, string> = {
  self_drop:        'Tự mang đến kho',
  pickup_request:   'Lấy hàng tại nhà',
  self_collect:     'Tự đến lấy',
  delivery_request: 'Giao hàng tận nhà',
};

export function getBookingTimeline(status: BookingStatus) {
  const all: BookingStatus[] = ['pending','confirmed','picking_up','in_warehouse','storing','delivering','completed'];
  const idx = all.indexOf(status);
  return all.map((s, i) => ({ status: s, label: bookingStatusLabels[s], done: i <= idx }));
}

export function generateBookingCode(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `KB-2024-${n}`;
}

