import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation"
};

const isUuid = (str?: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str || "");
};

// GET /api/profiles?email=... - Fetch profile by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email query param required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query by email
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(cleanEmail)}&select=*`,
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

    const cleanEmail = profile.email.trim().toLowerCase();
    const fullName = profile.name || profile.full_name || cleanEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const validId = isUuid(profile.id) ? profile.id : randomUUID();

    // Construct unified payload supporting both full_name and name columns
    const row: Record<string, any> = {
      id: validId,
      email: cleanEmail,
      full_name: fullName,
      name: fullName,
      phone: profile.phone?.trim() || null,
      role: profile.role || "customer",
      preferences: profile.preferences || [],
      joined_date: profile.joinedDate || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Primary Supabase profile upsert warning:", res.status, err);

      // If schema variation (e.g. table without 'name' column), retry with minimal fields
      if (err.includes("Could not find the 'name' column")) {
        delete row.name;
        res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: "POST",
          headers: HEADERS,
          body: JSON.stringify(row)
        });
      }

      if (!res.ok) {
        const fallbackErr = await res.text();
        return NextResponse.json({ success: false, error: fallbackErr });
      }
    }

    const data = await res.json();
    return NextResponse.json({ success: true, profile: data?.[0] || row });
  } catch (error: any) {
    console.error("Error in POST /api/profiles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
