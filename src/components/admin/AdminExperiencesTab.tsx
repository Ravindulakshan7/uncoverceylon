'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Compass, Plus, Edit2, Trash2, Loader2, Sparkles, Image as ImageIcon, Check, RefreshCw, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExperienceItem {
  id: number;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  seasons: string;
  sort_order: number;
}

interface AdminExperiencesTabProps {
  adminPassword: string;
}

export default function AdminExperiencesTab({ adminPassword }: AdminExperiencesTabProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Popular',
    seasons: '',
    sort_order: 0,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      if (res.ok && data.experiences) {
        setExperiences(data.experiences);
      }
    } catch {
      toast.error('Failed to load experiences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setForm({
      title: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'Popular',
      seasons: 'Year-Round',
      sort_order: experiences.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setForm({
      title: exp.title,
      tagline: exp.tagline,
      desc: exp.desc,
      image: exp.image,
      badge: exp.badge,
      seasons: exp.seasons,
      sort_order: exp.sort_order,
    });
    setShowModal(true);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Image uploaded successfully! 📸');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
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
      const isEdit = Boolean(editingExp);
      const url = '/api/experiences';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit && { id: editingExp?.id }),
          ...form,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save experience');

      toast.success(isEdit ? 'Experience updated successfully! 🏄' : 'Experience added successfully! 🏄');
      setShowModal(false);
      fetchExperiences();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/experiences?id=${id}&admin_password=${encodeURIComponent(adminPassword)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Manage Experiences & Adventures ({experiences.length})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Showcase top activities: Surfing in Arugam Bay, Tea Train Rides, Yala Safaris, Whale Watching & Scuba Diving.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchExperiences}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Experiences"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-sky-600/25 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Grid of Experiences */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Loading experiences from Supabase...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No experiences listed yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add surfing, train journeys, safari tours, and dive expeditions.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Add First Experience
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-500/30 transition-all flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {exp.image ? (
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-sky-700 shadow-sm backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    {exp.badge || 'Popular'}
                  </span>
                </div>

                {/* Season pill */}
                {exp.seasons && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sky-300" />
                      {exp.seasons}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-sky-600 shadow-sm backdrop-blur-xs transition-colors cursor-pointer"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm backdrop-blur-xs transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Experience"
                  >
                    {deletingId === exp.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {exp.title}
                  </h3>
                  {exp.tagline && (
                    <p className="text-xs font-medium text-sky-600 mt-0.5 line-clamp-1">
                      {exp.tagline}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Order: #{exp.sort_order}</span>
                  <button
                    onClick={() => openEditModal(exp)}
                    className="text-sky-600 font-bold hover:underline cursor-pointer"
                  >
                    Edit Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Compass className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {editingExp ? 'Edit Experience' : 'Add New Experience'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World-Class Surfing at Arugam Bay"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catchy Tagline / Hook
                </label>
                <input
                  type="text"
                  placeholder="e.g. Legendary right-hand point breaks and sunset beach vibes"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adrenaline, Wildlife, Iconic"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Adrenaline', 'Scenic', 'Wildlife', 'Must Do', 'Relaxing'].map((badgePreset) => (
                      <button
                        type="button"
                        key={badgePreset}
                        onClick={() => setForm({ ...form, badge: badgePreset })}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 transition-colors"
                      >
                        {badgePreset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Best Season / Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May – October"
                    value={form.seasons}
                    onChange={(e) => setForm({ ...form, seasons: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Year-Round', 'Nov – Apr', 'May – Oct', 'Early Morning'].map((seasonPreset) => (
                      <button
                        type="button"
                        key={seasonPreset}
                        onClick={() => setForm({ ...form, seasons: seasonPreset })}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 transition-colors"
                      >
                        {seasonPreset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cover Photo (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the adventure, why it's unforgettable, best spots, tips for travelers..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-sky-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingExp ? 'Save Changes' : 'Create Experience'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
