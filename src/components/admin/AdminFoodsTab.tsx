import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  CheckCircle2,
  Sparkles,
  Copy,
  ExternalLink,
  ChevronRight,
  Flame,
  Clock,
  DollarSign,
  MapPin,
  Layers,
  BookOpen,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FOODS_DATA } from '@/data/foodsData';

export interface FoodVariety {
  name: string;
  tag: string;
  desc: string;
}

export interface FoodItem {
  id: number;
  slug?: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  badge: string;
  regions: string;
  tag?: string;
  cuisine?: string;
  meal?: string;
  price?: string;
  spice?: string;
  serving?: string;
  locations?: string;
  heritage?: string;
  ingredients?: string;
  howToEat?: string;
  varieties?: string | FoodVariety[];
  sort_order: number;
}

interface AdminFoodsTabProps {
  adminPassword: string;
}

const CATEGORY_TAGS = [
  { value: 'street', label: '🌶️ Street Food' },
  { value: 'curry', label: '🍛 Rice & Curry' },
  { value: 'seafood', label: '🐟 Seafood' },
  { value: 'sweets', label: '🍯 Sweets & Desserts' },
  { value: 'drinks', label: '🥤 Drinks & Ceylon Tea' },
];

export const MASTER_AI_FOOD_PROMPT = `You are a Sri Lankan Culinary & Travel Expert for the Uncover Ceylon platform.
Generate a complete, authentic, high-detail JSON specification for the following Sri Lankan food/dish:
FOOD NAME: [PASTE FOOD NAME HERE, e.g. "Pol Roti with Lunu Miris" or "Ambul Thiyal"]

Output ONLY a valid raw JSON object (enclosed in \`\`\`json ... \`\`\`) with the EXACT structure below. Fill every single field with rich, accurate, and mouth-watering content:

{
  "title": "Full dish name in English (e.g. Pol Roti & Lunu Miris)",
  "slug": "url-friendly-kebab-case-slug (e.g. pol-roti-lunu-miris)",
  "tagline": "Short evocative catchphrase (e.g. Griddled Coconut Flatbread with Fiery Chili Relish)",
  "tag": "street", // ONE of: street | curry | seafood | sweets | drinks
  "cuisine": "Cuisine type (e.g. Breakfast & Street Food, Southern Coastal, Kandyan Heritage, Highland Tea)",
  "badge": "Badge text (e.g. Must Try, Village Icon, Breakfast Classic, Street Favorite)",
  "meal": "Typical meal time (e.g. Breakfast & Dinner, Lunch, All-Day Street Snack)",
  "spice": "Spice intensity (e.g. Mild, Medium, Fiery, Medium to Fiery, Non-Spicy)",
  "serving": "Traditional serving style (e.g. Fresh Off the Hot Griddle, Clay Pot Buffet, Banana Leaf Wrap, Steaming Brass Cup)",
  "price": "Typical local price range in LKR (e.g. LKR 100 – LKR 250)",
  "locations": "Best towns/regions to eat this dish separated by ' · ' (e.g. Colombo · Galle Face · Kandy · Ella)",
  "image": "https://images.unsplash.com/... (high quality direct food photo URL or leave empty string \"\")",
  "desc": "Rich 2-3 sentence overview describing the dish's aroma, textures, and sensory experience.",
  "heritage": "Detailed paragraph exploring the cultural origins, history, village hearths, preparation traditions, and why it is beloved in Sri Lankan heritage.",
  "ingredients": "Comprehensive comma-separated list of authentic Sri Lankan ingredients, spices, coconut preparations, and herbs.",
  "howToEat": "Clear practical guide on how to eat it like a local: eating with fingers, side curries, sambols, pairings (like hot Ceylon tea or King Coconut), and ordering tips.",
  "varieties": [
    {
      "name": "Variation 1 Name (e.g. Classic Griddled Pol Roti)",
      "tag": "Classic",
      "desc": "Detailed sentence explaining how this variation is prepared and served."
    },
    {
      "name": "Variation 2 Name (e.g. Chili & Onion Stuffed Roti)",
      "tag": "Fiery",
      "desc": "Detailed sentence explaining how this variation is prepared and served."
    },
    {
      "name": "Variation 3 Name (e.g. Sweet Jaggery Pol Roti)",
      "tag": "Sweet",
      "desc": "Detailed sentence explaining how this variation is prepared and served."
    }
  ],
  "sort_order": 1
}`;

