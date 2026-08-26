"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Layers, 
  CheckCircle2,
  Award
} from "lucide-react";
import LuxuryMandalaParticles from "@/components/three/LuxuryMandalaParticles";

export default function LoginPage() {
  return (
    <main className="relative min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#0a080d] px-4 py-16 text-white overflow-hidden">
      <LuxuryMandalaParticles theme="gold" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Geethavarnam Access Gateway
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white font-serif-luxury sm:text-4xl">
            Select Your Authentication Portal
          </h1>
          <p className="mt-2 text-xs text-stone-400 max-w-md mx-auto sm:text-sm">
            Choose whether to enter as a patron customer or access the boutique administrative management console.
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 1. Customer Connoisseur Portal Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#181420] to-[#120f18] p-8 shadow-2xl backdrop-blur-xl transition hover:border-amber-500/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/20">
                  Patron & Shopper
                </span>
              </div>

              <h2 className="mt-6 text-xl font-bold text-white font-serif-luxury sm:text-2xl">
                Customer Sign In
              </h2>
              <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                Sign in to view your orders, track insured doorstep delivery, explore 3D silk drape simulations, and manage your bridal wishlist.
              </p>

              <div className="mt-6 space-y-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Real-time Multi-Channel Passcode (Email & SMS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Custom blouse tailoring & measurements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>VIP festival discounts & exclusive drops</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110"
              >
                <span>Sign In as Customer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register"
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-stone-300 hover:bg-white/10 transition"
              >
                New Customer? Create Account
              </Link>
            </div>
          </div>

          {/* 2. Executive Administrator Portal Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1b1524] to-[#140e1d] p-8 shadow-2xl backdrop-blur-xl transition hover:border-amber-400/50">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-400 border border-amber-400/30">
                  Curator & Admin
                </span>
              </div>

              <h2 className="mt-6 text-xl font-bold text-white font-serif-luxury sm:text-2xl">
                Administrator Portal
              </h2>
              <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                Executive console for boutique managers to list real handloom pieces, manage live inventory, adjust prices, and dispatch orders.
              </p>

              <div className="mt-6 space-y-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Real-time Supabase Database Inventory Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>3D Fabric simulation presets & color mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Order fulfillment & courier tracking updates</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/admin/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-400/20 transition hover:brightness-110"
              >
                <span>Enter Administrator Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/register"
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-stone-300 hover:bg-white/10 transition"
              >
                Register New Administrative Curator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
