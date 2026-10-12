import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Home, 
  Package, 
  ShoppingBag, 
  Search 
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { tagline, whatsappUrl, location: farmLocation, phone } = useSiteContent();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
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
  }, [mobileMenuOpen, searchOpen]);

  const headerWhatsappUrl = whatsappUrl('আসসালামু আলাইকুম, আমি সরাসরি খামারের প্রতিনিধির সাথে কথা বলতে চাই।');
  const formattedPhone = (phone || '01838752049').replace(/\D/g, '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Shared Floating Pill Header */}
      <header
        id="main-site-header"
        className="sticky top-0 z-40 w-full px-2.5 sm:px-6 pt-2.5 sm:pt-4 pb-2 transition-all duration-300 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto bg-[#0b3d2b] text-white rounded-full shadow-xl shadow-black/20 border border-[#14803c]/30 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto transition-transform">
          
          {/* Left: Round logo with white + gold ring, site name & tagline */}
          <Link
            to="/"
            id="header-brand-logo-link"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none min-w-0 shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-0.5 rounded-full ring-2 ring-[#f2b705] bg-white shadow-xs shrink-0"
            >
              <CowLogo size="md" className="border-0 !p-0.5" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-base sm:text-xl lg:text-2xl font-black font-headline tracking-tight leading-tight truncate">
                মজুমদার খামার
              </span>
              <span className="text-[#f2b705] text-[10px] sm:text-[12px] font-semibold tracking-wide leading-none mt-0.5 truncate">
                {tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-2 xl:gap-5">
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
                  onMouseEnter={() => {
                    if (item.path === '/products') {
                      import('../../pages/ProductsPage');
                    }
                  }}
                  onTouchStart={() => {
                    if (item.path === '/products') {
                      import('../../pages/ProductsPage');
                    }
                  }}
                  className={`relative px-3 py-1.5 text-[15px] xl:text-base font-semibold transition-colors duration-200 ${
                    isActive ? 'text-[#f2b705]' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-2 right-2 h-[2.5px] bg-[#f2b705] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Round search button + mid-green pill WhatsApp button + mobile toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Round Search Button (slightly lighter green) */}
            <motion.button
              type="button"
              id="header-search-btn"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="পণ্য খুঁজুন"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#14803c]/45 hover:bg-[#14803c]/75 active:bg-[#14803c] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#14803c]/40 shrink-0"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </motion.button>

            {/* Mid-Green Pill Button "সরাসরি কথা বলুন" */}
            <motion.a
              href={headerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-cta-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#14803c] hover:bg-[#116e34] active:bg-[#0e5c2b] text-white px-3 sm:px-4.5 py-1.5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer border border-white/10 shrink-0 min-h-[36px] sm:min-h-[42px]"
            >
              <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-white shrink-0" />
              <span className="hidden xs:inline">সরাসরি কথা বলুন</span>
              <span className="xs:hidden text-[11px]">চ্যাট</span>
            </motion.a>

            {/* Mobile Hamburger Toggle for < lg */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none shrink-0 cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-[#0b3d2b] font-bold text-base sm:text-lg">
                  <Search className="w-5 h-5 text-[#14803c]" />
                  <span>খামারের প্রাণী বা পণ্য খুঁজুন</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="যেমন: শাহিওয়াল গরু, ব্ল্যাক বেঙ্গল ছাগল, হাঁস..."
                    autoFocus
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14803c] focus:border-transparent text-sm sm:text-base"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>জনপ্রিয়:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/products/গরু');
                        setSearchOpen(false);
                      }}
                      className="hover:text-[#14803c] underline cursor-pointer"
                    >
                      গরু
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/products/ছাগল');
                        setSearchOpen(false);
                      }}
                      className="hover:text-[#14803c] underline cursor-pointer"
                    >
                      ছাগল
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/products/মুরগি ও হাঁস');
                        setSearchOpen(false);
                      }}
                      className="hover:text-[#14803c] underline cursor-pointer"
                    >
                      হাঁস-মুরগি
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0b3d2b] hover:bg-[#14803c] text-white text-sm font-semibold transition-colors"
                  >
                    খুঁজুন
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-in Drawer with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0b3d2b] border-l border-white/10 z-50 flex flex-col p-5 sm:p-6 shadow-2xl lg:hidden overflow-y-auto"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-0.5 rounded-full ring-2 ring-[#f2b705] bg-white shrink-0">
                    <CowLogo size="sm" className="border-0" />
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold font-headline leading-tight">মজুমদার খামার</h2>
                    <p className="text-[#f2b705] text-xs">{tagline || 'প্রকৃতি থেকে, আপনার টেবিলে'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="মেনু বন্ধ করুন"
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
                      onTouchStart={() => {
                        if (item.path === '/products') {
                          import('../../pages/ProductsPage');
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base sm:text-lg font-medium transition-all active:scale-[0.98] min-h-[48px] ${
                        isActive
                          ? 'bg-[#14803c] text-white font-bold shadow-sm'
                          : 'text-gray-200 hover:bg-white/5 active:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#f2b705]' : 'text-gray-400'}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Contact Information in Mobile Drawer */}
              <div className="mt-auto pt-5 border-t border-white/10 space-y-4">
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#f2b705] shrink-0 mt-0.5" />
                    <span>{farmLocation || 'উত্তর রাজেশপুর, পরশুরাম, ফেনী'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#f2b705] shrink-0" />
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
                    className="flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#14803c] text-white text-sm font-semibold hover:bg-[#116e34] active:bg-[#0e5c2b] transition-colors text-center"
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex justify-around items-center px-1 py-1"
        style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {/* 1. হোম */}
        <Link
          to="/"
          id="mobile-nav-tab-home"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] ${
            location.pathname === '/'
              ? 'text-[#0b3d2b] bg-[#14803c]/10 font-bold scale-105'
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
          onTouchStart={() => {
            import('../../pages/ProductsPage');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-h-[48px] min-w-[62px] ${
            location.pathname.startsWith('/products')
              ? 'text-[#0b3d2b] bg-[#14803c]/10 font-bold scale-105'
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
              ? 'text-[#0b3d2b] bg-[#14803c]/10 font-bold scale-105'
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
              ? 'text-[#0b3d2b] bg-[#14803c]/10 font-bold scale-105'
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
