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

// Helper: Convert Supabase snake_case row to frontend Order model
function rowToOrder(row: any): Order {
  let shippingAddress = row.shipping_address || row.shippingAddress || {};
  if (typeof shippingAddress === "string") {
    try {
      shippingAddress = JSON.parse(shippingAddress);
    } catch {}
  }

  let items = row.items || [];
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {}
  }

  return {
    id: row.id,
    orderNumber: row.order_number || row.orderNumber || row.id,
    date: row.date || new Date().toISOString().split("T")[0],
    customerName: row.customer_name || row.customerName || "Customer",
    customerEmail: row.customer_email || row.customerEmail || "",
    customerPhone: row.customer_phone || row.customerPhone || "",
    shippingAddress: {
      street: shippingAddress.street || shippingAddress.line1 || "",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      pincode: shippingAddress.pincode || shippingAddress.postal_code || ""
    },
    items: Array.isArray(items) ? items : [],
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    tax: Number(row.tax) || 0,
    shipping: Number(row.shipping) || 0,
    total: Number(row.total) || 0,
    status: row.status || "processing",
    paymentMethod: row.payment_method || row.paymentMethod || "upi",
    trackingNumber: row.tracking_number || row.trackingNumber || `GV-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
    estimatedDelivery: row.estimated_delivery || row.estimatedDelivery || "3-5 business days"
  };
}

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

    const rawData = await res.json();
    const formattedOrders: Order[] = Array.isArray(rawData) ? rawData.map(rowToOrder) : [];
    return NextResponse.json({ success: true, data: formattedOrders });
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
      discount: order.discount || 0,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      total: order.total,
      status: order.status || "processing",
      payment_method: order.paymentMethod || "upi",
      tracking_number: order.trackingNumber || `GV-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
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
      console.error("Supabase insert order response error:", res.status, err);
      return NextResponse.json({ success: false, error: err, fallbackOrder: order });
    }

    const created = await res.json();
    const formattedOrder = Array.isArray(created) && created[0] ? rowToOrder(created[0]) : order;
    return NextResponse.json({ success: true, data: formattedOrder });
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
