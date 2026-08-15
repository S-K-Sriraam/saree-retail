import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  return (
    <main>
      <h1>My Account</h1>

      <p>
        Welcome, {profile?.full_name || "Customer"}
      </p>

      <p>
        Role: {profile?.role}
      </p>

      <p>
        User ID: {userId}
      </p>

      <form action={logout}>
        <button type="submit">
          Logout 
        </button>
      </form>
    </main>
  );
}