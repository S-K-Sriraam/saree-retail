import { NextResponse } from "next/server";
import { Product } from "@/lib/mock-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
// Priority: service_role key (bypasses RLS) > anon key > publishable key (fallback hardcoded)
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation"
};

/**
 * Strips base64-encoded images from the images array.
 * Base64 images can be several MB, causing Vercel's 4.5MB body limit to be exceeded.
 * They are replaced with a placeholder URL so the product row is still inserted.
 */
function sanitizeImages(images: string[] | undefined): string[] {
  if (!images || images.length === 0) return ["/images/placeholder.jpg"];
  const safe = images
    .filter(Boolean)
    .map(url => (url.startsWith("data:") ? "/images/placeholder.jpg" : url));
  return safe.length > 0 ? safe : ["/images/placeholder.jpg"];
}

/**
 * Strips base64 images from color_variants too.
 */
function sanitizeColorVariants(variants: any[]): any[] {
  if (!Array.isArray(variants)) return [];
  return variants.map(v => ({
    ...v,
    image: v.image?.startsWith("data:") ? "" : (v.image || "")
  }));
}

/**
 * Build the safe Supabase row from a Product object.
 * Strips base64 images to avoid exceeding payload limits.
 */
function buildRow(product: Partial<Product> & { id: string }) {
  return {
    id: product.id,
    name: product.name || "Handloom Piece",
    slug: product.slug || (product.name || product.id).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: product.category || "saree",
    subcategory: product.subcategory || (product.category === "saree" ? "Saree Couture" : "Chudar & Salwar"),
    base_price: Number(product.base_price || 0),
    compare_price: product.compare_price || null,
    fabric: product.fabric || "Pure Handloom Silk",
    weave_type: product.weave_type || "Handloom Jacquard",
    work_type: product.work_type || "Pure Zari Brocade",
    color: product.color || "Base Color",
    color_code: product.color_code || "#881337",
    color_variants: sanitizeColorVariants(product.color_variants || []),
    description: product.description || `${product.name}. Handcrafted with fine artisanal needlework.`,
    short_description: product.short_description || product.name || "",
    sku: product.sku || `GV-${Date.now().toString(36).toUpperCase()}`,
    stock: Number(product.stock ?? 0),
    is_featured: product.is_featured ?? true,
    is_active: product.is_active ?? true,
    rating: product.rating || 5,
    reviews_count: product.reviews_count || 0,
    images: sanitizeImages(product.images as string[]),
    three_d_preset: product.three_d_preset || "kanchipuram",
    details: product.details || {},
    created_at: new Date().toISOString()
  };
}

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
    const row = buildRow(product);

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
      console.error("[POST /api/products] Supabase insert FAILED:", res.status, err, "| key_type:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "anon" : "publishable");
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
      console.error("[PUT /api/products] Supabase PATCH FAILED:", patchRes.status, err, "| key_type:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon/publishable");
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    const updatedRows = await patchRes.json();

    // If 0 rows were updated, the product doesn't exist in Supabase yet.
    // Perform an UPSERT to sync it immediately.
    if (Array.isArray(updatedRows) && updatedRows.length === 0) {
      console.warn(`Product ${id} not found on Supabase. Upserting complete product record...`);
      const fullProd = { ...(product || {}), ...updates, id };
      const row = buildRow(fullProd);

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
