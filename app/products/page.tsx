import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      base_price,
      compare_price,
      is_active,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading storefront products:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold text-gray-950">
            Geethvarnam
          </Link>

          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/products" className="font-medium text-gray-950">
              Products
            </Link>
            <Link href="/auth/login">Login</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-700">Saree Collection</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">Products</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Browse the latest Geethvarnam ethnic fashion pieces.
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const category = Array.isArray(product.categories)
                ? product.categories[0]?.name
                : (product.categories as { name: string } | null)?.name;

              return (
                <article
                  key={product.id}
                  className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">
                    {category ?? "Saree"}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-gray-950">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{product.slug}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-950">
                      Rs. {Number(product.base_price).toFixed(2)}
                    </span>
                    {product.compare_price && (
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {Number(product.compare_price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-950">
              No products are live yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add active products from the admin products page.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
