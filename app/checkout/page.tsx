"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShoppingBag,
  ChevronRight
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { Order } from "@/lib/mock-data";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    createOrder,
    currentUser
  } = useBoutique();

  // Form State
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: { street, city, state, pincode },
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        shipping: cartShipping,
        total: cartTotal,
        paymentMethod
      });

      // Confetti burst!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f59e0b", "#881337", "#10b981"]
      });

      setPlacedOrder(order);
      setIsProcessing(false);
    }, 1200);
  };

  // If order was successfully placed, render Order Confirmation View
  if (placedOrder) {
    return (
      <main className="min-h-screen bg-[#faf7f2] py-20 px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-900/15 bg-white p-8 text-center shadow-xl sm:p-12 animate-in zoom-in-95">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> Handcrafted Heirloom Reserved
          </span>

          <h1 className="mt-3 text-3xl font-bold text-stone-900 font-serif-luxury sm:text-4xl">
            Thank You for Your Order!
          </h1>
          <p className="mt-2 text-xs text-stone-600 sm:text-sm">
            Your booking confirmation and invoice have been sent to <strong>{placedOrder.customerEmail}</strong>.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Order Reference</p>
                <p className="text-base font-bold text-amber-900">{placedOrder.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Total Paid</p>
                <p className="text-base font-bold text-stone-900">Rs. {Math.round(placedOrder.total).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Delivery Recipient</span>
                <span className="font-semibold text-stone-800">{placedOrder.customerName}</span>
                <span className="text-stone-500 block">{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.pincode}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Estimated Handcraft & Delivery</span>
                <span className="font-semibold text-emerald-800">{placedOrder.estimatedDelivery}</span>
                <span className="text-stone-500 block">Tracking: {placedOrder.trackingNumber}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account"
              className="rounded-xl bg-stone-900 px-6 py-3.5 text-xs font-bold text-white shadow hover:bg-amber-800 transition"
            >
              Track Order in Customer Portal
            </Link>
            <Link
              href="/products"
              className="rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
            >
              Continue Boutique Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf7f2] py-20 px-4 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-amber-900/15 bg-white p-8 shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-stone-400" />
          <h2 className="mt-4 text-xl font-bold text-stone-900 font-serif-luxury">No Items in Shopping Bag</h2>
          <p className="mt-2 text-xs text-stone-500">Please select a saree or chudar before proceeding to checkout.</p>
          <Link href="/products" className="mt-6 inline-block rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold text-white">
            Explore Creations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24">
      {/* Header */}
      <div className="border-b border-amber-900/10 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-amber-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cart" className="hover:text-amber-800">Bag</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-stone-900">Luxury Checkout</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-luxury sm:text-4xl">
            Bespoke Luxury Checkout
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmitOrder} className="grid gap-10 lg:grid-cols-3">
          {/* Left Columns: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-800 text-xs font-bold text-white">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
                    Delivery & Recipient Information
                  </h2>
                  <p className="text-xs text-stone-500">Heirloom packaging will be delivered to this address.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700">Email Address (Invoice & Tracking)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700">Phone (WhatsApp Courier Updates)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700">Postal PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700">Street Address & Landmark</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="House/Apartment number, building, street, landmark"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-800 text-xs font-bold text-white">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
                    Select Secure Payment Option
                  </h2>
                  <p className="text-xs text-stone-500">256-bit encrypted luxury transaction gateway.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "upi"
                      ? "border-amber-600 bg-amber-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Instant UPI & QR</h4>
                    <p className="text-[11px] text-stone-500">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "card"
                      ? "border-amber-600 bg-amber-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Credit / Debit Card</h4>
                    <p className="text-[11px] text-stone-500">Visa, Mastercard, Amex, RuPay</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "netbanking"
                      ? "border-amber-600 bg-amber-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Net Banking</h4>
                    <p className="text-[11px] text-stone-500">All major Indian banks supported</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-amber-600 bg-amber-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-stone-500">Pay upon insured doorstep delivery</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="rounded-2xl bg-amber-50 p-4 text-xs space-y-2 border border-amber-200">
                  <label className="block font-semibold text-amber-950">Enter Virtual Payment Address (UPI ID):</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full rounded-xl border border-amber-300 bg-white p-2.5 text-xs outline-none focus:border-amber-600"
                  />
                  <p className="text-[10px] text-amber-800">You will receive an instant payment request notification on your UPI app.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Order Review ({cart.length} Pieces)
              </h3>

              {/* Items preview */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 border-b border-stone-100 pb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-16 w-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900 line-clamp-1 font-serif-luxury">{item.productName}</h4>
                      <p className="text-[11px] text-stone-500">Qty: {item.quantity} &bull; {item.customization?.size || "Standard"}</p>
                      <p className="text-xs font-semibold text-stone-900 mt-1">Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost calculations */}
              <div className="space-y-2 text-xs text-stone-600">
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
                  <span>GST (5%)</span>
                  <span>Rs. {cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span>{cartShipping === 0 ? <strong className="text-emerald-700 font-bold uppercase">Free</strong> : `Rs. ${cartShipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-950">
                  <span>Final Payable Amount</span>
                  <span>Rs. {Math.round(cartTotal).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 py-4 text-xs font-bold text-white shadow-xl transition hover:brightness-110 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Authorizing Payment...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Confirm Order &bull; Rs. {Math.round(cartTotal).toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-stone-400">
                By placing order, you agree to Geethvarnam terms of bespoke handloom crafting.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
