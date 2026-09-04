// ============================================================================
// FIREBASE SEEDING HELPER
// TODO: FIREBASE-MIGRATE - run when connecting to live production Firestore database
// ============================================================================

import { doc, getDoc, setDoc, writeBatch, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { initialProducts } from '../data/seedProducts';

/**
 * Seeds the Firestore database once if the 'meta/seeded' document is not present,
 * or runs a one-time migration to ensure all initial demo items have `isDemo: true`.
 */
export async function seedFirestoreOnce(): Promise<void> {
  if (!db) return;

  try {
    const metaRef = doc(db, 'meta', 'seeded');
    const metaSnap = await getDoc(metaRef);

    if (metaSnap.exists() && metaSnap.data()?.demoDeleted) {
      // Demo products were explicitly deleted by admin; do not reseed.
      return;
    }

    if (!metaSnap.exists()) {
      console.log('Seeding initial products with isDemo: true to Firestore...');
      const batch = writeBatch(db);

      for (const product of initialProducts) {
        const prodRef = doc(db, 'products', product.id);
        batch.set(prodRef, { ...product, isDemo: true }, { merge: true });
      }

      // Mark as seeded
      batch.set(metaRef, {
        seeded: true,
        seededAt: new Date().toISOString(),
        productCount: initialProducts.length,
        isDemoMarked: true,
      });

      await batch.commit();
      console.log('Firestore products successfully seeded with isDemo flag!');
    } else if (!metaSnap.data()?.isDemoMarked) {
      // One-time migration for already seeded docs: mark existing demo products as isDemo: true
      console.log('Running one-time migration to mark existing demo products with isDemo: true...');
      const demoIds = new Set(initialProducts.map((p) => p.id));
      const productsSnap = await getDocs(collection(db, 'products'));
      
      const batch = writeBatch(db);
      let migrationCount = 0;

      for (const docSnap of productsSnap.docs) {
        const data = docSnap.data();
        if (data.isDemo === undefined && (demoIds.has(docSnap.id) || !data.userAdded)) {
          batch.update(docSnap.ref, { isDemo: true });
          migrationCount++;
        }
      }

      batch.set(metaRef, { isDemoMarked: true }, { merge: true });
      await batch.commit();
      console.log(`Demo products migration complete: marked ${migrationCount} docs as isDemo: true.`);
    }
  } catch (error) {
    console.warn('Firestore seeding note (offline or fallback active):', error);
  }
}
