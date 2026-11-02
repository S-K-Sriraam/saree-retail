"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  RotateCcw,
  Layers,
  ChevronDown,
  Plus
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { BOUTIQUE_CATEGORIES, FABRICS_LIST } from "@/lib/mock-data";
import ProductCard from "@/components/ui/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { products, adminUser } = useBoutique();

  const initialCat = searchParams.get("category") || "all";
  const initialFabric = searchParams.get("fabric") || "All Fabrics";
  const initialSub = searchParams.get("sub") || "";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedFabric, setSelectedFabric] = useState<string>(initialFabric);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSub);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync params if URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const fab = searchParams.get("fabric");
    if (fab) setSelectedFabric(fab);
    const sub = searchParams.get("sub");
    if (sub) setSelectedSubcategory(sub);
    const srch = searchParams.get("search");
    if (srch) setSearchQuery(srch);
  }, [searchParams]);

  // Dynamic available fabrics based on live products + curated classics
  const availableFabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const clean = p.fabric?.trim().replace(/\s+/g, " ");
      if (clean) set.add(clean);
    });
    // Curated classics for rich catalog navigation
    [
      "Pure Soft Silk",
      "Banarasi Silk",
      "Kanchipuram Pure Silk",
      "Katan Silk",
      "Pure Sheer Tissue Organza",
      "Pure Viscose Chiffon",
      "Pure Chanderi Silk"
    ].forEach((f) => set.add(f));

    return ["All Fabrics", ...Array.from(set)];
  }, [products]);

  // Dynamic Saree Subcategories with item counts
  const sareeSubcategories = useMemo(() => {
    const counts: Record<string, number> = {};
    products
      .filter((p) => p.category === "saree")
      .forEach((p) => {
        const sub = p.subcategory?.trim().replace(/\s+/g, " ") || "Soft Silk";
        counts[sub] = (counts[sub] || 0) + 1;
      });

    // Curated baseline subcategories
    const defaults = ["Soft Silk", "Banarasi Silk", "Kanchipuram Silk", "Organza Sarees", "Chiffon & Georgette"];
    defaults.forEach((d) => {
      if (!(d in counts)) counts[d] = 0;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  // Dynamic Chudar Subcategories with item counts
  const chudarSubcategories = useMemo(() => {
    const counts: Record<string, number> = {};
    products
      .filter((p) => p.category === "chudar")
      .forEach((p) => {
        const sub = p.subcategory?.trim().replace(/\s+/g, " ") || "Chudar Sets";
        counts[sub] = (counts[sub] || 0) + 1;
      });

    const defaults = ["Anarkali Suits", "Straight Cut Salwar", "Palazzo Suits", "Sharara & Gharara Sets"];
    defaults.forEach((d) => {
      if (!(d in counts)) counts[d] = 0;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  // Top active subcategories for quick-pill header bar
  const topActiveSubcategories = useMemo(() => {
    const activeSaree = sareeSubcategories.filter((s) => s.count > 0).map((s) => s.name);
    const activeChudar = chudarSubcategories.filter((c) => c.count > 0).map((c) => c.name);
    const combined = [...activeSaree, ...activeChudar];
    const fallback = ["Soft Silk", "Banarasi Silk", "Kanchipuram Silk", "Anarkali Suits", "Organza Sarees"];
    return Array.from(new Set([...combined, ...fallback])).slice(0, 6);
  }, [sareeSubcategories, chudarSubcategories]);

  // Max price cap calculated from inventory
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 30000;
    const maxVal = Math.max(...products.map((p) => p.base_price));
    return Math.max(30000, Math.ceil(maxVal / 5000) * 5000);
  }, [products]);

  // Filtered and sorted products with normalized matching
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        // Subcategory filter with fuzzy token matching
        if (selectedSubcategory) {
          const prodSub = (p.subcategory || "").toLowerCase().replace(/\s+/g, " ");
          const prodName = p.name.toLowerCase().replace(/\s+/g, " ");
          const prodFab = p.fabric.toLowerCase().replace(/\s+/g, " ");
          const targetSub = selectedSubcategory.toLowerCase().replace(/\s+/g, " ");
          const subTokens = targetSub.split(" ").filter((t) => t.length > 2);
          const matches =
            prodSub.includes(targetSub) ||
            targetSub.includes(prodSub) ||
            (subTokens.length > 0 && subTokens.every((t) => prodSub.includes(t) || prodName.includes(t) || prodFab.includes(t)));
          if (!matches) {
            return false;
          }
        }
        // Fabric filter with normalized matching
        if (selectedFabric !== "All Fabrics") {
          const prodFab = p.fabric.toLowerCase().replace(/\s+/g, " ");
          const targetFab = selectedFabric.toLowerCase().replace(/\s+/g, " ");
          const fabTokens = targetFab.split(" ").filter((t) => t.length > 3 && !["pure", "silk", "fabric"].includes(t));
          const matches =
            prodFab.includes(targetFab) ||
            targetFab.includes(prodFab) ||
            (fabTokens.length > 0 && fabTokens.some((t) => prodFab.includes(t)));
          if (!matches) {
            return false;
          }
        }
        // Price filter
        if (p.base_price > priceRange) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesFabric = p.fabric.toLowerCase().includes(q);
          const matchesSub = (p.subcategory || "").toLowerCase().includes(q);
          const matchesColor = p.color.toLowerCase().includes(q);
          if (!matchesName && !matchesFabric && !matchesSub && !matchesColor) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.base_price - b.base_price;
        if (sortBy === "price_desc") return b.base_price - a.base_price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubcategory, selectedFabric, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedFabric("All Fabrics");
    setSelectedSubcategory("");
    setSearchQuery("");
    setPriceRange(50000);
    setSortBy("featured");
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Header Banner */}
      <div className="border-b border-amber-900/10 bg-gradient-to-b from-[#18141e] to-[#0e0b12] py-14 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5" /> Handloom & Couture Collection
          </span>
          <h1 className="mt-3 text-3xl font-bold font-serif-luxury sm:text-5xl text-white">
            {selectedCategory === "saree"
              ? "Saree Couture Gallery"
              : selectedCategory === "chudar"
              ? "Chudar & Salwar Suite"
              : "All Boutique Creations"}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs text-stone-400 sm:text-sm">
            Handwoven silk sarees and tailored festive chudars crafted with pure gold zari and artisan needlework.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Category Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSubcategory("");
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedCategory === "all"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              All Creations ({products.length})
            </button>

            <button
              onClick={() => {
                setSelectedCategory("saree");
                setSelectedSubcategory("");
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedCategory === "saree" && !selectedSubcategory
                  ? "bg-amber-800 text-white shadow-sm"
                  : "border border-amber-300/80 bg-white text-stone-700 hover:bg-amber-50"
              }`}
            >
              Sarees Only ({products.filter((p) => p.category === "saree").length})
            </button>

            <button
              onClick={() => {
                setSelectedCategory("chudar");
                setSelectedSubcategory("");
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedCategory === "chudar" && !selectedSubcategory
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "border border-emerald-300/80 bg-white text-stone-700 hover:bg-emerald-50"
              }`}
            >
              Chudars & Salwars Only ({products.filter((p) => p.category === "chudar").length})
            </button>

            {/* Quick subcategory pills */}
            {topActiveSubcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubcategory(sub);
                  const isChudar = chudarSubcategories.some((c) => c.name === sub && c.count > 0);
                  if (isChudar) setSelectedCategory("chudar");
                  else setSelectedCategory("saree");
                }}
                className={`hidden md:inline-block rounded-full px-3.5 py-2 text-xs transition ${
                  selectedSubcategory === sub
                    ? "bg-stone-900 text-white font-bold"
                    : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Sort and Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="hidden text-xs text-stone-500 sm:inline">Sort By:</label>
              <select
                id="sort-select"
                suppressHydrationWarning
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 outline-none shadow-sm focus:border-amber-600"
              >
                <option value="featured">Featured Curations</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              suppressHydrationWarning
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-8 flex gap-8">
          {/* Left Sidebar Filter (Desktop) */}
          <aside className="hidden w-64 shrink-0 lg:block space-y-6">
            <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Refine Creations
                </h3>
                <button
                  suppressHydrationWarning
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Search in sidebar */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Search Handlooms
                </label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-stone-400" />
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search silk, zari..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pr-3 pl-8 text-xs outline-none focus:border-amber-600"
                  />
                  {searchQuery && (
                    <button
                      suppressHydrationWarning
                      onClick={() => setSearchQuery("")}
                      className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Fabric Filter */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Authentic Fabric Weave
                </label>
                <select
                  suppressHydrationWarning
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-600"
                >
                  {availableFabrics.map((fab) => (
                    <option key={fab} value={fab}>{fab}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                  <span>Price Cap</span>
                  <span className="text-amber-900 font-bold">Up to Rs. {priceRange.toLocaleString("en-IN")}</span>
                </div>
                <input
                  suppressHydrationWarning
                  type="range"
                  min="500"
                  max={maxProductPrice}
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Rs. 500</span>
                  <span>Rs. {maxProductPrice.toLocaleString("en-IN")}+</span>
                </div>
              </div>

              {/* Saree & Chudar Subcategory Links */}
              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                  Saree Subcategories
                </p>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {sareeSubcategories.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => {
                        setSelectedCategory("saree");
                        setSelectedSubcategory(name);
                      }}
                      className={`flex items-center justify-between w-full text-left transition ${
                        selectedSubcategory === name ? "font-bold text-amber-900" : "hover:text-stone-900"
                      }`}
                    >
                      <span>&bull; {name}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          {count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  Chudar Subcategories
                </p>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {chudarSubcategories.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => {
                        setSelectedCategory("chudar");
                        setSelectedSubcategory(name);
                      }}
                      className={`flex items-center justify-between w-full text-left transition ${
                        selectedSubcategory === name ? "font-bold text-emerald-900" : "hover:text-stone-900"
                      }`}
                    >
                      <span>&bull; {name}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {(selectedCategory !== "all" || selectedSubcategory || selectedFabric !== "All Fabrics" || searchQuery) && (
              <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-100/50 p-3 text-xs">
                <span className="font-semibold text-amber-900">Active Filters:</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-stone-800 shadow-sm">
                    Category: {selectedCategory.toUpperCase()}
                    <button onClick={() => setSelectedCategory("all")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-stone-800 shadow-sm">
                    {selectedSubcategory}
                    <button onClick={() => setSelectedSubcategory("")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedFabric !== "All Fabrics" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-stone-800 shadow-sm">
                    Fabric: {selectedFabric}
                    <button onClick={() => setSelectedFabric("All Fabrics")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-stone-800 shadow-sm">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                <button onClick={resetFilters} className="ml-auto font-bold text-amber-800 hover:underline">
                  Clear All
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-amber-900/20 bg-white p-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-800">
                  <Sparkles className="h-8 w-8 text-amber-700 animate-pulse" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900 font-serif-luxury">
                  {products.length === 0
                    ? "Inaugural Handloom Drops Under Curation"
                    : "No boutique creations matched your criteria"}
                </h3>
                <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
                  {products.length === 0
                    ? "Our artisans are weaving the first real-time handloom collection. Check back shortly!"
                    : "Try adjusting your price range, fabric selection, or category filters to explore our handlooms."}
                </p>
                {products.length === 0 && adminUser ? (
                  <Link
                    href="/admin/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add First Product to Inventory (Admin)</span>
                  </Link>
                ) : (
                  <button
                    suppressHydrationWarning
                    onClick={resetFilters}
                    className="mt-6 rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Refine Creations
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Search Handlooms
              </label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search silk, zari..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pr-3 pl-8 text-xs outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Fabric */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Authentic Fabric Weave
              </label>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-600"
              >
                {availableFabrics.map((fab) => (
                  <option key={fab} value={fab}>{fab}</option>
                ))}
              </select>
            </div>

            {/* Price Cap */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Price Cap</span>
                <span className="text-amber-900 font-bold">Up to Rs. {priceRange.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="500"
                max={maxProductPrice}
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Rs. 500</span>
                <span>Rs. {maxProductPrice.toLocaleString("en-IN")}+</span>
              </div>
            </div>

            {/* Saree Subcategories */}
            <div className="border-t border-stone-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                Saree Subcategories
              </p>
              <div className="space-y-1.5 text-xs text-stone-600">
                {sareeSubcategories.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedCategory("saree");
                      setSelectedSubcategory(name);
                      setMobileFilterOpen(false);
                    }}
                    className={`flex items-center justify-between w-full text-left transition ${
                      selectedSubcategory === name ? "font-bold text-amber-900" : "hover:text-stone-900"
                    }`}
                  >
                    <span>&bull; {name}</span>
                    {count > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chudar Subcategories */}
            <div className="border-t border-stone-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Chudar Subcategories
              </p>
              <div className="space-y-1.5 text-xs text-stone-600">
                {chudarSubcategories.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedCategory("chudar");
                      setSelectedSubcategory(name);
                      setMobileFilterOpen(false);
                    }}
                    className={`flex items-center justify-between w-full text-left transition ${
                      selectedSubcategory === name ? "font-bold text-emerald-900" : "hover:text-stone-900"
                    }`}
                  >
                    <span>&bull; {name}</span>
                    {count > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-2 border-t border-stone-100">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full rounded-xl border border-stone-300 py-2.5 text-xs font-semibold text-stone-700"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-xl bg-stone-900 py-2.5 text-xs font-bold text-white shadow"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-xs">Loading boutique gallery...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
