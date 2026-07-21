import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, Appointment, Invoice } from '../types';
import { CreditCard, FileText, Download, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

interface CustomerPortalProps {
  language: Language;
  appointments: Appointment[];
  invoices: Invoice[];
  onPayInvoice: (id: string, method: string) => Promise<void>;
}

export default function CustomerPortal({
  language,
  appointments,
  invoices,
  onPayInvoice
}: CustomerPortalProps) {
  const t = translations[language];

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Mercado Pago' | 'PayPal' | 'PIX'>('PIX');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setLoading(true);
    try {
      await onPayInvoice(selectedInvoice.id, paymentMethod);
      setSuccessMsg(t.portalPaymentSuccess);
      setSelectedInvoice(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Success alert */}
      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-bold text-xs rounded-2xl border border-green-200 dark:border-green-900/50 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          {successMsg}
        </div>
      )}

      {/* Grid of panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments history */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" />
            {t.portalHistory}
          </h3>

          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100/60 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{apt.serviceName}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Date: {apt.date} • {apt.time} ({apt.duration} mins)</p>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">Staff: {apt.professionalName}</span>
                  </div>
                  <div>
                    {apt.status === 'confirmed' ? (
                      <span className="px-2.5 py-0.5 bg-green-50 dark:bg-green-950/30 text-[10px] text-green-700 dark:text-green-400 font-bold rounded-full">
                        {t.statusConfirmed}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-red-50 dark:bg-red-950/30 text-[10px] text-red-700 dark:text-red-400 font-bold rounded-full">
                        {t.statusCancelled}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                You have no scheduled appointments.
              </div>
            )}
          </div>
        </div>

        {/* Invoices & payments status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-500" />
            {t.portalInvoices}
          </h3>

          <div className="space-y-3">
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <div key={inv.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100/60 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{inv.serviceName}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Invoice Ref: {inv.id}</p>
                    <span className="text-xs font-black text-slate-900 dark:text-white block mt-1">
                      {language === 'pt' ? `R$ ${inv.amount}` : `$${inv.amount}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {inv.status === 'paid' ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/30 text-[9px] text-green-700 dark:text-green-400 font-extrabold rounded-full">
                          {t.portalInvoicePaid} ({inv.paymentMethod})
                        </span>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSuccessMsg(language === 'pt' ? 'Download do recibo concluído!' : 'Receipt download complete!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }}
                          className="flex items-center gap-1 text-[9px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          <Download className="h-3 w-3" />
                          {t.btnDownloadReceipt}
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-[9px] text-amber-700 dark:text-amber-400 font-extrabold rounded-full">
                          {t.portalInvoiceUnpaid}
                        </span>
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow"
                        >
                          {t.btnPay}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No invoices issued for your account.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Payment checkout simulation panel */}
      {selectedInvoice && (
        <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-5 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 max-w-xl mx-auto space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-2">
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-300 uppercase flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              SaaS Checkout Simulator
            </h4>
            <button
              onClick={() => setSelectedInvoice(null)}
              className="text-indigo-400 hover:text-indigo-500 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-100/30">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Item Description</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedInvoice.serviceName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total price</span>
                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {language === 'pt' ? `R$ ${selectedInvoice.amount}` : `$${selectedInvoice.amount}`}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                {t.portalPayWith}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Stripe', 'Mercado Pago', 'PayPal', 'PIX'] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? t.btnLoading : `${t.btnPay} via ${paymentMethod}`}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
