"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Check, 
  ChevronRight 
} from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useBoutique();

  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setErrorMsg("");
      setInputCode("");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Header */}
      <div className="border-b border-amber-900/10 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-amber-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-stone-900">Bespoke Shopping Bag</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-luxury sm:text-4xl">
            Bespoke Shopping Bag ({cart.length} Pieces)
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {cart.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-900/20 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100/60 text-amber-800">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-stone-900 font-serif-luxury sm:text-2xl">
              Your Shopping Bag is Currently Empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-stone-500 sm:text-sm">
              Indulge in our heirloom Kanchipuram silk sarees and royal velvet Anarkali suits.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products?category=saree"
                className="rounded-xl bg-amber-800 px-6 py-3 text-xs font-bold text-white shadow hover:bg-amber-900 transition"
              >
                Browse Sarees
              </Link>
              <Link
                href="/products?category=chudar"
                className="rounded-xl bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow hover:bg-emerald-900 transition"
              >
                Browse Chudars
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Items Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <span>Garment Details</span>
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-600 transition normal-case font-medium"
                >
                  Clear Bag
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-32 w-28 shrink-0 rounded-2xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            {item.category === "saree" ? "Saree Handloom" : "Chudar & Salwar Set"}
                          </span>
                          <h3 className="text-base font-bold text-stone-900 font-serif-luxury">
                            {item.productName}
                          </h3>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-600">
                        {item.customization?.size && (
                          <span className="rounded-lg bg-stone-100 px-2 py-0.5 font-medium">
                            Size: <strong>{item.customization.size}</strong>
                          </span>
                        )}
                        {item.customization?.bottomStyle && (
                          <span className="rounded-lg bg-stone-100 px-2 py-0.5 font-medium">
                            Style: <strong>{item.customization.bottomStyle}</strong>
                          </span>
                        )}
                        {item.customization?.blouseStitching && (
                          <span className="rounded-lg bg-amber-100 text-amber-900 px-2 py-0.5 font-medium">
                            Bespoke Tailored Blouse
                          </span>
                        )}
                        {item.customization?.fallPico && (
                          <span className="rounded-lg bg-emerald-50 text-emerald-800 px-2 py-0.5 font-medium">
                            Fall & Pico Hemmed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                      <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-sm font-bold text-stone-700 hover:text-black"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm font-bold text-stone-700 hover:text-black"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-950 sm:text-base">
                          Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-stone-400">
                            (Rs. {item.price.toLocaleString("en-IN")} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Card */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Order Summary
                </h3>

                {/* Promo Code input */}
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Privilege Code: <strong>{couponCode}</strong></span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute top-2.5 left-3 h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 py-2 pr-3 pl-9 text-xs uppercase outline-none focus:border-amber-600"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
                      >
                        Apply
                      </button>
                    </div>
                    {errorMsg && <p className="text-[11px] text-rose-600">{errorMsg}</p>}
                    <p className="text-[10px] text-stone-400">
                      Try <strong>SILK2026</strong> for 15% OFF or <strong>BOUTIQUE10</strong> for 10% OFF.
                    </p>
                  </form>
                )}

                {/* Financial breakdown */}
                <div className="space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">Rs. {cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Privilege Discount</span>
                      <span>- Rs. {cartDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Goods & Services Tax (GST 5%)</span>
                    <span>Rs. {cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Express Shipping</span>
                    <span>{cartShipping === 0 ? <strong className="text-emerald-700 font-bold uppercase">Free</strong> : `Rs. ${cartShipping}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-950">
                    <span>Total Amount</span>
                    <span>Rs. {Math.round(cartTotal).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 py-4 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  <span>Proceed to Luxury Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-700" /> 100% Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-amber-700" /> Insured Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
