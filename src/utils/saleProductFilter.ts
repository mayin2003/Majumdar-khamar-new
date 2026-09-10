import { SaleProduct } from '../types/product';

export type CategoryFilter = 'all' | 'গরু' | 'ছাগল' | 'মুরগি ও হাঁস';
export type GenderFilter = 'all' | 'পুরুষ' | 'মহিলা';
export type AgeFilter = 'all' | 'under-1-year' | '1-to-2-years' | 'above-2-years';
export type WeightFilter = 'all' | 'under-50' | '50-100' | '100-150' | 'above-150';
export type PricePreset = 'all' | 'under-10k' | '10k-50k' | '50k-100k' | 'above-100k' | 'custom';
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc';

export interface SaleProductFilters {
  search: string;
  category: CategoryFilter;
  gender: GenderFilter;
  age: AgeFilter;
  weight: WeightFilter;
  pricePreset: PricePreset;
  minPrice: string; // English or Bengali numerals
  maxPrice: string;
  sort: SortOption;
}

export const defaultSaleProductFilters: SaleProductFilters = {
  search: '',
  category: 'all',
  gender: 'all',
  age: 'all',
  weight: 'all',
  pricePreset: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
};

const bengaliToEnglishMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

/**
 * Converts Bengali numeric characters in a string to English digits.
 */
export function bengaliToEnglishNumber(str: string): string {
  if (!str) return '';
  return str.replace(/[০-৯]/g, (char) => bengaliToEnglishMap[char] || char);
}

/**
 * Parses numeric value from a string (handles both Bengali and English digits).
 */
export function parseNumericInput(str: string): number | null {
  if (!str) return null;
  const english = bengaliToEnglishNumber(str.trim()).replace(/,/g, '');
  const match = english.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  return isNaN(num) ? null : num;
}

/**
 * Extracts weight in kg from existing product weight strings (e.g. '১২০ কেজি' -> 120).
 * Returns null if not a recognized numeric weight.
 */
export function parseWeightKg(weightStr?: string): number | null {
  if (!weightStr) return null;
  const english = bengaliToEnglishNumber(weightStr.trim().toLowerCase());
  const match = english.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  return isNaN(val) ? null : val;
}

/**
 * Extracts age in approximate months from existing product age strings
 * (e.g. '৮ মাস' -> 8, '১ বছর' -> 12, '৩ বছর' -> 36).
 * Returns null if not a recognized numeric age.
 */
export function parseAgeMonths(ageStr?: string): number | null {
  if (!ageStr) return null;
  const trimmed = ageStr.trim().toLowerCase();
  const english = bengaliToEnglishNumber(trimmed);
  const match = english.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  if (isNaN(val)) return null;

  if (trimmed.includes('বছর') || english.includes('year')) {
    return val * 12;
  }
  return val;
}

/**
 * Counts how many non-default filters are currently active (excluding sorting).
 */
export function getActiveFilterCount(filters: SaleProductFilters): number {
  let count = 0;
  if (filters.search.trim() !== '') count++;
  if (filters.category !== 'all') count++;
  if (filters.gender !== 'all') count++;
  if (filters.age !== 'all') count++;
  if (filters.weight !== 'all') count++;
  if (filters.pricePreset !== 'all' || filters.minPrice.trim() !== '' || filters.maxPrice.trim() !== '') count++;
  return count;
}

/**
 * Filters and sorts sale products completely on the client side using existing data.
 */
