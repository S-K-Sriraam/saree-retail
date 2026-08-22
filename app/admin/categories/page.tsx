"use client";

import React from "react";
import Link from "next/link";
import { Layers, Sparkles, Plus, ArrowRight } from "lucide-react";
import { useBoutique } from "@/lib/store";
import { BOUTIQUE_CATEGORIES, FABRICS_LIST } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  const { products } = useBoutique();

  const sarees = products.filter(p => p.category === "saree");
  const chudars = products.filter(p => p.category === "chudar");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-amber-500/20 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Classification & Weaves
        </span>
        <h1 className="mt-1 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
          Categories, Weaves & Fabric Collections
        </h1>
        <p className="mt-1 text-xs text-stone-400">
          Manage product classifications for Saree Couture and Chudar & Salwar Suite collections.
        </p>
      </div>

      {/* 2 Core Collection Pillars */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Saree Pillar */}
        <div className="rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                Core Category 01
              </span>
              <h2 className="mt-2 text-xl font-bold text-white font-serif-luxury">
                Saree Couture Collection
              </h2>
            </div>
            <span className="text-2xl font-bold text-amber-300 font-serif-luxury">
              {sarees.length} Pieces
            </span>
          </div>

          <p className="text-xs text-stone-400">
            Handcrafted six-yard handlooms including heirloom Kanchipuram bridal silks, Banarasi kadwa jaal, and pure tissue organzas.
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Active Subcollections:
            </h4>
            {[
              { name: "Kanchipuram Silk", count: sarees.filter(s => s.subcategory.includes("Kanchipuram")).length },
              { name: "Banarasi Silk", count: sarees.filter(s => s.subcategory.includes("Banarasi")).length },
              { name: "Organza Sarees", count: sarees.filter(s => s.subcategory.includes("Organza")).length },
              { name: "Chiffon & Georgette", count: sarees.filter(s => s.subcategory.includes("Chiffon")).length },
            ].map((sub) => (
              <div key={sub.name} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                <span className="font-semibold text-white">{sub.name}</span>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                  {sub.count} items live
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline pt-2"
          >
            <span>Add Saree Creation &rarr;</span>
          </Link>
        </div>

        {/* Chudar Pillar */}
        <div className="rounded-3xl border border-emerald-500/30 bg-[#14111a] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                Core Category 02
              </span>
              <h2 className="mt-2 text-xl font-bold text-white font-serif-luxury">
                Chudar & Salwar Suite
              </h2>
            </div>
            <span className="text-2xl font-bold text-emerald-300 font-serif-luxury">
              {chudars.length} Pieces
            </span>
          </div>

          <p className="text-xs text-stone-400">
            Tailored ethnic ensembles including floor-length Anarkalis, straight-cut Chanderi suits, flared palazzos, and Shararas.
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Active Subcollections:
            </h4>
            {[
              { name: "Royal Anarkali Suits", count: chudars.filter(c => c.subcategory.includes("Anarkali")).length },
              { name: "Straight Cut Salwar", count: chudars.filter(c => c.subcategory.includes("Straight")).length },
              { name: "Palazzo Suits", count: chudars.filter(c => c.subcategory.includes("Palazzo")).length },
              { name: "Sharara & Gharara Sets", count: chudars.filter(c => c.subcategory.includes("Sharara")).length },
            ].map((sub) => (
              <div key={sub.name} className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                <span className="font-semibold text-white">{sub.name}</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  {sub.count} items live
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-2"
          >
            <span>Add Chudar Creation &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Fabrics List Reference */}
      <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Certified Handloom Fabric Types
        </h3>
        <p className="text-xs text-stone-400">
          Textile foundations supported across our 3D drape simulators and inventory catalog:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {FABRICS_LIST.filter(f => f !== "All Fabrics").map((fabric) => (
            <div key={fabric} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs">
              <span className="font-bold text-white block">{fabric}</span>
              <span className="text-[10px] text-amber-400 mt-1 block">Silkmark Inspected</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}