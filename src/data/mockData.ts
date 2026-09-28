import { TemplateItem, PlatformType } from '../types';

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  badge: string;
  sampleUrl: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    color: '#FF0000',
    bgGradient: 'from-red-600 to-rose-700',
    badge: '4K & MP3',
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Video',
    color: '#00F2FE',
    bgGradient: 'from-cyan-500 to-pink-600',
    badge: 'No Watermark',
    sampleUrl: 'https://www.tiktok.com/@creative_creator/video/738291048291'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    color: '#E1306C',
    bgGradient: 'from-purple-600 via-pink-500 to-amber-400',
    badge: 'Reels & Audio',
    sampleUrl: 'https://www.instagram.com/reel/C3x9_12M_3Y/'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    color: '#1877F2',
    bgGradient: 'from-blue-600 to-indigo-700',
    badge: 'Full HD',
    sampleUrl: 'https://www.facebook.com/watch/?v=1092837482918'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'Twitter',
    color: '#1DA1F2',
    bgGradient: 'from-slate-700 to-slate-900',
    badge: 'Fast MP4',
    sampleUrl: 'https://twitter.com/spacex/status/17482910482'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'Pin',
    color: '#E60023',
    bgGradient: 'from-red-700 to-red-900',
    badge: 'HD Video',
    sampleUrl: 'https://www.pinterest.com/pin/928301982301/'
  }
];

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'tiktok-no-wm',
    title: 'TikTok Watermark Remover',
    titleUrdu: 'ٹک ٹاک واٹر مارک ریموور',
    description: 'Download any TikTok video in original 1080p HD completely clean without logo or username overlays.',
    descriptionUrdu: 'کسی بھی ٹک ٹاک ویڈیو کو لوگو یا واٹر مارک کے بغیر اوریجنل 1080p ایچ ڈی میں ڈاؤن لوڈ کریں۔',
    iconName: 'Sparkles',
    badge: 'Most Popular',
    platform: 'tiktok',
    category: 'watermark',
    defaultFormat: {
      format: 'mp4',
      quality: '1080p',
      noWatermark: true
    }
  },
  {
    id: 'youtube-4k-pro',
    title: 'YouTube 4K Ultra HD Grabber',
    titleUrdu: 'یوٹیوب 4K الٹرا ایچ ڈی ڈاؤن لوڈر',
    description: 'Extract highest resolution 60fps 4K video streams with high-dynamic range color profiles.',
    descriptionUrdu: 'بہترین رزلٹ 60fps اور 4K کوالٹی کے ساتھ یوٹیوب ویڈیوز ڈاؤن لوڈ کریں۔',
    iconName: 'Tv',
    badge: '4K Ultra HD',
    platform: 'youtube',
    category: 'popular',
    defaultFormat: {
      format: 'mp4',
      quality: '4k',
      noWatermark: false
    }
  },
  {
    id: 'podcast-mp3-extractor',
    title: '320kbps Studio MP3 Extractor',
    titleUrdu: '320kbps اسٹوڈیو آڈیو ایکسٹریکٹر',
    description: 'Convert music videos, podcast shows, and lectures into lossy-free studio quality 320kbps MP3 audio files.',
    descriptionUrdu: 'موسیقی اور پوڈ کاسٹ شو کو 320kbps ایچ ڈی ایم پی تھری آڈیو میں تبدیل کر کے ڈاؤن لوڈ کریں۔',
    iconName: 'Music',
    badge: 'High Bitrate',
    platform: 'youtube',
    category: 'audio',
    defaultFormat: {
      format: 'mp3',
      quality: 'mp3_320',
      noWatermark: false
    }
  },
  {
    id: 'insta-reels-saver',
    title: 'Instagram Reels & Stories Saver',
    titleUrdu: 'انسٹاگرام ریلز اور اسٹوریز سیور',
    description: 'Save viral Reels, carousels, and stories directly to your phone gallery or desktop folder.',
    descriptionUrdu: 'وائرل ریلز اور انسٹاگرام ویڈیوز ڈائریکٹ اپنے موبائل کی گیلری میں محفوظ کریں۔',
    iconName: 'Instagram',
    badge: 'Viral Trends',
    platform: 'instagram',
    category: 'shorts',
    defaultFormat: {
      format: 'mp4',
      quality: '1080p',
      noWatermark: true
    }
  },
  {
    id: 'batch-playlist-downloader',
    title: 'Multi-Link Batch Extraction Tool',
    titleUrdu: 'بلک اور ملٹی لنک ڈاؤن لوڈ ٹول',
    description: 'Paste up to 10 URLs simultaneously to extract and queue downloads all in one click.',
    descriptionUrdu: 'ایک ساتھ 10 تک لنکس پیسٹ کریں اور تمام ویڈیوز ایک ہی کلک میں ڈاؤن لوڈ کریں۔',
    iconName: 'Layers',
    badge: 'Bulk Saver',
    platform: 'generic',
    category: 'batch',
    defaultFormat: {
      format: 'mp4',
      quality: '1080p',
      noWatermark: true
    }
  }
];

