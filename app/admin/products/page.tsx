"use client";

import React, { useState } from "react";
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
  Filter
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { Product } from "@/lib/mock-data";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useBoutique();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form State for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"saree" | "chudar">("saree");
  const [formSubcategory, setFormSubcategory] = useState("Kanchipuram Silk");
  const [formPrice, setFormPrice] = useState<number>(12999);
  const [formComparePrice, setFormComparePrice] = useState<number>(16999);
  const [formFabric, setFormFabric] = useState("Pure Mulberry Silk");
  const [formColor, setFormColor] = useState("Royal Maroon & Gold");
  const [formColorCode, setFormColorCode] = useState("#881337");
  const [formSku, setFormSku] = useState("GV-NEW-001");
  const [formStock, setFormStock] = useState<number>(10);
  const [formImageUrl, setFormImageUrl] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80");
  const [formShortDesc, setFormShortDesc] = useState("Authentic handcrafted heirloom with pure zari pallu.");
  const [formPreset, setFormPreset] = useState<"kanchipuram" | "banarasi" | "organza" | "velvet" | "chiffon">("kanchipuram");

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("saree");
    setFormSubcategory("Kanchipuram Silk");
    setFormPrice(12999);
    setFormComparePrice(16999);
    setFormFabric("Pure Mulberry Silk");
    setFormColor("Imperial Crimson & Gold");
    setFormColorCode("#881337");
    setFormSku(`GV-${Date.now().toString(36).toUpperCase()}`);
    setFormStock(10);
    setFormImageUrl("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80");
    setFormShortDesc("Heirloom pure handloom with traditional border and rich pallu.");
    setFormPreset("kanchipuram");
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormPrice(p.base_price);
    setFormComparePrice(p.compare_price || p.base_price);
    setFormFabric(p.fabric);
    setFormColor(p.color);
    setFormColorCode(p.color_code);
    setFormSku(p.sku);
    setFormStock(p.stock);
    setFormImageUrl(p.images[0] || "");
    setFormShortDesc(p.short_description);
    setFormPreset(p.three_d_preset || "kanchipuram");
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        subcategory: formSubcategory,
        base_price: Number(formPrice),
        compare_price: Number(formComparePrice),
        fabric: formFabric,
        color: formColor,
        color_code: formColorCode,
        sku: formSku,
        stock: Number(formStock),
        images: [formImageUrl, ...editingProduct.images.slice(1)],
        short_description: formShortDesc,
        three_d_preset: formPreset
      });
    } else {
      addProduct({
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formCategory,
        subcategory: formSubcategory,
        base_price: Number(formPrice),
        compare_price: Number(formComparePrice),
        fabric: formFabric,
        color: formColor,
        color_code: formColorCode,
        sku: formSku,
        stock: Number(formStock),
        images: [formImageUrl],
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

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Handloom Piece</span>
        </button>
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
                        src={product.images[0]}
                        alt=""
                        className="h-12 w-10 shrink-0 rounded-lg object-cover"
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
                    <span className="block text-[10px] text-stone-400 mt-0.5">{product.subcategory}</span>
                  </td>

                  <td className="p-4 text-stone-300">
                    <p className="line-clamp-1">{product.fabric}</p>
                    <p className="text-[10px] text-stone-500">{product.color}</p>
                  </td>

                  <td className="p-4 font-bold text-white">
                    Rs. {product.base_price.toLocaleString("en-IN")}
                    {product.compare_price && (
                      <span className="block text-[10px] text-stone-500 line-through">
                        Rs. {product.compare_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`font-bold ${product.stock <= 5 ? "text-rose-400" : "text-stone-300"}`}>
                      {product.stock} units
                    </span>
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
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#1f1b27] p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="saree">Saree Couture</option>
                    <option value="chudar">Chudar & Salwar Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Subcategory</label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="e.g. Kanchipuram Silk / Anarkali Suits"
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300">Base Price (Rs.)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Compare Price (Rs.)</label>
                  <input
                    type="number"
                    value={formComparePrice}
                    onChange={(e) => setFormComparePrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Stock Quantity</label>
                  <input
                    type="number"
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
                <label className="block font-semibold text-stone-300">High-Resolution Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
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
