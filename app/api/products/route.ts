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

// POST /api/products - Insert or Upsert a product into Supabase
export async function POST(request: Request) {
  try {
    const product: Product = await request.json();

    const row = {
      id: product.id,
      name: product.name,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: product.category || "saree",
      subcategory: product.subcategory || (product.category === "saree" ? "Saree Couture" : "Chudar & Salwar"),
      base_price: Number(product.base_price || 0),
      compare_price: product.compare_price || null,
      fabric: product.fabric || "Pure Handloom Silk",
      weave_type: product.weave_type || "Handloom Jacquard",
      work_type: product.work_type || "Pure Zari Brocade",
      color: product.color || "Base Color",
      color_code: product.color_code || "#881337",
      color_variants: product.color_variants || [],
      description: product.description || `${product.name}. Handcrafted in ${product.fabric || "fine silk"} with fine artisanal needlework and opulent drape.`,
      short_description: product.short_description || product.name,
      sku: product.sku || `GV-${Date.now().toString(36).toUpperCase()}`,
      stock: Number(product.stock ?? 10),
      is_featured: product.is_featured ?? true,
      is_active: product.is_active ?? true,
      rating: product.rating || 5,
      reviews_count: product.reviews_count || 0,
      images: product.images && product.images.length > 0 ? product.images : ["/images/placeholder.jpg"],
      three_d_preset: product.three_d_preset || "kanchipuram",
      details: product.details || {},
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: {
        ...HEADERS,
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase insert product response:", res.status, err);
      return NextResponse.json({ success: false, error: err, fallbackProduct: product }, { status: 400 });
    }

    const created = await res.json();
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/products - Update product details in Supabase (with automatic upsert fallback)
export async function PUT(request: Request) {
  try {
    const { id, updates, product } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    // Attempt PATCH first
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        ...HEADERS,
        Prefer: "return=representation"
      },
      body: JSON.stringify(updates)
    });

    if (!patchRes.ok) {
      const err = await patchRes.text();
      console.warn("Supabase PATCH product error:", err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    const updatedRows = await patchRes.json();

    // If 0 rows were updated, the product doesn't exist in Supabase yet.
    // Perform an UPSERT to sync it immediately.
    if (Array.isArray(updatedRows) && updatedRows.length === 0) {
      console.warn(`Product ${id} not found on Supabase. Upserting complete product record...`);
      const fullProd = {
        ...(product || {}),
        ...updates,
        id
      };

      const row = {
        id: fullProd.id,
        name: fullProd.name || "Handloom Piece",
        slug: fullProd.slug || fullProd.id,
        category: fullProd.category || "saree",
        subcategory: fullProd.subcategory || (fullProd.category === "saree" ? "Saree Couture" : "Chudar & Salwar"),
        base_price: Number(fullProd.base_price || 0),
        compare_price: fullProd.compare_price || null,
        fabric: fullProd.fabric || "Pure Silk",
        weave_type: fullProd.weave_type || "Handloom Jacquard",
        work_type: fullProd.work_type || "Pure Zari Brocade",
        color: fullProd.color || "Multi-color",
        color_code: fullProd.color_code || "#881337",
        color_variants: fullProd.color_variants || [],
        description: fullProd.description || `${fullProd.name}. Handcrafted with fine artisanal needlework.`,
        short_description: fullProd.short_description || fullProd.name,
        sku: fullProd.sku || `GV-${Date.now().toString(36).toUpperCase()}`,
        stock: Number(fullProd.stock ?? 0),
        is_featured: fullProd.is_featured ?? true,
        is_active: fullProd.is_active ?? true,
        rating: fullProd.rating || 5,
        reviews_count: fullProd.reviews_count || 0,
        images: fullProd.images && fullProd.images.length > 0 ? fullProd.images : ["/images/placeholder.jpg"],
        three_d_preset: fullProd.three_d_preset || "kanchipuram",
        details: fullProd.details || {},
        created_at: new Date().toISOString()
      };

      const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: "POST",
        headers: {
          ...HEADERS,
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify(row)
      });

      if (!upsertRes.ok) {
        const err = await upsertRes.text();
        console.error("Upsert failed:", err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
      }

      const upserted = await upsertRes.json();
      return NextResponse.json({ success: true, data: upserted });
    }

    return NextResponse.json({ success: true, data: updatedRows });
  } catch (error: any) {
    console.error("Error in PUT /api/products:", error);
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
