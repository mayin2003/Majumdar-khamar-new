import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  Info, 
  Check, 
  ShieldCheck, 
  Syringe,
  Wind
} from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration } from '../components/ui/LeafDecoration';
import { useProducts } from '../context/ProductsContext';
import { useSiteContent } from '../context/SiteContentContext';
import { ProductCategory, Product } from '../types/product';
import farmBgPhoto from '../assets/images/real_khamar_user_1788280036119.jpg';

interface CategoryInfo {
  canonicalName: ProductCategory;
  title: string;
  urlSlug: string;
}

function resolveCategory(param?: string): CategoryInfo {
  if (!param) {
    return { canonicalName: 'গরু', title: 'গরু', urlSlug: 'গরু' };
  }
  const decoded = decodeURIComponent(param).trim();

  if (decoded === 'গরু' || decoded.toLowerCase() === 'cow' || decoded.toLowerCase() === 'goru') {
    return { canonicalName: 'গরু', title: 'গরু', urlSlug: 'গরু' };
  }
  if (decoded === 'ছাগল' || decoded.toLowerCase() === 'goat' || decoded.toLowerCase() === 'chagol') {
    return { canonicalName: 'ছাগল', title: 'ছাগল', urlSlug: 'ছাগল' };
  }
  if (
    decoded === 'মুরগি-ও-হাঁস' ||
    decoded === 'মুরগি ও হাঁস' ||
    decoded === 'মুরগি' ||
    decoded === 'হাঁস' ||
    decoded.toLowerCase() === 'poultry' ||
    decoded.toLowerCase() === 'murgi-o-hash' ||
    decoded.toLowerCase() === 'murgi-o-hnas'
  ) {
    return { canonicalName: 'মুরগি ও হাঁস', title: 'মুরগি ও হাঁস', urlSlug: 'মুরগি-ও-হাঁস' };
  }

  return { canonicalName: decoded as ProductCategory, title: decoded, urlSlug: decoded };
}

