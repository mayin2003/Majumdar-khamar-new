import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SaleProduct, ProductCategory } from '../types/product';
import { initialSaleProducts } from '../data/seedSaleProducts';

/**
 * Maps a Supabase row (snake_case) to the TypeScript SaleProduct interface (camelCase)
 */
export function mapDbToSaleProduct(row: any): SaleProduct {
  return {
    id: row.id,
    name: row.name || '',
    category: row.category as ProductCategory,
    price: typeof row.price === 'number' ? row.price : parseFloat(row.price || '0'),
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
 * Maps a TypeScript SaleProduct (camelCase) to a Supabase row (snake_case)
 * (Strictly includes price for commercial livestock sales)
 */
export function mapSaleProductToDb(product: Partial<SaleProduct>): Record<string, any> {
  const dbRecord: Record<string, any> = {};

  if (product.name !== undefined) dbRecord.name = product.name;
  if (product.category !== undefined) dbRecord.category = product.category;
  if (product.price !== undefined) dbRecord.price = Number(product.price);
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
let cachedSaleProducts: SaleProduct[] = [...initialSaleProducts];
const listeners = new Set<(products: SaleProduct[]) => void>();

function notifyListeners() {
  const sorted = [...cachedSaleProducts].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
  listeners.forEach((listener) => listener(sorted));
}

/**
 * Fetch all commercial sale products from Supabase
 */
export async function getSaleProducts(): Promise<SaleProduct[]> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Failed to fetch sale products: Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
    return cachedSaleProducts;
  }

  try {
    const { data, error } = await supabase
      .from('sale_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Failed to fetch sale products:', error);
      return cachedSaleProducts;
    }

    if (data) {
      cachedSaleProducts = data.map(mapDbToSaleProduct);
      notifyListeners();
    }
    return cachedSaleProducts;
  } catch (err) {
    console.error('[Supabase] Failed to fetch sale products (exception):', err);
    return cachedSaleProducts;
  }
}

/**
 * Fetch sale products by category
 */
export async function getSaleProductsByCategory(category: ProductCategory | string): Promise<SaleProduct[]> {
  const all = await getSaleProducts();
  if (category === 'সব') return all;
  return all.filter((p) => p.category === category);
}

/**
 * Fetch a single sale product by slug
 */
export async function getSaleProductBySlug(slug: string): Promise<SaleProduct | undefined> {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).trim();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('sale_products')
        .select('*')
        .or(`slug.eq.${slug},slug.eq.${decoded},id.eq.${slug}`)
        .maybeSingle();

      if (error) {
        console.error('[Supabase] Failed to fetch sale product by slug:', error);
      } else if (data) {
        return mapDbToSaleProduct(data);
      }
    } catch (err) {
      console.error('[Supabase] Exception fetching sale product by slug:', err);
    }
  }

  // Fallback to in-memory cache
  return cachedSaleProducts.find(
    (p) =>
      p.slug === slug ||
      p.slug === decoded ||
      (p.slug === 'deshi-bachur-1' && (slug === 'deshi-bachur' || decoded === 'deshi-bachur')) ||
      p.id === slug ||
      p.id === decoded
  );
}

/**
 * Fetch sale product by ID
 */
export async function getSaleProductById(id: string): Promise<SaleProduct | undefined> {
  return cachedSaleProducts.find((p) => p.id === id);
}

/**
 * Add a new commercial sale product to Supabase
 */
