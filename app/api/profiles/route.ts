import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://egcqtoibavhjvcdyzosw.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2";

const HEADERS: Record<string, string> = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// Helper: detect actual columns available in profiles table
async function getAvailableColumns(): Promise<string[]> {
  // Try a dummy select to detect columns
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?limit=1&select=*`, {
    headers: HEADERS,
    cache: "no-store",
  });
  if (!res.ok) return ["id", "full_name", "phone"];
  const data = await res.json();
  if (data && data.length > 0) return Object.keys(data[0]);
  // Return base known columns from the screenshot
  return ["id", "full_name", "phone", "avatar_url"];
}

// GET /api/profiles — fetch all profiles or query by email (?email=...)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // If no specific email is provided, return all profiles for Admin user management
    if (!email || email === "all") {
      let res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: HEADERS,
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ success: true, profiles: data || [] });
      }

      return NextResponse.json({ success: true, profiles: [] });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try querying by email column if it exists
    const resByEmail = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(cleanEmail)}&select=*`,
      { headers: HEADERS, cache: "no-store" }
    );

    if (resByEmail.ok) {
      const data = await resByEmail.json();
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, exists: true, profile: data[0] });
      }
    }

    // Fallback: query by full_name containing the email (legacy storage pattern)
    const resByName = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?full_name=ilike.*${encodeURIComponent(cleanEmail)}*&select=*`,
      { headers: HEADERS, cache: "no-store" }
    );

    if (resByName.ok) {
      const data = await resByName.json();
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, exists: true, profile: data[0] });
      }
    }

    return NextResponse.json({ success: true, exists: false, profile: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/profiles — Upsert profile into Supabase (schema-adaptive)
export async function POST(request: Request) {
  try {
    const profile = await request.json();

    if (!profile.email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = profile.email.trim().toLowerCase();
    const fullName = profile.name || profile.full_name || cleanEmail.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const validId = randomUUID();

    // ── STEP 1: Detect available columns ────────────────────────────────────
    const availableCols = await getAvailableColumns();
    const hasEmail = availableCols.includes("email");
    const hasName = availableCols.includes("name");
    const hasRole = availableCols.includes("role");
    const hasPreferences = availableCols.includes("preferences");
    const hasJoinedDate = availableCols.includes("joined_date");
    const hasUpdatedAt = availableCols.includes("updated_at");

    // ── STEP 2: Build row using only columns that exist ──────────────────────
    const row: Record<string, any> = {
      id: validId,
      full_name: fullName,
      phone: profile.phone?.trim() || null,
    };

    if (hasEmail) row.email = cleanEmail;
    if (hasName) row.name = fullName;
    if (hasRole) row.role = profile.role || "customer";
    if (hasPreferences) row.preferences = profile.preferences || [];
    if (hasJoinedDate) row.joined_date = profile.joinedDate || new Date().toISOString();
    if (hasUpdatedAt) row.updated_at = new Date().toISOString();

    // ── STEP 3: Check for existing profile (duplicate prevention) ───────────
    if (hasEmail) {
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(cleanEmail)}&select=id`,
        { headers: HEADERS, cache: "no-store" }
      );
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (existing && existing.length > 0) {
          // UPDATE existing record instead of INSERT
          const existingId = existing[0].id;
          const updateRes = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?id=eq.${existingId}`,
            {
              method: "PATCH",
              headers: { ...HEADERS, Prefer: "return=representation" },
              body: JSON.stringify({
                full_name: fullName,
                phone: row.phone,
                ...(hasRole ? { role: row.role } : {}),
                ...(hasPreferences ? { preferences: row.preferences } : {}),
                ...(hasUpdatedAt ? { updated_at: row.updated_at } : {}),
              }),
            }
          );
          const updatedData = updateRes.ok ? await updateRes.json() : null;
          return NextResponse.json({ success: true, profile: updatedData?.[0] || row, updated: true });
        }
      }
    }

    // ── STEP 4: Insert new profile row ───────────────────────────────────────
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { ...HEADERS, Prefer: "return=representation" },
      body: JSON.stringify(row),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("Supabase profile insert failed:", insertRes.status, errText);

      // ── STEP 5: If insert fails due to RLS, provide clear error ─────────────
      if (insertRes.status === 401 || errText.includes("row-level security")) {
        return NextResponse.json({
          success: false,
          error: "Database permission denied. Please run the SQL fix in Supabase Dashboard > SQL Editor.",
          rlsError: true,
          sqlFix: `
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update profiles" ON public.profiles;
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '[]'::jsonb;
          `.trim(),
        }, { status: 403 });
      }

      return NextResponse.json({ success: false, error: errText }, { status: 500 });
    }

    const insertData = await insertRes.json();
    console.log("✅ Profile saved to Supabase:", cleanEmail);
    return NextResponse.json({ success: true, profile: insertData?.[0] || row });
  } catch (error: any) {
    console.error("Error in POST /api/profiles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT / PATCH /api/profiles — Update profile details
export async function PUT(request: Request) {
  try {
    const { id, email, updates } = await request.json();
    if (!id && !email) {
      return NextResponse.json({ success: false, error: "Profile ID or Email required" }, { status: 400 });
    }

    const availableCols = await getAvailableColumns();
    const cleanUpdates: Record<string, any> = {};

    if (updates.name || updates.full_name) {
      cleanUpdates.full_name = updates.name || updates.full_name;
      if (availableCols.includes("name")) cleanUpdates.name = updates.name || updates.full_name;
    }
    if (updates.phone !== undefined) cleanUpdates.phone = updates.phone;
    if (updates.password) {
      if (availableCols.includes("password")) cleanUpdates.password = updates.password;
      if (availableCols.includes("password_hash")) cleanUpdates.password_hash = updates.password;
    }
    if (updates.role && availableCols.includes("role")) cleanUpdates.role = updates.role;
    if (updates.preferences && availableCols.includes("preferences")) cleanUpdates.preferences = updates.preferences;
    if (updates.address && availableCols.includes("address")) cleanUpdates.address = updates.address;
    if (availableCols.includes("updated_at")) cleanUpdates.updated_at = new Date().toISOString();

    // EMAIL IS STRICTLY IMMUTABLE — It cannot be modified as it represents the account primary login identity
    delete cleanUpdates.email;

    const queryField = id ? `id=eq.${encodeURIComponent(id)}` : `email=eq.${encodeURIComponent(email.trim().toLowerCase())}`;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${queryField}`, {
      method: "PATCH",
      headers: { ...HEADERS, Prefer: "return=representation" },
      body: JSON.stringify(cleanUpdates),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText, fallbackUpdates: cleanUpdates });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, profile: data?.[0] || updates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return PUT(request);
}
