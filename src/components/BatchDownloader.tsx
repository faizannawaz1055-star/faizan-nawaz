import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ArrowDownToLine, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Zap,
  FileVideo,
  FileAudio
} from 'lucide-react';
import { Language, PlatformType, VideoMetadata } from '../types';
import { translations } from '../data/translations';

interface BatchDownloaderProps {
  language: Language;
  onBatchDownloadComplete: (items: any[]) => void;
}

interface BatchItem {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  title?: string;
  platform?: PlatformType;
  format?: string;
  size?: string;
  downloadUrl?: string;
}

export const BatchDownloader: React.FC<BatchDownloaderProps> = ({
  language,
  onBatchDownloadComplete,
}) => {
  const t = translations[language] || translations.en;
  
  const [inputText, setInputText] = useState('');
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParseBatch = () => {
    const urls = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http://') || line.startsWith('https://'));

    if (urls.length === 0) return;

    const items: BatchItem[] = urls.slice(0, 10).map((url, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      url,
      status: 'pending',
    }));

    setBatchItems(items);
  };

  const handleStartBatch = async () => {
    if (batchItems.length === 0) return;
    setIsProcessing(true);

    const updated = [...batchItems];

    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'processing';
      setBatchItems([...updated]);

      try {
        const response = await fetch('/api/parse-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: updated[i].url }),
        });

        const resData = await response.json();
        if (resData.success) {
          const video: VideoMetadata = resData.data;
          updated[i].title = video.title;
          updated[i].platform = video.platform;
          updated[i].size = selectedFormat === 'mp3' ? '8.4 MB' : '36.2 MB';
          updated[i].downloadUrl = `/api/download?title=${encodeURIComponent(video.title)}&format=${selectedFormat}&quality=${selectedQuality}`;
          updated[i].status = 'ready';
        } else {
          updated[i].status = 'error';
        }
      } catch {
        updated[i].status = 'error';
      }

      setBatchItems([...updated]);
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsProcessing(false);
    onBatchDownloadComplete(updated.filter((item) => item.status === 'ready'));
  };

  const handleClear = () => {
    setInputText('');
    setBatchItems([]);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-lg">
        
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-display">
              {t.batchDownloader}
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              {t.batchPastePlaceholder}
            </p>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-4">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttps://www.tiktok.com/@user/video/123456789\nhttps://www.instagram.com/reel/C3x9_12M_3Y/`}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />

          {/* Batch Format Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Batch Format:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('mp4')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedFormat === 'mp4' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileVideo className="w-3.5 h-3.5" />
                  <span>MP4 Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('mp3')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedFormat === 'mp3' ? 'bg-pink-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileAudio className="w-3.5 h-3.5" />
                  <span>MP3 Audio</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleParseBatch}
                disabled={!inputText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40"
              >
                Parse Links
              </button>
              {batchItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Parsed Links Queue */}
        {batchItems.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Links Queue ({batchItems.length})</span>
              <span>Status</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {batchItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-mono text-slate-500 font-bold">#{index + 1}</span>
                    <span className="truncate font-mono">{item.title || item.url}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold text-[10px]">
                        Pending
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold text-[10px]">
                        <div className="w-2.5 h-2.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        Fetching
                      </span>
                    )}
                    {item.status === 'ready' && (
                      <a
                        href={item.downloadUrl}
                        download
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] hover:bg-emerald-500/30 transition-colors"
                      >
                        <ArrowDownToLine className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    )}
                    {item.status === 'error' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold text-[10px]">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Start Process Button */}
            <button
              onClick={handleStartBatch}
              disabled={isProcessing}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Batch Queue...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{t.startBatchDownload}</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
