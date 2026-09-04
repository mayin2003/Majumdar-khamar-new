/**
 * Centralized Data Service Facade for Supabase Integration
 * 
 * Re-exports the modular Supabase services:
 * - productsService (Informational products - no price)
 * - saleProductsService (Commercial sale products - with price in BDT)
 * - siteContentService (Home content, banner images, contact info)
 * - storageService (Supabase Storage image uploads in 'farm-images' bucket)
 * - authService (Supabase Authentication for admin management)
 */

export * from './productsService';
export * from './saleProductsService';
export * from './siteContentService';
export * from './storageService';
export * from './authService';
export * from '../lib/supabase';
