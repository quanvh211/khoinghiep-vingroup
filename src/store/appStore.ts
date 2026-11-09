import { create } from 'zustand';
import type {
  User, Customer, Booking, StorageBox, PickupRequest,
  DeliveryRequest, Payment, Feedback, StoragePackage,
  WarehouseLocation, Notification, AdditionalService, BookingStatus, LogisticsStatus, PaymentStatus
} from '../types';
import {
  mockUsers, mockCustomers, mockBookings, mockStorageBoxes,
  mockPickupRequests, mockDeliveryRequests, mockPayments,
  mockFeedback, mockPackages, mockWarehouseLocations,
  mockNotifications, mockAdditionalServices
} from '../data/mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  currentCustomer: Customer | null;
  login: (email: string, password: string) => { success: boolean; role?: string; message?: string };
  logout: () => void;

  // Data
  users: User[];
  customers: Customer[];
  bookings: Booking[];
  storageBoxes: StorageBox[];
  pickupRequests: PickupRequest[];
  deliveryRequests: DeliveryRequest[];
  payments: Payment[];
  feedback: Feedback[];
  packages: StoragePackage[];
  warehouseLocations: WarehouseLocation[];
  notifications: Notification[];
  additionalServices: AdditionalService[];

  // Booking actions
  createBooking: (booking: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  
  // Customer actions
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  toggleCustomerStatus: (id: string) => void;
  registerCustomer: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; message: string };

  // Box actions
  updateBoxStatus: (id: string, status: StorageBox['status']) => void;
  addStorageBox: (box: Omit<StorageBox, 'id' | 'boxCode'>) => StorageBox;

  // Pickup/Delivery actions
  updatePickupStatus: (id: string, status: LogisticsStatus, assignedStaff?: string) => void;
  updateDeliveryStatus: (id: string, status: LogisticsStatus, assignedStaff?: string) => void;
  addPickupRequest: (req: Omit<PickupRequest, 'id' | 'createdAt'>) => void;
  addDeliveryRequest: (req: Omit<DeliveryRequest, 'id' | 'createdAt'>) => void;

  // Payment actions
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;

  // Feedback actions
  replyToFeedback: (id: string, reply: string) => void;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => void;

  // Package actions
  updatePackage: (id: string, data: Partial<StoragePackage>) => void;
  updateAdditionalService: (id: string, data: Partial<AdditionalService>) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;
}

