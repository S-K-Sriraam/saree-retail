"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BoutiqueProvider, useBoutique } from "@/lib/store";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import QuickViewModal from "@/components/ui/QuickViewModal";
import { Sparkles, CheckCircle } from "lucide-react";

function GlobalToast() {
  const { toastMessage } = useBoutique();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-400/40 bg-[#16141a]/95 px-4 py-3 text-xs font-semibold text-amber-200 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
      <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
      <span>{toastMessage}</span>
    </div>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2] text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {!isAdmin && <Navbar />}
      <div className="flex-1">{children}</div>
      {!isAdmin && <Footer />}
      <CartDrawer />
      <QuickViewModal />
      <GlobalToast />
    </div>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BoutiqueProvider>
      <InnerLayout>{children}</InnerLayout>
    </BoutiqueProvider>
  );
}
