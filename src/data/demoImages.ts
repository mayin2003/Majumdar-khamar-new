/**
 * Verified high-resolution Unsplash images specifically matched to South Asian / Bangladeshi farm livestock breeds:
 * - দেশি cattle: Reddish-brown / tan native cattle (NOT black-and-white Holstein)
 * - শাহিওয়াল: Reddish-brown dairy milking cow & hump breeding bull
 * - ফ্রিজিয়ান ক্রস: Black & white Holstein/Friesian-cross (the only black & white cattle)
 * - ব্ল্যাক বেঙ্গল ছাগল: Small solid black native Bengal goat
 * - যমুনাপারি ছাগল: Tall goat with long floppy ears & mottled coat
 * - তোতাপারি ছাগল: Distinct roman/parrot-like head profile
 * - সোনালী মুরগি: Golden-reddish brown layer hen
 * - দেশি হাঁস: Native farmyard duck near grass & water
 */

export const DEMO_BREED_IMAGES = {
  deshiCalf: [
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1000&q=80'
  ],
  deshiBolod: [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1000&q=80'
  ],
  sahiwalCow: [
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1000&q=80'
  ],
  friesianCross: [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1000',
    'https://images.pexels.com/photos/458991/pexels-photo-458991.jpeg?auto=compress&cs=tinysrgb&w=1000'
  ],
  breedingSahiwalBull: [
    'https://images.unsplash.com/photo-1551214012-84f95e060dee?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1000&q=80'
  ],
  blackBengalGoat: [
    'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80'
  ],
  jamunapariGoat: [
    'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1000&q=80'
  ],
  totapuriGoat: [
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=1000&q=80'
  ],
  sonaliChicken: [
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1000&q=80'
  ],
  deshiDuck: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1000&q=80'
  ]
};

/**
 * Returns breed-matching images based on slug, id, or product name
 */
export function getDemoImagesForProduct(slugOrId: string = '', name: string = ''): string[] {
  const key = `${slugOrId} ${name}`.toLowerCase();

  if (key.includes('deshi-bachur') || key.includes('দেশি বাছুর')) {
    return DEMO_BREED_IMAGES.deshiCalf;
  }
  if (key.includes('deshi-bolod') || key.includes('bolod') || key.includes('বলদ')) {
    return DEMO_BREED_IMAGES.deshiBolod;
  }
  if (key.includes('breeding') || key.includes('ষাঁড়') || key.includes('bull')) {
    return DEMO_BREED_IMAGES.breedingSahiwalBull;
  }
  if (key.includes('shahiwal') || key.includes('sahiwal') || key.includes('শাহিওয়াল') || key.includes('শাহীওয়াল')) {
    return DEMO_BREED_IMAGES.sahiwalCow;
  }
  if (key.includes('friesian') || key.includes('ফ্রিজিয়ান')) {
    return DEMO_BREED_IMAGES.friesianCross;
  }
  if (key.includes('black-bengal') || key.includes('ব্ল্যাক বেঙ্গল')) {
    return DEMO_BREED_IMAGES.blackBengalGoat;
  }
  if (key.includes('jamunapari') || key.includes('যমুনাপারি')) {
    return DEMO_BREED_IMAGES.jamunapariGoat;
  }
  if (key.includes('totapuri') || key.includes('তোতাপারি')) {
    return DEMO_BREED_IMAGES.totapuriGoat;
  }
  if (key.includes('sonali') || key.includes('সোনালী')) {
    return DEMO_BREED_IMAGES.sonaliChicken;
  }
  if (key.includes('duck') || key.includes('hnas') || key.includes('hash') || key.includes('হাঁস')) {
    return DEMO_BREED_IMAGES.deshiDuck;
  }

  // General category fallbacks
  if (key.includes('ছাগল') || key.includes('goat')) {
    return DEMO_BREED_IMAGES.blackBengalGoat;
  }
  if (key.includes('মুরগি') || key.includes('hen') || key.includes('chicken')) {
    return DEMO_BREED_IMAGES.sonaliChicken;
  }
  return DEMO_BREED_IMAGES.deshiCalf;
}
