export type PlatformType = 
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'facebook' 
  | 'twitter' 
  | 'pinterest' 
  | 'vimeo' 
  | 'generic';

export type VideoFormatType = 'mp4' | 'mp3' | 'webm' | 'm4a';

export type BrowserDeviceType = 'mobile_chrome' | 'iphone' | 'pc';

export interface DownloadFormat {
  id: string;
  label: string;
  quality: string;
  format: VideoFormatType;
  resolution?: string;
  bitrate?: string;
  estimatedSize: string;
  isBest?: boolean;
  noWatermark?: boolean;
}

export interface VideoMetadata {
  url: string;
  originalUrl: string;
  title: string;
  author: string;
  authorHandle?: string;
  avatarUrl?: string;
  platform: PlatformType;
  thumbnailUrl: string;
  duration: string;
  views: string;
  likes: string;
  uploadedAt: string;
  formats: DownloadFormat[];
  description?: string;
  aiSummary?: string;
  aiKeyPoints?: string[];
  tags?: string[];
  audioOnlyAvailable?: boolean;
  directVideoUrl?: string;
  directNoWatermarkUrl?: string;
  directAudioUrl?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  platform: PlatformType;
  thumbnail: string;
  format: string;
  quality: string;
  size: string;
  downloadUrl: string;
  downloadedAt: string;
  status: 'completed' | 'failed' | 'downloading';
  progress: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  totalDownloads: number;
  savedStorage: string;
  favoritePlatforms: PlatformType[];
  isPro: boolean;
}

export interface TemplateItem {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  iconName: string;
  badge: string;
  platform: PlatformType;
  category: 'popular' | 'audio' | 'watermark' | 'shorts' | 'batch';
  defaultFormat: {
    format: VideoFormatType;
    quality: string;
    noWatermark: boolean;
  };
}

export type Language = 'en' | 'ur' | 'hi' | 'ar';

export type AppTheme = 'dark' | 'light' | 'cyber' | 'emerald';

export interface AppSettings {
  language: Language;
  theme: AppTheme;
  defaultQuality: string;
  autoNoWatermark: boolean;
  defaultFormat: VideoFormatType;
  autoStartDownload: boolean;
  maxBatchSimultaneous: number;
  mobileOptimization: boolean;
}
