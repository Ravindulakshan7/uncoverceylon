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
  Copy,
  Clock,
  Ticket,
  Shirt,
  ShieldCheck,
  Compass,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface CultureVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface CultureItem {
  id: number;
  slug?: string;
  title: string;
  sinhalaName?: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  tag?: string;
  period: string;
  locations?: string;
  timing?: string;
  entryInfo?: string;
  dressCode?: string;
  preservation?: string;
  heritage?: string;
  ancientRoots?: string;
  architecturalElements?: string;
  etiquetteTips?: string;
  varieties?: string | CultureVariety[];
  sort_order: number;
}

interface AdminCultureTabProps {
  adminPassword: string;
}

const CATEGORY_TAGS = [
  { value: 'unesco', label: '🏛️ UNESCO Wonders' },
  { value: 'temples', label: '🛕 Sacred Temples' },
  { value: 'citadels', label: '🏰 Ancient Citadels' },
  { value: 'rituals', label: '🔥 Sacred Rituals' },
  { value: 'crafts', label: '🎭 Folk Crafts & Arts' },
  { value: 'pilgrimage', label: '⛰️ Pilgrimage' },
];

export const MASTER_AI_CULTURE_PROMPT = `You are a Sri Lankan Cultural Heritage & Architectural Historian for the luxury travel platform "Uncover Ceylon".
Generate a complete, authentic, high-detail JSON specification for the following Sri Lankan cultural/heritage attraction or tradition:
ATTRACTION NAME: [PASTE ATTRACTION NAME HERE, e.g. "Galle Fort Ramparts" or "Sigiriya Rock Fortress" or "Temple of the Sacred Tooth Relic"]

Output ONLY a valid raw JSON object (enclosed in \`\`\`json ... \`\`\`) with the EXACT structure below. Fill every single field with rich, accurate, and poetic content:

{
  "title": "Full official attraction name in English (e.g. Galle Fort Ramparts)",
  "slug": "url-friendly-kebab-case-slug (e.g. galle-fort-ramparts)",
  "sinhalaName": "Traditional Sinhala name with script & translation (e.g. ගාල්ල ලන්දේසි කොටුව (Galle Dutch Fort))",
  "tagline": "Short evocative catchphrase (e.g. 17th-Century Living European Fortress on the Indian Ocean)",
  "badge": "Category badge (e.g. UNESCO Wonder, Sacred Temple, Ancient Citadel, Sacred Ritual, Folk Art, Colonial Living, Pilgrimage)",
  "tag": "unesco", // ONE of: unesco | temples | citadels | rituals | crafts | pilgrimage
  "period": "Historical era & century (e.g. 16th – 18th Century • Southern Coast)",
  "locations": "Towns/districts & province separated by ' · ' (e.g. Galle Old Town · Southern Coast · Southern Province)",
  "timing": "Best time of day to visit (e.g. 4:30 PM – 7:00 PM (Golden hour & ocean sunset))",
  "entryInfo": "Ticket cost & entry access rules (e.g. Free 24/7 public access to ramparts & streets / Museum tickets ~$5 USD)",
  "dressCode": "Appropriate attire guide (e.g. Casual seaside resort wear & comfortable walking sandals. Modest cover at churches & temples.)",
  "preservation": "Official conservation status (e.g. UNESCO World Heritage Site (1988) · Protected Monument of Sri Lanka)",
  "image": "https://images.unsplash.com/... (high quality direct landscape photo URL)",
  "desc": "Captivating 2-3 sentence overview describing the atmosphere, setting, and significance of the place.",
  "heritage": "Detailed comprehensive paragraph exploring the deep history, founding monarch or colonial power, military architecture, and living communities.",
  "ancientRoots": "Origins, folklore, or historic sentinel traditions explaining how the site functioned originally.",
  "architecturalElements": "Detailed architectural breakdown: materials used (coral, granite stone, VOC coats of arms, colonial gables, rampart bastions, underground sewer networks).",
  "etiquetteTips": "Crucial traveler advice: walking along bastions, safety near waves, photography etiquette, and local guide advice.",
  "varieties": [
    {
      "name": "Key Highlight / Bastion / Monument 1 (e.g. Galle Lighthouse & Point Utrecht)",
      "tag": "Bastion",
      "desc": "Detailed sentence explaining the history and view from this specific landmark."
    },
    {
      "name": "Key Highlight / Bastion / Monument 2 (e.g. Dutch Reformed Church (Groote Kerk))",
      "tag": "Architecture",
      "desc": "Detailed sentence explaining this specific highlight within the site."
    },
    {
      "name": "Key Highlight / Bastion / Monument 3 (e.g. Flag Rock Sunset Bastion)",
      "tag": "Panoramic",
      "desc": "Detailed sentence explaining what visitors experience here."
    },
    {
      "name": "Key Highlight / Bastion / Monument 4 (e.g. National Maritime Museum)",
      "tag": "Artifacts",
      "desc": "Detailed sentence explaining historical artifacts and exhibits."
    }
  ],
  "sort_order": 1
}`;

