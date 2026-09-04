import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Phone, MapPin, ChevronRight, Home, Package, ShoppingBag } from 'lucide-react';
import { CowLogo } from '../ui/CowLogo';
import { useSiteContent } from '../../context/SiteContentContext';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'হোম', path: '/' },
  { name: 'প্রোডাক্টস', path: '/products' },
  { name: 'বিক্রয় পণ্য', path: '/sales' },
  { name: 'আমাদের কথা', path: '/about' },
  { name: 'যোগাযোগ', path: '/contact' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logoUrl, tagline, whatsappUrl, location: farmLocation, phone } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & prevent background body scroll when open
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const headerWhatsappUrl = whatsappUrl('আসসালামু আলাইকুম, আমি মজুমদার খামার সম্পর্কে জানতে চাই।');
  const formattedPhone = (phone || '01838752049').replace(/\D/g, '');

  return (
    <>
      <header
        id="main-site-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#003F2D] shadow-lg shadow-black/25 py-2 sm:py-2.5 md:py-3'
            : 'bg-[#003F2D] py-2.5 sm:py-3.5 md:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Logo & Brand Name on Left */}
          <Link
            to="/"
            id="header-brand-logo-link"
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none min-w-0"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <CowLogo size="md" showBorder={true} />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-lg sm:text-2xl font-black tracking-tight leading-tight truncate">
                মজুমদার খামার
              </span>
              <span className="text-[#D6A21D] text-[11px] sm:text-[13px] font-medium tracking-wide leading-none mt-0.5 truncate">
                {tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : item.path === '/sales'
                  ? location.pathname.startsWith('/sales') || location.pathname.startsWith('/sale-products')
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  id={`nav-link-${item.path.replace('/', '') || 'home'}`}
                  className={`relative px-3 py-1.5 text-[15px] sm:text-base font-semibold transition-colors duration-200 ${
                    isActive ? 'text-[#D6A21D]' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-2 right-2 h-[3px] bg-[#D6A21D] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: WhatsApp Pill Button & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <motion.a
              href={headerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-cta-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#097b52] hover:bg-[#076945] text-white px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer border border-[#149d6b]/40 min-h-[40px] sm:min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white shrink-0" />
              <span className="hidden xs:inline">হোয়াটসঅ্যাপ</span>
            </motion.a>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none shrink-0 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-sm bg-[#003F2D] border-l border-white/10 z-50 flex flex-col p-5 sm:p-6 shadow-2xl lg:hidden overflow-y-auto"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CowLogo size="sm" showBorder={true} />
                  <div>
                    <h2 className="text-white text-lg font-bold leading-tight">মজুমদার খামার</h2>
                    <p className="text-[#D6A21D] text-xs">{tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-2 py-5">
                {navItems.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : item.path === '/sales'
                      ? location.pathname.startsWith('/sales') || location.pathname.startsWith('/sale-products')
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base sm:text-lg font-medium transition-all active:scale-[0.98] min-h-[48px] ${
                        isActive
                          ? 'bg-[#C95A25] text-white font-bold shadow-sm'
                          : 'text-gray-200 hover:bg-white/5 active:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Contact Information in Mobile Drawer */}
              <div className="mt-auto pt-5 border-t border-white/10 space-y-4">
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C95A25] shrink-0 mt-0.5" />
                    <span>{farmLocation || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#C95A25] shrink-0" />
                    <span>{phone || '০১৮৩৮৭৫২০৪৯'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <a
                    href={`tel:${formattedPhone}`}
                    className="flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm font-semibold transition-colors text-center"
                  >
                    <Phone className="w-4 h-4" />
                    <span>কল করুন</span>
                  </a>
                  <a
                    href={headerWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#097b52] text-white text-sm font-semibold hover:bg-[#076945] active:bg-[#065839] transition-colors text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Navigation Bar (< 768px / md:hidden) */}
      <nav
        id="public-mobile-bottom-nav"
        aria-label="মোবাইল নেভিগেশন"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex justify-around items-center px-1 py-1"
        style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {/* 1. হোম */}
        <Link
          to="/"
          id="mobile-nav-tab-home"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] ${
            location.pathname === '/'
              ? 'text-[#003F2D] bg-emerald-50/90 font-bold scale-105'
              : 'text-gray-500 hover:text-gray-900 active:bg-gray-100 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 shrink-0 ${location.pathname === '/' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-tight">হোম</span>
        </Link>

        {/* 2. প্রোডাক্টস */}
        <Link
          to="/products"
          id="mobile-nav-tab-products"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] ${
            location.pathname.startsWith('/products')
              ? 'text-[#003F2D] bg-emerald-50/90 font-bold scale-105'
              : 'text-gray-500 hover:text-gray-900 active:bg-gray-100 font-medium'
          }`}
        >
          <Package className={`w-5 h-5 mb-0.5 shrink-0 ${location.pathname.startsWith('/products') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-tight">প্রোডাক্টস</span>
        </Link>

        {/* 3. বিক্রয় পণ্য */}
        <Link
          to="/sale-products"
          id="mobile-nav-tab-sale-products"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] ${
            location.pathname.startsWith('/sale-products') || location.pathname.startsWith('/sales')
              ? 'text-[#003F2D] bg-emerald-50/90 font-bold scale-105'
              : 'text-gray-500 hover:text-gray-900 active:bg-gray-100 font-medium'
          }`}
        >
          <ShoppingBag
            className={`w-5 h-5 mb-0.5 shrink-0 ${
              location.pathname.startsWith('/sale-products') || location.pathname.startsWith('/sales')
                ? 'stroke-[2.5]'
                : 'stroke-2'
            }`}
          />
          <span className="text-[11px] leading-tight">বিক্রয় পণ্য</span>
        </Link>

        {/* 4. মেনু */}
        <button
          type="button"
          id="mobile-nav-tab-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] cursor-pointer ${
            mobileMenuOpen || location.pathname === '/about' || location.pathname === '/contact'
              ? 'text-[#003F2D] bg-emerald-50/90 font-bold scale-105'
              : 'text-gray-500 hover:text-gray-900 active:bg-gray-100 font-medium'
          }`}
          aria-label="মোবাইল মেনু খুলুন"
        >
          <Menu
            className={`w-5 h-5 mb-0.5 shrink-0 ${
              mobileMenuOpen || location.pathname === '/about' || location.pathname === '/contact'
                ? 'stroke-[2.5]'
                : 'stroke-2'
            }`}
          />
          <span className="text-[11px] leading-tight">মেনু</span>
        </button>
      </nav>
    </>
  );
};

