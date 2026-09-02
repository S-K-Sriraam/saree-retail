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
  Users,
  Edit3,
  Save,
  Phone,
  UserCheck,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, logoutAdmin, updateAdminProfile } = useBoutique();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);

  // Admin Edit Form State
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openAdminEdit = () => {
    if (!adminUser) return;
    setAdminName(adminUser.name || "");
    setAdminPhone(adminUser.phone || "");
    setAdminPassword("");
    setAdminConfirmPassword("");
    setAdminPasswordError("");
    setIsEditAdminModalOpen(true);
  };

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;

    if (adminPassword) {
      if (adminPassword.length < 4) {
        setAdminPasswordError("Password must be at least 4 characters.");
        return;
      }
      if (adminPassword !== adminConfirmPassword) {
        setAdminPasswordError("Passwords do not match.");
        return;
      }
    }

    setAdminPasswordError("");
    setIsSaving(true);
    await updateAdminProfile({
      name: adminName.trim(),
      phone: adminPhone.trim(),
      ...(adminPassword.trim() ? { password: adminPassword.trim() } : {})
    });
    setIsSaving(false);
    setIsEditAdminModalOpen(false);
  };

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
    { label: "Users & Connoisseurs", href: "/admin/users", icon: Users },
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
                <h1 className="text-base font-bold text-white font-serif-luxury">Geethavarnam</h1>
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

        {/* Bottom Sidebar Info & Profile Edit */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="rounded-2xl bg-white/5 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white">{adminUser.name}</span>
              </div>
              <button
                onClick={openAdminEdit}
                className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                title="Edit Admin Details"
              >
                <Edit3 className="h-3 w-3" /> Edit
              </button>
            </div>
            <p className="text-[10px] text-stone-400 truncate">{adminUser.email}</p>
            {adminUser.phone && (
              <p className="text-[10px] text-stone-500">{adminUser.phone}</p>
            )}
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

      {/* Edit Admin Profile Modal */}
      {isEditAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setIsEditAdminModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Edit Admin Profile
                </h2>
                <p className="text-xs text-stone-400">
                  Update your executive staff details
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-300">Admin Display Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Sriram Curator"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-300">Admin Email ID</label>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    <Lock className="h-3 w-3 text-amber-400" /> Permanent &bull; Cannot be changed
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={adminUser.email}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-stone-500 cursor-not-allowed font-medium opacity-80"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Contact Mobile Phone</label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Password Section */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-400" /> Change Administrator Password
                  </label>
                  <span className="text-[10px] text-stone-400">Leave blank to keep current</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400">New Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setAdminPasswordError("");
                        }}
                        placeholder="New password"
                        className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 pr-9 text-white outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-white"
                      >
                        {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400">Confirm Password</label>
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      value={adminConfirmPassword}
                      onChange={(e) => {
                        setAdminConfirmPassword(e.target.value);
                        setAdminPasswordError("");
                      }}
                      placeholder="Repeat password"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {adminPasswordError && (
                  <p className="text-xs text-rose-400 font-semibold bg-rose-950/40 border border-rose-500/30 p-2 rounded-xl">
                    {adminPasswordError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditAdminModalOpen(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-stone-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-2 font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save Admin Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
