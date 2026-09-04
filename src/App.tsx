/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { ProductsProvider } from './context/ProductsContext';
import { SaleProductsProvider } from './context/SaleProductsContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductInfoDetailPage } from './pages/ProductInfoDetailPage';
import { SaleProductsPage } from './pages/SaleProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

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
  return (
    <div className="min-h-screen flex flex-col bg-[#f5efe0] text-[#1a3a2a] selection:bg-[#c0522d] selection:text-white relative">
      <Header />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
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
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:category" element={<CategoryDetailPage />} />
          <Route path="/products/:category/:slug" element={<ProductInfoDetailPage />} />
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
              <AppRoutes />
            </BrowserRouter>
          </SaleProductsProvider>
        </ProductsProvider>
      </SiteContentProvider>
    </AuthProvider>
  );
}
