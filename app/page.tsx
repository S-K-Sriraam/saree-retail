"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Award, 
  ShieldCheck, 
  Heart, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  Plus 
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import SilkFabricHero from "@/components/three/SilkFabricHero";
import SareeDrapeStudio from "@/components/three/SareeDrapeStudio";
import ProductCard from "@/components/ui/ProductCard";

export default function HomePage() {
  const { products, adminUser } = useBoutique();
  const [activeTab, setActiveTab] = useState<"all" | "saree" | "chudar">("all");
  const [heroPreviewCategory, setHeroPreviewCategory] = useState<"saree" | "chudar">("saree");

  const filteredProducts = activeTab === "all"
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab);

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* 1. HERO SECTION WITH 3D SILK SIMULATION & 2-COLUMN LUXURY SHOWCASE */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0a0a0d] text-white py-12 lg:py-16">
        {/* 3D Three.js Shimmering Silk Wave Canvas */}
        <SilkFabricHero tintColor={heroPreviewCategory === "saree" ? "#881337" : "#065f46"} />

        {/* Hero Overlay Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            
            {/* LEFT COLUMN: Attractive Handloom Visual Showcase Card */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-b from-[#1e1728]/90 via-[#150f1d]/95 to-[#0e0a14]/95 p-3.5 shadow-2xl backdrop-blur-xl group">
                
                {/* Category Switcher Pill */}
                <div className="flex rounded-2xl bg-black/50 p-1 border border-white/10 mb-3 backdrop-blur-md">
                  <button
                    onClick={() => setHeroPreviewCategory("saree")}
                    className={`flex-1 rounded-xl py-1.5 text-center text-xs font-bold transition ${
                      heroPreviewCategory === "saree"
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    👑 Saree Couture
                  </button>
                  <button
                    onClick={() => setHeroPreviewCategory("chudar")}
                    className={`flex-1 rounded-xl py-1.5 text-center text-xs font-bold transition ${
                      heroPreviewCategory === "chudar"
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    ✨ Royal Chudar
                  </button>
                </div>

                {/* Main Showcase Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-amber-500/20 shadow-inner">
                  <img
                    src={
                      heroPreviewCategory === "saree"
                        ? "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                        : "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                    }
                    alt="Geethvarnam Handloom Creation"
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 rounded-full border border-amber-400/40 bg-black/75 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                    <span>{heroPreviewCategory === "saree" ? "Kanchipuram Silkmark" : "Zardozi Anarkali Suit"}</span>
                  </div>

                  {/* Bottom Caption Pill */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-black/80 p-3.5 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold text-white font-serif-luxury text-sm">
                          {heroPreviewCategory === "saree" ? "Imperial Crimson & Gold Zari" : "Embroidered Velvet Chudar"}
                        </p>
                        <p className="text-[11px] text-amber-300/80 mt-0.5">
                          {heroPreviewCategory === "saree" ? "Pure Mulberry Silk • 6.3m Drape" : "Heavy Dupatta • Custom Tailored Cut"}
                        </p>
                      </div>
                      <Link
                        href={heroPreviewCategory === "saree" ? "/products?category=saree" : "/products?category=chudar"}
                        className="rounded-full bg-amber-500 p-2 text-stone-950 hover:bg-amber-400 transition shrink-0 shadow"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Royal Typography, Story & Actions */}
            <div className="lg:col-span-7 text-left order-1 lg:order-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Royal Ethnic Couture &bull; 2026 Collection</span>
              </div>

              {/* Luxury Serif Title */}
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-white font-serif-luxury sm:text-5xl lg:text-6xl leading-[1.15]">
                The Majesty of Pure Silks & Royal Chudars
              </h1>

              {/* Subtext */}
              <p className="mt-5 text-sm text-stone-300 leading-relaxed sm:text-base max-w-xl">
                Heirloom Kanchipuram pure zari sarees, handcrafted Banarasi brocades, and bespoke velvet Anarkali chudar sets. Curated for timeless bridal celebrations.
              </p>

              {/* Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/products?category=saree"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-7 py-3.5 text-xs font-bold text-stone-950 shadow-xl shadow-amber-500/20 transition hover:scale-105 hover:brightness-110"
                >
                  <span>Explore Saree Couture</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/products?category=chudar"
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 hover:border-white/50"
                >
                  <span>Explore Chudar & Salwars</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#drape-studio"
                  className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-[#16141a]/90 px-5 py-3.5 text-xs font-bold text-amber-300 shadow-xl transition hover:border-amber-400 hover:bg-black"
                >
                  <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>3D Virtual Drape</span>
                </a>
              </div>

              {/* Trust Highlights */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-stone-400 max-w-lg">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Award className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Silkmark</span>
                  </div>
                  <span className="text-[11px] text-stone-400">100% Pure Silks</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Custom Fits</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Artisan Tailoring</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Insured</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Global Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL COLLECTION SPOTLIGHT: SAREES VS CHUDARS */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            Curated Boutiques
          </p>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 font-serif-luxury sm:text-4xl">
            Two Pillars of Ethnic Elegance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs text-stone-600 sm:text-sm">
            Whether draping the timeless six yards or slipping into opulent tailored silhouettes, our craft celebrates you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Saree Banner Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-amber-900/15 bg-stone-900 text-white shadow-xl">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                alt="Saree Collection"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                The Saree Edit
              </span>
              <h3 className="mt-1 text-2xl font-bold font-serif-luxury sm:text-3xl text-white">
                Kanchipuram & Banarasi Silks
              </h3>
              <p className="mt-2 text-xs text-stone-300 max-w-md">
                Heirloom handloom weaves in pure mulberry silk, tissue organzas, and delicate Lucknowi chikankari chiffons.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/products?category=saree"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-stone-950 shadow hover:bg-amber-400 transition"
                >
                  <span>Explore Saree Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/products?category=saree&fabric=Pure+Mulberry+Silk"
                  className="text-xs font-semibold text-white/80 hover:text-white underline"
                >
                  Bridal Kanchipuram &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Chudar Banner Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-amber-900/15 bg-stone-900 text-white shadow-xl">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80"
                alt="Chudar Collection"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                The Chudar & Salwar Suite
              </span>
              <h3 className="mt-1 text-2xl font-bold font-serif-luxury sm:text-3xl text-white">
                Royal Anarkalis & Palazzo Sets
              </h3>
              <p className="mt-2 text-xs text-stone-300 max-w-md">
                Intricate zardozi velvet ensembles, pure Chanderi silk straight suits, and flowing georgette peplums.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/products?category=chudar"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
                >
                  <span>Explore Chudar Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/products?category=chudar&sub=Anarkali+Suits"
                  className="text-xs font-semibold text-white/80 hover:text-white underline"
                >
                  Anarkali Sets &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3D VIRTUAL DRAPE & FABRIC STUDIO SECTION */}
      <section id="drape-studio" className="bg-[#0e0c12] py-20 text-white scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Three.js 3D Virtual Atelier
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white font-serif-luxury sm:text-5xl">
              Interactive 3D Drape & Texture Studio
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-stone-400 sm:text-sm">
              Experience authentic handloom textiles in real-time WebGL. Inspect 24k gold zari borders, intricate kadwa weave reflections, and silk drape physics in full 360 degrees.
            </p>
          </div>

          {/* Three.js Interactive Component */}
          <div className="h-[620px] w-full">
            <SareeDrapeStudio />
          </div>
        </div>
      </section>

      {/* 4. TRENDING CREATIONS / CATALOG GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Handpicked Creations
            </p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900 font-serif-luxury sm:text-3xl">
              Trending Sarees & Chudars
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex rounded-2xl border border-amber-900/10 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-stone-900 text-white shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All Pieces ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("saree")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "saree"
                  ? "bg-amber-800 text-white shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sarees Only
            </button>
            <button
              onClick={() => setActiveTab("chudar")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "chudar"
                  ? "bg-emerald-800 text-white shadow"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Chudars & Salwars
            </button>
          </div>
        </div>

        {/* Product Grid or Clean Slate State */}
        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-amber-900/20 bg-white/70 p-12 text-center shadow-sm">
            <Sparkles className="mx-auto h-10 w-10 text-amber-600 animate-pulse" />
            <h3 className="mt-3 text-xl font-bold text-stone-900 font-serif-luxury">
              Curating the Inaugural Handloom Drops
            </h3>
            <p className="mt-2 text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Our master weavers in Kanchipuram and Varanasi are handcrafting the new season&apos;s pure silk sarees and bespoke festive chudars.
            </p>
            {adminUser && (
              <div className="mt-6">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add First Product to Inventory (Admin)</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900 px-8 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-amber-800"
          >
            <span>Explore All 2026 Creations</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & HERITAGE STORY */}
      <section className="border-t border-amber-900/10 bg-gradient-to-b from-[#f3eee4] to-[#faf7f2] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                The Heritage Craft
              </span>
              <h2 className="mt-2 text-3xl font-bold text-stone-900 font-serif-luxury sm:text-4xl">
                Woven in Tradition, Tailored for Royalty
              </h2>
              <p className="mt-4 text-xs text-stone-700 leading-relaxed sm:text-sm">
                Each Geethvarnam creation begins at the looms of master artisans in Kanchipuram, Varanasi, and Jaipur. From spinning pure mulberry silk threads to dipping gold zari cords, our handlooms preserve centuries of artistic devotion.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Certified Pure Silkmark Handlooms</h4>
                    <p className="text-[11px] text-stone-600">Strictly 100% natural silk certified with tamper-proof QR marks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Artisanal Zardozi & Mukaish Needlecraft</h4>
                    <p className="text-[11px] text-stone-600">Real metal wires, French knots and cutdana hand-stitched over weeks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Custom Couture Tailoring Unit</h4>
                    <p className="text-[11px] text-stone-600">Personalized blouse cuts, custom necklines & chudar fittings by master tailors.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  <span>Explore Our Handcrafted Collections</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-amber-900/15 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
                  alt="Artisanal Handloom Saree"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-amber-400/40 bg-white/95 p-5 shadow-2xl backdrop-blur-md max-w-xs">
                <p className="text-2xl font-bold text-stone-900 font-serif-luxury">30+ Years</p>
                <p className="text-xs font-medium text-amber-800">Master Handloom Legacy</p>
                <p className="text-[10px] text-stone-500 mt-1">Curating timeless ethnic luxury across heritage flagship boutiques.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOUTIQUE PILLARS OF EXCELLENCE & HERITAGE PROMISES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            The Geethvarnam Standard
          </p>
          <h2 className="mt-2 text-2xl font-bold text-stone-900 font-serif-luxury sm:text-3xl">
            Pillars of Artisanal Luxury & Royal Craft
          </h2>
          <p className="mt-2 text-xs text-stone-600 max-w-xl mx-auto">
            From the handloom shuttle to your doorstep wardrobe, every garment is crafted with zero compromise.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-stone-900 font-serif-luxury">100% Pure Silkmark</h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Certified authentic pure mulberry and katan silks with tamper-proof government QR tags.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-stone-900 font-serif-luxury">Real Gold & Silver Zari</h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Tested electroplated zari threads that retain their luminous royal sheen for generations.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-stone-900 font-serif-luxury">Bespoke Couture Tailoring</h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Master artisan tailors custom-stitch blouse cuts, fall-pico, and chudar sets to exact measurements.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-stone-900 font-serif-luxury">Insured Global Delivery</h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Dispatched in rigid velvet-lined luxury boxes with 100% transit insurance and live tracking.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
