"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, Tag, Check } from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useBoutique();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 4999;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError("");
      setInputCoupon("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-[#faf7f2] shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-900/10 bg-white px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-800" />
              <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
                Bespoke Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="border-b border-amber-900/10 bg-amber-50/80 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                {remainingForFree === 0
                  ? "🎉 You have unlocked Free Insured Express Delivery!"
                  : `Add Rs. ${remainingForFree.toLocaleString("en-IN")} more for Free Delivery`}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full bg-amber-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/60 text-amber-800">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-stone-900 font-serif-luxury">
                  Your Bag is Empty
                </h3>
                <p className="mt-1 text-xs text-stone-500 max-w-xs">
                  Explore our curated silk sarees and hand-tailored chudar collections.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-6 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-amber-800 shadow"
                >
                  Explore Creations
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-amber-900/10 bg-white p-3.5 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-24 w-20 shrink-0 rounded-xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1 font-serif-luxury">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Customization Badges */}
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-stone-500">
                        {item.customization?.size && (
                          <span className="rounded bg-stone-100 px-1.5 py-0.5 font-medium">
                            Size: {item.customization.size}
                          </span>
                        )}
                        {item.customization?.bottomStyle && (
                          <span className="rounded bg-stone-100 px-1.5 py-0.5 font-medium">
                            {item.customization.bottomStyle}
                          </span>
                        )}
                        {item.customization?.blouseStitching && (
                          <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 font-medium">
                            Tailored Blouse
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="border-t border-amber-900/10 bg-white p-6 space-y-4 shadow-lg">
              {/* Promo Coupon Form */}
              {couponCode ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SILK2026)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pr-3 pl-8 text-xs uppercase outline-none focus:border-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-stone-800"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Discount</span>
                    <span>- Rs. {cartDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>Rs. {cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span>{cartShipping === 0 ? <strong className="text-emerald-700 font-bold uppercase">Free</strong> : `Rs. ${cartShipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold text-stone-950">
                  <span>Estimated Total</span>
                  <span>Rs. {Math.round(cartTotal).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 py-3.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  <span>Proceed to Luxury Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="text-center text-xs font-semibold text-stone-600 hover:text-stone-900 py-1"
                >
                  View Detailed Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
