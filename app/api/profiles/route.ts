import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation"
};

// GET /api/profiles?email=... - Fetch profile by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email query param required" }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=*`,
      {
        headers: HEADERS,
        cache: "no-store"
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ success: false, error: err });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, profile: data?.[0] || null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/profiles - Upsert user/admin profile into Supabase
export async function POST(request: Request) {
  try {
    const profile = await request.json();

    if (!profile.email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const row = {
      id: profile.id || `cust-${Date.now().toString(36)}`,
      email: profile.email.trim().toLowerCase(),
      name: profile.name || profile.email.split("@")[0],
      phone: profile.phone?.trim() || null,
      role: profile.role || "customer",
      preferences: profile.preferences || [],
      joined_date: profile.joinedDate || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Supabase upsert profile warning:", res.status, err);
      return NextResponse.json({ success: false, error: err });
    }

    return NextResponse.json({ success: true, profile: row });
  } catch (error: any) {
    console.error("Error in POST /api/profiles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
