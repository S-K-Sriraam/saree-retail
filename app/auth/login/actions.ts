"use server";

import { redirect } from "next/navigation";
import { isConfiguredAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        redirect("/auth/login?error=missing-fields");
    }

    const supabase = await createClient();

    const  { data, error } =
        await supabase.auth.signInWithPassword ({
            email,
            password,
        });

        if (error) {
            redirect(
                `/auth/login?error=${encodeURIComponent(error.message)}`
            );
        }

        if (!data.user) {
            redirect("/auth/login?error=authentication-failed");
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle();

        if (profile?.role === "admin" || isConfiguredAdminEmail(data.user.email)) {
            redirect("/admin");
        }

        redirect("/account");
}
