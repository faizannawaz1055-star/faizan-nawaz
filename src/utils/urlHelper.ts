import { PlatformType } from '../types';

/**
 * Extracts the single clean video URL from any pasted text block
 * (e.g. TikTok Lite share text, YouTube share description, Instagram messages)
 */
export function extractCleanUrl(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  const trimmed = text.trim();
  
  // Extract all http / https URL patterns
  const urlMatches = trimmed.match(/https?:\/\/[^\s"'<>]+/gi);
  if (!urlMatches || urlMatches.length === 0) {
    return trimmed;
  }

  // Clean trailing punctuation that might get attached (like .,;:!?)
  const cleanedUrls = urlMatches.map(u => u.replace(/[.,;:!?]+$/, ''));

  // 1. Prioritize TikTok video links (vm.tiktok.com, vt.tiktok.com, tiktok.com/@user/video/id)
  const tiktokVideo = cleanedUrls.find(u => 
    /tiktok\.com\/@[^/]+\/video\/\d+/i.test(u) ||
    /vm\.tiktok\.com\/[a-zA-Z0-9_-]+/i.test(u) ||
    /vt\.tiktok\.com\/[a-zA-Z0-9_-]+/i.test(u)
  );
  if (tiktokVideo) return tiktokVideo;

  // 2. Prioritize YouTube video links
  const youtubeVideo = cleanedUrls.find(u => 
    /youtu\.be\/[a-zA-Z0-9_-]+/i.test(u) ||
    /youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/i.test(u) ||
    /youtube\.com\/shorts\/[a-zA-Z0-9_-]+/i.test(u)
  );
  if (youtubeVideo) return youtubeVideo;

  // 3. Prioritize Instagram reel/post links
  const instagramVideo = cleanedUrls.find(u => 
    /instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]+/i.test(u)
  );
  if (instagramVideo) return instagramVideo;

  // 4. Prioritize Facebook video links
  const fbVideo = cleanedUrls.find(u => 
    /facebook\.com\/.*(?:videos|watch|reel)/i.test(u) ||
    /fb\.watch\/[a-zA-Z0-9_-]+/i.test(u)
  );
  if (fbVideo) return fbVideo;

  // 5. Prioritize Twitter/X video links
  const twitterVideo = cleanedUrls.find(u => 
    /(?:twitter\.com|x\.com)\/[^/]+\/status\/\d+/i.test(u)
  );
  if (twitterVideo) return twitterVideo;

  // 6. Filter out app store / marketing links (e.g. tiktoklite promo link)
  const nonPromo = cleanedUrls.find(u => 
    !u.includes('tiktok.com/tiktoklite') && 
    !u.includes('play.google.com') && 
    !u.includes('apps.apple.com')
  );
  if (nonPromo) return nonPromo;

  return cleanedUrls[0];
}

export function detectPlatformFromUrl(url: string): PlatformType {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('tiktok.com') || lower.includes('douyin.com')) return 'tiktok';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'facebook';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('pinterest.com') || lower.includes('pin.it')) return 'pinterest';
  if (lower.includes('vimeo.com')) return 'vimeo';
  return 'generic';
}
