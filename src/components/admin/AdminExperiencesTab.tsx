'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass,
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
  Copy,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  MapPin,
  Layers,
  ShieldAlert,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface ExperienceVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface ExperienceItem {
  id: number;
  slug?: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  tag?: string;
  seasons: string;
  locations?: string;
  timing?: string;
  entryInfo?: string;
  difficulty?: string;
  heritage?: string;
  ancientRoots?: string;
  gearChecklist?: string;
  localSafetyTips?: string;
  varieties?: string | ExperienceVariety[];
  sort_order: number;
}

interface AdminExperiencesTabProps {
  adminPassword: string;
}

const CATEGORY_TAGS = [
  { value: 'surf', label: '🏄 Surf Breaks' },
  { value: 'safari', label: '🐆 Wildlife Safari' },
  { value: 'rail', label: '🚂 Scenic Rail' },
  { value: 'hiking', label: '🥾 Highland Trekking' },
  { value: 'ocean', label: '🐋 Ocean & Diving' },
  { value: 'adrenaline', label: '⚡ Adrenaline & Rapids' },
];

export const MASTER_AI_EXPERIENCE_PROMPT = `You are a Sri Lankan Adventure Guide & Island Specialist for the luxury travel platform "Uncover Ceylon".
Generate a complete, authentic, high-detail JSON specification for the following Sri Lankan experience/adventure:
EXPERIENCE NAME: [PASTE EXPERIENCE NAME HERE, e.g. "Surfing in Sri Lanka" or "Yala Leopard Safari" or "Kandy to Ella Scenic Train" or "Mirissa Whale Watching"]

Output ONLY a valid raw JSON object (enclosed in \`\`\`json ... \`\`\`) with the EXACT structure below. Fill every single field with rich, accurate, and exhilarating content:

{
  "title": "Full official adventure title in English (e.g. Surfing in Sri Lanka)",
  "slug": "url-friendly-kebab-case-slug (e.g. surfing-in-sri-lanka)",
  "tagline": "Short evocative catchphrase (e.g. Year-Round Warm Ocean Swells & Bohemian Bays)",
  "badge": "Category badge (e.g. Popular, Surf Breaks, Wildlife Safari, Scenic Rail, High Altitude, Ocean Wildlife)",
  "tag": "surf", // ONE of: surf | safari | rail | hiking | ocean | adrenaline
  "seasons": "Best seasonal travel window (e.g. South Coast: Nov–Apr · East Coast: May–Sep)",
  "locations": "Best towns/regions separated by ' · ' (e.g. Weligama · Midigama · Hiriketiya · Arugam Bay)",
  "timing": "Best time of day to do it (e.g. Dawn Patrol (6:00 AM – 8:30 AM) or Glassy Sunset)",
  "entryInfo": "Typical cost & pricing details (e.g. Board rental ~LKR 1,500/hr · 1-on-1 Lessons ~LKR 4,000 · Safari Jeep ~$60 USD)",
  "difficulty": "Difficulty rating (e.g. All Levels: Beginner beach breaks to Pro reef points)",
  "image": "https://images.unsplash.com/... (high quality direct landscape photo URL)",
  "desc": "Captivating 2-3 sentence overview describing the thrill, sensory environment, and appeal of the adventure.",
  "heritage": "What to expect: detailed comprehensive paragraph detailing the entire experience flow, local vibe, guides, and uniqueness in Sri Lanka.",
  "ancientRoots": "Local knowledge & insider secrets: micro-climates, monsoon shifts, hidden viewpoints, and how to avoid crowds.",
  "gearChecklist": "Practical packing list: attire, footwear, sun protection, hydration, dry bags, binoculars, or equipment needed.",
  "localSafetyTips": "Safety & local guidelines: certified operators, rip currents, wildlife distances, altitude tips, or insurance notes.",
  "varieties": [
    {
      "name": "Key Spot / Variation 1 (e.g. Weligama Sandy Bay)",
      "tag": "Beginner Paradise",
      "desc": "Detailed sentence explaining what this specific spot offers travelers."
    },
    {
      "name": "Key Spot / Variation 2 (e.g. Hiriketiya Horseshoe Cove)",
      "tag": "Intermediate",
      "desc": "Detailed sentence explaining what this specific spot offers travelers."
    },
    {
      "name": "Key Spot / Variation 3 (e.g. Arugam Bay Main Point)",
      "tag": "World-Class Point",
      "desc": "Detailed sentence explaining what this specific spot offers travelers."
    }
  ],
  "sort_order": 1
}`;

