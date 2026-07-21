import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Multi-tenant Dynamic Database Directories
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const GLOBAL_DB_PATH = path.join(DATA_DIR, 'global.json');

// Global Seed Data (Companies, Users, Coupons)
const DEFAULT_GLOBAL_DATA = {
  companies: [
    { id: 'dentist-corp', name: 'Smile Dental Clinique', plan: 'Professional', status: 'active', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'salon-beauty', name: 'Aura Beauty Salon', plan: 'Starter', status: 'active', createdAt: '2026-03-15T14:30:00Z' },
    { id: 'law-firm', name: 'Lex Partners Law', plan: 'Enterprise', status: 'active', createdAt: '2026-05-01T09:00:00Z' }
  ],
  users: [
    { id: 'usr-1', name: 'Dr. John Carter', email: 'manager@dentist.com', password: 'password123', role: 'Manager', companyId: 'dentist-corp', verified: true },
    { id: 'usr-2', name: 'Elena Smith', email: 'employee@dentist.com', password: 'password123', role: 'Employee', companyId: 'dentist-corp', verified: true },
    { id: 'usr-3', name: 'Administrator', email: 'admin@bookingcloud.com', password: 'adminpassword', role: 'Administrator', companyId: 'global', verified: true },
    { id: 'usr-4', name: 'Isabella Ross', email: 'manager@salon.com', password: 'password123', role: 'Manager', companyId: 'salon-beauty', verified: true },
    { id: 'usr-5', name: 'Alice Green', email: 'customer@test.com', password: 'password123', role: 'Customer', companyId: 'dentist-corp', verified: true }
  ],
  coupons: [
    { id: 'cpn-1', code: 'SMILE20', discountType: 'percent', discountValue: 20, companyId: 'dentist-corp', active: true },
    { id: 'cpn-2', code: 'AURA10', discountType: 'flat', discountValue: 10, companyId: 'salon-beauty', active: true },
    { id: 'cpn-3', code: 'SASSSTART', discountType: 'percent', discountValue: 15, companyId: 'global', active: true }
  ]
};

// Helper to read and write Global DB
function readGlobalDb() {
  if (!fs.existsSync(GLOBAL_DB_PATH)) {
    fs.writeFileSync(GLOBAL_DB_PATH, JSON.stringify(DEFAULT_GLOBAL_DATA, null, 2));
    return DEFAULT_GLOBAL_DATA;
  }
  try {
    return JSON.parse(fs.readFileSync(GLOBAL_DB_PATH, 'utf-8'));
  } catch (err) {
    return DEFAULT_GLOBAL_DATA;
  }
}

function writeGlobalDb(data: any) {
  fs.writeFileSync(GLOBAL_DB_PATH, JSON.stringify(data, null, 2));
}

// Tenant DB Path Helper
function getCompanyDbPath(companyId: string) {
  return path.join(DATA_DIR, `company_${companyId}.json`);
}

// Seed Company-specific Isolated DB with elegant data
const SEED_COMPANY_DATA: Record<string, any> = {
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

// Isolated Company DB loader
function getCompanyDb(companyId: string) {
  const dbPath = getCompanyDbPath(companyId);
  if (!fs.existsSync(dbPath)) {
    // If we have preloaded seed data for this company, write it first
    const seedData = SEED_COMPANY_DATA[companyId] || {
      services: [],
      professionals: [],
      customers: [],
      appointments: [],
      invoices: [],
      notifications: [],
      waitingList: [],
      googleCalendarSync: false
    };
    fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
    return seedData;
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (err) {
    return {
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
}

function writeCompanyDb(companyId: string, data: any) {
  const dbPath = getCompanyDbPath(companyId);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// REST API Middleware to extract company and user details from mock authorization
// (Since we are using custom simulated auth on the frontend, headers supply companyId and userRole)
app.use((req, res, next) => {
  const compId = req.headers['x-company-id'] as string;
  const role = req.headers['x-user-role'] as string;
  const userEmail = req.headers['x-user-email'] as string;

  // Set them on req
  (req as any).companyId = compId || 'dentist-corp';
  (req as any).userRole = role || 'Manager';
  (req as any).userEmail = userEmail || 'manager@dentist.com';
  next();
});

// --- API ENDPOINTS ---

// 1. AUTH LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const globalDb = readGlobalDb();
  const user = globalDb.users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas. / Invalid credentials.' });
  }

  // Simulate token signing (returning base64 structured info)
  const simulatedToken = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId
  })).toString('base64');

  res.json({
    token: simulatedToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      verified: user.verified
    }
  });
});

