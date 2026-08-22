"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Mail, Smartphone, ArrowRight, Sparkles, Lock } from "lucide-react";
import { useBoutique } from "@/lib/store";
import LuxuryMandalaParticles from "@/components/three/LuxuryMandalaParticles";
import OtpVerificationForm from "@/components/ui/OtpVerificationForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const { sendAuthOtp, verifyAuthOtp, clearOtpSession } = useBoutique();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeOtpCode, setActiveOtpCode] = useState<string>("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your administrator email address.");
      return;
    }
    if (!adminPasscode.trim()) {
      setError("Please enter your administrator account password.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const res = await sendAuthOtp(email, "admin", "login", {
        phone: phone || undefined,
        password: adminPasscode
      });
      if (res.success) {
        setActiveOtpCode(res.otp);
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "Failed to dispatch OTP passcode.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = (otp: string) => {
    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      const res = verifyAuthOtp(email, otp);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "OTP verification failed.");
        setIsVerifying(false);
      }
    }, 600);
  };

  const handleResendOtp = async () => {
    setError("");
    const res = await sendAuthOtp(email, "admin", "login", {
      phone: phone || undefined,
      password: adminPasscode
    });
    if (res.success) {
      setActiveOtpCode(res.otp);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#070608] px-4 py-16 text-white overflow-hidden">
      <LuxuryMandalaParticles theme="gold" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/40 bg-[#120f17]/95 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-amber-500/20">
        {step === "otp" ? (
          <OtpVerificationForm
            email={email}
            phone={phone}
            role="admin"
            actionType="login"
            activeOtpCode={activeOtpCode}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={() => {
              setStep("credentials");
              clearOtpSession();
            }}
            isLoading={isVerifying}
            errorMessage={error}
          />
        ) : (
          <div>
            {/* Admin Executive Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-amber-900/40 text-amber-300 shadow-inner">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Executive Management Portal
              </span>
              <h1 className="mt-2 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
                Admin Sign In
              </h1>
              <p className="mt-1 text-xs text-stone-400">
                Enter your admin email and mobile number to receive your secure multi-channel OTP passcode.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Email and Admin Credentials Form */}
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Administrator Email Address *
                </label>
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
                <label className="block text-xs font-medium text-stone-300">
                  Admin Mobile Number (for SMS Passcode)
                </label>
                <div className="relative mt-1.5">
                  <Smartphone className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                  <input
                    suppressHydrationWarning
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-stone-300">Admin Account Password *</label>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                  <input
                    suppressHydrationWarning
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter your administrator password"
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <button
                suppressHydrationWarning
                type="submit"
                disabled={isSending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-50"
              >
                {isSending ? (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 animate-spin" /> Dispatching Passcode to Email & Mobile...
                  </span>
                ) : (
                  <>
                    <span>Send Security OTP Passcode</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-center text-xs text-stone-400">
              <p>
                Need to create a new Administrator profile?{" "}
                <Link href="/admin/register" className="font-semibold text-amber-300 hover:underline">
                  Admin Sign Up
                </Link>
              </p>

              <div>
                <Link
                  href="/auth/login"
                  className="inline-block text-stone-400 hover:text-white transition"
                >
                  &larr; Switch to Customer Storefront Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
