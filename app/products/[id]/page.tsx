"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award, 
  Layers, 
  ChevronRight,
  Check,
  MapPin
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import SareeDrapeStudio from "@/components/three/SareeDrapeStudio";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, getProductBySlug, addToCart, toggleWishlist, isWishlisted, showToast } = useBoutique();

  const product = getProductBySlug(resolvedParams.id) || products[0];
  const wishlisted = isWishlisted(product?.id || "");
  const isOutOfStock = (product?.stock ?? 1) <= 0;
  const isLowStock = !isOutOfStock && (product?.stock ?? 1) <= 5;

  const [activeViewMode, setActiveViewMode] = useState<"gallery" | "3d_studio">("gallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Available Color Choices (Base color + all Color Variants)
  const availableColors = React.useMemo(() => {
    if (!product) return [];
    const list: Array<{ name: string; color_code: string; image: string }> = [];
    if (product.color) {
      list.push({
        name: product.color,
        color_code: product.color_code || "#881337",
        image: product.images[0] || "/images/placeholder.jpg"
      });
    }
    if (product.color_variants && product.color_variants.length > 0) {
      product.color_variants.forEach(v => {
        if (v.name && !list.some(item => item.name.toLowerCase() === v.name.toLowerCase())) {
          list.push({
            name: v.name,
            color_code: v.color_code || "#1e3a8a",
            image: v.image || product.images[0] || "/images/placeholder.jpg"
          });
        }
      });
    }
    return list;
  }, [product]);

  const [selectedColor, setSelectedColor] = useState<string>(product?.color || "Default");

  // Keep selectedColor in sync if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.color || "Default");
      setActiveImageOverride(null);
      setSelectedImageIndex(0);
    }
  }, [product]);

  // Color selection click handler
  const handleSelectColor = (colorOpt: { name: string; color_code: string; image: string }) => {
    setSelectedColor(colorOpt.name);
    if (colorOpt.image) {
      setActiveImageOverride(colorOpt.image);
      const imgIdx = product.images.indexOf(colorOpt.image);
      if (imgIdx >= 0) setSelectedImageIndex(imgIdx);
    }
  };

  // Customization state
  const [tailoringType, setTailoringType] = useState<"unstitched" | "standard" | "custom_tailored">("standard");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [fallPico, setFallPico] = useState<boolean>(true);
  const [bottomStyle, setBottomStyle] = useState<string>("Chudar");
  const [pincode, setPincode] = useState<string>("560038");
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="min-h-screen p-20 text-center">
        <h2 className="text-xl font-bold text-stone-900">Creation Not Found</h2>
        <Link href="/products" className="mt-4 inline-block text-xs font-bold text-amber-800 underline">
          Return to Boutique Catalog
        </Link>
      </div>
    );
  }

  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)
    : 0;

  const savingsAmount = product.compare_price ? product.compare_price - product.base_price : 0;
  const currentHeroImage = activeImageOverride || product.images[selectedImageIndex] || product.images[0] || "/images/placeholder.jpg";

  const handleAddToCart = () => {
    const matchedColor = availableColors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
    const cartImage = matchedColor?.image || currentHeroImage;

    addToCart(
      product,
      quantity,
      {
        type: product.category === "saree" ? "unstitched" : tailoringType,
        size: selectedSize,
        blouseStitching: false,
        fallPico: false,
        bottomStyle: product.category === "chudar" ? bottomStyle : undefined
      },
      selectedColor,
      cartImage
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Breadcrumb */}
      <div className="border-b border-amber-900/10 bg-white px-4 py-3 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5">
          <Link href="/" className="hover:text-amber-800">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-amber-800">Creations</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/products?category=${product.category}`} className="hover:text-amber-800 capitalize">
            {product.category === "saree" ? "Saree Couture" : "Chudar & Salwars"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT: 2D Gallery & 3D Interactive Studio Switcher */}
          <div>
            {/* Mode Switcher Tabs */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex rounded-2xl border border-amber-900/15 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setActiveViewMode("gallery")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeViewMode === "gallery"
                      ? "bg-stone-900 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  High-Res Gallery
                </button>
                <button
                  onClick={() => setActiveViewMode("3d_studio")}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeViewMode === "3d_studio"
                      ? "bg-amber-800 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                  <span>3D Fabric Studio</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-amber-800">
                SKU: {product.sku}
              </span>
            </div>

            {activeViewMode === "gallery" ? (
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-amber-900/15 bg-stone-100 shadow-xl">
                  <img
                    src={currentHeroImage}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                    className="h-full w-full object-cover object-center transition-all duration-300"
                  />

                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 rounded-full bg-rose-700 px-3 py-1 text-xs font-bold text-white shadow">
                      {discountPercent}% OFF
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition ${
                      wishlisted
                        ? "bg-rose-600 text-white shadow-lg"
                        : "bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${wishlisted ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          setActiveImageOverride(null);
                        }}
                        className={`h-24 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                          currentHeroImage === img
                            ? "border-amber-600 ring-2 ring-amber-400/30"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[550px] w-full">
                <SareeDrapeStudio initialPreset={product.three_d_preset || "kanchipuram"} />
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs, Customization & Buying Box */}
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-amber-800">
                <span className="font-bold uppercase tracking-wider">{product.subcategory || (product.category === "saree" ? "Saree Couture" : "Chudar & Salwar")}</span>
                {product.reviews_count > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-stone-900">{product.rating}</span>
                    <span className="text-stone-500">({product.reviews_count} Reviews)</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-900/10">
                    ✨ 100% Authentic Handloom Silk
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-bold text-stone-900 font-serif-luxury sm:text-3xl">
                {product.name}
              </h1>

              <p className="mt-3 text-xs text-stone-600 leading-relaxed sm:text-sm">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-amber-900/15 bg-white p-5 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-stone-950">
                  Rs. {Number(product.base_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                </span>
                {product.compare_price && (
                  <span className="text-base text-stone-400 line-through">
                    Rs. {Number(product.compare_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                  </span>
                )}
                {savingsAmount > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    Save Rs. {Number(savingsAmount).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-stone-500">
                Price includes 5% GST & Silkmark certification. Free express insurance included.
              </p>

              {/* Stock Status Banner */}
              {isOutOfStock ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-800">
                  <span className="font-bold text-xs uppercase tracking-wide">Out of Stock</span>
                  <span className="text-[11px] text-rose-600">— This creation is temporarily sold out.</span>
                </div>
              ) : isLowStock ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-800">
                  <span className="font-bold text-xs">⚠️ Only {product.stock} pieces remaining!</span>
                  <span className="text-[11px] text-stone-600">Order soon before inventory depletes.</span>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock ({product.stock} units available for immediate dispatch)</span>
                </div>
              )}
            </div>

            {/* Amazon-Style Color Selection Section */}
            {availableColors.length > 0 && (
              <div className="rounded-2xl border border-amber-900/15 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Color Choice:
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-900/20 px-3 py-0.5 rounded-full">
                      {selectedColor}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {availableColors.length} {availableColors.length === 1 ? "shade available" : "shades available"}
                  </span>
                </div>

                {/* Swatch Cards (Amazon Style with mini photo + color swatch dot) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {availableColors.map((colorOpt, idx) => {
                    const isSelected = selectedColor.toLowerCase() === colorOpt.name.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectColor(colorOpt)}
                        className={`group relative flex items-center gap-2.5 rounded-2xl border-2 p-2 text-left transition-all ${
                          isSelected
                            ? "border-amber-800 bg-amber-50 shadow-md ring-2 ring-amber-500/20"
                            : "border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50/80"
                        }`}
                      >
                        {/* Mini Thumbnail or Color Swatch */}
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-200 shadow-sm">
                          {colorOpt.image && !colorOpt.image.includes("placeholder") ? (
                            <img
                              src={colorOpt.image}
                              alt={colorOpt.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="h-full w-full flex items-center justify-center"
                              style={{ backgroundColor: colorOpt.color_code }}
                            />
                          )}
                          <span
                            className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: colorOpt.color_code }}
                          />
                        </div>

                        {/* Color Name and Active State */}
                        <div className="flex-1 min-w-0 pr-1">
                          <p className={`text-xs font-bold truncate leading-tight ${
                            isSelected ? "text-amber-950" : "text-stone-800"
                          }`}>
                            {colorOpt.name}
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                            {isSelected ? "Selected ✓" : "Click to view"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Section (Chudar sizing only; Saree tailoring disabled) */}
            <div className="rounded-2xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-5">
              {product.category === "chudar" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Select Size & Bottom Wear Styling
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">
                      Standard Kurti Size:
                    </label>
                    <div className="flex gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`h-9 w-9 rounded-xl border text-xs font-bold transition ${
                            selectedSize === sz
                              ? "border-emerald-700 bg-emerald-700 text-white shadow"
                              : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">
                      Tailored Bottom Wear:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Chudar / Salwar", "Flared Palazzo", "Straight Cigarette Pants"].map((style) => (
                        <button
                          key={style}
                          onClick={() => setBottomStyle(style)}
                          className={`rounded-xl border px-3.5 py-2 text-xs transition ${
                            bottomStyle === style
                              ? "border-emerald-700 bg-emerald-50 text-emerald-950 font-bold"
                              : "border-stone-200 bg-stone-50 text-stone-700"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & Buy CTAs */}
              <div className={product.category === "chudar" ? "border-t border-stone-100 pt-5 space-y-3" : "space-y-3"}>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center rounded-xl border ${isOutOfStock ? "border-stone-200 bg-stone-100 opacity-60" : "border-stone-300 bg-white"}`}>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:text-black disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">{isOutOfStock ? 0 : quantity}</span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:text-black disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {isOutOfStock ? (
                    <button
                      disabled
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-200 py-3.5 text-xs font-bold text-stone-500 cursor-not-allowed"
                    >
                      <span>Sold Out / Out of Stock</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-stone-800"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Shopping Bag</span>
                    </button>
                  )}
                </div>

                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-200 py-3.5 text-xs font-bold text-stone-400 cursor-not-allowed"
                  >
                    <span>Creation Temporarily Unavailable</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 py-3.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Instant Luxury Buy Now &bull; Rs. {Number(product.base_price * quantity).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pincode checker */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-stone-700 font-semibold">
                  <MapPin className="h-4 w-4 text-amber-700" />
                  <span>Delivery Availability:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="w-24 rounded-lg border border-stone-300 px-2 py-1 text-center font-bold text-xs"
                  />
                  <button
                    onClick={() => {
                      setPincodeChecked(true);
                      showToast(`Express delivery available to PIN ${pincode}!`);
                    }}
                    className="rounded-lg bg-stone-900 px-3 py-1 font-bold text-white"
                  >
                    Check
                  </button>
                </div>
              </div>
              {pincodeChecked && (
                <p className="mt-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Guaranteed Delivery within 3-5 business days to {pincode}.
                </p>
              )}
            </div>

            {/* Heritage Craft Specifications Accordion / Table */}
            <div className="rounded-2xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-700" /> Authentic Craft Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Fabric Weave</span>
                  <span className="font-semibold text-stone-800">{product.fabric}</span>
                </div>
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Weaving Technique</span>
                  <span className="font-semibold text-stone-800">{product.weave_type || "Handloom Jacquard"}</span>
                </div>
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Artisanal Needlework</span>
                  <span className="font-semibold text-stone-800">{product.work_type || "Pure Zari Brocade"}</span>
                </div>
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Primary Shade</span>
                  <span className="font-semibold text-stone-800">{product.color}</span>
                </div>
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Garment Dimensions</span>
                  <span className="font-semibold text-stone-800">{product.details.length || "Standard 6.3m"}</span>
                </div>
                <div className="border-b border-stone-100 pb-2">
                  <span className="text-stone-400 block text-[11px]">Wash & Preserving Care</span>
                  <span className="font-semibold text-stone-800">{product.details.wash_care}</span>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="text-stone-400 block text-[11px]">Recommended Occasion</span>
                  <span className="font-semibold text-stone-800">{product.details.occasion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED CREATIONS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-amber-900/10 pt-16">
            <h2 className="text-2xl font-bold text-stone-900 font-serif-luxury sm:text-3xl">
              Complementary Boutique Pieces
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
