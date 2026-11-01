"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "@/lib/mock-data";
import { useBoutique } from "@/lib/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useBoutique();
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Available color choices for this garment
  const availableColors = React.useMemo(() => {
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

  const [activeColor, setActiveColor] = useState<string>(product.color || "Default");
  const [colorImageOverride, setColorImageOverride] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  const isOutOfStock = (product.stock ?? 1) <= 0;
  const isLowStock = !isOutOfStock && (product.stock ?? 1) <= 3;

  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)
    : 0;

  const displayImage = colorImageOverride || (isHovered && product.images[1] ? product.images[1] : product.images[0]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const matched = availableColors.find(c => c.name.toLowerCase() === activeColor.toLowerCase());
    addToCart(
      product,
      1,
      undefined,
      activeColor,
      colorImageOverride || matched?.image || product.images[0]
    );
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        isOutOfStock 
          ? "border-stone-200 opacity-90" 
          : "border-amber-900/10 hover:border-amber-400/40 hover:shadow-amber-500/5"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/products/${product.slug || product.id}`}>
          <img
            src={displayImage}
            alt={product.name}
            className={`h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105 ${
              isOutOfStock ? "grayscale-[25%] opacity-80" : ""
            }`}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-rose-700 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
              Only {product.stock} Left
            </span>
          ) : discountPercent > 0 ? (
            <span className="rounded-full bg-rose-700 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
              {discountPercent}% OFF
            </span>
          ) : null}
          {product.category === "saree" ? (
            <span className="rounded-full border border-amber-500/30 bg-amber-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-amber-200 backdrop-blur-md">
              Saree Couture
            </span>
          ) : (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200 backdrop-blur-md">
              Chudar & Salwar
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
            wishlisted
              ? "bg-rose-600 text-white shadow-md"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600"
          }`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            suppressHydrationWarning
            onClick={() => setQuickViewProduct(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-white/90 py-2.5 text-xs font-bold text-stone-900 backdrop-blur-md shadow-lg transition hover:bg-white hover:text-amber-900"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </button>

          {!isOutOfStock && (
            <button
              suppressHydrationWarning
              onClick={handleQuickAdd}
              className="flex items-center justify-center rounded-xl bg-stone-950 px-3.5 py-2.5 text-white shadow-lg transition hover:bg-amber-700"
              title="Quick Add to Bag"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Weave / Subcategory */}
        <div className="flex items-center justify-between text-xs text-amber-800">
          <span className="font-semibold">{product.subcategory || (product.category === "saree" ? "Saree Couture" : "Chudar & Salwar")}</span>
          {product.reviews_count > 0 ? (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-stone-700">{product.rating}</span>
              <span className="text-[10px] text-stone-400">({product.reviews_count})</span>
            </div>
          ) : (
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-900/10">
              Pure Handloom
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug || product.id}`} className="mt-1.5 flex-1">
          <h3 className="text-sm font-bold text-stone-900 transition hover:text-amber-800 line-clamp-2 font-serif-luxury">
            {product.name}
          </h3>
        </Link>

        {/* Fabric info */}
        <p className="mt-1 text-xs text-stone-500 line-clamp-1">{product.fabric}</p>

        {/* Color Swatch Dot Previews (Amazon Style) */}
        {availableColors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {availableColors.map((col, idx) => {
              const isActive = activeColor.toLowerCase() === col.name.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveColor(col.name);
                    if (col.image) setColorImageOverride(col.image);
                  }}
                  onMouseEnter={() => {
                    if (col.image) setColorImageOverride(col.image);
                  }}
                  onMouseLeave={() => {
                    const activeMatch = availableColors.find(c => c.name.toLowerCase() === activeColor.toLowerCase());
                    setColorImageOverride(activeMatch?.image || null);
                  }}
                  className={`h-4 w-4 rounded-full border transition-all ${
                    isActive
                      ? "ring-2 ring-amber-600 ring-offset-1 border-white scale-110 shadow-sm"
                      : "border-black/20 hover:scale-110 opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: col.color_code }}
                  title={`${col.name} (Hover/Click to preview)`}
                />
              );
            })}
            <span className="text-[10px] font-semibold text-stone-500 ml-0.5">
              {availableColors.length} colors
            </span>
          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-3 flex items-baseline justify-between border-t border-stone-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-950">
              Rs. {Number(product.base_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </span>
            {product.compare_price && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {Number(product.compare_price).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          ) : (
            <button
              suppressHydrationWarning
              onClick={handleQuickAdd}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline transition"
            >
              + Add to Bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
