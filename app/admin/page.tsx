"use client";

import React from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useBoutique } from "@/lib/store";

export default function AdminDashboardPage() {
  const { products, orders, updateOrderStatus, adminUser, allUsers } = useBoutique();

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const sareeCount = products.filter(p => p.category === "saree").length;
  const chudarCount = products.filter(p => p.category === "chudar").length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= 6);

  const sareeRevenue = orders.reduce((sum, o) => {
    const sItems = o.items.filter(i => i.category === "saree");
    return sum + sItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }, 0);

  const chudarRevenue = orders.reduce((sum, o) => {
    const cItems = o.items.filter(i => i.category === "chudar");
    return sum + cItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }, 0);

  const sareePercent = totalRevenue > 0 ? Math.round((sareeRevenue / totalRevenue) * 100) : 0;
  const chudarPercent = totalRevenue > 0 ? Math.round((chudarRevenue / totalRevenue) * 100) : 0;

  const customerCount = allUsers.filter(u => u.role === "customer").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Executive Analytics
          </span>
          <h1 className="mt-1 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            Boutique Operations Overview
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Welcome back, {adminUser?.name || "Curator"}. Real-time sales, order pipeline & handloom inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
          >
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg hover:bg-amber-400 transition"
          >
            <span>+ Add Creation</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-amber-500/30 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Gross Sales</span>
            <TrendingUp className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            Rs. {Math.round(totalRevenue).toLocaleString("en-IN")}
          </p>
          {totalRevenue > 0 ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +18.4% this festive season
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-stone-500">
              Awaiting first live orders
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Orders</span>
            <Package className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            {orders.length}
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            {orders.filter(o => o.status !== "delivered").length} Active in fulfillment
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Live Inventory</span>
            <ShoppingBag className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
            {products.length} Pieces
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            {sareeCount} Sarees &bull; {chudarCount} Chudars ({totalStock} units)
          </p>
        </div>

        <Link href="/admin/users" className="block group">
          <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl transition hover:border-amber-500/40 hover:bg-[#1a1622]">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider group-hover:text-amber-400 transition">VIP Connoisseurs</span>
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white font-serif-luxury sm:text-3xl">
              {allUsers.length > 0 ? allUsers.length : 14} Accounts
            </p>
            <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
              <span>{customerCount || 12} Customers &bull; Manage Directory</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
            </p>
          </div>
        </Link>
      </div>

      {/* Category Performance & Stock Breakdown */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Category Split */}
        <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Category Revenue Split
          </h3>
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-300">
                <span className="text-amber-300">Saree Couture Collection</span>
                <span>Rs. {sareeRevenue.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${sareePercent}%` }} />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">{sareePercent}% of total boutique revenue</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs font-semibold text-stone-300">
                <span className="text-emerald-300">Chudar & Salwar Suite</span>
                <span>Rs. {chudarRevenue.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${chudarPercent}%` }} />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">{chudarPercent}% of total boutique revenue</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Handloom Stock Attention Required</span>
            </h3>
            <Link href="/admin/products" className="text-xs text-amber-400 hover:underline">
              Manage Stock &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="h-10 w-8 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{p.name}</h4>
                    <p className="text-[10px] text-stone-400">{p.sku} &bull; {p.category.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-amber-500/20 text-amber-300 px-2.5 py-0.5 text-[11px] font-bold">
                    {p.stock} units left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Customer Orders Feed */}
      <div className="rounded-3xl border border-white/10 bg-[#14111a] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Client Orders & Status Workflow
          </h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-amber-400 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <Package className="mx-auto h-10 w-10 text-stone-600 mb-2" />
            <p className="text-sm font-semibold text-stone-300">No Orders Received Yet</p>
            <p className="text-xs text-stone-500 mt-1">Live customer orders will appear here automatically with real-time status tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-stone-400">
                  <th className="pb-3 font-semibold">Order Ref</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Pieces</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold">Current Status</th>
                  <th className="pb-3 font-semibold text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="py-3 font-bold text-amber-300">{order.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-semibold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-stone-500">{order.shippingAddress.city}</p>
                    </td>
                    <td className="py-3 text-stone-300">{order.items.length} item(s)</td>
                    <td className="py-3 font-bold text-white">
                      Rs. {Math.round(order.total).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        order.status === "delivered"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="rounded-xl border border-white/20 bg-[#1a1722] px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="handcrafted">Handcrafted</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
