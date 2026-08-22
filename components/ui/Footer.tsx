"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, Heart, Mail } from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useBoutique();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast("Welcome to Geethvarnam VIP Connoisseur Circle! 15% promo sent.");
    setEmail("");
  };

  return (
    <footer className="border-t border-amber-900/20 bg-[#0d0b10] text-stone-300">
      {/* Heritage Quality Badges */}
      <div className="border-b border-white/10 bg-[#141119] px-6 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Pure Silk Mark</h4>
              <p className="text-[11px] text-stone-400">Authentic handloom certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bespoke Stitching</h4>
              <p className="text-[11px] text-stone-400">Custom blouse & chudar fits</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Insured Express Delivery</h4>
              <p className="text-[11px] text-stone-400">Free shipping across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-stone-400">Hassle-free boutique guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white font-serif-luxury tracking-tight">
                Geethvarnam
              </span>
              <span className="block text-[10px] tracking-[0.3em] font-semibold text-amber-400 uppercase">
                Haute Couture Indian Boutique
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              Celebrating centuries of timeless Indian craft. From heirloom Kanchipuram bridal silks and Varanasi brocades to bespoke zardozi Anarkalis and artisanal chudars.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/80">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Flagship Showrooms: Chennai &bull; Bengaluru &bull; Hyderabad &bull; Varanasi</span>
            </div>
          </div>

          {/* Saree Collections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">Saree Collections</h5>
            <ul className="mt-4 space-y-2 text-xs text-stone-400">
              <li><Link href="/products?category=saree&fabric=Pure+Mulberry+Silk" className="hover:text-amber-300 transition">Kanchipuram Pure Silk</Link></li>
              <li><Link href="/products?category=saree&fabric=Katan+Silk" className="hover:text-amber-300 transition">Banarasi Kadwa Brocade</Link></li>
              <li><Link href="/products?category=saree&fabric=Tissue+Organza" className="hover:text-amber-300 transition">Tissue Organza Sarees</Link></li>
              <li><Link href="/products?category=saree&fabric=Viscose+Chiffon" className="hover:text-amber-300 transition">Lucknowi Chikankari Chiffon</Link></li>
              <li><Link href="/#drape-studio" className="text-amber-400 hover:underline">3D Virtual Saree Drape</Link></li>
            </ul>
          </div>

          {/* Chudar Collections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">Chudar & Salwars</h5>
            <ul className="mt-4 space-y-2 text-xs text-stone-400">
              <li><Link href="/products?category=chudar&sub=Anarkali+Suits" className="hover:text-amber-300 transition">Royal Anarkali Suit Sets</Link></li>
              <li><Link href="/products?category=chudar&sub=Straight+Cut+Salwar" className="hover:text-amber-300 transition">Chanderi Straight Salwars</Link></li>
              <li><Link href="/products?category=chudar&sub=Palazzo+Suits" className="hover:text-amber-300 transition">Festive Palazzo Chudar</Link></li>
              <li><Link href="/products?category=chudar&sub=Sharara" className="hover:text-amber-300 transition">Banarasi Sharara Sets</Link></li>
              <li><Link href="/products?category=chudar" className="hover:text-amber-300 transition">Custom Tailored Suits</Link></li>
            </ul>
          </div>

          {/* VIP Club & Dual Portals */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">VIP Privileges</h5>
            <p className="mt-3 text-xs text-stone-400">Subscribe for secret festive drops & bespoke styling.</p>
            {subscribed ? (
              <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                ✨ Thank you! Check your inbox for the VIP 15% promo code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-amber-400"
                />
                <button
                  suppressHydrationWarning
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-xs font-bold text-stone-950 transition hover:brightness-110 shadow"
                >
                  Join VIP Circle
                </button>
              </form>
            )}

            {/* Quick Access Portals */}
            <div className="mt-6 border-t border-white/10 pt-4 flex flex-col gap-1.5 text-xs">
              <Link href="/auth/login" className="text-stone-400 hover:text-white transition">
                Customer Account Login
              </Link>
              <Link href="/admin/login" className="flex items-center gap-1 text-amber-400/90 hover:text-amber-300 transition font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Boutique Admin Console
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; 2026 Geethvarnam Silk & Chudar Boutique. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-amber-400/80">
              <Heart className="h-3.5 w-3.5 fill-amber-400" /> Handcrafted with Heritage Pride
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
