import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteHomeContent, defaultHomeContent } from '../types/siteContent';
import { 
  subscribeToSiteContent, 
  updateSiteContent as updateSiteContentService,
  getSiteContent as fetchSiteContent 
} from '../services/siteContentService';

interface SiteContentContextType {
  logoUrl?: string;
  heroImageCow?: string;
  heroImageGoat?: string;
  heroImageBird?: string;
  farmPhotoUrl?: string;
  headline: string;
  tagline: string;
  heroParagraph: string;
  location: string;
  farmSectionHeading: string;
  farmSectionParagraph: string;
  whatsappNumber: string;
  address: string;
  phone?: string;
  siteContent: SiteHomeContent;
  loading: boolean;
  updateSiteContent: (data: Partial<SiteHomeContent>) => Promise<void>;
  whatsappUrl: (message?: string) => string;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteHomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToSiteContent((freshData) => {
      const merged: SiteHomeContent = {
        ...defaultHomeContent,
        ...freshData,
        heroImageCow: freshData.heroImageCow || freshData.heroCowImg || defaultHomeContent.heroImageCow,
        heroImageGoat: freshData.heroImageGoat || freshData.heroGoatImg || defaultHomeContent.heroImageGoat,
        heroImageBird: freshData.heroImageBird || freshData.heroPoultryImg || defaultHomeContent.heroImageBird,
        heroCowImg: freshData.heroImageCow || freshData.heroCowImg || defaultHomeContent.heroCowImg,
        heroGoatImg: freshData.heroImageGoat || freshData.heroGoatImg || defaultHomeContent.heroGoatImg,
        heroPoultryImg: freshData.heroImageBird || freshData.heroPoultryImg || defaultHomeContent.heroPoultryImg,
        location: freshData.location || freshData.locationText || defaultHomeContent.location,
        locationText: freshData.location || freshData.locationText || defaultHomeContent.locationText,
        farmSectionHeading: freshData.farmSectionHeading || freshData.farmPhotoHeading || defaultHomeContent.farmSectionHeading,
        farmPhotoHeading: freshData.farmSectionHeading || freshData.farmPhotoHeading || defaultHomeContent.farmPhotoHeading,
        farmSectionParagraph: freshData.farmSectionParagraph || freshData.farmPhotoParagraph || defaultHomeContent.farmSectionParagraph,
        farmPhotoParagraph: freshData.farmSectionParagraph || freshData.farmPhotoParagraph || defaultHomeContent.farmPhotoParagraph,
      };
      setSiteContent(merged);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateSiteContent = async (data: Partial<SiteHomeContent>) => {
    const normalizedData: Partial<SiteHomeContent> = {
      ...data,
      heroImageCow: data.heroImageCow ?? data.heroCowImg ?? siteContent.heroImageCow,
      heroCowImg: data.heroImageCow ?? data.heroCowImg ?? siteContent.heroCowImg,
      heroImageGoat: data.heroImageGoat ?? data.heroGoatImg ?? siteContent.heroImageGoat,
      heroGoatImg: data.heroImageGoat ?? data.heroGoatImg ?? siteContent.heroGoatImg,
      heroImageBird: data.heroImageBird ?? data.heroPoultryImg ?? siteContent.heroImageBird,
      heroPoultryImg: data.heroImageBird ?? data.heroPoultryImg ?? siteContent.heroPoultryImg,
      location: data.location ?? data.locationText ?? siteContent.location,
      locationText: data.location ?? data.locationText ?? siteContent.locationText,
      farmSectionHeading: data.farmSectionHeading ?? data.farmPhotoHeading ?? siteContent.farmSectionHeading,
      farmPhotoHeading: data.farmSectionHeading ?? data.farmPhotoHeading ?? siteContent.farmPhotoHeading,
      farmSectionParagraph: data.farmSectionParagraph ?? data.farmPhotoParagraph ?? siteContent.farmSectionParagraph,
      farmPhotoParagraph: data.farmSectionParagraph ?? data.farmPhotoParagraph ?? siteContent.farmPhotoParagraph,
    };

    await updateSiteContentService(normalizedData);
  };

  const whatsappUrl = (message?: string) => {
    const rawNumber = siteContent.whatsappNumber || '8801838752049';
    const digits = rawNumber.replace(/\D/g, '');
    const phoneFormatted = digits.startsWith('0') ? `88${digits}` : digits.startsWith('88') ? digits : `880${digits}`;
    const defaultMsg = message || 'আসসালামু আলাইকুম, আমি মজুমদার খামার সম্পর্কে জানতে চাই।';
    return `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(defaultMsg)}`;
  };

  return (
    <SiteContentContext.Provider
      value={{
        logoUrl: siteContent.logoUrl,
        heroImageCow: siteContent.heroImageCow || siteContent.heroCowImg,
        heroImageGoat: siteContent.heroImageGoat || siteContent.heroGoatImg,
        heroImageBird: siteContent.heroImageBird || siteContent.heroPoultryImg,
        farmPhotoUrl: siteContent.farmPhotoUrl,
        headline: siteContent.headline,
        tagline: siteContent.tagline,
        heroParagraph: siteContent.heroParagraph,
        location: siteContent.location || siteContent.locationText || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী',
        farmSectionHeading: siteContent.farmSectionHeading || siteContent.farmPhotoHeading || 'আমাদের খামার থেকে,\nআপনার টেবিলে',
        farmSectionParagraph: siteContent.farmSectionParagraph || siteContent.farmPhotoParagraph || 'আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।',
        whatsappNumber: siteContent.whatsappNumber,
        address: siteContent.address,
        phone: siteContent.phone,
        siteContent,
        loading,
        updateSiteContent,
        whatsappUrl
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
