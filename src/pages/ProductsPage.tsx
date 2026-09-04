import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration } from '../components/ui/LeafDecoration';
import { useProducts } from '../context/ProductsContext';
import { toBengaliNumber } from '../utils/bengali';

// High-resolution realistic livestock images matching the reference layout
import cowImage from '../assets/images/products_cow_landscape_1788280718661.jpg';
import goatImage from '../assets/images/products_goat_landscape_1788280739621.jpg';
import poultryImage from '../assets/images/products_poultry_landscape_1788280758135.jpg';
import farmBgPhoto from '../assets/images/real_khamar_user_1788280036119.jpg';

interface ProductCardItem {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  link: string;
}

const productCards: ProductCardItem[] = [
  {
    id: 'cow',
    category: 'গরু',
    title: 'গরু',
    image: cowImage,
    description:
      'দুধ ও মাংসের জন্য দেশি ও শাহীওয়াল জাতের গরু পালন করা হয়। প্রাকৃতিক খাবার আর নিয়মিত স্বাস্থ্য পরীক্ষার মাধ্যমে যত্নে নেওয়া হয়।',
    link: '/products/গরু',
  },
  {
    id: 'goat',
    category: 'ছাগল',
    title: 'ছাগল',
    image: goatImage,
    description:
      'ব্ল্যাক বেঙ্গল ও যমুনাপাড়ী জাতের ছাগল পালন করা হয়। ছোট থেকে বড় সব বয়সের ছাগল পাওয়া যায়।',
    link: '/products/ছাগল',
  },
  {
    id: 'poultry',
    category: 'মুরগি ও হাঁস',
    title: 'মুরগি ও হাঁস',
    image: poultryImage,
    description:
      'সোনালী ও দেশি মুরগি, দেশি হাঁস — ডিম আর মাংসের জন্য সুস্থ পরিবেশে পালন করা হয়।',
    link: '/products/মুরগি-ও-হাঁস',
  },
];

