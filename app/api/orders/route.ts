import { NextResponse } from "next/server";
import { Order } from "@/lib/mock-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation"
};

// GET /api/orders - Fetch all orders from Supabase
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: HEADERS,
      cache: "no-store"
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase fetch orders warning:", res.status, err);
      return NextResponse.json({ success: false, data: [], error: err });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
  }
}

// POST /api/orders - Create a new order in Supabase
export async function POST(request: Request) {
  try {
    const order: Order = await request.json();

    const row = {
      id: order.id,
      order_number: order.orderNumber,
      date: order.date,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      shipping_address: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      status: order.status || "pending",
      payment_method: order.paymentMethod,
      tracking_number: order.trackingNumber || `GV-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimated_delivery: order.estimatedDelivery || "3-5 business days",
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase insert order response:", res.status, err);
      return NextResponse.json({ success: false, error: err, fallbackOrder: order });
    }

    const created = await res.json();
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status in Supabase
export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ success: false, error: err });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
