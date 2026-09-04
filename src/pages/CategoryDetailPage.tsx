import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Check } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { LeafDecoration } from '../components/ui/LeafDecoration';
import { useProducts } from '../context/ProductsContext';
import { useSiteContent } from '../context/SiteContentContext';
import { ProductCategory } from '../types/product';
import farmBgPhoto from '../assets/images/real_khamar_user_1788280036119.jpg';

interface CategoryInfo {
  canonicalName: ProductCategory;
  title: string;
  urlSlug: string;
  label: string;
  description: string;
  defaultEmoji: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  'গরু': {
    canonicalName: 'গরু',
    title: 'গরু',
    urlSlug: 'গরু',
    label: 'আমাদের গরু সম্ভার',
    description: 'দুধ ও মাংসের জন্য দেশি ও শাহীওয়াল জাতের গরু পালন করা হয়। প্রাকৃতিক খাবার আর নিয়মিত স্বাস্থ্য পরীক্ষার মাধ্যমে যত্নে নেওয়া হয়।',
    defaultEmoji: '🐄',
  },
  'ছাগল': {
    canonicalName: 'ছাগল',
    title: 'ছাগল',
    urlSlug: 'ছাগল',
    label: 'আমাদের ছাগল সম্ভার',
    description: 'ব্ল্যাক বেঙ্গল ও যমুনাপাড়ী জাতের ছাগল পালন করা হয়। ছোট থেকে বড় সব বয়সের ছাগল পাওয়া যায়।',
    defaultEmoji: '🐐',
  },
  'মুরগি ও হাঁস': {
    canonicalName: 'মুরগি ও হাঁস',
    title: 'মুরগি ও হাঁস',
    urlSlug: 'মুরগি-ও-হাঁস',
    label: 'আমাদের মুরগি ও হাঁস সম্ভার',
    description: 'সোনালী ও দেশি মুরগি, দেশি হাঁস — ডিম আর মাংসের জন্য সুস্থ পরিবেশে পালন করা হয়।',
    defaultEmoji: '🐔',
  },
};

function resolveCategory(param?: string): CategoryInfo | null {
  if (!param) return null;
  const decoded = decodeURIComponent(param).trim();

  if (decoded === 'গরু' || decoded.toLowerCase() === 'cow' || decoded.toLowerCase() === 'goru') {
    return CATEGORY_MAP['গরু'];
  }
  if (decoded === 'ছাগল' || decoded.toLowerCase() === 'goat' || decoded.toLowerCase() === 'chagol') {
    return CATEGORY_MAP['ছাগল'];
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
    return CATEGORY_MAP['মুরগি ও হাঁস'];
  }

  // Exact key match fallback
  if (CATEGORY_MAP[decoded]) {
    return CATEGORY_MAP[decoded];
  }

  return null;
}

