import { redirect } from "next/navigation";
import { isConfiguredAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin" || isConfiguredAdminEmail(user.email)) {
    redirect("/admin");
  }

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
        User ID: {user.id}
      </p>

      <form action={logout}>
        <button type="submit">
          Logout 
        </button>
      </form>
    </main>
  );
}
