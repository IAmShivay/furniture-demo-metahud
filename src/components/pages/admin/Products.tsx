'use client';

import React, { useState } from 'react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
} from '../../../store/api/productsApi';
import {
  Plus, Search, Edit2, Trash2, X, Loader2, Package, Star, Eye, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['sofas', 'chairs', 'tables', 'storage', 'lighting', 'decor', 'bedroom', 'dining', 'office'];

const DEFAULT_CUSTOMIZATION = [
  { id: 'wood-type', title: 'Wood Type', description: 'Choose your preferred wood', required: true, type: 'single', options: [
    { id: 'oak', name: 'Oak', price: 0, description: 'Classic and durable', available: true },
    { id: 'walnut', name: 'Walnut', price: 199, description: 'Rich dark tones', available: true },
    { id: 'mahogany', name: 'Mahogany', price: 399, description: 'Premium reddish-brown', available: true },
    { id: 'teak', name: 'Teak', price: 699, description: 'Weather-resistant luxury', available: true },
  ]},
  { id: 'finish-type', title: 'Finish', description: 'Select a finish', required: true, type: 'single', options: [
    { id: 'natural', name: 'Natural', price: 0, available: true },
    { id: 'satin', name: 'Satin', price: 99, available: true },
    { id: 'gloss', name: 'Gloss', price: 149, available: true },
    { id: 'distressed', name: 'Distressed', price: 249, available: true },
  ]},
  { id: 'color-option', title: 'Color', description: 'Pick a color stain', required: true, type: 'single', options: [
    { id: 'natural-brown', name: 'Natural Brown', price: 0, available: true },
    { id: 'espresso', name: 'Espresso', price: 99, available: true },
    { id: 'honey', name: 'Honey', price: 79, available: true },
    { id: 'white-wash', name: 'White Wash', price: 129, available: true },
  ]},
  { id: 'assembly-option', title: 'Assembly', description: 'Choose assembly option', required: true, type: 'single', options: [
    { id: 'diy', name: 'DIY Assembly', price: 0, available: true },
    { id: 'basic', name: 'Basic Assembly', price: 149, available: true },
    { id: 'white-glove', name: 'White Glove', price: 299, available: true },
  ]},
  { id: 'protection-plan', title: 'Protection Plan', description: 'Extended warranty', required: false, type: 'single', options: [
    { id: 'none', name: 'No Protection', price: 0, available: true },
    { id: '2-year', name: '2-Year Plan', price: 199, available: true },
    { id: '5-year', name: '5-Year Plan', price: 399, available: true },
  ]},
];

const emptyForm = {
  name: '', slug: '', description: '', shortDescription: '', brand: 'LuxeHouse',
  category: 'chairs', subcategory: '', basePrice: 0, originalPrice: 0,
  images: [''], materials: [''], colors: [''], features: [''],
  status: 'active', featured: false, bestseller: false, newArrival: false,
  enableCustomization: false,
  inventory: { quantity: 0, reserved: 0, lowStockThreshold: 5, trackInventory: true },
  dimensions: { length: '', width: '', height: '', weight: '', unit: 'inches' },
  shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 }, freeShipping: false, shippingClass: 'standard' as const },
};

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading } = useGetProductsQuery({
    page, limit: 10, search: search || undefined, category: categoryFilter || undefined,
    includeInactive: true,
  });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const products = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id || (p as any)._id);
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      shortDescription: p.shortDescription || '', brand: p.brand,
      category: p.category, subcategory: p.subcategory || '',
      basePrice: p.basePrice, originalPrice: p.originalPrice || 0,
      images: p.images.length ? p.images : [''],
      materials: p.materials.length ? p.materials : [''],
      colors: p.colors.length ? p.colors : [''],
      features: p.features.length ? p.features : [''],
      status: p.status, featured: p.featured, bestseller: p.bestseller, newArrival: p.newArrival,
      enableCustomization: !!(p as any).customization?.length,
      inventory: p.inventory ? { ...p.inventory, trackInventory: true } : emptyForm.inventory,
      dimensions: { unit: 'inches', ...(p.dimensions ?? {}) },
      shipping: emptyForm.shipping,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { enableCustomization, ...rest } = form;
    const payload = {
      ...rest, slug,
      images: form.images.filter(Boolean),
      materials: form.materials.filter(Boolean),
      colors: form.colors.filter(Boolean),
      features: form.features.filter(Boolean),
      customization: enableCustomization ? DEFAULT_CUSTOMIZATION : [],
    };
    try {
      if (editingId) {
        await updateProduct({ id: editingId, updates: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete product');
    }
  };

  const updateArrayField = (field: 'images' | 'materials' | 'colors' | 'features', idx: number, value: string) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'images' | 'materials' | 'colors' | 'features') => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'images' | 'materials' | 'colors' | 'features', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{pagination?.total || 0} total products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b bg-gray-50 text-left text-gray-500 uppercase text-xs">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const id = p.id || p._id;
                  return (
                    <tr key={id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize">{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">₹{p.basePrice?.toLocaleString('en-IN')}</span>
                        {p.originalPrice && p.originalPrice > p.basePrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.inventory?.quantity > p.inventory?.lowStockThreshold ? 'text-green-600' : p.inventory?.quantity > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                          {p.inventory?.quantity || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                          <span className="text-gray-700">{p.rating?.average?.toFixed(1) || '0.0'}</span>
                          <span className="text-gray-400 text-xs">({p.rating?.count || 0})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' :
                          p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{p.status}</span>
                        {p.featured && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700">Featured</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/product/${id}`} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Page {pagination.current} of {pagination.pages}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-1.5 rounded-lg border text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}
                className="p-1.5 rounded-lg border text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-600 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input type="text" required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
                  <input type="text" required value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" required min={0} step={0.01} value={form.basePrice || ''} onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" min={0} step={0.01} value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input type="number" required min={0} value={form.inventory.quantity || ''} onChange={e => setForm({ ...form, inventory: { ...form.inventory, quantity: Number(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <input type="text" value={form.dimensions.length} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, length: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder='e.g. 32"' />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                  <input type="text" value={form.dimensions.width} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, width: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder='e.g. 30"' />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input type="text" value={form.dimensions.height} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, height: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder='e.g. 35"' />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input type="text" value={form.dimensions.weight} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, weight: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder='e.g. 45 lbs' />
                </div>
              </div>

              {(['images', 'materials', 'colors', 'features'] as const).map(field => (
                <div key={field}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field} {field === 'images' || field === 'materials' || field === 'colors' ? '*' : ''}</label>
                    <button type="button" onClick={() => addArrayItem(field)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {form[field].map((val, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={val} onChange={e => updateArrayField(field, idx, e.target.value)}
                          placeholder={field === 'images' ? 'Image URL' : `Enter ${field.slice(0, -1)}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        {form[field].length > 1 && (
                          <button type="button" onClick={() => removeArrayItem(field, idx)} className="p-2 text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-6">
                {(['featured', 'bestseller', 'newArrival'] as const).map(flag => (
                  <label key={flag} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[flag]} onChange={e => setForm({ ...form, [flag]: e.target.checked })}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                    <span className="text-sm text-gray-700 capitalize">{flag.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>

              <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">Enable Customization</span>
                    <p className="text-xs text-gray-500 mt-0.5">Allow customers to customize wood type, finish, color, assembly & protection plan</p>
                  </div>
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${form.enableCustomization ? 'bg-amber-600' : 'bg-gray-300'}`}
                    onClick={() => setForm({ ...form, enableCustomization: !form.enableCustomization })}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.enableCustomization ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
                {form.enableCustomization && (
                  <div className="mt-3 text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-2">
                    This product will include: Wood Type (4 options) · Finish (4 options) · Color (4 options) · Assembly (3 options) · Protection Plan (3 options)
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={creating || updating}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2">
                  {(creating || updating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
