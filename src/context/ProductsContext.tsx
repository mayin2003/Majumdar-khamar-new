import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, ProductCategory } from '../types/product';
import { initialProducts } from '../data/seedProducts';
import { 
  subscribeToProducts, 
  createProduct as addProductService, 
  updateProduct as updateProductService, 
  deleteProduct as deleteProductService, 
  deleteDemoProducts as deleteDemoProductsService,
  getProductBySlug as fetchProductBySlug,
  getProductById as fetchProductById
} from '../services/productsService';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory | 'সব') => Product[];
  toggleProductStock: (id: string, inStock: boolean) => Promise<void>;
  toggleProductLimited: (id: string, isLimited: boolean) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteDemoProducts: () => Promise<number>;
  categories: ProductCategory[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((loaded) => {
      const sorted = [...loaded].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setProducts(sorted);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getProductBySlug = (slug: string) => {
    if (!slug) return undefined;
    const decoded = decodeURIComponent(slug).trim();
    return products.find(
      (p) =>
        p.slug === slug ||
        p.slug === decoded ||
        (p.slug === 'deshi-bachur-1' && (slug === 'deshi-bachur' || decoded === 'deshi-bachur')) ||
        p.id === slug ||
        p.id === decoded
    ) || fetchProductBySlug(slug) as any;
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id) || fetchProductById(id) as any;
  };

  const getProductsByCategory = (category: ProductCategory | 'সব') => {
    if (category === 'সব') return products;
    return products.filter((p) => p.category === category);
  };

  const toggleProductStock = async (id: string, inStock: boolean) => {
    try {
      await updateProductService(id, { inStock });
    } catch (err: any) {
      console.error('Error toggling product stock:', err);
      throw err;
    }
  };

  const toggleProductLimited = async (id: string, isLimited: boolean) => {
    try {
      await updateProductService(id, { isLimited });
    } catch (err: any) {
      console.error('Error toggling product limited status:', err);
      throw err;
    }
  };

  const saveProduct = async (product: Product) => {
    const isNew = !product.id || product.id.startsWith('new-');
    if (isNew) {
      await addProductService(product);
    } else {
      await updateProductService(product.id, product);
    }
  };

  const deleteProduct = async (id: string) => {
    await deleteProductService(id);
  };

  const deleteDemoProducts = async (): Promise<number> => {
    return await deleteDemoProductsService();
  };

  const categories: ProductCategory[] = ['গরু', 'ছাগল', 'মুরগি ও হাঁস'];

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        getProductBySlug,
        getProductById,
        getProductsByCategory,
        toggleProductStock,
        toggleProductLimited,
        saveProduct,
        deleteProduct,
        deleteDemoProducts,
        categories
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
