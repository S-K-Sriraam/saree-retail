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

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.base_price) / product.compare_price) * 100)
    : 0;

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/products/${product.slug || product.id}`}>
          <img
            src={displayImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded-full bg-rose-700 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
              {discountPercent}% OFF
            </span>
          )}
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

          <button
            suppressHydrationWarning
            onClick={() => addToCart(product, 1)}
            className="flex items-center justify-center rounded-xl bg-stone-950 px-3.5 py-2.5 text-white shadow-lg transition hover:bg-amber-700"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Weave / Subcategory */}
        <div className="flex items-center justify-between text-xs text-amber-800">
          <span className="font-semibold">{product.subcategory}</span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-stone-700">{product.rating}</span>
            <span className="text-[10px] text-stone-400">({product.reviews_count})</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug || product.id}`} className="mt-1.5 flex-1">
          <h3 className="text-sm font-bold text-stone-900 transition hover:text-amber-800 line-clamp-2 font-serif-luxury">
            {product.name}
          </h3>
        </Link>

        {/* Fabric info */}
        <p className="mt-1 text-xs text-stone-500 line-clamp-1">{product.fabric}</p>

        {/* Price and CTA */}
        <div className="mt-3 flex items-baseline justify-between border-t border-stone-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-950">
              Rs. {product.base_price.toLocaleString("en-IN")}
            </span>
            {product.compare_price && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {product.compare_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            suppressHydrationWarning
            onClick={() => addToCart(product, 1)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline transition"
          >
            + Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
