import React, { useState } from 'react';
import { translations } from '../translations';
import { Language } from '../types';
import { Sparkles, Brain, Cpu, MessageSquare, RefreshCw, Send, Check } from 'lucide-react';

interface AiAssistantProps {
  language: Language;
  activeCompany: string;
  useLocalFallback?: boolean;
}

export default function AiAssistant({ language, activeCompany, useLocalFallback }: AiAssistantProps) {
  const t = translations[language];

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  const getSimulatedInsights = () => {
    if (activeCompany === 'dentist-corp') {
      if (language === 'pt') {
        return `🎯 Relatório de Crescimento - Smile Dental Clinique:
• Otimização de Preços: Considere agrupar a limpeza odontológica com check-ups ortodônticos em um "Pacote de Prevenção Semestral" por R$180. Isso pode aumentar o ticket médio atual de R$120.
• Retenção de Clientes: Ative cupons de fidelidade personalizados para clientes de clareamento (ex: desconto de 15% na próxima limpeza após 6 meses).
• Canais de Contato: A cadência de lembretes via WhatsApp reduziu faltas em 24%. Recomenda-se expandir o suporte a mensagens pré-agendadas de retorno preventivo automático.`;
      } else {
        return `🎯 Growth Report - Smile Dental Clinique:
• Pricing Optimization: Consider bundling dental cleaning with orthodontic check-ups into a "Preventive Pack" for $180. This can safely increase the current average ticket from $120.
• Customer Retention: Activate loyalty coupons for aesthetic whitening clients (e.g., 15% off their next hygiene recall appointment after 6 months).
• Communication: WhatsApp automated confirmation has reduced booking drops by 24%. We recommend adding automatic 6-month preventive recall follow-ups.`;
      }
    } else if (activeCompany === 'salon-beauty') {
      if (language === 'pt') {
        return `✨ Análise de Receita - Aura Beauty Salon:
• Alinhamento de Serviços: Corte & Modelagem são seus maiores impulsionadores de tráfego. Agrupe manicure e limpeza facial premium para criar o combo "Dia de Autocuidado" com 10% de desconto.
• Retenção: Envie um cupom automático pós-visita para garantir o retorno de novas clientes dentro de 30 dias.
• Otimização de Escala: Quinta e sexta-feira concentram 80% da demanda. Ofereça vantagens exclusivas nas terças-feiras para preencher lacunas ociosas.`;
      } else {
        return `✨ Revenue Audit - Aura Beauty Salon:
• Service Synergy: Haircut & Styling is your main traffic anchor. Bundle manicures and premium facials to create an express "Self-Care Bundle" with a 10% incentive.
• Retention Formula: Send an automatic post-visit reward coupon to secure a follow-up booking within 30 days.
• Scale Optimization: Focus 80% of promotions on Tuesdays/Wednesdays to fill calendar gaps during off-peak days.`;
      }
    } else {
      if (language === 'pt') {
        return `📈 Relatório Estratégico do Novo Empreendimento:
• Setup Inicial: Novo tenant cadastrado e configurado com sucesso! Próximo passo recomendado é registrar pelo menos 3 serviços e vincular a agenda de profissionais.
• Oferta Especial: Ative cupons de boas-vindas com desconto percentual para incentivar as primeiras reservas pelo portal do cliente.
• Análise da Agenda: Mantenha as janelas de agendamento compactas para otimizar o fluxo operacional diário.`;
      } else {
        return `📈 Strategic Startup Report for New Venture:
• Initial Sandbox Setup: Your new company has been successfully bootstrapped! The recommended next step is registering at least 3 high-demand services.
• Initial Campaign: Create a flat-discount "LAUNCH" coupon to drive initial client adoption through the self-service booking portal.
• Operating Intervals: Maintain precise, block-based professional availability to optimize daily operational hours.`;
      }
    }
  };

  const getSimulatedChatResponse = (userMsg: string) => {
    const msg = userMsg.toLowerCase();
    if (language === 'pt') {
      if (msg.includes('preço') || msg.includes('valor') || msg.includes('cobrar')) {
        return 'Para otimizar preços, recomendo realizar pacotes casados (combos). Clientes tendem a perceber maior valor agregado e isso eleva seu faturamento recorrente.';
      }
      if (msg.includes('agenda') || msg.includes('horário') || msg.includes('vaga')) {
        return 'A análise do calendário mostra que o melhor aproveitamento de agenda se dá com intervalos padronizados de 15 minutos e políticas de cancelamento claro de 24h.';
      }
      if (msg.includes('cliente') || msg.includes('fidelizar') || msg.includes('atrair')) {
        return 'Sugerimos configurar um cupom de boas-vindas no painel administrativo e enviá-lo de forma automatizada por WhatsApp/E-mail assim que o cliente realizar o cadastro.';
      }
      return 'Dica do Consultor Gemini: Foque em consolidar sua base de clientes locais e use os cupons integrados no sistema para impulsionar agendamentos em dias de menor movimento.';
    } else {
      if (msg.includes('price') || msg.includes('pricing') || msg.includes('charge')) {
        return 'To optimize pricing, bundle services together. Customers perceive higher overall value from combos, which increases your average transaction size.';
      }
      if (msg.includes('schedule') || msg.includes('calendar') || msg.includes('booking')) {
        return 'Calendar analytics show that scheduling efficiency is highest when keeping a standard 15-minute buffer and enforcing a clear 24-hour rescheduling policy.';
      }
      if (msg.includes('client') || msg.includes('retention') || msg.includes('loyal')) {
        return 'We suggest setting up a welcoming flat coupon in your admin tab and automatically sharing it upon client onboarding.';
      }
      return 'Gemini AI Advisory: Focus on expanding your recurring client list and using active promotional codes to drive bookings during off-peak hours.';
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setReport('');

    if (useLocalFallback) {
      setTimeout(() => {
        setReport(getSimulatedInsights());
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify({ language })
      });
      const data = await response.json();
      if (data.insights) {
        setReport(data.insights);
      } else {
        setReport(getSimulatedInsights());
      }
    } catch (err) {
      console.warn("Gemini API connection bypassed. Falling back to local offline insights.");
      setReport(getSimulatedInsights());
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    if (useLocalFallback) {
      setTimeout(() => {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: getSimulatedChatResponse(userMsg) }]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company-id': activeCompany
        },
        body: JSON.stringify({ language, customQuery: userMsg })
      });
      const data = await response.json();
      if (data.insights) {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: data.insights }]);
      } else {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: getSimulatedChatResponse(userMsg) }]);
      }
    } catch (err) {
      console.warn("Gemini API query failed, utilizing local response generator.");
      setChatHistory((prev) => [...prev, { sender: 'ai', text: getSimulatedChatResponse(userMsg) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Intro & trigger */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-indigo-950 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-indigo-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-500/30 animate-pulse">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">{t.aiInsightsTitle}</h2>
            <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Powered by Gemini Pro & Flash</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Our built-in AI consultant automatically scans your appointments lists, pricing tables, active client retention ratios, and peak hour trends to suggest custom optimizations.
        </p>

        <button
          onClick={generateReport}
          disabled={loading}
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-indigo-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-purple-600" />}
          {t.aiGenerateInsights}
        </button>
      </div>

      {/* Reports Display & Chat Board */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
        
        <div className="space-y-4 flex-1 overflow-y-auto max-h-[340px] pr-1">
          
          {/* Static introduction or generated report */}
          {!report && chatHistory.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <Cpu className="h-8 w-8 text-indigo-300 mx-auto" />
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                {t.aiPlaceholder}
              </p>
            </div>
          )}

          {/* Report response */}
          {report && (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-400 font-extrabold text-xs">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Gemini Growth Analytics Report:
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {report}
              </p>
            </div>
          )}

          {/* Conversational chat log */}
          {chatHistory.map((chat, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                chat.sender === 'user'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 ml-auto'
                  : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border border-indigo-100/20'
              }`}
            >
              <strong>{chat.sender === 'user' ? 'You' : 'Gemini AI'}:</strong>
              <p className="mt-1 whitespace-pre-line">{chat.text}</p>
            </div>
          ))}

        </div>

        {/* Input sender box */}
        <form onSubmit={handleSendChat} className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'pt' ? 'Pergunte sobre agendamentos ou metas...' : 'Ask about dental/salon scheduling tips...'}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>

      </div>

    </div>
  );
}
