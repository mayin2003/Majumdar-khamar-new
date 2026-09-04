import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, ProductCategory } from '../types/product';
import { initialProducts } from '../data/seedProducts';

/**
 * Maps a Supabase row (snake_case) to the TypeScript Product interface (camelCase)
 */
export function mapDbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name || '',
    category: row.category as ProductCategory,
    age: row.age || '',
    weight: row.weight || '',
    breed: row.breed || '',
    gender: row.gender || 'পুরুষ',
    healthStatus: row.health_status || 'সুস্থ, নিয়মিত টিকা প্রাপ্ত',
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : [],
    inStock: typeof row.in_stock === 'boolean' ? row.in_stock : true,
    isLimited: typeof row.is_limited === 'boolean' ? row.is_limited : false,
    slug: row.slug || '',
    isDemo: typeof row.is_demo === 'boolean' ? row.is_demo : false,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Maps a TypeScript Product (camelCase) to a Supabase row (snake_case)
 * (Strictly NO price or commercial order fields)
 */
export function mapProductToDb(product: Partial<Product>): Record<string, any> {
  const dbRecord: Record<string, any> = {};

  if (product.name !== undefined) dbRecord.name = product.name;
  if (product.category !== undefined) dbRecord.category = product.category;
  if (product.age !== undefined) dbRecord.age = product.age;
  if (product.weight !== undefined) dbRecord.weight = product.weight;
  if (product.breed !== undefined) dbRecord.breed = product.breed;
  if (product.gender !== undefined) dbRecord.gender = product.gender;
  if (product.healthStatus !== undefined) dbRecord.health_status = product.healthStatus;
  if (product.description !== undefined) dbRecord.description = product.description;
  if (product.images !== undefined) dbRecord.images = product.images;
  if (product.inStock !== undefined) dbRecord.in_stock = product.inStock;
  if (product.isLimited !== undefined) dbRecord.is_limited = product.isLimited;
  if (product.slug !== undefined) dbRecord.slug = product.slug;
  if (product.isDemo !== undefined) dbRecord.is_demo = product.isDemo;

  return dbRecord;
}

// In-memory cache for fast responsive UI
let cachedProducts: Product[] = [...initialProducts];
const listeners = new Set<(products: Product[]) => void>();

function notifyListeners() {
  const sorted = [...cachedProducts].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
  listeners.forEach((listener) => listener(sorted));
}

/**
 * Fetch all informational products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Failed to fetch products: Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
    return cachedProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Failed to fetch products:', error);
      return cachedProducts;
    }

    if (data) {
      cachedProducts = data.map(mapDbToProduct);
      notifyListeners();
    }
    return cachedProducts;
  } catch (err) {
    console.error('[Supabase] Failed to fetch products (exception):', err);
    return cachedProducts;
  }
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: ProductCategory | 'সব'): Promise<Product[]> {
  const all = await getProducts();
  if (category === 'সব') return all;
  return all.filter((p) => p.category === category);
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).trim();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`slug.eq.${slug},slug.eq.${decoded},id.eq.${slug}`)
        .maybeSingle();

      if (error) {
        console.error('[Supabase] Failed to fetch product by slug:', error);
      } else if (data) {
        return mapDbToProduct(data);
      }
    } catch (err) {
      console.error('[Supabase] Exception fetching product by slug:', err);
    }
  }

  // Fallback to in-memory cache
  return cachedProducts.find(
    (p) =>
      p.slug === slug ||
      p.slug === decoded ||
      (p.slug === 'deshi-bachur-1' && (slug === 'deshi-bachur' || decoded === 'deshi-bachur')) ||
      p.id === slug ||
      p.id === decoded
  );
}

/**
 * Fetch product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  return cachedProducts.find((p) => p.id === id);
}

/**
 * Add a new informational product to Supabase
 */
export async function createProduct(data: Omit<Product, 'id'> | Product): Promise<Product> {
  const autoSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`;
  
  const payload = {
    ...data,
    slug: autoSlug,
    createdAt: (data as any).createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Product creation aborted: Supabase is not configured.');
    const newProduct: Product = {
      ...payload,
      id: 'id' in data && data.id && !data.id.startsWith('new-') ? data.id : `prod-${Date.now()}`
    };
    cachedProducts = [newProduct, ...cachedProducts];
    notifyListeners();
    return newProduct;
  }

  const dbRow = mapProductToDb(payload);
  if ('id' in data && data.id && !data.id.startsWith('new-')) {
    dbRow.id = data.id;
  }

  const { data: inserted, error } = await supabase
    .from('products')
    .insert(dbRow)
    .select('*')
    .single();

  if (error) {
    console.error('[Supabase] Failed to insert product:', error);
    throw new Error(`প্রোডাক্ট যোগ করা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  const newProduct = mapDbToProduct(inserted);
  cachedProducts = [newProduct, ...cachedProducts.filter((p) => p.id !== newProduct.id)];
  notifyListeners();
  return newProduct;
}

/**
 * Update an existing product in Supabase
 */
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Product update aborted: Supabase is not configured.');
    const index = cachedProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return createProduct({ ...(data as any), id });
    }
    const updated: Product = {
      ...cachedProducts[index],
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };
    cachedProducts[index] = updated;
    notifyListeners();
    return updated;
  }

  const dbRow = mapProductToDb(data);
  dbRow.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from('products')
    .update(dbRow)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[Supabase] Failed to update product:', error);
    throw new Error(`প্রোডাক্ট আপডেট করা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  const updatedProduct = mapDbToProduct(updated);
  cachedProducts = cachedProducts.map((p) => (p.id === id ? updatedProduct : p));
  notifyListeners();
  return updatedProduct;
}

/**
 * Delete a product from Supabase
 */
export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Product deletion aborted: Supabase is not configured.');
    cachedProducts = cachedProducts.filter((p) => p.id !== id);
    notifyListeners();
    return;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete product:', error);
    throw new Error(`প্রোডাক্ট মুছে ফেলা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  cachedProducts = cachedProducts.filter((p) => p.id !== id);
  notifyListeners();
}

/**
 * Delete all demo products
 */
export async function deleteDemoProducts(): Promise<number> {
  const initialCount = cachedProducts.length;

  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Demo products deletion aborted: Supabase is not configured.');
    cachedProducts = cachedProducts.filter((p) => !p.isDemo && !p.id.startsWith('prod-demo-'));
    const deletedCount = initialCount - cachedProducts.length;
    notifyListeners();
    return deletedCount;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('is_demo', true);

  if (error) {
    console.error('[Supabase] Failed to delete demo products:', error);
    throw new Error(`ডেমো প্রোডাক্টস মোছা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  // Refresh
  await getProducts();
  return initialCount - cachedProducts.length;
}

/**
 * Live synchronization for Products
 * Uses initial REST fetch + automated background sync (interval & window focus)
 * to keep data fresh across tabs and devices reliably without fragile WebSocket 1006 closures.
 */
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  listeners.add(callback);

  // Initial trigger with currently cached products
  callback([...cachedProducts]);

  // Initial fetch from Supabase
  getProducts();

  // Background polling interval (every 30 seconds when tab is active)
  const intervalId = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      getProducts();
    }
  }, 30000);

  // Refetch when tab becomes visible or gains focus
  const handleVisibilityOrFocus = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      getProducts();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
  }

  return () => {
    listeners.delete(callback);
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    }
  };
}
