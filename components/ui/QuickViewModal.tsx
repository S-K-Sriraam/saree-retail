"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Heart, Star, Sparkles, Check, ArrowRight } from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted } = useBoutique();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [colorImageOverride, setColorImageOverride] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [customStitching, setCustomStitching] = useState<boolean>(false);
  const [fallPico, setFallPico] = useState<boolean>(true);
  const [bottomStyle, setBottomStyle] = useState<string>("Chudar");

  const product = quickViewProduct;

  // Available Color Choices (Base + Variants)
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

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.color || "Default");
      setColorImageOverride(null);
      setSelectedImage(0);
    }
  }, [product]);

  if (!quickViewProduct || !product) return null;

  const isOutOfStock = (product.stock ?? 1) <= 0;
  const isLowStock = !isOutOfStock && (product.stock ?? 1) <= 5;
  const wishlisted = isWishlisted(product.id);

  const handleSelectColor = (colorOpt: { name: string; color_code: string; image: string }) => {
    setSelectedColor(colorOpt.name);
    if (colorOpt.image) {
      setColorImageOverride(colorOpt.image);
      const idx = product.images.indexOf(colorOpt.image);
      if (idx >= 0) setSelectedImage(idx);
    }
  };

  const handleAddToCart = () => {
    const matched = availableColors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
    const cartImg = colorImageOverride || matched?.image || product.images[selectedImage] || product.images[0];

    addToCart(
      product,
      quantity,
      {
        type: customStitching ? "custom_tailored" : "standard",
        size: selectedSize,
        blouseStitching: product.category === "saree" && customStitching,
        fallPico: product.category === "saree" && fallPico,
        bottomStyle: product.category === "chudar" ? bottomStyle : undefined
      },
      selectedColor,
      cartImg
    );
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Image Gallery */}
        <div className="flex flex-col bg-stone-100 md:w-1/2">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={colorImageOverride || product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            <span className="absolute top-4 left-4 rounded-full bg-amber-900/90 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md">
              {product.category === "saree" ? "Saree Couture" : "Chudar & Salwar Set"}
            </span>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-stone-200/60">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    setColorImageOverride(null);
                  }}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    (colorImageOverride === img || (!colorImageOverride && selectedImage === idx)) ? "border-amber-600 shadow" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details & Options */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
          <div className="flex items-center justify-between text-xs text-amber-800">
            <span className="font-semibold uppercase tracking-wider">{product.subcategory || (product.category === "saree" ? "Saree Couture" : "Chudar & Salwar")}</span>
            {product.reviews_count > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-stone-800">{product.rating}</span>
                <span className="text-stone-400">({product.reviews_count} reviews)</span>
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-900/10">
                100% Authentic Handloom
              </span>
            )}
          </div>

          <h2 className="mt-2 text-xl font-bold text-stone-900 font-serif-luxury sm:text-2xl">
            {product.name}
          </h2>

          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            {product.short_description}
          </p>

          {/* Price */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-stone-950">
              Rs. {Number(product.base_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </span>
            {product.compare_price && (
              <span className="text-sm text-stone-400 line-through">
                Rs. {Number(product.compare_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
              </span>
            )}
            {isOutOfStock ? (
              <span className="rounded-full bg-rose-100 border border-rose-300 px-3 py-0.5 text-xs font-bold text-rose-800">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                Only {product.stock} units left!
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                In Stock • Authentic Handloom
              </span>
            )}
          </div>

          {/* Color Selection (Amazon Style) */}
          {availableColors.length > 0 && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">Color:</span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-900/10">
                    {selectedColor}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">
                  {availableColors.length} available
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {availableColors.map((colorOpt, idx) => {
                  const isSelected = selectedColor.toLowerCase() === colorOpt.name.toLowerCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectColor(colorOpt)}
                      className={`flex items-center gap-2 rounded-xl border p-1.5 pr-2.5 transition-all ${
                        isSelected
                          ? "border-amber-700 bg-amber-50 shadow-sm ring-1 ring-amber-600"
                          : "border-stone-200 bg-white hover:border-amber-300"
                      }`}
                    >
                      <div className="relative h-7 w-6 shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-stone-200 shadow-sm">
                        {colorOpt.image ? (
                          <img
                            src={colorOpt.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ backgroundColor: colorOpt.color_code }}
                          />
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${
                        isSelected ? "text-amber-950" : "text-stone-700"
                      }`}>
                        {colorOpt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saree/Chudar Customization Options */}
          <div className="mt-6 space-y-4 border-t border-stone-200 pt-5">
            {product.category === "saree" ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Blouse & Drape Tailoring:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCustomStitching(false)}
                    className={`rounded-xl border p-2.5 text-left text-xs transition ${
                      !customStitching
                        ? "border-amber-600 bg-amber-50 font-bold text-amber-950"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    Unstitched Blouse Piece
                    <span className="block text-[10px] font-normal text-stone-500">Includes 0.8m pure silk fabric</span>
                  </button>

                  <button
                    onClick={() => setCustomStitching(true)}
                    className={`rounded-xl border p-2.5 text-left text-xs transition ${
                      customStitching
                        ? "border-amber-600 bg-amber-50 font-bold text-amber-950"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    Bespoke Tailored Blouse (+Rs. 999)
                    <span className="block text-[10px] font-normal text-stone-500">Padded lining & designer back</span>
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-fall"
                    checked={fallPico}
                    onChange={(e) => setFallPico(e.target.checked)}
                    className="h-4 w-4 rounded text-amber-700 focus:ring-amber-500"
                  />
                  <label htmlFor="modal-fall" className="text-xs text-stone-700">
                    Complimentary Fall & Pico Hemming (Free)
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Select Size & Bottom Style:
                </p>
                <div className="mt-2 flex gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 w-9 rounded-xl border text-xs font-bold transition ${
                        selectedSize === sz
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-stone-300 text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  {["Chudar / Salwar", "Palazzo", "Cigarette Pants"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setBottomStyle(style)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                        bottomStyle === style
                          ? "border-amber-600 bg-amber-50 text-amber-950 font-bold"
                          : "border-stone-200 text-stone-700"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4 pt-2">
              <div className={`flex items-center rounded-xl border ${isOutOfStock ? "border-stone-200 bg-stone-100 opacity-60" : "border-stone-300"}`}>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm font-bold text-stone-600 hover:text-black disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900">{isOutOfStock ? 0 : quantity}</span>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm font-bold text-stone-600 hover:text-black disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {isOutOfStock ? (
                <button
                  disabled
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-200 py-3 text-xs font-bold text-stone-500 cursor-not-allowed"
                >
                  <span>Currently Out of Stock</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-amber-800"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Shopping Bag</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  wishlisted
                    ? "border-rose-300 bg-rose-50 text-rose-600"
                    : "border-stone-300 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-rose-600" : ""}`} />
              </button>
            </div>

            {/* Full Details link */}
            <div className="pt-2 text-center">
              <Link
                href={`/products/${product.slug || product.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:underline"
              >
                <span>View Full 3D Drape & Fabric Specifications</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
