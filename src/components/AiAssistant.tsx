import React, { useState } from 'react';
import { translations } from '../translations';
import { Language } from '../types';
import { Sparkles, Brain, Cpu, MessageSquare, RefreshCw, Send, Check } from 'lucide-react';

interface AiAssistantProps {
  language: Language;
  activeCompany: string;
}

export default function AiAssistant({ language, activeCompany }: AiAssistantProps) {
  const t = translations[language];

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  const generateReport = async () => {
    setLoading(true);
    setReport('');
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
        setReport(language === 'pt' ? 'Não foi possível gerar no momento. Configure sua GEMINI_API_KEY no menu secrets.' : 'Could not generate report. Configure your GEMINI_API_KEY under secrets.');
      }
    } catch (err) {
      console.error(err);
      setReport(language === 'pt' ? 'Erro de comunicação.' : 'Communication error.');
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
        setChatHistory((prev) => [...prev, { sender: 'ai', text: language === 'pt' ? 'O assistente requer uma chave GEMINI_API_KEY ativa em Secrets.' : 'The assistant requires an active GEMINI_API_KEY in Secrets.' }]);
      }
    } catch (err) {
      console.error(err);
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
