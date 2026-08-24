import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation"
};

// POST /api/profiles - Upsert user/admin profile into Supabase
export async function POST(request: Request) {
  try {
    const profile = await request.json();

    const row = {
      id: profile.id,
      email: profile.email?.toLowerCase(),
      name: profile.name,
      phone: profile.phone || null,
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST /api/profiles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
