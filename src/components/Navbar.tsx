import React from 'react';
import { 
  Download, 
  Layers, 
  LayoutTemplate, 
  History, 
  Settings, 
  User, 
  Globe, 
  Sparkles,
  ShieldCheck,
  Zap,
  LogOut
} from 'lucide-react';
import { Language, AppTheme, UserProfile } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  activeTab: 'downloader' | 'batch' | 'templates' | 'history' | 'settings';
  setActiveTab: (tab: 'downloader' | 'batch' | 'templates' | 'history' | 'settings') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ur' || language === 'ar';

  const navItems = [
    { id: 'downloader', label: t.fetchButton || 'Downloader', icon: Download },
    { id: 'batch', label: t.batchDownloader || 'Batch Download', icon: Layers },
    { id: 'templates', label: t.templatesAndPresets || 'Templates', icon: LayoutTemplate },
    { id: 'history', label: t.downloadHistory || 'History', icon: History },
    { id: 'settings', label: t.settings || 'Settings', icon: Settings },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* App Brand Logo */}
          <div 
            onClick={() => setActiveTab('downloader')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Zap className="w-2 h-2 text-slate-950 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white font-display">
                  Snap<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Fetch</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full hidden sm:inline-block">
                  4K & MP3
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">
                {t.appSubtitle || 'Universal High-Speed Downloader'}
              </p>
            </div>
          </div>

          {/* Nav Items - Desktop */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section: Language & User Auth */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-950/70 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-200 cursor-pointer focus:outline-none pr-1"
              >
                <option value="ur" className="bg-slate-900 text-white">اردو (Urdu)</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="ar" className="bg-slate-900 text-white">العربية (Arabic)</option>
              </select>
            </div>

            {/* Auth Profile or Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:border-cyan-500/50 transition-colors"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/40"
                  />
                  <span className="text-xs font-bold text-white hidden md:inline-block max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <User className="w-4 h-4" />
                <span>{t.signIn}</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
