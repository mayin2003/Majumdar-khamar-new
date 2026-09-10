import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SiteHomeContent, defaultHomeContent } from '../types/siteContent';

/**
 * Maps a Supabase row (snake_case) to TypeScript SiteHomeContent (camelCase)
 */
export function mapDbToSiteContent(row: any): SiteHomeContent {
  const heroCow = row.hero_image_cow || row.heroCowImg || defaultHomeContent.heroImageCow;
  const heroGoat = row.hero_image_goat || row.heroGoatImg || defaultHomeContent.heroImageGoat;
  const heroBird = row.hero_image_bird || row.heroPoultryImg || defaultHomeContent.heroImageBird;
  const loc = row.location || defaultHomeContent.location;
  const farmHeading = row.farm_section_heading || defaultHomeContent.farmSectionHeading;
  const farmPara = row.farm_section_paragraph || defaultHomeContent.farmSectionParagraph;

  return {
    id: 'home',
    logoUrl: row.logo_url ?? defaultHomeContent.logoUrl,
    heroImageCow: heroCow,
    heroImageGoat: heroGoat,
    heroImageBird: heroBird,
    heroCowImg: heroCow,
    heroGoatImg: heroGoat,
    heroPoultryImg: heroBird,
    farmPhotoUrl: row.farm_photo_url ?? defaultHomeContent.farmPhotoUrl,
    headline: row.headline || defaultHomeContent.headline,
    tagline: row.tagline || defaultHomeContent.tagline,
    heroParagraph: row.hero_paragraph || defaultHomeContent.heroParagraph,
    location: loc,
    locationText: loc,
    farmSectionHeading: farmHeading,
    farmPhotoHeading: farmHeading,
    farmSectionParagraph: farmPara,
    farmPhotoParagraph: farmPara,
    whatsappNumber: row.whatsapp_number || defaultHomeContent.whatsappNumber,
    address: row.address || defaultHomeContent.address,
    phone: row.phone || defaultHomeContent.phone,
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Maps TypeScript SiteHomeContent (camelCase) to Supabase row (snake_case)
 */
export function mapSiteContentToDb(data: Partial<SiteHomeContent>): Record<string, any> {
  const dbRecord: Record<string, any> = { id: 'home' };

  if (data.logoUrl !== undefined) dbRecord.logo_url = data.logoUrl;
  if (data.heroImageCow !== undefined || data.heroCowImg !== undefined) {
    dbRecord.hero_image_cow = data.heroImageCow ?? data.heroCowImg;
  }
  if (data.heroImageGoat !== undefined || data.heroGoatImg !== undefined) {
    dbRecord.hero_image_goat = data.heroImageGoat ?? data.heroGoatImg;
  }
  if (data.heroImageBird !== undefined || data.heroPoultryImg !== undefined) {
    dbRecord.hero_image_bird = data.heroImageBird ?? data.heroPoultryImg;
  }
  if (data.farmPhotoUrl !== undefined) dbRecord.farm_photo_url = data.farmPhotoUrl;
  if (data.headline !== undefined) dbRecord.headline = data.headline;
  if (data.tagline !== undefined) dbRecord.tagline = data.tagline;
  if (data.heroParagraph !== undefined) dbRecord.hero_paragraph = data.heroParagraph;
  if (data.location !== undefined || data.locationText !== undefined) {
    dbRecord.location = data.location ?? data.locationText;
  }
  if (data.farmSectionHeading !== undefined || data.farmPhotoHeading !== undefined) {
    dbRecord.farm_section_heading = data.farmSectionHeading ?? data.farmPhotoHeading;
  }
  if (data.farmSectionParagraph !== undefined || data.farmPhotoParagraph !== undefined) {
    dbRecord.farm_section_paragraph = data.farmSectionParagraph ?? data.farmPhotoParagraph;
  }
  if (data.whatsappNumber !== undefined) {
    dbRecord.whatsapp_number = data.whatsappNumber.replace(/\D/g, '');
  }
  if (data.address !== undefined) dbRecord.address = data.address;
  if (data.phone !== undefined) dbRecord.phone = data.phone;

  dbRecord.updated_at = new Date().toISOString();
  return dbRecord;
}

let cachedSiteContent: SiteHomeContent = { ...defaultHomeContent };
const listeners = new Set<(data: SiteHomeContent) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener(cachedSiteContent));
}

/**
 * Fetch home page content from Supabase
 */
export async function getSiteContent(): Promise<SiteHomeContent> {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Live site content sync paused: Supabase is not configured.');
    return cachedSiteContent;
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'home')
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Live site content fetch notice (using cache):', error.message || error);
      return cachedSiteContent;
    }

    if (data) {
      cachedSiteContent = mapDbToSiteContent(data);
      notifyListeners();
    }
    return cachedSiteContent;
  } catch (err: any) {
    console.warn('[Supabase] Live site content fetch notice (fallback to cache):', err?.message || err);
    return cachedSiteContent;
  }
}

/**
 * Update home page content in Supabase
 */
export async function updateSiteContent(data: Partial<SiteHomeContent>): Promise<SiteHomeContent> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Site content update aborted: Supabase is not configured.');
    cachedSiteContent = {
      ...cachedSiteContent,
      ...data,
      updatedAt: new Date().toISOString()
    };
    notifyListeners();
    return cachedSiteContent;
  }

  const dbRow = mapSiteContentToDb(data);

  let { data: updated, error } = await supabase
    .from('site_content')
    .upsert(dbRow)
    .select('*')
    .single();

  if (error) {
    console.error('[Supabase] Failed to update site content:', error);
    throw new Error(`সাইট কনটেন্ট সংরক্ষণ করা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  cachedSiteContent = mapDbToSiteContent(updated);
  notifyListeners();
  return cachedSiteContent;
}

/**
 * Live synchronization for Site Content
 * Uses initial REST fetch + automated background sync (interval & window focus)
 * to keep data fresh across tabs and devices reliably without fragile WebSocket 1006 closures.
 */
export function subscribeToSiteContent(callback: (data: SiteHomeContent) => void): () => void {
  listeners.add(callback);

  // Initial trigger with currently cached content
  callback({ ...cachedSiteContent });

  // Initial fetch from Supabase
  getSiteContent();

  // Background polling interval (every 30 seconds when tab is active)
  const intervalId = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      getSiteContent();
    }
  }, 30000);

  // Refetch when tab becomes visible or gains focus
  const handleVisibilityOrFocus = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      getSiteContent();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
  }

  return () => {
    listeners.delete(callback);
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    }
  };
}