// 2. AUTH REGISTER (Bootstrap new SaaS company database dynamically)
app.post('/api/auth/register', (req, res) => {
  const { companyName, managerName, email, password, plan } = req.body;
  const globalDb = readGlobalDb();

  // Validate email availability
  if (globalDb.users.some((u: any) => u.email === email)) {
    return res.status(400).json({ error: 'E-mail já está em uso. / Email already in use.' });
  }

  // Create unique company slug
  const companyId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newCompany = {
    id: companyId,
    name: companyName,
    plan: plan || 'Starter',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const newManager = {
    id: `usr-${Date.now()}`,
    name: managerName,
    email: email,
    password: password,
    role: 'Manager',
    companyId: companyId,
    verified: false // Email starts unverified to support Email Verification flow!
  };

  globalDb.companies.push(newCompany);
  globalDb.users.push(newManager);
  writeGlobalDb(globalDb);

  // Initialize independent Database file for this new company!
  const initialTenantDb = {
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

  writeCompanyDb(companyId, initialTenantDb);

  res.json({
    message: 'Empresa cadastrada com sucesso! / Company successfully registered!',
    company: newCompany,
    user: {
      id: newManager.id,
      name: newManager.name,
      email: newManager.email,
      role: newManager.role,
      companyId: companyId,
      verified: false
    }
  });
});

// 3. AUTH VERIFY EMAIL SIMULATION
app.post('/api/auth/verify-email', (req, res) => {
  const { email } = req.body;
  const globalDb = readGlobalDb();
  const user = globalDb.users.find((u: any) => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado. / User not found.' });
  }

  user.verified = true;
  writeGlobalDb(globalDb);
  res.json({ message: 'E-mail verificado com sucesso!', verified: true });
});

// 4. GET ACTIVE COMPANIES (SaaS level)
app.get('/api/admin/companies', (req, res) => {
  if ((req as any).userRole !== 'Administrator') {
    return res.status(403).json({ error: 'Não autorizado. / Unauthorized.' });
  }
  const globalDb = readGlobalDb();
  res.json(globalDb.companies);
});

// 5. UPDATE COMPANY STATUS / PLAN
app.put('/api/admin/companies/:id', (req, res) => {
  if ((req as any).userRole !== 'Administrator') {
    return res.status(403).json({ error: 'Não autorizado. / Unauthorized.' });
  }
  const { plan, status } = req.body;
  const globalDb = readGlobalDb();
  const comp = globalDb.companies.find((c: any) => c.id === req.params.id);

  if (!comp) {
    return res.status(404).json({ error: 'Empresa não encontrada.' });
  }

  if (plan) comp.plan = plan;
  if (status) comp.status = status;
  writeGlobalDb(globalDb);
  res.json(comp);
});

// 6. GET ACTIVE COUPONS (Global + Company specific)
app.get('/api/coupons', (req, res) => {
  const currentCompanyId = (req as any).companyId;
  const globalDb = readGlobalDb();
  const activeCoupons = globalDb.coupons.filter(
    (c: any) => c.companyId === 'global' || c.companyId === currentCompanyId
  );
  res.json(activeCoupons);
});

// 7. CREATE NEW COUPON
app.post('/api/coupons', (req, res) => {
  const { code, discountType, discountValue } = req.body;
  const currentCompanyId = (req as any).companyId;
  const globalDb = readGlobalDb();

  const newCoupon = {
    id: `cpn-${Date.now()}`,
    code: code.toUpperCase(),
    discountType: discountType || 'percent',
    discountValue: Number(discountValue),
    companyId: (req as any).userRole === 'Administrator' ? 'global' : currentCompanyId,
    active: true
  };

  globalDb.coupons.push(newCoupon);
  writeGlobalDb(globalDb);
  res.json(newCoupon);
});

// 8. GET APPOINTMENTS FOR ACTIVE COMPANY
app.get('/api/appointments', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  // Support custom filters or simple full return
  res.json(companyDb.appointments);
});

// 9. CREATE APPOINTMENT (With Automatic Confirmations & Sync Simulation)
app.post('/api/appointments', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { customerName, customerPhone, customerEmail, professionalId, serviceId, date, time, isRecurring, recurrenceRule, waitingList } = req.body;

  // Resolve Customer
  let customer = companyDb.customers.find((c: any) => c.email === customerEmail || c.phone === customerPhone);
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

  // Resolve Professional
  const prof = companyDb.professionals.find((p: any) => p.id === professionalId);
  // Resolve Service
  const srv = companyDb.services.find((s: any) => s.id === serviceId);

  if (!prof || !srv) {
    return res.status(400).json({ error: 'Profissional ou Serviço inválido.' });
  }

  // Create Appointment
  const newApt = {
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
    status: 'confirmed', // Automatic Confirmation active by default!
    isRecurring: !!isRecurring,
    recurrenceRule: isRecurring ? recurrenceRule : undefined,
    waitingList: !!waitingList,
    googleCalendarSynced: companyDb.googleCalendarSync
  };

  if (waitingList) {
    // Add to waitlist instead if user checks it, or append normally
    const waitItem = {
      id: `wait-${Date.now()}`,
      customerName: customer.name,
      phone: customer.phone,
      serviceId: srv.id,
      serviceName: srv.name,
      preferredTimeRange: time,
      createdAt: new Date().toISOString()
    };
    companyDb.waitingList.push(waitItem);
    writeCompanyDb(companyId, companyDb);
    return res.json({ message: 'Adicionado à Fila de Espera!', waitItem });
  }

  companyDb.appointments.push(newApt);

  // Generate Automatic Invoice
  const newInvoice = {
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

  // Simulate Automatic Confirmation & Reminders Log entries (SMS, WhatsApp, Email)
  const currentLocale = 'pt';
  const notifTypes = ['WhatsApp', 'Email', 'SMS'] as const;
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

  writeCompanyDb(companyId, companyDb);
  res.json({ appointment: newApt, invoice: newInvoice });
});

// 10. UPDATE APPOINTMENT STATUS
app.put('/api/appointments/:id', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { status } = req.body;

  const apt = companyDb.appointments.find((a: any) => a.id === req.params.id);
  if (!apt) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  apt.status = status;
  writeCompanyDb(companyId, companyDb);
  res.json(apt);
});

