import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, Appointment, Service, Professional, WaitingListItem } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, HelpCircle, Check, Sparkles, RefreshCw } from 'lucide-react';

interface CalendarViewProps {
  language: Language;
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  waitingList: WaitingListItem[];
  googleCalendarSync: boolean;
  onSyncGoogleCalendar: (sync: boolean) => void;
  onCreateAppointment: (aptData: any) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>;
}

export default function CalendarView({
  language,
  appointments,
  services,
  professionals,
  waitingList,
  googleCalendarSync,
  onSyncGoogleCalendar,
  onCreateAppointment,
  onUpdateAppointmentStatus
}: CalendarViewProps) {
  const t = translations[language];

  const [selectedDate, setSelectedDate] = useState('2026-07-21');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [time, setTime] = useState('10:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [addToWaitlist, setAddToWaitlist] = useState(false);

  // Dynamic slots to display for the selected date (simulated slots)
  const availableSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Appointments on selected day
  const dailyAppointments = appointments.filter((apt) => apt.date === selectedDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !professionalId || !serviceId) {
      alert('Preencha os campos obrigatórios / Fill required fields.');
      return;
    }

    setLoading(true);
    try {
      await onCreateAppointment({
        customerName,
        customerPhone,
        customerEmail,
        professionalId,
        serviceId,
        date: selectedDate,
        time,
        isRecurring,
        recurrenceRule,
        waitingList: addToWaitlist
      });
      // Reset
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setIsRecurring(false);
      setAddToWaitlist(false);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days (simulated simple week view)
  const weekDays = [
    { name: 'Monday', label: language === 'pt' ? 'Seg' : language === 'es' ? 'Lun' : 'Mon', date: '2026-07-20' },
    { name: 'Tuesday', label: language === 'pt' ? 'Ter' : language === 'es' ? 'Mar' : 'Tue', date: '2026-07-21' },
    { name: 'Wednesday', label: language === 'pt' ? 'Qua' : language === 'es' ? 'Mié' : 'Wed', date: '2026-07-22' },
    { name: 'Thursday', label: language === 'pt' ? 'Qui' : language === 'es' ? 'Jue' : 'Thu', date: '2026-07-23' },
    { name: 'Friday', label: language === 'pt' ? 'Sex' : language === 'es' ? 'Vie' : 'Fri', date: '2026-07-24' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Calendar Header with Google Calendar sync */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            {t.navCalendar}
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Smart tenant scheduler - Database isolated
          </p>
        </div>

        {/* Google Calendar Sync Controller */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSyncGoogleCalendar(!googleCalendarSync)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              googleCalendarSync
                ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            {googleCalendarSync ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4 animate-spin" />}
            {googleCalendarSync ? t.btnGoogleSynced : t.btnSyncGoogle}
          </button>

          <button
            onClick={() => {
              // Default to selecting first professional/service in fields if available
              if (professionals.length > 0) setProfessionalId(professionals[0].id);
              if (services.length > 0) setServiceId(services[0].id);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t.calNewAppointment}
          </button>
        </div>
      </div>

      {/* Week Day switcher rail */}
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {weekDays.map((day) => {
          const isSelected = selectedDate === day.date;
          const appointmentsCount = appointments.filter((a) => a.date === day.date).length;

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 dark:bg-indigo-600 dark:border-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {day.label}
              </span>
              <span className="text-lg font-black mt-1">
                {day.date.substring(8)}
              </span>
              {appointmentsCount > 0 && (
                <span className={`mt-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'}`}>
                  {appointmentsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Appointments Board */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight uppercase">
          {language === 'pt' ? `Agendamentos de ${selectedDate}` : `Appointments on ${selectedDate}`}
        </h3>

        <div className="space-y-4">
          {dailyAppointments.length > 0 ? (
            dailyAppointments.map((apt) => {
              const prof = professionals.find((p) => p.id === apt.professionalId);
              return (
                <div key={apt.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-transform duration-200 hover:scale-[1.005]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl text-center min-w-16">
                      <Clock className="h-4 w-4 text-indigo-500 mx-auto" />
                      <span className="text-xs font-black text-slate-800 dark:text-white mt-1 block">
                        {apt.time}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        {apt.customerName}
                      </h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        {apt.serviceName}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        Professional: {apt.professionalName} ({prof?.phone || 'No phone'})
                      </p>
                      {apt.isRecurring && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 rounded-full">
                          <Sparkles className="h-2 w-2" />
                          {t.calRecurring}: {apt.recurrenceRule}
                        </span>
                      )}
                      {apt.googleCalendarSynced && (
                        <span className="inline-flex items-center gap-1 mt-2 ml-2 px-2 py-0.5 bg-green-50 dark:bg-green-950 text-[9px] font-bold text-green-600 dark:text-green-400 rounded-full">
                          GCal Synced
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right hidden md:block mr-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {language === 'pt' ? `R$ ${apt.price}` : `$${apt.price}`}
                      </span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{apt.duration} min</p>
                    </div>

                    {apt.status === 'confirmed' ? (
                      <span className="px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-bold rounded-xl border border-green-100 dark:border-green-900/40">
                        {t.statusConfirmed}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/40">
                        {t.statusCancelled}
                      </span>
                    )}

                    {apt.status === 'confirmed' ? (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                        className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline cursor-pointer"
                      >
                        {language === 'pt' ? 'Cancelar' : 'Cancel'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                        className="text-xs text-green-500 hover:text-green-600 font-bold hover:underline cursor-pointer"
                      >
                        {language === 'pt' ? 'Confirmar' : 'Confirm'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-400 text-xs">
              No appointments scheduled for this date. Click &quot;{t.calNewAppointment}&quot; to plan one!
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200/60 dark:border-slate-800/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.calNewAppointment} - {selectedDate}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Customer Details */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.calCustomer} Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="Alice Smith"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="+55 11 99999-9999"
                  />
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="customer@email.com"
                />
              </div>

              {/* Service & Professional Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.calService} *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-900 dark:text-white">
                        {s.name} ({language === 'pt' ? `R$ ${s.price}` : `$${s.price}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t.calProfessional} *
                  </label>
                  <select
                    value={professionalId}
                    onChange={(e) => setProfessionalId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500"
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id} className="dark:bg-slate-900 dark:text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Time Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.calTime} *
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200/65 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot} className="dark:bg-slate-900 dark:text-white">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recurring Switch */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.calRecurring}
                  </span>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                {isRecurring && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">{t.calRecurrenceRule}</label>
                    <select
                      value={recurrenceRule}
                      onChange={(e) => setRecurrenceRule(e.target.value as any)}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl focus:outline-none"
                    >
                      <option value="weekly" className="dark:bg-slate-900 dark:text-white">{t.ruleWeekly}</option>
                      <option value="biweekly" className="dark:bg-slate-900 dark:text-white">{t.ruleBiweekly}</option>
                      <option value="monthly" className="dark:bg-slate-900 dark:text-white">{t.ruleMonthly}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Waiting List Switcher */}
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/30">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  {t.calWaitingListCheckbox}
                </span>
                <input
                  type="checkbox"
                  checked={addToWaitlist}
                  onChange={(e) => setAddToWaitlist(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {loading ? t.btnLoading : t.btnSave}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
