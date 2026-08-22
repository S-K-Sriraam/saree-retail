"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Smartphone, Lock, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useBoutique } from "@/lib/store";
import LuxuryMandalaParticles from "@/components/three/LuxuryMandalaParticles";
import OtpVerificationForm from "@/components/ui/OtpVerificationForm";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { sendAuthOtp, verifyAuthOtp, clearOtpSession } = useBoutique();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "Kanchipuram Silk Sarees",
    "Royal Anarkali Suits"
  ]);

  const [step, setStep] = useState<"form" | "otp">("form");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeOtpCode, setActiveOtpCode] = useState<string>("");

  const preferencesList = [
    "Kanchipuram Silk Sarees",
    "Banarasi Brocades",
    "Royal Anarkali Suits",
    "Tissue Organza Sarees",
    "Chanderi Salwar Suits",
    "Bespoke Bridal Wear"
  ];

  const togglePref = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences((prev) => prev.filter((p) => p !== pref));
    } else {
      setSelectedPreferences((prev) => [...prev, pref]);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please create an account password.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const res = await sendAuthOtp(email, "customer", "register", {
        name,
        phone,
        preferences: selectedPreferences,
        password
      });
      if (res.success) {
        setActiveOtpCode(res.otp);
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "Failed to dispatch registration OTP.");
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
        router.push("/account");
      } else {
        setError(res.error || "OTP verification failed.");
        setIsVerifying(false);
      }
    }, 600);
  };

  const handleResendOtp = async () => {
    setError("");
    const res = await sendAuthOtp(email, "customer", "register", {
      name,
      phone,
      preferences: selectedPreferences,
      password
    });
    if (res.success) {
      setActiveOtpCode(res.otp);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#0c0a0e] px-4 py-16 text-white overflow-hidden">
      <LuxuryMandalaParticles theme="rose" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-amber-500/25 bg-[#17141d]/90 p-8 shadow-2xl backdrop-blur-xl">
        {step === "otp" ? (
          <OtpVerificationForm
            email={email}
            phone={phone}
            role="customer"
            actionType="register"
            activeOtpCode={activeOtpCode}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={() => {
              setStep("form");
              clearOtpSession();
            }}
            isLoading={isVerifying}
            errorMessage={error}
          />
        ) : (
          <div>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                <Sparkles className="h-3 w-3 text-amber-400" /> VIP Connoisseur Membership
              </span>
              <h1 className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
                Create Customer Account
              </h1>
              <p className="mt-1 text-xs text-stone-400">
                Sign up to unlock handloom drops, bespoke sizing & receive your multi-channel passcode.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300">Full Name *</label>
                <div className="relative mt-1.5">
                  <User className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Email Address (for OTP) *</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                    <input
                      suppressHydrationWarning
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">Mobile (for SMS OTP) *</label>
                  <div className="relative mt-1.5">
                    <Smartphone className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                    <input
                      suppressHydrationWarning
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">Account Password *</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-3 left-3 h-4 w-4 text-stone-500" />
                  <input
                    suppressHydrationWarning
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your secure account password"
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-9 text-xs text-white placeholder-stone-600 outline-none transition focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Ethnic Style Preferences */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-amber-200">
                  Select Your Ethnic Style Passions:
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {preferencesList.map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        suppressHydrationWarning
                        type="button"
                        key={pref}
                        onClick={() => togglePref(pref)}
                        className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs transition ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/20 text-amber-300 font-semibold"
                            : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-amber-400" />}
                        <span>{pref}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                suppressHydrationWarning
                type="submit"
                disabled={isSending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-xs font-bold text-stone-950 shadow-lg transition hover:brightness-110 disabled:opacity-50"
              >
                {isSending ? (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 animate-spin" /> Dispatching Registration Passcode...
                  </span>
                ) : (
                  <>
                    <span>Send Registration OTP Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center text-xs text-stone-400 border-t border-white/10 pt-4">
              <p>
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-amber-300 hover:underline">
                  Sign In Here
                </Link>
              </p>

              <div>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Admin Personnel? Go to Admin Portal &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
