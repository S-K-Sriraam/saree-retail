"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ArrowRight, ShieldCheck, Mail, LogIn, Eye, EyeOff } from "lucide-react";
import { useBoutique } from "@/lib/store";
import LuxuryMandalaParticles from "@/components/three/LuxuryMandalaParticles";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomerDirect } = useBoutique();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      loginCustomerDirect(email.trim());
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#0c0a0e] px-4 py-16 text-white overflow-hidden">
      <LuxuryMandalaParticles theme="rose" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/25 bg-[#17141d]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div>
          {/* Dual-Role Portal Switcher Tabs */}
          <div className="mb-6 flex rounded-2xl bg-white/5 p-1 border border-amber-500/20">
            <Link
              href="/auth/login"
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-2 text-center text-xs font-bold text-stone-950 shadow-md"
            >
              🛍️ Customer Sign In
            </Link>
            <Link
              href="/admin/login"
              className="flex-1 rounded-xl py-2 text-center text-xs font-bold text-stone-400 hover:text-white hover:bg-white/5 transition"
            >
              👑 Admin Portal
            </Link>
          </div>

          {/* Brand Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-400" /> Customer Connoisseur Portal
            </span>
            <h1 className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
              Customer Sign In
            </h1>
            <p className="mt-1.5 text-xs text-stone-400">
              Sign in with your email and password to access your account & orders.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Direct Login Form */}
          <form onSubmit={handleDirectLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300">Email Address *</label>
              <div className="relative mt-1.5">
                <Mail className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Account Password *</label>
              <div className="relative mt-1.5">
                <Lock className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-xs font-bold text-stone-950 transition hover:brightness-110 shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-spin" /> Signing In...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-3 text-center text-xs text-stone-400 border-t border-white/10 pt-5">
            <p>
              Don&apos;t have a boutique account?{" "}
              <Link href="/auth/register" className="font-semibold text-amber-300 hover:underline">
                Create Customer Account (with OTP)
              </Link>
            </p>
            <div>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Are you an Administrator? Switch to Admin Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
