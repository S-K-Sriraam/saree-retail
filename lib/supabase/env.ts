const SUPABASE_ENV_ERROR =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel Project Settings > Environment Variables, then redeploy.";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(SUPABASE_ENV_ERROR);
  }

  return { url, publishableKey };
}

export function tryGetSupabaseEnv() {
  try {
    return getSupabaseEnv();
  } catch {
    return null;
  }
}
