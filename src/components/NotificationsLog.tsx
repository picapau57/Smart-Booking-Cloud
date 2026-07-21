import React from 'react';
import { translations } from '../translations';
import { Language, NotificationLog } from '../types';
import { MessageSquare, Mail, Phone, CheckCircle2 } from 'lucide-react';

interface NotificationsLogProps {
  language: Language;
  notifications: NotificationLog[];
}

export default function NotificationsLog({ language, notifications }: NotificationsLogProps) {
  const t = translations[language];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner / Rules configuration */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-500 animate-pulse" />
            {t.notifLogTitle}
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mt-1">
            Automated confirmation engines configured - Live status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 bg-green-50/50 dark:bg-green-950/20 border border-green-100/50 dark:border-green-900/30 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-xl">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-green-900 dark:text-green-200">{t.notifWhatsapp}</h4>
              <p className="text-[10px] text-green-600/80 dark:text-green-400/80 font-medium">Automatic dispatch active</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-xl">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">{t.notifEmail}</h4>
              <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-medium">Automatic confirmations active</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">{t.notifSms}</h4>
              <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium">SMS queue live</p>
            </div>
          </div>

        </div>
      </div>

      {/* Sent Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.notifLogTitle}</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {notifications.length > 0 ? (
            notifications.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/30 dark:hover:bg-slate-950/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    log.type === 'WhatsApp' ? 'bg-green-50 dark:bg-green-950/30 text-green-600' :
                    log.type === 'Email' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' :
                    'bg-blue-50 dark:bg-blue-950/30 text-blue-600'
                  }`}>
                    {log.type === 'WhatsApp' && <MessageSquare className="h-4 w-4" />}
                    {log.type === 'Email' && <Mail className="h-4 w-4" />}
                    {log.type === 'SMS' && <Phone className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{log.customerName}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[8px] font-bold text-slate-500 rounded">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {log.content}
                    </p>
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      Sent at: {new Date(log.sentAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Sent
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-slate-400">
              No notifications dispatched yet in this company database.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