let bookingCounter = 31;
let boxCounter = 51;
let pickupCounter = 11;
let deliveryCounter = 11;

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentCustomer: null,

  users: mockUsers,
  customers: mockCustomers,
  bookings: mockBookings,
  storageBoxes: mockStorageBoxes,
  pickupRequests: mockPickupRequests,
  deliveryRequests: mockDeliveryRequests,
  payments: mockPayments,
  feedback: mockFeedback,
  packages: mockPackages,
  warehouseLocations: mockWarehouseLocations,
  notifications: mockNotifications,
  additionalServices: mockAdditionalServices,

  login: (email, password) => {
    const user = get().users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
    const customer = user.role === 'customer'
      ? get().customers.find(c => c.userId === user.id) ?? null
      : null;
    set({ currentUser: user, currentCustomer: customer });
    return { success: true, role: user.role };
  },

  logout: () => set({ currentUser: null, currentCustomer: null }),

  registerCustomer: ({ name, email, phone, password }) => {
    const existing = get().users.find(u => u.email === email);
    if (existing) return { success: false, message: 'Email đã được đăng ký.' };
    const userId = `u-cus-${Date.now()}`;
    const customerId = `c-${Date.now()}`;
    const newUser: User = { id: userId, email, password, role: 'customer', createdAt: new Date().toISOString() };
    const newCustomer: Customer = {
      id: customerId, userId, name, phone, email,
      address: '', district: '', city: 'TP.HCM',
      status: 'active', createdAt: new Date().toISOString(), totalSpending: 0
    };
    set(s => ({ users: [...s.users, newUser], customers: [...s.customers, newCustomer] }));
    return { success: true, message: 'Đăng ký thành công!' };
  },

  createBooking: (data) => {
    const n = bookingCounter++;
    const booking: Booking = {
      ...data,
      id: `b-${n}`,
      bookingCode: `KB-2026-${String(n).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(s => ({ bookings: [...s.bookings, booking] }));
    // Add pickup request if needed
    if (data.dropoffType === 'pickup_request') {
      get().addPickupRequest({
        bookingId: booking.id,
        customerId: data.customerId,
        address: '',
        scheduledDate: data.startDate,
        scheduledTime: '09:00',
        status: 'pending',
        fee: 50000,
      });
    }
    // Notify admin
    get().addNotification({
      userId: 'u-admin-1',
      title: 'Đơn hàng mới chờ xác nhận',
      message: `Khách hàng vừa đặt đơn ${booking.bookingCode}. Vui lòng xem và xác nhận.`,
      read: false,
    });
    return booking;
  },

  updateBookingStatus: (id, status) => {
    set(s => ({
      bookings: s.bookings.map(b => b.id === id
        ? { ...b, status, updatedAt: new Date().toISOString() }
        : b
      )
    }));
    // Notify customer
    const booking = get().bookings.find(b => b.id === id);
    if (booking) {
      const customer = get().customers.find(c => c.id === booking.customerId);
      if (customer) {
        const statusMessages: Record<string, string> = {
          confirmed: 'Đơn hàng đã được xác nhận!',
          picking_up: 'Nhân viên đang trên đường đến lấy hàng.',
          in_warehouse: 'Hàng đã được nhận tại kho.',
          storing: 'Hàng đang được lưu trữ an toàn.',
          delivering: 'Hàng đang được giao trả.',
          completed: 'Đơn hàng đã hoàn tất.',
        };
        const msg = statusMessages[status];
        if (msg) {
          const user = get().users.find(u => u.id === customer.userId);
          if (user) {
            get().addNotification({
              userId: user.id,
              title: `Cập nhật đơn ${booking.bookingCode}`,
              message: msg,
              read: false,
            });
          }
        }
      }
    }
  },

  updateCustomer: (id, data) => {
    set(s => ({ customers: s.customers.map(c => c.id === id ? { ...c, ...data } : c) }));
  },

  toggleCustomerStatus: (id) => {
    set(s => ({
      customers: s.customers.map(c =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      )
    }));
  },

  updateBoxStatus: (id, status) => {
    set(s => ({ storageBoxes: s.storageBoxes.map(b => b.id === id ? { ...b, status } : b) }));
  },

  addStorageBox: (data) => {
    const n = boxCounter++;
    const box: StorageBox = {
      ...data,
      id: `box-${String(n).padStart(3, '0')}`,
      boxCode: `KB-BOX-${String(n).padStart(3, '0')}`,
    };
    set(s => ({ storageBoxes: [...s.storageBoxes, box] }));
    return box;
  },

  updatePickupStatus: (id, status, assignedStaff) => {
    set(s => ({
      pickupRequests: s.pickupRequests.map(r =>
        r.id === id ? { ...r, status, ...(assignedStaff ? { assignedStaff } : {}) } : r
      )
    }));
  },

  updateDeliveryStatus: (id, status, assignedStaff) => {
    set(s => ({
      deliveryRequests: s.deliveryRequests.map(r =>
        r.id === id ? { ...r, status, ...(assignedStaff ? { assignedStaff } : {}) } : r
      )
    }));
  },

  addPickupRequest: (data) => {
    const req: PickupRequest = {
      ...data,
      id: `pu-${pickupCounter++}`,
      createdAt: new Date().toISOString(),
    };
    set(s => ({ pickupRequests: [...s.pickupRequests, req] }));
  },

  addDeliveryRequest: (data) => {
    const req: DeliveryRequest = {
      ...data,
      id: `del-${deliveryCounter++}`,
      createdAt: new Date().toISOString(),
    };
    set(s => ({ deliveryRequests: [...s.deliveryRequests, req] }));
  },

  updatePaymentStatus: (id, status) => {
    set(s => ({
      payments: s.payments.map(p =>
        p.id === id ? { ...p, status, ...(status === 'paid' ? { paidAt: new Date().toISOString() } : {}) } : p
      )
    }));
  },

  replyToFeedback: (id, reply) => {
    set(s => ({
      feedback: s.feedback.map(f => f.id === id ? { ...f, adminReply: reply, status: 'resolved' as const } : f)
    }));
  },

  updateFeedbackStatus: (id, status) => {
    set(s => ({ feedback: s.feedback.map(f => f.id === id ? { ...f, status } : f) }));
  },

  updatePackage: (id, data) => {
    set(s => ({ packages: s.packages.map(p => p.id === id ? { ...p, ...data } : p) }));
  },

  updateAdditionalService: (id, data) => {
    set(s => ({ additionalServices: s.additionalServices.map(sv => sv.id === id ? { ...sv, ...data } : sv) }));
  },

  markNotificationRead: (id) => {
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  addNotification: (data) => {
    const notif: Notification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set(s => ({ notifications: [...s.notifications, notif] }));
  },
}));