export default function AdminCultureTab({ adminPassword }: AdminCultureTabProps) {
  const [cultures, setCultures] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCulture, setEditingCulture] = useState<CultureItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tab state inside Culture Editor Modal
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
    sinhalaName: string;
    tagline: string;
    desc: string;
    image: string;
    badge: string;
    tag: string;
    period: string;
    locations: string;
    timing: string;
    entryInfo: string;
    dressCode: string;
    preservation: string;
    heritage: string;
    ancientRoots: string;
    architecturalElements: string;
    etiquetteTips: string;
    varieties: CultureVariety[];
    sort_order: number;
  }>({
    title: '',
    slug: '',
    sinhalaName: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Heritage',
    tag: 'unesco',
    period: '',
    locations: '',
    timing: '',
    entryInfo: '',
    dressCode: '',
    preservation: '',
    heritage: '',
    ancientRoots: '',
    architecturalElements: '',
    etiquetteTips: '',
    varieties: [],
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
    setActiveTab('basic');
    setForm({
      title: '',
      slug: '',
      sinhalaName: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'UNESCO Wonder',
      tag: 'unesco',
      period: '',
      locations: '',
      timing: '',
      entryInfo: '',
      dressCode: '',
      preservation: '',
      heritage: '',
      ancientRoots: '',
      architecturalElements: '',
      etiquetteTips: '',
      varieties: [
        { name: '', tag: 'Highlight', desc: '' }
      ],
      sort_order: cultures.length + 1,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const openEditModal = (culture: CultureItem) => {
    setEditingCulture(culture);
    setActiveTab('basic');

    let parsedVarieties: CultureVariety[] = [];
    if (culture.varieties) {
      if (Array.isArray(culture.varieties)) {
        parsedVarieties = culture.varieties;
      } else if (typeof culture.varieties === 'string') {
        try {
          const parsed = JSON.parse(culture.varieties);
          if (Array.isArray(parsed)) parsedVarieties = parsed;
        } catch {}
      }
    }
    if (parsedVarieties.length === 0) {
      parsedVarieties = [{ name: '', tag: 'Highlight', desc: '' }];
    }

    setForm({
      title: culture.title || '',
      slug: culture.slug || '',
      sinhalaName: culture.sinhalaName || '',
      tagline: culture.tagline || '',
      desc: culture.desc || '',
      image: culture.image || '',
      badge: culture.badge || 'Heritage',
      tag: culture.tag || 'unesco',
      period: culture.period || '',
      locations: culture.locations || '',
      timing: culture.timing || '',
      entryInfo: culture.entryInfo || '',
      dressCode: culture.dressCode || '',
      preservation: culture.preservation || '',
      heritage: culture.heritage || '',
      ancientRoots: culture.ancientRoots || '',
      architecturalElements: culture.architecturalElements || '',
      etiquetteTips: culture.etiquetteTips || '',
      varieties: parsedVarieties,
      sort_order: culture.sort_order || 0,
    });
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(MASTER_AI_CULTURE_PROMPT);
    toast.success('📋 Master Culture AI Prompt copied to clipboard!');
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

      let parsedVarieties: CultureVariety[] = [];
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
        sinhalaName: item.sinhalaName || item.sinhala_name || prev.sinhalaName,
        tagline: item.tagline || prev.tagline,
        desc: item.desc || item.description || prev.desc,
        image: item.image || item.image_url || item.img || prev.image,
        badge: item.badge || item.categoryLabel || prev.badge,
        tag: item.tag || prev.tag,
        period: item.period || item.epoch || item.era || prev.period,
        locations: item.locations || item.sub || prev.locations,
        timing: item.timing || item.bestTime || item.best_time || prev.timing,
        entryInfo: item.entryInfo || item.entry || prev.entryInfo,
        dressCode: item.dressCode || item.dress_code || prev.dressCode,
        preservation: item.preservation || item.conservation || prev.preservation,
        heritage: item.heritage || item.history || prev.heritage,
        ancientRoots: item.ancientRoots || item.origins || prev.ancientRoots,
        architecturalElements: item.architecturalElements || item.architecture || prev.architecturalElements,
        etiquetteTips: item.etiquetteTips || item.etiquette || item.tips || prev.etiquetteTips,
        varieties: parsedVarieties.length > 0 ? parsedVarieties : prev.varieties,
      }));
      toast.success('✨ All culture facts & highlights populated in 1 click!');
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

  const handleVarietyChange = (index: number, field: keyof CultureVariety, value: string) => {
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

      const validVarieties = form.varieties.filter((v) => v.name.trim() !== '');

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCulture?.id,
          title: form.title,
          slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          sinhalaName: form.sinhalaName,
          tagline: form.tagline,
          desc: form.desc,
          image: form.image,
          badge: form.badge,
          tag: form.tag,
          period: form.period,
          locations: form.locations,
          timing: form.timing,
          entryInfo: form.entryInfo,
          dressCode: form.dressCode,
          preservation: form.preservation,
          heritage: form.heritage,
          ancientRoots: form.ancientRoots,
          architecturalElements: form.architecturalElements,
          etiquetteTips: form.etiquetteTips,
          varieties: validVarieties,
          sort_order: Number(form.sort_order),
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast.success(isEdit ? 'Culture updated successfully!' : 'New culture added!');
      setShowModal(false);
      fetchCultures();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
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
            <Landmark className="w-5 h-5 text-amber-400" />
            <span>Ceylon Culture &amp; Heritage ({cultures.length})</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage ancient citadels, UNESCO wonders, temples, and living traditions on <span className="text-amber-400 font-mono">/culture</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCultures}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-white hover:bg-[#1e304a] transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyAiPrompt}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Copy Master AI Prompt for Culture"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
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
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Culture Pillar</span>
          </button>
        </div>
      </div>

      {/* Grid of Culture Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111c2e] rounded-3xl border border-[#1e324d]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-slate-400 text-sm mt-3 font-medium">Loading culture items...</p>
        </div>
      ) : cultures.length === 0 ? (
        <div className="text-center py-16 bg-[#111c2e] rounded-3xl border border-[#1e324d] p-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Landmark className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">No Culture Items Found</h4>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Get started by adding your first UNESCO site, sacred temple, or historical kingdom, or import a JSON list.
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
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400"
            >
              + Add Culture Pillar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cultures.map((item) => (
            <div
              key={item.id}
              className="bg-[#111c2e] rounded-3xl border border-[#1e324d] overflow-hidden flex flex-col group hover:border-amber-500/50 transition-all shadow-md hover:shadow-xl"
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
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md shadow-sm">
                  {item.badge || 'Heritage'}
                </span>
                {item.period && (
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {item.period}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  {item.tagline && (
                    <p className="text-xs text-amber-300/80 font-medium line-clamp-1 mt-0.5">
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
                      title="Edit culture"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete culture"
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

      {/* ━━━ Comprehensive Culture Editor Modal ━━━ */}
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
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {editingCulture ? `Edit "${editingCulture.title}"` : 'Add Culture & Heritage Pillar'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure facts, history, architectural elements, and highlights shown on <span className="text-amber-400 font-mono">/culture</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiPasteBox(!showAiPasteBox)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    showAiPasteBox
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                  }`}
                  title="Toggle 1-Click AI JSON Auto-Fill"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">1-Click AI Auto-Fill</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAiPrompt}
                  className="p-2 rounded-xl border border-[#1e324d] bg-[#162338] text-slate-300 hover:text-amber-300 hover:bg-[#1e304a] transition-colors cursor-pointer"
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
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Paste ChatGPT / Gemini Culture JSON
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Master Prompt First</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={aiJsonInput}
                  onChange={(e) => setAiJsonInput(e.target.value)}
                  placeholder={`Paste AI output JSON here (e.g. {\n  "title": "Galle Fort Ramparts",\n  "badge": "UNESCO Wonder",\n  "timing": "4:30 PM – 7:00 PM",\n  "varieties": [...]\n})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-amber-300 font-mono text-xs placeholder-slate-600 focus:border-amber-500 outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Will instantly populate all 4 tabs, history, architecture, and what-to-see highlights!
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
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer"
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
                    ? 'border-amber-400 text-amber-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>1. Basic &amp; Media</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facts')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'facts'
                    ? 'border-amber-400 text-amber-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>2. Facts &amp; Access</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'border-amber-400 text-amber-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. History &amp; Architecture</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('varieties')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'varieties'
                    ? 'border-amber-400 text-amber-400 bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>4. What to See ({form.varieties.filter(v => v.name.trim()).length})</span>
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
                        Title / Monument Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Galle Fort Ramparts"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Traditional Sinhala Name
                      </label>
                      <input
                        type="text"
                        value={form.sinhalaName}
                        onChange={(e) => setForm({ ...form, sinhalaName: e.target.value })}
                        placeholder="e.g. ගාල්ල ලන්දේසි කොටුව"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
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
                        placeholder="e.g. UNESCO Wonder, Sacred Temple, Colonial Living"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Filter Category Tag
                      </label>
                      <select
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
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
                      placeholder="e.g. 17th-Century Living European Fortress on the Indian Ocean"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
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
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                      <label className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
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

              {/* TAB 2: Facts & Access */}
              {activeTab === 'facts' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Best Time to Visit</span>
                      </label>
                      <input
                        type="text"
                        value={form.timing}
                        onChange={(e) => setForm({ ...form, timing: e.target.value })}
                        placeholder="e.g. 4:30 PM – 7:00 PM (Golden hour & ocean sunset)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>Period / Era</span>
                      </label>
                      <input
                        type="text"
                        value={form.period}
                        onChange={(e) => setForm({ ...form, period: e.target.value })}
                        placeholder="e.g. 16th – 18th Century • Southern Coast"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-amber-400" />
                        <span>Entry &amp; Tickets</span>
                      </label>
                      <input
                        type="text"
                        value={form.entryInfo}
                        onChange={(e) => setForm({ ...form, entryInfo: e.target.value })}
                        placeholder="e.g. Free 24/7 public access to ramparts & streets"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dress Code</span>
                      </label>
                      <input
                        type="text"
                        value={form.dressCode}
                        onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
                        placeholder="e.g. Casual seaside resort wear & comfortable walking sandals"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Locations &amp; Province</span>
                      </label>
                      <input
                        type="text"
                        value={form.locations}
                        onChange={(e) => setForm({ ...form, locations: e.target.value })}
                        placeholder="e.g. Galle Fort · Southern Province"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Conservation / Preservation</span>
                      </label>
                      <input
                        type="text"
                        value={form.preservation}
                        onChange={(e) => setForm({ ...form, preservation: e.target.value })}
                        placeholder="e.g. UNESCO World Heritage Site (1988)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: History & Architecture */}
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
                      placeholder="Built by the Portuguese in 1588 and reinforced by the Dutch East India Company..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      History &amp; Background
                    </label>
                    <textarea
                      rows={4}
                      value={form.heritage}
                      onChange={(e) => setForm({ ...form, heritage: e.target.value })}
                      placeholder="Galle Fort is a living, breathing time capsule. Within its 36-hectare perimeter, Dutch colonial villas..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Origins / Historical Sentinels
                    </label>
                    <textarea
                      rows={2}
                      value={form.ancientRoots}
                      onChange={(e) => setForm({ ...form, ancientRoots: e.target.value })}
                      placeholder="Flag Rock Bastion was originally used by Dutch sentries to hoist maritime signal flags..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Architecture &amp; Details
                      </label>
                      <textarea
                        rows={3}
                        value={form.architecturalElements}
                        onChange={(e) => setForm({ ...form, architecturalElements: e.target.value })}
                        placeholder="Coral-and-granite rampart masonry, VOC East India Company crests, Dutch gable facades..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Before You Visit / Etiquette Tips
                      </label>
                      <textarea
                        rows={3}
                        value={form.etiquetteTips}
                        onChange={(e) => setForm({ ...form, etiquetteTips: e.target.value })}
                        placeholder="Rampart perimeter walks are safe and paved. Wear sun protection and stay mindful near high bastion drops..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-white text-sm focus:border-amber-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: What to See / Highlights */}
              {activeTab === 'varieties' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Highlights &amp; Landmarks ("What to see")
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add key bastions, shrines, museum halls, or scenic points of this cultural treasure.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariety}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.varieties.map((v, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#0d1624] border border-[#1e324d] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            #{i + 1} Highlight
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
                              placeholder="e.g. Galle Lighthouse & Point Utrecht"
                              className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs focus:border-amber-500 outline-none font-semibold"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={v.tag}
                              onChange={(e) => handleVarietyChange(i, 'tag', e.target.value)}
                              placeholder="Tag: Bastion, Architecture, Panoramic"
                              className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs focus:border-amber-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={v.desc}
                            onChange={(e) => handleVarietyChange(i, 'desc', e.target.value)}
                            placeholder="Built in 1939 beside ancient gun emplacements, framed by swaying palms over turquoise sea..."
                            className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-slate-300 text-xs focus:border-amber-500 outline-none leading-relaxed"
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
                      className="px-3.5 py-2 rounded-xl border border-[#1e324d] bg-[#162338] text-amber-300 hover:bg-[#1e304a] text-xs font-bold"
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{editingCulture ? 'Save Changes' : 'Create Culture Pillar'}</span>
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
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Import Culture JSON</h3>
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
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/15 file:text-amber-300 hover:file:bg-amber-500/25 cursor-pointer"
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
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Master Prompt</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "Galle Fort Ramparts",\n    "badge": "UNESCO Wonder",\n    "timing": "4:30 PM – 7:00 PM",\n    "varieties": [...]\n  }\n]`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-amber-300 font-mono text-xs placeholder-slate-600 focus:border-amber-500 outline-none resize-none leading-relaxed"
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
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                {importingJson && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Import Culture Items</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
