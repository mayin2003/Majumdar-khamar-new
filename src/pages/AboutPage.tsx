import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration, LeafDivider } from '../components/ui/LeafDecoration';
import { CowLogo } from '../components/ui/CowLogo';
import { useSiteContent } from '../context/SiteContentContext';

export const AboutPage: React.FC = () => {
  const { siteContent } = useSiteContent();

  return (
    <PageTransition>
      <div id="about-page-container" className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <LeafDecoration position="top-left" opacity={0.12} />
        <LeafDecoration position="bottom-right" opacity={0.12} />

        <div className="max-w-2xl mx-auto space-y-5 relative z-10 flex flex-col items-center">
          <div className="p-2 rounded-full bg-[#003F2D] shadow-md border-2 border-[#D6A21D]/40">
            <CowLogo size="xl" showBorder={false} />
          </div>

          <LeafDivider text="আমাদের গল্প ও খামার" />
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1a3a2a]">
            আমাদের কথা
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {siteContent.address || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}তে অবস্থিত মজুমদার খামারের সার্বিক পরিচিতি ও লক্ষ্য। {siteContent.tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}।
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
