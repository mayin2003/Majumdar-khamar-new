import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ShoppingCart, 
  ArrowRight,
  Warehouse,
  Sparkles
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

// Bundled reference imagery
import cowCardImg from '../../assets/images/hero_cow_card_1788279448949.jpg';
import goatCardImg from '../../assets/images/hero_goat_card_1788279467275.jpg';
import poultryCardImg from '../../assets/images/hero_poultry_card_1788279487450.jpg';

export const HeroSection: React.FC = () => {
  const { 
    headline, 
    heroParagraph, 
    heroImageCow, 
    heroImageGoat, 
    heroImageBird,
    heroBgUrl,
    hero_bg_url
  } = useSiteContent();

  const activeHeroBg = heroBgUrl || hero_bg_url;
  const [bgLoaded, setBgLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // 3 Tilted Card definitions matching exact angles (-4°, +3°, +8°) and info category routes
  const tiltedCards = [
    {
      id: 'cow',
      title: 'গরু',
      category: 'গরু',
      image: heroImageCow || cowCardImg,
      rotation: -4,
      zIndex: 10,
      link: '/products/গরু',
      heightClass: 'h-[290px] xs:h-[340px] sm:h-[410px] lg:h-[440px]',
      icon: '🐄'
    },
    {
      id: 'goat',
      title: 'ছাগল',
      category: 'ছাগল',
      image: heroImageGoat || goatCardImg,
      rotation: 3,
      zIndex: 20,
      link: '/products/ছাগল',
      heightClass: 'h-[310px] xs:h-[365px] sm:h-[435px] lg:h-[465px]',
      icon: '🐐'
    },
    {
      id: 'poultry',
      title: 'মুরগি ও হাঁস',
      category: 'মুরগি ও হাঁস',
      image: heroImageBird || poultryCardImg,
      rotation: 8,
      zIndex: 15,
      link: '/products/মুরগি ও হাঁস',
      heightClass: 'h-[290px] xs:h-[340px] sm:h-[410px] lg:h-[440px]',
      icon: '🐔'
    }
  ];

  // Parse 3-line headline
  const headlineLines = (headline || 'মজুমদার খামার,\nখাঁটি প্রাণী,\nউন্নত আগামী').split('\n');
  const line1 = headlineLines[0] || 'মজুমদার খামার,';
  const line2 = headlineLines[1] || 'খাঁটি প্রাণী,';
  const line3 = headlineLines[2] || 'উন্নত আগামী';

  // 4 Feature items
  const heroFeatures = [
    {
      id: 'safe',
      icon: <ShieldCheck className="w-5 h-5 text-[#14803c]" />,
      line1: 'সম্পূর্ণ',
      line2: 'নিরাপদ'
    },
    {
      id: 'diet',
      icon: <Leaf className="w-5 h-5 text-[#14803c]" />,
      line1: 'প্রাকৃতিক',
      line2: 'খাদ্যাভ্যাস'
    },
    {
      id: 'delivery',
      icon: <Truck className="w-5 h-5 text-[#14803c]" />,
      line1: 'সরাসরি বাড়ি',
      line2: 'পৌঁছে'
    },
    {
      id: 'trust',
      icon: <Heart className="w-5 h-5 text-[#14803c]" />,
      line1: 'বিশ্বাসই',
      line2: 'আমাদের শক্তি'
    }
  ];

  // 4 Bottom band stats
  const bottomStats = [
    {
      id: 'experience',
      icon: <Warehouse className="w-6 h-6 sm:w-7 sm:h-7 text-[#f2b705] shrink-0" />,
      number: '১০+',
      label: 'বছরের অভিজ্ঞতা'
    },
    {
      id: 'natural_feed',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#f2b705] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      number: '১০০%',
      label: 'প্রাকৃতিক খাবার'
    },
    {
      id: 'satisfied_clients',
      icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#f2b705] shrink-0" />,
      number: 'হাজারো',
      label: 'সন্তুষ্ট গ্রাহক'
    },
    {
      id: 'fast_delivery',
      icon: <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-[#f2b705] shrink-0" />,
      number: 'দ্রুত',
      label: 'ডেলিভারি সেবা'
    }
  ];

  return (
    <section
      id="hero-section"
      className="relative isolate overflow-hidden pt-6 sm:pt-10 lg:pt-14 pb-0 bg-[#f8f7e6]"
    >
      {/* ========================================================================= */}
      {/* FULL-WIDTH HERO BACKGROUND: Uploaded photo or soft cream gradient fallback */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10 bg-[#f8f7e6]"
        aria-hidden="true"
      >
        {activeHeroBg ? (
          <motion.img
            src={activeHeroBg}
            alt=""
            fetchPriority="high"
            decoding="async"
            loading="eager"
            onLoad={() => setBgLoaded(true)}
            animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.04, 1] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`w-full h-full object-cover object-center lg:object-bottom will-change-transform transition-opacity duration-500 ${
              bgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#f8f7e6] via-[#f5f3dc] to-[#f8f7e6]" />
        )}

        {/* Readability Overlay — Desktop: Left-side horizontal gradient from cream rgba(248,247,230,0.85) to transparent at ~60% */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(to right, rgba(248,247,230,0.88) 0%, rgba(248,247,230,0.85) 40%, rgba(248,247,230,0.35) 52%, rgba(248,247,230,0) 60%)'
          }}
        />

        {/* Readability Overlay — Mobile: Stronger cream overlay (~0.75 across top & text area) */}
        <div
          className="absolute inset-0 pointer-events-none lg:hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgba(248,247,230,0.85) 0%, rgba(248,247,230,0.78) 55%, rgba(248,247,230,0.4) 85%, rgba(248,247,230,0.15) 100%)'
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Eyebrow, Headline, Paragraph, Features, CTA  */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 text-left"
          >
            {/* 1. Small Eyebrow Line: Leaf icon + "দেশি জাত • নিরাপদ • স্বাস্থ্যসম্মত" + thin line */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold tracking-wide">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14803c]/12 text-[#0b3d2b] border border-[#14803c]/20">
                <Leaf className="w-3.5 h-3.5 text-[#14803c] fill-current" />
                <span>দেশি জাত • নিরাপদ • স্বাস্থ্যসম্মত</span>
              </div>
              <span className="h-[2px] w-12 sm:w-20 bg-[#14803c]/35 rounded-full" />
            </div>

            {/* 2. Huge Dark-Green Headline in 3 lines with leaf icons */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-black font-headline text-[#0b3d2b] leading-[1.12] tracking-tight">
              <span className="block">{line1}</span>
              <span className="inline-flex items-center gap-2">
                <span>{line2}</span>
                <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-[#14803c] fill-current shrink-0 -rotate-12 inline-block" />
              </span>
              <span className="inline-flex items-center gap-2 block">
                <span>{line3}</span>
                <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-[#14803c] fill-current shrink-0 rotate-45 inline-block" />
              </span>
            </h1>

            {/* 3. Narrative Paragraph in deep forest gray-green */}
            <p className="text-sm xs:text-base sm:text-lg text-[#1f3a2c]/95 leading-relaxed max-w-xl font-body font-normal">
              {heroParagraph || 'গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য তাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন — সরাসরি আমাদের খামার থেকে আপনার বাড়িতে।'}
            </p>

            {/* 4. 4 Feature items in a row with round light-green icon circles & dividers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 sm:border-y sm:border-[#0b3d2b]/15 py-3 sm:py-3.5">
              {heroFeatures.map((feat, idx) => (
                <div
                  key={feat.id}
                  className={`flex items-center gap-2.5 sm:px-3 ${
                    idx !== 3 ? 'sm:border-r sm:border-[#0b3d2b]/15' : ''
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#14803c]/15 text-[#14803c] flex items-center justify-center shrink-0">
                    {feat.icon}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs sm:text-[13px] font-bold text-[#0b3d2b]">
                      {feat.line1}
                    </span>
                    <span className="block text-[11px] sm:text-xs text-[#28523c] font-medium">
                      {feat.line2}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Two Buttons: Filled Dark-Green Pill + Outlined Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              {/* Button 1: Filled dark-green pill with cart icon -> /products */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link
                  to="/products"
                  id="hero-products-catalog-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[#0b3d2b] hover:bg-[#07291d] active:bg-[#051c14] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0b3d2b]/25 hover:shadow-xl transition-all min-h-[48px] text-center group cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2b705]" />
                  <span>প্রোডাক্টস ক্যাটালগ দেখুন</span>
                  <span className="text-[#f2b705] group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>

              {/* Button 2: Outlined pill with leaf icon -> /about */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link
                  to="/about"
                  id="hero-about-farm-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-transparent hover:bg-[#0b3d2b]/8 active:bg-[#0b3d2b]/15 text-[#0b3d2b] font-bold text-sm sm:text-base border-2 border-[#0b3d2b] transition-all min-h-[48px] text-center group cursor-pointer"
                >
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#14803c]" />
                  <span>আমাদের খামার সম্পর্কে</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 3 Tilted Cards Fanned Out                   */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end relative w-full overflow-visible py-4"
          >
            {/* Wooden Fence Illustration on the far right edge */}
            <div
              className="absolute right-0 sm:-right-4 bottom-0 pointer-events-none select-none z-0 opacity-60 hidden sm:block"
              aria-hidden="true"
            >
              <svg width="90" height="150" viewBox="0 0 90 150" fill="none">
                {/* Fence Posts */}
                <rect x="10" y="20" width="12" height="130" rx="3" fill="#a47148" />
                <polygon points="10,20 16,8 22,20" fill="#a47148" />
                <rect x="42" y="15" width="12" height="135" rx="3" fill="#936239" />
                <polygon points="42,15 48,3 54,15" fill="#936239" />
                <rect x="74" y="25" width="12" height="125" rx="3" fill="#a47148" />
                <polygon points="74,25 80,13 86,25" fill="#a47148" />
                {/* Cross Rails */}
                <rect x="0" y="45" width="90" height="10" rx="2" fill="#84552f" />
                <rect x="0" y="95" width="90" height="10" rx="2" fill="#84552f" />
              </svg>
            </div>

            {/* Leaves peeking out behind top of cards */}
            <div
              className="absolute -top-6 left-1/4 pointer-events-none select-none z-5 opacity-80"
              aria-hidden="true"
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <path d="M10 70C30 30 70 10 110 5C80 25 60 50 40 75Z" fill="#14803c" />
                <path d="M35 75C55 45 90 35 120 30C95 50 80 65 65 80Z" fill="#0b3d2b" />
              </svg>
            </div>

            {/* Micro Idle Floating Container */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative flex items-center justify-center w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[530px] h-[350px] xs:h-[410px] sm:h-[490px] lg:h-[510px] will-change-transform"
            >
              {tiltedCards.map((card, index) => {
                // Fan positioning across X axis
                const positionStyles = [
                  'left-0 xs:left-2 -translate-y-2',
                  'left-1/2 -translate-x-1/2 translate-y-0',
                  'right-0 xs:right-2 translate-y-2'
                ];

                return (
                  <motion.div
                    key={card.id}
                    className={`absolute ${positionStyles[index]} w-32 xs:w-40 sm:w-56 ${card.heightClass} rounded-2xl sm:rounded-[24px] bg-white p-1.5 xs:p-2 sm:p-2.5 shadow-2xl border-4 border-white flex flex-col justify-between cursor-pointer will-change-transform group`}
                    style={{
                      zIndex: card.zIndex,
                      rotate: `${card.rotation}deg`
                    }}
                    whileHover={{
                      rotate: 0,
                      y: -10,
                      scale: 1.05,
                      zIndex: 35,
                      boxShadow: '0 30px 45px -12px rgba(11, 61, 43, 0.35)',
                      transition: { type: 'spring', stiffness: 320, damping: 22 }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={card.link}
                      id={`hero-card-link-${card.id}`}
                      className="w-full h-full flex flex-col justify-between focus:outline-none"
                    >
                      {/* Photo fills top portion with inner rounded corners */}
                      <div className="w-full h-[78%] xs:h-[82%] rounded-xl sm:rounded-2xl overflow-hidden bg-[#e8e0d0] relative">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="eager"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Dark-Green Label Bar with Animal Icon, Name, and Round White Arrow Button */}
                      <div className="mt-1 xs:mt-1.5 w-full py-1.5 xs:py-2 sm:py-2.5 px-2 xs:px-3 rounded-xl bg-[#0b3d2b] text-white flex items-center justify-between gap-1 shadow-xs group-hover:bg-[#14803c] transition-colors">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-base sm:text-lg leading-none" role="img" aria-label={card.title}>
                            {card.icon}
                          </span>
                          <span className="font-headline font-bold text-xs xs:text-sm sm:text-base">
                            {card.title}
                          </span>
                        </div>
                        {/* Round White Arrow Button */}
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#0b3d2b] flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs group-hover:translate-x-0.5 transition-transform shrink-0">
                          →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM BAND: Wavy dark-green curved band with golden swoosh line */}
      {/* ========================================================= */}
      <div className="relative w-full overflow-hidden leading-none z-20">
        {/* Golden-Yellow Swoosh Line along wave top edge */}
        <div className="w-full overflow-hidden">
          <svg
            className="w-full h-12 sm:h-16 lg:h-20 block"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Golden swoosh stroke */}
            <path
              d="M0,45 C320,10 720,70 1440,25"
              stroke="#f2b705"
              strokeWidth="4"
              fill="none"
            />
            {/* Wavy dark-green band fill */}
            <path
              d="M0,47 C320,12 720,72 1440,27 L1440,80 L0,80 Z"
              fill="#0b3d2b"
            />
          </svg>
        </div>

        {/* Dark-Green Content Bar */}
        <div className="bg-[#0b3d2b] text-white py-5 sm:py-6 px-4 sm:px-6 lg:px-8 -mt-1 border-b border-[#14803c]/20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
            {/* Row of 4 Stats with Icons separated by thin dividers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 w-full lg:w-auto flex-1">
              {bottomStats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`flex items-center gap-3 py-1 ${
                    idx !== 3 ? 'md:border-r md:border-white/15 md:pr-6' : ''
                  } ${idx !== 0 ? 'md:pl-6' : ''}`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <span className="block font-headline font-black text-xl sm:text-2xl text-[#f2b705] leading-tight">
                      {stat.number}
                    </span>
                    <span className="block text-xs sm:text-sm text-gray-200 font-medium">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Handwritten bottom-right accent text in Galada font */}
            <div className="flex items-center gap-2 text-right shrink-0 lg:pl-6 lg:border-l lg:border-white/15">
              <Sparkles className="w-5 h-5 text-[#f2b705]" />
              <span className="font-['Galada'] text-[#f2b705] text-2xl sm:text-3xl leading-none pt-1">
                খাঁটি ও প্রাকৃতিক
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
