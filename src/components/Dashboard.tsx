import React from 'react';
import { translations } from '../translations';
import { Language, Appointment, Invoice, Customer, Professional, WaitingListItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Calendar, DollarSign, Users, ShieldAlert, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface DashboardProps {
  language: Language;
  appointments: Appointment[];
  invoices: Invoice[];
  customers: Customer[];
  professionals: Professional[];
  waitingList: WaitingListItem[];
  onOpenAiAssistant: () => void;
}

export default function Dashboard({
  language,
  appointments,
  invoices,
  customers,
  professionals,
  waitingList,
  onOpenAiAssistant
}: DashboardProps) {
  const t = translations[language];

  // Dynamic calculations
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const todayStr = '2026-07-21'; // Set static base date from current timestamp context to show real-time seeding correctly!
  const todayAppointments = appointments.filter((apt) => apt.date === todayStr);
  const pendingApts = appointments.filter((apt) => apt.status === 'pending');
  const confirmedApts = appointments.filter((apt) => apt.status === 'confirmed');

  // Chart 1: Monthly Income grouping
  const monthlyRevenueMap: Record<string, number> = {};
  invoices.forEach((inv) => {
    if (inv.status === 'paid') {
      const monthStr = inv.date.substring(0, 7); // "YYYY-MM"
      monthlyRevenueMap[monthStr] = (monthlyRevenueMap[monthStr] || 0) + inv.amount;
    }
  });

  const monthlyIncomeData = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({
    name: month,
    amount: amount
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Handle fallback if empty
  if (monthlyIncomeData.length === 0) {
    monthlyIncomeData.push({ name: '2026-07', amount: totalRevenue || 180 });
  }

  // Chart 2: Most Requested Services
  const serviceCountMap: Record<string, { name: string; count: number }> = {};
  appointments.forEach((apt) => {
    if (!serviceCountMap[apt.serviceId]) {
      serviceCountMap[apt.serviceId] = { name: apt.serviceName, count: 0 };
    }
    serviceCountMap[apt.serviceId].count += 1;
  });

  const mostRequestedServices = Object.values(serviceCountMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  // Top Customers Spent
  const customerSpendMap: Record<string, { name: string; email: string; spent: number; visits: number }> = {};
  appointments.forEach((apt) => {
    if (apt.status === 'confirmed') {
      const clientDetails = customers.find((c) => c.id === apt.customerId);
      if (!customerSpendMap[apt.customerId]) {
        customerSpendMap[apt.customerId] = {
          name: apt.customerName,
          email: clientDetails?.email || 'customer@test.com',
          spent: 0,
          visits: 0
        };
      }
      customerSpendMap[apt.customerId].spent += apt.price;
      customerSpendMap[apt.customerId].visits += 1;
    }
  });

  const topCustomers = Object.values(customerSpendMap)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & AI Assistant Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.dashTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.perfectFor}
          </p>
        </div>
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
          {t.btnAskAi}
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Today's Appointments */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.dashTodayAppointments}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{todayAppointments.length}</span>
              <span className="text-[10px] text-green-500 font-extrabold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">+{confirmedApts.length} confirmed</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.dashRevenue}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {language === 'pt' ? `R$ ${totalRevenue}` : `$${totalRevenue}`}
              </span>
              <span className="text-[10px] text-indigo-500 font-extrabold bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">100% cloud</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Customers count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.dashCustomersCount}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{customers.length}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">registered</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Professionals Count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 shadow-sm flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.dashProfessionalsCount}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{professionals.length}</span>
              <span className="text-[10px] text-orange-500 font-extrabold bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">+{waitingList.length} waitlist</span>
            </div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income Chart (Bar Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight uppercase flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-500" />
            {t.dashMonthlyIncome}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncomeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-100)" className="opacity-40" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28}>
                  {monthlyIncomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Requested Services (Pie Chart / Custom List) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            {t.dashMostRequestedServices}
          </h3>
          {mostRequestedServices.length > 0 ? (
            <div className="space-y-4">
              <div className="h-32 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mostRequestedServices}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={45}
                      fill="#8884d8"
                      label={false}
                    >
                      {mostRequestedServices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {mostRequestedServices.map((service, idx) => (
                  <div key={service.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{service.name}</span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 font-bold">{service.count} appointments</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No services requested yet.
            </div>
          )}
        </div>

      </div>

      {/* Top Customers & Today's Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Customers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight uppercase flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            {t.dashTopCustomers}
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{customer.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {language === 'pt' ? `R$ ${customer.spent}` : `$${customer.spent}`}
                    </span>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-wide uppercase">{customer.visits} {language === 'pt' ? 'visitas' : 'visits'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No customer spend data available.
              </div>
            )}
          </div>
        </div>

        {/* Today's appointments quick list */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              {t.dashRecentAppointments}
            </h3>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {todayStr}
            </span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((apt) => (
                <div key={apt.id} className="p-3 bg-slate-50/60 dark:bg-slate-950/40 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-200/30 dark:hover:border-slate-800 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{apt.customerName}</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">• {apt.time}</span>
                    </div>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{apt.serviceName} - {apt.professionalName}</p>
                  </div>
                  <div>
                    {apt.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full border border-green-100/50 dark:border-green-900/30">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {t.statusConfirmed}
                      </span>
                    ) : apt.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full border border-amber-100/50 dark:border-amber-900/30">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        {t.statusPending}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-bold rounded-full border border-red-100/50 dark:border-red-900/30">
                        <ShieldAlert className="h-3 w-3 text-red-500" />
                        {t.statusCancelled}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
