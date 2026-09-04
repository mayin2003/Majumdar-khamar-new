import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { uploadImageFile } from '../../services/dataService';
import { CowLogo } from '../../components/ui/CowLogo';
import { toBengaliNumber } from '../../utils/bengali';
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  FileText,
  Sparkles,
  X,
  Clock,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

import defaultCowImg from '../../assets/images/sales_sahiwal_cow_1788283112846.jpg';
import defaultGoatImg from '../../assets/images/sales_black_bengal_1788283142437.jpg';
import defaultPoultryImg from '../../assets/images/sales_sonali_hen_1788283193947.jpg';
import defaultFarmPhoto from '../../assets/images/products_cow_landscape_1788280718661.jpg';

interface PendingImage {
  file: File;
  previewUrl: string;
  name: string;
  sizeText: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Auto-resizing Textarea with automatic height calculation
 */
const AutoResizeTextarea: React.FC<{
  id?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
  className?: string;
}> = ({ id, value, onChange, placeholder, minRows = 3, className = '' }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, minRows * 24)}px`;
    }
  }, [value, minRows]);

  return (
    <textarea
      id={id}
      ref={textareaRef}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

/**
 * Single Image Upload Card with Click-to-Upload, Drag-and-Drop,
 * Immediate Local Preview, File Info, and Reset ('✕') Button.
 */
interface ImageUploadCardProps {
  id: string;
  slotKey: string;
  title: string;
  subtitle: string;
  currentUrl: string;
  pending: PendingImage | null;
  error: string | null;
  isLogoSlot?: boolean;
  colSpan?: string;
  onSelectFile: (file: File) => void;
  onClearPending: () => void;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  id,
  title,
  subtitle,
  currentUrl,
  pending,
  error,
  isLogoSlot = false,
  colSpan = '',
  onSelectFile,
  onClearPending
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onSelectFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onSelectFile(files[0]);
    }
    // Reset input value so re-selecting the exact same file fires onChange again
    e.target.value = '';
  };

  const activeUrl = pending ? pending.previewUrl : currentUrl;

  return (
    <div
      id={id}
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isDragging
          ? 'border-[#003F2D] bg-emerald-50/70 ring-2 ring-[#003F2D]/20 shadow-md'
          : pending
          ? 'border-amber-300 bg-amber-50/30 shadow-xs'
          : 'border-gray-200/90 bg-white hover:border-emerald-400/80 hover:bg-emerald-50/10 shadow-xs'
      } ${colSpan}`}
    >
      <div>
        {/* Header with Title and Pending Badge */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <span className="block text-xs font-bold text-gray-900">{title}</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">{subtitle}</span>
          </div>

          {pending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
              <Clock className="w-3 h-3 text-amber-700" />
              পরিবর্তন অপেক্ষমান
            </span>
          )}
        </div>

        {/* Clickable & Draggable Preview Zone */}
        <div
          onClick={handleCardClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group w-full h-36 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center overflow-hidden bg-gray-50 select-none ${
            isDragging
              ? 'border-solid border-[#003F2D] bg-emerald-100/50'
              : pending
              ? 'border-solid border-amber-300'
              : 'border-dashed border-gray-300 hover:border-[#003F2D]'
          }`}
        >
          {activeUrl ? (
            <img
              src={activeUrl}
              alt={title}
              className={`w-full h-full transition-transform duration-300 group-hover:scale-102 ${
                isLogoSlot ? 'object-contain p-3' : 'object-cover'
              }`}
            />
          ) : isLogoSlot ? (
            <div className="p-3 bg-[#003F2D] rounded-xl flex items-center justify-center">
              <CowLogo size="md" logoUrl="" />
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400 gap-1.5 p-3 text-center">
              <ImageIcon className="w-8 h-8 stroke-1" />
              <span className="text-xs">ছবি নির্বাচন করুন</span>
            </div>
          )}

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center backdrop-blur-[1px]">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">ক্লিক করে বা ড্র্যাগ করে ছবি আনুন</span>
            <span className="text-[10px] text-gray-200">JPG, PNG, WEBP (সর্বোচ্চ ২MB)</span>
          </div>

          {/* Clear / Reset ('✕') Button for Pending Selection */}
          {pending && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearPending();
              }}
              title="পূর্বাবস্থায় ফিরুন"
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-200 shadow-md flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected File Details */}
        {pending && (
          <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
            <span className="truncate font-medium flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{pending.name}</span>
            </span>
            <span className="text-[11px] font-mono text-amber-800 shrink-0 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
              {pending.sizeText}
            </span>
          </div>
        )}

        {/* Inline Error Message */}
        {error && (
          <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCardClick}
          className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-[#003F2D] hover:text-white text-gray-700 border border-gray-300 hover:border-[#003F2D] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{pending ? 'অন্য ছবি বাছাই করুন' : 'ছবি পরিবর্তন করুন'}</span>
        </button>

        {pending && (
          <button
            type="button"
            onClick={onClearPending}
            title="নির্বাচন বাতিল করুন"
            className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            বাতিল
          </button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
};

export const AdminHomeContent: React.FC = () => {
  const { siteContent, updateSiteContent } = useSiteContent();

  const [formData, setFormData] = useState({
    logoUrl: siteContent.logoUrl || '',
    heroImageCow: siteContent.heroImageCow || siteContent.heroCowImg || defaultCowImg,
    heroImageGoat: siteContent.heroImageGoat || siteContent.heroGoatImg || defaultGoatImg,
    heroImageBird: siteContent.heroImageBird || siteContent.heroPoultryImg || defaultPoultryImg,
    farmPhotoUrl: siteContent.farmPhotoUrl || defaultFarmPhoto,
    tagline: siteContent.tagline || "প্রকৃতি থেকে, আপনার টেবিলে",
    heroParagraph: siteContent.heroParagraph || "গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য। তাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন — সরাসরি আমাদের খামার থেকে আপনার বাড়িতে।",
    location: siteContent.location || siteContent.locationText || "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
    farmSectionHeading: siteContent.farmSectionHeading || siteContent.farmPhotoHeading || "আমাদের খামার থেকে,\nআপনার টেবিলে",
    farmSectionParagraph: siteContent.farmSectionParagraph || siteContent.farmPhotoParagraph || "আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।",
    whatsappNumber: siteContent.whatsappNumber || "8801838752049",
    address: siteContent.address || "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
    phone: siteContent.phone || "০১৮৩৮৭৫২০৪৯"
  });

  // Separate 3 single-line inputs for headline
  const [headlineLine1, setHeadlineLine1] = useState('');
  const [headlineLine2, setHeadlineLine2] = useState('');
  const [headlineLine3, setHeadlineLine3] = useState('');

  // Pending images state (staged locally until save)
  const [pendingImages, setPendingImages] = useState<Record<string, PendingImage>>({});
  const [slotErrors, setSlotErrors] = useState<Record<string, string | null>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Sync state when baseline siteContent loads or updates
  useEffect(() => {
    setFormData({
      logoUrl: siteContent.logoUrl || '',
      heroImageCow: siteContent.heroImageCow || siteContent.heroCowImg || defaultCowImg,
      heroImageGoat: siteContent.heroImageGoat || siteContent.heroGoatImg || defaultGoatImg,
      heroImageBird: siteContent.heroImageBird || siteContent.heroPoultryImg || defaultPoultryImg,
      farmPhotoUrl: siteContent.farmPhotoUrl || defaultFarmPhoto,
      tagline: siteContent.tagline || "প্রকৃতি থেকে, আপনার টেবিলে",
      heroParagraph: siteContent.heroParagraph || "গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য। তাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন — সরাসরি আমাদের খামার থেকে আপনার বাড়িতে।",
      location: siteContent.location || siteContent.locationText || "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
      farmSectionHeading: siteContent.farmSectionHeading || siteContent.farmPhotoHeading || "আমাদের খামার থেকে,\nআপনার টেবিলে",
      farmSectionParagraph: siteContent.farmSectionParagraph || siteContent.farmPhotoParagraph || "আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।",
      whatsappNumber: siteContent.whatsappNumber || "8801838752049",
      address: siteContent.address || "উত্তর রাজেশপুর, পরশুরাম, ফেনী",
      phone: siteContent.phone || "০১৮৩৮৭৫২০৪৯"
    });

    const lines = (siteContent.headline || "মজুমদার খামার,\nখাঁটি প্রাণী,\nউন্নত আগামী").split('\n');
    setHeadlineLine1(lines[0] || 'মজুমদার খামার,');
    setHeadlineLine2(lines[1] || 'খাঁটি প্রাণী,');
    setHeadlineLine3(lines[2] || 'উন্নত আগামী');
  }, [siteContent]);

  // Handle image file selection with validation and instant preview
  const handleSelectImageFile = (slot: string, file: File) => {
    // 1. Validate MIME type & file extension
    const isMimeValid = ALLOWED_IMAGE_TYPES.includes(file.type);
    const hasValidExtension = /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isMimeValid && !hasValidExtension) {
      setSlotErrors((prev) => ({
        ...prev,
        [slot]: 'শুধুমাত্র JPG, PNG বা WEBP ফরম্যাটের ছবি গ্রহণযোগ্য।'
      }));
      return;
    }

    // 2. Validate file size (max 2MB)
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSlotErrors((prev) => ({
        ...prev,
        [slot]: `ছবির সাইজ ছোট করুন, সর্বোচ্চ ২MB (বর্তমান সাইজ: ${sizeMB}MB)`
      }));
      return;
    }

    // Clear previous error for this slot
    setSlotErrors((prev) => ({ ...prev, [slot]: null }));
    setGlobalError(null);

    // 3. Create instant local preview URL
    const previewUrl = URL.createObjectURL(file);
    const sizeKB = Math.round(file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    setPendingImages((prev) => ({
      ...prev,
      [slot]: {
        file,
        previewUrl,
        name: file.name,
        sizeText
      }
    }));
  };

  // Clear single pending image
  const handleClearPending = (slot: string) => {
    setPendingImages((prev) => {
      const copy = { ...prev };
      if (copy[slot]?.previewUrl) {
        URL.revokeObjectURL(copy[slot].previewUrl);
      }
      delete copy[slot];
      return copy;
    });
    setSlotErrors((prev) => ({ ...prev, [slot]: null }));
  };

  // Check for unsaved modifications
  const hasUnsavedChanges = useMemo(() => {
    if (Object.keys(pendingImages).length > 0) return true;

    const currentHeadline = [headlineLine1, headlineLine2, headlineLine3].join('\n');
    const originalHeadline = siteContent.headline || "মজুমদার খামার,\nখাঁটি প্রাণী,\nউন্নত আগামী";

    if (currentHeadline.trim() !== originalHeadline.trim()) return true;
    if (formData.tagline !== (siteContent.tagline || "প্রকৃতি থেকে, আপনার টেবিলে")) return true;
    if (formData.heroParagraph !== (siteContent.heroParagraph || "গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য। তাজা, স্বাস্থ্যকর ও প্রাকৃতিকভাবে পালন — সরাসরি আমাদের খামার থেকে আপনার বাড়িতে।")) return true;
    if (formData.location !== (siteContent.location || siteContent.locationText || "উত্তর রাজেশপুর, পরশুরাম, ফেনী")) return true;
    if (formData.farmSectionHeading !== (siteContent.farmSectionHeading || siteContent.farmPhotoHeading || "আমাদের খামার থেকে,\nআপনার টেবিলে")) return true;
    if (formData.farmSectionParagraph !== (siteContent.farmSectionParagraph || siteContent.farmPhotoParagraph || "আমরা প্রতিটি প্রাণীকে যত্ন, ভালোবাসা ও প্রাকৃতিক পরিবেশে লালন-পালন করি, যাতে আপনি পান খাঁটি ও নিরাপদ প্রাণিজ পণ্য।")) return true;
    if (formData.whatsappNumber !== (siteContent.whatsappNumber || "8801838752049")) return true;
    if (formData.address !== (siteContent.address || "উত্তর রাজেশপুর, পরশুরাম, ফেনী")) return true;
    if (formData.phone !== (siteContent.phone || "০১৮৩৮৭৫২০৪৯")) return true;

    return false;
  }, [formData, pendingImages, headlineLine1, headlineLine2, headlineLine3, siteContent]);

  // Warn before navigating away if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'আপনার পরিবর্তন সংরক্ষিত হয়নি, তবুও কি চলে যেতে চান?';
        return 'আপনার পরিবর্তন সংরক্ষিত হয়নি, তবুও কি চলে যেতে চান?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setGlobalError(null);

    try {
      const updatedImages: Record<string, string> = {};

      // 1. Process and upload any staged pending images
      for (const [slot, pending] of Object.entries(pendingImages) as [string, PendingImage][]) {
        try {
          const targetFolder = slot === 'logoUrl' 
            ? 'logo' 
            : slot.startsWith('hero') 
            ? 'hero' 
            : slot === 'farmPhotoUrl' 
            ? 'farm' 
            : 'site';
          const url = await uploadImageFile(pending.file, targetFolder);
          updatedImages[slot] = url;
        } catch (err: any) {
          throw new Error(`'${slot}' আপলোড করতে সমস্যা হয়েছে: ${err?.message || 'ত্রুটি'}`);
        }
      }

      // 2. Assemble complete joined payload
      const combinedHeadline = [headlineLine1, headlineLine2, headlineLine3]
        .map((l) => l.trim())
        .join('\n');

      const finalPayload = {
        ...formData,
        ...updatedImages,
        headline: combinedHeadline,
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, '') // sanitize digits
      };

      // 3. Save to data layer
      await updateSiteContent(finalPayload);

      // Clean up object URLs and clear pending state
      (Object.values(pendingImages) as PendingImage[]).forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      setPendingImages({});
      setSlotErrors({});

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error saving site content:', err);
      setGlobalError(err?.message || 'কনটেন্ট সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              হোমপেজ ও সাইট কনটেন্ট সম্পাদনা
            </h1>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                পরিবর্তন হয়েছে (অসংরক্ষিত)
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            হেডলাইন, হিরো সেকশনের ছবি, খামার ফটো ও যোগাযোগের তথ্য পরিবর্তন করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-sm transition-all shadow-sm cursor-pointer disabled:opacity-60 shrink-0"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <div>
            <span className="font-bold">সফলভাবে সংরক্ষিত হয়েছে!</span>
            <p className="text-xs text-emerald-700">হোমপেজ এবং পাবলিক ওয়েবসাইটে তাৎক্ষণিকভাবে আপডেট হয়েছে।</p>
          </div>
        </div>
      )}

      {/* Global Error Alert */}
      {globalError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================================================================= */}
        {/* Section 1: Images Management with Drag & Drop, Instant Preview    */}
        {/* ================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#003F2D]" />
                খামার ও হিরো সেকশনের ছবি
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                ক্লিক করে অথবা যেকোনো ছবি সরাসরি কার্ডের উপর টেনে আনুন (Drag & Drop)।
              </p>
            </div>
            <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              সর্বোচ্চ সাইজ: ২MB (JPG/PNG/WEBP)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Slot 1: Logo */}
            <ImageUploadCard
              id="image-slot-logo"
              slotKey="logoUrl"
              title="১. খামারের লোগো"
              subtitle="ওয়েবসাইট হেডার, অ্যাডমিন প্যানেল ও ফুটার"
              currentUrl={formData.logoUrl}
              pending={pendingImages['logoUrl'] || null}
              error={slotErrors['logoUrl'] || null}
              isLogoSlot={true}
              onSelectFile={(file) => handleSelectImageFile('logoUrl', file)}
              onClearPending={() => handleClearPending('logoUrl')}
            />

            {/* Slot 2: Hero Cow */}
            <ImageUploadCard
              id="image-slot-hero-cow"
              slotKey="heroImageCow"
              title="২. হিরো সেকশন: গরুর ছবি"
              subtitle="হোমপেজ প্রধান হিরো ব্যানার ফ্যান কার্ড"
              currentUrl={formData.heroImageCow}
              pending={pendingImages['heroImageCow'] || null}
              error={slotErrors['heroImageCow'] || null}
              onSelectFile={(file) => handleSelectImageFile('heroImageCow', file)}
              onClearPending={() => handleClearPending('heroImageCow')}
            />

            {/* Slot 3: Hero Goat */}
            <ImageUploadCard
              id="image-slot-hero-goat"
              slotKey="heroImageGoat"
              title="৩. হিরো সেকশন: ছাগলের ছবি"
              subtitle="হোমপেজ প্রধান হিরো ব্যানার ফ্যান কার্ড"
              currentUrl={formData.heroImageGoat}
              pending={pendingImages['heroImageGoat'] || null}
              error={slotErrors['heroImageGoat'] || null}
              onSelectFile={(file) => handleSelectImageFile('heroImageGoat', file)}
              onClearPending={() => handleClearPending('heroImageGoat')}
            />

            {/* Slot 4: Hero Poultry */}
            <ImageUploadCard
              id="image-slot-hero-poultry"
              slotKey="heroImageBird"
              title="৪. হিরো সেকশন: মুরগি ও হাঁসের ছবি"
              subtitle="হোমপেজ প্রধান হিরো ব্যানার ফ্যান কার্ড"
              currentUrl={formData.heroImageBird}
              pending={pendingImages['heroImageBird'] || null}
              error={slotErrors['heroImageBird'] || null}
              onSelectFile={(file) => handleSelectImageFile('heroImageBird', file)}
              onClearPending={() => handleClearPending('heroImageBird')}
            />

            {/* Slot 5: Farm Landscape Photo */}
            <ImageUploadCard
              id="image-slot-farm-photo"
              slotKey="farmPhotoUrl"
              title="৫. খামারের বড় ফটো"
              subtitle="হোমপেজ সেকশন ৩: প্রাকৃতিক খামার দৃশ্য"
              currentUrl={formData.farmPhotoUrl}
              pending={pendingImages['farmPhotoUrl'] || null}
              error={slotErrors['farmPhotoUrl'] || null}
              colSpan="sm:col-span-2"
              onSelectFile={(file) => handleSelectImageFile('farmPhotoUrl', file)}
              onClearPending={() => handleClearPending('farmPhotoUrl')}
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* Section 2: Headline (3 Separate Lines) & Text Details             */}
        {/* ================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003F2D]" />
              হোমপেজ টেক্সট ও বিবরণ
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              হেডলাইন, ট্যাগলাইন, হিরো প্যারাগ্রাফ এবং খামার সেকশনের বর্ণনা।
            </p>
          </div>

          <div className="space-y-6">
            {/* 3 Separate Input Boxes for 3-Line Headline */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-900">
                  প্রধান ৩-লাইনের হেডলাইন
                </label>
                <span className="text-[11px] font-medium text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  হোম হিরো সেকশন
                </span>
              </div>
              <p className="text-xs text-gray-600">
                ৩টি আলাদা লাইনে লিখুন। হোমপেজের শুরুতে প্রতিটি লাইন বড় ও সুন্দরভাবে সজ্জিত থাকবে।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                <div>
                  <label htmlFor="headline-line-1" className="block text-xs font-semibold text-gray-700 mb-1">
                    লাইন ১ (যেমন: মজুমদার খামার,)
                  </label>
                  <input
                    id="headline-line-1"
                    type="text"
                    value={headlineLine1}
                    onChange={(e) => setHeadlineLine1(e.target.value)}
                    className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 bg-white shadow-2xs font-medium"
                    placeholder="মজুমদার খামার,"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="headline-line-2" className="block text-xs font-semibold text-gray-700 mb-1">
                    লাইন ২ (যেমন: খাঁটি প্রাণী,)
                  </label>
                  <input
                    id="headline-line-2"
                    type="text"
                    value={headlineLine2}
                    onChange={(e) => setHeadlineLine2(e.target.value)}
                    className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 bg-white shadow-2xs font-medium"
                    placeholder="খাঁটি প্রাণী,"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="headline-line-3" className="block text-xs font-semibold text-gray-700 mb-1">
                    লাইন ৩ (যেমন: উন্নত আগামী)
                  </label>
                  <input
                    id="headline-line-3"
                    type="text"
                    value={headlineLine3}
                    onChange={(e) => setHeadlineLine3(e.target.value)}
                    className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 bg-white shadow-2xs font-medium"
                    placeholder="উন্নত আগামী"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tagline */}
              <div>
                <label htmlFor="input-tagline" className="block text-xs font-bold text-gray-800 mb-1.5">
                  ট্যাগলাইন (ছোট স্লোগান)
                </label>
                <input
                  id="input-tagline"
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 shadow-2xs"
                  placeholder="প্রকৃতি থেকে, আপনার টেবিলে"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  হেডারের লোগোর নিচে ও হিরোর সাব-টাইটেল হিসেবে প্রদর্শিত হয়।
                </span>
              </div>

              {/* Location Text */}
              <div>
                <label htmlFor="input-location" className="block text-xs font-bold text-gray-800 mb-1.5">
                  অবস্থান টেক্সট (হিরো ব্যাজ ও হেডারে প্রদর্শিত)
                </label>
                <input
                  id="input-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 shadow-2xs"
                  placeholder="উত্তর রাজেশপুর, পরশুরাম, ফেনী"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  হিরো সেকশনের উপরের সবুজ লোকেশন ব্যাজে দেখানো হয়।
                </span>
              </div>

              {/* Hero Paragraph with Auto-resize and Character Count */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-hero-paragraph" className="block text-xs font-bold text-gray-800">
                    হিরো প্যারাগ্রাফ (ভূমিকা বর্ণনা)
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">
                    {toBengaliNumber(formData.heroParagraph.length)} অক্ষর
                  </span>
                </div>
                <AutoResizeTextarea
                  id="input-hero-paragraph"
                  minRows={3}
                  value={formData.heroParagraph}
                  onChange={(val) => setFormData((prev) => ({ ...prev, heroParagraph: val }))}
                  className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 leading-relaxed shadow-2xs"
                  placeholder="গরু, ছাগল, মুরগি ও হাঁস — আপনার পরিবারের জন্য..."
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  খামারের মূল আদর্শ ও প্রাণিসম্পদের গুণমান নিয়ে ২-৩ বাক্যের ভূমিকা।
                </span>
              </div>

              {/* Farm Section 3 Heading */}
              <div>
                <label htmlFor="input-farm-heading" className="block text-xs font-bold text-gray-800 mb-1.5">
                  খামার ফটো সেকশন হেডিং
                </label>
                <input
                  id="input-farm-heading"
                  type="text"
                  value={formData.farmSectionHeading}
                  onChange={(e) => setFormData((prev) => ({ ...prev, farmSectionHeading: e.target.value }))}
                  className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 shadow-2xs"
                  placeholder="আমাদের খামার থেকে, আপনার টেবিলে"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  হোমপেজের ৩য় সেকশনে খামারের বড় ফটোর পাশের শিরোনাম।
                </span>
              </div>

              {/* Farm Section 3 Paragraph with Auto-resize and Character Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-farm-paragraph" className="block text-xs font-bold text-gray-800">
                    খামার ফটো সেকশন প্যারাগ্রাফ
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">
                    {toBengaliNumber(formData.farmSectionParagraph.length)} অক্ষর
                  </span>
                </div>
                <AutoResizeTextarea
                  id="input-farm-paragraph"
                  minRows={2}
                  value={formData.farmSectionParagraph}
                  onChange={(val) => setFormData((prev) => ({ ...prev, farmSectionParagraph: val }))}
                  className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 leading-relaxed shadow-2xs"
                  placeholder="আমরা প্রতিটি প্রাণীকে যত্ন ও প্রাকৃতিক পরিবেশে লালন-পালন করি..."
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  খামারের পরিবেশ ও মান নিয়ে সংক্ষিপ্ত বর্ণনা।
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Section 3: Contact & WhatsApp                                     */}
        {/* ================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#003F2D]" />
              সাইট-ওয়াইড যোগাযোগ ও হোয়াটসঅ্যাপ
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              এই নম্বর ও ঠিকানা পুরো ওয়েবসাইটের হেডার বাটন, ফ্লোটিং হোয়াটসঅ্যাপ এবং ফুটারের সাথে সিঙ্ক থাকবে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Number */}
            <div>
              <label htmlFor="input-whatsapp" className="block text-xs font-bold text-gray-800 mb-1.5">
                হোয়াটসঅ্যাপ নম্বর (শুধুমাত্র সংখ্যা)
              </label>
              <input
                id="input-whatsapp"
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 font-mono shadow-2xs"
                placeholder="8801838752049"
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                আন্তর্জাতিক ফরম্যাট (880...) ব্যবহার করুন। এটি সব wa.me লিঙ্কে সরাসরি যুক্ত হবে।
              </span>
            </div>

            {/* Display Phone Number */}
            <div>
              <label htmlFor="input-phone" className="block text-xs font-bold text-gray-800 mb-1.5">
                প্রদর্শনের জন্য ফোন নম্বর (বাংলা/ইংরেজি)
              </label>
              <input
                id="input-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full py-3 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 shadow-2xs"
                placeholder="০১৮৩৮৭৫২০৪৯"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                ওয়েবসাইটের ফুটারে এবং কল বাটনে দেখানো ফোন নম্বর।
              </span>
            </div>

            {/* Farm Address with Character Count */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-address" className="block text-xs font-bold text-gray-800">
                  খামারের সম্পূর্ণ ঠিকানা
                </label>
                <span className="text-[11px] font-mono text-gray-500">
                  {toBengaliNumber(formData.address.length)} অক্ষর
                </span>
              </div>
              <AutoResizeTextarea
                id="input-address"
                minRows={2}
                value={formData.address}
                onChange={(val) => setFormData((prev) => ({ ...prev, address: val }))}
                className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 shadow-2xs"
                placeholder="উত্তর রাজেশপুর, পরশুরাম, ফেনী"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                ফুটার ও যোগাযোগ পেজে এই ঠিকানা প্রদর্শিত হবে।
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Bottom Save Bar with Status & Action                              */}
        {/* ================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-600">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-2 text-amber-800 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                আপনার কিছু পরিবর্তন এখনও সংরক্ষিত হয়নি।
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                সব তথ্য সংরক্ষিত অবস্থায় রয়েছে।
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সব পরিবর্তন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
