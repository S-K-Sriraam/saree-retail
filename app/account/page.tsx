"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Award, 
  Sparkles, 
  LogOut, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShoppingBag, 
  ExternalLink,
  AlertTriangle,
  XCircle,
  AlertCircle,
  X,
  Ban,
  Edit3,
  Check,
  Save,
  Phone,
  Mail,
  Home,
  Lock,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { Order } from "@/lib/mock-data";
import ProductCard from "@/components/ui/ProductCard";

export default function AccountPage() {
  const router = useRouter();
  const { 
    currentUser, 
    logoutCustomer, 
    updateCustomerProfile,
    orders, 
    cancelOrder,
    wishlist, 
    products, 
    addToCart 
  } = useBoutique();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile" | "vip">("orders");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editPreferences, setEditPreferences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const openEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.name || "");
    setEditPhone(currentUser.phone || "");
    setEditPassword("");
    setEditConfirmPassword("");
    setPasswordError("");
    setEditStreet(currentUser.address?.street || "");
    setEditCity(currentUser.address?.city || "");
    setEditState(currentUser.address?.state || "");
    setEditPincode(currentUser.address?.pincode || "");
    setEditPreferences(currentUser.preferences || ["Saree Couture", "Kanchipuram Silk"]);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (editPassword) {
      if (editPassword.length < 4) {
        setPasswordError("Password must be at least 4 characters.");
        return;
      }
      if (editPassword !== editConfirmPassword) {
        setPasswordError("Passwords do not match. Please recheck.");
        return;
      }
    }

    setPasswordError("");
    setIsSaving(true);
    await updateCustomerProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      ...(editPassword ? { password: editPassword } : {}),
      preferences: editPreferences,
      address: {
        street: editStreet.trim(),
        city: editCity.trim(),
        state: editState.trim(),
        pincode: editPincode.trim()
      }
    });
    setIsSaving(false);
    setIsEditModalOpen(false);
  };

  const togglePreference = (pref: string) => {
    setEditPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  // If not logged in, prompt user to sign in
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#faf7f2] py-20 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-amber-900/15 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-900/15 bg-white p-1 shadow-md">
            <img
              src="/images/logo.jpeg"
              alt="Geethavarnam Logo"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 font-serif-luxury">
            Customer Connoisseur Portal
          </h1>
          <p className="mt-2 text-xs text-stone-600">
            Please sign in with your email address to view your orders, live tracking, and saved handloom wishlist.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-xs font-bold text-stone-950 shadow hover:brightness-110"
            >
              Sign In with Email & Password
            </Link>

            <Link
              href="/auth/register"
              className="block w-full rounded-xl border border-stone-300 py-3 text-xs font-bold text-stone-800 hover:bg-stone-50"
            >
              Create New Customer Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "processing": return 2;
      case "handcrafted": return 3;
      case "shipped": return 4;
      case "delivered": return 5;
      case "cancelled": return 0;
      default: return 2;
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Profile Header */}
      <div className="border-b border-amber-900/10 bg-gradient-to-r from-[#17131d] via-[#100d14] to-[#17131d] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-amber-900/40 text-amber-300 text-2xl font-bold font-serif-luxury shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif-luxury text-white">
                    {currentUser.name}
                  </h1>
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    VIP Connoisseur
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {currentUser.email} &bull; Member since {currentUser.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openEditModal}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile Details</span>
              </button>

              <button
                onClick={() => {
                  logoutCustomer();
                  router.push("/auth/login");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-white transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-amber-900/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 ${
              activeTab === "orders"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Active Orders & Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 ${
              activeTab === "wishlist"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Saved Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 ${
              activeTab === "profile"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <User className="h-4 w-4" />
            <span>My Profile & Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab("vip")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 ${
              activeTab === "vip"
                ? "bg-stone-900 text-white shadow"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>VIP Rewards & Privileges</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-stone-400" />
                <h3 className="mt-3 text-base font-bold text-stone-900 font-serif-luxury">No Orders Placed Yet</h3>
                <p className="mt-1 text-xs text-stone-500">Explore our handloom creations to place your first bespoke order.</p>
                <Link href="/products" className="mt-4 inline-block rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white">
                  Explore Catalog
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const step = getStatusStep(order.status);
                const isCancelled = order.status === "cancelled";
                const isDispatched = order.status === "shipped" || order.status === "delivered";
                const canCancel = !isCancelled && !isDispatched;

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm sm:p-8 space-y-6"
                  >
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                          Reference: {order.orderNumber}
                        </span>
                        <h3 className="text-base font-bold text-stone-900">
                          Placed on {order.date} &bull; Total: Rs. {Math.round(order.total).toLocaleString("en-IN")}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          isCancelled
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "shipped"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          Status: {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progress Timeline or Cancelled State */}
                    {isCancelled ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-800 flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        <div>
                          <p className="font-bold text-rose-900">Order Cancelled</p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            As per policy, 100% refund processing has been initiated to your original payment method.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-xs font-semibold text-stone-700 mb-4">
                          Live Handcraft & Delivery Milestones:
                        </p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[
                            { title: "Confirmed", desc: "Payment Approved" },
                            { title: "Handcrafting", desc: "Artisan Finishing" },
                            { title: "Dispatched", desc: "Air Courier Transit" },
                            { title: "Delivered", desc: "Doorstep Received" }
                          ].map((m, idx) => {
                            const isDone = step >= idx + 1;
                            const isCurrent = step === idx + 1;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                  isDone
                                    ? "bg-amber-700 text-white"
                                    : "bg-stone-200 text-stone-500"
                                }`}>
                                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                </div>
                                <span className={`mt-2 text-xs font-bold ${isCurrent ? "text-amber-900" : "text-stone-700"}`}>
                                  {m.title}
                                </span>
                                <span className="text-[10px] text-stone-400 hidden sm:inline">{m.desc}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Policy Banner & Cancel Action */}
                    {!isCancelled && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-amber-50/90 border border-amber-300/80 p-3.5 text-xs text-amber-950 shadow-sm">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-amber-900">
                              Order Cancellation Policy:
                            </p>
                            <p className="text-[11px] text-amber-800 font-semibold mt-0.5 leading-relaxed">
                              &ldquo;Cancel order before shipping the product else no refund will be done...&rdquo;
                            </p>
                          </div>
                        </div>

                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => setOrderToCancel(order)}
                            className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-400 transition shadow-sm shrink-0"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <span className="rounded-lg bg-stone-200/80 px-2.5 py-1 text-[10px] font-bold text-stone-600 shrink-0">
                            Dispatched (Non-Cancellable)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Order items */}
                    <div className="border-t border-stone-100 pt-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 p-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="h-14 w-12 rounded-xl object-cover" />
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 font-serif-luxury">{item.productName}</h4>
                              <p className="text-[11px] text-stone-500">Qty: {item.quantity} &bull; {item.customization?.size || "Standard"}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-stone-900">
                            Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer tracking info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-amber-700" />
                        <span>Tracking: <strong>{order.trackingNumber}</strong> &bull; Estimated: <strong>{order.estimatedDelivery}</strong></span>
                      </div>
                      <span>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.pincode}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="mt-8">
            {wishlistedProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Heart className="mx-auto h-12 w-12 text-stone-400" />
                <h3 className="mt-3 text-base font-bold text-stone-900 font-serif-luxury">No Saved Handlooms</h3>
                <p className="mt-1 text-xs text-stone-500">Save pieces to your boutique wishlist to track prices and availability.</p>
                <Link href="/products" className="mt-4 inline-block rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white">
                  Browse Creations
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY PROFILE & ADDRESSES */}
        {activeTab === "profile" && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Account Personal Details Card */}
              <div className="rounded-3xl border border-amber-900/15 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/60 text-amber-800">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-serif-luxury">Personal Details</h3>
                      <p className="text-[11px] text-stone-500">Your Connoisseur account identity</p>
                    </div>
                  </div>

                  <button
                    onClick={openEditModal}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-600/30 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="block text-[11px] text-stone-400 font-medium">Full Legal Name</span>
                    <span className="font-bold text-stone-900 text-sm">{currentUser.name}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-stone-400 font-medium">Email Address (Registered Login)</span>
                    <span className="font-semibold text-stone-800">{currentUser.email}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-stone-400 font-medium">Primary Contact Phone</span>
                    <span className="font-semibold text-stone-800">
                      {currentUser.phone || <em className="text-stone-400 not-italic">No phone added yet &bull; Click Edit to add</em>}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-stone-400 font-medium">Membership Tier</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 mt-1">
                      <Sparkles className="h-3 w-3 text-amber-600" /> VIP Connoisseur (Joined {currentUser.joinedDate})
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="rounded-3xl border border-amber-900/15 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/60 text-amber-800">
                      <Home className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 font-serif-luxury">Primary Delivery Address</h3>
                      <p className="text-[11px] text-stone-500">Default dispatch destination for orders</p>
                    </div>
                  </div>

                  <button
                    onClick={openEditModal}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-600/30 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Update</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {currentUser.address?.street || currentUser.address?.city ? (
                    <div className="space-y-2 rounded-2xl bg-stone-50 p-4 border border-stone-200">
                      <p className="font-bold text-stone-900">{currentUser.name}</p>
                      <p className="text-stone-600">{currentUser.address.street}</p>
                      <p className="text-stone-600">
                        {[currentUser.address.city, currentUser.address.state].filter(Boolean).join(", ")}
                        {currentUser.address.pincode && ` - ${currentUser.address.pincode}`}
                      </p>
                      {currentUser.phone && (
                        <p className="text-[11px] text-stone-500 pt-1">Phone: {currentUser.phone}</p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-center">
                      <MapPin className="mx-auto h-8 w-8 text-stone-400 mb-2" />
                      <p className="font-bold text-stone-800 text-xs">No Shipping Address Saved</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Add your address for faster 1-click checkout.</p>
                      <button
                        onClick={openEditModal}
                        className="mt-3 inline-flex items-center gap-1 rounded-xl bg-stone-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
                      >
                        + Add Delivery Address
                      </button>
                    </div>
                  )}

                  {/* Style Preferences */}
                  <div className="border-t border-stone-100 pt-4">
                    <span className="block text-[11px] text-stone-400 font-medium mb-2">Artisan & Style Preferences</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(currentUser.preferences && currentUser.preferences.length > 0
                        ? currentUser.preferences
                        : ["Saree Couture", "Kanchipuram Silk"]
                      ).map((pref) => (
                        <span key={pref} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VIP REWARDS */}
        {activeTab === "vip" && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-amber-900/10 p-6 shadow-sm">
              <Sparkles className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-base font-bold text-stone-900 font-serif-luxury">Connoisseur Points</h3>
              <p className="text-3xl font-bold text-amber-900 mt-2">1,850 Pts</p>
              <p className="text-xs text-stone-600 mt-1">Worth Rs. 1,850 on your next bridal silk purchase.</p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <Award className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-base font-bold text-stone-900 font-serif-luxury">Tier Privileges</h3>
              <p className="text-sm font-bold text-stone-900 mt-1">Royal Emerald Tier</p>
              <ul className="mt-2 text-xs text-stone-600 space-y-1">
                <li>&bull; Complimentary Fall & Pico stitching</li>
                <li>&bull; Free insured air shipping on all orders</li>
                <li>&bull; Priority preview of Diwali & Wedding drops</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <User className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-base font-bold text-stone-900 font-serif-luxury">Personal Stylist</h3>
              <p className="text-xs text-stone-600 mt-2">
                Need bespoke color customization or blouse consultations? Reach our master weaver concierge directly.
              </p>
              <a
                href="https://wa.me/919845012345"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-800 underline"
              >
                <span>WhatsApp Stylist Concierge</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Edit Customer Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-amber-900/20 bg-white p-6 sm:p-8 text-stone-900 shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-stone-900">
                  Edit Connoisseur Profile
                </h2>
                <p className="text-xs text-stone-500">
                  Update your contact details, delivery address, and style preferences.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Radhika Sundaram"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700">Contact Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Email Address - Permanent */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-700">Account Email ID</label>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                    <Lock className="h-3 w-3 text-stone-400" /> Permanent Login ID &bull; Cannot be changed
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-100 p-2.5 text-stone-500 cursor-not-allowed font-medium opacity-80"
                />
              </div>

              {/* Password Change Section */}
              <div className="border-t border-stone-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Security & Account Password
                  </h4>
                  <span className="text-[10px] text-stone-400">Leave blank to keep current password</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700">New Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => {
                          setEditPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter new password (optional)"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 pr-9 text-stone-900 outline-none focus:border-amber-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                      >
                        {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700">Confirm New Password</label>
                    <input
                      type={showEditPassword ? "text" : "password"}
                      value={editConfirmPassword}
                      onChange={(e) => {
                        setEditConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Repeat new password"
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 p-2 rounded-xl">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Address Fields */}
              <div className="border-t border-stone-100 pt-4 space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Primary Delivery Destination
                </h4>

                <div>
                  <label className="block font-semibold text-stone-700">Street Address / Apartment</label>
                  <input
                    type="text"
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    placeholder="e.g. 42, Lotus Villa, 4th Cross, Indiranagar"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700">State</label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      placeholder="e.g. Karnataka"
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editPincode}
                      onChange={(e) => setEditPincode(e.target.value)}
                      placeholder="560038"
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-stone-900 outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Style Preferences */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <label className="block font-semibold text-stone-700">Preferred Handloom Styles</label>
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
                            ? "bg-amber-800 text-white shadow"
                            : "border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}{pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-stone-950 px-6 py-2 font-bold text-white shadow hover:bg-amber-800 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-rose-300 bg-white p-6 sm:p-8 text-stone-900 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setOrderToCancel(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 mx-auto shadow-inner">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-center text-xl font-bold font-serif-luxury text-stone-900">
              Cancel Order {orderToCancel.orderNumber}?
            </h3>

            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-900 space-y-2">
              <p className="font-bold text-rose-950 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                Cancellation & Refund Notice:
              </p>
              <p className="font-semibold text-rose-800 leading-relaxed bg-white/60 p-2 rounded-xl border border-rose-200/60">
                &ldquo;Cancel order before shipping the product else no refund will be done...&rdquo;
              </p>
              <p className="text-[11px] text-rose-700">
                Your order is currently <strong>{orderToCancel.status.toUpperCase()}</strong> (prior to shipping dispatch). Cancelling now will initiate a 100% full refund back to your original payment method within 3-5 business days.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="flex-1 rounded-xl border border-stone-300 bg-white py-3 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
              >
                Keep My Order
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelOrder(orderToCancel.id);
                  setOrderToCancel(null);
                }}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