// 11. PAY INVOICE (Simulate Stripe, Mercado Pago, PayPal, PIX)
app.post('/api/invoices/:id/pay', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { paymentMethod } = req.body;

  const inv = companyDb.invoices.find((i: any) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: 'Fatura não encontrada.' });
  }

  inv.status = 'paid';
  inv.paymentMethod = paymentMethod || 'PIX';
  inv.receiptUrl = '#'; // Mock downloadable invoice file link
  writeCompanyDb(companyId, companyDb);
  res.json(inv);
});

// 12. GET CUSTOMERS
app.get('/api/customers', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  res.json(companyDb.customers);
});

// 13. REGISTER CUSTOMER
app.post('/api/customers', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { name, email, phone } = req.body;

  const newCust = {
    id: `cust-${Date.now()}`,
    name,
    email,
    phone,
    registeredAt: new Date().toISOString()
  };

  companyDb.customers.push(newCust);
  writeCompanyDb(companyId, companyDb);
  res.json(newCust);
});

// 14. GET PROFESSIONALS
app.get('/api/professionals', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  res.json(companyDb.professionals);
});

// 15. REGISTER PROFESSIONAL
app.post('/api/professionals', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { name, email, phone, services, availability } = req.body;

  const newProf = {
    id: `prof-${Date.now()}`,
    name,
    email,
    phone,
    role: 'Employee' as const,
    services: services || [],
    availability: availability || {
      'Monday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
      'Wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
      'Friday': ['09:00', '10:00', '11:00', '14:00', '15:00']
    }
  };

  companyDb.professionals.push(newProf);
  writeCompanyDb(companyId, companyDb);
  res.json(newProf);
});

// 16. GET SERVICES
app.get('/api/services', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  res.json(companyDb.services);
});

// 17. CREATE SERVICE
app.post('/api/services', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { name, duration, price, category } = req.body;

  const newSrv = {
    id: `srv-${Date.now()}`,
    name,
    duration: Number(duration),
    price: Number(price),
    category: category || 'General'
  };

  companyDb.services.push(newSrv);
  writeCompanyDb(companyId, companyDb);
  res.json(newSrv);
});

