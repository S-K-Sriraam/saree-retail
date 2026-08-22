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
import { INITIAL_REVIEWS } from "@/lib/mock-data";
import SareeDrapeStudio from "@/components/three/SareeDrapeStudio";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, getProductBySlug, addToCart, toggleWishlist, isWishlisted, showToast } = useBoutique();

  const product = getProductBySlug(resolvedParams.id) || products[0];
  const wishlisted = isWishlisted(product?.id || "");

  const [activeViewMode, setActiveViewMode] = useState<"gallery" | "3d_studio">("gallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      {
        type: tailoringType,
        size: selectedSize,
        blouseStitching: product.category === "saree" && tailoringType === "custom_tailored",
        fallPico: product.category === "saree" && fallPico,
        bottomStyle: product.category === "chudar" ? bottomStyle : undefined
      },
      product.color
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
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
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
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`h-24 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                          selectedImageIndex === idx
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
                <span className="font-bold uppercase tracking-wider">{product.subcategory}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-stone-900">{product.rating}</span>
                  <span className="text-stone-500">({product.reviews_count} Connoisseur Reviews)</span>
                </div>
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
                  Rs. {product.base_price.toLocaleString("en-IN")}
                </span>
                {product.compare_price && (
                  <span className="text-base text-stone-400 line-through">
                    Rs. {product.compare_price.toLocaleString("en-IN")}
                  </span>
                )}
                {savingsAmount > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    Save Rs. {savingsAmount.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-stone-500">
                Price includes 5% GST & Silkmark certification. Free express insurance included.
              </p>
            </div>

            {/* Saree vs Chudar Custom Tailoring Section */}
            <div className="rounded-2xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-5">
              {product.category === "saree" ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    1. Blouse & Drape Tailoring Service
                  </h3>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => setTailoringType("standard")}
                      className={`rounded-2xl border p-3.5 text-left text-xs transition ${
                        tailoringType === "standard"
                          ? "border-amber-600 bg-amber-50 font-bold text-amber-950 shadow-sm"
                          : "border-stone-200 text-stone-700"
                      }`}
                    >
                      <span>Unstitched Blouse Piece</span>
                      <span className="block text-[10px] font-normal text-stone-500 mt-0.5">
                        Pure silk 0.8m fabric included in saree length
                      </span>
                    </button>

                    <button
                      onClick={() => setTailoringType("custom_tailored")}
                      className={`rounded-2xl border p-3.5 text-left text-xs transition ${
                        tailoringType === "custom_tailored"
                          ? "border-amber-600 bg-amber-50 font-bold text-amber-950 shadow-sm"
                          : "border-stone-200 text-stone-700"
                      }`}
                    >
                      <span>Bespoke Tailored Blouse (+Rs. 999)</span>
                      <span className="block text-[10px] font-normal text-stone-500 mt-0.5">
                        Designer cut with padded lining & matching tassels
                      </span>
                    </button>
                  </div>

                  {tailoringType === "custom_tailored" && (
                    <div className="rounded-xl bg-amber-100/60 p-3 text-xs space-y-2 animate-in fade-in">
                      <p className="font-semibold text-amber-900">Select Standard Bust Size:</p>
                      <div className="flex gap-2">
                        {["32", "34", "36", "38", "40", "42", "44"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`h-8 w-8 rounded-lg border text-xs font-bold transition ${
                              selectedSize === sz
                                ? "border-amber-700 bg-amber-700 text-white"
                                : "border-stone-300 bg-white text-stone-700"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fall and Pico check */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="fall-check"
                      checked={fallPico}
                      onChange={(e) => setFallPico(e.target.checked)}
                      className="h-4 w-4 rounded text-amber-700 focus:ring-amber-500"
                    />
                    <label htmlFor="fall-check" className="text-xs font-medium text-stone-700">
                      Complimentary Saree Fall & Pico Interlocking (Recommended)
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    1. Select Size & Bottom Wear Styling
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
              <div className="border-t border-stone-100 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-stone-300 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:text-black"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:text-black"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-stone-800"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 py-3.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Instant Luxury Buy Now &bull; Rs. {(product.base_price * quantity).toLocaleString("en-IN")}</span>
                </button>
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
