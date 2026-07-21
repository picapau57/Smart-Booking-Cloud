import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, Company, User, Coupon, SubscriptionPlan } from '../types';
import { Building2, ShieldCheck, Tag, HelpCircle, Users, Activity, Plus } from 'lucide-react';

interface AdminPanelProps {
  language: Language;
  companies: Company[];
  users: User[];
  coupons: Coupon[];
  onUpdateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  onCreateCoupon: (couponData: any) => Promise<void>;
}

export default function AdminPanel({
  language,
  companies,
  users,
  coupons,
  onUpdateCompany,
  onCreateCoupon
}: AdminPanelProps) {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'coupons'>('companies');
  const [loading, setLoading] = useState(false);

  // Coupon creator form state
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState(10);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setLoading(true);
    try {
      await onCreateCoupon({
        code: couponCode,
        discountType,
        discountValue
      });
      setCouponCode('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* SaaS Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-indigo-950">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase rounded-full tracking-wider border border-indigo-500/30">
            SaaS Root Management Console
          </span>
          <h2 className="text-xl font-bold mt-2">{t.adminTitle}</h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Configure companies databases, manage users subscription tiers, and create promotion campaigns across all cloud tenants.
          </p>
        </div>

        {/* Database isolation explanation banner */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
          <Activity className="h-5 w-5 text-indigo-400 shrink-0" />
          <p className="text-[10px] text-slate-300 leading-normal">
            <strong>{t.adminMultiDbNote}</strong> Database file partitions are created automatically for each tenant company when they register on the sign-up page.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'companies'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Building2 className="h-4 w-4 inline mr-2" />
          {t.adminCompanies}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          {t.adminUsers}
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Tag className="h-4 w-4 inline mr-2" />
          {t.adminCoupons}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        
        {/* COMPANIES LIST */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.adminActiveCompanies}</h3>
            
            <div className="space-y-3">
              {companies.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/60 transition-all">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {c.name}
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[9px] text-indigo-600 dark:text-indigo-400 font-bold rounded-full">
                        {c.plan} Plan
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Database slug: <code>company_{c.id}.json</code> • Registered: {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={c.plan}
                      onChange={(e) => onUpdateCompany(c.id, { plan: e.target.value as SubscriptionPlan })}
                      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="Starter" className="dark:bg-slate-900">{t.planStarter}</option>
                      <option value="Professional" className="dark:bg-slate-900">{t.planProfessional}</option>
                      <option value="Enterprise" className="dark:bg-slate-900">{t.planEnterprise}</option>
                    </select>

                    <select
                      value={c.status}
                      onChange={(e) => onUpdateCompany(c.id, { status: e.target.value as 'active' | 'suspended' })}
                      className={`border rounded-xl px-2.5 py-1 text-[10px] font-bold focus:outline-none cursor-pointer ${
                        c.status === 'active'
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40'
                          : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40'
                      }`}
                    >
                      <option value="active" className="dark:bg-slate-900 dark:text-white">Active</option>
                      <option value="suspended" className="dark:bg-slate-900 dark:text-white">Suspended</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">SaaS Cloud Users</h3>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {u.name}
                      {u.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-extrabold px-1.5 rounded">
                          <ShieldCheck className="h-2 w-2 text-green-500" />
                          Verified
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Email: {u.email} • Company slug: {u.companyId}</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-[10px] font-black text-indigo-700 dark:text-indigo-400 rounded-full">
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS MAKER */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.adminCreateCoupon}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Promotions applicable across all platform entities.</p>
            </div>

            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.adminCouponCode}</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="SUMMER30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none"
                >
                  <option value="percent" className="dark:bg-slate-900">Percentage (%)</option>
                  <option value="flat" className="dark:bg-slate-900">Flat Amount ($/R$)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t.adminDiscountValue}</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>

              <div className="sm:col-span-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  {loading ? t.btnLoading : t.adminCreateCoupon}
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Coupons Log</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coupons.map((cpn) => (
                  <div key={cpn.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl flex items-center justify-between border border-slate-100/60 dark:border-slate-800/80">
                    <div>
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{cpn.code}</span>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500">Tenant Target: {cpn.companyId}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                      -{cpn.discountValue}{cpn.discountType === 'percent' ? '%' : ' R$/$'}
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
