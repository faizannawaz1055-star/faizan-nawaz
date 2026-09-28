import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  Music, 
  Eye, 
  ThumbsUp, 
  Share2, 
  ShieldCheck, 
  FileAudio, 
  FileVideo, 
  X, 
  ArrowDownToLine,
  Smartphone,
  Apple,
  Chrome,
  Monitor,
  Check,
  ExternalLink,
  HelpCircle,
  Copy
} from 'lucide-react';
import { VideoMetadata, DownloadFormat, Language, BrowserDeviceType } from '../types';
import { translations } from '../data/translations';

interface VideoResultCardProps {
  metadata: VideoMetadata;
  language: Language;
  onDownload: (format: DownloadFormat, video: VideoMetadata, customNoWm?: boolean) => void;
  onOpenAiSummary: (video: VideoMetadata) => void;
  isDownloading: boolean;
  downloadProgress: number;
  browserDevice: BrowserDeviceType;
  autoNoWatermark: boolean;
  setAutoNoWatermark: (val: boolean) => void;
  selectedQuality: string;
  setSelectedQuality: (q: string) => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  metadata,
  language,
  onDownload,
  onOpenAiSummary,
  isDownloading,
  downloadProgress,
  browserDevice,
  autoNoWatermark,
  setAutoNoWatermark,
  selectedQuality,
  setSelectedQuality,
}) => {
  const t = translations[language] || translations.en;
  
  // Find matching format based on selectedQuality or default to first
  const initialFormat = metadata.formats.find(f => 
    f.quality.toLowerCase().includes(selectedQuality.toLowerCase()) || 
    f.id.toLowerCase().includes(selectedQuality.toLowerCase())
  ) || metadata.formats[0];

  const [selectedFormatId, setSelectedFormatId] = useState<string>(
    initialFormat?.id || metadata.formats[0]?.id || ''
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isIosHelpOpen, setIsIosHelpOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedFormat = metadata.formats.find((f) => f.id === selectedFormatId) || metadata.formats[0];

  const handleSelectFormat = (fmt: DownloadFormat) => {
    setSelectedFormatId(fmt.id);
    setSelectedQuality(fmt.quality);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(metadata.originalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const videoFormats = metadata.formats.filter((f) => f.format === 'mp4' || f.format === 'webm');
  const audioFormats = metadata.formats.filter((f) => f.format === 'mp3' || f.format === 'm4a');

  // Direct stream url for previewing or iPhone direct video saving with real video link
  const directParam = autoNoWatermark 
    ? (metadata.directNoWatermarkUrl || metadata.directVideoUrl || '')
    : (metadata.directVideoUrl || metadata.directNoWatermarkUrl || '');

  const streamUrl = `/api/stream-video?url=${encodeURIComponent(metadata.originalUrl || metadata.url || '')}&directUrl=${encodeURIComponent(directParam)}&quality=${encodeURIComponent(selectedFormat?.quality || '1080p')}&format=${selectedFormat?.format || 'mp4'}&noWatermark=${autoNoWatermark}`;
  const directDownloadUrl = `/api/download?url=${encodeURIComponent(metadata.originalUrl || metadata.url || '')}&directUrl=${encodeURIComponent(directParam)}&title=${encodeURIComponent(metadata.title)}&format=${selectedFormat?.format || 'mp4'}&quality=${encodeURIComponent(selectedFormat?.quality || '1080p')}&noWatermark=${autoNoWatermark}&device=${browserDevice}`;

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Device Mode Active Indicator */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400">
              {browserDevice === 'mobile_chrome' && <Chrome className="w-4 h-4 text-amber-400" />}
              {browserDevice === 'iphone' && <Apple className="w-4 h-4 text-slate-200 fill-current" />}
              {browserDevice === 'pc' && <Monitor className="w-4 h-4 text-cyan-400" />}
            </span>
            <span className="text-xs font-bold text-slate-200">
              {browserDevice === 'mobile_chrome' && (language === 'ur' ? 'موبائل کروم موڈ فعال' : 'Mobile Chrome Mode Active')}
              {browserDevice === 'iphone' && (language === 'ur' ? 'آئی فون / iOS موڈ فعال' : 'iPhone / iOS Mode Active')}
              {browserDevice === 'pc' && (language === 'ur' ? 'کمپیوٹر / پی سی موڈ فعال' : 'PC Desktop Mode Active')}
            </span>
          </div>

          {/* Quick toggle watermark in card */}
          <button
            type="button"
            onClick={() => setAutoNoWatermark(!autoNoWatermark)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              autoNoWatermark 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{autoNoWatermark ? (language === 'ur' ? 'بغیر واٹر مارک: آن ✓' : 'No Watermark: ON ✓') : (language === 'ur' ? 'واٹر مارک: آف' : 'Watermark: OFF')}</span>
          </button>
        </div>

        {/* Main Grid: Thumbnail + Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left Column: Thumbnail with Play Overlay */}
          <div className="md:col-span-5 relative group">
            <div className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <img 
                src={metadata.thumbnailUrl} 
                alt={metadata.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-contain bg-slate-950 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

              {/* Platform Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-xs font-bold text-white capitalize flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{metadata.platform}</span>
              </div>

              {/* Watermark Status Badge */}
              {autoNoWatermark && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-600/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{language === 'ur' ? 'بغیر واٹر مارک' : 'NO WATERMARK'}</span>
                </div>
              )}

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs font-mono text-emerald-400 font-bold border border-emerald-500/30 shadow">
                {language === 'ur' ? `مکمل مدت: ${metadata.duration}` : `Full: ${metadata.duration}`}
              </div>

              {/* Play Button Trigger */}
              <button
                onClick={() => {
                  setVideoError(false);
                  setIsPreviewOpen(true);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-90 group-hover:opacity-100 transition-opacity"
                title={language === 'ur' ? 'ویڈیو پلے کریں' : 'Play Video'}
              >
                <div className="w-14 h-14 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 fill-current pl-1" />
                </div>
              </button>
            </div>

            {/* In-app Video Preview Button */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ur' ? 'ویڈیو دیکھیں' : 'Watch Preview'}</span>
              </button>

              <button
                onClick={() => onOpenAiSummary(metadata)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:border-purple-500/60 text-purple-200 text-xs font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.aiSummary}</span>
              </button>
            </div>

            {/* Special iPhone Helper Box */}
            {browserDevice === 'iphone' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span className="flex items-center gap-1">
                    <Apple className="w-3 h-3 fill-current" />
                    <span>{language === 'ur' ? 'آئی فون میں سیو کرنے کا طریقہ' : 'iPhone Save Guide'}</span>
                  </span>
                  <button 
                    onClick={() => setIsIosHelpOpen(true)}
                    className="text-cyan-400 underline hover:text-cyan-300"
                  >
                    {language === 'ur' ? 'تفصیل' : 'Help'}
                  </button>
                </div>
                <p className="text-slate-400 leading-tight">
                  {language === 'ur' 
                    ? 'ڈاؤن لوڈ کے بعد Safari میں ڈاؤن لوڈ آئیکن پر ٹیپ کریں اور "Save Video" منتخب کریں' 
                    : 'Tap Download below, then in Safari tap the download arrow & choose Share -> Save Video.'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Title, Author, Views, Format Selector */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              
              {/* Author & Upload Date */}
              <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img 
                    src={metadata.avatarUrl} 
                    alt={metadata.author}
                    className="w-5 h-5 rounded-full object-cover" 
                  />
                  <span className="font-semibold text-slate-200">{metadata.author}</span>
                </div>
                <span className="text-slate-500">{metadata.uploadedAt}</span>
              </div>

              {/* Video Title */}
              <h2 className="text-lg md:text-xl font-bold text-white line-clamp-2 leading-snug">
                {metadata.title}
              </h2>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {metadata.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                  {metadata.likes}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors ml-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? t.linkCopied : t.copyLink}</span>
                </button>
              </div>

              {/* Quality & Format Selection Header */}
              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'ur' ? 'ویڈیو کوالٹی منتخب کریں' : 'Select Video Quality & Resolution'}</span>
                  </p>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {selectedFormat?.quality} ({selectedFormat?.estimatedSize})
                  </span>
                </div>

                {/* Video Formats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {videoFormats.map((fmt) => {
                    const isSelected = selectedFormatId === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => handleSelectFormat(fmt)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400 text-white font-bold ring-2 ring-cyan-500/40 shadow-lg'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{fmt.quality}</span>
                            {fmt.isBest && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-cyan-500 text-slate-950 rounded font-black uppercase">
                                Best
                              </span>
                            )}
                            {autoNoWatermark && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 rounded font-bold">
                                {language === 'ur' ? 'بغیر واٹر مارک' : 'Clean'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {fmt.resolution || 'MP4 Video'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-semibold text-slate-300 block">{fmt.estimatedSize}</span>
                          {isSelected && (
                            <span className="text-[10px] text-cyan-400 font-bold">✓ Selected</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Audio Formats */}
                {audioFormats.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <FileAudio className="w-3.5 h-3.5 text-pink-400" />
                      <span>{language === 'ur' ? 'صرف آڈیو (MP3)' : 'Audio Only (MP3)'}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {audioFormats.map((fmt) => {
                        const isSelected = selectedFormatId === fmt.id;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => handleSelectFormat(fmt)}
                            className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs text-left transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-950/80 to-rose-950/80 border-pink-400 text-white font-bold ring-2 ring-pink-500/40 shadow-lg'
                                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{fmt.quality}</span>
                                <span className="px-1.5 py-0.2 text-[9px] bg-pink-500/20 text-pink-300 rounded font-semibold uppercase">
                                  MP3
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 uppercase font-mono">320kbps Audio</span>
                            </div>
                            <span className="font-mono text-xs text-slate-300">{fmt.estimatedSize}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Action Download Buttons tailored to Selected Device & Browser */}
            <div className="mt-6 space-y-2">
              
              {/* PRIMARY DOWNLOAD BUTTON */}
              <button
                onClick={() => selectedFormat && onDownload(selectedFormat, metadata, autoNoWatermark)}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base shadow-xl shadow-cyan-500/25 active:scale-98 transition-all disabled:opacity-50"
              >
                {isDownloading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.downloading} ({downloadProgress}%)</span>
                  </div>
                ) : (
                  <>
                    {browserDevice === 'mobile_chrome' && <Chrome className="w-5 h-5 text-amber-300" />}
                    {browserDevice === 'iphone' && <Apple className="w-5 h-5 text-white fill-current" />}
                    {browserDevice === 'pc' && <Monitor className="w-5 h-5 text-cyan-300" />}
                    
                    <span>
                      {browserDevice === 'mobile_chrome' && (language === 'ur' ? 'موبائل میں ڈاؤن لوڈ کریں' : 'Download for Mobile Chrome')}
                      {browserDevice === 'iphone' && (language === 'ur' ? 'آئی فون میں ڈاؤن لوڈ کریں' : 'Download for iPhone')}
                      {browserDevice === 'pc' && (language === 'ur' ? 'پی سی میں ڈاؤن لوڈ کریں' : 'Download for PC / Laptop')}
                      {' '}({selectedFormat?.quality})
                    </span>
                    <ArrowDownToLine className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* SECONDARY DEVICE ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
                {browserDevice === 'iphone' && (
                  <button
                    onClick={() => setIsIosHelpOpen(true)}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{language === 'ur' ? 'آئی فون پر ویڈیوز فوٹوز / Camera Roll میں کیسے جائیں؟' : 'How to save to iPhone Photos?'}</span>
                  </button>
                )}

                {browserDevice === 'mobile_chrome' && (
                  <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ur' ? 'ڈاؤن لوڈ کے بعد سیدھا گیلری میں چلے گا' : 'Plays directly in Phone Gallery & Media Player'}</span>
                  </div>
                )}

                {browserDevice === 'pc' && (
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{language === 'ur' ? 'تیز رفتار ڈائریکٹ ڈاؤن لوڈ' : 'High-speed multi-threaded download'}</span>
                  </div>
                )}

                <a
                  href={directDownloadUrl}
                  download
                  className="ml-auto text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                  title={language === 'ur' ? 'براؤزر سے ڈائریکٹ ڈاؤن لوڈ کریں' : 'Direct Browser Download'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ur' ? 'موبائل براؤزر سے ڈاؤن لوڈ' : 'Direct Browser Save'}</span>
                </a>
              </div>

              {/* Full Video Completion Guarantee Banner */}
              <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">
                    {language === 'ur' ? 'مکمل ویڈیو ڈاؤن لوڈ ہوگی:' : 'Complete Video Delivery:'}
                  </span>{' '}
                  <span>
                    {language === 'ur' 
                      ? `یہ فائل ٹک ٹاک پر اپلوڈ کی گئی مکمل ${metadata.duration} کی ویڈیو ہے۔ درمیان میں بالکل نہیں رکے گی۔`
                      : `This file contains the complete ${metadata.duration} video stream without truncation.`}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Video Preview Modal with REAL playable HTML5 video */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white line-clamp-1">{metadata.title}</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              {!videoError ? (
                <video
                  key={streamUrl}
                  src={streamUrl}
                  controls
                  autoPlay
                  playsInline
                  poster={metadata.thumbnailUrl}
                  className="w-full h-full object-contain"
                  onError={() => setVideoError(true)}
                >
                  {language === 'ur' ? 'آپ کا براؤزر ویڈیو سپورٹ نہیں کرتا۔' : 'Your browser does not support the video tag.'}
                </video>
              ) : (
                <div className="p-6 text-center max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {language === 'ur' ? 'ویڈیو ڈاؤن لوڈ کے لیے مکمل تیار ہے!' : 'Video is 100% Ready to Download!'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'ur' 
                      ? 'موبائل براؤزر میں ویڈیو فائل محفوظ کرنے کے لیے نیچے بٹن دبائیں:'
                      : 'Tap below to download and save the real video directly to your gallery:'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFormat) onDownload(selectedFormat, metadata, autoNoWatermark);
                      setIsPreviewOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'ur' ? 'ابھی ویڈیو ڈاؤن لوڈ کریں' : 'Download Video Now'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">{selectedFormat?.quality}</span>
                {autoNoWatermark && <span className="ml-2 text-emerald-400 font-bold">✓ Clean (بغیر واٹر مارک)</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedFormat) onDownload(selectedFormat, metadata, autoNoWatermark);
                    setIsPreviewOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ur' ? 'فائل محفوظ کریں' : 'Save File'}</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                >
                  {language === 'ur' ? 'بند کریں' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iPhone Save to Photos / Camera Roll Guide Modal */}
      {isIosHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Apple className="w-6 h-6 text-white fill-current" />
                <h3 className="text-base font-bold text-white">
                  {language === 'ur' ? 'آئی فون پر ویڈیو کیسے سیو کریں؟' : 'How to Save Video to iPhone Photos'}
                </h3>
              </div>
              <button
                onClick={() => setIsIosHelpOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs shrink-0">1</span>
                <div>
                  <p className="font-bold text-white mb-0.5">
                    {language === 'ur' ? 'نیلے ڈاؤن لوڈ بٹن پر کلک کریں' : 'Tap the Download Button'}
                  </p>
                  <p className="text-slate-400">
                    {language === 'ur' ? 'سفاری براؤزر میں فائل ڈاؤن لوڈ کا پرامپٹ آئے گا۔' : 'Safari will show a download confirmation popup.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs shrink-0">2</span>
                <div>
                  <p className="font-bold text-white mb-0.5">
                    {language === 'ur' ? 'ایڈریس بار میں ⬇️ ڈاؤن لوڈز آئیکن پر ٹیپ کریں' : 'Tap the ⬇️ Downloads Arrow in Safari'}
                  </p>
                  <p className="text-slate-400">
                    {language === 'ur' ? 'ڈاؤن لوڈ لسٹ میں اپنی ویڈیو پر کلک کریں تاکہ وہ فل اسکرین کھلے۔' : 'Tap on the downloaded video file to open it in full screen.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs shrink-0">3</span>
                <div>
                  <p className="font-bold text-white mb-0.5">
                    {language === 'ur' ? 'شیئر بٹن (📤) دبا کر "Save Video" منتخب کریں' : 'Tap Share (📤) and select "Save Video"'}
                  </p>
                  <p className="text-slate-400">
                    {language === 'ur' ? 'ویڈیو فوراً آپ کے آئی فون کی فوٹوز (Photos / Camera Roll) میں محفوظ ہو جائے گی!' : 'The video is instantly saved to your iPhone Photos app / Camera Roll!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsIosHelpOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs"
              >
                {language === 'ur' ? 'سمجھ آ گیا' : 'Got it!'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
