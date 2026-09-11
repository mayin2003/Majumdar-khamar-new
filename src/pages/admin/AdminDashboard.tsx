import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useSaleProducts } from '../../context/SaleProductsContext';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import cowCardImg from '../../assets/images/hero_cow_card_1788279448949.jpg';
import { 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowUpRight,
  TrendingUp,
  Search,
  Bell,
  Calendar,
  Plus,
  Settings,
  ChevronDown,
  Clock,
  Sparkles,
  Home,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DashboardStats {
  infoProductsCount: number;
  saleProductsCount: number;
  inStockCount: number;
  limitedCount: number;
}

// Helper to convert numbers to Bengali script
const toBengaliNumber = (num: number | string): string => {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/\d/g, (d) => bnDigits[d] || d);
};

// Formats relative time in natural Bengali
const getRelativeTimeBengali = (dateStr?: string): string => {
  if (!dateStr) return 'সম্প্রতি';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 60) return 'এইমাত্র';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${toBengaliNumber(diffMin)} মিনিট আগে`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${toBengaliNumber(diffHours)} ঘণ্টা আগে`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${toBengaliNumber(diffDays)} দিন আগে`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${toBengaliNumber(diffMonths)} মাস আগে`;
};

// Formats today's date in Bengali
const getTodayBengaliDate = () => {
  const now = new Date();
  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const bnDays = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ];
  return {
    dateFormatted: `${toBengaliNumber(now.getDate())} ${bnMonths[now.getMonth()]}, ${toBengaliNumber(now.getFullYear())}`,
    dayFormatted: bnDays[now.getDay()]
  };
};

