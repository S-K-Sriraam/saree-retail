"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "");

    if (!email || !password || !fullName) {
        redirect("/auth/register?error=missing-fields");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp ({ 
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error) {
        redirect(
            `/auth/register?error=${encodeURIComponent(error.message)}`
        );
    }

    redirect("/auth/register?success=check-email");
}