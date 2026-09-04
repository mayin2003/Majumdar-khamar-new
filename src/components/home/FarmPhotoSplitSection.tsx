import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HandDrawnUnderline, LeafDecoration } from '../ui/LeafDecoration';
import { useSiteContent } from '../../context/SiteContentContext';

// User's authentic real khamar photo
import farmShedPhoto from '../../assets/images/real_khamar_user_1788280036119.jpg';

export const FarmPhotoSplitSection: React.FC = () => {
  const { farmPhotoUrl, farmSectionHeading, farmSectionParagraph } = useSiteContent();
  const displayPhoto = farmPhotoUrl || farmShedPhoto;

  return (
    <section id="farm-split-story-section" className="relative py-12 sm:py-16 lg:py-24 bg-[#F5F0E3] overflow-hidden">
      <LeafDecoration position="bottom-left" opacity={0.16} className="-translate-x-8 translate-y-6" />
      <LeafDecoration position="top-right" opacity={0.12} className="translate-x-8 -translate-y-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN (~42% / 5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-4 sm:space-y-6 text-left"
          >
            {/* Heading in dark forest green (#003F2D), bold, 2 lines + small decorative leaf icon */}
            <div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[44px] font-black text-[#003F2D] leading-[1.2] tracking-tight whitespace-pre-line">
                {farmSectionHeading || (
                  <>
                    আমাদের খামার থেকে,<br />
                    <span className="inline-flex items-center gap-2">
                      <span>আপনার টেবিলে</span>
                      {/* Decorative olive leaf icon */}
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-[#7d8c58] inline-block -rotate-12">
                        <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                      </svg>
                    </span>
                  </>
                )}
              </h2>

              {/* Hand-drawn squiggly orange underline */}
              <div className="mt-1.5 sm:mt-2">
                <HandDrawnUnderline />
              </div>
            </div>

            {/* Narrative description */}
            <p className="text-sm xs:text-base sm:text-lg text-[#1f3a2c] leading-relaxed font-normal pt-1 whitespace-pre-line">
              {farmSectionParagraph || 'আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।'}
            </p>

            {/* Pill button linking to /about */}
            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto inline-block">
                <Link
                  to="/about"
                  id="split-about-link-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-[#003F2D] hover:bg-[#002e21] active:bg-[#002016] text-white font-bold text-sm sm:text-base lg:text-lg shadow-md hover:shadow-lg transition-all min-h-[48px] text-center"
                >
                  <span>আমাদের সম্পর্কে জানুন</span>
                  <span>→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (~58% / 7 cols on lg) - Realistic Farm visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 relative w-full"
          >
            <div className="w-full h-[240px] xs:h-[300px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl relative border border-black/10">
              <img
                src={displayPhoto}
                alt="মজুমদার খামার প্রাকৃতিক শেড ও পরিবেশ - উত্তর রাজেশপুর, পরশুরাম, ফেনী"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Subtle sunlight vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

