import React, { useState, useEffect } from 'react';
import { Language, Role, Theme, Appointment, Service, Professional, Customer, Invoice, NotificationLog, WaitingListItem, Company, Coupon } from './types';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import RegistrationForms from './components/RegistrationForms';
import NotificationsLog from './components/NotificationsLog';
import CustomerPortal from './components/CustomerPortal';
import AdminPanel from './components/AdminPanel';
import ApiDocs from './components/ApiDocs';
import AiAssistant from './components/AiAssistant';

import {
  LayoutDashboard,
  Calendar,
  Layers,
  MessageSquare,
  Users,
  ShieldAlert,
  Terminal,
  Brain,
  Mail,
  Lock,
  Building2,
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function App() {
  // Global preferences
  const [language, setLanguage] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentRole, setRole] = useState<Role>('Manager');
  const [activeCompany, setActiveCompany] = useState<string>('dentist-corp');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Authenticated user simulation info
  const [userEmail, setUserEmail] = useState<string>('manager@dentist.com');
  const [isVerified, setIsVerified] = useState<boolean>(true);

  // Lists fetched from isolated company database
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);

  // SaaS Global states (Administrator view)
  const [companies, setCompanies] = useState<Company[]>([
    { id: 'dentist-corp', name: 'Smile Dental Clinique', plan: 'Professional', status: 'active', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'salon-beauty', name: 'Aura Beauty Salon', plan: 'Starter', status: 'active', createdAt: '2026-03-15T14:30:00Z' }
  ]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Auth registration form states
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authCompanyName, setAuthCompanyName] = useState('');
  const [authManagerName, setAuthManagerName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPlan, setAuthPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');
  const [verificationSent, setVerificationSent] = useState(false);

  const t = translations[language];

  // Sync role to user email
  useEffect(() => {
    if (currentRole === 'Manager') {
      setUserEmail('manager@dentist.com');
      setIsVerified(true);
    } else if (currentRole === 'Employee') {
      setUserEmail('employee@dentist.com');
      setIsVerified(true);
    } else if (currentRole === 'Administrator') {
      setUserEmail('admin@bookingcloud.com');
      setIsVerified(true);
    } else {
      setUserEmail('customer@test.com');
      setIsVerified(true);
    }
  }, [currentRole]);

  // Dark/Light mode effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load and fetch database records from backend matching active company
  const fetchTenantData = async () => {
    try {
      const headers = {
        'x-company-id': activeCompany,
        'x-user-role': currentRole,
        'x-user-email': userEmail
      };

      // 1. Fetch appointments
      const aptRes = await fetch('/api/appointments', { headers });
      const aptData = await aptRes.json();
      setAppointments(Array.isArray(aptData) ? aptData : []);

      // 2. Fetch services
      const srvRes = await fetch('/api/services', { headers });
      const srvData = await srvRes.json();
      setServices(Array.isArray(srvData) ? srvData : []);

      // 3. Fetch professionals
      const profRes = await fetch('/api/professionals', { headers });
      const profData = await profRes.json();
      setProfessionals(Array.isArray(profData) ? profData : []);

      // 4. Fetch customers
      const custRes = await fetch('/api/customers', { headers });
      const custData = await custRes.json();
      setCustomers(Array.isArray(custData) ? custData : []);

      // 5. Fetch waitlist
      const waitRes = await fetch('/api/waitinglist', { headers });
      const waitData = await waitRes.json();
      setWaitingList(Array.isArray(waitData) ? waitData : []);

      // 6. Fetch notifications sent
      const notRes = await fetch('/api/notifications', { headers });
      const notData = await notRes.json();
      setNotifications(Array.isArray(notData) ? notData : []);

      // 7. Load invoices
      if (currentRole === 'Customer') {
        const portalRes = await fetch('/api/customer/portal', { headers });
        const portalData = await portalRes.json();
        setAppointments(portalData.appointments || []);
        setInvoices(portalData.invoices || []);
      } else {
        // Fallback or full lists
        const reportsRes = await fetch('/api/reports', { headers });
        const reportsData = await reportsRes.json();
        // Set simulated invoices matching the active appointments
        setInvoices([
          { id: 'inv-1', appointmentId: 'apt-1', customerId: 'cust-1', customerName: 'Alice Green', serviceName: 'Dental Cleaning', amount: 120, status: 'paid', paymentMethod: 'PIX', date: '2026-07-21T10:45:00Z' },
          { id: 'inv-2', appointmentId: 'apt-2', customerId: 'cust-2', customerName: 'Marcus Aurelius', serviceName: 'Teeth Whitening', amount: 350, status: 'unpaid', date: '2026-07-21T13:00:00Z' }
        ]);
      }

      // 8. Load global elements
      const cpnRes = await fetch('/api/coupons', { headers });
      const cpnData = await cpnRes.json();
      setCoupons(Array.isArray(cpnData) ? cpnData : []);

      if (currentRole === 'Administrator') {
        const compRes = await fetch('/api/admin/companies', { headers });
        const compData = await compRes.json();
        setCompanies(Array.isArray(compData) ? compData : []);
      }

    } catch (err) {
      console.error("Communication error fetching databases details: ", err);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [activeCompany, currentRole, userEmail]);

  // Operations handlers (linked to backend REST API endpoints)

  const handleCreateAppointment = async (aptData: any) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany,
          'x-user-role': currentRole,
          'x-user-email': userEmail
        },
        body: JSON.stringify(aptData)
      });
      await res.json();
      fetchTenantData(); // Reload isolated lists
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify({ status })
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayInvoice = async (id: string, method: string) => {
    try {
      await fetch(`/api/invoices/${id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify({ paymentMethod: method })
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterCustomer = async (custData: any) => {
    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify(custData)
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterProfessional = async (profData: any) => {
    try {
      await fetch('/api/professionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify(profData)
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateService = async (srvData: any) => {
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify(srvData)
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncGoogleCalendar = async (sync: boolean) => {
    try {
      await fetch('/api/settings/google-calendar-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify({ sync })
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      await fetch(`/api/admin/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole
        },
        body: JSON.stringify(updates)
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (couponData: any) => {
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany,
          'x-user-role': currentRole
        },
        body: JSON.stringify(couponData)
      });
      fetchTenantData();
    } catch (err) {
      console.error(err);
    }
  };

  // SaaS Multi-company registration bootstrap handler
  const handleRegisterNewCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authCompanyName || !authEmail || !authPassword) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyName: authCompanyName,
          managerName: authManagerName || 'Business Manager',
          email: authEmail,
          password: authPassword,
          plan: authPlan
        })
      });
      const data = await res.json();
      if (data.company) {
        setUserEmail(authEmail);
        setActiveCompany(data.company.id);
        setRole('Manager');
        setIsVerified(false); // Enable Verification flow simulation!
        setVerificationSent(true);
        setShowAuthForm(false);
        // Reset inputs
        setAuthCompanyName('');
        setAuthManagerName('');
        setAuthEmail('');
        setAuthPassword('');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (data.verified) {
        setIsVerified(true);
        setVerificationSent(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* SaaS Global Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        currentRole={currentRole}
        setRole={setRole}
        activeCompany={activeCompany}
        setActiveCompany={setActiveCompany}
        companies={companies}
        userEmail={userEmail}
      />

      {/* Main SaaS Interface container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Unverified Email simulated barrier */}
        {!isVerified && verificationSent && (
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-600/10 to-amber-500/10 border border-amber-500/30 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 font-black">
              <Mail className="h-6 w-6 animate-bounce" />
              {t.authVerifyEmail} ({userEmail})
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.authVerifyCodeSent} Complete simulation setup by verifying your email in 1 click.
            </p>
            <button
              onClick={handleVerifyEmail}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {t.authVerifyEmail}
            </button>
          </div>
        )}

        {/* Dynamic registration switcher card */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Multi-Company Cloud</span>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
              SaaS Multi-tenant Sandboxing Environment
            </h3>
          </div>
          <button
            onClick={() => setShowAuthForm(!showAuthForm)}
            className="px-4 py-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-black rounded-xl transition-all cursor-pointer"
          >
            + {t.authRegister}
          </button>
        </div>

        {/* Business Creator Form */}
        {showAuthForm && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 max-w-xl mx-auto space-y-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-500" />
                {t.authRegister}
              </h4>
              <button onClick={() => setShowAuthForm(false)} className="text-slate-400 hover:text-slate-500 font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleRegisterNewCompany} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.authCompanyName} *</label>
                <input
                  type="text"
                  required
                  value={authCompanyName}
                  onChange={(e) => setAuthCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="Cosmic Mechanics"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Manager Name</label>
                <input
                  type="text"
                  value={authManagerName}
                  onChange={(e) => setAuthManagerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="Elena Ross"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.authEmail} *</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="manager@business.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.authPassword} *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.authPlanSelection}</label>
                <select
                  value={authPlan}
                  onChange={(e) => setAuthPlan(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-white rounded-xl"
                >
                  <option value="Starter">{t.planStarter} ($19/mo)</option>
                  <option value="Professional">{t.planProfessional} ($49/mo)</option>
                  <option value="Enterprise">{t.planEnterprise} ($129/mo)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t.btnRegisterCompany}
              </button>
            </form>
          </div>
        )}

        {/* View Layout Tabs switch board (Manager & Employee role only) */}
        {currentRole !== 'Administrator' && currentRole !== 'Customer' && (
          <div className="bg-white dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex flex-wrap gap-1.5 shadow-sm">
            {[
              { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
              { id: 'calendar', label: t.navCalendar, icon: Calendar },
              { id: 'registrations', label: language === 'pt' ? 'Recursos' : 'Resources', icon: Layers },
              { id: 'notifications', label: t.navNotifications, icon: MessageSquare },
              { id: 'ai_assistant', label: t.navApiDocs + " & IA", icon: Brain }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* CORE VIEWS MATCHING ROLES AND TABS */}

        {/* 1. ADMINISTRATOR ONLY VIEW */}
        {currentRole === 'Administrator' && (
          <div className="space-y-8">
            <AdminPanel
              language={language}
              companies={companies}
              users={usersList.length ? usersList : [
                { id: 'usr-1', name: 'Dr. John Carter', email: 'manager@dentist.com', role: 'Manager', companyId: 'dentist-corp', verified: true },
                { id: 'usr-2', name: 'Elena Smith', email: 'employee@dentist.com', role: 'Employee', companyId: 'dentist-corp', verified: true },
                { id: 'usr-3', name: 'SaaS Admin', email: 'admin@bookingcloud.com', role: 'Administrator', companyId: 'global', verified: true }
              ]}
              coupons={coupons}
              onUpdateCompany={handleUpdateCompany}
              onCreateCoupon={handleCreateCoupon}
            />
            <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
              <ApiDocs />
            </div>
          </div>
        )}

        {/* 2. CUSTOMER PORTAL PORT ONLY VIEW */}
        {currentRole === 'Customer' && (
          <CustomerPortal
            language={language}
            appointments={appointments}
            invoices={invoices}
            onPayInvoice={handlePayInvoice}
          />
        )}

        {/* 3. MANAGER / EMPLOYEE MAIN VIEWS */}
        {currentRole !== 'Administrator' && currentRole !== 'Customer' && (
          <div className="space-y-6">
            
            {activeTab === 'dashboard' && (
              <Dashboard
                language={language}
                appointments={appointments}
                invoices={invoices}
                customers={customers}
                professionals={professionals}
                waitingList={waitingList}
                onOpenAiAssistant={() => setActiveTab('ai_assistant')}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                language={language}
                appointments={appointments}
                services={services}
                professionals={professionals}
                waitingList={waitingList}
                googleCalendarSync={appointments.some(a => a.googleCalendarSynced)}
                onSyncGoogleCalendar={handleSyncGoogleCalendar}
                onCreateAppointment={handleCreateAppointment}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            )}

            {activeTab === 'registrations' && (
              <RegistrationForms
                language={language}
                services={services}
                professionals={professionals}
                customers={customers}
                onRegisterCustomer={handleRegisterCustomer}
                onRegisterProfessional={handleRegisterProfessional}
                onCreateService={handleCreateService}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsLog
                language={language}
                notifications={notifications}
              />
            )}

            {activeTab === 'ai_assistant' && (
              <div className="space-y-8">
                <AiAssistant
                  language={language}
                  activeCompany={activeCompany}
                />
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <ApiDocs />
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