export const CategoryDetailPage: React.FC = () => {
  const { category: categoryParam } = useParams<{ category: string }>();
  const { products, loading } = useProducts();
  const { whatsappUrl } = useSiteContent();

  const categoryInfo = useMemo(() => resolveCategory(categoryParam), [categoryParam]);

  // Filter products for this specific category (regardless of forSale status — all animals of this category shown)
  const categoryProducts = useMemo(() => {
    if (!categoryInfo) return [];
    return products.filter((p) => {
      if (categoryInfo.canonicalName === 'মুরগি ও হাঁস') {
        return p.category === 'মুরগি ও হাঁস' || (p.category as string) === 'মুরগি' || (p.category as string) === 'হাঁস';
      }
      return p.category === categoryInfo.canonicalName;
    });
  }, [products, categoryInfo]);

  // General WhatsApp inquiry link for this category
  const categoryInquiryUrl = useMemo(() => {
    const text = `আসসালামু আলাইকুম, আমি আপনাদের মজুমদার খামারের "${categoryInfo?.title || 'প্রাণী'}" সম্ভার সম্পর্কে বিস্তারিত জানতে চাই।`;
    return whatsappUrl(text);
  }, [categoryInfo, whatsappUrl]);

  // If invalid category slug provided, redirect back to /products
  if (!loading && !categoryInfo) {
    return <Navigate to="/products" replace />;
  }

  if (!categoryInfo) {
    return null;
  }

  return (
    <PageTransition>
      <div
        id="category-detail-page-wrapper"
        className="relative w-full min-h-screen bg-[#f5efe0] overflow-hidden text-[#1a3a2a] pb-16"
      >
        {/* Corner Botanical Foliage Decorations */}
        <LeafDecoration position="top-left" opacity={0.14} className="-translate-x-8 -translate-y-8" />
        <LeafDecoration position="top-right" opacity={0.15} className="translate-x-6 -translate-y-6" />
        <LeafDecoration position="bottom-left" opacity={0.12} className="-translate-x-8 translate-y-8" />
        <LeafDecoration position="bottom-right" opacity={0.14} className="translate-x-8 translate-y-8" />

        {/* 1. BREADCRUMB ROW */}
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
            <span className="text-[#c0522d] font-bold">{categoryInfo.title}</span>
          </div>
        </div>

        {/* 2. PAGE HEADER SECTION */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-12 pb-8 sm:pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* Small Orange Label: আমাদের [category] সম্ভার */}
            <div className="inline-flex items-center justify-center gap-2 text-[#C95A25] font-bold text-xs sm:text-sm tracking-wide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] -rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>{categoryInfo.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] rotate-45">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
            </div>

            {/* Large bold dark-green heading: category name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003F2D] tracking-tight leading-tight">
              {categoryInfo.title}
            </h1>

            {/* Short centered subtext describing this category */}
            <p className="text-sm sm:text-base md:text-lg text-[#324a3c] leading-relaxed max-w-2xl mx-auto font-normal">
              {categoryInfo.description}
            </p>
          </motion.div>
        </div>

        {/* 3. GRID OF ANIMALS (PURELY INFORMATIONAL - NO PRICES, NO ORDER BUTTONS) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14 sm:mb-20">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#1a3a2a]">
              <div className="w-10 h-10 border-4 border-[#003F2D] border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-sm">তথ্য লোড হচ্ছে...</p>
            </div>
          ) : categoryProducts.length === 0 ? (
            /* EMPTY STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-[#e4dccb] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-[#f5efe0] mx-auto flex items-center justify-center text-3xl">
                {categoryInfo.defaultEmoji}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#1a3a2a]">
                  এই মুহূর্তে এই ক্যাটাগরিতে কোনো তথ্য নেই
                </h3>
                <p className="text-sm text-[#546e5f]">
                  শীঘ্রই আপডেট করা হবে। যেকোনো তথ্য জানতে সরাসরি আমাদের সাথে যোগাযোগ করুন।
                </p>
              </div>
              <a
                href={categoryInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#c0522d] hover:bg-[#a84422] text-white font-bold text-sm shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#c0522d]" />
                <span>হোয়াটসঅ্যাপে জিজ্ঞাসা করুন</span>
              </a>
            </motion.div>
          ) : (
            /* 3-COLUMN DESKTOP / 1-COLUMN MOBILE PRODUCT GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {categoryProducts.map((product, index) => {
                const mainImage = product.images && product.images.length > 0 ? product.images[0] : farmBgPhoto;
                
                // Purely informational category flow: always links to /products/[category]/[slug]
                const targetLink = `/products/${categoryInfo.urlSlug}/${product.slug}`;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-[22px] border border-[#e6dece] shadow-md hover:shadow-xl hover:border-[#003F2D]/40 transition-all duration-300 flex flex-col overflow-hidden text-left h-full group"
                  >
                    <Link to={targetLink} className="block flex flex-col h-full">
                      {/* 1. Product Image (rounded-xl, aspect ~4:3) with status badge top-left */}
                      <div className="relative w-full aspect-[4/3] bg-[#ebe2d3] overflow-hidden">
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        {/* Status badge top-left: green "স্টকে আছে" if inStock, orange "সীমিত সংখ্যক" if isLimited */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          {product.isLimited ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EA580C] text-white text-xs font-bold shadow-md">
                              <span>সীমিত সংখ্যক</span>
                            </span>
                          ) : product.inStock ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#003F2D]/90 text-white text-xs font-bold shadow-md backdrop-blur-xs border border-white/20">
                              <Check className="w-3 h-3 text-[#22c55e] stroke-[3]" />
                              <span>স্টকে আছে</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-600 text-white text-xs font-bold shadow-md">
                              <span>স্টক শেষ</span>
                            </span>
                          )}
                        </div>

                        {/* Small breed tag (e.g. "দেশি", "শাহিওয়াল") top-right */}
                        <div className="absolute top-3.5 right-3.5 z-10">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 text-[#003F2D] text-xs font-bold shadow-md border border-[#D6A21D]/40">
                            <span>{product.breed || product.category}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body Area */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                        <div>
                          {/* 2. Product Name, bold dark-green */}
                          <h3 className="text-xl sm:text-2xl font-black text-[#003F2D] group-hover:text-[#c0522d] transition-colors tracking-tight leading-snug mb-2">
                            {product.name}
                          </h3>

                          {/* 3. Meta info line: "বয়স [age] • ওজন [weight]" */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#546e5f] font-medium mb-3">
                            <span>বয়স {product.age}</span>
                            <span className="text-[#cbd5e1] font-bold">•</span>
                            <span>ওজন {product.weight}</span>
                          </div>

                          {/* Optional short description snippet */}
                          {product.description && (
                            <p className="text-xs sm:text-[13px] text-[#556b5f] line-clamp-2 mb-4 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>

                        {/* 4. Small neutral outlined button at the bottom: white bg, thin dark-green border, dark-green text "বিস্তারিত দেখুন" */}
                        <div className="pt-3 border-t border-[#f0e8dc] mt-auto">
                          <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white group-hover:bg-[#FAF7EE] text-[#003F2D] border border-[#003F2D] font-bold text-sm shadow-xs transition-all duration-200 text-center">
                            <span>বিস্তারিত দেখুন</span>
                            <span className="text-base font-semibold">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. BOTTOM CTA BANNER */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="category-bottom-cta-banner"
            className="relative w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#003F2D] border border-[#D6A21D]/30 shadow-xl p-5 sm:p-8 lg:px-10 lg:py-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6"
          >
            {/* Background Farm Texture with Dark Green Overlay */}
            <img
              src={farmBgPhoto}
              alt="ফার্ম ব্যাকগ্রাউন্ড"
              className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#003F2D] via-[#003F2D]/95 to-[#003F2D]/90 pointer-events-none" />

            {/* Left Side Copy */}
            <div className="relative z-10 space-y-1 text-left w-full md:w-auto">
              <h3 className="text-white text-lg sm:text-2xl font-black tracking-tight">
                নির্দিষ্ট প্রাণী খুঁজে পাচ্ছেন না?
              </h3>
              <p className="text-[#D6A21D] text-xs sm:text-base font-medium">
                আমাদের সাথে যোগাযোগ করুন, আমরা ব্যবস্থা করে দেব।
              </p>
            </div>

            {/* Right Side WhatsApp Button */}
            <div className="relative z-10 w-full md:w-auto">
              <motion.a
                href={categoryInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7EE] active:bg-gray-100 text-[#003F2D] font-bold text-sm sm:text-base shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[48px] text-center"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366] shrink-0" />
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
