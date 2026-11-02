"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  ArrowUpDown,
  Filter,
  Upload,
  ImageIcon,
  Palette,
  RotateCcw
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { Product, ColorVariant } from "@/lib/mock-data";

export default function AdminProductsPage() {
  const { products, refreshProducts, addProduct, updateProduct, deleteProduct } = useBoutique();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"saree" | "chudar">("saree");
  const [formSubcategory, setFormSubcategory] = useState("Banarasi Silk");
  const [formPrice, setFormPrice] = useState<string>("0.0");
  const [formFabric, setFormFabric] = useState("Pure Mulberry Silk");
  const [formColor, setFormColor] = useState("Royal Maroon & Gold");
  const [formColorCode, setFormColorCode] = useState("#881337");
  const [formSku, setFormSku] = useState("GV-NEW-001");
  const [formStock, setFormStock] = useState<number>(10);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [formShortDesc, setFormShortDesc] = useState("Authentic handcrafted heirloom with pure zari pallu.");
  const [formPreset, setFormPreset] = useState<"kanchipuram" | "banarasi" | "organza" | "velvet" | "chiffon">("kanchipuram");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [uploadingVariantIdx, setUploadingVariantIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsUploadingMain(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImageUrl(data.url);
        setImagePreview(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dUrl = ev.target?.result as string;
          setFormImageUrl(dUrl);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload error, using local fallback:", err);
    } finally {
      setIsUploadingMain(false);
    }
  };

  const addColorVariant = () => {
    setColorVariants(prev => [
      ...prev,
      { name: "", color_code: "#1e3a8a", image: "" }
    ]);
  };

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    setColorVariants(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantImageUpload = async (index: number, file: File) => {
    const localUrl = URL.createObjectURL(file);
    updateColorVariant(index, "image", localUrl);
    setUploadingVariantIdx(index);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        updateColorVariant(index, "image", data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateColorVariant(index, "image", ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Variant upload note:", err);
    } finally {
      setUploadingVariantIdx(null);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("saree");
    setFormSubcategory("Banarasi Silk");
    setFormPrice("0.0");
    setFormFabric("Pure Mulberry Silk");
    setFormColor("Imperial Crimson & Gold");
    setFormColorCode("#881337");
    setFormSku(`GV-${Date.now().toString(36).toUpperCase()}`);
    setFormStock(10);
    setFormImageUrl("");
    setImagePreview("");
    setColorVariants([]);
    setFormShortDesc("Heirloom pure handloom with traditional border and rich pallu.");
    setFormPreset("kanchipuram");
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory || (p.category === "saree" ? "Banarasi Silk" : "Anarkali Suits"));
    setFormPrice(p.base_price !== undefined ? p.base_price.toString() : "0.0");
    setFormFabric(p.fabric);
    setFormColor(p.color);
    setFormColorCode(p.color_code || "#881337");
    setFormSku(p.sku);
    setFormStock(p.stock);
    setFormImageUrl(p.images[0] || "");
    setImagePreview(p.images[0] || "");
    setColorVariants(p.color_variants || []);
    setFormShortDesc(p.short_description);
    setFormPreset(p.three_d_preset || "kanchipuram");
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const parsedPrice = parseFloat(formPrice);
    const validPrice = isNaN(parsedPrice) ? 0.0 : Math.min(10000, Math.max(0, parsedPrice));
    const validVariants = colorVariants.filter(v => v.name.trim() !== "");

    // Build complete images array with primary image and color variant images
    const variantImages = validVariants.map(v => v.image).filter(Boolean);
    const allImages = Array.from(new Set([formImageUrl, ...variantImages].filter(Boolean)));
    if (allImages.length === 0) allImages.push("/images/placeholder.jpg");

    const resolvedSubcategory = formSubcategory.trim() || (formCategory === "saree" ? "Banarasi Silk" : "Anarkali Suits");

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        subcategory: resolvedSubcategory,
        base_price: Number(validPrice.toFixed(2)),
        fabric: formFabric,
        color: formColor,
        color_code: formColorCode,
        color_variants: validVariants,
        sku: formSku,
        stock: Number(formStock),
        images: allImages,
        short_description: formShortDesc,
        three_d_preset: formPreset
      });
    } else {
      await addProduct({
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formCategory,
        subcategory: resolvedSubcategory,
        base_price: Number(validPrice.toFixed(2)),
        fabric: formFabric,
        color: formColor,
        color_code: formColorCode,
        color_variants: validVariants,
        sku: formSku,
        stock: Number(formStock),
        images: allImages,
        description: `${formName}. Handcrafted in ${formFabric} with fine artisanal needlework and opulent drape.`,
        short_description: formShortDesc,
        is_featured: true,
        is_active: true,
        three_d_preset: formPreset,
        details: {
          wash_care: "Dry Clean Only",
          occasion: "Bridal, Festive & Celebrations",
          origin: formCategory === "saree" ? "Kanchipuram, Tamil Nadu" : "Jaipur, Rajasthan"
        }
      });
    }

    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Inventory Management
          </span>
          <h1 className="mt-1 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            Saree & Chudar Catalog ({products.length})
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Add new bridal silks, adjust stock numbers, edit pricing, and configure 3D fabric presets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setIsSyncing(true);
              try {
                await refreshProducts();
              } catch (e) {
                console.error("Sync error:", e);
              } finally {
                setTimeout(() => setIsSyncing(false), 600);
              }
            }}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-white transition"
            title="Sync latest inventory with Supabase database"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-amber-400" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Database"}</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Handloom Piece</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#14111a] p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              categoryFilter === "all" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            All Pieces ({products.length})
          </button>
          <button
            onClick={() => setCategoryFilter("saree")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              categoryFilter === "saree" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            Sarees ({products.filter(p => p.category === "saree").length})
          </button>
          <button
            onClick={() => setCategoryFilter("chudar")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              categoryFilter === "chudar" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            Chudars & Salwars ({products.filter(p => p.category === "chudar").length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, fabric..."
            className="w-56 sm:w-72 rounded-xl border border-white/15 bg-white/5 py-1.5 pr-3 pl-8 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#14111a] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 bg-white/5">
                <th className="p-4 font-semibold">Creation</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Fabric Weave</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">3D Preset</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-stone-400">
                    <Sparkles className="mx-auto h-8 w-8 text-amber-500/50 mb-2 animate-pulse" />
                    <p className="font-bold text-stone-200 text-sm">No products in inventory yet.</p>
                    <p className="text-stone-500 mt-1">Click &quot;Add New Handloom Piece&quot; above to create your first real-time product.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || "/images/placeholder.jpg"}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                        className="h-12 w-10 shrink-0 rounded-lg object-cover border border-white/10"
                      />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono">{product.sku}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      product.category === "saree"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}>
                      {product.category}
                    </span>
                    {product.subcategory && (
                      <span className="block text-[10px] text-stone-400 mt-0.5">{product.subcategory}</span>
                    )}
                  </td>

                  <td className="p-4 text-stone-300">
                    <p className="line-clamp-1">{product.fabric}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: product.color_code || "#881337" }}
                        title={`Base Color: ${product.color}`}
                      />
                      {product.color_variants && product.color_variants.map((v, i) => (
                        <span
                          key={i}
                          className="inline-block h-3.5 w-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: v.color_code || "#1e3a8a" }}
                          title={`Color Variant: ${v.name}`}
                        />
                      ))}
                      <span className="text-[10px] text-stone-400">
                        {product.color} {product.color_variants && product.color_variants.length > 0 ? `(+${product.color_variants.length} colors)` : ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-white">
                    Rs. {Number(product.base_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    {product.compare_price && (
                      <span className="block text-[10px] text-stone-500 line-through">
                        Rs. {Number(product.compare_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateProduct(product.id, { stock: Math.max(0, product.stock - 1) })}
                        className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-xs font-bold text-stone-300 hover:bg-white/10 hover:text-white transition active:scale-95"
                        title="Decrease stock by 1"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          updateProduct(product.id, { stock: isNaN(val) ? 0 : Math.max(0, val) });
                        }}
                        className={`w-14 rounded-lg border px-1.5 py-0.5 text-center text-xs font-bold outline-none transition ${
                          product.stock <= 0
                            ? "border-rose-500/60 bg-rose-500/10 text-rose-300 focus:border-rose-400"
                            : product.stock <= 5
                            ? "border-amber-500/60 bg-amber-500/10 text-amber-300 focus:border-amber-400"
                            : "border-white/15 bg-white/5 text-stone-200 focus:border-amber-400"
                        }`}
                        title="Directly edit stock and sync with database"
                      />
                      <button
                        type="button"
                        onClick={() => updateProduct(product.id, { stock: product.stock + 1 })}
                        className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-xs font-bold text-stone-300 hover:bg-white/10 hover:text-white transition active:scale-95"
                        title="Increase stock by 1"
                      >
                        +
                      </button>
                      <span className={`text-[10px] font-semibold ml-0.5 ${product.stock <= 0 ? "text-rose-400" : "text-stone-400"}`}>
                        {product.stock <= 0 ? "Sold Out" : "units"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 capitalize">
                      <Sparkles className="h-3 w-3" /> {product.three_d_preset || "kanchipuram"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => updateProduct(product.id, { is_active: !product.is_active })}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        product.is_active
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-stone-700 text-stone-400"
                      }`}
                    >
                      {product.is_active ? "Active" : "Draft"}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition"
                        title="View on Storefront"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => openEditModal(product)}
                        className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/20 transition"
                        title="Edit Product"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${product.name}" from inventory?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/40 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#14111a] p-8 text-white shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold font-serif-luxury text-white">
              {editingProduct ? "Edit Boutique Creation" : "Add New Saree or Chudar"}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Configure product details, category, pricing, and 3D simulation drape preset.
            </p>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-300">Garment Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Royal Kanchipuram Gold Zari Saree"
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as "saree" | "chudar";
                      setFormCategory(newCat);
                      setFormSubcategory(newCat === "saree" ? "Banarasi Silk" : "Anarkali Suits");
                    }}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#1f1b27] p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="saree">Saree Couture</option>
                    <option value="chudar">Chudar & Salwar Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Subcategory / Weave Style</label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder={formCategory === "saree" ? "e.g. Banarasi Silk / Kanchipuram" : "e.g. Anarkali Suit / Palazzo"}
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-stone-300">Stock Price (Rs.)</label>
                    <span className="text-[10px] font-normal text-amber-400">Max Rs. 10000.00</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.0"
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300">Fabric & Weave Type</label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    placeholder="e.g. Pure Mulberry Silk / Micro Velvet"
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Color Shade</label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="e.g. Deep Emerald Green & Gold"
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300">3D Simulation Preset</label>
                  <select
                    value={formPreset}
                    onChange={(e) => setFormPreset(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#1f1b27] p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="kanchipuram">Kanchipuram Pure Silk</option>
                    <option value="banarasi">Banarasi Brocade</option>
                    <option value="organza">Tissue Organza Sheer</option>
                    <option value="velvet">Royal Velvet Plum</option>
                    <option value="chiffon">Midnight Chiffon Mukaish</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">SKU Code</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300">
                  Product Image <span className="text-stone-500 font-normal">(PNG, JPG, JPEG, WEBP)</span>
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 cursor-pointer rounded-xl border-2 border-dashed border-amber-500/30 bg-white/5 p-4 text-center transition hover:border-amber-400 hover:bg-white/10"
                >
                  {isUploadingMain ? (
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mb-2" />
                      <p className="text-xs font-semibold text-amber-300">Uploading to Cloud Storage...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-16 rounded-lg object-cover border border-amber-500/30 shrink-0"
                      />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-amber-300">Image attached ✓</p>
                        <p className="text-[10px] text-stone-400 mt-1">Click to replace with a different image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="mx-auto h-8 w-8 text-amber-500/50 mb-2" />
                      <p className="text-xs font-semibold text-stone-300">Click to upload garment image</p>
                      <p className="text-[10px] text-stone-500 mt-1">PNG, JPG, JPEG or WEBP • Uploads to Cloud</p>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input option */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 shrink-0">Or Image URL:</span>
                  <input
                    type="url"
                    value={formImageUrl && formImageUrl.startsWith("http") ? formImageUrl : ""}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/saree.jpg"
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Multi-Color Variants (Amazon Style) */}
              <div className="rounded-2xl border border-amber-500/20 bg-white/5 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Palette className="h-4 w-4 text-amber-400" /> Color Choices & Swatches (Amazon Style)
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Add different color variants (e.g. Red, Blue, Green). Customers clicking a color will immediately see its photo!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Color Variant</span>
                  </button>
                </div>

                {colorVariants.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-stone-400">
                    <p className="text-stone-300 font-medium">Currently only primary color ({formColor || "Base Color"}) is active.</p>
                    <p className="text-[10px] text-stone-500 mt-1">Click &quot;+ Add Color Variant&quot; above to add more shades with their respective photos.</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {colorVariants.map((variant, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-[#16121f] p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-400" /> Color Option #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeColorVariant(idx)}
                            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-400 transition"
                            title="Remove this color variant"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-300">Color Name & Swatch</label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={variant.color_code || "#1e3a8a"}
                                onChange={(e) => updateColorVariant(idx, "color_code", e.target.value)}
                                className="h-9 w-9 cursor-pointer rounded-xl border border-white/20 bg-transparent p-0.5"
                                title="Click to pick swatch color"
                              />
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => updateColorVariant(idx, "name", e.target.value)}
                                placeholder="e.g. Royal Sapphire Blue"
                                required
                                className="flex-1 rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-white outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-300">Photo for this Color</label>
                            <div className="flex items-center gap-2 mt-1">
                              {variant.image ? (
                                <img
                                  src={variant.image}
                                  alt=""
                                  className="h-9 w-9 rounded-xl object-cover border border-amber-500/40 shrink-0"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-stone-500 shrink-0 bg-white/5">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                              )}
                              <input
                                type="file"
                                id={`variant-file-${idx}`}
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleVariantImageUpload(idx, file);
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`variant-file-${idx}`}
                                className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-stone-200 hover:bg-white/20 transition flex-1 text-center truncate"
                              >
                                {uploadingVariantIdx === idx ? "Uploading..." : variant.image ? "Change Photo ✓" : "Upload Color Photo"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Short Summary</label>
                <textarea
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-stone-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-6 py-2 font-bold text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  {editingProduct ? "Save Changes" : "Publish Creation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
