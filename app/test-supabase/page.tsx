import { createClient } from  "@/lib/supabase/server";

export default async function TestSupabase() {
    const supabase = await createClient();

    const { data, error } = await supabase 
     .from("test_connection")
     .select("*");

    if (error) {
        return ( 
            <main style={{ padding: "40px" }}>
                <h1>Supabase Connection Failed</h1>
                <pre>{error.message}</pre>
            </main>
        );
    }

    return ( 
        <main style={{ padding: "40px" }}>
            <h1>Supabase Connection Successful</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </main>
    );
}