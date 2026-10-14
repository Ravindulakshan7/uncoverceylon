'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Place } from '@/types';
import {
  X, Save, Upload, Loader2, MapPin, Image as ImageIcon, ImageOff,
  FileText, Globe, Star, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight,
  MoveUp, MoveDown, Trash2, Eye, ExternalLink, HelpCircle, Sparkles, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const MapLocationPicker = dynamic(() => import('@/components/MapLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
      <span className="text-xs font-bold">Loading interactive map picker...</span>
    </div>
  ),
});

const CATEGORIES = [
  'Beaches', 'Waterfalls', 'Mountains', 'Ancient Sites',
  'Wildlife', 'Hidden Gems', 'Historical', 'Religious Places'
];

const PROVINCES = [
  'Western Province', 'Central Province', 'Southern Province', 'Northern Province',
  'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province',
  'Sabaragamuwa Province'
];

type TabType = 'basic' | 'images' | 'location' | 'faq' | 'seo' | 'reviews' | 'publishing';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'basic', label: 'Basic Info', icon: FileText },
  { id: 'images', label: 'Images & Media', icon: ImageIcon },
  { id: 'location', label: 'Location & Map', icon: MapPin },
  { id: 'faq', label: 'Highlights & Q&A', icon: HelpCircle },
  { id: 'seo', label: 'SEO & Preview', icon: Globe },
  { id: 'reviews', label: 'Ratings & Reviews', icon: Star },
  { id: 'publishing', label: 'Publishing', icon: CheckCircle2 },
];

interface DestinationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  place?: Place | null; // if provided -> edit mode; if null -> add mode
  adminPassword: string;
  onSuccess: () => void;
}

