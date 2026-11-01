import { NextResponse } from "next/server";

/**
 * GET /api/db-check
 * Diagnostic endpoint to verify Supabase connectivity and RLS policies.
 * Returns a detailed status report for debugging the admin→DB→storefront sync.
 */
export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const activeKey = SERVICE_KEY || ANON_KEY || PUBLISHABLE_KEY;
  const keyType = SERVICE_KEY ? "service_role" : ANON_KEY ? "anon" : "publishable_fallback";

  const report: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      SUPABASE_URL_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SERVICE_ROLE_KEY_set: !!SERVICE_KEY,
      PUBLISHABLE_KEY_set: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      ANON_KEY_set: !!ANON_KEY,
      active_key_type: keyType,
    },
    tests: {}
  };

  // Test 1: SELECT products (read)
  try {
    const readRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,stock&limit=5`, {
      headers: {
        apikey: activeKey,
        Authorization: `Bearer ${activeKey}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });
    const readBody = await readRes.text();
    report.tests.select = {
      status: readRes.status,
      ok: readRes.ok,
      row_count: readRes.ok ? (JSON.parse(readBody) as any[]).length : 0,
      error: readRes.ok ? null : readBody
    };
  } catch (e: any) {
    report.tests.select = { error: e.message };
  }

  // Test 2: INSERT a test product (write)
  const testId = `diag-test-${Date.now()}`;
  try {
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: {
        apikey: activeKey,
        Authorization: `Bearer ${activeKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        id: testId,
        name: "Diagnostic Test Product",
        slug: testId,
        category: "saree",
        subcategory: "Saree Couture",
        base_price: 1,
        fabric: "Test",
        weave_type: "Test",
        work_type: "Test",
        color: "Test",
        color_code: "#000000",
        color_variants: [],
        description: "Diagnostic test - safe to delete",
        short_description: "Diagnostic test",
        sku: `DIAG-${Date.now()}`,
        stock: 1,
        is_featured: false,
        is_active: false,
        rating: 5,
        reviews_count: 0,
        images: [],
        three_d_preset: "kanchipuram",
        details: {},
        created_at: new Date().toISOString()
      })
    });
    const insertBody = await insertRes.text();
    report.tests.insert = {
      status: insertRes.status,
      ok: insertRes.ok,
      error: insertRes.ok ? null : insertBody
    };

    // Test 3: DELETE the test row immediately (cleanup)
    if (insertRes.ok) {
      const delRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${testId}`, {
        method: "DELETE",
        headers: {
          apikey: activeKey,
          Authorization: `Bearer ${activeKey}`,
          "Content-Type": "application/json"
        }
      });
      report.tests.delete_cleanup = { status: delRes.status, ok: delRes.ok };
    }
  } catch (e: any) {
    report.tests.insert = { error: e.message };
  }

  // Summary diagnosis
  const canRead = report.tests.select?.ok;
  const canWrite = report.tests.insert?.ok;

  report.diagnosis = canRead && canWrite
    ? "✅ DB fully operational — reads AND writes work. Check RLS policies if user side still shows 0 products."
    : canRead && !canWrite
    ? "❌ READ works but WRITE fails. RLS is blocking inserts. You need SUPABASE_SERVICE_ROLE_KEY in Vercel env vars, OR add public INSERT policy on products table."
    : !canRead
    ? "❌ Cannot read from DB. Supabase URL or API key is wrong."
    : "❌ Unknown state.";

  report.fix_needed = !canWrite
    ? "Go to Supabase Dashboard → SQL Editor and run the SQL in /SUPABASE_FIX.md, OR add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables."
    : null;

  return NextResponse.json(report, { status: 200 });
}