export const ProductInfoDetailPage: React.FC = () => {
  const { category: categoryParam, slug } = useParams<{ category: string; slug: string }>();
  const { products, loading } = useProducts();
  const { whatsappUrl } = useSiteContent();

  const categoryInfo = useMemo(() => resolveCategory(categoryParam), [categoryParam]);

  // Find product by slug
  const currentProduct = useMemo(() => {
    if (!slug) return undefined;
    const decodedSlug = decodeURIComponent(slug).trim();
    return products.find(
      (p) =>
        p.slug === slug ||
        p.slug === decodedSlug ||
        (p.slug === 'deshi-bachur-1' && (slug === 'deshi-bachur' || decodedSlug === 'deshi-bachur')) ||
        p.id === slug ||
        p.id === decodedSlug
    );
  }, [products, slug]);

  // Gallery thumbnail state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    setSelectedImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // If loading finished and not found, redirect to category page
  if (!loading && !currentProduct) {
    return <Navigate to={`/products/${categoryInfo.urlSlug}`} replace />;
  }

  if (loading || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#f5efe0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#1a3a2a]">
          <div className="w-10 h-10 border-4 border-[#1a3a2a] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-sm">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const imagesList = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [farmBgPhoto];

  const activeMainImage = imagesList[selectedImageIndex] || imagesList[0];

  // Related animals in the same category (exclude current)
  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id && p.slug !== currentProduct.slug && (p.category === currentProduct.category || p.category === categoryInfo.canonicalName))
    .slice(0, 3);

  // Informational WhatsApp inquiry url (strictly NO price implied)
  const inquiryWhatsappUrl = whatsappUrl(`আমি ${currentProduct.name} সম্পর্কে জানতে চাই`);

  const generalWhatsappUrl = whatsappUrl('আসসালামু আলাইকুম, আমি খামারের অন্যান্য প্রাণী সম্পর্কে জানতে চাই।');

  return (
    <PageTransition>
      <div
        id="product-info-detail-wrapper"
        className="relative w-full min-h-screen bg-[#f5efe0] overflow-hidden text-[#1a3a2a] pb-12"
      >
        {/* Subtle Botanical Corner Decorations */}
        <LeafDecoration position="top-right" opacity={0.15} className="translate-x-6 -translate-y-6" />
        <LeafDecoration position="bottom-left" opacity={0.12} className="-translate-x-8 translate-y-8" />

        {/* 1. TOP BREADCRUMB BAR */}
        <div className="w-full bg-[#FAF7EE] border-b border-[#E6DFCF] py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs sm:text-sm text-[#4a6356] font-medium">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#003F2D] transition-colors">
              <Home className="w-4 h-4 text-[#c0522d]" />
              <span>হোম</span>
            </Link>
            <span className="text-[#9ca3af]">/</span>
            <Link to="/products" className="hover:text-[#003F2D] transition-colors">
              <span>প্রোডাক্টস</span>
            </Link>
            <span className="text-[#9ca3af]">/</span>
            <Link to={`/products/${categoryInfo.urlSlug}`} className="hover:text-[#003F2D] transition-colors">
              <span>{categoryInfo.title}</span>
            </Link>
            <span className="text-[#9ca3af]">/</span>
            <span className="text-[#c0522d] font-bold">{currentProduct.name}</span>
          </div>
        </div>

        {/* 2. MAIN DETAIL CONTENT CONTAINER */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 sm:pt-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4"
            >
              {/* Main Product Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#e8ded0] shadow-md border border-[#e4dcce]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeMainImage}
                    src={activeMainImage}
                    alt={currentProduct.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Status badge */}
                <div className="absolute top-4 left-4 z-20">
                  {currentProduct.isLimited ? (
                    <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md">
                      <span>সীমিত সংখ্যক</span>
                    </span>
                  ) : currentProduct.inStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#003F2D]/90 text-white text-xs sm:text-sm font-bold shadow-md backdrop-blur-xs border border-white/20">
                      <Check className="w-3.5 h-3.5 text-[#22c55e] stroke-[3]" />
                      <span>স্টকে আছে</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-600 text-white text-xs font-bold shadow-md">
                      <span>স্টক শেষ</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail row if available */}
              {imagesList.length > 1 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {imagesList.slice(0, 3).map((imgUrl, idx) => {
                    const isActive = selectedImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-[#e8ded0] ${
                          isActive
                            ? 'border-[#003F2D] shadow-md ring-2 ring-[#003F2D]/20 scale-[1.02]'
                            : 'border-[#e4dcce] hover:border-[#003F2D]/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${currentProduct.name} - ভিউ ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* RIGHT COLUMN: Product Specs & Information (NO PRICE, NO ORDER LANGUAGE) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-4 sm:space-y-5 text-left"
            >
              {/* Category Indicator Tag */}
              <div className="inline-flex items-center gap-2 text-[#003F2D] font-bold text-xs sm:text-sm tracking-wide bg-[#FAF7EE] px-3 py-1 rounded-full border border-[#e4dccb] w-fit">
                <span>🌿</span>
                <span>{categoryInfo.title} বিভাগ</span>
              </div>

              {/* Product Name Heading with small leaf icon */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#1a3a2a] tracking-tight leading-tight">
                  {currentProduct.name}
                </h1>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#889E73] rotate-45 flex-shrink-0">
                  <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                </svg>
              </div>

              {/* Thin horizontal divider line with leaf icon */}
              <div className="relative flex items-center justify-center my-1 py-1">
                <div className="w-full border-t border-[#dfd6c4]" />
                <div className="absolute bg-[#f5efe0] px-3 text-[#889E73]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="rotate-45">
                    <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                  </svg>
                </div>
              </div>

              {/* "বিস্তারিত তথ্য" Section */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#1a3a2a]">
                  <Info className="w-4 h-4 text-[#003F2D]" />
                  <span>বিস্তারিত তথ্য</span>
                </div>

                {/* Table of Specifications */}
                <div className="divide-y divide-[#e4dccb] border-y border-[#e4dccb]">
                  {/* Row 1: বয়স */}
                  <div className="flex items-center justify-between py-2.5 text-sm sm:text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#546e5f]">
                      <span className="text-base">📅</span>
                      <span>বয়স</span>
                    </div>
                    <span className="font-bold text-[#1a3a2a]">{currentProduct.age || '—'}</span>
                  </div>

                  {/* Row 2: আনুমানিক ওজন */}
                  <div className="flex items-center justify-between py-2.5 text-sm sm:text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#546e5f]">
                      <span className="text-base">⚖️</span>
                      <span>আনুমানিক ওজন</span>
                    </div>
                    <span className="font-bold text-[#1a3a2a]">{currentProduct.weight || '—'}</span>
                  </div>

                  {/* Row 3: জাত */}
                  <div className="flex items-center justify-between py-2.5 text-sm sm:text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#546e5f]">
                      <span className="text-base">🐄</span>
                      <span>জাত</span>
                    </div>
                    <span className="font-bold text-[#1a3a2a]">{currentProduct.breed || currentProduct.category}</span>
                  </div>

                  {/* Row 4: লিঙ্গ */}
                  <div className="flex items-center justify-between py-2.5 text-sm sm:text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#546e5f]">
                      <span className="text-base">♂️</span>
                      <span>লিঙ্গ</span>
                    </div>
                    <span className="font-bold text-[#1a3a2a]">{currentProduct.gender || 'পুরুষ'}</span>
                  </div>

                  {/* Row 5: স্বাস্থ্য অবস্থা */}
                  <div className="flex items-center justify-between py-2.5 text-sm sm:text-[15px]">
                    <div className="flex items-center gap-2.5 text-[#546e5f]">
                      <span className="text-base">🛡️</span>
                      <span>স্বাস্থ্য অবস্থা</span>
                    </div>
                    <span className="font-bold text-[#1a3a2a] text-right">
                      {currentProduct.healthStatus || 'সুস্থ, নিয়মিত টিকা দেওয়া'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Snippet */}
              {currentProduct.description && (
                <div className="bg-[#FAF2E2] border border-[#e8dfce] rounded-xl p-3.5 text-xs sm:text-sm text-[#465f52] leading-relaxed">
                  <p>{currentProduct.description}</p>
                </div>
              )}

              {/* Single Neutral Inquiry Button (NO PRICE, NO ORDER LANGUAGE) */}
              <div className="pt-2">
                <a
                  href={inquiryWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="info-detail-inquiry-btn"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF7EE] text-[#003F2D] border-2 border-[#003F2D] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-center"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                  <span>এই প্রাণী সম্পর্কে জিজ্ঞাসা করুন</span>
                  <span className="text-base font-semibold">→</span>
                </a>
              </div>

            </motion.div>
          </div>
        </div>

        {/* 3. FEATURE STRIP (Horizontal Full-Width Cream Bar) */}
        <div className="w-full bg-[#FAF7EE] border-y border-[#E6DFCF] py-6 sm:py-8 mb-12 sm:mb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e2d8c5]">
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
                <div className="w-11 h-11 rounded-full bg-white border border-[#D6A21D]/30 flex items-center justify-center text-[#1a3a2a] flex-shrink-0 shadow-xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[#1a3a2a]">
                    <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1a3a2a] leading-tight">প্রাকৃতিক খাবার</h4>
                  <p className="text-xs text-[#527261] mt-0.5">ঘাস, খড় ও দানাদার খাবার</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
                <div className="w-11 h-11 rounded-full bg-white border border-[#D6A21D]/30 flex items-center justify-center text-[#1a3a2a] flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#1a3a2a]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1a3a2a] leading-tight">নিয়মিত স্বাস্থ্য পরীক্ষা</h4>
                  <p className="text-xs text-[#527261] mt-0.5">পশু চিকিৎসকের তত্ত্বাবধানে</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
                <div className="w-11 h-11 rounded-full bg-white border border-[#D6A21D]/30 flex items-center justify-center text-[#1a3a2a] flex-shrink-0 shadow-xs">
                  <Syringe className="w-5 h-5 text-[#1a3a2a]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1a3a2a] leading-tight">টিকা প্রদান করা</h4>
                  <p className="text-xs text-[#527261] mt-0.5">রোগমুক্ত ও সুস্থ প্রাণী</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
                <div className="w-11 h-11 rounded-full bg-white border border-[#D6A21D]/30 flex items-center justify-center text-[#1a3a2a] flex-shrink-0 shadow-xs">
                  <Wind className="w-5 h-5 text-[#1a3a2a]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1a3a2a] leading-tight">পরিচ্ছন্ন পরিবেশ</h4>
                  <p className="text-xs text-[#527261] mt-0.5">খোলা মাঠ ও পর্যাপ্ত বাতাস</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. "আরও দেখুন" SECTION (Informational list) */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-18">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#889E73] -rotate-45">
                  <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                </svg>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a3a2a] tracking-tight">
                  আরও দেখুন
                </h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#889E73] rotate-45">
                  <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {relatedProducts.map((item, index) => {
                const itemImg = item.images && item.images.length > 0 ? item.images[0] : farmBgPhoto;
                const linkTarget = `/products/${categoryInfo.urlSlug}/${item.slug}`;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-[20px] border border-[#e8dfce] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden text-left"
                  >
                    <Link to={linkTarget} className="block group">
                      <div className="relative w-full h-48 sm:h-52 bg-[#ebe2d3] overflow-hidden">
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 z-10">
                          {item.isLimited ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EA580C] text-white text-[11px] font-bold shadow-sm">
                              সীমিত সংখ্যক
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#003F2D] text-white text-[11px] font-bold shadow-sm">
                              স্টকে আছে
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
                      <Link to={linkTarget} className="block">
                        <h3 className="text-lg sm:text-xl font-black text-[#1a3a2a] hover:text-[#003F2D] transition-colors mb-1.5">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#527261] font-medium mb-4">
                          <span>বয়স {item.age}</span>
                          <span className="text-[#d1d5db] font-bold">•</span>
                          <span>ওজন {item.weight}</span>
                        </div>
                      </Link>

                      <Link
                        to={linkTarget}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7EE] text-[#003F2D] border border-[#003F2D] font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer text-center"
                      >
                        <span>বিস্তারিত দেখুন</span>
                        <span className="text-sm font-semibold">→</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. BOTTOM CTA BANNER */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="info-detail-bottom-cta-banner"
            className="relative w-full rounded-[22px] overflow-hidden bg-[#003F2D] border border-[#D6A21D]/30 shadow-xl p-6 sm:p-8 lg:px-10 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <img
              src={farmBgPhoto}
              alt="ফার্ম ব্যাকগ্রাউন্ড"
              className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#003F2D] via-[#003F2D]/95 to-[#003F2D]/90 pointer-events-none" />

            <div className="relative z-10 space-y-1 text-left w-full md:w-auto">
              <h3 className="text-white text-xl sm:text-2xl font-black tracking-tight">
                নির্দিষ্ট প্রাণী খুঁজে পাচ্ছেন না?
              </h3>
              <p className="text-[#D6A21D] text-sm sm:text-base font-medium">
                আমাদের সাথে যোগাযোগ করুন, আমরা ব্যবস্থা করে দেব।
              </p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex justify-start md:justify-end">
              <motion.a
                href={generalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-white hover:bg-[#FAF7EE] text-[#003F2D] font-bold text-sm sm:text-base shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                <span>হোয়াটসঅ্যাপে কথা বলুন</span>
                <span className="text-base font-semibold">→</span>
              </motion.a>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