export default function AdminFoodsTab({ adminPassword }: AdminFoodsTabProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tab state inside Food Editor Modal
  const [activeTab, setActiveTab] = useState<'basic' | 'facts' | 'guide' | 'varieties'>('basic');
  const [showAiPasteBox, setShowAiPasteBox] = useState(false);
  const [aiJsonInput, setAiJsonInput] = useState('');

  // Bulk JSON Import & Export State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importingJson, setImportingJson] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    desc: '',
    image: '',
    badge: 'Must Try',
    regions: '',
    tag: 'street',
    cuisine: 'Street Food',
    meal: 'Dinner',
    price: 'LKR 200 – LKR 600',
    spice: 'Medium to Fiery',
    serving: 'Fresh Off the Wok',
    locations: 'Colombo · Galle Face · Kandy',
    heritage: '',
    ingredients: '',
    howToEat: '',
    sort_order: 1,
  });

  const [varietiesList, setVarietiesList] = useState<FoodVariety[]>([]);

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
      slug: '',
      tagline: '',
      desc: '',
      image: '',
      badge: 'Must Try',
      regions: 'Colombo · Galle Face · Kandy',
      tag: 'street',
      cuisine: 'Street Food',
      meal: 'Dinner',
      price: 'LKR 200 – LKR 600',
      spice: 'Medium to Fiery',
      serving: 'Fresh Off the Wok',
      locations: 'Colombo · Galle Face · Kandy',
      heritage: '',
      ingredients: '',
      howToEat: '',
      sort_order: foods.length + 1,
    });
    setVarietiesList([
      { name: 'Classic Preparation', tag: 'Traditional', desc: 'Authentic local preparation served fresh.' },
      { name: 'Special Spicy Version', tag: 'Fiery', desc: 'Prepared with extra chili and aromatic roasted spices.' }
    ]);
    setActiveTab('basic');
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    let initialVarieties: FoodVariety[] = [];
    if (food.varieties) {
      try {
        const parsed = typeof food.varieties === 'string' ? JSON.parse(food.varieties) : food.varieties;
        if (Array.isArray(parsed)) initialVarieties = parsed;
      } catch {
        initialVarieties = [];
      }
    }

    setForm({
      title: food.title || '',
      slug: food.slug || '',
      tagline: food.tagline || '',
      desc: food.desc || '',
      image: food.image || '',
      badge: food.badge || 'Must Try',
      regions: food.regions || food.locations || '',
      tag: food.tag || 'street',
      cuisine: food.cuisine || food.badge || 'Sri Lankan',
      meal: food.meal || 'Lunch / Dinner',
      price: food.price || '',
      spice: food.spice || 'Medium to Fiery',
      serving: food.serving || 'Traditional Service',
      locations: food.locations || food.regions || '',
      heritage: food.heritage || food.desc || '',
      ingredients: food.ingredients || '',
      howToEat: food.howToEat || '',
      sort_order: food.sort_order || 0,
    });
    setVarietiesList(initialVarieties);
    setActiveTab('basic');
    setShowAiPasteBox(false);
    setAiJsonInput('');
    setShowModal(true);
  };

  // Copy AI Master Prompt to Clipboard
  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(MASTER_AI_FOOD_PROMPT);
    toast.success('📋 Master AI Food Prompt copied! Paste into ChatGPT or Gemini and replace the dish name.', {
      duration: 6000,
    });
  };

  // 1-Click AI JSON Parser
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

      const title = String(item.title || item.name || form.title || '').trim();
      const slug = String(item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).trim();
      const tagline = String(item.tagline || form.tagline || '').trim();
      const desc = String(item.desc || item.description || form.desc || '').trim();
      const image = String(item.image || item.img || form.image || '').trim();
      const badge = String(item.badge || item.cuisine || form.badge || 'Must Try').trim();
      const tag = String(item.tag || form.tag || 'street').toLowerCase().trim();
      const cuisine = String(item.cuisine || item.badge || form.cuisine || 'Sri Lankan').trim();
      const meal = String(item.meal || form.meal || 'Lunch / Dinner').trim();
      const price = String(item.price || form.price || '').trim();
      const spice = String(item.spice || form.spice || 'Medium to Fiery').trim();
      const serving = String(item.serving || form.serving || 'Traditional Service').trim();
      const locations = String(item.locations || item.regions || item.sub || form.locations || '').trim();
      const heritage = String(item.heritage || item.about || desc || form.heritage || '').trim();
      const ingredients = String(item.ingredients || form.ingredients || '').trim();
      const howToEat = String(item.howToEat || item.how_to_eat || form.howToEat || '').trim();

      setForm((prev) => ({
        ...prev,
        title: title || prev.title,
        slug: slug || prev.slug,
        tagline: tagline || prev.tagline,
        desc: desc || prev.desc,
        image: image || prev.image,
        badge: badge || prev.badge,
        regions: locations || prev.regions,
        tag: tag || prev.tag,
        cuisine: cuisine || prev.cuisine,
        meal: meal || prev.meal,
        price: price || prev.price,
        spice: spice || prev.spice,
        serving: serving || prev.serving,
        locations: locations || prev.locations,
        heritage: heritage || prev.heritage,
        ingredients: ingredients || prev.ingredients,
        howToEat: howToEat || prev.howToEat,
      }));

      if (Array.isArray(item.varieties) && item.varieties.length > 0) {
        setVarietiesList(
          item.varieties.map((v: any) => ({
            name: String(v.name || v.title || '').trim(),
            tag: String(v.tag || v.badge || 'Classic').trim(),
            desc: String(v.desc || v.description || '').trim(),
          }))
        );
      }

      toast.success('✨ All food details & variations filled in 1 click!');
      setShowAiPasteBox(false);
    } catch {
      toast.error('Invalid JSON syntax. Please check for missing quotes or commas.');
    }
  };

  // Add a new variety row
  const handleAddVariety = () => {
    setVarietiesList((prev) => [
      ...prev,
      { name: '', tag: 'Classic', desc: '' }
    ]);
  };

  // Remove a variety row
  const handleRemoveVariety = (index: number) => {
    setVarietiesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Update variety field
  const handleVarietyChange = (index: number, field: keyof FoodVariety, value: string) => {
    setVarietiesList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Image Upload handler
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
      toast.success('Food photo uploaded successfully! 📸');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Photo upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Save Food handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) {
      toast.error('Please enter title and description.');
      setActiveTab('basic');
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
          varieties: varietiesList,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save food item');

      toast.success(isEdit ? 'Food item updated successfully!' : 'New authentic food item added!');
      setShowModal(false);
      fetchFoods();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving food item.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Food handler
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

  // Preload curated dishes into JSON modal
  const handlePreloadCurated = () => {
    setJsonText(JSON.stringify(FOODS_DATA, null, 2));
    toast.success('Loaded 20 curated dishes into JSON viewer.');
  };

  // JSON File upload handler
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
            onClick={handleCopyAiPrompt}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            title="Copy Master Prompt for ChatGPT/Gemini"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Copy AI Prompt</span>
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
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#00aa6c]/30 backdrop-blur-md border border-[#00aa6c]/50 text-[#3ddc9a] text-[11px] font-black shadow-sm">
                      {food.badge || 'Must Try'}
                    </span>
                    {food.tag && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                        {food.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-lg font-black text-white group-hover:text-[#3ddc9a] transition-colors leading-tight">
                      {food.title}
                    </h4>
                  </div>
                  <p className="text-xs font-bold text-amber-400 mt-1">{food.tagline}</p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{food.desc}</p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    {food.price && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                        💰 {food.price}
                      </span>
                    )}
                    {food.spice && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md">
                        🌶️ {food.spice}
                      </span>
                    )}
                    {food.meal && (
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded-md">
                        🕒 {food.meal}
                      </span>
                    )}
                  </div>

                  {(food.locations || food.regions) && (
                    <div className="mt-2.5 text-[11px] font-semibold text-slate-400 bg-[#0a111a] border border-[#1e324d] px-2.5 py-1 rounded-lg w-fit flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="line-clamp-1">{food.locations || food.regions}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1e324d]/60 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">#{food.sort_order}</span>
                  <Link
                    href={`/food/${food.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3ddc9a] hover:underline"
                    title="View live food detail page"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(food)}
                    className="p-2 rounded-xl text-slate-300 hover:text-[#3ddc9a] hover:bg-[#162338] transition-colors cursor-pointer"
                    title="Edit complete food details"
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

      {/* ━━━ Comprehensive Food Editor Modal ━━━ */}
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
                <div className="w-10 h-10 rounded-2xl bg-[#00aa6c]/15 border border-[#00aa6c]/30 flex items-center justify-center text-[#3ddc9a]">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {editingFood ? `Edit "${editingFood.title}"` : 'Add New Authentic Ceylon Dish'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize facts, ingredients, variations, and cultural heritage shown on <span className="text-[#3ddc9a] font-mono">/food</span>.
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
                  title="Toggle 1-Click AI JSON Import"
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
                      Paste ChatGPT / Gemini Food JSON
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
                  placeholder={`Paste AI output JSON here (e.g. {\n  "title": "Egg Hoppers (Appa)",\n  "spice": "Mild",\n  "price": "LKR 80 – LKR 200",\n  "varieties": [...]\n})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1624] border border-[#1e324d] text-emerald-400 font-mono text-xs placeholder-slate-600 focus:border-[#00aa6c] outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Will instantly auto-populate all tabs, variations, and cultural text!
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
                    ? 'border-[#00aa6c] text-[#3ddc9a] bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>1. Basic &amp; Media</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facts')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'facts'
                    ? 'border-[#00aa6c] text-[#3ddc9a] bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>2. Facts &amp; Locations</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'border-[#00aa6c] text-[#3ddc9a] bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3. Story &amp; Heritage</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('varieties')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'varieties'
                    ? 'border-[#00aa6c] text-[#3ddc9a] bg-[#111c2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>4. Variations ({varietiesList.length})</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {/* TAB 1: BASIC & MEDIA */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Dish Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Egg Hoppers (Appa)"
                        value={form.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title: val,
                            slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. egg-hoppers-appa"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-slate-300 placeholder-slate-500 focus:border-[#00aa6c] text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Tagline / Catchphrase
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bowl-Shaped Coconut Pancakes"
                        value={form.tagline}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Must Try / Breakfast Classic"
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category Tag *
                      </label>
                      <select
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white focus:border-[#00aa6c] text-sm outline-none cursor-pointer"
                      >
                        {CATEGORY_TAGS.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Cuisine / Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Breakfast / Street Food"
                        value={form.cuisine}
                        onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
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

                  {/* Photo URL & Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Dish Photo (URL or Local Upload)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#162338] hover:bg-[#1e304a] border border-[#1e324d] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors">
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-[#00aa6c]" /> : <Upload className="w-4 h-4" />}
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {form.image && (
                      <div className="mt-3 relative h-40 w-full rounded-2xl overflow-hidden border border-[#1e324d] bg-[#0a111a]">
                        <Image src={form.image} alt="Preview" fill className="object-cover" unoptimized />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: FACTS & LOCATIONS */}
              {activeTab === 'facts' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-[#0a111a] border border-[#1e324d] flex items-start gap-3">
                    <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      These 4 facts are prominently featured in the 4-card fact grid on the food details page (Screenshot layout: Spice Level, Meal, Serving Style, and Typical Price).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        🌶️ Spice Level
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mild / Medium to Fiery / Fiery"
                        value={form.spice}
                        onChange={(e) => setForm({ ...form, spice: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        🕒 Typical Meal Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Breakfast / Lunch / Dinner / Snack"
                        value={form.meal}
                        onChange={(e) => setForm({ ...form, meal: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        🍽️ Serving Style
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fresh Off the Wok / Clay Pots / Banana Leaf"
                        value={form.serving}
                        onChange={(e) => setForm({ ...form, serving: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        💰 Typical Price Range
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LKR 80 – LKR 200"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      📍 Best Locations / Regions (Separated by &apos; · &apos;)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Galle · Colombo · All Provinces"
                      value={form.locations}
                      onChange={(e) => setForm({ ...form, locations: e.target.value, regions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: STORY & HERITAGE */}
              {activeTab === 'guide' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Short Overview Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Crispy golden edges with a soft, pillowy coconut centre. Enjoyed plain, with a warm steamed egg, and fiery lunu miris..."
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      About This Dish &amp; Cultural Heritage (Appears under &quot;About this dish&quot;)
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Explore the culinary traditions, how it was developed in village hearths or coastal fishermen communities, and cultural significance..."
                      value={form.heritage}
                      onChange={(e) => setForm({ ...form, heritage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Authentic Ingredients (Appears under &quot;Ingredients&quot; accordion)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Fermented rice flour, fresh coconut milk, yeast or toddy, pinch of sugar, sea salt, farm eggs, crushed red chili..."
                      value={form.ingredients}
                      onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      How to Eat &amp; Order (Appears under &quot;How to eat &amp; order&quot; accordion)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Best eaten fresh and steaming right off the wok. Tear the crispy edges and dip into fiery lunu miris or spicy seeni sambol. Pair with hot Ceylon tea..."
                      value={form.howToEat}
                      onChange={(e) => setForm({ ...form, howToEat: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a111a] border border-[#1e324d] text-white placeholder-slate-500 focus:border-[#00aa6c] text-sm outline-none resize-y leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: VARIATIONS */}
              {activeTab === 'varieties' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Dishes &amp; Variations ({varietiesList.length})</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Shown under the &quot;Variations&quot; section on the dish detail page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariety}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00aa6c]/20 hover:bg-[#00aa6c]/30 border border-[#00aa6c]/40 text-[#3ddc9a] text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Variation</span>
                    </button>
                  </div>

                  {varietiesList.length === 0 ? (
                    <div className="p-8 text-center bg-[#0a111a] rounded-2xl border border-[#1e324d]">
                      <p className="text-xs text-slate-400">No variations added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddVariety}
                        className="mt-3 px-4 py-2 rounded-xl bg-[#162338] text-white text-xs font-bold hover:bg-[#1e304a] transition-all"
                      >
                        + Add First Variation
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {varietiesList.map((variety, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[#0a111a] border border-[#1e324d] relative space-y-3 group"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-mono font-bold text-slate-400 bg-[#162338] px-2 py-0.5 rounded-md">
                              #{idx + 1} Variation
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariety(idx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="Delete variation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Variation Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Egg Hoppers (Biththara Appa)"
                                value={variety.name}
                                onChange={(e) => handleVarietyChange(idx, 'name', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs placeholder-slate-500 focus:border-[#00aa6c] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Tag / Style Badge
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Classic / Fiery / Sweet / Signature"
                                value={variety.tag}
                                onChange={(e) => handleVarietyChange(idx, 'tag', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs placeholder-slate-500 focus:border-[#00aa6c] outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Describe this specific variation, texture, ingredients, or unique preparation style..."
                              value={variety.desc}
                              onChange={(e) => handleVarietyChange(idx, 'desc', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#111c2e] border border-[#1e324d] text-white text-xs placeholder-slate-500 focus:border-[#00aa6c] outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[#1e324d]">
                <div className="flex items-center gap-2">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'facts') setActiveTab('basic');
                        if (activeTab === 'guide') setActiveTab('facts');
                        if (activeTab === 'varieties') setActiveTab('guide');
                      }}
                      className="px-3.5 py-2 rounded-xl border border-[#1e324d] text-slate-300 font-bold text-xs hover:bg-[#162338] transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>
                  )}

                  {activeTab !== 'varieties' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'basic') setActiveTab('facts');
                        if (activeTab === 'facts') setActiveTab('guide');
                        if (activeTab === 'guide') setActiveTab('varieties');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#162338] border border-[#1e324d] text-slate-200 font-bold text-xs hover:bg-[#1e304a] transition-colors cursor-pointer"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━━ Bulk JSON Import Modal ━━━ */}
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
                  placeholder={`[\n  {\n    "title": "Midnight Kottu Roti",\n    "tagline": "The Sound of Sri Lankan Nights",\n    "desc": "Chopped godamba roti tossed on hot iron...",\n    "image": "https://images.unsplash.com/...",\n    "badge": "Street Food",\n    "spice": "Medium to Fiery",\n    "meal": "Dinner",\n    "price": "LKR 350 – LKR 850",\n    "serving": "Sizzling Hot Plate",\n    "locations": "Colombo · Galle Face · Kandy",\n    "varieties": [...]\n  }\n]`}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0a111a] border border-[#1e324d] text-emerald-400 font-mono text-xs placeholder-slate-600 focus:border-[#00aa6c] outline-none leading-relaxed resize-y"
                />
              </div>

              <div className="text-xs text-slate-400 bg-[#162338]/50 p-3 rounded-xl border border-[#1e324d] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] flex-shrink-0 mt-0.5" />
                <span>
                  Accepts all rich fields: <code className="text-amber-300 font-mono">title</code>, <code className="text-amber-300 font-mono">desc</code>, <code className="text-amber-300 font-mono">heritage</code>, <code className="text-amber-300 font-mono">ingredients</code>, <code className="text-amber-300 font-mono">howToEat</code>, <code className="text-amber-300 font-mono">spice</code>, <code className="text-amber-300 font-mono">meal</code>, <code className="text-amber-300 font-mono">serving</code>, <code className="text-amber-300 font-mono">price</code>, <code className="text-amber-300 font-mono">locations</code>, and <code className="text-amber-300 font-mono">varieties</code>.
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
