import { Company, User, Coupon, Appointment, Service, Professional, Customer, Invoice, NotificationLog, WaitingListItem } from '../types';

interface GlobalDB {
  companies: Company[];
  users: User[];
  coupons: Coupon[];
}

interface CompanyDB {
  services: Service[];
  professionals: Professional[];
  customers: Customer[];
  appointments: Appointment[];
  invoices: Invoice[];
  notifications: NotificationLog[];
  waitingList: WaitingListItem[];
  googleCalendarSync: boolean;
}

const DEFAULT_GLOBAL_DATA: GlobalDB = {
  companies: [
    { id: 'dentist-corp', name: 'Smile Dental Clinique', plan: 'Professional', status: 'active', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'salon-beauty', name: 'Aura Beauty Salon', plan: 'Starter', status: 'active', createdAt: '2026-03-15T14:30:00Z' },
    { id: 'law-firm', name: 'Lex Partners Law', plan: 'Enterprise', status: 'active', createdAt: '2026-05-01T09:00:00Z' }
  ],
  users: [
    { id: 'usr-1', name: 'Dr. John Carter', email: 'manager@dentist.com', role: 'Manager', companyId: 'dentist-corp', verified: true },
    { id: 'usr-2', name: 'Elena Smith', email: 'employee@dentist.com', role: 'Employee', companyId: 'dentist-corp', verified: true },
    { id: 'usr-3', name: 'Administrator', email: 'admin@bookingcloud.com', role: 'Administrator', companyId: 'global', verified: true },
    { id: 'usr-4', name: 'Isabella Ross', email: 'manager@salon.com', role: 'Manager', companyId: 'salon-beauty', verified: true },
    { id: 'usr-5', name: 'Alice Green', email: 'customer@test.com', role: 'Customer', companyId: 'dentist-corp', verified: true }
  ],
  coupons: [
    { id: 'cpn-1', code: 'SMILE20', discountType: 'percent', discountValue: 20, companyId: 'dentist-corp', active: true },
    { id: 'cpn-2', code: 'AURA10', discountType: 'flat', discountValue: 10, companyId: 'salon-beauty', active: true },
    { id: 'cpn-3', code: 'SASSSTART', discountType: 'percent', discountValue: 15, companyId: 'global', active: true }
  ]
};

