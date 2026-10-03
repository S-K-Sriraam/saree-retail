import { NextResponse } from "next/server";
import { Product } from "@/lib/mock-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation"
};

// GET /api/products - Fetch all products from Supabase
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, {
      headers: HEADERS,
      cache: "no-store"
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase fetch products warning:", res.status, err);
      return NextResponse.json({ success: false, data: [], error: err });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
  }
}

// POST /api/products - Insert a new product into Supabase
export async function POST(request: Request) {
  try {
    const product: Product = await request.json();

    const row = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      subcategory: product.subcategory,
      base_price: product.base_price,
      compare_price: product.compare_price || null,
      fabric: product.fabric,
      weave_type: product.weave_type || "Handloom Jacquard",
      work_type: product.work_type || "Pure Zari Brocade",
      color: product.color,
      color_code: product.color_code || "#881337",
      color_variants: product.color_variants || [],
      description: product.description,
      short_description: product.short_description,
      sku: product.sku,
      stock: product.stock,
      is_featured: product.is_featured ?? true,
      is_active: product.is_active ?? true,
      rating: product.rating || 5,
      reviews_count: product.reviews_count || 0,
      images: product.images || [],
      three_d_preset: product.three_d_preset || "kanchipuram",
      details: product.details || {},
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase insert product response:", res.status, err);
      // Return success with payload so client state works even if RLS is in strict mode
      return NextResponse.json({ success: false, error: err, fallbackProduct: product });
    }

    const created = await res.json();
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/products - Update product details in Supabase
export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(updates)
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

// DELETE /api/products - Delete product from Supabase
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: HEADERS
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
