import React from 'react';
import { 
  Sparkles, 
  Tv, 
  Music, 
  Instagram, 
  Layers, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { TemplateItem, Language } from '../types';
import { TEMPLATES } from '../data/mockData';
import { translations } from '../data/translations';

interface TemplatesGridProps {
  language: Language;
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  language,
  onSelectTemplate,
}) => {
  const t = translations[language] || translations.en;
  const isUrdu = language === 'ur';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Tv': return Tv;
      case 'Music': return Music;
      case 'Instagram': return Instagram;
      case 'Layers': return Layers;
      default: return Video;
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-white font-display">
          {t.templatesAndPresets}
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          {t.quickPresets}
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => {
          const IconComponent = getIcon(tmpl.iconName);

          return (
            <div
              key={tmpl.id}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all hover:-translate-y-1"
            >
              <div>
                
                {/* Badge & Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 rounded-full">
                    {tmpl.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {isUrdu ? tmpl.titleUrdu : tmpl.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {isUrdu ? tmpl.descriptionUrdu : tmpl.description}
                </p>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectTemplate(tmpl)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-md"
              >
                <span>{t.useTemplate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
