/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { ProductsProvider } from './context/ProductsContext';
import { SaleProductsProvider } from './context/SaleProductsContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { SupabaseConfigBanner } from './components/ui/SupabaseConfigBanner';

import { HomePage } from './pages/HomePage';
import { SaleProductsPage } from './pages/SaleProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import { AnimalCardSkeleton, ProductsPageSkeleton } from './components/ui/SkeletonLoaders';

// Performance optimization: code-split Products, Category, and Info Detail pages with React.lazy
const ProductsPage = React.lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CategoryDetailPage = React.lazy(() => import('./pages/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const ProductInfoDetailPage = React.lazy(() => import('./pages/ProductInfoDetailPage').then(m => ({ default: m.ProductInfoDetailPage })));

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHomeContent } from './pages/admin/AdminHomeContent';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminSaleProducts } from './pages/admin/AdminSaleProducts';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public Layout for consumer-facing pages
function PublicLayout() {
  const location = useLocation();
  const { heroBgUrl, hero_bg_url } = useSiteContent();
  const activeHeroBg = heroBgUrl || hero_bg_url;
  const [bgLoaded, setBgLoaded] = useState(false);

  // Apply site-wide background on these public pages ONLY:
  // Products (and its category and detail pages), Sale Products, About, Contact
  const isTargetPage =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/sale-products') ||
    location.pathname.startsWith('/sales') ||
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/contact');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7e6] text-[#1a3a2a] selection:bg-[#c0522d] selection:text-white relative">
      {/* Shared fixed site-wide background layer for Products, Sale Products, About, Contact */}
      {isTargetPage && (
        <div
          className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#f8f7e6]"
          aria-hidden="true"
        >
          {activeHeroBg ? (
            <img
              src={activeHeroBg}
              alt=""
              fetchPriority="high"
              decoding="async"
              loading="eager"
              onLoad={() => setBgLoaded(true)}
              className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
                bgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-[#f8f7e6]" />
          )}

          {/* Soft cream veil: rgba(248,247,230,0.80) on desktop and rgba(248,247,230,0.86) on mobile */}
          <div
            className="absolute inset-0 pointer-events-none block md:hidden"
            style={{ backgroundColor: 'rgba(248, 247, 230, 0.86)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{ backgroundColor: 'rgba(248, 247, 230, 0.80)' }}
          />
        </div>
      )}

      {/* Page content above fixed background */}
      <div className="relative z-[1] flex flex-col flex-grow min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col pb-20 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </div>
  );
}

// Fallback skeleton container for lazy routes
function PageSuspenseFallback({ type }: { type: 'products' | 'category' | 'detail' }) {
  if (type === 'products') {
    return (
      <div className="w-full min-h-screen bg-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-4">
          <div className="h-6 w-44 bg-[#e6dece] rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-[#e6dece] rounded-lg mx-auto animate-pulse" />
        </div>
        <ProductsPageSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3].map((n) => (
          <AnimalCardSkeleton key={n} />
        ))}
      </div>
    </div>
  );
}

// Main Application Routes
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={
              <React.Suspense fallback={<PageSuspenseFallback type="products" />}>
                <ProductsPage />
              </React.Suspense>
            }
          />
          <Route
            path="/products/:category"
            element={
              <React.Suspense fallback={<PageSuspenseFallback type="category" />}>
                <CategoryDetailPage />
              </React.Suspense>
            }
          />
          <Route
            path="/products/:category/:slug"
            element={
              <React.Suspense fallback={<PageSuspenseFallback type="detail" />}>
                <ProductInfoDetailPage />
              </React.Suspense>
            }
          />
          <Route path="/sale-products" element={<SaleProductsPage />} />
          <Route path="/sale-products/:slug" element={<ProductDetailPage />} />
          <Route path="/sales" element={<SaleProductsPage />} />
          <Route path="/sales/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Dedicated Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Panel Layout & Subroutes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="home" element={<AdminHomeContent />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="sales" element={<AdminSaleProducts />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <ProductsProvider>
          <SaleProductsProvider>
            <BrowserRouter>
              <ScrollToTop />
              <SupabaseConfigBanner />
              <AppRoutes />
            </BrowserRouter>
          </SaleProductsProvider>
        </ProductsProvider>
      </SiteContentProvider>
    </AuthProvider>
  );
}