export default function DestinationEditorModal({
  isOpen,
  onClose,
  place,
  adminPassword,
  onSuccess,
}: DestinationEditorModalProps) {
  const isEditMode = Boolean(place);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    category: 'Mountains',
    location: '',
    province: 'Central Province',
    lat: 7.957,
    lng: 80.760,
    entry_fee: 'Free',
    best_time: 'November to April',
    distance_km: 150,
    tips: '',
    featured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    rating: 0,
    review_count: 0,
    meta_title: '',
    meta_description: '',
  });

  // Highlights, Why Travelers Love It, and Q&A state
  const [highlightsList, setHighlightsList] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [whyLoveList, setWhyLoveList] = useState<{ title: string; desc: string }[]>([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' },
  ]);
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([]);

  // Multiple Images list
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // AI JSON Auto-Fill Modal State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Initialize form data when place changes
  useEffect(() => {
    if (place) {
      let parsedTipsObj: any = null;
      if (place.tips && place.tips.trim().startsWith('{')) {
        try {
          parsedTipsObj = JSON.parse(place.tips.trim());
        } catch {
          parsedTipsObj = null;
        }
      }

      const initialTipsText = parsedTipsObj
        ? (parsedTipsObj.tips || parsedTipsObj.advisory || '')
        : (place.tips || '');

      setFormData({
        name: place.name || '',
        short_description: place.short_description || '',
        description: place.description || '',
        category: place.category || 'Mountains',
        location: place.location || '',
        province: place.province || 'Central Province',
        lat: Number(place.lat) || 7.957,
        lng: Number(place.lng) || 80.760,
        entry_fee: place.entry_fee || 'Free',
        best_time: place.best_time || 'November to April',
        distance_km: Number(place.distance_km) || 0,
        tips: initialTipsText,
        featured: place.featured === 1,
        status: 'published',
        rating: place.rating !== undefined && place.rating !== null ? Number(place.rating) : 0,
        review_count: place.review_count !== undefined && place.review_count !== null ? Number(place.review_count) : 0,
        meta_title: `${place.name} Travel Guide | UncoverCeylon`,
        meta_description: place.short_description || `Discover ${place.name} in ${place.location}, Sri Lanka.`,
      });

      if (parsedTipsObj && typeof parsedTipsObj === 'object') {
        setHighlightsList(Array.isArray(parsedTipsObj.highlights) ? parsedTipsObj.highlights : []);
        setWhyLoveList(
          Array.isArray(parsedTipsObj.why_love) && parsedTipsObj.why_love.length > 0
            ? [
                { title: parsedTipsObj.why_love[0]?.title || '', desc: parsedTipsObj.why_love[0]?.desc || '' },
                { title: parsedTipsObj.why_love[1]?.title || '', desc: parsedTipsObj.why_love[1]?.desc || '' },
                { title: parsedTipsObj.why_love[2]?.title || '', desc: parsedTipsObj.why_love[2]?.desc || '' },
              ]
            : [{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]
        );
        setQaList(Array.isArray(parsedTipsObj.qa) ? parsedTipsObj.qa : []);
      } else {
        setHighlightsList([]);
        setWhyLoveList([{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
        setQaList([]);
      }

      let parsedGallery: string[] = [];
      try {
        parsedGallery = JSON.parse(place.gallery || '[]');
      } catch {
        parsedGallery = [];
      }
      if (place.image_url && !parsedGallery.includes(place.image_url)) {
        parsedGallery.unshift(place.image_url);
      }
      setImageList(parsedGallery.length > 0 ? parsedGallery : [place.image_url].filter(Boolean));
    } else {
      // Add mode default
      setFormData({
        name: '',
        short_description: '',
        description: '',
        category: 'Mountains',
        location: '',
        province: 'Central Province',
        lat: 7.957,
        lng: 80.760,
        entry_fee: 'Free',
        best_time: 'November to April',
        distance_km: 150,
        tips: '',
        featured: false,
        status: 'published',
        rating: 0,
        review_count: 0,
        meta_title: '',
        meta_description: '',
      });
      setHighlightsList([]);
      setWhyLoveList([{ title: '', desc: '' }, { title: '', desc: '' }, { title: '', desc: '' }]);
      setQaList([]);
      setImageList([]);
    }
    setActiveTab('basic');
  }, [place, isOpen]);

  // Sync meta tags automatically if user hasn't typed custom ones
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      meta_title: prev.meta_title && prev.meta_title !== `${prev.name} Travel Guide | UncoverCeylon`
        ? prev.meta_title
        : `${name} Travel Guide | UncoverCeylon`,
    }));
  };

  const handleShortDescChange = (desc: string) => {
    setFormData((prev) => ({
      ...prev,
      short_description: desc,
      meta_description: prev.meta_description && prev.meta_description !== prev.short_description
        ? prev.meta_description
        : desc,
    }));
  };

  // Quick Apply AI-Generated JSON
  const handleApplyJson = () => {
    try {
      if (!jsonInput.trim()) {
        toast.error('Please paste JSON data first!');
        return;
      }
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      const data = JSON.parse(cleaned);
      const target = Array.isArray(data) ? data[0] : data;
      if (!target || typeof target !== 'object') {
        toast.error('Invalid JSON structure.');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        name: target.name || prev.name,
        short_description: target.short_description || prev.short_description,
        description: target.description || prev.description,
        category: target.category || prev.category,
        location: target.location || prev.location,
        province: target.province || prev.province,
        lat: target.lat !== undefined ? Number(target.lat) : prev.lat,
        lng: target.lng !== undefined ? Number(target.lng) : prev.lng,
        entry_fee: target.entry_fee || prev.entry_fee,
        best_time: target.best_time || prev.best_time,
        distance_km: target.distance_km !== undefined ? Number(target.distance_km) : prev.distance_km,
        tips: target.tips || prev.tips,
        featured: target.featured !== undefined ? Boolean(target.featured) : prev.featured,
        rating: target.rating !== undefined ? Number(target.rating) : 0,
        review_count: target.review_count !== undefined ? Number(target.review_count) : 0,
        meta_title: target.meta_title || `${target.name || prev.name} Travel Guide | UncoverCeylon`,
        meta_description: target.meta_description || target.short_description || prev.meta_description,
      }));

      // Parse Highlights
      if (Array.isArray(target.highlights)) {
        setHighlightsList(target.highlights.filter((h: any) => typeof h === 'string' && h.trim()));
      }

      // Parse Why Travelers Love It (3 cards)
      if (Array.isArray(target.why_love) && target.why_love.length > 0) {
        setWhyLoveList([
          { title: target.why_love[0]?.title || '', desc: target.why_love[0]?.desc || '' },
          { title: target.why_love[1]?.title || '', desc: target.why_love[1]?.desc || '' },
          { title: target.why_love[2]?.title || '', desc: target.why_love[2]?.desc || '' },
        ]);
      }

      // Parse Q&A items
      if (Array.isArray(target.qa)) {
        setQaList(
          target.qa
            .map((item: any) => ({
              q: item.q || item.question || '',
              a: item.a || item.answer || '',
            }))
            .filter((item: any) => item.q.trim() && item.a.trim())
        );
      }

      const newImages: string[] = [];
      if (target.image_url && typeof target.image_url === 'string') {
        newImages.push(target.image_url);
      }
      if (Array.isArray(target.gallery)) {
        target.gallery.forEach((g: unknown) => {
          if (typeof g === 'string' && !newImages.includes(g)) {
            newImages.push(g);
          }
        });
      }
      if (newImages.length > 0) {
        setImageList((prev) => Array.from(new Set([...newImages, ...prev])));
      }

      toast.success('All fields auto-filled from AI JSON! ✨');
      setShowJsonModal(false);
      setJsonInput('');
    } catch {
      toast.error('Invalid JSON format. Please check the pasted text.');
    }
  };

  // Multiple PC File Upload Handler
  const handleFilesUpload = async (files: FileList | File[]) => {
    const isImageFile = (f: File) => {
      if (f.type && f.type.startsWith('image/')) return true;
      const ext = f.name.toLowerCase().split('.').pop() || '';
      return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'jfif', 'bmp', 'tiff', 'svg'].includes(ext);
    };

    const fileArray = Array.from(files).filter(isImageFile);
    if (fileArray.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP, etc.)');
      return;
    }

    setUploadingImage(true);

    const uploadPromises = fileArray.map(async (file) => {
      const previewUrl = URL.createObjectURL(file);
      setImageList((prev) => [...prev, previewUrl]);

      const data = new FormData();
      data.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Upload failed');

        setImageList((prev) =>
          prev.map((img) => (img === previewUrl ? resData.url : img))
        );
        URL.revokeObjectURL(previewUrl);
        return { success: true, name: file.name };
      } catch (err: unknown) {
        setImageList((prev) => prev.filter((img) => img !== previewUrl));
        URL.revokeObjectURL(previewUrl);
        const msg = err instanceof Error ? err.message : 'Upload failed';
        toast.error(`Failed to upload ${file.name}: ${msg}`);
        return { success: false, name: file.name };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter((r) => r.success).length;

    setUploadingImage(false);
    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? 'Photo optimized & uploaded! 📸'
          : `${successCount} photos optimized & uploaded! 📸`
      );
    }
  };

  const addImageUrl = async () => {
    let url = newImageUrl.trim();
    if (!url) return;

    // 1. Google Drive direct image conversion
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        url = `https://lh3.googleusercontent.com/d/${match[1]}`;
        setImageList((prev) => [...prev, url]);
        setNewImageUrl('');
        toast.success('Google Drive image link converted! ⚡');
        return;
      }
    }

    // 2. Google share / Google Photos / Google Images search link auto-resolution
    if (
      url.includes('share.google') ||
      url.includes('photos.app.goo.gl') ||
      url.includes('google.com/imgres') ||
      url.includes('photos.google.com')
    ) {
      const resolvingToast = toast.loading('Extracting photo from Google link...');
      try {
        const res = await fetch('/api/admin/resolve-image-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        toast.dismiss(resolvingToast);

        if (data.directUrl) {
          setImageList((prev) => [...prev, data.directUrl]);
          setNewImageUrl('');
          toast.success('Google image link resolved & added! ⚡');
          return;
        }
      } catch {
        toast.dismiss(resolvingToast);
      }
      toast.error(
        'Could not automatically extract image. Please right-click the image and select "Copy Image Address", or save and Drag & Drop it above!',
        { duration: 6000 }
      );
      return;
    }

    // 3. Convert Unsplash page link to direct CDN image if user pasted full page link
    if (url.includes('unsplash.com/photos/')) {
      const parts = url.split('/photos/')[1]?.split('?')[0]?.split('/');
      const photoId = parts?.[parts.length - 1];
      if (photoId) {
        url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1600&q=80`;
      }
    }

    setImageList((prev) => [...prev, url]);
    setNewImageUrl('');
    toast.success('Image added to gallery!');
  };

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === imageList.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...imageList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImageList(updated);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const updated = [...imageList];
    const selected = updated.splice(index, 1)[0];
    updated.unshift(selected);
    setImageList(updated);
    toast.success('Primary cover photo updated!');
  };

  // Final Submit Handler (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingImage) {
      toast.error('Please wait for photos to finish uploading before saving.');
      return;
    }

    const hasPendingBlobs = imageList.some((img) => img.startsWith('blob:'));
    if (hasPendingBlobs) {
      toast.error('Some photos are still uploading or processing. Please wait a moment.');
      return;
    }

    if (!formData.name.trim() || !formData.short_description.trim() || !formData.location.trim()) {
      setActiveTab('basic');
      toast.error('Please complete required fields in Basic Info tab.');
      return;
    }

    if (imageList.length === 0) {
      setActiveTab('images');
      toast.error('Please upload or attach at least one photo in the Images tab.');
      return;
    }

    setIsSubmitting(true);
    const primaryImage = imageList[0] || '';

    try {
      let tipsToSave = formData.tips;
      const hasCustomExtras =
        highlightsList.length > 0 ||
        whyLoveList.some((w) => w.title.trim() || w.desc.trim()) ||
        qaList.length > 0;

      if (hasCustomExtras) {
        tipsToSave = JSON.stringify({
          tips: formData.tips,
          highlights: highlightsList,
          why_love: whyLoveList.filter((w) => w.title.trim() || w.desc.trim()),
          qa: qaList.filter((item) => item.q.trim() && item.a.trim()),
        });
      }

      const payload = {
        ...formData,
        tips: tipsToSave,
        image_url: primaryImage,
        gallery: imageList,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        distance_km: Number(formData.distance_km) || 0,
        featured: formData.featured ? 1 : 0,
        rating: Number(formData.rating) || 0,
        review_count: Number(formData.review_count) || 0,
        password: adminPassword,
      };

      let res: Response;
      if (isEditMode && place) {
        res = await fetch(`/api/places/${place.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save destination');
      }

      toast.success(isEditMode ? 'Destination updated successfully! ✨' : 'Destination created successfully! 🎉');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving destination');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#111c2e] rounded-3xl max-w-4xl w-full border border-[#1e324d] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-in text-white">
        
        {/* ━━━ MODAL TOP HEADER ━━━ */}
        <div className="bg-[#0f1b2d] px-6 sm:px-8 py-5 border-b border-[#1e324d] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00aa6c]/20 text-[#3ddc9a] border border-[#00aa6c]/30 flex items-center justify-center shadow-xs">
              {isEditMode ? <FileText className="w-5 h-5" /> : <MapPin className="w-5 h-5 text-[#3ddc9a]" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {isEditMode ? `Edit: ${place?.name}` : 'Create New Destination'}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {isEditMode ? 'Update coordinates, photos, and travel guide metadata' : 'Publish a new tourist destination to UncoverCeylon'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonModal((v) => !v)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-purple-950/40 transition-all cursor-pointer"
              title="Paste AI JSON to fill all tabs automatically"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>⚡ AI Auto-Fill</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#162338] hover:bg-[#1e304a] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ━━━ AI JSON AUTO-FILL PANEL ━━━ */}
        {showJsonModal && (
          <div className="bg-[#13233b] border-b border-purple-500/30 px-6 sm:px-8 py-4 animate-fade-in flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Paste AI Generated JSON Code (All tabs will be filled automatically):
              </span>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste JSON here: { "name": "Ella Rock", "category": "Mountains", ... }'
              rows={5}
              className="w-full bg-[#0a111a] border border-[#1e324d] rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-purple-500 outline-none resize-none mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setJsonInput('');
                  setShowJsonModal(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyJson}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply to All Tabs ✨
              </button>
            </div>
          </div>
        )}

        {/* ━━━ 6-TAB SEGMENTED NAVIGATION BAR ━━━ */}
        <div className="bg-[#0a111a] border-b border-[#1e324d] px-6 sm:px-8 flex-shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 py-2.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00aa6c] text-white shadow-lg shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-[#162338]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ━━━ TAB CONTENT BODY (SCROLLABLE) ━━━ */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 1: BASIC INFORMATION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* ⚡ Quick AI JSON Auto-Fill Banner */}
                <div className="sm:col-span-2 bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-purple-950/70 border border-purple-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>⚡ AI JSON Quick Auto-Fill</span>
                        <span className="text-[10px] bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full font-semibold uppercase">Super Fast</span>
                      </h4>
                      <p className="text-xs text-purple-200/80 mt-0.5">
                        Have Gemini or ChatGPT JSON? Click to fill all 6 tabs in 1 click!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowJsonModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Paste AI Code</span>
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Destination Name *
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Diyaluma Falls or Sigiriya Rock Fortress"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Admission / Entry Fee
                  </label>
                  <input
                    value={formData.entry_fee}
                    onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value })}
                    placeholder="e.g. Free / LKR 500 / USD 30"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Short Description (Snippet for cards & search) *
                  </label>
                  <input
                    value={formData.short_description}
                    onChange={(e) => handleShortDescChange(e.target.value)}
                    placeholder="Catchy 1-2 sentence overview for cards..."
                    maxLength={160}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {formData.short_description.length} / 160 characters
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Full Travel Guide Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    placeholder="Comprehensive travel guide, history, natural features, and what makes this place special..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white resize-none outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Best Season To Visit
                  </label>
                  <input
                    value={formData.best_time}
                    onChange={(e) => setFormData({ ...formData, best_time: e.target.value })}
                    placeholder="e.g. November to April"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Distance from Colombo (km)
                  </label>
                  <input
                    type="number"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({ ...formData, distance_km: Number(e.target.value) })}
                    placeholder="e.g. 195"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Visitor Tips & Advisory
                  </label>
                  <textarea
                    value={formData.tips}
                    onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                    rows={2}
                    placeholder="Hiking footwear tips, best photography timing, hydration advice..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white resize-none outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 2: IMAGES (DRAG & DROP, REORDER, PREVIEW)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-fade-in">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFilesUpload(e.dataTransfer.files);
                  }
                }}
                className="border-2 border-dashed border-sky-400/40 hover:border-sky-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-sky-50/30 hover:bg-sky-50/70 transition-all cursor-pointer relative group"
              >
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif,.jfif"
                  multiple
                  disabled={uploadingImage}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesUpload(e.target.files);
                      e.target.value = '';
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {uploadingImage ? <Loader2 className="w-7 h-7 animate-spin text-sky-600" /> : <Upload className="w-7 h-7" />}
                </div>
                <h4 className="text-slate-900 font-extrabold text-sm sm:text-base">
                  {uploadingImage ? 'Uploading photos to server...' : 'Drag & Drop photos here (supports multiple), or click to browse'}
                </h4>
                <p className="text-slate-500 text-xs mt-1">
                  Supports multiple JPG, PNG, WEBP files up to 15MB each
                </p>
              </div>

              {/* Paste URL fallback */}
              <div className="space-y-1.5">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                    placeholder="Or paste direct image URL (e.g. Unsplash or direct .jpg / .webp link)..."
                    className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    disabled={!newImageUrl.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Add Image URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 pl-1">
                  💡 Tip: For 100% reliability, upload photos directly from your PC/phone using the Drag &amp; Drop zone above. Webpage share links (like Google Photos albums) cannot be displayed as images.
                </p>
              </div>

              {/* Photo Reorder & Management Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Gallery Images ({imageList.length})
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    First image is used as the Primary Cover photo
                  </span>
                </div>

                {imageList.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                    No images added yet. Upload from PC or paste a URL above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {imageList.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col transition-all ${
                          idx === 0
                            ? 'border-sky-500 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-sky-500/40'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-40 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="absolute inset-0 flex-col items-center justify-center p-3 text-center bg-slate-100 text-slate-500"
                          >
                            <ImageOff className="w-7 h-7 mb-1 text-slate-400" />
                            <span className="text-[11px] font-semibold text-slate-600">Failed to load preview</span>
                            <span className="text-[9px] text-slate-400 truncate max-w-full px-2 mt-0.5 font-mono">{img}</span>
                          </div>
                          {idx === 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-[#0a192f] text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md z-10">
                              Primary Cover
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="p-3 bg-white flex items-center justify-between border-t border-slate-200">
                          <span className="text-xs font-bold text-slate-500">
                            #{idx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => setAsCover(idx)}
                                title="Set as primary cover"
                                className="text-[11px] font-bold text-sky-600 hover:bg-sky-50 px-2 py-1 rounded cursor-pointer"
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'up')}
                              disabled={idx === 0}
                              title="Move left/up"
                              className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'down')}
                              disabled={idx === imageList.length - 1}
                              title="Move right/down"
                              className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Remove image"
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 ml-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 3: LOCATION & MAP PICKER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'location' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Town / Specific Location *
                  </label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Matale, Central Province"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Map Picker Component */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>Interactive Map Coordinate Picker</span>
                  </label>
                  <span className="text-xs text-sky-600 font-semibold">
                    Click anywhere on the map to place the pin
                  </span>
                </div>

                <MapLocationPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  onChange={(lat, lng) => setFormData((prev) => ({ ...prev, lat, lng }))}
                />
              </div>

              {/* Manual numeric overrides */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB: HIGHLIGHTS, WHY LOVE IT & Q&A (CUSTOMIZER)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              {/* Info banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#00aa6c] shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <span className="font-bold text-emerald-900 block mb-0.5">
                    Highlights, &ldquo;Why travelers love it&rdquo; &amp; Q&amp;A Customizer
                  </span>
                  Customize the exact bullet points, value cards, and Q&amp;A items shown on the live destination page. When using AI Auto-Fill, all of these are filled in automatically!
                </div>
              </div>

              {/* 1. Highlights Bullet Points */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />
                      <span>Key Highlights (Green Bullet Points)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Standout bullet points displayed in the Highlights section on the destination page.
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    {highlightsList.length} items
                  </span>
                </div>

                {highlightsList.length > 0 && (
                  <div className="space-y-2">
                    {highlightsList.map((hl, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#00aa6c] mt-1 shrink-0" />
                        <span className="flex-1 leading-relaxed">{hl}</span>
                        <button
                          type="button"
                          onClick={() => setHighlightsList((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors shrink-0 cursor-pointer"
                          title="Remove highlight"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newHighlight.trim()) {
                          setHighlightsList((prev) => [...prev, newHighlight.trim()]);
                          setNewHighlight('');
                        }
                      }
                    }}
                    placeholder="e.g. Marvel at the floating Seema Malaka water pavilion designed by Geoffrey Bawa on Beira Lake..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newHighlight.trim()) {
                        setHighlightsList((prev) => [...prev, newHighlight.trim()]);
                        setNewHighlight('');
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>
              </div>

              {/* 2. Why travelers love it (3 cards) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Why Travelers Love It (3 Feature Cards)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Three standout feature cards displayed prominently in the Overview tab.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Feature Card #{idx + 1}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Bold Title
                        </label>
                        <input
                          value={whyLoveList[idx]?.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWhyLoveList((prev) => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], title: val };
                              return updated;
                            });
                          }}
                          placeholder="e.g. Floating Temple Pavilion"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-sky-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          value={whyLoveList[idx]?.desc || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWhyLoveList((prev) => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], desc: val };
                              return updated;
                            });
                          }}
                          rows={3}
                          placeholder="Short description explaining why visitors love this..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-sky-500 resize-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Questions & Answers (Q&A) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Questions &amp; Answers (Q&amp;A)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Visitor FAQs displayed in the Questions &amp; Answers section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQaList((prev) => [...prev, { q: '', a: '' }])}
                    className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-sky-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {qaList.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                    No custom Q&amp;As entered. System will use automatic smart Q&amp;As (timing, entry fees, kid-friendliness, best hours).
                  </div>
                ) : (
                  <div className="space-y-3">
                    {qaList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#00aa6c] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                              Q{idx + 1}
                            </span>
                            <span>Question &amp; Answer #{idx + 1}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setQaList((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                            title="Remove Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <input
                            value={item.q}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQaList((prev) => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], q: val };
                                return updated;
                              });
                            }}
                            placeholder="e.g. What is the dress code for visitors?"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-sky-500 transition-all"
                          />
                        </div>
                        <div>
                          <textarea
                            value={item.a}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQaList((prev) => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], a: val };
                                return updated;
                              });
                            }}
                            rows={2}
                            placeholder="e.g. Modest clothing covering shoulders and knees is strictly required. Shoes must be removed at the entrance."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-sky-500 resize-none transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Insider Visitor Tips & Advisory */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider">
                  Insider Visitor Advisory &amp; Tips
                </label>
                <p className="text-[11px] text-slate-500">
                  Practical guidelines, dress code advisories, hydration tips, and photography permissions.
                </p>
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  rows={3}
                  placeholder="e.g. Dress modestly with covered shoulders and knees. Footwear must be removed before entering shrines. Morning visits are recommended to avoid midday heat."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:border-sky-500 focus:bg-white resize-none outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 4: SEO & SEARCH PREVIEW
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Meta Title (Google SERP)
                  </label>
                  <input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Destination Name - Sri Lanka Travel Guide | UncoverCeylon"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {formData.meta_title.length} / 60 recommended characters
                  </span>
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={3}
                    placeholder="Short summary displayed beneath page title on Google search results..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white resize-none outline-none transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {formData.meta_description.length} / 160 recommended characters
                  </span>
                </div>
              </div>

              {/* Google Search Result Card Preview */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Google Search Snippet Preview
                </span>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs max-w-xl">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-mono">
                    <span>https://uncoverceylon.com</span>
                    <span>› places › {formData.name ? encodeURIComponent(formData.name.toLowerCase().replace(/\s+/g, '-')) : 'destination'}</span>
                  </div>
                  <h4 className="text-sky-600 hover:underline text-base font-bold cursor-pointer line-clamp-1">
                    {formData.meta_title || 'UncoverCeylon Travel Guide'}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1 line-clamp-2">
                    {formData.meta_description || 'Explore Sri Lanka’s top travel destinations, GPS coordinates, entry fees, and traveler reviews.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 5: RATINGS & REVIEWS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Initial Rating Score (out of 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.review_count}
                    onChange={(e) => setFormData({ ...formData, review_count: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Rating Card Preview */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Live Rating Chip Appearance
                </span>
                
                <div className="inline-flex items-center gap-3 bg-white border border-amber-200/80 rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-slate-900">
                        {formData.rating > 0 ? formData.rating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        · {formData.review_count === 0 ? 'No reviews yet' : formData.rating >= 4.8 ? 'Exceptional' : 'Recommended'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formData.review_count === 0
                        ? '0 traveler reviews'
                        : `Based on ${formData.review_count.toLocaleString()} traveler reviews`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TAB 6: PUBLISHING & STATUS CONTROLS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {activeTab === 'publishing' && (
            <div className="space-y-6 animate-fade-in">
              {/* Featured Toggle */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Homepage Featured Spotlight</span>
                  </h4>
                  <p className="text-xs text-amber-800/80 mt-0.5">
                    Feature this destination prominently on the homepage hero highlights and favorites list.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Status Control */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Publishing Status
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'published', label: 'Published / Live', desc: 'Visible to all international tourists' },
                    { id: 'draft', label: 'Draft', desc: 'Hidden from public directory' },
                    { id: 'archived', label: 'Archived', desc: 'Preserved in database only' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st.id as typeof formData.status })}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        formData.status === st.id
                          ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-xs ring-1 ring-sky-500/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-sky-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm">{st.label}</span>
                        {formData.status === st.id && (
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block leading-tight">{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Publication Checklist */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Pre-Publish Checklist
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {formData.name.trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={formData.name.trim() ? 'text-slate-900' : 'text-rose-600 font-bold'}>
                      Destination Name & Category selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {imageList.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={imageList.length > 0 ? 'text-slate-900' : 'text-rose-600 font-bold'}>
                      At least 1 landscape photograph attached
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {formData.lat && formData.lng ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className={formData.lat && formData.lng ? 'text-slate-900' : 'text-rose-600 font-bold'}>
                      GPS coordinates plotted ({formData.lat.toFixed(3)}, {formData.lng.toFixed(3)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ━━━ BOTTOM DIALOG ACTIONS ━━━ */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {activeTab !== 'publishing' ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex((t) => t.id === activeTab);
                    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#162338] hover:bg-[#1e304a] text-slate-200 border border-[#1e324d] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>Next Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="inline-flex items-center gap-2 bg-[#00aa6c] hover:bg-[#008f5a] disabled:opacity-50 text-white font-bold px-7 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
              >
                {isSubmitting || uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? 'Saving...'
                    : uploadingImage
                    ? 'Uploading photos...'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Publish Destination'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
