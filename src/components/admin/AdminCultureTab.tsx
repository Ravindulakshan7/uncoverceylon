'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Landmark,
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
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CultureItem {
  id: number;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  period: string;
  sort_order: number;
}

interface AdminCultureTabProps {
  adminPassword: string;
}

export default function AdminCultureTab({ adminPassword }: AdminCultureTabProps) {
  const [cultures, setCultures] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCulture, setEditingCulture] = useState<CultureItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // JSON Import & Export State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importingJson, setImportingJson] = useState(false);

  // 1-Click AI Auto-Fill in Modal
  const [showAiPasteBox, setShowAiPasteBox] = useState(false);
  const [aiJsonInput, setAiJsonInput] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Heritage',
    period: '',
    sort_order: 0,
  });

  const fetchCultures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/culture');
      const data = await res.json();
      if (res.ok && data.cultures) {
        setCultures(data.cultures);
      }
    } catch {
      toast.error('Failed to load culture items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

  const openAddModal = () => {
    setEditingCulture(null);
    setForm({
      title: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'Heritage',
      period: '',
      sort_order: cultures.length + 1,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const openEditModal = (culture: CultureItem) => {
    setEditingCulture(culture);
    setForm({
      title: culture.title,
      tagline: culture.tagline,
      desc: culture.desc,
      image: culture.image,
      badge: culture.badge,
      period: culture.period,
      sort_order: culture.sort_order,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const handleApplyAiJson = () => {
    if (!aiJsonInput.trim()) {
      toast.error('Please paste JSON data first!');
      return;
    }
    try {
      let cleaned = aiJsonInput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      const data = JSON.parse(cleaned);
      const item = Array.isArray(data) ? data[0] : data;
      if (!item || typeof item !== 'object') {
        toast.error('Invalid JSON structure.');
        return;
      }
      setForm((prev) => ({
        ...prev,
        title: item.title || item.name || prev.title,
        tagline: item.tagline || prev.tagline,
        desc: item.desc || item.description || prev.desc,
        image: item.image || item.image_url || item.img || prev.image,
        badge: item.badge || prev.badge,
        period: item.period || item.era || prev.period,
      }));
      toast.success('✨ Culture pillar filled in 1 click!');
      setShowAiPasteBox(false);
    } catch {
      toast.error('Invalid JSON format.');
    }
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
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');

      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Culture photo optimized & uploaded! 📸');
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
      const isEdit = Boolean(editingCulture);
      const url = '/api/culture';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: editingCulture?.id } : {}),
          ...form,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save culture item');

      toast.success(isEdit ? 'Culture pillar updated!' : 'New heritage pillar added to live site!');
      setShowModal(false);
      fetchCultures();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving culture item.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this culture item?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/culture?id=${id}&admin_password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      toast.success('Culture item deleted successfully.');
      setCultures((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(cultures, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `uncover_ceylon_culture_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Exported ${cultures.length} culture items to JSON!`);
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
        toast.success(`Loaded "${file.name}" with ${count} culture item(s).`);
      } catch {
        toast.error('Invalid JSON file format. Please check syntax.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Bulk Import Submit
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
      const res = await fetch('/api/culture/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cultures: itemsToImport,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import JSON culture items');

      toast.success(data.message || `Successfully imported ${data.createdCount} culture items!`);
      setShowJsonModal(false);
      setJsonText('');
      fetchCultures();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error importing culture items.';
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
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span>Culture &amp; Ancient Heritage ({cultures.length})</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage UNESCO monuments, ancient hydraulic ruins, and sacred traditions displayed on <span className="text-[#3ddc9a] font-mono">/culture</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCultures}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-white hover:bg-[#1e304a] transition-colors cursor-pointer"
            title="Refresh culture items"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Export culture items to JSON file"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Import culture items from JSON file or text"
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
            <span>Add Culture Pillar</span>
          </button>
        </div>
      </div>

      {/* Grid of Culture Items */}
      {loading ? (
        <div className="p-16 text-center bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00aa6c] mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-slate-400 font-semibold">Loading Ceylon heritage from Supabase...</p>
        </div>
      ) : cultures.length === 0 ? (
        <div className="p-16 text-center bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No Culture Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Add Culture Pillar&quot; above to add your first cultural highlight.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((culture) => (
            <div
              key={culture.id}
              className="bg-[#111c2e] rounded-3xl border border-[#1e324d] hover:border-[#00aa6c]/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-[#0a111a] overflow-hidden">
                  {culture.image ? (
                    <Image
                      src={culture.image}
                      alt={culture.title}
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
                      {culture.badge || 'Heritage'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-black text-white group-hover:text-[#3ddc9a] transition-colors">{culture.title}</h4>
                  <p className="text-xs font-bold text-amber-400 mt-0.5">{culture.tagline}</p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{culture.desc}</p>
                  {culture.period && (
                    <div className="mt-3 text-[11px] font-semibold text-slate-400 bg-[#0a111a] border border-[#1e324d] px-2.5 py-1 rounded-lg w-fit">
                      ⏳ {culture.period}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1e324d]/60 flex items-center justify-between gap-2 mt-4">
                <span className="text-[11px] font-mono text-slate-400">Order: #{culture.sort_order}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(culture)}
                    className="p-2 rounded-xl text-slate-300 hover:text-[#3ddc9a] hover:bg-[#162338] transition-colors cursor-pointer"
                    title="Edit culture pillar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(culture.id)}
                    disabled={deletingId === culture.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete culture pillar"
                  >
                    {deletingId === culture.id ? (
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

      {/* Add / Edit Culture Modal */}
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
                  {editingCulture ? 'Edit Culture Pillar' : 'Add New Culture Pillar'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add ancient kingdoms, sacred relics, and UNESCO living traditions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiPasteBox(!showAiPasteBox)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1"
                  title="Toggle 1-Click AI Auto-Fill"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Paste</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick AI Paste Box */}
            {showAiPasteBox && (
              <div className="mb-4 p-3.5 rounded-2xl bg-[#090f17] border border-[#1e324d] space-y-2">
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Paste JSON from AI
                </label>
                <textarea
                  rows={3}
                  value={aiJsonInput}
                  onChange={(e) => setAiJsonInput(e.target.value)}
                  placeholder={`{"title": "Kandyan Esala Perahera", "tagline": "Sacred Tooth Relic Procession", "period": "3rd Century BC", "desc": "..."}`}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d1624] border border-[#1e324d] text-emerald-400 font-mono text-xs placeholder-slate-600 outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={handleApplyAiJson}
                  className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all"
                >
                  ⚡ Apply AI Data
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Pillar Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ancient Hydraulic Civilization"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master Engineering of the Kings"
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
                    placeholder="e.g. UNESCO World Heritage"
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
                  placeholder="Elaborate on the historical background, sacred significance, and architectural grandeur..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Era / Historical Period
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5th Century AD"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
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
                    <input type="file" accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
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
                  <span>{editingCulture ? 'Save Changes' : 'Create Culture Pillar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk JSON Import Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111c2e] border border-[#1e324d] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#1e324d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Import Culture from JSON</h3>
                  <p className="text-xs text-slate-400">Upload a .json file or paste culture items in JSON format.</p>
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

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a111a] border border-[#1e324d]">
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
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  JSON Data (Array of culture items)
                </label>
                <textarea
                  rows={10}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "Sacred Tooth Relic & Temple of Kandy",\n    "tagline": "The Living Spiritual Heart of Ceylon",\n    "desc": "Housing the sacred tooth relic of Gautama Buddha...",\n    "image": "https://images.unsplash.com/...",\n    "badge": "UNESCO Heritage",\n    "period": "16th Century AD"\n  }\n]`}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0a111a] border border-[#1e324d] text-emerald-400 font-mono text-xs placeholder-slate-600 focus:border-[#00aa6c] outline-none leading-relaxed resize-y"
                />
              </div>

              <div className="text-xs text-slate-400 bg-[#162338]/50 p-3 rounded-xl border border-[#1e324d] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] flex-shrink-0 mt-0.5" />
                <span>
                  Accepts fields: <code className="text-amber-300 font-mono">title</code>, <code className="text-amber-300 font-mono">tagline</code>, <code className="text-amber-300 font-mono">desc</code>, <code className="text-amber-300 font-mono">image</code>, <code className="text-amber-300 font-mono">badge</code>, and <code className="text-amber-300 font-mono">period</code>.
                </span>
              </div>
            </div>

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
                <span>{importingJson ? 'Importing...' : 'Import Culture Pillars'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
