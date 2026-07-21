export type Language = 'pt' | 'en' | 'es';
export type Theme = 'light' | 'dark';
export type Role = 'Administrator' | 'Manager' | 'Employee' | 'Customer';
export type SubscriptionPlan = 'Starter' | 'Professional' | 'Enterprise';

export interface Company {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
  verified: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Employee';
  services: string[]; // service IDs
  availability: {
    [key: string]: string[]; // "Monday": ["09:00", "10:00", ...]
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  isRecurring: boolean;
  recurrenceRule?: string; // "weekly", "biweekly", "monthly"
  waitingList: boolean;
  googleCalendarSynced?: boolean;
}

export interface Invoice {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  status: 'unpaid' | 'paid';
  paymentMethod?: 'Stripe' | 'Mercado Pago' | 'PayPal' | 'PIX';
  date: string;
  receiptUrl?: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  type: 'SMS' | 'WhatsApp' | 'Email';
  content: string;
  status: 'sent' | 'failed';
  sentAt: string;
}

export interface WaitingListItem {
  id: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  preferredTimeRange: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  companyId: string;
  active: boolean;
}

export interface SaaSPlanDetails {
  id: SubscriptionPlan;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}
