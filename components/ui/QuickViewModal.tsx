"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Heart, Star, Sparkles, Check, ArrowRight } from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWishlisted } = useBoutique();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [customStitching, setCustomStitching] = useState<boolean>(false);
  const [fallPico, setFallPico] = useState<boolean>(true);
  const [bottomStyle, setBottomStyle] = useState<string>("Chudar");

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
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
      product.color
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
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center"
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
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === idx ? "border-amber-600 shadow" : "border-transparent opacity-70"
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
            <span className="font-semibold uppercase tracking-wider">{product.subcategory}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.reviews_count} reviews)</span>
            </div>
          </div>

          <h2 className="mt-2 text-xl font-bold text-stone-900 font-serif-luxury sm:text-2xl">
            {product.name}
          </h2>

          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            {product.short_description}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-stone-950">
              Rs. {product.base_price.toLocaleString("en-IN")}
            </span>
            {product.compare_price && (
              <span className="text-sm text-stone-400 line-through">
                Rs. {product.compare_price.toLocaleString("en-IN")}
              </span>
            )}
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Inclusive of GST & Silkmark
            </span>
          </div>

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
              <div className="flex items-center rounded-xl border border-stone-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm font-bold text-stone-600 hover:text-black"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm font-bold text-stone-600 hover:text-black"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-amber-800"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Bag</span>
              </button>

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
