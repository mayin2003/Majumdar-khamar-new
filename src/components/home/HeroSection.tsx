import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle } from 'lucide-react';
import { LeafDecoration } from '../ui/LeafDecoration';
import { useSiteContent } from '../../context/SiteContentContext';

// High-fidelity generated imagery matching the reference
import cowCardImg from '../../assets/images/hero_cow_card_1788279448949.jpg';
import goatCardImg from '../../assets/images/hero_goat_card_1788279467275.jpg';
import poultryCardImg from '../../assets/images/hero_poultry_card_1788279487450.jpg';

export const HeroSection: React.FC = () => {
  const { 
    headline, 
    heroParagraph, 
    location, 
    heroImageCow, 
    heroImageGoat, 
    heroImageBird, 
    whatsappUrl 
  } = useSiteContent();

  const heroWhatsappUrl = whatsappUrl(
    'আসসালামু আলাইকুম, আমি মজুমদার খামার থেকে প্রাণী/পণ্য অর্ডার বা তথ্য জানতে চাচ্ছি।'
  );

  // Animal card definitions matching exact reference angles and z-index hierarchy
  const heroCards = [
    {
      id: 'cow',
      title: 'গরু',
      image: heroImageCow || cowCardImg,
      rotation: -5,
      zIndex: 10,
      link: '/sale-products?category=গরু',
      heightClass: 'h-[300px] xs:h-[350px] sm:h-[430px] lg:h-[450px]',
      icon: (
        <span className="text-sm sm:text-base lg:text-lg leading-none" role="img" aria-label="গরু">
          🐄
        </span>
      )
    },
    {
      id: 'goat',
      title: 'ছাগল',
      image: heroImageGoat || goatCardImg,
      rotation: 0,
      zIndex: 20,
      link: '/sale-products?category=ছাগল',
      heightClass: 'h-[320px] xs:h-[380px] sm:h-[465px] lg:h-[485px]',
      icon: (
        <span className="text-sm sm:text-base lg:text-lg leading-none" role="img" aria-label="ছাগল">
          🐐
        </span>
      )
    },
    {
      id: 'poultry',
      title: 'মুরগি ও হাঁস',
      image: heroImageBird || poultryCardImg,
      rotation: 5,
      zIndex: 12,
      link: '/sale-products?category=মুরগি ও হাঁস',
      heightClass: 'h-[300px] xs:h-[350px] sm:h-[430px] lg:h-[450px]',
      icon: (
        <span className="text-sm sm:text-base lg:text-lg leading-none" role="img" aria-label="মুরগি ও হাঁস">
          🐔
        </span>
      )
    }
  ];

  return (
    <section
      id="hero-section"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#F5F0E3] overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-14 lg:py-16"
    >
      {/* Decorative leaf illustrations in TOP-LEFT, TOP-RIGHT, BOTTOM-LEFT, and BOTTOM-RIGHT corners */}
      <LeafDecoration position="top-left" opacity={0.16} className="-translate-x-8 -translate-y-8" />
      <LeafDecoration position="top-right" opacity={0.18} className="translate-x-8 -translate-y-8" />
      <LeafDecoration position="bottom-left" opacity={0.18} className="-translate-x-8 translate-y-8" />
      <LeafDecoration position="bottom-right" opacity={0.15} className="translate-x-8 translate-y-8" />

      {/* Large thin golden dashed circle outline (#D6A21D) behind the photo cards */}
      <div
        className="absolute right-[2%] lg:right-[8%] top-1/2 -translate-y-1/2 w-[280px] xs:w-[340px] sm:w-[460px] lg:w-[540px] h-[280px] xs:h-[340px] sm:h-[460px] lg:h-[540px] rounded-full border-2 border-dashed border-[#D6A21D]/40 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN (roughly 42–45% / 6 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-6 text-left"
          >
            {/* 1. Small label row: golden/orange bold text with bullet dots and decorative underline */}
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 text-[#C95A25] font-bold text-xs sm:text-base tracking-wider uppercase">
                <span className="relative">
                  খাঁটি
                  {/* Small decorative underline beneath the first portion */}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-1 text-[#C95A25]"
                    viewBox="0 0 40 4"
                    fill="none"
                  >
                    <path d="M1 2.5C12 1 28 1 39 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[#C95A25] text-xs">•</span>
                <span>স্বাস্থ্যকর</span>
                <span className="text-[#C95A25] text-xs">•</span>
                <span>স্থানীয়</span>
              </div>
            </div>

            {/* 2. Main Heading: 3 separate lines or formatted headline, extra bold, dark forest green (#003F2D) */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-black text-[#003F2D] leading-[1.18] sm:leading-[1.16] tracking-tight whitespace-pre-line">
              {headline || `মজুমদার খামার,\nখাঁটি প্রাণী,\nউন্নত আগামী`}
            </h1>

            {/* 3. Narrative Paragraph in dark gray-green */}
            <p className="text-sm xs:text-base sm:text-lg text-[#1f3a2c] leading-relaxed max-w-xl font-normal whitespace-pre-line">
              {heroParagraph || `গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য।\nতাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন —\nসরাসরি আমাদের খামার থেকে আপনার বাড়িতে।`}
            </p>

            {/* 4. Location row: golden/orange location icon + dark green text */}
            <div className="flex items-center gap-2 text-xs sm:text-base text-[#003F2D] font-semibold pt-0.5">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#C95A25] shrink-0" />
              <span>{location || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}</span>
            </div>

            {/* 5. Buttons Row */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              {/* Button 1: Solid Dark Green Pill WhatsApp CTA */}
              <motion.a
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-order-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="cta-pulse inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#003F2D] hover:bg-[#002e21] active:bg-[#002016] text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group min-h-[48px] text-center"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-current shrink-0" />
                <span>হোয়াটসঅ্যাপ অর্ডার করুন</span>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </motion.a>

              {/* Button 2: Transparent/Cream background with dark green border */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link
                  to="/about"
                  id="hero-about-story-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-transparent hover:bg-white/70 active:bg-white/90 text-[#003F2D] font-bold text-sm sm:text-base lg:text-lg border-2 border-[#003F2D] shadow-xs hover:shadow-sm transition-all min-h-[48px] text-center"
                >
                  <span>আমাদের গল্প</span>
                  <span>→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (Photo Cards composition) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end relative w-full overflow-visible py-2"
          >
            {/* Subtle floating/bobbing idle animation: translateY ±4px over 5.5s */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative flex items-center justify-center w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[530px] h-[340px] xs:h-[400px] sm:h-[490px] lg:h-[510px]"
            >
              {heroCards.map((card, index) => {
                // Stack fan positions matching reference
                const positionStyles = [
                  'left-0 xs:left-2 -translate-y-2',
                  'left-1/2 -translate-x-1/2 translate-y-0',
                  'right-0 xs:right-2 translate-y-2'
                ];

                return (
                  <motion.div
                    key={card.id}
                    className={`absolute ${positionStyles[index]} w-32 xs:w-40 sm:w-56 ${card.heightClass} rounded-2xl sm:rounded-[20px] bg-white p-1.5 xs:p-2 sm:p-2.5 shadow-2xl border border-black/5 flex flex-col justify-between cursor-pointer`}
                    style={{
                      zIndex: card.zIndex,
                      rotate: `${card.rotation}deg`
                    }}
                    whileHover={{
                      rotate: 0,
                      y: -8,
                      scale: 1.05,
                      zIndex: 35,
                      boxShadow: '0 25px 35px -10px rgba(0, 63, 45, 0.3)',
                      transition: { type: 'spring', stiffness: 320, damping: 20 }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={card.link} className="w-full h-full flex flex-col justify-between">
                      {/* Photo fills ~82% with inner rounded corners */}
                      <div className="w-full h-[78%] xs:h-[82%] rounded-xl overflow-hidden bg-[#e8e0d0] relative">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Integrated Dark-Green rounded pill bar with icon + label */}
                      <div className="mt-1 xs:mt-2 w-full py-1.5 xs:py-2 sm:py-2.5 px-2 xs:px-3 rounded-lg sm:rounded-xl bg-[#003F2D] text-white text-center font-black text-xs xs:text-sm sm:text-base flex items-center justify-center gap-1.5 xs:gap-2 shadow-xs">
                        {card.icon}
                        <span>{card.title}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


