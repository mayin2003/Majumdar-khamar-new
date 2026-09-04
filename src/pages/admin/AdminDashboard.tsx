import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useSaleProducts } from '../../context/SaleProductsContext';
import { 
  Package, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles,
  BarChart3,
  Layers,
  PhoneCall,
  Home
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products } = useProducts();
  const { saleProducts } = useSaleProducts();

  // Metrics calculation
  const totalProducts = products.length;
  const totalSaleProducts = saleProducts.length;

  const inStockCount = 
    products.filter(p => p.inStock).length + 
    saleProducts.filter(p => p.inStock).length;

  const limitedCount = 
    products.filter(p => p.isLimited).length + 
    saleProducts.filter(p => p.isLimited).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            স্বাগতম, মজুমদার খামার অ্যাডমিন 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            খামারের গবাদিপশু ও পণ্য ব্যবস্থাপনা, হোমপেজ কনটেন্ট এবং বিক্রয় স্টক একনজরে দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/sales"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <span>➕ নতুন বিক্রয় পণ্য</span>
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-colors border border-gray-200"
          >
            <span>প্রোডাক্টস তালিকা</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: মোট প্রোডাক্ট */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">তথ্য পণ্য</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{totalProducts} টি</div>
              <p className="text-xs text-gray-500 mt-1 font-medium">মোট প্রোডাক্টস (তথ্য)</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#003F2D] hover:underline flex items-center gap-0.5"
            >
              দেখুন <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: মোট বিক্রয় পণ্য */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">বিক্রয় স্টক</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C95A25] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">{totalSaleProducts} টি</div>
              <p className="text-xs text-gray-500 mt-1 font-medium">মোট বিক্রয় পণ্য</p>
            </div>
            <Link
              to="/admin/sales"
              className="text-xs font-semibold text-[#C95A25] hover:underline flex items-center gap-0.5"
            >
              দেখুন <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: স্টকে আছে */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">উপলব্ধ</span>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-800 tracking-tight">{inStockCount} টি</div>
              <p className="text-xs text-gray-500 mt-1 font-medium">স্টকে আছে</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
              সক্রিয়
            </span>
          </div>
        </div>

        {/* Card 4: সীমিত সংখ্যক */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">স্টক সতর্কতা</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-700 tracking-tight">{limitedCount} টি</div>
              <p className="text-xs text-gray-500 mt-1 font-medium">সীমিত সংখ্যক</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-800">
              সীমিত
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin/home"
          className="group bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-[#003F2D] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#003F2D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-gray-900 group-hover:text-[#003F2D] transition-colors">
              হোম কনটেন্ট সম্পাদনা
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              লোগো, হিরো ৩টি ছবি, খামারের ছবি, হেডলাইন, ঠিকানা ও হোয়াটসঅ্যাপ নম্বর পরিবর্তন করুন।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#003F2D]">
            <span>সম্পাদনা করুন</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-[#003F2D] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-gray-900 group-hover:text-[#003F2D] transition-colors">
              প্রোডাক্টস (তথ্য সংগ্রহ)
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              গরু, ছাগল ও মুরগি-হাঁসের জাত ও স্বাস্থ্য তথ্যের ক্যাটালগ পরিচালনা করুন। কোনো মূল্য ছাড়া।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#003F2D]">
            <span>ক্যাটালগ দেখুন</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/sales"
          className="group bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-[#C95A25] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C95A25] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-gray-900 group-hover:text-[#C95A25] transition-colors">
              বিক্রয় পণ্য ও মূল্য তালিকা
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              সরাসরি বিক্রির জন্য নির্দিষ্ট পশু ও পণ্যের মূল্য নির্ধারণ, ছবি ও স্টক পরিচালনা করুন।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#C95A25]">
            <span>বিক্রয় স্টক পরিচালনা</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Analytics Placeholder Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-2xs">
          <BarChart3 className="w-6 h-6 text-[#003F2D]" />
        </div>
        <p className="text-gray-600 font-medium text-sm">
          এখানে শীঘ্রই বিস্তারিত অ্যানালিটিক্স ও চার্ট যোগ করা হবে।
        </p>
        <span className="text-xs text-gray-400 font-sans">
          (দৈনিক ভিজিটর, অনুসন্ধান ট্রেন্ড এবং অর্ডার পরিসংখ্যান)
        </span>
      </div>
    </div>
  );
};