const SEED_COMPANY_DATA: Record<string, CompanyDB> = {
  'dentist-corp': {
    services: [
      { id: 'srv-1', name: 'Dental Cleaning', duration: 45, price: 120, category: 'General' },
      { id: 'srv-2', name: 'Teeth Whitening', duration: 60, price: 350, category: 'Aesthetic' },
      { id: 'srv-3', name: 'Root Canal Therapy', duration: 90, price: 450, category: 'Endodontics' },
      { id: 'srv-4', name: 'Orthodontic Checkup', duration: 30, price: 80, category: 'Orthodontics' }
    ],
    professionals: [
      {
        id: 'prof-1',
        name: 'Dr. John Carter',
        email: 'manager@dentist.com',
        phone: '+55 11 98888-7777',
        role: 'Manager',
        services: ['srv-1', 'srv-3'],
        availability: {
          'Monday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          'Tuesday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          'Wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          'Thursday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          'Friday': ['09:00', '10:00', '11:00', '14:00', '15:00']
        }
      },
      {
        id: 'prof-2',
        name: 'Dr. Elena Smith',
        email: 'employee@dentist.com',
        phone: '+55 11 97777-6666',
        role: 'Employee',
        services: ['srv-2', 'srv-4'],
        availability: {
          'Monday': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
          'Tuesday': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
          'Wednesday': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
          'Thursday': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
          'Friday': ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00']
        }
      }
    ],
    customers: [
      { id: 'cust-1', name: 'Alice Green', email: 'customer@test.com', phone: '+55 11 95555-4444', registeredAt: '2026-06-01T10:00:00Z' },
      { id: 'cust-2', name: 'Marcus Aurelius', email: 'marcus@philosophy.com', phone: '+55 11 94444-3333', registeredAt: '2026-06-15T11:20:00Z' },
      { id: 'cust-3', name: 'Sophia Loren', email: 'sophia@cinema.it', phone: '+55 11 93333-2222', registeredAt: '2026-07-02T15:45:00Z' }
    ],
    appointments: [
      {
        id: 'apt-1',
        customerId: 'cust-1',
        customerName: 'Alice Green',
        professionalId: 'prof-1',
        professionalName: 'Dr. John Carter',
        serviceId: 'srv-1',
        serviceName: 'Dental Cleaning',
        date: '2026-07-21',
        time: '10:00',
        duration: 45,
        price: 120,
        status: 'confirmed',
        isRecurring: false,
        waitingList: false,
        googleCalendarSynced: true
      },
      {
        id: 'apt-2',
        customerId: 'cust-2',
        customerName: 'Marcus Aurelius',
        professionalId: 'prof-2',
        professionalName: 'Dr. Elena Smith',
        serviceId: 'srv-2',
        serviceName: 'Teeth Whitening',
        date: '2026-07-21',
        time: '13:00',
        duration: 60,
        price: 350,
        status: 'pending',
        isRecurring: true,
        recurrenceRule: 'monthly',
        waitingList: false,
        googleCalendarSynced: false
      },
      {
        id: 'apt-3',
        customerId: 'cust-3',
        customerName: 'Sophia Loren',
        professionalId: 'prof-1',
        professionalName: 'Dr. John Carter',
        serviceId: 'srv-3',
        serviceName: 'Root Canal Therapy',
        date: '2026-07-22',
        time: '14:00',
        duration: 90,
        price: 450,
        status: 'confirmed',
        isRecurring: false,
        waitingList: false,
        googleCalendarSynced: true
      }
    ],
    invoices: [
      { id: 'inv-1', appointmentId: 'apt-1', customerId: 'cust-1', customerName: 'Alice Green', serviceName: 'Dental Cleaning', amount: 120, status: 'paid', paymentMethod: 'PIX', date: '2026-07-21T10:45:00Z', receiptUrl: '#' },
      { id: 'inv-2', appointmentId: 'apt-2', customerId: 'cust-2', customerName: 'Marcus Aurelius', serviceName: 'Teeth Whitening', amount: 350, status: 'unpaid', date: '2026-07-21T13:00:00Z' }
    ],
    notifications: [
      { id: 'not-1', appointmentId: 'apt-1', customerId: 'cust-1', customerName: 'Alice Green', type: 'WhatsApp', content: 'Olá Alice, sua consulta de Limpeza Dentária está confirmada para hoje às 10:00.', status: 'sent', sentAt: '2026-07-21T08:00:00Z' },
      { id: 'not-2', appointmentId: 'apt-1', customerId: 'cust-1', customerName: 'Alice Green', type: 'Email', content: 'Dear Alice, your dental appointment is scheduled for today at 10:00 AM.', status: 'sent', sentAt: '2026-07-21T08:02:00Z' }
    ],
    waitingList: [
      { id: 'wait-1', customerName: 'Julio Cesar', phone: '+55 11 92222-1111', serviceId: 'srv-1', serviceName: 'Dental Cleaning', preferredTimeRange: 'Morning', createdAt: '2026-07-20T17:00:00Z' }
    ],
    googleCalendarSync: true
  },
  'salon-beauty': {
    services: [
      { id: 'srv-101', name: 'Haircut & Styling', duration: 40, price: 60, category: 'Hair' },
      { id: 'srv-102', name: 'Premium Manicure', duration: 30, price: 35, category: 'Nails' },
      { id: 'srv-103', name: 'Relaxing Facial', duration: 60, price: 90, category: 'Skincare' }
    ],
    professionals: [
      {
        id: 'prof-101',
        name: 'Isabella Ross',
        email: 'manager@salon.com',
        phone: '+55 11 96666-5555',
        role: 'Manager',
        services: ['srv-101', 'srv-103'],
        availability: {
          'Monday': ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
          'Wednesday': ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
          'Friday': ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
        }
      }
    ],
    customers: [
      { id: 'cust-101', name: 'Giovanna Antonelli', email: 'giovanna@novela.com', phone: '+55 11 95555-1111', registeredAt: '2026-05-10T12:00:00Z' }
    ],
    appointments: [
      {
        id: 'apt-101',
        customerId: 'cust-101',
        customerName: 'Giovanna Antonelli',
        professionalId: 'prof-101',
        professionalName: 'Isabella Ross',
        serviceId: 'srv-101',
        serviceName: 'Haircut & Styling',
        date: '2026-07-21',
        time: '11:00',
        duration: 40,
        price: 60,
        status: 'confirmed',
        isRecurring: false,
        waitingList: false,
        googleCalendarSynced: false
      }
    ],
    invoices: [
      { id: 'inv-101', appointmentId: 'apt-101', customerId: 'cust-101', customerName: 'Giovanna Antonelli', serviceName: 'Haircut & Styling', amount: 60, status: 'paid', paymentMethod: 'Stripe', date: '2026-07-21T11:45:00Z', receiptUrl: '#' }
    ],
    notifications: [],
    waitingList: [],
    googleCalendarSync: false
  }
};

