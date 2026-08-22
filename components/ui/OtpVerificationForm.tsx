"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Sparkles, ArrowRight, RotateCcw, Lock, Mail, Smartphone } from "lucide-react";

interface OtpVerificationFormProps {
  email?: string;
  phone?: string;
  role: "customer" | "admin";
  actionType: "login" | "register";
  activeOtpCode?: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function OtpVerificationForm({
  email,
  phone,
  role,
  actionType,
  activeOtpCode,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  errorMessage = ""
}: OtpVerificationFormProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // If pasted multi-digit string
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newDigits = [...digits];
      cleanDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      if (cleanDigits.length === 6) {
        onVerify(newDigits.join(""));
      }
      return;
    }

    // Single digit input
    const clean = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    // Auto-advance to next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (clean && index === 5 && newDigits.every((d) => d !== "")) {
      onVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = digits.join("");
    if (fullOtp.length === 6) {
      onVerify(fullOtp);
    }
  };

  const handleResendClick = () => {
    setTimeLeft(60);
    setDigits(["", "", "", "", "", ""]);
    onResend();
    inputRefs.current[0]?.focus();
  };

  const isAdmin = role === "admin";

  return (
    <div className="w-full text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Security Header */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-amber-900/40 text-amber-300 shadow-inner">
        <ShieldCheck className="h-8 w-8" />
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
        <Lock className="h-3 w-3 text-amber-400" /> Multi-Channel Two-Factor Verification
      </span>

      <h2 className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
        {isAdmin ? "Admin Security Passcode" : "Verify Your Identity"}
      </h2>

      <p className="mt-2 text-xs text-stone-300 max-w-sm mx-auto">
        A 6-digit one-time verification passcode has been dispatched:
      </p>

      {/* Dispatched Channels */}
      <div className="mt-2 flex flex-col items-center justify-center gap-1 text-xs">
        {email && (
          <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1.5 font-mono text-emerald-300 font-bold">
            <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
            <span>{phone}</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300 animate-shake">
          {errorMessage}
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <form onSubmit={handleManualSubmit} className="mt-6 space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              suppressHydrationWarning
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="h-12 w-11 sm:h-14 sm:w-12 rounded-2xl border border-white/20 bg-white/5 text-center text-xl font-bold text-white shadow-inner outline-none transition focus:border-amber-400 focus:bg-amber-500/10 focus:ring-2 focus:ring-amber-400/30"
            />
          ))}
        </div>

        <button
          suppressHydrationWarning
          type="submit"
          disabled={digits.join("").length !== 6 || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin" /> Verifying Passcode...
            </span>
          ) : (
            <>
              <span>Verify OTP & Complete {actionType === "register" ? "Registration" : "Sign In"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend & Back controls */}
      <div className="mt-6 flex flex-col gap-3 text-xs text-stone-400">
        <div className="flex items-center justify-center gap-1.5">
          <span>Didn&apos;t receive the code?</span>
          {timeLeft > 0 ? (
            <span className="font-semibold text-stone-500">Resend in {timeLeft}s</span>
          ) : (
            <button
              suppressHydrationWarning
              onClick={handleResendClick}
              className="flex items-center gap-1 font-bold text-amber-300 hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Resend OTP Code
            </button>
          )}
        </div>

        <button
          suppressHydrationWarning
          onClick={onBack}
          className="text-stone-400 hover:text-white transition underline underline-offset-4"
        >
          &larr; Change Details
        </button>
      </div>
    </div>
  );
}
