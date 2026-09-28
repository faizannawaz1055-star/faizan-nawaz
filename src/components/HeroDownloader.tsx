import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Sparkles, 
  ArrowRight, 
  Clipboard, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Smartphone,
  Monitor,
  Chrome,
  Apple,
  Sliders,
  Check,
  Film
} from 'lucide-react';
import { Language, PlatformType, BrowserDeviceType } from '../types';
import { translations } from '../data/translations';
import { PLATFORMS } from '../data/mockData';
import { extractCleanUrl, detectPlatformFromUrl } from '../utils/urlHelper';

interface HeroDownloaderProps {
  url: string;
  setUrl: (url: string) => void;
  onFetch: (urlToFetch?: string) => void;
  isLoading: boolean;
  language: Language;
  selectedPlatform: PlatformType | 'all';
  setSelectedPlatform: (p: PlatformType | 'all') => void;
  autoNoWatermark: boolean;
  setAutoNoWatermark: (val: boolean) => void;
  browserDevice: BrowserDeviceType;
  setBrowserDevice: (device: BrowserDeviceType) => void;
  selectedQuality: string;
  setSelectedQuality: (q: string) => void;
}

export const HeroDownloader: React.FC<HeroDownloaderProps> = ({
  url,
  setUrl,
  onFetch,
  isLoading,
  language,
  selectedPlatform,
  setSelectedPlatform,
  autoNoWatermark,
  setAutoNoWatermark,
  browserDevice,
  setBrowserDevice,
  selectedQuality,
  setSelectedQuality,
}) => {
  const t = translations[language] || translations.en;
  const [pasteSuccess, setPasteSuccess] = useState(false);

  // Auto-detect browser/device on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator?.userAgent) {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setBrowserDevice('iphone');
      } else if (/android/.test(ua) || (/mobile/.test(ua) && /chrome/.test(ua))) {
        setBrowserDevice('mobile_chrome');
      } else {
        setBrowserDevice('pc');
      }
    }
  }, [setBrowserDevice]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const clean = extractCleanUrl(text);
        const finalUrl = clean || text.trim();
        setUrl(finalUrl);
        const plat = detectPlatformFromUrl(finalUrl);
        setSelectedPlatform(plat);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  const handleTryExample = (sampleUrl: string, pId: PlatformType) => {
    setSelectedPlatform(pId);
    setUrl(sampleUrl);
    onFetch(sampleUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = extractCleanUrl(url);
    const targetUrl = clean || url.trim();
    if (targetUrl) {
      setUrl(targetUrl);
      onFetch(targetUrl);
    }
  };

  const qualityOptions = [
    { id: '4k', label: '4K Ultra HD', badge: 'Best' },
    { id: '1080p', label: '1080p Full HD', badge: 'HQ' },
    { id: '720p', label: '720p HD', badge: 'Fast' },
    { id: '480p', label: '480p SD', badge: 'Light' },
    { id: 'mp3_320', label: 'MP3 320k Audio', badge: 'Music' },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-18 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs md:text-sm font-semibold text-cyan-300 mb-5 shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{t.tagline || '4K Video & MP3 Audio Downloader'}</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight font-display max-w-4xl mx-auto">
          {language === 'ur' ? (
            <span>
              تمام سوشل میڈیا ویڈیوز <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">بغیر واٹر مارک اور 4K میں</span> ڈاؤن لوڈ کریں
            </span>
          ) : (
            <span>
              Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">4K Video & MP3</span> Downloader
            </span>
          )}
        </h1>

        <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
          {t.deviceOptimization || 'Download original quality videos from YouTube, TikTok, Instagram, Facebook, and Twitter instantly.'}
        </p>

        {/* Main Downloader Container */}
        <div className="mt-8 max-w-3xl mx-auto bg-slate-800/80 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl backdrop-blur-md">
          
          {/* USER SPECIFIED FEATURE: Device & Browser Selector attached right above/with paste box */}
          <div className="mb-4 pb-3 border-b border-slate-700/70">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
              
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Smartphone className="w-3.5 h-3.5" />
                </span>
                <span>{language === 'ur' ? 'کس براؤزر یا ڈیوائس میں چلاتے ہو؟' : 'Which browser / device are you using?'}</span>
              </div>

              {/* Device Toggle Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full sm:w-auto justify-center">
                
                {/* Mobile Chrome */}
                <button
                  type="button"
                  onClick={() => setBrowserDevice('mobile_chrome')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    browserDevice === 'mobile_chrome'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 ring-1 ring-amber-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Chrome className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'ur' ? 'موبائل کروم' : 'Mobile Chrome'}</span>
                  {browserDevice === 'mobile_chrome' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>

                {/* iPhone / iPad */}
                <button
                  type="button"
                  onClick={() => setBrowserDevice('iphone')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    browserDevice === 'iphone'
                      ? 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-950 shadow-md shadow-white/20 ring-1 ring-white/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Apple className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'ur' ? 'آئی فون (iOS)' : 'iPhone (iOS)'}</span>
                  {browserDevice === 'iphone' && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                </button>

                {/* PC / Desktop */}
                <button
                  type="button"
                  onClick={() => setBrowserDevice('pc')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    browserDevice === 'pc'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{language === 'ur' ? 'کمپیوٹر / PC' : 'PC / Desktop'}</span>
                  {browserDevice === 'pc' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>

              </div>
            </div>

            {/* Active Device Optimization Hint Banner */}
            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {browserDevice === 'mobile_chrome' && (
                  <span>
                    {language === 'ur' 
                      ? 'موبائل کروم موڈ ایکٹو: فائل براہِ راست ڈاؤن لوڈز اور موبائل گیلری میں جائے گی'
                      : 'Mobile Chrome Mode Active: Direct native download to Phone Gallery & Downloads folder.'}
                  </span>
                )}
                {browserDevice === 'iphone' && (
                  <span>
                    {language === 'ur' 
                      ? 'آئی فون موڈ ایکٹو: iOS سفاری ڈاؤن لوڈر اور Camera Roll / Files میں محفوظ کرنے کی سہولت'
                      : 'iPhone / iOS Mode Active: Direct WebKit streaming & Save to Photos / Files support.'}
                  </span>
                )}
                {browserDevice === 'pc' && (
                  <span>
                    {language === 'ur' 
                      ? 'پی سی موڈ ایکٹو: تیز رفتار ڈائریکٹ فائل سیور اور ملٹی تھریڈ سپیڈ'
                      : 'PC / Desktop Mode Active: Ultra-fast multi-threaded direct save to selected folder.'}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider hidden sm:inline">
                {browserDevice}
              </span>
            </div>
          </div>

          {/* Main URL Input Box Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative p-2 md:p-2.5 rounded-2xl bg-slate-950/80 border-2 border-slate-700 focus-within:border-cyan-500 shadow-xl transition-all">
              <div className="flex items-center gap-2 md:gap-3">
                
                <div className="pl-2 text-cyan-400">
                  <Link2 className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    // If multiple words or extra text with link was typed/pasted
                    if (rawVal.includes('http') && (rawVal.includes(' ') || rawVal.includes('\n'))) {
                      const clean = extractCleanUrl(rawVal);
                      if (clean) {
                        setUrl(clean);
                        setSelectedPlatform(detectPlatformFromUrl(clean));
                        return;
                      }
                    }
                    setUrl(rawVal);
                  }}
                  placeholder={t.pasteUrlPlaceholder}
                  className="w-full bg-transparent py-2.5 text-sm md:text-base text-white placeholder-slate-400 focus:outline-none font-medium"
                />

                {/* Clear button if URL typed */}
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Quick Paste Button */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
                >
                  {pasteSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Pasted!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Paste</span>
                    </>
                  )}
                </button>

                {/* Main Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="flex items-center justify-center gap-2 px-5 md:px-7 py-3 rounded-xl font-bold text-sm md:text-base text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">{t.fetching}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.fetchButton}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </div>
          </form>

          {/* USER SPECIFIED FEATURES: Without Watermark Toggle & Quality Selector */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            
            {/* 1. WITHOUT WATERMARK TOGGLE (Prominent & High Contrast) */}
            <button
              type="button"
              onClick={() => setAutoNoWatermark(!autoNoWatermark)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all ${
                autoNoWatermark
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                autoNoWatermark ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-950'
              }`}>
                {autoNoWatermark && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <ShieldCheck className={`w-4 h-4 ${autoNoWatermark ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-bold text-xs">
                {language === 'ur' ? 'بغیر واٹر مارک (No Watermark HD)' : 'Without Watermark Mode'}
              </span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-extrabold uppercase ${
                autoNoWatermark ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {autoNoWatermark ? 'ACTIVE' : 'OFF'}
              </span>
            </button>

            {/* 2. QUALITY SELECTOR PILLS */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap hidden sm:inline mr-1">
                {language === 'ur' ? 'کوالٹی:' : 'Quality:'}
              </span>
              {qualityOptions.map((q) => {
                const isSelected = selectedQuality.toLowerCase().includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuality(q.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span>{q.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Example Links Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {t.tryExample}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleTryExample(platform.sampleUrl, platform.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:scale-105 active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{platform.name}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded font-mono">
                  {platform.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
