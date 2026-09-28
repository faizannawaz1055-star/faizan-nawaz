import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  FileText, 
  Video 
} from 'lucide-react';
import { VideoMetadata, Language } from '../types';
import { translations } from '../data/translations';

interface AiSummaryModalProps {
  video: VideoMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AiSummaryModal: React.FC<AiSummaryModalProps> = ({
  video,
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language] || translations.en;
  
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    summary: string;
    keyPoints: string[];
    tags: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen && video) {
      fetchAiSummary();
    }
  }, [isOpen, video]);

  const fetchAiSummary = async () => {
    if (!video) return;
    setLoading(true);
    try {
      const response = await fetch('/api/ai-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: video.title,
          platform: video.platform,
          description: video.description || '',
        }),
      });
      const data = await response.json();
      setSummaryData(data);
    } catch {
      setSummaryData({
        summary: video.aiSummary || `Video highlights from ${video.title}.`,
        keyPoints: video.aiKeyPoints || ['High quality stream', 'Popular video', 'Clear audio track'],
        tags: video.tags || ['Video', 'Download'],
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {t.aiSummary}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">
              {video.title}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-purple-300">
              {t.generatingAiSummary}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Overview Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
                AI Video Summary
              </span>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {summaryData?.summary || video.aiSummary}
              </p>
            </div>

            {/* Key Takeaways */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.keyTakeaways}
              </span>
              <div className="space-y-2">
                {(summaryData?.keyPoints || video.aiKeyPoints || []).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.tags}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(summaryData?.tags || video.tags || []).map((tg, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-purple-300"
                  >
                    #{tg}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
