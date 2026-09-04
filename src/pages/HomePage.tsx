import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { HeroSection } from '../components/home/HeroSection';
import { FeatureStrip } from '../components/home/FeatureStrip';
import { FarmPhotoSplitSection } from '../components/home/FarmPhotoSplitSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <div id="home-page-root" className="w-full flex flex-col">
        {/* SECTION 1 — HERO */}
        <HeroSection />

        {/* SECTION 2 — FEATURE STRIP */}
        <FeatureStrip />

        {/* SECTION 3 — FARM PHOTO SPLIT SECTION */}
        <FarmPhotoSplitSection />

        {/* SECTION 4 — WHY CHOOSE US */}
        <WhyChooseUsSection />
      </div>
    </PageTransition>
  );
};