// 18. GOOGLE CALENDAR SYNC TOGGLE
app.post('/api/settings/google-calendar-sync', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const { sync } = req.body;

  companyDb.googleCalendarSync = !!sync;
  // Also sync current appointments status
  companyDb.appointments.forEach((a: any) => {
    a.googleCalendarSynced = !!sync;
  });

  writeCompanyDb(companyId, companyDb);
  res.json({ googleCalendarSync: companyDb.googleCalendarSync });
});

// 19. GET NOTIFICATIONS LOGS
app.get('/api/notifications', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  res.json(companyDb.notifications);
});

// 20. GET WAITING LIST
app.get('/api/waitinglist', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  res.json(companyDb.waitingList || []);
});

// 21. CUSTOMER PORTAL DETAILS (History & invoices)
app.get('/api/customer/portal', (req, res) => {
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);
  const userEmail = (req as any).userEmail;

  // Resolve customer matching user email
  const customer = companyDb.customers.find((c: any) => c.email === userEmail);
  if (!customer) {
    return res.json({ appointments: [], invoices: [] });
  }

  const appointments = companyDb.appointments.filter((a: any) => a.customerId === customer.id);
  const invoices = companyDb.invoices.filter((i: any) => i.customerId === customer.id);

  res.json({ appointments, invoices });
});

// 22. DYNAMIC REPORTS API (Calculate SaaS graphs on demand!)
app.get('/api/reports', (req, res) => {
  const companyDb = getCompanyDb((req as any).companyId);
  
  // Dynamic calculation of Month Revenue, Top Customers, Service demands
  const totalRevenue = companyDb.invoices
    .filter((inv: any) => inv.status === 'paid')
    .reduce((acc: number, cur: any) => acc + cur.amount, 0);

  // Group by month
  const monthlyRevenue: Record<string, number> = {};
  companyDb.invoices.forEach((inv: any) => {
    if (inv.status === 'paid') {
      const month = inv.date.substring(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.amount;
    }
  });

  // Top Customers
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

  // Most Requested Services
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

  res.json({
    totalRevenue,
    monthlyIncome: Object.entries(monthlyRevenue).map(([month, val]) => ({ month, amount: val })),
    topCustomers,
    mostRequestedServices
  });
});

// 23. GEMINI AI INSIGHTS FOR THE SAAS (Calculates growth tips, pricing feedback using process.env.GEMINI_API_KEY)
app.post('/api/gemini/insights', async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      insights: "O recurso de Inteligência Artificial requer uma chave GEMINI_API_KEY configurada nas configurações. / AI features require a GEMINI_API_KEY configured under secrets."
    });
  }

  const { language } = req.body;
  const companyId = (req as any).companyId;
  const companyDb = getCompanyDb(companyId);

  // Format data payload briefly for Gemini to analyze
  const companyContext = {
    companyName: SEED_COMPANY_DATA[companyId]?.name || companyId,
    servicesCount: companyDb.services.length,
    professionalsCount: companyDb.professionals.length,
    customersCount: companyDb.customers.length,
    appointmentsCount: companyDb.appointments.length,
    revenueTotal: companyDb.invoices
      .filter((i: any) => i.status === 'paid')
      .reduce((acc: number, cur: any) => acc + cur.amount, 0),
    topServices: companyDb.services.map((s: any) => ({ name: s.name, price: s.price }))
  };

  const systemPrompt = `You are an expert SaaS business consultant specializing in appointment-based businesses (clinics, salons, lawyers, mechanics, gyms). Analyze the provided metrics and write a premium, actionable, and elegant business report in ${language === 'pt' ? 'Portuguese' : language === 'es' ? 'Spanish' : 'English'}. Avoid formatting with markdown titles. Output 3 bullet points with direct ideas for price optimization, high value packages, and retention strategies. Keep it clean and direct.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Company metrics to analyze: ${JSON.stringify(companyContext)}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    res.json({ insights: response.text });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro de comunicação com Gemini AI.', details: err.message });
  }
});

// --- PLATFORM WEB ROUTING ---

// Serve Vite dev / build environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Booking Cloud Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
