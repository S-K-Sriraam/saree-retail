"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldAlert, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  Search,
  LogOut
} from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const { 
    cartCount, 
    wishlist, 
    currentUser, 
    adminUser, 
    logoutCustomer, 
    logoutAdmin,
    setIsCartDrawerOpen 
  } = useBoutique();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sareeDropdownOpen, setSareeDropdownOpen] = useState(false);
  const [chudarDropdownOpen, setChudarDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md transition">
      {/* Top Privilege Announcement Bar */}
      <div className="bg-[#100d14] px-4 py-2 text-center text-xs font-medium tracking-wider text-amber-200/90 border-b border-amber-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden items-center gap-1.5 sm:flex text-amber-300/80">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Handcrafted Heritage Weaves</span>
          </div>

          <div className="mx-auto flex items-center gap-2">
            <span>Festive Celebration: Use Code <strong className="text-amber-300 font-bold tracking-widest">SILK2026</strong> for 15% OFF</span>
            <span className="hidden md:inline text-amber-400/40">&bull;</span>
            <span className="hidden md:inline">Complimentary Heirloom Box</span>
          </div>

          {/* Quick Dual Auth Links */}
          <div className="flex items-center gap-3 text-[11px]">
            {adminUser ? (
              <Link 
                href="/admin" 
                className="flex items-center gap-1 text-amber-400 font-semibold hover:underline"
              >
                <ShieldAlert className="h-3 w-3" /> Admin Console
              </Link>
            ) : (
              <Link 
                href="/admin/login" 
                className="flex items-center gap-1 text-amber-300/70 hover:text-amber-200 transition"
              >
                <ShieldAlert className="h-3 w-3" /> Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Boutique Navbar */}
      <div className="border-b border-amber-900/10 bg-[#faf7f2]/95 shadow-sm transition">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-800 hover:bg-amber-100/50 lg:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Boutique Brand Logo */}
          <Link href="/" className="group flex flex-col items-center">
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-serif-luxury sm:text-3xl group-hover:text-amber-900 transition">
              Geethvarnam
            </span>
            <span className="text-[10px] tracking-[0.3em] font-semibold text-amber-700 uppercase -mt-0.5">
              Silk & Couture Boutique
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link 
              href="/" 
              className={`text-sm font-medium transition hover:text-amber-700 ${
                pathname === "/" ? "text-amber-800 font-semibold" : "text-stone-700"
              }`}
            >
              Home
            </Link>

            {/* Saree Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSareeDropdownOpen(true)}
              onMouseLeave={() => setSareeDropdownOpen(false)}
            >
              <Link
                href="/products?category=saree"
                className={`flex items-center gap-1 text-sm font-medium transition hover:text-amber-700 ${
                  pathname?.includes("category=saree") ? "text-amber-800 font-semibold" : "text-stone-700"
                }`}
              >
                <span>Saree Couture</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {sareeDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-2xl border border-amber-900/10 bg-white p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 border-b border-amber-100">
                    Saree Collections
                  </div>
                  <div className="mt-1 space-y-0.5 text-sm">
                    <Link
                      href="/products?category=saree&fabric=Pure+Mulberry+Silk"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Kanchipuram Pure Silk
                    </Link>
                    <Link
                      href="/products?category=saree&fabric=Katan+Silk"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Banarasi Kadwa Brocade
                    </Link>
                    <Link
                      href="/products?category=saree&fabric=Tissue+Organza"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Pastel Tissue Organza
                    </Link>
                    <Link
                      href="/products?category=saree&fabric=Viscose+Chiffon"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Chiffon Chikankari
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Chudar Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setChudarDropdownOpen(true)}
              onMouseLeave={() => setChudarDropdownOpen(false)}
            >
              <Link
                href="/products?category=chudar"
                className={`flex items-center gap-1 text-sm font-medium transition hover:text-amber-700 ${
                  pathname?.includes("category=chudar") ? "text-amber-800 font-semibold" : "text-stone-700"
                }`}
              >
                <span>Chudar & Salwars</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {chudarDropdownOpen && (
                <div className="absolute top-full left-0 w-64 rounded-2xl border border-amber-900/10 bg-white p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 border-b border-amber-100">
                    Chudar & Salwar Suits
                  </div>
                  <div className="mt-1 space-y-0.5 text-sm">
                    <Link
                      href="/products?category=chudar&sub=Anarkali+Suits"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Royal Anarkali Suit Sets
                    </Link>
                    <Link
                      href="/products?category=chudar&sub=Straight+Cut+Salwar"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Chanderi Straight Salwars
                    </Link>
                    <Link
                      href="/products?category=chudar&sub=Palazzo+Suits"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Georgette Palazzo Suits
                    </Link>
                    <Link
                      href="/products?category=chudar&sub=Sharara"
                      className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Banarasi Sharara & Gharara
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3D Drape Experience Link */}
            <Link 
              href="/#drape-studio" 
              className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-50/80 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              <span>3D Drape Studio</span>
            </Link>

            <Link 
              href="/products" 
              className={`text-sm font-medium transition hover:text-amber-700 ${
                pathname === "/products" ? "text-amber-800 font-semibold" : "text-stone-700"
              }`}
            >
              All Creations
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center rounded-full border border-amber-300 bg-white px-3 py-1.5 shadow-sm">
                  <Search className="h-4 w-4 text-stone-400 mr-2" />
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Search sarees, chudars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                    autoFocus
                    className="w-36 text-xs text-stone-800 outline-none sm:w-48"
                  />
                  <button suppressHydrationWarning onClick={() => setSearchOpen(false)} className="text-stone-400 hover:text-stone-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  suppressHydrationWarning
                  onClick={() => setSearchOpen(true)}
                  className="rounded-full p-2 text-stone-700 hover:bg-amber-100/60 transition"
                  title="Search Boutique"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/account#wishlist"
              className="relative rounded-full p-2 text-stone-700 hover:bg-amber-100/60 transition"
              title="Saved Wishlist"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              suppressHydrationWarning
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1.5 text-stone-900 transition hover:bg-amber-100 shadow-sm"
              title="View Cart"
            >
              <ShoppingBag className="h-5 w-5 text-amber-800" />
              <span className="hidden text-xs font-semibold sm:inline">Bag</span>
              {mounted && cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Auth Button */}
            {mounted && currentUser ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-stone-800 transition"
                >
                  <User className="h-3.5 w-3.5 text-amber-300" />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(" ")[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-stone-800 transition"
              >
                <User className="h-3.5 w-3.5 text-amber-300" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-amber-900/10 bg-[#faf7f2] p-6 lg:hidden animate-in slide-in-from-top-4">
          <div className="space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-stone-800"
            >
              Home
            </Link>
            <div className="border-t border-amber-200/50 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Saree Couture</p>
              <div className="mt-2 space-y-2 pl-2 text-sm text-stone-600">
                <Link href="/products?category=saree" onClick={() => setMobileMenuOpen(false)} className="block">
                  All Sarees
                </Link>
                <Link href="/products?category=saree&fabric=Pure+Mulberry+Silk" onClick={() => setMobileMenuOpen(false)} className="block">
                  Kanchipuram Silk
                </Link>
                <Link href="/products?category=saree&fabric=Katan+Silk" onClick={() => setMobileMenuOpen(false)} className="block">
                  Banarasi Brocade
                </Link>
                <Link href="/products?category=saree&fabric=Tissue+Organza" onClick={() => setMobileMenuOpen(false)} className="block">
                  Tissue Organza
                </Link>
              </div>
            </div>

            <div className="border-t border-amber-200/50 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Chudar & Salwars</p>
              <div className="mt-2 space-y-2 pl-2 text-sm text-stone-600">
                <Link href="/products?category=chudar" onClick={() => setMobileMenuOpen(false)} className="block">
                  All Chudar Sets
                </Link>
                <Link href="/products?category=chudar&sub=Anarkali+Suits" onClick={() => setMobileMenuOpen(false)} className="block">
                  Anarkali Sets
                </Link>
                <Link href="/products?category=chudar&sub=Straight+Cut+Salwar" onClick={() => setMobileMenuOpen(false)} className="block">
                  Chanderi Straight Salwars
                </Link>
              </div>
            </div>

            <div className="border-t border-amber-200/50 pt-3 space-y-2">
              <Link
                href="/#drape-studio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-amber-900"
              >
                <Sparkles className="h-4 w-4 text-amber-600" /> 3D Drape Studio
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-stone-800"
              >
                View Full Catalog
              </Link>
            </div>

            <div className="border-t border-amber-200/50 pt-4 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between bg-amber-100/50 p-3 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-600">{currentUser.email}</p>
                  </div>
                  <button onClick={logoutCustomer} className="text-xs text-rose-700 font-semibold">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-stone-900 p-2.5 text-center text-xs font-semibold text-white"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-stone-300 bg-white p-2.5 text-center text-xs font-semibold text-stone-800"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-[#16141a] p-2.5 text-center text-xs font-semibold text-amber-300"
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Boutique Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
