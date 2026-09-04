// TEMPORARY LOCAL STORAGE LAYER (Delegates to dataService Base64 storage)
// TODO: FIREBASE-MIGRATE - restore Firebase Storage uploadBytesResumable & getDownloadURL
import { uploadImageFile as localUploadImageFile } from '../services/dataService';

/**
 * Uploads a File locally by converting to Base64 (max 1MB)
 * TODO: FIREBASE-MIGRATE - replace with Firebase Storage bucket upload
 */
export async function uploadImageFile(
  file: File, 
  folder: string = 'uploads'
): Promise<string> {
  return localUploadImageFile(file, folder);
}