export function filterAndSortSaleProducts(
  products: SaleProduct[],
  filters: SaleProductFilters
): SaleProduct[] {
  const {
    search,
    category,
    gender,
    age,
    weight,
    pricePreset,
    minPrice,
    maxPrice,
    sort,
  } = filters;

  const normalizedSearch = search.trim().toLowerCase();
  const searchEnglish = bengaliToEnglishNumber(normalizedSearch);

  // Compute active min/max price bounds
  let effectiveMinPrice: number | null = null;
  let effectiveMaxPrice: number | null = null;

  if (pricePreset === 'under-10k') {
    effectiveMaxPrice = 10000;
  } else if (pricePreset === '10k-50k') {
    effectiveMinPrice = 10000;
    effectiveMaxPrice = 50000;
  } else if (pricePreset === '50k-100k') {
    effectiveMinPrice = 50000;
    effectiveMaxPrice = 100000;
  } else if (pricePreset === 'above-100k') {
    effectiveMinPrice = 100000;
  }

  // Override or complement with custom min/max inputs if provided
  const parsedCustomMin = parseNumericInput(minPrice);
  const parsedCustomMax = parseNumericInput(maxPrice);
  if (parsedCustomMin !== null) {
    effectiveMinPrice = parsedCustomMin;
  }
  if (parsedCustomMax !== null) {
    effectiveMaxPrice = parsedCustomMax;
  }

  // 1. FILTERING
  const filtered = products.filter((product) => {
    // Category filter
    if (category !== 'all') {
      if (category === 'মুরগি ও হাঁস') {
        const isPoultry =
          product.category === 'মুরগি ও হাঁস' ||
          (product.category as string) === 'মুরগি' ||
          (product.category as string) === 'হাঁস';
        if (!isPoultry) return false;
      } else if (product.category !== category) {
        return false;
      }
    }

    // Gender filter: 'সব', 'পুরুষ', 'মহিলা'
    if (gender !== 'all') {
      const g = (product.gender || '').trim();
      if (gender === 'পুরুষ') {
        if (!g.includes('পুরুষ')) return false;
      } else if (gender === 'মহিলা') {
        const isFemale = g.includes('স্ত্রী') || g.includes('মহিলা');
        if (!isFemale) return false;
      }
    }

    // Age filter: 'under-1-year', '1-to-2-years', 'above-2-years'
    if (age !== 'all') {
      const months = parseAgeMonths(product.age);
      if (months === null) return false;
      if (age === 'under-1-year' && months >= 12) return false;
      if (age === '1-to-2-years' && (months < 12 || months > 24)) return false;
      if (age === 'above-2-years' && months <= 24) return false;
    }

    // Weight filter: 'under-50', '50-100', '100-150', 'above-150'
    if (weight !== 'all') {
      const kg = parseWeightKg(product.weight);
      if (kg === null) return false;
      if (weight === 'under-50' && kg >= 50) return false;
      if (weight === '50-100' && (kg < 50 || kg > 100)) return false;
      if (weight === '100-150' && (kg < 100 || kg > 150)) return false;
      if (weight === 'above-150' && kg <= 150) return false;
    }

    // Price filter (numeric BDT)
    const price = typeof product.price === 'number' ? product.price : 0;
    if (effectiveMinPrice !== null && price < effectiveMinPrice) return false;
    if (effectiveMaxPrice !== null && price > effectiveMaxPrice) return false;

    // Search query matching
    if (normalizedSearch !== '') {
      const name = (product.name || '').toLowerCase();
      const breed = (product.breed || '').toLowerCase();
      const cat = (product.category || '').toLowerCase();
      const slug = (product.slug || '').toLowerCase();
      const id = (product.id || '').toLowerCase();

      // Also compare with English digit converted string for slug/id search
      const matchesSearch =
        name.includes(normalizedSearch) ||
        breed.includes(normalizedSearch) ||
        cat.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        slug.includes(searchEnglish) ||
        id.includes(normalizedSearch) ||
        id.includes(searchEnglish);

      if (!matchesSearch) return false;
    }

    return true;
  });

  // 2. SORTING
  return filtered.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;

      case 'price-desc':
        return b.price - a.price;

      case 'weight-asc': {
        const wA = parseWeightKg(a.weight);
        const wB = parseWeightKg(b.weight);
        if (wA === null && wB === null) return 0;
        if (wA === null) return 1;
        if (wB === null) return -1;
        return wA - wB;
      }

      case 'weight-desc': {
        const wA = parseWeightKg(a.weight);
        const wB = parseWeightKg(b.weight);
        if (wA === null && wB === null) return 0;
        if (wA === null) return 1;
        if (wB === null) return -1;
        return wB - wA;
      }

      case 'newest':
      default: {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
    }
  });
}
