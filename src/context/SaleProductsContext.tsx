import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SaleProduct, ProductCategory } from '../types/product';
import { initialSaleProducts } from '../data/seedSaleProducts';
import { 
  subscribeToSaleProducts, 
  createSaleProduct as addSaleProductService, 
  updateSaleProduct as updateSaleProductService, 
  deleteSaleProduct as deleteSaleProductService, 
  deleteDemoSaleProducts as deleteDemoSaleProductsService,
  getSaleProductBySlug as fetchSaleProductBySlug,
  getSaleProductById as fetchSaleProductById
} from '../services/saleProductsService';

interface SaleProductsContextType {
  saleProducts: SaleProduct[];
  loading: boolean;
  error: string | null;
  getSaleProductBySlug: (slug: string) => SaleProduct | undefined;
  getSaleProductById: (id: string) => SaleProduct | undefined;
  getSaleProductsByCategory?: (category: ProductCategory | string) => SaleProduct[];
  toggleSaleProductStock: (id: string, inStock: boolean) => Promise<void>;
  toggleSaleProductLimited: (id: string, isLimited: boolean) => Promise<void>;
  saveSaleProduct: (product: SaleProduct) => Promise<void>;
  deleteSaleProduct: (id: string) => Promise<void>;
  deleteDemoSaleProducts: () => Promise<number>;
}

const SaleProductsContext = createContext<SaleProductsContextType | undefined>(undefined);

export const SaleProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>(initialSaleProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSaleProducts((loaded) => {
      const sorted = [...loaded].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setSaleProducts(sorted);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getSaleProductBySlug = (slug: string) => {
    if (!slug) return undefined;
    const decoded = decodeURIComponent(slug).trim();
    return saleProducts.find(
      (p) =>
        p.slug === slug ||
        p.slug === decoded ||
        (p.slug === 'deshi-bachur-1' && (slug === 'deshi-bachur' || decoded === 'deshi-bachur')) ||
        p.id === slug ||
        p.id === decoded
    ) || fetchSaleProductBySlug(slug) as any;
  };

  const getSaleProductById = (id: string) => {
    return saleProducts.find((p) => p.id === id) || fetchSaleProductById(id) as any;
  };

  const getSaleProductsByCategory = (category: ProductCategory | string) => {
    if (category === 'সব') return saleProducts;
    return saleProducts.filter((p) => p.category === category);
  };

  const toggleSaleProductStock = async (id: string, inStock: boolean) => {
    try {
      await updateSaleProductService(id, { inStock });
    } catch (err: any) {
      console.error('Error toggling sale product stock:', err);
      throw err;
    }
  };

  const toggleSaleProductLimited = async (id: string, isLimited: boolean) => {
    try {
      await updateSaleProductService(id, { isLimited });
    } catch (err: any) {
      console.error('Error toggling sale product limited status:', err);
      throw err;
    }
  };

  const saveSaleProduct = async (product: SaleProduct) => {
    const isNew = !product.id || product.id.startsWith('new-');
    if (isNew) {
      await addSaleProductService(product);
    } else {
      await updateSaleProductService(product.id, product);
    }
  };

  const deleteSaleProduct = async (id: string) => {
    await deleteSaleProductService(id);
  };

  const deleteDemoSaleProducts = async (): Promise<number> => {
    return await deleteDemoSaleProductsService();
  };

  return (
    <SaleProductsContext.Provider
      value={{
        saleProducts,
        loading,
        error,
        getSaleProductBySlug,
        getSaleProductById,
        getSaleProductsByCategory,
        toggleSaleProductStock,
        toggleSaleProductLimited,
        saveSaleProduct,
        deleteSaleProduct,
        deleteDemoSaleProducts
      }}
    >
      {children}
    </SaleProductsContext.Provider>
  );
};

export const useSaleProducts = (): SaleProductsContextType => {
  const context = useContext(SaleProductsContext);
  if (!context) {
    throw new Error('useSaleProducts must be used within a SaleProductsProvider');
  }
  return context;
};
