# Supabase Fix Guide — Products Table Sync

## The Problem
The `products` table in Supabase is empty (0 records) even though the Admin Suite shows products.
Admin data is stored only in `localStorage` and writes to Supabase are failing due to **RLS (Row Level Security) blocking anonymous inserts**.

---

## Step 1 — Run This SQL in Supabase Dashboard → SQL Editor

Go to: **https://supabase.com/dashboard/project/egcqtoibavhjvcdyzosw/sql/new**

Paste and run this entire block:

```sql
-- ============================================================
-- STEP 1: Fix NOT NULL constraints that block inserts
-- ============================================================
ALTER TABLE public.products ALTER COLUMN subcategory DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN subcategory SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN description SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN short_description DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN short_description SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN weave_type DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN weave_type SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN work_type DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN work_type SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN three_d_preset DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN three_d_preset SET DEFAULT 'kanchipuram';

-- ============================================================
-- STEP 2: Drop and recreate RLS policies to allow public access
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.products;
DROP POLICY IF EXISTS "Enable update for all users" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.products;

CREATE POLICY "Allow public read products"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow public insert products"
  ON public.products FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update products"
  ON public.products FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete products"
  ON public.products FOR DELETE USING (true);
```

---

## Step 2 — Get Your Supabase Anon Key

Go to: **https://supabase.com/dashboard/project/egcqtoibavhjvcdyzosw/settings/api**

Copy the **`anon` `public`** key (it starts with `eyJ...`).

---

## Step 3 — Add Environment Variables to Vercel

Go to: **https://vercel.com/dashboard** → your project → **Settings → Environment Variables**

Add these (set for **Production**, **Preview**, and **Development**):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://egcqtoibavhjvcdyzosw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_leYxEdE8HaiBwLtTo5DT6Q_P58v7ly2` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(the `eyJ...` anon key from Step 2)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(the `service_role` key from Step 2 — keep SECRET, not public)* |
| `GMAIL_USER` | `sriraamsk05@gmail.com` |
| `GMAIL_APP_PASSWORD` | `vuuk abnv dfdx zsnb` |
| `RESEND_API_KEY` | *(your Resend API key — from resend.com dashboard)* |

After adding variables → click **Redeploy** (Deployments → ... → Redeploy).

---

## Step 4 — Verify Fix

After redeployment, visit:
**https://saree-retail.vercel.app/api/db-check**

You should see:
```json
{
  "diagnosis": "✅ DB fully operational — reads AND writes work.",
  "tests": {
    "select": { "ok": true },
    "insert": { "ok": true },
    "delete_cleanup": { "ok": true }
  }
}
```

If `insert.ok` is still `false`, the service_role key isn't set in Vercel yet.

---

## Step 5 — Sync Existing Admin Products to DB

Once the DB check passes:
1. Go to **https://saree-retail.vercel.app/admin/products**
2. Click the **"Sync Database"** button
3. This will push all localStorage products up to Supabase
4. Refresh **https://saree-retail.vercel.app** — products should appear!
