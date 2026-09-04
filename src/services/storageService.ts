import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET_NAME = 'farm-images';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Uploads an image file to Supabase Storage in the 'farm-images' bucket
 * and returns the public CDN URL.
 *
 * @param file The browser File object
 * @param folder The target subfolder (e.g., 'logo', 'hero', 'farm', 'products', 'sale-products')
 * @returns Public URL of the uploaded image
 */
export async function uploadImageFile(file: File, folder: string = 'products'): Promise<string> {
  // 1. Validation: MIME Type
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('অননুমোদিত ফাইলের ধরন! শুধুমাত্র JPG, PNG বা WEBP ছবি আপলোড করুন।');
  }

  // 2. Validation: File Size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('ছবির সাইজ অতিরিক্ত বড় (সর্বোচ্চ ৫ MB অনুমোদিত)।');
  }

  // Fallback if Supabase is not configured yet in environment
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not configured in .env. Using client-side image reader fallback.');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।'));
        }
      };
      reader.onerror = () => reject(new Error('ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।'));
      reader.readAsDataURL(file);
    });
  }

  // Clean folder name
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]/g, '-');
  
  // Create unique, URL-safe filename with timestamp
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const fileName = `${Date.now()}_${cleanBaseName}.${fileExt}`;
  const filePath = `${cleanFolder}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`ছবি আপলোড করা যায়নি: ${error.message || 'আবার চেষ্টা করুন।'}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new Error('ছবির পাবলিক লিঙ্ক তৈরি করা যায়নি।');
    }

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Image upload failed:', err);
    throw new Error(err.message || 'ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।');
  }
}

/**
 * Optional helper to delete an image from Supabase Storage by its public URL
 */
export async function deleteStorageImage(publicUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !publicUrl || !publicUrl.includes(BUCKET_NAME)) {
    return false;
  }

  try {
    const urlParts = publicUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;
    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      console.warn('Storage file deletion notice:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error deleting storage file:', err);
    return false;
  }
}
