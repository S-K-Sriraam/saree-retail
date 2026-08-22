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
  ExternalLink
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";

export default function AccountPage() {
  const router = useRouter();
  const { 
    currentUser, 
    logoutCustomer, 
    orders, 
    wishlist, 
    products, 
    addToCart 
  } = useBoutique();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "addresses" | "vip">("orders");

  // If not logged in, prompt user to sign in
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#faf7f2] py-20 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-amber-900/15 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/60 text-amber-800">
            <User className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-stone-900 font-serif-luxury">
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
              Sign In with Email & OTP
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
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          Status: {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progress Timeline */}
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

        {/* TAB 3: VIP REWARDS */}
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
    </main>
  );
}
