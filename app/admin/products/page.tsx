import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      base_price,
      compare_price,
      sku,
      is_active,
      is_featured,
      created_at,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Saree Retail</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your saree products.
            </p>
          </div>

          <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
            Add Product
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {products && products.length > 0 ? (
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    SKU
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {product.slug}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {Array.isArray(product.categories)
                        ? product.categories[0]?.name ?? "Uncategorized"
                        : (product.categories as { name: string } | null)?.name ?? "Uncategorized"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Rs. {Number(product.base_price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sku || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No products yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Start by adding your first saree product.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
