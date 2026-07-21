import React from 'react';
import { translations } from '../translations';
import { Language, Role, Theme } from '../types';
import { Cloud, Globe, Sun, Moon, Shield, Building2, LogOut } from 'lucide-react';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentRole: Role;
  setRole: (role: Role) => void;
  activeCompany: string;
  setActiveCompany: (company: string) => void;
  companies: Array<{ id: string; name: string }>;
  userEmail: string;
}

export default function Navbar({
  language,
  setLanguage,
  theme,
  setTheme,
  currentRole,
  setRole,
  activeCompany,
  setActiveCompany,
  companies,
  userEmail
}: NavbarProps) {
  const t = translations[language];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 dark:bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
            <Cloud className="h-5 w-5 text-indigo-400 dark:text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{t.appName}</span>
              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Cloud</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              &ldquo;{t.slogan}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          
          {/* Active Company Multi-Tenant Switcher */}
          {currentRole !== 'Administrator' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t.companySelect}:</label>
              <select
                value={activeCompany}
                onChange={(e) => setActiveCompany(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none border-none cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-900 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Demo: Access Level Role Switcher */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
            <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider hidden lg:inline">{t.roleSelect}:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-transparent text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-none border-none cursor-pointer"
            >
              <option value="Manager" className="dark:bg-slate-950 dark:text-white">{t.Manager}</option>
              <option value="Employee" className="dark:bg-slate-950 dark:text-white">{t.Employee}</option>
              <option value="Administrator" className="dark:bg-slate-950 dark:text-white">{t.Administrator}</option>
              <option value="Customer" className="dark:bg-slate-950 dark:text-white">{t.Customer}</option>
            </select>
          </div>

          {/* Languages Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none border-none cursor-pointer"
            >
              <option value="pt" className="dark:bg-slate-950 dark:text-white">Português</option>
              <option value="en" className="dark:bg-slate-950 dark:text-white">English</option>
              <option value="es" className="dark:bg-slate-950 dark:text-white">Español</option>
            </select>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
            title={t.themeSelect}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Log out simulation */}
          <div className="hidden sm:flex flex-col items-end text-right border-l border-slate-200/60 dark:border-slate-800/60 pl-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {currentRole === 'Administrator' ? 'Super Admin' : userEmail.split('@')[0]}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wider uppercase">
              {t[currentRole]}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
