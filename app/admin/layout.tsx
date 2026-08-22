"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  ExternalLink, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  Lock
} from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, logoutAdmin } = useBoutique();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login or register pages, just render children directly
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>;
  }

  // If not logged in as Admin, show an executive auth gate with direct sign in
  if (!adminUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070608] px-4 py-16 text-white">
        <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#120f17] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-500/20 text-amber-300">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white font-serif-luxury">
            Admin Authentication Required
          </h2>
          <p className="mt-2 text-xs text-stone-400">
            Please log in with your administrative email to verify security OTP and access the boutique management suite.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/admin/login"
              className="block w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 text-xs font-bold text-stone-950 shadow hover:brightness-110"
            >
              Sign In with Admin Email & OTP
            </Link>

            <Link
              href="/admin/register"
              className="block w-full rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-stone-300 hover:bg-white/10"
            >
              Register New Admin Profile
            </Link>

            <Link
              href="/"
              className="inline-block text-xs text-stone-500 hover:text-white pt-2"
            >
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Stock", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders & Delivery", href: "/admin/orders", icon: Package },
    { label: "Categories & Weaves", href: "/admin/categories", icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a090d] text-stone-200">
      {/* Mobile Top Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 bg-[#120f17] p-4 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <span className="font-bold text-white font-serif-luxury">Admin Console</span>
        </div>
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-stone-300">
          {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex-col justify-between border-r border-amber-500/20 bg-[#100d15] p-6 transition-transform md:static md:translate-x-0 ${
        mobileNavOpen ? "translate-x-0 flex" : "-translate-x-full md:flex hidden"
      }`}>
        <div className="space-y-8">
          {/* Brand */}
          <Link href="/admin" className="block">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-serif-luxury">Geethvarnam</h1>
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block -mt-1">
                  Executive Suite
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-stone-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-stone-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Storefront link */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="rounded-2xl bg-white/5 p-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">Live Storefront Active</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">{adminUser.email}</p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> View Public Store
            </span>
            <span>&rarr;</span>
          </Link>

          <button
            onClick={() => {
              logoutAdmin();
              router.push("/admin/login");
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Admin Suite</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