export default function AdminExperiencesTab({ adminPassword }: AdminExperiencesTabProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tab state inside Experience Editor Modal
  const [activeTab, setActiveTab] = useState<'basic' | 'facts' | 'guide' | 'varieties'>('basic');
  const [showAiPasteBox, setShowAiPasteBox] = useState(false);
  const [aiJsonInput, setAiJsonInput] = useState('');

  // Bulk JSON Import & Export State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importingJson, setImportingJson] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    title: string;
    slug: string;
    tagline: string;
    desc: string;
    image: string;
    badge: string;
    tag: string;
    seasons: string;
    locations: string;
    timing: string;
    entryInfo: string;
    difficulty: string;
    heritage: string;
    ancientRoots: string;
    gearChecklist: string;
    localSafetyTips: string;
    varieties: ExperienceVariety[];
    sort_order: number;
  }>({
    title: '',
    slug: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Popular',
    tag: 'surf',
    seasons: '',
    locations: '',
    timing: '',
    entryInfo: '',
    difficulty: 'All Levels',
    heritage: '',
    ancientRoots: '',
    gearChecklist: '',
    localSafetyTips: '',
    varieties: [],
    sort_order: 0,
  });

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
    setActiveTab('basic');
    setForm({
      title: '',
      slug: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'Popular',
      tag: 'surf',
      seasons: '',
      locations: '',
      timing: '',
      entryInfo: '',
      difficulty: 'All Levels',
      heritage: '',
      ancientRoots: '',
      gearChecklist: '',
      localSafetyTips: '',
      varieties: [
        { name: '', tag: 'Highlight', desc: '' }
      ],
      sort_order: experiences.length + 1,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setActiveTab('basic');

    let parsedVarieties: ExperienceVariety[] = [];
    if (exp.varieties) {
      if (Array.isArray(exp.varieties)) {
        parsedVarieties = exp.varieties;
      } else if (typeof exp.varieties === 'string') {
        try {
          const parsed = JSON.parse(exp.varieties);
          if (Array.isArray(parsed)) parsedVarieties = parsed;
        } catch {}
      }
    }
    if (parsedVarieties.length === 0) {
      parsedVarieties = [{ name: '', tag: 'Highlight', desc: '' }];
    }

    setForm({
      title: exp.title || '',
      slug: exp.slug || '',
      tagline: exp.tagline || '',
      desc: exp.desc || '',
      image: exp.image || '',
      badge: exp.badge || 'Popular',
      tag: exp.tag || 'surf',
      seasons: exp.seasons || '',
      locations: exp.locations || '',
      timing: exp.timing || '',
      entryInfo: exp.entryInfo || '',
      difficulty: exp.difficulty || 'All Levels',
      heritage: exp.heritage || '',
      ancientRoots: exp.ancientRoots || '',
      gearChecklist: exp.gearChecklist || '',
      localSafetyTips: exp.localSafetyTips || '',
      varieties: parsedVarieties,
      sort_order: exp.sort_order || 0,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(MASTER_AI_EXPERIENCE_PROMPT);
    toast.success('📋 Master Experience AI Prompt copied to clipboard!');
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

      let parsedVarieties: ExperienceVariety[] = [];
      if (item.varieties && Array.isArray(item.varieties)) {
        parsedVarieties = item.varieties.map((v: any) => ({
          name: String(v.name || ''),
          tag: String(v.tag || 'Highlight'),
          desc: String(v.desc || ''),
        }));
      }

      setForm((prev) => ({
        ...prev,
        title: item.title || item.name || prev.title,
        slug: item.slug || prev.slug,
        tagline: item.tagline || prev.tagline,
        desc: item.desc || item.description || prev.desc,
        image: item.image || item.image_url || item.img || prev.image,
        badge: item.badge || item.categoryLabel || prev.badge,
        tag: item.tag || prev.tag,
        seasons: item.seasons || item.season || item.best_time || prev.seasons,
        locations: item.locations || item.sub || prev.locations,
        timing: item.timing || item.bestTime || item.best_time || prev.timing,
        entryInfo: item.entryInfo || item.entry || item.cost || item.price || prev.entryInfo,
        difficulty: item.difficulty || prev.difficulty,
        heritage: item.heritage || item.whatToExpect || prev.heritage,
        ancientRoots: item.ancientRoots || item.localKnowledge || item.insider_tips || prev.ancientRoots,
        gearChecklist: item.gearChecklist || item.whatToBring || item.gear || prev.gearChecklist,
        localSafetyTips: item.localSafetyTips || item.safety || item.tips || prev.localSafetyTips,
        varieties: parsedVarieties.length > 0 ? parsedVarieties : prev.varieties,
      }));
      toast.success('✨ All adventure facts & spots populated in 1 click!');
      setShowAiPasteBox(false);
    } catch {
      toast.error('Invalid JSON format. Check syntax and commas.');
    }
  };

  // Variety array helpers
  const handleAddVariety = () => {
    setForm((prev) => ({
      ...prev,
      varieties: [...prev.varieties, { name: '', tag: 'Highlight', desc: '' }],
    }));
  };

  const handleRemoveVariety = (index: number) => {
    setForm((prev) => ({
      ...prev,
      varieties: prev.varieties.filter((_, i) => i !== index),
    }));
  };

  const handleVarietyChange = (index: number, field: keyof ExperienceVariety, value: string) => {
    setForm((prev) => {
      const updated = [...prev.varieties];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, varieties: updated };
    });
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
      toast.success('Experience photo optimized & uploaded! 📸');
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
      const isEdit = Boolean(editingExp);
      const url = '/api/experiences';
      const method = isEdit ? 'PUT' : 'POST';

      const validVarieties = form.varieties.filter((v) => v.name.trim() !== '');

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingExp?.id,
          title: form.title,
          slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tagline: form.tagline,
          desc: form.desc,
          image: form.image,
          badge: form.badge,
          tag: form.tag,
          seasons: form.seasons,
          locations: form.locations,
          timing: form.timing,
          entryInfo: form.entryInfo,
          difficulty: form.difficulty,
          heritage: form.heritage,
          ancientRoots: form.ancientRoots,
          gearChecklist: form.gearChecklist,
          localSafetyTips: form.localSafetyTips,
          varieties: validVarieties,
          sort_order: Number(form.sort_order),
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast.success(isEdit ? 'Experience updated successfully!' : 'New experience added!');
      setShowModal(false);
      fetchExperiences();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
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
      toast.success('Experience deleted successfully.');
      setExperiences((prev) => prev.filter((e) => e.id !== id));
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
      JSON.stringify(experiences, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `uncover_ceylon_experiences_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Exported ${experiences.length} experience items to JSON!`);
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
        toast.success(`Loaded "${file.name}" with ${count} experience item(s).`);
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
      let cleaned = jsonText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      parsedData = JSON.parse(cleaned);
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
      const res = await fetch('/api/experiences/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiences: itemsToImport,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import JSON experiences');

      toast.success(data.message || `Successfully imported ${data.createdCount} experiences!`);
      setShowJsonModal(false);
      setJsonText('');
      fetchExperiences();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error importing experiences.';
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
            <Compass className="w-5 h-5 text-sky-400" />
            <span>Ceylon Adventures &amp; Experiences ({experiences.length})</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage surf breaks, leopard safaris, mountain expeditions, and scenic rails on <span className="text-sky-400 font-mono">/experiences</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchExperiences}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-white hover:bg-[#1e304a] transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyAiPrompt}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Copy Master AI Prompt for Experiences"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Copy AI Prompt</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Export to JSON"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Bulk Import JSON"
          >
            <FileCode className="w-4 h-4 text-sky-400" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Grid of Experience Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-slate-400 text-sm mt-3 font-medium">Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 bg-[#111c2e] rounded-3xl border border-[#1e324d] p-8">
          <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4 text-sky-400">
            <Compass className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">No Experiences Found</h4>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Get started by adding your first island adventure, surf break, wildlife safari, or scenic rail journey.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setShowJsonModal(true)}
              className="px-4 py-2.5 rounded-xl border border-[#1e324d] bg-[#162338] text-white text-xs font-bold hover:bg-[#1e304a]"
            >
              📥 Import JSON
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-black hover:bg-sky-400"
            >
              + Add Experience
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="bg-[#111c2e] rounded-3xl border border-[#1e324d] overflow-hidden flex flex-col group hover:border-sky-500/50 transition-all shadow-md hover:shadow-xl"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full bg-[#0d1624] overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111c2e] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/90 text-white backdrop-blur-md shadow-sm">
                  {item.badge || 'Popular'}
                </span>
                {item.seasons && (
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg line-clamp-1">
                    {item.seasons}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  {item.tagline && (
                    <p className="text-xs text-sky-300/80 font-medium line-clamp-1 mt-0.5">
                      {item.tagline}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1e324d] text-xs text-slate-400">
                  <span className="font-mono text-[11px]">#{item.sort_order || item.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1e324d] transition-colors cursor-pointer"
                      title="Edit experience"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete experience"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ━━━ Comprehensive Experience Editor Modal ━━━ */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative w-full max-w-4xl bg-[#111c2e] rounded-3xl shadow-2xl border border-[#1e324d] overflow-hidden z-10 flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#1e324d] flex items-center justify-between gap-4 bg-[#0d1624]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {editingExp ? `Edit "${editingExp.title}"` : 'Add New Island Experience'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure seasons, gear, safety, and highlights shown on <span className="text-sky-400 font-mono">/experiences</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiPasteBox(!showAiPasteBox)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    showAiPasteBox
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25'
                  }`}
                  title="Toggle 1-Click AI JSON Auto-Fill"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">1-Click AI Auto-Fill</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAiPrompt}
                  className="p-2 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-sky-300 hover:bg-[#1e304a] transition-colors cursor-pointer"
                  title="Copy AI Master Prompt"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162338] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI JSON Quick Paste Drawer */}
            {showAiPasteBox && (
              <div className="p-4 sm:p-5 bg-[#090f17] border-b border-[#1e324d] space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Paste ChatGPT / Gemini Experience JSON
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Master Prompt First</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={aiJsonInput}
                  onChange={(e) => setAiJsonInput(e.target.value)}
                  placeholder={`Paste AI output JSON here (e.g. {\n  "title": "Surfing in Sri Lanka",\n  "seasons": "South: Nov-Apr · East: May-Sep",\n  "varieties": [...]\n})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-sky-300 font-mono text-xs placeholder-slate-600 focus:border-sky-500 outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Will instantly populate all 4 tabs, seasons, gear checklist, safety tips, and spots!
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAiPasteBox(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#1e324d] text-slate-400 hover:text-white text-xs font-bold"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyAiJson}
                      className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                    >
                      ⚡ Apply AI Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Tabs Bar */}
            <div className="px-5 sm:px-6 pt-3 bg-[#0d1624] border-b border-[#1e324d] flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'basic'
                    ? 'border-sky-400 text-sky-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>1. Basic &amp; Media</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facts')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'facts'
                    ? 'border-sky-400 text-sky-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>2. Facts &amp; Season</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'border-sky-400 text-sky-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. Gear &amp; Safety</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('varieties')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'varieties'
                    ? 'border-sky-400 text-sky-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>4. Places &amp; Highlights ({form.varieties.filter(v => v.name.trim()).length})</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {/* TAB 1: Basic & Media */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Adventure Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Surfing in Sri Lanka"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="e.g. surfing-in-sri-lanka"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Category Badge
                      </label>
                      <input
                        type="text"
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                        placeholder="e.g. Popular, Surf Breaks, Wildlife Safari"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Filter Category Tag
                      </label>
                      <select
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      >
                        {CATEGORY_TAGS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Display Sort Order
                      </label>
                      <input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Catchy Tagline
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                      placeholder="e.g. Year-Round Warm Ocean Swells & Bohemian Bays"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                    />
                  </div>

                  {/* Image Upload & URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Main High-Resolution Photograph
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                      <label className="px-4 py-2.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span>Upload</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                    {form.image && (
                      <div className="relative mt-3 h-40 w-full rounded-2xl overflow-hidden border border-[#1e324d]">
                        <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Facts & Season */}
              {activeTab === 'facts' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span>Best Season *</span>
                      </label>
                      <input
                        type="text"
                        value={form.seasons}
                        onChange={(e) => setForm({ ...form, seasons: e.target.value })}
                        placeholder="e.g. South Coast: Nov–Apr · East Coast: May–Sep"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-sky-400" />
                        <span>Difficulty Level</span>
                      </label>
                      <input
                        type="text"
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        placeholder="e.g. All Levels: Beginner beach breaks to Pro reef points"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>Best Time of Day</span>
                      </label>
                      <input
                        type="text"
                        value={form.timing}
                        onChange={(e) => setForm({ ...form, timing: e.target.value })}
                        placeholder="e.g. Dawn Patrol (6:00 AM – 8:30 AM) or Glassy Sunset"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-sky-400" />
                        <span>Typical Cost / Price</span>
                      </label>
                      <input
                        type="text"
                        value={form.entryInfo}
                        onChange={(e) => setForm({ ...form, entryInfo: e.target.value })}
                        placeholder="e.g. Board rental ~LKR 1,500/hr · 1-on-1 Lessons ~LKR 4,000"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>Locations &amp; Hubs</span>
                    </label>
                    <input
                      type="text"
                      value={form.locations}
                      onChange={(e) => setForm({ ...form, locations: e.target.value })}
                      placeholder="e.g. Weligama · Midigama · Hiriketiya · Arugam Bay"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Gear & Safety */}
              {activeTab === 'guide' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Brief Overview Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      placeholder="With two alternating monsoon seasons, Sri Lanka is a year-round tropical surf sanctuary..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      What to Expect (Detailed Journey Flow)
                    </label>
                    <textarea
                      rows={4}
                      value={form.heritage}
                      onChange={(e) => setForm({ ...form, heritage: e.target.value })}
                      placeholder="Sri Lanka's surf culture took root in the 1970s when pioneering travelers discovered the endless peeling..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Local Knowledge &amp; Insider Secrets
                    </label>
                    <textarea
                      rows={2}
                      value={form.ancientRoots}
                      onChange={(e) => setForm({ ...form, ancientRoots: e.target.value })}
                      placeholder="Because the southwest and northeast monsoons alternate throughout the year, when south coast is blown out..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                        <span>What to Bring (Gear Checklist)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.gearChecklist}
                        onChange={(e) => setForm({ ...form, gearChecklist: e.target.value })}
                        placeholder="Zinc mineral sunblock, rash guard, reef booties for shallow breaks, surf wax, hydration..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                        <span>Safety &amp; Local Guidelines</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.localSafetyTips}
                        onChange={(e) => setForm({ ...form, localSafetyTips: e.target.value })}
                        placeholder="Observe surf priority and lineup etiquette. Check tides before hitting shallow reef breaks..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-sky-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Places & Highlights */}
              {activeTab === 'varieties' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Places &amp; Highlights ("What to see")
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add key spots, bays, trail viewpoints, or safari sectors for this experience.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariety}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spot</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.varieties.map((v, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#0d1624] border border-[#1e324d] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-mono font-bold text-sky-400">
                            #{i + 1} Spot / Highlight
                          </span>
                          {form.varieties.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariety(i)}
                              className="text-slate-500 hover:text-rose-400 text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={v.name}
                              onChange={(e) => handleVarietyChange(i, 'name', e.target.value)}
                              placeholder="e.g. Weligama Sandy Bay"
                              className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs focus:border-sky-500 outline-none font-semibold"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={v.tag}
                              onChange={(e) => handleVarietyChange(i, 'tag', e.target.value)}
                              placeholder="Tag: Beginner, Intermediate, Scenic"
                              className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs focus:border-sky-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={v.desc}
                            onChange={(e) => handleVarietyChange(i, 'desc', e.target.value)}
                            placeholder="A vast protected sandy horseshoe bay with mellow gentle rollers, ideal for your very first wave..."
                            className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-slate-300 text-xs focus:border-sky-500 outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#1e324d] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'varieties') setActiveTab('guide');
                        else if (activeTab === 'guide') setActiveTab('facts');
                        else if (activeTab === 'facts') setActiveTab('basic');
                      }}
                      className="px-3.5 py-2 rounded-xl border border-[#1e324d] text-slate-300 hover:text-white text-xs font-bold"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeTab !== 'varieties' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'basic') setActiveTab('facts');
                        else if (activeTab === 'facts') setActiveTab('guide');
                        else if (activeTab === 'guide') setActiveTab('varieties');
                      }}
                      className="px-3.5 py-2 rounded-xl border border-[#1e324d] bg-[#162338] text-sky-300 hover:bg-[#1e304a] text-xs font-bold"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#1e324d] text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{editingExp ? 'Save Changes' : 'Create Experience'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━━ Bulk JSON Import Modal ━━━ */}
      {showJsonModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-5">
          <div
            onClick={() => setShowJsonModal(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative w-full max-w-2xl bg-[#111c2e] rounded-3xl shadow-2xl border border-[#1e324d] overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#1e324d] flex items-center justify-between bg-[#0d1624]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Import Experiences JSON</h3>
                  <p className="text-xs text-slate-400">Upload a .json file or paste a JSON array generated by AI.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Upload .json File
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleJsonFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-500/15 file:text-sky-300 hover:file:bg-sky-500/25 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Or Paste Raw JSON
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Master Prompt</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "Surfing in Sri Lanka",\n    "badge": "Popular",\n    "seasons": "South: Nov-Apr · East: May-Sep",\n    "varieties": [...]\n  }\n]`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-sky-300 font-mono text-xs placeholder-slate-600 focus:border-sky-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[#1e324d] bg-[#0d1624] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-xl border border-[#1e324d] text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJsonSubmit}
                disabled={importingJson}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5"
              >
                {importingJson && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Import Experiences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
