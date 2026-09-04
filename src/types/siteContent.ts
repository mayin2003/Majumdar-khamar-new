export interface SiteHomeContent {
  id?: string;
  logoUrl?: string;
  heroImageCow?: string;
  heroImageGoat?: string;
  heroImageBird?: string;
  // Aliases for backwards compatibility
  heroCowImg?: string;
  heroGoatImg?: string;
  heroPoultryImg?: string;
  farmPhotoUrl?: string;
  headline: string; // 3-line heading
  tagline: string;
  heroParagraph: string;
  location: string;
  locationText?: string;
  farmSectionHeading: string;
  farmPhotoHeading?: string;
  farmSectionParagraph: string;
  farmPhotoParagraph?: string;
  whatsappNumber: string; // digits only e.g. 8801838752049
  address: string;
  phone?: string;
  updatedAt?: string;
}

export const defaultHomeContent: SiteHomeContent = {
  id: "home",
  logoUrl: "",
  heroImageCow: "",
  heroImageGoat: "",
  heroImageBird: "",
  farmPhotoUrl: "",
  headline: "মজুমদার খামার,\nখাঁটি প্রাণী,\nউন্নত আগামী",
  tagline: "প্রকৃতি থেকে, আপনার টেবিলে",
  heroParagraph: "গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য। তাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন — সরাসরি আমাদের খামার থেকে আপনার বাড়িতে।",
  location: "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
  locationText: "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
  farmSectionHeading: "আমাদের খামার থেকে,\nআপনার টেবিলে",
  farmPhotoHeading: "আমাদের খামার থেকে,\nআপনার টেবিলে",
  farmSectionParagraph: "আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।",
  farmPhotoParagraph: "আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।",
  whatsappNumber: "8801838752049",
  address: "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
  phone: "০১৮৩৮৭৫২০৪৯"
};
