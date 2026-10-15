import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  RefreshCw,
  X,
  Upload,
  Download,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FOODS_DATA } from '@/data/foodsData';

interface FoodItem {
  id: number;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  regions: string;
  sort_order: number;
}

interface AdminFoodsTabProps {
  adminPassword: string;
}

export default function AdminFoodsTab({ adminPassword }: AdminFoodsTabProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // JSON Import & Export State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importingJson, setImportingJson] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Must Try',
    regions: '',
    sort_order: 0,
  });

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/foods');
      const data = await res.json();
      if (res.ok && data.foods) {
        setFoods(data.foods);
      }
    } catch {
      toast.error('Failed to load foods.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setForm({
      title: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'Must Try',
      regions: '',
      sort_order: foods.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    setForm({
      title: food.title,
      tagline: food.tagline,
      desc: food.desc,
      image: food.image,
      badge: food.badge,
      regions: food.regions,
      sort_order: food.sort_order,
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|heic|heif|jfif|bmp|tiff|svg)$/i.test(file.name);
    if (!isImage) {
      toast.error('Please choose a valid image file (JPG, PNG, WEBP, etc.)');
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', adminPassword);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Food photo optimized & uploaded! 📸');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Photo upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) {
      toast.error('Please enter title and description.');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = Boolean(editingFood);
      const url = '/api/foods';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: editingFood?.id } : {}),
          ...form,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save food item');

      toast.success(isEdit ? 'Food item updated!' : 'New food item added to live site!');
      setShowModal(false);
      fetchFoods();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving food item.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/foods?id=${id}&admin_password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      toast.success('Food item deleted successfully.');
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport = foods.length > 0 ? foods : FOODS_DATA;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `uncover_ceylon_foods_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Exported ${dataToExport.length} food items to JSON!`);
  };

  // Preload curated 20 dishes into JSON text
  const handlePreloadCurated = () => {
    setJsonText(JSON.stringify(FOODS_DATA, null, 2));
    toast.success('Loaded 20 curated dishes into JSON viewer.');
  };

  // Handle JSON file upload
  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      toast.error('Please upload a valid .json file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const count = Array.isArray(parsed) ? parsed.length : 1;
        setJsonText(JSON.stringify(parsed, null, 2));
        toast.success(`Loaded "${file.name}" with ${count} food item(s).`);
      } catch {
        toast.error('Invalid JSON file format. Please check syntax.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Submit bulk JSON to API
  const handleImportJsonSubmit = async () => {
    if (!jsonText.trim()) {
      toast.error('Please upload a file or paste JSON code.');
      return;
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch {
      toast.error('Invalid JSON syntax. Please check for missing quotes or commas.');
      return;
    }

    const itemsToImport = Array.isArray(parsedData) ? parsedData : [parsedData];
    if (itemsToImport.length === 0) {
      toast.error('JSON array is empty.');
      return;
    }

    setImportingJson(true);
    try {
      const res = await fetch('/api/foods/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foods: itemsToImport,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import JSON foods');

      toast.success(data.message || `Successfully imported ${data.createdCount} foods!`);
      setShowJsonModal(false);
      setJsonText('');
      fetchFoods();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error importing foods.';
      toast.error(msg);
    } finally {
      setImportingJson(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions - Dark Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111c2e] p-6 rounded-3xl border border-[#1e324d] shadow-lg">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>Ceylon Gastronomy & Food ({foods.length})</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage authentic Sri Lankan dishes, curry feasts, and street foods shown on <span className="text-[#3ddc9a] font-mono">/food</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchFoods}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-white hover:bg-[#1e304a] transition-colors cursor-pointer"
            title="Refresh foods"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Export foods to JSON file"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Import foods from JSON file or text"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Grid of Food Items */}
      {loading ? (
        <div className="p-16 text-center bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00aa6c] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-slate-400 font-semibold">Loading Ceylon dishes from Supabase...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="p-16 text-center bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Utensils className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No Food Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Add Food Item&quot; above to create your first authentic dish.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-[#111c2e] rounded-3xl border border-[#1e324d] hover:border-[#00aa6c]/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-[#0a111a] overflow-hidden">
                  {food.image ? (
                    <Image
                      src={food.image}
                      alt={food.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111c2e] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#00aa6c]/20 backdrop-blur-md border border-[#00aa6c]/40 text-[#3ddc9a] text-xs font-black shadow-sm">
                      {food.badge || 'Must Try'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-black text-white group-hover:text-[#3ddc9a] transition-colors">{food.title}</h4>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">{food.tagline}</p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{food.desc}</p>
                  {food.regions && (
                    <div className="mt-3 text-[11px] font-semibold text-slate-400 bg-[#0a111a] border border-[#1e324d] px-2.5 py-1 rounded-lg w-fit">
                      📍 {food.regions}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1e324d]/60 flex items-center justify-between gap-2 mt-4">
                <span className="text-[11px] font-mono text-slate-400">Order: #{food.sort_order}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(food)}
                    className="p-2 rounded-xl text-slate-300 hover:text-[#3ddc9a] hover:bg-[#162338] transition-colors cursor-pointer"
                    title="Edit food"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(food.id)}
                    disabled={deletingId === food.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete food"
                  >
                    {deletingId === food.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Food Modal - Dark Theme */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#111c2e] rounded-3xl shadow-2xl border border-[#1e324d] overflow-hidden z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter dish details, authentic descriptions, and high-resolution photo.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dish Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Village Rice & Curry"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] focus:ring-1 focus:ring-[#00aa6c] text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7-Curry Clay Pot Feast"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Must Try / Street Icon"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe flavors, clay pot slow cooking, and side dishes..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Regions / Best Spots
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo • Kandy • Ella"
                    value={form.regions}
                    onChange={(e) => setForm({ ...form, regions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Photo URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#162338] hover:bg-[#1e304a] border border-[#1e324d] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-[#00aa6c]" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif,.jfif" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2.5 relative h-24 w-full rounded-xl overflow-hidden border border-[#1e324d] bg-[#0a111a]">
                    <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1e324d]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#1e324d] text-slate-300 font-bold text-xs hover:bg-[#162338] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingFood ? 'Save Changes' : 'Create Food Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━━ JSON Import Modal ━━━ */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111c2e] border border-[#1e324d] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1e324d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Import Foods from JSON</h3>
                  <p className="text-xs text-slate-400">Upload a .json file or paste food items in JSON format.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowJsonModal(false);
                  setJsonText('');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0a111a] border border-[#1e324d]">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white text-xs font-bold transition-all border border-[#1e324d]">
                  <Upload className="w-4 h-4 text-[#00aa6c]" />
                  <span>Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleJsonFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handlePreloadCurated}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold transition-all border border-amber-500/30 cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Load 20 Curated Ceylon Dishes</span>
                </button>
              </div>

              {/* JSON Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    JSON Data (Array of food items)
                  </label>
                  {jsonText.trim() && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(() => {
                        try {
                          const parsed = JSON.parse(jsonText);
                          const count = Array.isArray(parsed) ? parsed.length : 1;
                          return `✓ ${count} item(s) detected`;
                        } catch {
                          return '⚠ Invalid JSON format';
                        }
                      })()}
                    </span>
                  )}
                </div>
                <textarea
                  rows={12}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "Midnight Kottu Roti",\n    "tagline": "The Sound of Sri Lankan Nights",\n    "desc": "Chopped godamba roti tossed on hot iron...",\n    "image": "https://images.unsplash.com/...",\n    "badge": "Street Food",\n    "regions": "Colombo • Galle Face"\n  }\n]`}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0a111a] border border-[#1e324d] text-emerald-400 font-mono text-xs placeholder-slate-600 focus:border-[#00aa6c] outline-none leading-relaxed resize-y"
                />
              </div>

              <div className="text-xs text-slate-400 bg-[#162338]/50 p-3 rounded-xl border border-[#1e324d] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] flex-shrink-0 mt-0.5" />
                <span>
                  Accepts fields like <code className="text-amber-300 font-mono">title</code>, <code className="text-amber-300 font-mono">desc</code>, <code className="text-amber-300 font-mono">tagline</code>, <code className="text-amber-300 font-mono">image</code>, <code className="text-amber-300 font-mono">badge</code>, and <code className="text-amber-300 font-mono">regions</code>.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#1e324d] flex items-center justify-end gap-3 bg-[#0d1624]">
              <button
                type="button"
                onClick={() => {
                  setShowJsonModal(false);
                  setJsonText('');
                }}
                disabled={importingJson}
                className="px-4 py-2.5 rounded-xl border border-[#1e324d] text-slate-300 font-bold text-xs hover:bg-[#162338] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleImportJsonSubmit}
                disabled={importingJson || !jsonText.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {importingJson && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{importingJson ? 'Importing Dishes...' : 'Import Dishes Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