export async function createSaleProduct(data: Omit<SaleProduct, 'id'> | SaleProduct): Promise<SaleProduct> {
  const autoSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `sale-${Date.now()}`;
  
  const payload = {
    ...data,
    slug: autoSlug,
    createdAt: (data as any).createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Sale product creation aborted: Supabase is not configured.');
    const newSaleProduct: SaleProduct = {
      ...payload,
      id: 'id' in data && data.id && !data.id.startsWith('new-') ? data.id : `sale-${Date.now()}`
    };
    cachedSaleProducts = [newSaleProduct, ...cachedSaleProducts];
    notifyListeners();
    return newSaleProduct;
  }

  const dbRow = mapSaleProductToDb(payload);
  if ('id' in data && data.id && !data.id.startsWith('new-')) {
    dbRow.id = data.id;
  }

  const { data: inserted, error } = await supabase
    .from('sale_products')
    .insert(dbRow)
    .select('*')
    .single();

  if (error) {
    console.error('[Supabase] Failed to insert sale product:', error);
    throw new Error(`বিক্রয় পণ্য যোগ করা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  const newProduct = mapDbToSaleProduct(inserted);
  cachedSaleProducts = [newProduct, ...cachedSaleProducts.filter((p) => p.id !== newProduct.id)];
  notifyListeners();
  return newProduct;
}

/**
 * Update an existing commercial sale product in Supabase
 */
export async function updateSaleProduct(id: string, data: Partial<SaleProduct>): Promise<SaleProduct> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Sale product update aborted: Supabase is not configured.');
    const index = cachedSaleProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return createSaleProduct({ ...(data as any), id });
    }
    const updated: SaleProduct = {
      ...cachedSaleProducts[index],
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };
    cachedSaleProducts[index] = updated;
    notifyListeners();
    return updated;
  }

  const dbRow = mapSaleProductToDb(data);
  dbRow.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from('sale_products')
    .update(dbRow)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[Supabase] Failed to update sale product:', error);
    throw new Error(`বিক্রয় পণ্য আপডেট করা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  const updatedProduct = mapDbToSaleProduct(updated);
  cachedSaleProducts = cachedSaleProducts.map((p) => (p.id === id ? updatedProduct : p));
  notifyListeners();
  return updatedProduct;
}

/**
 * Delete a commercial sale product from Supabase
 */
export async function deleteSaleProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Sale product deletion aborted: Supabase is not configured.');
    cachedSaleProducts = cachedSaleProducts.filter((p) => p.id !== id);
    notifyListeners();
    return;
  }

  const { error } = await supabase
    .from('sale_products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete sale product:', error);
    throw new Error(`বিক্রয় পণ্য মুছে ফেলা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  cachedSaleProducts = cachedSaleProducts.filter((p) => p.id !== id);
  notifyListeners();
}

/**
 * Delete all demo commercial sale products
 */
export async function deleteDemoSaleProducts(): Promise<number> {
  const initialCount = cachedSaleProducts.length;

  if (!isSupabaseConfigured()) {
    console.error('[Supabase] Demo sale products deletion aborted: Supabase is not configured.');
    cachedSaleProducts = cachedSaleProducts.filter((p) => !p.isDemo && !p.id.startsWith('sale-demo-'));
    const deletedCount = initialCount - cachedSaleProducts.length;
    notifyListeners();
    return deletedCount;
  }

  const { error } = await supabase
    .from('sale_products')
    .delete()
    .eq('is_demo', true);

  if (error) {
    console.error('[Supabase] Failed to delete demo sale products:', error);
    throw new Error(`ডেমো বিক্রয় পণ্য মোছা যায়নি (Supabase): ${error.message || 'ডাটাবেস ত্রুটি'}`);
  }

  // Refresh
  await getSaleProducts();
  return initialCount - cachedSaleProducts.length;
}

/**
 * Real-time subscription to Sale Products changes via Supabase Realtime
 */
export function subscribeToSaleProducts(callback: (products: SaleProduct[]) => void): () => void {
  listeners.add(callback);

  // Initial trigger
  callback([...cachedSaleProducts]);

  // Initial fetch from Supabase
  getSaleProducts();

  let channel: any = null;

  if (isSupabaseConfigured()) {
    channel = supabase
      .channel('public:sale_products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sale_products' },
        () => {
          // Re-fetch clean list on any insert/update/delete
          getSaleProducts();
        }
      )
      .subscribe((status, err) => {
        if (err || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('[Supabase] Failed to subscribe to sale products Realtime changes:', status, err);
        }
      });
  } else {
    console.error('[Supabase] Cannot subscribe to sale products Realtime changes: Supabase is not configured.');
  }

  return () => {
    listeners.delete(callback);
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}
