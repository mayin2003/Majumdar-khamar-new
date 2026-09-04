import React, { useState } from 'react';
import { useSaleProducts } from '../../context/SaleProductsContext';
import { SaleProduct } from '../../types/product';
import { uploadImageFile } from '../../services/dataService';
import { formatPriceBDT, toBengaliNumber } from '../../utils/bengali';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  ShoppingBag, 
  Image as ImageIcon,
  CheckCircle2,
  Trash,
  Tag
} from 'lucide-react';

export const AdminSaleProducts: React.FC = () => {
  const { 
    saleProducts, 
    loading, 
    toggleSaleProductStock, 
    toggleSaleProductLimited, 
    saveSaleProduct, 
    deleteSaleProduct,
    deleteDemoSaleProducts 
  } = useSaleProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SaleProduct | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoDeletedMsg, setDemoDeletedMsg] = useState<string | null>(null);

  // Form State (WITH price field!)
  const initialFormData: Omit<SaleProduct, 'id'> = {
    name: '',
    category: 'গরু',
    price: 0,
    age: '',
    weight: '',
    breed: '',
    gender: 'ষাঁড় বাছুর',
    healthStatus: 'সুস্থ, নিয়মিত টিকা প্রাপ্ত',
    description: '',
    images: [],
    inStock: true,
    isLimited: false,
    slug: '',
    isDemo: false
  };

  const [formData, setFormData] = useState<Omit<SaleProduct, 'id'>>(initialFormData);
  const [formImageFiles, setFormImageFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Sale Products
  const filteredProducts = saleProducts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'সব' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const demoCount = saleProducts.filter(p => p.isDemo === true || p.id.startsWith('sale-')).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setFormImageFiles([]);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: SaleProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price || 0,
      age: p.age,
      weight: p.weight,
      breed: p.breed,
      gender: p.gender,
      healthStatus: p.healthStatus,
      description: p.description || '',
      images: p.images || [],
      inStock: p.inStock,
      isLimited: p.isLimited,
      slug: p.slug,
      isDemo: p.isDemo || false
    });
    setFormImageFiles(p.images || []);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0980-\u09FF-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `sale-${Date.now()}`;

    setFormData(prev => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slugified
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formImageFiles.length >= 3) {
      setFormError('সর্বোচ্চ ৩টি ছবি আপলোড করা যাবে।');
      return;
    }

    setUploadingImage(true);
    setFormError(null);

    try {
      const file = files[0];
      const url = await uploadImageFile(file, 'sale-products');
      setFormImageFiles(prev => [...prev.slice(0, 2), url]);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []).slice(0, 2), url]
      }));
    } catch (err: any) {
      console.error('Error uploading sale image:', err);
      setFormError(err?.message || 'ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = formImageFiles.filter((_, i) => i !== index);
    setFormImageFiles(updated);
    setFormData(prev => ({ ...prev, images: updated }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('পণ্যটির নাম পূরণ করা আবশ্যক!');
      return;
    }

    if (Number(formData.price) <= 0) {
      setFormError('অনুগ্রহ করে সঠিক মূল্য (৳) উল্লেখ করুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalSlug = formData.slug.trim() || `sale-${Date.now()}`;
      const productToSave: SaleProduct = {
        id: editingProduct ? editingProduct.id : `new-sale-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        age: formData.age.trim() || 'প্রাপ্তবয়স্ক',
        weight: formData.weight.trim() || 'মানসম্মত ওজন',
        breed: formData.breed.trim() || 'দেশি',
        gender: formData.gender.trim() || 'ষাঁড় বাছুর',
        healthStatus: formData.healthStatus.trim() || 'সুস্থ ও টিকা প্রাপ্ত',
        description: formData.description?.trim() || '',
        images: formImageFiles.length > 0 ? formImageFiles : ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800'],
        inStock: formData.inStock,
        isLimited: formData.isLimited,
        slug: finalSlug,
        isDemo: editingProduct ? (editingProduct.isDemo || false) : false
      };

      await saveSaleProduct(productToSave);
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Save sale product error:', err);
      setFormError('বিক্রয় পণ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!isDeletingId) return;
    try {
      await deleteSaleProduct(isDeletingId);
      setIsDeletingId(null);
    } catch (err) {
      console.error('Delete sale product error:', err);
    }
  };

  const handleDeleteDemoData = async () => {
    try {
      const count = await deleteDemoSaleProducts();
      setIsDemoModalOpen(false);
      setDemoDeletedMsg(`${count} টি ডেমো বিক্রয় পণ্য মুছে ফেলা হয়েছে।`);
      setTimeout(() => setDemoDeletedMsg(null), 5000);
    } catch (err) {
      console.error('Delete demo sales error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              বিক্রয় পণ্য ও মূল্য তালিকা (Sale Products)
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-[#C95A25] text-xs font-semibold border border-amber-200">
              মূল্য ও অর্ডার সক্রিয়
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            সরাসরি বিক্রির জন্য উপলব্ধ পশু ও পণ্যের মূল্য, ছবি এবং স্টক নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          {demoCount > 0 && (
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#C95A25] font-medium text-xs border border-orange-200 transition-colors cursor-pointer"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>ডেমো বিক্রয় আইটেম মুছুন ({demoCount})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বিক্রয় পণ্য যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {demoDeletedMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2.5 text-green-800 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{demoDeletedMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, জাত বা স্লাগ খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-xs text-gray-900 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-gray-500 shrink-0">ক্যাটাগরি:</span>
          {(['সব', 'গরু', 'ছাগল', 'মুরগি ও হাঁস'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#003F2D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sale Products Display: Desktop Table + Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* MOBILE CARD VIEW (Visible on mobile/tablet screens < md) */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              ডাটা লোড হচ্ছে...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              কোনো বিক্রয় পণ্য পাওয়া যায়নি।
            </div>
          ) : (
            filteredProducts.map((product) => {
              const thumb = product.images?.[0] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800';
              return (
                <div key={product.id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      <img 
                        src={thumb} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                          {product.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-[#C95A25] border border-amber-100 shrink-0">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-[#003F2D] text-sm">
                          {formatPriceBDT(product.price)}
                        </span>
                        {product.weight && (
                          <span className="text-xs text-gray-500">
                            • {product.weight}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        জাত: <span className="font-medium text-gray-700">{product.breed}</span> • {product.age}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Toggles & Action Bar */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      {/* In Stock Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={(e) => toggleSaleProductStock(product.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#003F2D] relative"></div>
                        <span>স্টক</span>
                      </label>

                      {/* Limited Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
                        <input
                          type="checkbox"
                          checked={product.isLimited}
                          onChange={(e) => toggleSaleProductLimited(product.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#C95A25] relative"></div>
                        <span>সীমিত</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-[#003F2D] hover:text-white transition-colors cursor-pointer min-h-[36px]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>
                      <button
                        onClick={() => setIsDeletingId(product.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-600 hover:text-white transition-colors cursor-pointer min-h-[36px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* DESKTOP TABLE VIEW (Visible on >= md screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs font-semibold">
                <th className="py-3.5 px-4 w-16">ছবি</th>
                <th className="py-3.5 px-4">নাম ও জাত</th>
                <th className="py-3.5 px-4">ক্যাটাগরি</th>
                <th className="py-3.5 px-4">নির্ধারিত মূল্য</th>
                <th className="py-3.5 px-4 text-center">স্টকে আছে</th>
                <th className="py-3.5 px-4 text-center">সীমিত স্টক</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                    ডাটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    কোনো বিক্রয় পণ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const thumb = product.images?.[0] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800';
                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                          <img 
                            src={thumb} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>

                      {/* Name & Breed */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          জাত: <span className="font-medium text-gray-700">{product.breed}</span> • {product.age}
                        </div>
                        {product.isDemo && (
                          <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 mt-1">
                            ডেমো ডাটা
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-[#C95A25] border border-amber-100">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#003F2D] text-sm">
                          {formatPriceBDT(product.price)}
                        </div>
                        <div className="text-[11px] text-gray-500">{product.weight}</div>
                      </td>

                      {/* inStock Instant Toggle */}
                      <td className="py-3 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.inStock}
                            onChange={(e) => toggleSaleProductStock(product.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003F2D]"></div>
                        </label>
                      </td>

                      {/* isLimited Instant Toggle */}
                      <td className="py-3 px-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isLimited}
                            onChange={(e) => toggleSaleProductLimited(product.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C95A25]"></div>
                        </label>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#003F2D] transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsDeletingId(product.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#C95A25] transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Sale Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full my-8 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'বিক্রয় পণ্য সম্পাদনা করুন' : 'নতুন বিক্রয় পণ্য যোগ করুন'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                পণ্যটির বিবরণ, মূল্য ও ছবি দিয়ে সরাসরি বিক্রয় তালিকায় যুক্ত করুন।
              </p>
            </div>

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পণ্যটির নাম *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="যেমন: দেশি বাছুর, শাহীওয়াল গাভী"
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    বিক্রয় মূল্য (৳ টাকা) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">৳</span>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="85000"
                      required
                      min="1"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900 bg-white"
                  >
                    <option value="গরু">গরু</option>
                    <option value="ছাগল">ছাগল</option>
                    <option value="মুরগি ও হাঁস">মুরগি ও হাঁস</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    জাত (Breed)
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="যেমন: দেশি, শাহিওয়াল"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    বয়স
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="যেমন: ৮ মাস"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    আনুমানিক ওজন
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="যেমন: ১২০ কেজি"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    লিঙ্গ / ধরন
                  </label>
                  <input
                    type="text"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    placeholder="যেমন: ষাঁড় বাছুর / খাসি"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Health Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    স্বাস্থ্য অবস্থা
                  </label>
                  <input
                    type="text"
                    value={formData.healthStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value }))}
                    placeholder="যেমন: সুস্থ, নিয়মিত টিকা দেওয়া"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Slug */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ইউআরএল স্লাগ (URL Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="deshi-bachur-1"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-xs font-mono text-gray-900 bg-gray-50/50"
                  />
                </div>

                {/* Description Paragraph */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="পণ্যটির বিশেষ গুণাবলী বা পালন বিবরণ..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003F2D] text-sm text-gray-900"
                  />
                </div>

                {/* Images Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    ছবি আপলোড (সর্বোচ্চ ৩টি)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {formImageFiles.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden group">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {formImageFiles.length < 3 && (
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#003F2D] flex flex-col items-center justify-center text-gray-400 hover:text-[#003F2D] cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-medium">{uploadingImage ? '...' : 'ছবি দিন'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded text-[#003F2D] focus:ring-[#003F2D]"
                    />
                    <span>স্টকে আছে (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isLimited}
                      onChange={(e) => setFormData(prev => ({ ...prev, isLimited: e.target.checked }))}
                      className="rounded text-[#C95A25] focus:ring-[#C95A25]"
                    />
                    <span>সীমিত স্টক (Limited Stock)</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#003F2D] hover:bg-[#1a3a2a] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : editingProduct ? 'হালনাগাদ করুন' : 'বিক্রয় পণ্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-[#C95A25]" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              বিক্রয় পণ্যটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              এটি বিক্রয় তালিকা ও ফায়ারবেস থেকে স্থায়ীভাবে মুছে যাবে।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                না, রাখুন
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-[#C95A25] hover:bg-red-700 text-white font-medium text-xs transition-colors"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-[#C95A25] flex items-center justify-center mx-auto mb-4">
              <Trash className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              সকল ডেমো বিক্রয় ডাটা মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              মোট {demoCount} টি ডেমো বিক্রয় পণ্য মুছে যাবে। আসল অ্যাডমিন ডাটা অক্ষত থাকবে।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleDeleteDemoData}
                className="px-5 py-2 rounded-xl bg-[#C95A25] hover:bg-red-700 text-white font-medium text-xs transition-colors"
              >
                সকল ডেমো মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
