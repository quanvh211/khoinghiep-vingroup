// ============================================================
// KEEPBOX – Shared TypeScript Types
// ============================================================

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string; // plain-text demo only
  role: UserRole;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  totalSpending: number;
}

export interface StoragePackage {
  id: string;
  name: string;
  maxBoxes: number;
  pricePerMonth: number;
  description: string;
  features: string[];
  popular?: boolean;
  enabled: boolean;
  color: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'picking_up'
  | 'in_warehouse'
  | 'storing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export type LogisticsType = 'self_drop' | 'pickup_request' | 'self_collect' | 'delivery_request';

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  packageId: string;
  status: BookingStatus;
  numberOfBoxes: number;
  belongingsType: string;
  estimatedDuration: number; // months
  startDate: string;
  endDate: string;
  specialInstructions?: string;
  dropoffType: LogisticsType;
  pickupType: LogisticsType;
  totalAmount: number;
  additionalFees: number;
  createdAt: string;
  updatedAt: string;
}

export type BoxStatus = 'pending' | 'checked_in' | 'storing' | 'delivered' | 'returned';

export interface StorageBox {
  id: string;
  boxCode: string;
  bookingId: string;
  customerId: string;
  description: string;
  imageUrl?: string;
  warehouseLocationId: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: BoxStatus;
  qrCode?: string;
}

export interface WarehouseLocation {
  id: string;
  zone: string;
  shelf: string;
  slot: string;
  capacity: number;
  occupied: number;
  address: string;
}

export type LogisticsStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface PickupRequest {
  id: string;
  bookingId: string;
  customerId: string;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff?: string;
  status: LogisticsStatus;
  note?: string;
  fee: number;
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  bookingId: string;
  customerId: string;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff?: string;
  status: LogisticsStatus;
  note?: string;
  fee: number;
  createdAt: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'bank_transfer' | 'cash' | 'qr_payment';

export interface Payment {
  id: string;
  transactionId: string;
  bookingId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export type FeedbackStatus = 'open' | 'in_review' | 'resolved';

export interface Feedback {
  id: string;
  customerId: string;
  bookingId?: string;
  type: 'complaint' | 'suggestion' | 'praise';
  subject: string;
  message: string;
  status: FeedbackStatus;
  adminReply?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  enabled: boolean;
}