// Local storage keys
const KEY_GLOBAL = 'smartbooking_global_db';
const KEY_COMPANY_PREFIX = 'smartbooking_company_';

export const localDb = {
  getGlobal(): GlobalDB {
    const raw = localStorage.getItem(KEY_GLOBAL);
    if (!raw) {
      localStorage.setItem(KEY_GLOBAL, JSON.stringify(DEFAULT_GLOBAL_DATA));
      return DEFAULT_GLOBAL_DATA;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_GLOBAL_DATA;
    }
  },

  saveGlobal(data: GlobalDB) {
    localStorage.setItem(KEY_GLOBAL, JSON.stringify(data));
  },

  getCompany(companyId: string): CompanyDB {
    const key = `${KEY_COMPANY_PREFIX}${companyId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const seed = SEED_COMPANY_DATA[companyId] || {
        services: [
          { id: 'srv-def-1', name: 'Consultation', duration: 30, price: 50, category: 'General' }
        ],
        professionals: [],
        customers: [],
        appointments: [],
        invoices: [],
        notifications: [],
        waitingList: [],
        googleCalendarSync: false
      };
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_COMPANY_DATA[companyId] || {
        services: [],
        professionals: [],
        customers: [],
        appointments: [],
        invoices: [],
        notifications: [],
        waitingList: [],
        googleCalendarSync: false
      };
    }
  },

  saveCompany(companyId: string, data: CompanyDB) {
    localStorage.setItem(`${KEY_COMPANY_PREFIX}${companyId}`, JSON.stringify(data));
  },

  // --- REPLICATED MUTATORS MATCHING API ENDPOINTS ---

  registerCompany(companyName: string, managerName: string, email: string, plan: any): { company: Company; user: User } | { error: string } {
    const globalDb = this.getGlobal();
    if (globalDb.users.some(u => u.email === email)) {
      return { error: 'E-mail já está em uso. / Email already in use.' };
    }

    const companyId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCompany: Company = {
      id: companyId,
      name: companyName,
      plan: plan || 'Starter',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const newManager: User = {
      id: `usr-${Date.now()}`,
      name: managerName,
      email: email,
      role: 'Manager',
      companyId: companyId,
      verified: false
    };

    globalDb.companies.push(newCompany);
    globalDb.users.push(newManager);
    this.saveGlobal(globalDb);

    // Bootstrap independent local company DB
    const initialTenant: CompanyDB = {
      services: [
        { id: 'srv-def-1', name: 'Consultation', duration: 30, price: 50, category: 'General' }
      ],
      professionals: [
        {
          id: `prof-${Date.now()}`,
          name: managerName,
          email: email,
          phone: '+55 11 99999-9999',
          role: 'Manager',
          services: ['srv-def-1'],
          availability: {
            'Monday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            'Tuesday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            'Wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            'Thursday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            'Friday': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
          }
        }
      ],
      customers: [],
      appointments: [],
      invoices: [],
      notifications: [],
      waitingList: [],
      googleCalendarSync: false
    };
    this.saveCompany(companyId, initialTenant);

    return { company: newCompany, user: newManager };
  },

  verifyEmail(email: string): boolean {
    const globalDb = this.getGlobal();
    const user = globalDb.users.find(u => u.email === email);
    if (user) {
      user.verified = true;
      this.saveGlobal(globalDb);
      return true;
    }
    return false;
  },

  updateCompanyAdmin(companyId: string, updates: Partial<Company>): Company | null {
    const globalDb = this.getGlobal();
    const comp = globalDb.companies.find(c => c.id === companyId);
    if (comp) {
      if (updates.plan) comp.plan = updates.plan;
      if (updates.status) comp.status = updates.status;
      this.saveGlobal(globalDb);
      return comp;
    }
    return null;
  },

  createCoupon(code: string, discountType: 'percent' | 'flat', discountValue: number, companyId: string, role: string): Coupon {
    const globalDb = this.getGlobal();
    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: code.toUpperCase(),
      discountType: discountType || 'percent',
      discountValue: Number(discountValue),
      companyId: role === 'Administrator' ? 'global' : companyId,
      active: true
    };
    globalDb.coupons.push(newCoupon);
    this.saveGlobal(globalDb);
    return newCoupon;
  },

  createAppointment(companyId: string, body: any): { appointment?: Appointment; invoice?: Invoice; message?: string; waitItem?: WaitingListItem } {
    const companyDb = this.getCompany(companyId);
    const { customerName, customerPhone, customerEmail, professionalId, serviceId, date, time, isRecurring, recurrenceRule, waitingList } = body;

    // Resolve or create Customer
    let customer = companyDb.customers.find(c => c.email === customerEmail || c.phone === customerPhone);
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        name: customerName,
        email: customerEmail || `simulated_${Date.now()}@bookingcloud.com`,
        phone: customerPhone,
        registeredAt: new Date().toISOString()
      };
      companyDb.customers.push(customer);
    }

    // Resolve Professional and Service
    const prof = companyDb.professionals.find(p => p.id === professionalId);
    const srv = companyDb.services.find(s => s.id === serviceId);

    if (!prof || !srv) {
      return { message: 'Profissional ou Serviço inválido.' };
    }

    if (waitingList) {
      const waitItem: WaitingListItem = {
        id: `wait-${Date.now()}`,
        customerName: customer.name,
        phone: customer.phone,
        serviceId: srv.id,
        serviceName: srv.name,
        preferredTimeRange: time,
        createdAt: new Date().toISOString()
      };
      companyDb.waitingList.push(waitItem);
      this.saveCompany(companyId, companyDb);
      return { message: 'Adicionado à Fila de Espera!', waitItem };
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      professionalId: prof.id,
      professionalName: prof.name,
      serviceId: srv.id,
      serviceName: srv.name,
      date,
      time,
      duration: srv.duration,
      price: srv.price,
      status: 'confirmed',
      isRecurring: !!isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
      waitingList: false,
      googleCalendarSynced: companyDb.googleCalendarSync
    };
    companyDb.appointments.push(newApt);

    // Create Invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      appointmentId: newApt.id,
      customerId: customer.id,
      customerName: customer.name,
      serviceName: srv.name,
      amount: srv.price,
      status: 'unpaid',
      date: new Date().toISOString()
    };
    companyDb.invoices.push(newInvoice);

    // Generate simulated notifications
    const notifTypes: Array<'SMS' | 'WhatsApp' | 'Email'> = ['WhatsApp', 'Email', 'SMS'];
    notifTypes.forEach((type, index) => {
      companyDb.notifications.push({
        id: `not-${Date.now()}-${index}`,
        appointmentId: newApt.id,
        customerId: customer.id,
        customerName: customer.name,
        type,
        content: `Lembrete (${type}): Seu agendamento de ${srv.name} com ${prof.name} está marcado para o dia ${date} às ${time}.`,
        status: 'sent',
        sentAt: new Date().toISOString()
      });
    });

    this.saveCompany(companyId, companyDb);
    return { appointment: newApt, invoice: newInvoice };
  },

  updateAppointmentStatus(companyId: string, aptId: string, status: 'confirmed' | 'cancelled'): Appointment | null {
    const companyDb = this.getCompany(companyId);
    const apt = companyDb.appointments.find(a => a.id === aptId);
    if (apt) {
      apt.status = status;
      this.saveCompany(companyId, companyDb);
      return apt;
    }
    return null;
  },

  payInvoice(companyId: string, invoiceId: string, paymentMethod: string): Invoice | null {
    const companyDb = this.getCompany(companyId);
    const inv = companyDb.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = 'paid';
      inv.paymentMethod = paymentMethod as any || 'PIX';
      inv.receiptUrl = '#';
      this.saveCompany(companyId, companyDb);
      return inv;
    }
    return null;
  },

  registerCustomer(companyId: string, body: any): Customer {
    const companyDb = this.getCompany(companyId);
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      registeredAt: new Date().toISOString()
    };
    companyDb.customers.push(newCust);
    this.saveCompany(companyId, companyDb);
    return newCust;
  },

  registerProfessional(companyId: string, body: any): Professional {
    const companyDb = this.getCompany(companyId);
    const newProf: Professional = {
      id: `prof-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: 'Employee',
      services: body.services || [],
      availability: body.availability || {
        'Monday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Friday': ['09:00', '10:00', '11:00', '14:00', '15:00']
      }
    };
    companyDb.professionals.push(newProf);
    this.saveCompany(companyId, companyDb);
    return newProf;
  },

  createService(companyId: string, body: any): Service {
    const companyDb = this.getCompany(companyId);
    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      name: body.name,
      duration: Number(body.duration),
      price: Number(body.price),
      category: body.category || 'General'
    };
    companyDb.services.push(newSrv);
    this.saveCompany(companyId, companyDb);
    return newSrv;
  },

  setGoogleCalendarSync(companyId: string, sync: boolean): boolean {
    const companyDb = this.getCompany(companyId);
    companyDb.googleCalendarSync = !!sync;
    companyDb.appointments.forEach(a => {
      a.googleCalendarSynced = !!sync;
    });
    this.saveCompany(companyId, companyDb);
    return !!sync;
  },

  getReports(companyId: string): any {
    const companyDb = this.getCompany(companyId);

    const totalRevenue = companyDb.invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((acc: number, cur: any) => acc + cur.amount, 0);

    const monthlyRevenue: Record<string, number> = {};
    companyDb.invoices.forEach((inv: any) => {
      if (inv.status === 'paid') {
        const month = inv.date.substring(0, 7);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.amount;
      }
    });

    const customerSpend: Record<string, { name: string, total: number, visits: number }> = {};
    companyDb.appointments.forEach((apt: any) => {
      if (apt.status === 'confirmed') {
        if (!customerSpend[apt.customerId]) {
          customerSpend[apt.customerId] = { name: apt.customerName, total: 0, visits: 0 };
        }
        customerSpend[apt.customerId].total += apt.price;
        customerSpend[apt.customerId].visits += 1;
      }
    });

    const topCustomers = Object.values(customerSpend)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const serviceDemands: Record<string, { name: string, count: number }> = {};
    companyDb.appointments.forEach((apt: any) => {
      if (!serviceDemands[apt.serviceId]) {
        serviceDemands[apt.serviceId] = { name: apt.serviceName, count: 0 };
      }
      serviceDemands[apt.serviceId].count += 1;
    });

    const mostRequestedServices = Object.values(serviceDemands)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      monthlyIncome: Object.entries(monthlyRevenue).map(([month, val]) => ({ month, amount: val })),
      topCustomers,
      mostRequestedServices
    };
  },

  getCustomerPortal(companyId: string, userEmail: string): { appointments: Appointment[]; invoices: Invoice[] } {
    const companyDb = this.getCompany(companyId);
    const customer = companyDb.customers.find(c => c.email === userEmail);
    if (!customer) {
      return { appointments: [], invoices: [] };
    }
    const appointments = companyDb.appointments.filter(a => a.customerId === customer.id);
    const invoices = companyDb.invoices.filter(i => i.customerId === customer.id);
    return { appointments, invoices };
  }
};
