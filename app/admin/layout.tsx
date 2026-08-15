import { redirect } from "next/navigation";
import { isConfiguredAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check logged-in user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Get user's profile and role
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

    // User doesn't have admin rivileges
    if ((profileError || profile?.role !== "admin") && !isConfiguredAdminEmail(user.email)) {
        redirect("/account");
    }

    return <>{children}</>;
}
