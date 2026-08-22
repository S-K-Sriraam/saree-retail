"use client";

import React, { useState } from "react";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Filter, 
  MapPin,
  Phone,
  Mail,
  X
} from "lucide-react";
import { useBoutique } from "@/lib/store";
import { Order } from "@/lib/mock-data";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useBoutique();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus !== "all" && ord.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerEmail.toLowerCase().includes(q) ||
        ord.shippingAddress.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-amber-500/20 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Fulfillment Pipeline
        </span>
        <h1 className="mt-1 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
          Customer Orders & Delivery Logistics ({orders.length})
        </h1>
        <p className="mt-1 text-xs text-stone-400">
          Manage handloom order milestones from artisan tailoring to insured doorstep courier dispatch.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#14111a] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "pending", "processing", "handcrafted", "shipped", "delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                selectedStatus === st
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {st} {st !== "all" && `(${orders.filter(o => o.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, client, city..."
            className="w-56 sm:w-72 rounded-xl border border-white/15 bg-white/5 py-1.5 pr-3 pl-8 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#14111a] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 bg-white/5">
                <th className="p-4 font-semibold">Order Reference</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Client Details</th>
                <th className="p-4 font-semibold">Handloom Pieces</th>
                <th className="p-4 font-semibold">Amount & Method</th>
                <th className="p-4 font-semibold">Fulfillment Status</th>
                <th className="p-4 font-semibold text-right">View / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-stone-500">
                    No client orders found under this status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <span className="font-bold text-amber-300 font-mono">{order.orderNumber}</span>
                      <span className="block text-[10px] text-stone-500">Track: {order.trackingNumber}</span>
                    </td>

                    <td className="p-4 text-stone-300">
                      {order.date}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400">{order.customerEmail}</p>
                      <p className="text-[10px] text-stone-500">{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {order.items.slice(0, 2).map((item) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt=""
                            className="h-10 w-8 rounded-lg object-cover"
                            title={item.productName}
                          />
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] font-bold text-stone-400">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} total item(s)
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">
                        Rs. {Math.round(order.total).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] font-semibold uppercase text-stone-400">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none uppercase ${
                          order.status === "delivered"
                            ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-300"
                            : "border-amber-500/40 bg-amber-950/50 text-amber-300"
                        }`}
                      >
                        <option value="pending" className="bg-[#14111a] text-white">Pending</option>
                        <option value="processing" className="bg-[#14111a] text-white">Processing</option>
                        <option value="handcrafted" className="bg-[#14111a] text-white">Handcrafted</option>
                        <option value="shipped" className="bg-[#14111a] text-white">Shipped</option>
                        <option value="delivered" className="bg-[#14111a] text-white">Delivered</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:bg-white/10 hover:text-white transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#14111a] p-8 text-white shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Order Reference: {selectedOrder.orderNumber}
              </span>
              <h2 className="mt-1 text-xl font-bold font-serif-luxury text-white">
                Fulfillment Inspection Sheet
              </h2>
              <p className="text-xs text-stone-400">Placed on {selectedOrder.date} &bull; Estimated: {selectedOrder.estimatedDelivery}</p>
            </div>

            {/* Recipient & Address */}
            <div className="mt-6 rounded-2xl bg-white/5 p-4 text-xs space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-stone-300">Delivery Recipient</h4>
              <p className="text-sm font-semibold text-white">{selectedOrder.customerName}</p>
              <p className="text-stone-400">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              <div className="flex gap-4 pt-1 text-stone-400">
                <span>Phone: {selectedOrder.customerPhone}</span>
                <span>Email: {selectedOrder.customerEmail}</span>
              </div>
            </div>

            {/* Garments Breakdown */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">Garment Items ({selectedOrder.items.length})</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl bg-white/5 p-3 text-xs">
                  <img src={item.image} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h5 className="font-bold text-white">{item.productName}</h5>
                    <p className="text-[11px] text-stone-400">Qty: {item.quantity} &bull; Rs. {item.price.toLocaleString("en-IN")} each</p>
                    {item.customization && (
                      <p className="text-[10px] text-amber-300 mt-1">
                        Specs: Size {item.customization.size || "Std"} &bull; {item.customization.blouseStitching ? "Tailored Blouse" : ""} &bull; {item.customization.bottomStyle || ""}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-white">Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="mt-6 border-t border-white/10 pt-4 space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount:</span>
                  <span>- Rs. {selectedOrder.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>Rs. {selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                <span>Total Invoice:</span>
                <span>Rs. {Math.round(selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
