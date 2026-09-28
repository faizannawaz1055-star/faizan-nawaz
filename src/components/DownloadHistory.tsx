import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ArrowDownToLine, 
  ExternalLink, 
  HardDrive, 
  CheckCircle2,
  FileVideo,
  FileAudio
} from 'lucide-react';
import { DownloadItem, Language, PlatformType } from '../types';
import { translations } from '../data/translations';

interface DownloadHistoryProps {
  history: DownloadItem[];
  language: Language;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  language,
  onClearHistory,
  onRemoveItem,
}) => {
  const t = translations[language] || translations.en;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<PlatformType | 'all'>('all');

  const filteredItems = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || item.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-lg">
        
        {/* Header Title & Clear Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                {t.downloadHistory}
              </h2>
              <p className="text-xs text-slate-400">
                {history.length} {t.totalDownloads}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search download history..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as PlatformType | 'all')}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter / X</option>
            </select>

          </div>
        )}

        {/* History List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-800 rounded-2xl">
            <HardDrive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800">
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="capitalize font-semibold text-cyan-400">{item.platform}</span>
                      <span>•</span>
                      <span className="uppercase font-mono">{item.format}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{item.quality}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-400">{item.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={item.downloadUrl}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
