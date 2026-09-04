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
    return cachedSiteContent;
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'home')
      .maybeSingle();

    if (error) {
      console.error('Error fetching site_content from Supabase:', error);
      return cachedSiteContent;
    }

    if (data) {
      cachedSiteContent = mapDbToSiteContent(data);
      notifyListeners();
    }
    return cachedSiteContent;
  } catch (err) {
    console.error('Supabase site_content fetch exception:', err);
    return cachedSiteContent;
  }
}

/**
 * Update home page content in Supabase
 */
export async function updateSiteContent(data: Partial<SiteHomeContent>): Promise<SiteHomeContent> {
  if (!isSupabaseConfigured()) {
    cachedSiteContent = {
      ...cachedSiteContent,
      ...data,
      updatedAt: new Date().toISOString()
    };
    notifyListeners();
    return cachedSiteContent;
  }

  const dbRow = mapSiteContentToDb(data);

  const { data: updated, error } = await supabase
    .from('site_content')
    .upsert(dbRow)
    .select('*')
    .single();

  if (error) {
    console.error('Error upserting site_content in Supabase:', error);
    throw new Error(`সাইট কনটেন্ট সংরক্ষণ করা যায়নি: ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  cachedSiteContent = mapDbToSiteContent(updated);
  notifyListeners();
  return cachedSiteContent;
}

/**
 * Real-time subscription to site_content changes via Supabase Realtime
 */
export function subscribeToSiteContent(callback: (data: SiteHomeContent) => void): () => void {
  listeners.add(callback);

  // Initial trigger
  callback(cachedSiteContent);

  // Initial fetch from Supabase
  getSiteContent();

  let channel: any = null;

  if (isSupabaseConfigured()) {
    channel = supabase
      .channel('public:site_content')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content' },
        () => {
          getSiteContent();
        }
      )
      .subscribe();
  }

  return () => {
    listeners.delete(callback);
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}