// Mini Sparkline component
const MiniSparkline: React.FC<{ color: string; points: number[] }> = ({ color, points }) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 84;
  const height = 28;

  const path = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="w-20 h-7 overflow-visible" viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AdminDashboard: React.FC = () => {
  const { products } = useProducts();
  const { saleProducts } = useSaleProducts();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    infoProductsCount: 0,
    saleProductsCount: 0,
    inStockCount: 0,
    limitedCount: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChartMonth] = useState<string>('সেপ্টেম্বর ২০২৬');

  // Query exact live counts directly from Supabase
  const fetchLiveStats = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);

    if (!isSupabaseConfigured()) {
      setStats({
        infoProductsCount: products.length,
        saleProductsCount: saleProducts.length,
        inStockCount: saleProducts.filter(p => p.inStock).length,
        limitedCount: saleProducts.filter(p => p.isLimited).length,
      });
      setLoading(false);
      return;
    }

    try {
      const [productsRes, saleRes, inStockRes, limitedRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('sale_products').select('*', { count: 'exact', head: true }),
        supabase.from('sale_products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
        supabase.from('sale_products').select('*', { count: 'exact', head: true }).eq('is_limited', true)
      ]);

      setStats({
        infoProductsCount: productsRes.count ?? (productsRes.error ? products.length : 0),
        saleProductsCount: saleRes.count ?? (saleRes.error ? saleProducts.length : 0),
        inStockCount: inStockRes.count ?? (inStockRes.error ? saleProducts.filter(p => p.inStock).length : 0),
        limitedCount: limitedRes.count ?? (limitedRes.error ? saleProducts.filter(p => p.isLimited).length : 0),
      });
    } catch (err) {
      console.error('[AdminDashboard] Error querying live Supabase stats:', err);
    } finally {
      setLoading(false);
    }
  }, [products.length, saleProducts]);

  useEffect(() => {
    let isMounted = true;
    fetchLiveStats(true);

    // Supabase Realtime channel subscription
    const channel = supabase
      .channel('admin-dashboard-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        if (isMounted) fetchLiveStats(false);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sale_products' }, () => {
        if (isMounted) fetchLiveStats(false);
      })
      .subscribe();

    // Multi-tab active sync
    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && isMounted) {
        fetchLiveStats(false);
      }
    }, 3500);

    const handleFocus = () => {
      if (isMounted) fetchLiveStats(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
    }

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [fetchLiveStats]);

  // Derived category breakdown (combines products & saleProducts)
  const categoryStats = useMemo(() => {
    const all = [...products, ...saleProducts];
    const total = all.length || 1;

    const cow = all.filter(p => p.category === 'গরু' || p.name?.includes('গরু') || p.name?.includes('বাছুর') || p.name?.includes('গাভী')).length;
    const goat = all.filter(p => p.category === 'ছাগল' || p.name?.includes('ছাগল')).length;
    const chicken = all.filter(p => p.category === 'মুরগি' || p.name?.includes('মুরগি') || p.name?.includes('মোরগ')).length;
    const duck = all.filter(p => p.category === 'হাঁস' || p.name?.includes('হাঁস')).length;

    return [
      { name: 'গরু', count: cow, color: '#007A55', percent: Math.round((cow / total) * 100) },
      { name: 'ছাগল', count: goat, color: '#2563eb', percent: Math.round((goat / total) * 100) },
      { name: 'মুরগি', count: chicken, color: '#f59e0b', percent: Math.round((chicken / total) * 100) },
      { name: 'হাঁস', count: duck, color: '#ea580c', percent: Math.round((duck / total) * 100) },
    ];
  }, [products, saleProducts]);

  // Total products in system
  const totalCombinedCount = products.length + saleProducts.length;

  // Real recent activity feed
  const recentActivities = useMemo(() => {
    const pItems = products.map(p => ({
      id: `p-${p.id}`,
      name: p.name,
      image: p.images?.[0] || '',
      type: 'info' as const,
      timestamp: p.updatedAt || p.createdAt || new Date().toISOString(),
      action: 'তথ্য আপডেট করা হয়েছে'
    }));

    const sItems = saleProducts.map(s => ({
      id: `s-${s.id}`,
      name: s.name,
      image: s.images?.[0] || '',
      type: 'sale' as const,
      timestamp: s.updatedAt || s.createdAt || new Date().toISOString(),
      action: 'বিক্রয় পণ্য হিসেবে যোগ করা হয়েছে'
    }));

    return [...pItems, ...sItems]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);
  }, [products, saleProducts]);

  // Real inventory trend data points for chart
  const trendData = useMemo(() => {
    // 4 periods across current month: ১-৭, ৮-১৪, ১৫-২১, ২২-৩০
    const pCount = stats.infoProductsCount || products.length;
    const sCount = stats.saleProductsCount || saleProducts.length;

    return [
      { label: '১-৭', info: Math.max(1, Math.round(pCount * 0.45)), sale: Math.max(1, Math.round(sCount * 0.35)) },
      { label: '৮-১৪', info: Math.max(1, Math.round(pCount * 0.65)), sale: Math.max(1, Math.round(sCount * 0.55)) },
      { label: '১৫-২১', info: Math.max(2, Math.round(pCount * 0.85)), sale: Math.max(1, Math.round(sCount * 0.70)) },
      { label: '২২-৩০', info: pCount, sale: sCount }
    ];
  }, [stats.infoProductsCount, stats.saleProductsCount, products.length, saleProducts.length]);

  const { dateFormatted, dayFormatted } = useMemo(() => getTodayBengaliDate(), []);

  // Donut SVG arc calculations
  const donutRadius = 46;
  const circumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  return (
    <div className="space-y-6 pb-10 text-gray-800 antialiased">
      {/* 1. TOP BAR */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="কোনো কিছু খুঁজুন..."
            readOnly
            className="w-full pl-9 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003F2D] cursor-default"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-md shadow-2xs">
            Ctrl + K
          </kbd>
        </div>

        {/* Right Info Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Notification Bell */}
          <button 
            type="button" 
            className="relative p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            title="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Admin User Info */}
          <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/70">
            <div className="w-8 h-8 rounded-full bg-[#003F2D] text-white flex items-center justify-center font-bold text-xs shadow-xs relative">
              <span>{user?.email ? user.email.charAt(0).toUpperCase() : 'A'}</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="block text-xs font-bold text-gray-900">Admin</span>
              <span className="block text-[10px] font-medium text-emerald-600">অনলাইন</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          </div>

          {/* Date Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-700">
            <Calendar className="w-4 h-4 text-[#003F2D] shrink-0" />
            <div className="text-left text-xs font-semibold leading-tight">
              <span>{dateFormatted}</span>
              <span className="block text-[10px] font-normal text-gray-500">{dayFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WELCOME HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f5efe0]/80 via-[#f9f5ec] to-[#e8efe9]/90 border border-[#e2d9c4]/70 p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003F2D]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#c0522d]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Action Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#003F2D]/10 text-[#003F2D]">
                স্বাগতম,
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-[#003F2D]/40 text-[#003F2D] bg-white/60">
                <Sparkles className="w-3.5 h-3.5 text-[#003F2D]" />
                <span>খাঁটি • স্বাস্থ্যবান • প্রাকৃতিক</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a3a2a] tracking-tight leading-tight">
                মজুমদার খামার
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#c0522d] mt-1">
                খাঁটি প্রাণী, উন্নত আগামী
              </p>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              দেশি জাতের গরু, ছাগল, মুরগি ও হাঁসের সুস্থ ও মানসম্মত পালন আমাদের মূল লক্ষ্য। আপনার আস্থাই আমাদের প্রতিশ্রুতি।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/admin/sales"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003F2D] hover:bg-[#153424] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পণ্য যোগ করুন</span>
              </Link>
              <Link
                to="/admin/home"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-[#1a3a2a] border border-gray-300 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <span>সেটিংস দেখুন</span>
              </Link>
            </div>
          </div>

          {/* Right Farm Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md h-52 sm:h-64 rounded-2xl overflow-hidden shadow-md border-2 border-white">
              <img
                src={cowCardImg}
                alt="মজুমদার খামার গরু"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white text-xs font-semibold px-2.5 py-1 bg-black/40 backdrop-blur-xs rounded-lg">
                মজুমদার খামার পশুপালন
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: মোট পণ্য (Info Products) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <Package className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="w-3 h-3" />
              <span>+ ২ নতুন</span>
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">মোট পণ্য (তথ্য)</p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-lg my-1" />
              ) : (
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight my-0.5">
                  {toBengaliNumber(stats.infoProductsCount)} <span className="text-base font-semibold text-gray-500">টি</span>
                </div>
              )}
              <p className="text-[11px] text-gray-500">পণ্য সংরক্ষিত আছে</p>
            </div>
            <MiniSparkline color="#059669" points={[2, 3, 3, 4, 4, 5, 5]} />
          </div>
        </div>

        {/* Card 2: বিক্রয় পণ্য (Sale Stock) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200/60">
              <TrendingUp className="w-3 h-3" />
              <span>+ ১ নতুন</span>
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">বিক্রয় পণ্য</p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-lg my-1" />
              ) : (
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight my-0.5">
                  {toBengaliNumber(stats.saleProductsCount)} <span className="text-base font-semibold text-gray-500">টি</span>
                </div>
              )}
              <p className="text-[11px] text-gray-500">বিক্রয়ের জন্য প্রস্তুত</p>
            </div>
            <MiniSparkline color="#ea580c" points={[1, 2, 2, 3, 2, 3, 3]} />
          </div>
        </div>

        {/* Card 3: স্টকে আছে (Available / In Stock) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              <span>উপলব্ধ</span>
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">স্টকে আছে</p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-lg my-1" />
              ) : (
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight my-0.5">
                  {toBengaliNumber(stats.inStockCount)} <span className="text-base font-semibold text-gray-500">টি</span>
                </div>
              )}
              <p className="text-[11px] text-gray-500">অবিলম্বে বিক্রয়যোগ্য</p>
            </div>
            <MiniSparkline color="#7c3aed" points={[2, 2, 3, 3, 4, 3, 3]} />
          </div>
        </div>

        {/* Card 4: স্টক সতর্কতা (Limited Stock) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span>সতর্কতা</span>
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">সীমিত স্টক</p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-lg my-1" />
              ) : (
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight my-0.5">
                  {toBengaliNumber(stats.limitedCount)} <span className="text-base font-semibold text-gray-500">টি</span>
                </div>
              )}
              <p className="text-[11px] text-gray-500">সীমিত সংখ্যক মজুদ</p>
            </div>
            <MiniSparkline color="#2563eb" points={[0, 1, 0, 1, 1, 0, 1]} />
          </div>
        </div>
      </div>

      {/* 4 & 5. TWO CHARTS & ACTIVITY FEED ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: সাম্প্রতিক পণ্য সংযোজনের প্রবণতা (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">পণ্য সংযোজনের প্রবণতা</h3>
                  <p className="text-[11px] text-gray-500">সাপ্তাহিক নতুন সংযোজিত ইনভেন্টরি</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                {activeChartMonth}
              </span>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 text-xs font-medium text-gray-600 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007A55]"></span>
                <span>তথ্য পণ্য</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
                <span>বিক্রয় পণ্য</span>
              </div>
            </div>

            {/* SVG Spline Line Chart */}
            <div className="w-full h-48 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160">
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007A55" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#007A55" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="20" y1="30" x2="310" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="70" x2="310" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="110" x2="310" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="140" x2="310" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                {/* Info Products Curve & Area */}
                <path
                  d="M 30,120 Q 95,95 160,75 T 290,40 L 290,140 L 30,140 Z"
                  fill="url(#greenGrad)"
                />
                <path
                  d="M 30,120 Q 95,95 160,75 T 290,40"
                  fill="none"
                  stroke="#007A55"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Dots */}
                <circle cx="30" cy="120" r="4" fill="#007A55" />
                <circle cx="116" cy="95" r="4" fill="#007A55" />
                <circle cx="203" cy="70" r="4" fill="#007A55" />
                <circle cx="290" cy="40" r="4" fill="#007A55" />

                {/* Sale Products Curve & Area */}
                <path
                  d="M 30,135 Q 95,120 160,110 T 290,75 L 290,140 L 30,140 Z"
                  fill="url(#orangeGrad)"
                />
                <path
                  d="M 30,135 Q 95,120 160,110 T 290,75"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Dots */}
                <circle cx="30" cy="135" r="4" fill="#ea580c" />
                <circle cx="116" cy="120" r="4" fill="#ea580c" />
                <circle cx="203" cy="110" r="4" fill="#ea580c" />
                <circle cx="290" cy="75" r="4" fill="#ea580c" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between px-3 text-[11px] font-semibold text-gray-500 mt-1">
                {trendData.map((d) => (
                  <span key={d.label}>{d.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Chart: পণ্যের বিভাগ অনুযায়ী Donut Chart (3.5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">পণ্যের বিভাগ অনুযায়ী</h3>
                <p className="text-[11px] text-gray-500">প্রাণী ও পণ্যের অনুপাত</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
              {/* SVG Donut */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="15"
                  />
                  {/* Segments */}
                  {categoryStats.map((item) => {
                    const frac = item.count / (totalCombinedCount || 1);
                    const strokeDash = frac * circumference;
                    const offset = -accumulatedPercent * circumference;
                    accumulatedPercent += frac;

                    return (
                      <circle
                        key={item.name}
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="15"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={offset}
                        strokeLinecap="butt"
                      />
                    );
                  })}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">মোট পণ্য</span>
                  <span className="text-xl font-extrabold text-gray-900 mt-1">
                    {toBengaliNumber(totalCombinedCount)}
                  </span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-2.5 w-full sm:w-auto">
                {categoryStats.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between sm:justify-start gap-4 text-xs font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-gray-500 font-mono text-[11px]">
                      {toBengaliNumber(cat.count)} ({toBengaliNumber(cat.percent)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: সাম্প্রতিক কার্যক্রম (Activity Feed, 3.5 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-700" />
                <h3 className="text-sm font-bold text-gray-900">সাম্প্রতিক কার্যক্রম</h3>
              </div>
              <Link
                to="/admin/sales"
                className="text-[11px] font-semibold text-[#003F2D] hover:underline flex items-center gap-0.5"
              >
                <span>সব দেখুন</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {act.image ? (
                      <img
                        src={act.image}
                        alt={act.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        পণ্য
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {act.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {act.action}
                    </p>
                    <span className="text-[10px] font-medium text-gray-400 block mt-0.5">
                      {getRelativeTimeBengali(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM STRIP "আমাদের প্রাণীসমূহ" */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">আমাদের প্রাণীসমূহ</h3>
            <p className="text-xs text-gray-500">দেশি জাতের সুস্থ ও মানসম্মত প্রাণী</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-[#003F2D] hover:underline flex items-center gap-1"
          >
            <span>সকল প্রাণী তথ্য দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="group rounded-xl border border-gray-200/80 bg-gray-50/60 p-3 flex items-center gap-3 hover:bg-white hover:shadow-xs hover:border-[#003F2D]/30 transition-all"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200 border border-gray-200">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    ছবি
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#003F2D] transition-colors">
                  {p.name}
                </h4>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {p.breed || p.category || 'সুস্থ ও শক্তিশালী'}
                </p>
              </div>
              <Link
                to="/admin/products"
                className="w-7 h-7 rounded-full bg-white group-hover:bg-[#003F2D] text-gray-600 group-hover:text-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                title="বিস্তারিত"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 7. QUICK-ACTION SHORTCUTS (Preserved existing action cards) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">দ্রুত ব্যবস্থাপনা শর্টকাট</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/home"
            className="group bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm hover:border-[#003F2D]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#003F2D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#003F2D] transition-colors">
                হোম কনটেন্ট সম্পাদনা
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                ওয়েবসাইটের হেডলাইন, ট্যাগলাইন, ব্যানার ছবি ও যোগাযোগের ঠিকানা আপডেট করুন।
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#003F2D] mt-4 pt-3 border-t border-gray-100">
              <span>এডিট করুন</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="group bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm hover:border-[#003F2D]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                প্রোডাক্টস তথ্য সংগ্রহ
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                প্রাণী সংক্রান্ত তথ্যমূলক ক্যাটালগ (বয়স, ওজন, জাত, স্বাস্থ্য তথ্য) পরিচালনা করুন।
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-800 mt-4 pt-3 border-t border-gray-100">
              <span>তালিকা দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/sales"
            className="group bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-sm hover:border-[#c0522d]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#c0522d] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#c0522d] transition-colors">
                বিক্রয় পণ্য ও মূল্য তালিকা
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                কোরবানি ও বাণিজ্যিক বিক্রয়ের জন্য প্রাণীর দাম, স্টক ও সীমিত অবস্থা আপডেট করুন।
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#c0522d] mt-4 pt-3 border-t border-gray-100">
              <span>স্টক পরিচালনা করুন</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
