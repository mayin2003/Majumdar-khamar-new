import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  SaleProductFilters,
  CategoryFilter,
  GenderFilter,
  AgeFilter,
  WeightFilter,
  PricePreset,
  SortOption,
  getActiveFilterCount,
} from '../../utils/saleProductFilter';
import { toBengaliNumber } from '../../utils/bengali';

interface SaleProductFilterBarProps {
  filters: SaleProductFilters;
  onChange: (updated: Partial<SaleProductFilters>) => void;
  onReset: () => void;
  totalMatches: number;
  categoryCounts: {
    all: number;
    cow: number;
    goat: number;
    poultry: number;
  };
}

export const SaleProductFilterBar: React.FC<SaleProductFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalMatches,
  categoryCounts,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showCustomPrice, setShowCustomPrice] = useState(
    filters.pricePreset === 'custom' || filters.minPrice !== '' || filters.maxPrice !== ''
  );

  const activeFilterCount = getActiveFilterCount(filters);

  const handleReset = () => {
    setShowCustomPrice(false);
    onReset();
  };

  const handleCategoryClick = (cat: CategoryFilter) => {
    onChange({ category: cat });
  };

  const handlePricePresetClick = (preset: PricePreset) => {
    if (preset === 'custom') {
      setShowCustomPrice(true);
      onChange({ pricePreset: 'custom' });
    } else {
      setShowCustomPrice(false);
      onChange({
        pricePreset: preset,
        minPrice: '',
        maxPrice: '',
      });
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5 mb-8">
      {/* 1. MAIN SEARCH & CATEGORY BAR */}
      <div className="bg-white rounded-2xl sm:rounded-[22px] border border-[#e8dfce] shadow-sm p-4 sm:p-5 transition-all">
        {/* Search input with icons */}
        <div className="relative flex items-center mb-4">
          <div className="absolute left-4 text-[#003F2D]/60 pointer-events-none flex items-center">
            <Search className="w-5 h-5 text-[#003F2D]" />
          </div>
          <input
            id="animal-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="পশুর নাম, জাত বা কোড দিয়ে খুঁজুন... (যেমন: দেশি বাছুর, শাহিওয়াল, ব্ল্যাক বেঙ্গল)"
            className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-[#FAF7EE] rounded-xl sm:rounded-2xl border border-[#D6A21D]/30 text-sm sm:text-base text-[#1a3a2a] placeholder-[#7d8f85] focus:outline-none focus:ring-2 focus:ring-[#003F2D] focus:border-transparent transition-all shadow-inner"
          />
          {filters.search && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => onChange({ search: '' })}
              aria-label="অনুসন্ধান মুছুন"
              className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Pills & Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-gray-100">
          {/* Category Tabs */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            {/* সব */}
            <button
              type="button"
              id="filter-cat-all"
              onClick={() => handleCategoryClick('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer min-h-[38px] ${
                filters.category === 'all'
                  ? 'bg-[#003F2D] text-white shadow-xs'
                  : 'bg-[#FAF7EE] text-[#003F2D] border border-[#D6A21D]/40 hover:border-[#003F2D] hover:bg-white'
              }`}
            >
              <div className="grid grid-cols-2 gap-0.5 w-3 h-3 shrink-0">
                <div className={`w-1 h-1 rounded-[1px] ${filters.category === 'all' ? 'bg-white' : 'bg-[#003F2D]'}`} />
                <div className={`w-1 h-1 rounded-[1px] ${filters.category === 'all' ? 'bg-white' : 'bg-[#003F2D]'}`} />
                <div className={`w-1 h-1 rounded-[1px] ${filters.category === 'all' ? 'bg-white' : 'bg-[#003F2D]'}`} />
                <div className={`w-1 h-1 rounded-[1px] ${filters.category === 'all' ? 'bg-white' : 'bg-[#003F2D]'}`} />
              </div>
              <span>সব ({toBengaliNumber(categoryCounts.all)})</span>
            </button>

            {/* গরু */}
            <button
              type="button"
              id="filter-cat-cow"
              onClick={() => handleCategoryClick('গরু')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer min-h-[38px] ${
                filters.category === 'গরু'
                  ? 'bg-[#003F2D] text-white shadow-xs'
                  : 'bg-[#FAF7EE] text-[#003F2D] border border-[#D6A21D]/40 hover:border-[#003F2D] hover:bg-white'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] shrink-0">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>গরু ({toBengaliNumber(categoryCounts.cow)})</span>
            </button>

            {/* ছাগল */}
            <button
              type="button"
              id="filter-cat-goat"
              onClick={() => handleCategoryClick('ছাগল')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer min-h-[38px] ${
                filters.category === 'ছাগল'
                  ? 'bg-[#003F2D] text-white shadow-xs'
                  : 'bg-[#FAF7EE] text-[#003F2D] border border-[#D6A21D]/40 hover:border-[#003F2D] hover:bg-white'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] shrink-0">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>ছাগল ({toBengaliNumber(categoryCounts.goat)})</span>
            </button>

            {/* মুরগি ও হাঁস */}
            <button
              type="button"
              id="filter-cat-poultry"
              onClick={() => handleCategoryClick('মুরগি ও হাঁস')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer min-h-[38px] ${
                filters.category === 'মুরগি ও হাঁস'
                  ? 'bg-[#003F2D] text-white shadow-xs'
                  : 'bg-[#FAF7EE] text-[#003F2D] border border-[#D6A21D]/40 hover:border-[#003F2D] hover:bg-white'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#D6A21D] shrink-0">
                <path d="M17 8C8 10 5 16 3 22C9 20 15 17 21 11C21 8 20 8 17 8Z" />
              </svg>
              <span>মুরগি ও হাঁস ({toBengaliNumber(categoryCounts.poultry)})</span>
            </button>
          </div>

          {/* Quick Controls: Mobile Toggle & Desktop Quick Reset / Sort Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0">
            {/* Mobile Filter Button */}
            <button
              type="button"
              id="mobile-filters-toggle-btn"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF7EE] text-[#003F2D] border border-[#D6A21D]/40 hover:border-[#003F2D] font-bold text-xs shadow-xs cursor-pointer min-h-[38px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C95A25]" />
              <span>ফিল্টার ও সাজান</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C95A25] text-white text-[11px] flex items-center justify-center font-bold">
                  {toBengaliNumber(activeFilterCount)}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileDrawerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Reset Button (visible whenever any filter is active) */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                id="quick-reset-filters-btn"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#C95A25] hover:bg-[#C95A25]/10 border border-[#C95A25]/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফিল্টার রিসেট করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ADVANCED FILTER & SORT PANEL (Desktop inline + Mobile expandable) */}
      <div
        className={`bg-white rounded-2xl sm:rounded-[22px] border border-[#e8dfce] shadow-sm p-4 sm:p-6 transition-all duration-300 ${
          isMobileDrawerOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-start">
          
          {/* Filter 1: লিঙ্গ (Gender) */}
          <div className="space-y-1.5">
            <label htmlFor="filter-select-gender" className="block text-xs font-bold text-[#003F2D] tracking-tight">
              লিঙ্গ
            </label>
            <div className="relative">
              <select
                id="filter-select-gender"
                value={filters.gender}
                onChange={(e) => onChange({ gender: e.target.value as GenderFilter })}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A21D]/30 text-xs sm:text-sm font-semibold text-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#003F2D] appearance-none cursor-pointer"
              >
                <option value="all">সব লিঙ্গ</option>
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filter 2: বয়স (Age) */}
          <div className="space-y-1.5">
            <label htmlFor="filter-select-age" className="block text-xs font-bold text-[#003F2D] tracking-tight">
              বয়স
            </label>
            <div className="relative">
              <select
                id="filter-select-age"
                value={filters.age}
                onChange={(e) => onChange({ age: e.target.value as AgeFilter })}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A21D]/30 text-xs sm:text-sm font-semibold text-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#003F2D] appearance-none cursor-pointer"
              >
                <option value="all">সব বয়স</option>
                <option value="under-1-year">১ বছরের নিচে (&lt; ১২ মাস)</option>
                <option value="1-to-2-years">১ থেকে ২ বছর (১২ – ২৪ মাস)</option>
                <option value="above-2-years">২ বছরের বেশি (&gt; ২৪ মাস)</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filter 3: ওজন (Weight) */}
          <div className="space-y-1.5">
            <label htmlFor="filter-select-weight" className="block text-xs font-bold text-[#003F2D] tracking-tight">
              ওজন
            </label>
            <div className="relative">
              <select
                id="filter-select-weight"
                value={filters.weight}
                onChange={(e) => onChange({ weight: e.target.value as WeightFilter })}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A21D]/30 text-xs sm:text-sm font-semibold text-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#003F2D] appearance-none cursor-pointer"
              >
                <option value="all">সব ওজন</option>
                <option value="under-50">৫০ কেজির নিচে (&lt; ৫০ কেজি)</option>
                <option value="50-100">৫০ – ১০০ কেজি</option>
                <option value="100-150">১০০ – ১৫০ কেজি</option>
                <option value="above-150">১৫০ কেজির বেশি (&gt; ১৫০ কেজি)</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filter 4: দাম (Price) */}
          <div className="space-y-1.5">
            <label htmlFor="filter-select-price" className="block text-xs font-bold text-[#003F2D] tracking-tight">
              দাম (বাজেট)
            </label>
            <div className="relative">
              <select
                id="filter-select-price"
                value={filters.pricePreset}
                onChange={(e) => handlePricePresetClick(e.target.value as PricePreset)}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A21D]/30 text-xs sm:text-sm font-semibold text-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#003F2D] appearance-none cursor-pointer"
              >
                <option value="all">সব দাম</option>
                <option value="under-10k">১০,০০০ টাকার নিচে</option>
                <option value="10k-50k">১০,০০০ – ৫০,০০০ টাকা</option>
                <option value="50k-100k">৫০,০০০ – ১,০০,০০০ টাকা</option>
                <option value="above-100k">১,০০,০০০ টাকার বেশি</option>
                <option value="custom">কাস্টম বাজেট নির্ধারণ...</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Control 5: সাজান (Sort) */}
          <div className="space-y-1.5">
            <label htmlFor="sort-select" className="block text-xs font-bold text-[#003F2D] tracking-tight flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C95A25]" />
              <span>সাজান</span>
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => onChange({ sort: e.target.value as SortOption })}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A21D]/30 text-xs sm:text-sm font-semibold text-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#003F2D] appearance-none cursor-pointer"
              >
                <option value="newest">নতুন যোগ করা</option>
                <option value="price-asc">দাম: কম → বেশি</option>
                <option value="price-desc">দাম: বেশি → কম</option>
                <option value="weight-asc">ওজন: কম → বেশি</option>
                <option value="weight-desc">ওজন: বেশি → কম</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Min / Max Price Inputs (shown if custom price selected or user typed min/max) */}
        <AnimatePresence>
          {showCustomPrice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 overflow-hidden"
            >
              <span className="text-xs font-bold text-[#003F2D] shrink-0">
                কাস্টম দামের সীমা (৳):
              </span>
              <div className="flex items-center gap-2 flex-grow max-w-md">
                <input
                  id="filter-min-price-input"
                  type="text"
                  value={filters.minPrice}
                  onChange={(e) => onChange({ minPrice: e.target.value, pricePreset: 'custom' })}
                  placeholder="সর্বনিম্ন (৳)"
                  className="w-full px-3 py-2 bg-[#FAF7EE] rounded-lg border border-[#D6A21D]/30 text-xs sm:text-sm text-[#1a3a2a] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003F2D]"
                />
                <span className="text-gray-400 font-bold text-xs">—</span>
                <input
                  id="filter-max-price-input"
                  type="text"
                  value={filters.maxPrice}
                  onChange={(e) => onChange({ maxPrice: e.target.value, pricePreset: 'custom' })}
                  placeholder="সর্বোচ্চ (৳)"
                  className="w-full px-3 py-2 bg-[#FAF7EE] rounded-lg border border-[#D6A21D]/30 text-xs sm:text-sm text-[#1a3a2a] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003F2D]"
                />
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <button
                  type="button"
                  onClick={() => onChange({ minPrice: '', maxPrice: '', pricePreset: 'all' })}
                  className="text-xs text-[#C95A25] hover:underline self-center sm:self-auto cursor-pointer font-medium"
                >
                  দাম মুছুন
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. RESULT COUNT & ACTIVE FILTER BADGES STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Count Label */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#D6A21D]/40 text-[#003F2D] text-xs sm:text-sm font-bold shadow-2xs">
            <Check className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>{toBengaliNumber(totalMatches)}টি পশু পাওয়া গেছে</span>
          </span>

          {activeFilterCount > 0 && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              ({toBengaliNumber(activeFilterCount)}টি ফিল্টার সক্রিয়)
            </span>
          )}
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center flex-wrap gap-1.5">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium">
                <span>অনুসন্ধান: "{filters.search}"</span>
                <button
                  type="button"
                  onClick={() => onChange({ search: '' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.gender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium">
                <span>লিঙ্গ: {filters.gender}</span>
                <button
                  type="button"
                  onClick={() => onChange({ gender: 'all' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.age !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium">
                <span>
                  বয়স:{' '}
                  {filters.age === 'under-1-year'
                    ? '< ১ বছর'
                    : filters.age === '1-to-2-years'
                    ? '১-২ বছর'
                    : '২+ বছর'}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ age: 'all' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.weight !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium">
                <span>
                  ওজন:{' '}
                  {filters.weight === 'under-50'
                    ? '< ৫০ কেজি'
                    : filters.weight === '50-100'
                    ? '৫০-১০০ কেজি'
                    : filters.weight === '100-150'
                    ? '১০০-১৫০ কেজি'
                    : '১৫০+ কেজি'}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ weight: 'all' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(filters.pricePreset !== 'all' || filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium">
                <span>
                  দাম:{' '}
                  {filters.pricePreset === 'under-10k'
                    ? '< ৳১০,০০০'
                    : filters.pricePreset === '10k-50k'
                    ? '৳১০হাজার-৫০হাজার'
                    : filters.pricePreset === '50k-100k'
                    ? '৳৫০হাজার-১লাখ'
                    : filters.pricePreset === 'above-100k'
                    ? '> ৳১,০০,০০০'
                    : `${filters.minPrice || '০'} - ${filters.maxPrice || 'সীমাহীন'}`}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ pricePreset: 'all', minPrice: '', maxPrice: '' })}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              id="clear-all-chips-btn"
              onClick={handleReset}
              className="text-xs text-[#C95A25] hover:underline font-bold px-1.5 cursor-pointer ml-1"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
