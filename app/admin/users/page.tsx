"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Edit3, 
  UserPlus, 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  X, 
  Save, 
  Filter, 
  RefreshCw,
  Check,
  Shield,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useBoutique, UserProfile } from "@/lib/store";

export default function AdminUsersPage() {
  const { allUsers, updateAnyUserProfile, refreshUsers, adminUser } = useBoutique();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin">("all");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit User Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editRole, setEditRole] = useState<"customer" | "admin">("customer");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editPreferences, setEditPreferences] = useState<string[]>([]);

  // Add User Form State
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<"customer" | "admin">("customer");

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshUsers();
    setIsRefreshing(false);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
    setEditPassword("");
    setEditRole(user.role || "customer");
    setEditStreet(user.address?.street || "");
    setEditCity(user.address?.city || "");
    setEditState(user.address?.state || "");
    setEditPincode(user.address?.pincode || "");
    setEditPreferences(user.preferences || ["Saree Couture", "Kanchipuram Silk"]);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    await updateAnyUserProfile(editingUser.id || editingUser.email, {
      name: editName.trim(),
      phone: editPhone.trim(),
      ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
      role: editRole,
      preferences: editPreferences,
      address: {
        street: editStreet.trim(),
        city: editCity.trim(),
        state: editState.trim(),
        pincode: editPincode.trim()
      }
    });
    setIsSaving(false);
    setEditingUser(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setIsSaving(true);

    const newUser: UserProfile = {
      id: `${addRole}-${Date.now().toString(36)}`,
      name: addName.trim() || addEmail.split("@")[0],
      email: addEmail.trim().toLowerCase(),
      phone: addPhone.trim(),
      password: addPassword.trim() || undefined,
      role: addRole,
      preferences: ["Saree Couture", "Kanchipuram Silk"],
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      address: {}
    };

    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      await refreshUsers();
    } catch (err) {
      console.warn("Create user error:", err);
    }

    setIsSaving(false);
    setIsAddUserModalOpen(false);
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddPassword("");
    setAddRole("customer");
  };

  const togglePreference = (pref: string) => {
    setEditPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (u.name || "").toLowerCase().includes(q);
        const matchesEmail = (u.email || "").toLowerCase().includes(q);
        const matchesPhone = (u.phone || "").toLowerCase().includes(q);
        const matchesCity = (u.address?.city || "").toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone || matchesCity;
      }
      return true;
    });
  }, [allUsers, roleFilter, searchQuery]);

  const customerCount = allUsers.filter(u => u.role === "customer").length;
  const adminCount = allUsers.filter(u => u.role === "admin").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Connoisseur Registry & IAM
          </span>
          <h1 className="mt-1 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            User Directory & Customer Management ({allUsers.length})
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Manage VIP customer profiles, update contact addresses, configure privileges, and edit executive admin roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-white transition"
            title="Refresh Profiles from Database"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User / Staff</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Total Registered</span>
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white font-serif-luxury">
            {allUsers.length} Users
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            Live accounts synced with Supabase
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">VIP Connoisseurs</span>
            <UserCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white font-serif-luxury">
            {customerCount} Customers
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            Registered boutique shoppers
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Executive Admins</span>
            <ShieldCheck className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white font-serif-luxury">
            {adminCount} Admins
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            Authorized management team
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#14111a] p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoleFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "all" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            All Accounts ({allUsers.length})
          </button>
          <button
            onClick={() => setRoleFilter("customer")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "customer" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            Customers ({customerCount})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              roleFilter === "admin" ? "bg-amber-500 text-stone-950" : "text-stone-400 hover:text-white"
            }`}
          >
            Admins ({adminCount})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-64 sm:w-80 rounded-xl border border-white/15 bg-white/5 py-1.5 pr-3 pl-8 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#14111a] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 bg-white/5">
                <th className="p-4 font-semibold">User Identity</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Contact Phone</th>
                <th className="p-4 font-semibold">Saved Destination</th>
                <th className="p-4 font-semibold">Style Preferences</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-stone-400">
                    <Users className="mx-auto h-8 w-8 text-amber-500/50 mb-2 animate-pulse" />
                    <p className="font-bold text-stone-200 text-sm">No users matched your search criteria.</p>
                    <p className="text-stone-500 mt-1">Try searching for a different name, email, or reset your role filter.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = adminUser?.email === user.email;
                  return (
                    <tr key={user.id || user.email} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/30 text-amber-300 font-bold text-sm">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-white">{user.name || "Client"}</p>
                              {isCurrent && (
                                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {user.role === "admin" ? "🛡️ Admin" : "VIP Customer"}
                        </span>
                      </td>

                      <td className="p-4 text-stone-300">
                        {user.phone ? (
                          <span>{user.phone}</span>
                        ) : (
                          <span className="text-stone-600 italic">Not provided</span>
                        )}
                      </td>

                      <td className="p-4 text-stone-300">
                        {user.address?.city ? (
                          <div>
                            <p className="font-medium text-white">{user.address.city}, {user.address.state || "IN"}</p>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{user.address.street || user.address.pincode}</p>
                          </div>
                        ) : (
                          <span className="text-stone-600 italic">No address saved</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(user.preferences || ["Saree Couture"]).slice(0, 2).map((pref) => (
                            <span key={pref} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-stone-300">
                              {pref}
                            </span>
                          ))}
                          {(user.preferences?.length || 0) > 2 && (
                            <span className="text-[10px] text-stone-500">
                              +{user.preferences!.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-stone-400 text-[11px]">
                        {user.joinedDate || "Recent"}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
                          title="Edit User Details"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Edit User Details
                </h2>
                <p className="text-xs text-stone-400">
                  Modifying account record for {editingUser.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Contact Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-stone-300">Account Email ID</label>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      <Lock className="h-3 w-3 text-amber-400" /> Permanent &bull; Cannot change
                    </span>
                  </div>
                  <input
                    type="email"
                    disabled
                    value={editEmail}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-stone-500 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300">Account Role & Privileges</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#1f1b27] p-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="customer">VIP Customer</option>
                    <option value="admin">Administrator Staff</option>
                  </select>
                </div>
              </div>

              {/* Security & Password Reset */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-400" /> Reset User Account Password
                  </label>
                  <span className="text-[10px] text-stone-400">Leave blank to keep existing password</span>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password to reset (optional)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 pr-9 text-white outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-white"
                  >
                    {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Address Fields */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-amber-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Saved Shipping & Dispatch Address
                </h4>

                <div>
                  <label className="block font-semibold text-stone-300">Street / Apartment</label>
                  <input
                    type="text"
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    placeholder="e.g. 108 Royal Silks Lane"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300">State</label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      placeholder="e.g. Tamil Nadu"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editPincode}
                      onChange={(e) => setEditPincode(e.target.value)}
                      placeholder="600001"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Style Preferences */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <label className="block font-semibold text-stone-300">Curated Style Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Saree Couture",
                    "Chudar & Salwar",
                    "Kanchipuram Silk",
                    "Banarasi Silk",
                    "Tissue Organza",
                    "Anarkali Suits",
                    "Velvet Salwar"
                  ].map((pref) => {
                    const selected = editPreferences.includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => togglePreference(pref)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "bg-amber-500 text-stone-950 shadow"
                            : "border border-white/20 bg-white/5 text-stone-300 hover:bg-white/10"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}{pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
                  <span>{isSaving ? "Saving..." : "Save User Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Add User or Staff
                </h2>
                <p className="text-xs text-stone-400">
                  Manually provision a customer or admin account
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Phone Number</label>
                <input
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Role Designation</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#1f1b27] p-2.5 text-white outline-none focus:border-amber-400"
                >
                  <option value="customer">VIP Customer</option>
                  <option value="admin">Executive Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-300">Initial Account Password (Optional)</label>
                <input
                  type="password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="Set default password"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-stone-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-2 font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isSaving ? "Creating..." : "Provision Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
