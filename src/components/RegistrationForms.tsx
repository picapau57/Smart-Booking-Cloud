import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, Service, Professional, Customer } from '../types';
import { Sparkles, DollarSign, Clock, Users, ShieldAlert, Plus, Layers, UserPlus } from 'lucide-react';

interface RegistrationFormsProps {
  language: Language;
  services: Service[];
  professionals: Professional[];
  customers: Customer[];
  onRegisterCustomer: (custData: any) => Promise<void>;
  onRegisterProfessional: (profData: any) => Promise<void>;
  onCreateService: (srvData: any) => Promise<void>;
}

export default function RegistrationForms({
  language,
  services,
  professionals,
  customers,
  onRegisterCustomer,
  onRegisterProfessional,
  onCreateService
}: RegistrationFormsProps) {
  const t = translations[language];

  const [activeFormTab, setActiveFormTab] = useState<'service' | 'professional' | 'customer'>('service');
  const [loading, setLoading] = useState(false);

  // Service form states
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState(45);
  const [servicePrice, setServicePrice] = useState(100);
  const [serviceCategory, setServiceCategory] = useState('Aesthetic');

  // Professional form states
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Customer form states
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;
    setLoading(true);
    try {
      await onCreateService({
        name: serviceName,
        duration: serviceDuration,
        price: servicePrice,
        category: serviceCategory
      });
      setServiceName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail || !profPhone) return;
    setLoading(true);
    try {
      await onRegisterProfessional({
        name: profName,
        email: profEmail,
        phone: profPhone,
        services: selectedServices
      });
      setProfName('');
      setProfEmail('');
      setProfPhone('');
      setSelectedServices([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;
    setLoading(true);
    try {
      await onRegisterCustomer({
        name: custName,
        email: custEmail,
        phone: custPhone
      });
      setCustName('');
      setCustEmail('');
      setCustPhone('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceSelect = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((sid) => sid !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Forms Switcher Column */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight mb-4">
          {language === 'pt' ? 'Gerenciamento de Recursos' : 'Resource Management'}
        </h3>
        
        <button
          onClick={() => setActiveFormTab('service')}
          className={`w-full p-3.5 rounded-xl flex items-center gap-3 text-left transition-all font-semibold text-xs border cursor-pointer ${
            activeFormTab === 'service'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          {t.navServices}
        </button>

        <button
          onClick={() => setActiveFormTab('professional')}
          className={`w-full p-3.5 rounded-xl flex items-center gap-3 text-left transition-all font-semibold text-xs border cursor-pointer ${
            activeFormTab === 'professional'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Users className="h-4 w-4" />
          {t.navProfessionals}
        </button>

        <button
          onClick={() => setActiveFormTab('customer')}
          className={`w-full p-3.5 rounded-xl flex items-center gap-3 text-left transition-all font-semibold text-xs border cursor-pointer ${
            activeFormTab === 'customer'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          {t.navCustomers}
        </button>
      </div>

      {/* Editor & Creation Forms */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
        
        {/* SERVICE FORM */}
        {activeFormTab === 'service' && (
          <div className="space-y-6">
            <div className="border-b border-gray-50 dark:border-gray-700/50 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{t.navServices}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Configure duration, prices, and categories.</p>
            </div>

            <form onSubmit={handleCreateService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Service Name *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Dental Cleansing"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">{t.duration} *</label>
                <input
                  type="number"
                  required
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">{t.price} *</label>
                <input
                  type="number"
                  required
                  value={servicePrice}
                  onChange={(e) => setServicePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Category</label>
                <input
                  type="text"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  placeholder="General Aesthetic"
                />
              </div>

              <div className="sm:col-span-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {loading ? t.btnLoading : `${t.btnRegister} ${t.navServices}`}
                </button>
              </div>
            </form>

            {/* List of active services */}
            <div className="space-y-2 pt-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{t.activeServices}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((s) => (
                  <div key={s.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 dark:text-white">{s.name}</h5>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{s.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        {language === 'pt' ? `R$ ${s.price}` : `$${s.price}`}
                      </span>
                      <p className="text-[9px] text-gray-400">{s.duration} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* PROFESSIONAL FORM */}
        {activeFormTab === 'professional' && (
          <div className="space-y-6">
            <div className="border-b border-gray-50 dark:border-gray-700/50 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{t.navProfessionals}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Add medical staffs, salon experts or mechanics.</p>
            </div>

            <form onSubmit={handleRegisterProfessional} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Name *</label>
                  <input
                    type="text"
                    required
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                    placeholder="Dr. John Carter"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Email *</label>
                  <input
                    type="email"
                    required
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                    placeholder="john@clinic.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Phone *</label>
                  <input
                    type="text"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                    placeholder="+55 11 99999-8888"
                  />
                </div>
              </div>

              {/* Multi-select services */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Supported Services</label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  {services.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleServiceSelect(s.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {loading ? t.btnLoading : `${t.btnRegister} ${t.navProfessionals}`}
              </button>
            </form>

            {/* List of active professionals */}
            <div className="space-y-2 pt-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Registered staff</h4>
              <div className="space-y-2">
                {professionals.map((p) => (
                  <div key={p.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 dark:text-white">{p.name}</h5>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{p.email} • {p.phone}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 rounded-full">
                      {p.services.length} services
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* CUSTOMER FORM */}
        {activeFormTab === 'customer' && (
          <div className="space-y-6">
            <div className="border-b border-gray-50 dark:border-gray-700/50 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{t.navCustomers}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Register customers directly or view user databases.</p>
            </div>

            <form onSubmit={handleRegisterCustomer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  placeholder="Isabella Ross"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Email</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  placeholder="isabella@ross.com"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">Phone *</label>
                <input
                  type="text"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  placeholder="+55 11 98888-5555"
                />
              </div>

              <div className="sm:col-span-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {loading ? t.btnLoading : `${t.btnRegister} ${t.navCustomers}`}
                </button>
              </div>
            </form>

            {/* List of active customers */}
            <div className="space-y-2 pt-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Customer Directory</h4>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {customers.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 dark:text-white">{c.name}</h5>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{c.email} • {c.phone}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold">
                      Registered: {c.registeredAt.substring(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
