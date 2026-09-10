import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Award,
  RotateCcw,
  SearchX
} from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration } from '../components/ui/LeafDecoration';
import { useSaleProducts } from '../context/SaleProductsContext';
import { useSiteContent } from '../context/SiteContentContext';
import { toBengaliNumber, formatPriceBDT } from '../utils/bengali';
import {
  SaleProductFilters,
  defaultSaleProductFilters,
  filterAndSortSaleProducts,
  CategoryFilter,
} from '../utils/saleProductFilter';
import { SaleProductFilterBar } from '../components/sales/SaleProductFilterBar';
import farmBgPhoto from '../assets/images/real_khamar_user_1788280036119.jpg';

export const SaleProductsPage: React.FC = () => {
  const { saleProducts, loading } = useSaleProducts();
  const { whatsappUrl } = useSiteContent();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as CategoryFilter) || 'all';

  const [filters, setFilters] = useState<SaleProductFilters>({
    ...defaultSaleProductFilters,
    category: ['all', 'গরু', 'ছাগল', 'মুরগি ও হাঁস'].includes(initialCategory) ? initialCategory : 'all',
  });

  // Sync category state when URL search param changes
  useEffect(() => {
    const param = searchParams.get('category') as CategoryFilter;
    const validCategory: CategoryFilter =
      param && ['all', 'গরু', 'ছাগল', 'মুরগি ও হাঁস'].includes(param) ? param : 'all';

    setFilters((prev) => (prev.category === validCategory ? prev : { ...prev, category: validCategory }));
  }, [searchParams]);

  const handleFiltersChange = useCallback((updated: Partial<SaleProductFilters>) => {
    if (updated.category !== undefined) {
      if (updated.category === 'all') {
        setSearchParams({}, { replace: true });
      } else {
        setSearchParams({ category: updated.category }, { replace: true });
      }
    }
    setFilters((prev) => ({ ...prev, ...updated }));
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultSaleProductFilters);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filteredProducts = useMemo(() => {
    return filterAndSortSaleProducts(saleProducts, filters);
  }, [saleProducts, filters]);

  const categoryCounts = useMemo(
    () => ({
      all: saleProducts.length,
      cow: saleProducts.filter((p) => p.category === 'গরু').length,
      goat: saleProducts.filter((p) => p.category === 'ছাগল').length,
      poultry: saleProducts.filter((p) => p.category === 'মুরগি ও হাঁস' || p.category === 'মুরগি' || p.category === 'হাঁস').length,
    }),
    [saleProducts]
  );

  const getWhatsappOrderLink = (productName: string, price: number) => {
    const priceText = formatPriceBDT(price);
    return whatsappUrl(`আসসালামু আলাইকুম, আমি আপনাদের মজুমদার খামার থেকে "${productName}" (${priceText}) কিনতে চাই।`);
  };

  return (
    <PageTransition>
      <div
        id="sales-page-wrapper"
        className="relative w-full min-h-screen bg-[#F5F0E3] overflow-hidden text-[#1a3a2a] pb-12"
      >
        {/* Subtle Botanical Corner & Side Decorative Illustrations */}
        <LeafDecoration position="top-left" opacity={0.16} className="-translate-x-8 -translate-y-8" />
        <LeafDecoration position="top-right" opacity={0.16} className="translate-x-8 -translate-y-8" />
        <LeafDecoration position="bottom-left" opacity={0.12} className="-translate-x-8 translate-y-8" />
        <LeafDecoration position="bottom-right" opacity={0.12} className="translate-x-8 translate-y-8" />

        {/* TOP BREADCRUMB BAR */}
        <div className="w-full bg-[#FAF7EE] border-b border-[#E6DFCF] py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm text-[#4a6356] font-medium">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#003F2D] transition-colors">
              <Home className="w-4 h-4 text-[#C95A25]" />
              <span>হোম</span>
            </Link>
            <span className="text-[#9ca3af]">/</span>
            <span className="text-[#003F2D] font-bold">বিক্রয় পণ্য</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 sm:pt-8 lg:pt-10">
          
          {/* SECTION 1 — SALES HERO HEADER */}
          <div className="relative text-center max-w-4xl mx-auto mb-10 sm:mb-12">
            
            {/* Left Decorative Badge */}
            <div className="hidden lg:flex absolute -left-12 xl:-left-20 top-2 -rotate-6 flex-col items-center justify-center p-3 sm:p-4 rounded-full border-2 border-dashed border-[#D6A21D]/50 bg-[#FAF7EE]/90 shadow-sm text-center w-36 h-36 pointer-events-none select-none">
              <span className="text-[#003F2D] text-xs font-black leading-tight">ভালো খাবার</span>
              <span className="text-[#C95A25] text-xs font-black leading-tight my-0.5">সুস্থ প্রাণী</span>
              <span className="text-[#003F2D] text-[11px] font-bold leading-tight">নির্ভরযোগ্য বিক্রয়</span>
              <div className="mt-1 text-[#D6A21D]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                </svg>
              </div>
            </div>

            {/* Right Decorative Farm Sketch */}
            <div className="hidden lg:flex absolute -right-12 xl:-right-20 top-0 flex-col items-center pointer-events-none select-none opacity-85">
              <div className="px-3 py-1 rounded-full bg-[#003F2D]/10 text-[#003F2D] text-xs font-bold border border-[#003F2D]/20 mb-1">
                আমাদের খামার থেকে আপনার ঘরে
              </div>
              <div className="w-36 h-20 overflow-hidden rounded-xl border border-[#D6A21D]/30 opacity-70">
                <img src={farmBgPhoto} alt="খামার" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Top Subtitle Label: — এখন যা পাওয়া যাচ্ছে — */}
            <div className="inline-flex items-center justify-center gap-2 text-[#C95A25] font-bold text-sm sm:text-base tracking-wide mb-2">
              <span className="h-[1px] w-6 bg-[#D6A21D]" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] -rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>এখন যা পাওয়া যাচ্ছে</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span className="h-[1px] w-6 bg-[#D6A21D]" />
            </div>

            {/* Main Dominant Heading */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] -rotate-45 hidden sm:block">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003F2D] tracking-tight leading-tight">
                বিক্রয় পণ্য
              </h1>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] rotate-45 hidden sm:block">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
            </div>

            {/* Subtitle description */}
            <p className="text-sm sm:text-base md:text-lg text-[#284937] leading-relaxed max-w-2xl mx-auto mt-2">
              নিচের প্রাণীগুলো এখন বিক্রির জন্য প্রস্তুত আছে। পছন্দ হলে সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন।
            </p>
          </div>

          {/* SECTION 2 — PREMIUM ANIMAL SEARCH & FILTER BAR */}
          <div className="max-w-6xl mx-auto">
            <SaleProductFilterBar
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleResetFilters}
              totalMatches={filteredProducts.length}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* SECTION 3 — 3-COLUMN PRODUCT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch max-w-6xl mx-auto mb-16 sm:mb-20">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center text-gray-500 font-medium">
                  পণ্য তালিকা লোড হচ্ছে...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-14 px-6 text-center bg-white/80 backdrop-blur-xs rounded-2xl border border-[#D6A21D]/30 p-8 shadow-xs max-w-xl mx-auto my-4 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7EE] border border-[#D6A21D]/40 flex items-center justify-center text-[#C95A25]">
                    <SearchX className="w-7 h-7 text-[#003F2D]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#003F2D]">
                    আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো পশু পাওয়া যায়নি।
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    অন্য কোনো ফিল্টার বা সার্চ কিওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার মুছে সবগুলো পশু দেখুন।
                  </p>
                  <div>
                    <button
                      type="button"
                      id="empty-state-reset-all-btn"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#003F2D] hover:bg-[#1a3a2a] active:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer min-h-[40px]"
                    >
                      <RotateCcw className="w-4 h-4 text-[#D6A21D]" />
                      <span>সব ফিল্টার মুছুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                filteredProducts.map((product, index) => {
                  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800';
                  const formattedPrice = formatPriceBDT(product.price);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white rounded-[22px] border border-[#e8dfce] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left"
                    >
                      {/* Top Image Container */}
                      <Link
                        to={`/sale-products/${product.slug}`}
                        className="block relative w-full h-52 sm:h-56 bg-[#ebe2d3] overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top-Right Availability Status Badge */}
                        <div className="absolute top-3.5 right-3.5 z-10">
                          {product.inStock && !product.isLimited ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#003F2D] text-xs font-bold shadow-sm backdrop-blur-xs border border-black/5">
                              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                              <span>স্টকে আছে</span>
                            </span>
                          ) : product.isLimited ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C] text-white text-xs font-bold shadow-sm backdrop-blur-xs">
                              <span>সীমিত সংখ্যক</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500 text-white text-xs font-bold shadow-sm backdrop-blur-xs">
                              <span>স্টক শেষ</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom-Left Category Pill */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] text-[#003F2D] text-xs font-bold shadow-sm border border-[#D6A21D]/40">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#C95A25]">
                              <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
                            </svg>
                            <span>{product.category}</span>
                          </span>
                        </div>
                      </Link>

                      {/* Card Body Area */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                        <div>
                          {/* Product Name */}
                          <Link to={`/sale-products/${product.slug}`} className="block group">
                            <h3 className="text-xl sm:text-2xl font-black text-[#003F2D] group-hover:text-[#c0522d] transition-colors tracking-tight mb-2">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Detail Spec Row */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4a6356] font-medium mb-4">
                            <span className="inline-flex items-center gap-1">
                              <span className="text-[#C95A25]">🌱</span>
                              <span>{product.age}</span>
                            </span>
                            <span className="text-[#d1d5db] font-bold">•</span>
                            <span className="inline-flex items-center gap-1">
                              <span className="text-[#C95A25]">⚖️</span>
                              <span>{product.weight}</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          {/* Price Tag */}
                          <div className="mb-4">
                            <span className="text-2xl sm:text-3xl font-black text-[#C95A25] tracking-tight">
                              {formattedPrice}
                            </span>
                          </div>

                          {/* WhatsApp Order Button */}
                          <a
                            href={getWhatsappOrderLink(product.name, product.price)}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`order-btn-${product.id}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#C95A25] hover:bg-[#b04a1a] active:bg-[#973e14] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-center min-h-[44px]"
                          >
                            <MessageCircle className="w-4 h-4 fill-white text-[#C95A25] shrink-0" />
                            <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
                            <span className="text-base font-semibold">→</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 4 — LARGE BOTTOM CTA BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55 }}
            className="max-w-6xl mx-auto mb-10 sm:mb-16"
          >
            <div
              id="sales-bottom-cta-banner"
              className="relative w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#003F2D] border border-[#D6A21D]/30 shadow-2xl p-5 sm:p-8 lg:px-12 lg:py-9 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6"
            >
              <img
                src={farmBgPhoto}
                alt="ফার্ম ব্যাকগ্রাউন্ড"
                className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003F2D] via-[#003F2D]/95 to-[#003F2D]/90 pointer-events-none" />

              <div className="relative z-10 space-y-1 text-left w-full md:w-auto">
                <h3 className="text-white text-lg sm:text-2xl lg:text-3xl font-black tracking-tight">
                  আপনার পছন্দের প্রাণী খুঁজে পাচ্ছেন না?
                </h3>
                <p className="text-[#D6A21D] text-xs sm:text-base font-medium">
                  আমাদের সাথে যোগাযোগ করুন, আমরা সাহায্য করব।
                </p>
              </div>

              <div className="relative z-10 w-full md:w-auto">
                <motion.a
                  href={whatsappUrl('আসসালামু আলাইকুম, আমি আপনাদের খামারের প্রাণী ও বিক্রয় সেবা সম্পর্কে কথা বলতে চাই।')}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7EE] active:bg-gray-100 text-[#003F2D] font-bold text-sm sm:text-base shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[48px] text-center"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366] shrink-0" />
                  <span>হোয়াটসঅ্যাপে কথা বলুন</span>
                  <span className="text-base font-semibold">→</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* SECTION 5 — SERVICE TRUST FEATURES STRIP */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#e8dfce] shadow-sm p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#e8dfce]">
              
              <div className="flex items-center gap-3.5 pt-2 sm:pt-0 lg:px-3">
                <div className="w-11 h-11 rounded-full bg-[#FAF7EE] border border-[#D6A21D]/30 flex items-center justify-center text-[#C95A25] shrink-0">
                  <Home className="w-5 h-5 text-[#003F2D]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#003F2D] leading-snug">বিশ্বাসযোগ্য খামার</h4>
                  <p className="text-xs text-[#527261]">নিজস্ব খামার, নিরাপদ প্রাণী</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-3">
                <div className="w-11 h-11 rounded-full bg-[#FAF7EE] border border-[#D6A21D]/30 flex items-center justify-center text-[#C95A25] shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#003F2D]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#003F2D] leading-snug">স্বাস্থ্য পরীক্ষিত</h4>
                  <p className="text-xs text-[#527261]">নিয়মিত স্বাস্থ্য পরীক্ষা</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-3">
                <div className="w-11 h-11 rounded-full bg-[#FAF7EE] border border-[#D6A21D]/30 flex items-center justify-center text-[#C95A25] shrink-0">
                  <Award className="w-5 h-5 text-[#003F2D]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#003F2D] leading-snug">ন্যায্য মূল্য</h4>
                  <p className="text-xs text-[#527261]">সরাসরি খামার থেকে</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:px-3">
                <div className="w-11 h-11 rounded-full bg-[#FAF7EE] border border-[#D6A21D]/30 flex items-center justify-center text-[#C95A25] shrink-0">
                  <Truck className="w-5 h-5 text-[#003F2D]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#003F2D] leading-snug">নিরাপদ ডেলিভারি</h4>
                  <p className="text-xs text-[#527261]">আপনার এলাকায় সহযোগী</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
