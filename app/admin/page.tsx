import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role") 
        .eq("id", user!.id)
        .maybeSingle();

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="text-sm text-gray-500">Saree Retail</p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Welcome back, {profile?.full_name || "Admin"}.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="mt-2 text-3xl font-bold">0</p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Orders</p>
                        <p className="mt-2 text-3xl font-bold">0</p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Customers</p>
                        <p className="mt-2 text-3xl font-bold">0</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
