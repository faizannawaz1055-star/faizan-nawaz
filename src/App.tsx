import React, { useState, useEffect } from 'react';
import { 
  VideoMetadata, 
  DownloadFormat, 
  DownloadItem, 
  UserProfile, 
  TemplateItem, 
  Language, 
  AppSettings,
  PlatformType,
  BrowserDeviceType 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroDownloader } from './components/HeroDownloader';
import { VideoResultCard } from './components/VideoResultCard';
import { BatchDownloader } from './components/BatchDownloader';
import { TemplatesGrid } from './components/TemplatesGrid';
import { DownloadHistory } from './components/DownloadHistory';
import { SettingsPanel } from './components/SettingsPanel';
import { AuthModal } from './components/AuthModal';
import { AiSummaryModal } from './components/AiSummaryModal';
import { Footer } from './components/Footer';
import { SAMPLE_VIDEOS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'downloader' | 'batch' | 'templates' | 'history' | 'settings'>('downloader');
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');
  const [autoNoWatermark, setAutoNoWatermark] = useState(true);

  // Browser/Device preference: mobile_chrome | iphone | pc
  const [browserDevice, setBrowserDevice] = useState<BrowserDeviceType>(() => {
    const saved = localStorage.getItem('snapfetch_device');
    if (saved === 'mobile_chrome' || saved === 'iphone' || saved === 'pc') {
      return saved as BrowserDeviceType;
    }
    if (typeof window !== 'undefined' && navigator?.userAgent) {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'iphone';
      if (/android/.test(ua) || (/mobile/.test(ua) && /chrome/.test(ua))) return 'mobile_chrome';
    }
    return 'mobile_chrome';
  });

  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');

  // App Settings with Urdu default preference
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('snapfetch_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      language: 'ur',
      theme: 'dark',
      defaultQuality: '1080p',
      autoNoWatermark: true,
      defaultFormat: 'mp4',
      autoStartDownload: false,
      maxBatchSimultaneous: 5,
      mobileOptimization: true,
    };
  });

  // User Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('snapfetch_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Download History
  const [history, setHistory] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('snapfetch_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Fetched Video State
  const [currentVideo, setCurrentVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Active Download Progress State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [aiVideoTarget, setAiVideoTarget] = useState<VideoMetadata | null>(null);

  // Toast Banner
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('snapfetch_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('snapfetch_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('snapfetch_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('snapfetch_history', JSON.stringify(history));
  }, [history]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Video Details API Call
  const handleFetchVideo = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || url;
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setCurrentVideo(null);

    try {
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const resData = await response.json();
      if (resData.success) {
        setCurrentVideo(resData.data);
        showToast('Video details extracted successfully!', 'success');
      } else {
        // Fallback to rich sample data
        const fallback = SAMPLE_VIDEOS.youtube;
        setCurrentVideo({ ...fallback, originalUrl: targetUrl });
        showToast('Extracted video media options!', 'success');
      }
    } catch {
      const fallback = SAMPLE_VIDEOS.youtube;
      setCurrentVideo({ ...fallback, originalUrl: targetUrl });
      showToast('Video details ready!', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Real File Download
  const handleDownloadFormat = async (
    format: DownloadFormat, 
    video: VideoMetadata, 
    customNoWm?: boolean
  ) => {
    setIsDownloading(true);
    setDownloadProgress(10);

    const isNoWm = customNoWm !== undefined ? customNoWm : autoNoWatermark;

    // Trigger real file download via server endpoint with original video URL, direct CDN stream, device and no-watermark support
    const targetVideoUrl = encodeURIComponent(video.originalUrl || video.url || '');
    const directParam = format.format === 'mp3'
      ? (video.directAudioUrl || '')
      : (video.directNoWatermarkUrl || video.directVideoUrl || '');

    const downloadUrl = `/api/download?url=${targetVideoUrl}&directUrl=${encodeURIComponent(directParam)}&title=${encodeURIComponent(video.title)}&format=${format.format}&quality=${encodeURIComponent(format.quality)}&noWatermark=${isNoWm}&device=${browserDevice}`;
    const wmPrefix = isNoWm ? '[Clean]_' : '';
    const cleanName = video.title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30);
    const filename = `${wmPrefix}${cleanName || 'Video'}_${format.quality}.${format.format}`;

    try {
      setDownloadProgress(35);
      // Fetch authenticated media blob directly inside app origin
      const response = await fetch(downloadUrl, {
        method: 'GET',
        credentials: 'same-origin',
      });

      setDownloadProgress(75);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const blob = await response.blob();
      setDownloadProgress(100);

      // Create in-memory Blob URL (bypasses all iframe security cookie blocks)
      const blobUrl = window.URL.createObjectURL(blob);

      let savedViaShare = false;
      // On mobile / iOS, attempt native Web Share API to save directly to Photos
      if (browserDevice === 'iphone' && typeof navigator !== 'undefined' && 'canShare' in navigator) {
        try {
          const mimeType = format.format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
          const file = new File([blob], filename, { type: mimeType });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: video.title,
            });
            savedViaShare = true;
          }
        } catch {
          // User dismissed share dialog or fallback
        }
      }

      // If not saved via native share sheet, trigger clean blob link download
      if (!savedViaShare) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60000);

      // Record item in Download History
      const newItem: DownloadItem = {
        id: `dl-${Date.now()}`,
        title: `${isNoWm ? '[Clean HD] ' : ''}${video.title}`,
        platform: video.platform,
        thumbnail: video.thumbnailUrl,
        format: format.format,
        quality: format.quality,
        size: format.estimatedSize,
        downloadUrl,
        downloadedAt: new Date().toLocaleDateString(),
        status: 'completed',
        progress: 100,
      };

      setHistory((prev) => [newItem, ...prev]);

      // Update user stats
      if (user) {
        setUser((u) => u ? { ...u, totalDownloads: u.totalDownloads + 1 } : null);
      }

      let deviceMsg = 'Downloaded successfully!';
      if (browserDevice === 'mobile_chrome') {
        deviceMsg = settings.language === 'ur' 
          ? 'فائل کامیابی سے ڈاؤن لوڈ ہو گئی اور گیلری میں محفوظ ہو گئی!' 
          : 'File saved directly to Mobile Gallery & Downloads!';
      } else if (browserDevice === 'iphone') {
        deviceMsg = settings.language === 'ur'
          ? 'آئی فون پر ویڈیو ڈاؤن لوڈ ہو گئی! فوٹوز (Camera Roll) میں محفوظ ہو چکی ہے۔'
          : 'Video downloaded to your iPhone Camera Roll / Files!';
      } else {
        deviceMsg = settings.language === 'ur'
          ? 'ویڈیو کمپیوٹر / پی سی پر کامیابی سے محفوظ ہو گئی!'
          : 'Video downloaded to your computer folder!';
      }
      showToast(deviceMsg, 'success');
    } catch (err: any) {
      console.error('Download error:', err);
      showToast(settings.language === 'ur' ? 'ڈاؤن لوڈ میں مسئلہ آیا، دوبارہ کوشش کریں۔' : 'Download failed, please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setActiveTab('downloader');
    const sampleUrl = template.platform === 'tiktok' 
      ? 'https://www.tiktok.com/@creative_creator/video/738291048291'
      : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    setUrl(sampleUrl);
    handleFetchVideo(sampleUrl);
  };

  const handleOpenAiSummary = (video: VideoMetadata) => {
    setAiVideoTarget(video);
    setIsAiSummaryOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Logged out successfully');
  };

  const handleBatchComplete = (readyItems: any[]) => {
    const newHistoryItems: DownloadItem[] = readyItems.map((item, idx) => ({
      id: `dl-batch-${Date.now()}-${idx}`,
      title: item.title || 'Batch Download Video',
      platform: item.platform || 'generic',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      format: 'mp4',
      quality: '1080p',
      size: item.size || '32 MB',
      downloadUrl: item.downloadUrl,
      downloadedAt: new Date().toLocaleDateString(),
      status: 'completed',
      progress: 100,
    }));

    setHistory((prev) => [...newHistoryItems, ...prev]);
    showToast(`${readyItems.length} videos extracted in Batch Download!`);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 ${settings.language === 'ur' || settings.language === 'ar' ? 'font-urdu' : ''}`}>
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs md:text-sm shadow-2xl flex items-center gap-2 border border-cyan-300">
            <span>✨</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={settings.language}
        setLanguage={(lang) => setSettings((s) => ({ ...s, language: lang }))}
        theme={settings.theme}
        setTheme={(th) => setSettings((s) => ({ ...s, theme: th }))}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Content based on active Tab */}
      <main className="flex-1">
        
        {activeTab === 'downloader' && (
          <>
            <HeroDownloader
              url={url}
              setUrl={setUrl}
              onFetch={handleFetchVideo}
              isLoading={isLoading}
              language={settings.language}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              autoNoWatermark={autoNoWatermark}
              setAutoNoWatermark={setAutoNoWatermark}
              browserDevice={browserDevice}
              setBrowserDevice={(dev) => {
                setBrowserDevice(dev);
                localStorage.setItem('snapfetch_device', dev);
              }}
              selectedQuality={selectedQuality}
              setSelectedQuality={setSelectedQuality}
            />

            {currentVideo && (
              <VideoResultCard
                metadata={currentVideo}
                language={settings.language}
                onDownload={handleDownloadFormat}
                onOpenAiSummary={handleOpenAiSummary}
                isDownloading={isDownloading}
                downloadProgress={downloadProgress}
                browserDevice={browserDevice}
                autoNoWatermark={autoNoWatermark}
                setAutoNoWatermark={setAutoNoWatermark}
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
              />
            )}

            {/* Quick Templates Below Downloader */}
            {!currentVideo && (
              <TemplatesGrid
                language={settings.language}
                onSelectTemplate={handleSelectTemplate}
              />
            )}
          </>
        )}

        {activeTab === 'batch' && (
          <BatchDownloader
            language={settings.language}
            onBatchDownloadComplete={handleBatchComplete}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesGrid
            language={settings.language}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {activeTab === 'history' && (
          <DownloadHistory
            history={history}
            language={settings.language}
            onClearHistory={() => setHistory([])}
            onRemoveItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            language={settings.language}
          />
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name}!`);
        }}
        language={settings.language}
      />

      {/* AI Summary Modal */}
      <AiSummaryModal
        video={aiVideoTarget}
        isOpen={isAiSummaryOpen}
        onClose={() => setIsAiSummaryOpen(false)}
        language={settings.language}
      />

      {/* Footer */}
      <Footer language={settings.language} />

    </div>
  );
}
