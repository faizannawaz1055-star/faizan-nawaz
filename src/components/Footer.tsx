import React from 'react';
import { 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Zap, 
  Heart 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white font-display">
                Snap<span className="text-cyan-400">Fetch</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              {t.tagline || 'Universal High-Speed Video & Audio Downloader for YouTube, TikTok, Instagram, Facebook and Twitter.'}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Safe, Secure & No Watermark Downloads</span>
            </div>
          </div>

          {/* Device Smoothness */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Supported Devices
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Android & iPhones</span>
              </li>
              <li className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Windows PC & Laptops</span>
              </li>
              <li className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>MacBooks & iMacs</span>
              </li>
            </ul>
          </div>

          {/* Formats */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Output Formats
            </h4>
            <ul className="space-y-1.5 text-slate-400 font-mono">
              <li>MP4 - 4K Ultra HD (2160p)</li>
              <li>MP4 - 1080p Full HD</li>
              <li>MP3 - 320kbps Studio Audio</li>
              <li>TikTok Clean (No Watermark)</li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px]">
          <p>© {new Date().getFullYear()} SnapFetch Video Downloader. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built for ultra smooth performance on all devices</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