export const ProductsPage: React.FC = () => {
  const { products } = useProducts();

  const getCategoryCount = (category: string) => {
    if (category === 'মুরগি ও হাঁস') {
      return products.filter(
        (p) => p.category === 'মুরগি ও হাঁস' || (p.category as string) === 'মুরগি' || (p.category as string) === 'হাঁস'
      ).length;
    }
    return products.filter((p) => p.category === category).length;
  };
  return (
    <PageTransition>
      <div
        id="products-page-wrapper"
        className="relative w-full min-h-screen bg-[#F5F0E3] overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24"
      >
        {/* Subtle Botanical Corner Decorations */}
        <LeafDecoration position="top-left" opacity={0.16} className="-translate-x-8 -translate-y-8" />
        <LeafDecoration position="top-right" opacity={0.16} className="translate-x-8 -translate-y-8" />
        <LeafDecoration position="bottom-left" opacity={0.14} className="-translate-x-8 translate-y-8" />
        <LeafDecoration position="bottom-right" opacity={0.14} className="translate-x-8 translate-y-8" />

        {/* Subtle decorative farm sketch/tree silhouettes in background margins */}
        <div
          className="absolute left-0 top-1/3 -translate-y-1/2 w-64 h-96 opacity-10 pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 300" fill="currentColor" className="text-[#003F2D]">
            <path d="M20 180 C40 120, 80 100, 100 130 C120 70, 160 90, 180 150 C190 190, 170 240, 120 250 L120 300 L80 300 L80 250 C30 240, 10 210, 20 180 Z" opacity="0.3" />
            <path d="M5 250 L95 180 L185 250 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        </div>
        <div
          className="absolute right-0 top-1/3 -translate-y-1/2 w-64 h-96 opacity-10 pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 300" fill="currentColor" className="text-[#003F2D] -scale-x-100">
            <path d="M20 180 C40 120, 80 100, 100 130 C120 70, 160 90, 180 150 C190 190, 170 240, 120 250 L120 300 L80 300 L80 250 C30 240, 10 210, 20 180 Z" opacity="0.3" />
            <path d="M5 250 L95 180 L185 250 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* SECTION 1 — HEADER AREA */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-16 lg:mb-20"
          >
            {/* Top decorative label: 🍃 আমাদের প্রাণী সম্ভার 🍃 */}
            <div className="inline-flex items-center justify-center gap-2 text-[#C95A25] font-bold text-sm sm:text-base tracking-wide">
              {/* Golden Leaf Left */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] -rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>আমাদের প্রাণী সম্ভার</span>
              {/* Golden Leaf Right */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
            </div>

            {/* Main Heading: আমরা যা যা পালন করি */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#003F2D] leading-[1.18] tracking-tight">
              আমরা যা যা পালন করি
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-[19px] text-[#1f3a2c] leading-relaxed font-normal max-w-2xl mx-auto pt-1">
              যত্ন আর ভালোবাসায় বড় করা প্রতিটি প্রাণী, প্রাকৃতিক পরিবেশে লালিত-পালিত।
            </p>
          </motion.div>

          {/* SECTION 2 — THREE MAIN PRODUCT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 xl:gap-9 items-stretch max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
            {productCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                  ease: 'easeOut',
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25 },
                }}
                className="relative bg-white rounded-[26px] border border-[#e6decb] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between pt-7 pb-6 px-5 sm:px-6 text-center"
              >
                {/* Top Badge: 🍃 <Title> 🍃 overlapping top card border */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#003F2D] text-white text-sm sm:text-base font-bold shadow-md whitespace-nowrap border border-[#D6A21D]/30">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] -rotate-45">
                      <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                    </svg>
                    <span>{card.title}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] rotate-45">
                      <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                    </svg>
                  </div>
                </div>

                {/* Card Main Image */}
                <Link
                  to={card.link}
                  className="block w-full h-48 sm:h-52 md:h-56 rounded-2xl overflow-hidden bg-[#e8e0d0] relative mt-1 border border-black/5 cursor-pointer group"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
                </Link>

                {/* Card Bengali Description */}
                <p className="text-sm sm:text-[15px] text-[#1f3a2c] leading-relaxed font-normal my-4 sm:my-5 flex-grow">
                  {card.description}
                </p>

                {/* Live Count Indicator */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] text-[#003F2D] text-xs font-semibold border border-[#E6DFCF]">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span>{toBengaliNumber(getCategoryCount(card.category))} টি প্রাণী নিবন্ধিত</span>
                  </span>
                </div>

                {/* Card Action Button: বিস্তারিত জানুন → */}
                <div className="pt-1">
                  <Link
                    to={card.link}
                    id={`product-card-detail-btn-${card.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl border border-[#003F2D] text-[#003F2D] font-bold text-sm sm:text-base bg-[#FAF7EE] hover:bg-[#003F2D] active:bg-[#002e21] hover:text-white transition-all duration-200 shadow-xs hover:shadow-sm min-h-[44px]"
                  >
                    <span>বিস্তারিত জানুন</span>
                    <span className="text-base font-semibold">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SECTION 3 — BOTTOM CTA BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-6xl mx-auto"
          >
            <div
              id="products-bottom-cta-banner"
              className="relative w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#003F2D] border border-[#D6A21D]/30 shadow-2xl p-5 sm:p-8 lg:px-12 lg:py-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6"
            >
              {/* Background Farm Texture with Dark Green Overlay */}
              <img
                src={farmBgPhoto}
                alt="ফার্ম ব্যাকগ্রাউন্ড"
                className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003F2D] via-[#003F2D]/95 to-[#003F2D]/90 pointer-events-none" />

              {/* Left Side: Leaf icon & Descriptive copy */}
              <div className="relative z-10 flex items-center gap-3.5 sm:gap-5 text-left w-full md:w-auto">
                <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-[#D6A21D]/15 border border-[#D6A21D]/30 items-center justify-center text-[#D6A21D]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-white/90 text-xs sm:text-base font-medium">
                    নির্দিষ্ট প্রাণী এখন কিনতে চান?
                  </p>
                  <h2 className="text-[#D6A21D] text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    আমাদের বিক্রয় পণ্য দেখুন
                  </h2>
                </div>
              </div>

              {/* Right Side: Orange CTA Button */}
              <div className="relative z-10 w-full md:w-auto">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full">
                  <Link
                    to="/sales"
                    id="products-cta-view-sales-btn"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#C95A25] hover:bg-[#b04a1a] active:bg-[#973e14] text-white font-black text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[48px] text-center"
                  >
                    <span>বিক্রয় পণ্য দেখুন</span>
                    <span className="text-lg">→</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};
