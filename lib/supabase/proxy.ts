import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { tryGetSupabaseEnv } from "./env";

export async function updateSession(request: NextRequest) {
    const env = tryGetSupabaseEnv();

    if (!env) {
        console.error(
            "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy."
        );

        return NextResponse.next({
            request,
        });
    }

    let supabaseResponse = NextResponse.next ({
        request,
    })

    const supabase = createServerClient (
        env.url,
        env.publishableKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => 
                        request.cookies.set(name, value)
                    );

                    supabaseResponse = NextResponse.next ({ 
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) => 
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    await supabase.auth.getClaims();

    return supabaseResponse;
}
