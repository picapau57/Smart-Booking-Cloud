import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function ApiDocs() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const endpoints = [
    {
      id: 'auth',
      method: 'POST',
      url: '/api/auth/login',
      desc: 'Authenticate user and receive dynamic base64 authorization session token.',
      body: JSON.stringify({ email: 'manager@dentist.com', password: 'password123' }, null, 2),
      response: JSON.stringify({
        token: "eyJpZCI6InVzci0xIiwiZW1haWwiOiJtYW5hZ2VyQGRlbnRpc3QuY29tIiwicm9sZSI6Ik1hbmFnZXIiLCJjb21wYW55SWQiOiJkZW50aXN0LWNvcnAifQ==",
        user: { id: "usr-1", name: "Dr. John Carter", email: "manager@dentist.com", role: "Manager", companyId: "dentist-corp", verified: true }
      }, null, 2)
    },
    {
      id: 'register',
      method: 'POST',
      url: '/api/auth/register',
      desc: 'Bootstrap a brand new SaaS tenant with an independent database file created automatically on the cloud.',
      body: JSON.stringify({ companyName: 'Aura Spa', managerName: 'Isabella Ross', email: 'manager@aura.com', password: 'password123', plan: 'Professional' }, null, 2),
      response: JSON.stringify({
        message: "Empresa cadastrada com sucesso!",
        company: { id: "aura-spa", name: "Aura Spa", plan: "Professional", status: "active", createdAt: "2026-07-21T10:00:00.000Z" },
        user: { id: "usr-123456", name: "Isabella Ross", email: "manager@aura.com", role: "Manager", companyId: "aura-spa", verified: false }
      }, null, 2)
    },
    {
      id: 'appointments_get',
      method: 'GET',
      url: '/api/appointments',
      desc: 'Retrieve appointments list from the isolated database matching the request header "x-company-id".',
      headers: { 'x-company-id': 'dentist-corp', 'x-user-role': 'Manager' },
      response: JSON.stringify([
        {
          id: "apt-1",
          customerId: "cust-1",
          customerName: "Alice Green",
          professionalId: "prof-1",
          professionalName: "Dr. John Carter",
          serviceId: "srv-1",
          serviceName: "Dental Cleaning",
          date: "2026-07-21",
          time: "10:00",
          duration: 45,
          price: 120,
          status: "confirmed",
          isRecurring: false,
          waitingList: false,
          googleCalendarSynced: true
        }
      ], null, 2)
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Intro */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-500" />
          Smart Booking Cloud REST API Docs
        </h2>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
          Production ready & Fully documented endpoints
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Connect your clinics, salons, or gym devices directly to the booking queue. Authenticate with JWT simulation and isolate requests by supplying company headers.
        </p>
      </div>

      {/* Docs Grid */}
      <div className="space-y-6">
        {endpoints.map((ep) => {
          const curlStr = `curl -X ${ep.method} \\
  -H "Content-Type: application/json" \\
  ${ep.headers ? Object.entries(ep.headers).map(([k, v]) => `-H "${k}: ${v}" \\ \n  `).join('') : ''}https://smartbookingcloud.com${ep.url} ${ep.body ? `\\\n  -d '${ep.body.replace(/\n/g, '')}'` : ''}`;

          return (
            <div key={ep.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${
                    ep.method === 'POST' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {ep.url}
                  </code>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {ep.desc}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                
                {/* Left side: request / curl */}
                <div className="p-5 space-y-3 bg-slate-950 text-slate-300 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">CURL REQUEST</span>
                    <button
                      onClick={() => copyToClipboard(curlStr, ep.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedId === ep.id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-3 bg-slate-900 rounded-xl max-h-48 whitespace-pre-wrap select-all">
                    {curlStr}
                  </pre>
                </div>

                {/* Right side: response */}
                <div className="p-5 space-y-3 bg-slate-900 text-slate-300 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">RESPONSE EXAMPLE</span>
                  <pre className="overflow-x-auto p-3 bg-slate-950 rounded-xl max-h-48 select-all">
                    {ep.response}
                  </pre>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
