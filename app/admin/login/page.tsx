"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, ArrowRight, Sparkles, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useBoutique } from "@/lib/store";
import LuxuryMandalaParticles from "@/components/three/LuxuryMandalaParticles";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdminDirect } = useBoutique();

  const [email, setEmail] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your administrator email address.");
      return;
    }
    if (!adminPasscode.trim()) {
      setError("Please enter your administrator account password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      loginAdminDirect(email.trim());
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate administrator.");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#070608] px-4 py-16 text-white overflow-hidden">
      <LuxuryMandalaParticles theme="gold" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/40 bg-[#120f17]/95 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-amber-500/20">
        <div>
          {/* Dual-Role Portal Switcher */}
          <div className="mb-6 flex rounded-2xl bg-white/5 p-1 border border-amber-500/20">
            <Link
              href="/auth/login"
              className="flex-1 rounded-xl py-2 text-center text-xs font-bold text-stone-400 hover:text-white hover:bg-white/5 transition"
            >
              🛍️ Customer Sign In
            </Link>
            <Link
              href="/admin/login"
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-2 text-center text-xs font-bold text-stone-950 shadow-md"
            >
              👑 Admin Portal
            </Link>
          </div>

          {/* Admin Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-amber-900/40 p-1 shadow-xl">
              <img
                src="/images/logo.jpeg"
                alt="Geethavarnam Logo"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
              Executive Management Portal
            </span>
            <h1 className="mt-2 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">Admin Sign In</h1>
            <p className="mt-1 text-xs text-stone-400">Enter your administrative credentials to sign in directly.</p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Direct Admin Login Form */}
          <form onSubmit={handleDirectAdminLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300">Administrator Email Address *</label>
              <div className="relative mt-1.5">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Admin Account Password *</label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter your administrator password"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-10 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-stone-500 hover:text-amber-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              suppressHydrationWarning
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-spin" /> Verifying Executive Access...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-center text-xs text-stone-400">
            <p>
              Need to create a new Administrator profile?{" "}
              <Link href="/admin/register" className="font-semibold text-amber-300 hover:underline">
                Admin Sign Up (with OTP)
              </Link>
            </p>
            <div>
              <Link href="/auth/login" className="inline-block text-stone-400 hover:text-white transition">
                &larr; Switch to Customer Storefront Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
