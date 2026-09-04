export type ProductCategory = 'গরু' | 'ছাগল' | 'মুরগি ও হাঁস';
export type SaleCategory = 'গরু' | 'ছাগল' | 'মুরগি' | 'হাঁস' | 'মুরগি ও হাঁস';

/**
 * Info-only Product in "products" Firestore collection.
 * Strictly has NO price or forSale fields.
 */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  age: string;
  weight: string;
  breed: string;
  gender: string;
  healthStatus: string;
  description: string;
  images: string[];
  inStock: boolean;
  isLimited: boolean;
  slug: string;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Commercial item in "saleProducts" Firestore collection.
 * Strictly WITH price.
 */
export interface SaleProduct {
  id: string;
  name: string;
  category: ProductCategory | 'গরু' | 'ছাগল' | 'মুরগি' | 'হাঁস';
  price: number; // in BDT (৳)
  age: string;
  weight: string;
  breed: string;
  gender: string;
  healthStatus: string;
  description?: string;
  images: string[];
  inStock: boolean;
  isLimited: boolean;
  slug: string;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