export const SAMPLE_VIDEOS: Record<string, any> = {
  youtube: {
    title: 'Mind-Blowing 4K Nature & Ocean Wildlife Odyssey (HDR 60FPS)',
    author: 'Nature Cinema HD',
    authorHandle: '@NatureCinemaHD',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    platform: 'youtube',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    duration: '08:42',
    views: '2.8M views',
    likes: '142K likes',
    uploadedAt: '3 days ago',
    description: 'Explore the uncharted underwater depths and oceanic vibrant coral reefs captured in stunning native 4K UHD 60FPS.',
    formats: [
      { id: 'f-4k', label: 'MP4 - 4K Ultra HD (2160p)', quality: '4K 2160p', format: 'mp4', resolution: '3840x2160', estimatedSize: '184.5 MB', isBest: true },
      { id: 'f-1080p', label: 'MP4 - Full HD (1080p)', quality: '1080p Full HD', format: 'mp4', resolution: '1920x1080', estimatedSize: '48.2 MB' },
      { id: 'f-720p', label: 'MP4 - HD (720p)', quality: '720p HD', format: 'mp4', resolution: '1280x720', estimatedSize: '22.1 MB' },
      { id: 'f-480p', label: 'MP4 - SD (480p)', quality: '480p', format: 'mp4', resolution: '854x480', estimatedSize: '11.4 MB' },
      { id: 'f-mp3-320', label: 'MP3 Audio - Studio 320kbps', quality: '320kbps HQ', format: 'mp3', bitrate: '320kbps', estimatedSize: '12.8 MB' },
      { id: 'f-mp3-192', label: 'MP3 Audio - Standard 192kbps', quality: '192kbps', format: 'mp3', bitrate: '192kbps', estimatedSize: '7.6 MB' }
    ],
    aiSummary: 'This video explores underwater coral reefs, deep marine ocean wildlife, and colorful bioluminescent jellyfish off the coast of Australia.',
    aiKeyPoints: [
      'Captured in natural 4K HDR 60fps native resolution',
      'Features rare deep ocean humpback whale call recordings',
      'Includes original relaxing background ambient soundtrack'
    ],
    tags: ['Nature', '4K Video', 'Ocean', 'Wildlife', 'Relaxing', 'Deep Sea']
  },
  tiktok: {
    title: 'Top 5 Tech Hacks You Wish You Knew Earlier 🚀 #tech #hacks #trending',
    author: 'TechTipsDaily',
    authorHandle: '@techtipsdaily',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    duration: '00:58',
    views: '8.4M views',
    likes: '912K likes',
    uploadedAt: 'Yesterday',
    description: 'Transform your daily workflow with these 5 mind-blowing productivity smartphone tricks!',
    formats: [
      { id: 'f-tt-hd-nowm', label: 'MP4 - HD No Watermark (Clean)', quality: '1080p HD', format: 'mp4', estimatedSize: '14.2 MB', noWatermark: true, isBest: true },
      { id: 'f-tt-hd-wm', label: 'MP4 - Original with Watermark', quality: '720p', format: 'mp4', estimatedSize: '12.8 MB', noWatermark: false },
      { id: 'f-tt-mp3', label: 'MP3 Audio - Viral Soundtrack', quality: '320kbps', format: 'mp3', estimatedSize: '2.4 MB' }
    ],
    aiSummary: 'A fast-paced 58-second video presenting 5 smartphone productivity tricks for iOS and Android.',
    aiKeyPoints: [
      'Quick shortcut hacks for secret gesture controls',
      'How to hide background apps instantly',
      'Battery life extension settings toggle'
    ],
    tags: ['TikTok', 'TechHacks', 'Productivity', 'Viral', 'NoWatermark']
  },
  instagram: {
    title: 'Minimalist Tokyo Coffee Shop Vlog & Espresso Extraction ☕✨',
    author: 'TokyoAesthetic',
    authorHandle: '@tokyo_aesthetic',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    platform: 'instagram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    duration: '01:30',
    views: '1.2M views',
    likes: '88K likes',
    uploadedAt: '5 hours ago',
    description: 'Rainy morning coffee routine in Shibuya Tokyo. Acoustic lo-fi background sound.',
    formats: [
      { id: 'f-ig-1080p', label: 'MP4 - HD 1080p Reel', quality: '1080p HD', format: 'mp4', estimatedSize: '28.6 MB', isBest: true },
      { id: 'f-ig-720p', label: 'MP4 - Standard Reel', quality: '720p', format: 'mp4', estimatedSize: '15.4 MB' },
      { id: 'f-ig-audio', label: 'MP3 - Original Lo-Fi Audio', quality: '320kbps', format: 'mp3', estimatedSize: '3.6 MB' }
    ],
    aiSummary: 'A relaxing aesthetic Reel capturing a morning artisanal coffee brewing session in Tokyo with soothing lo-fi music.',
    aiKeyPoints: [
      'Artisanal espresso pour-over technique showcased',
      'Soothing ambient Shibuya rain audio track',
      'High contrast cinematic color grading'
    ],
    tags: ['Instagram', 'Reels', 'Tokyo', 'Coffee', 'LoFi', 'Aesthetic']
  }
};
