import { createClient } from "@/lib/supabase/server";
import { createCategory } from "./actions";

type CategoriesPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      "id, name, slug, description, image_url, is_active, created_at"
    )
    .order("created_at", { ascending: false });

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Saree Retail</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage product categories.
          </p>
        </div>

        {params.success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {params.success}
          </div>
        )}

        {params.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Create Category */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Add Category
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a category for your saree products.
            </p>

            <form action={createCategory} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Kanchipuram Silk"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Traditional silk sarees..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="image_url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>

                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Optional. We will add proper image storage later.
                </p>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked
                  className="h-4 w-4"
                />

                <span className="text-sm text-gray-700">
                  Active category
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create Category
              </button>
            </form>
          </section>

          {/* Category List */}
          <section className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Existing Categories
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {categories?.length ?? 0} categories
              </p>
            </div>

            {error ? (
              <div className="p-6 text-sm text-red-600">
                Unable to load categories.
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="divide-y">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-6 px-6 py-5"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        /{category.slug}
                      </p>

                      {category.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div>
                      {category.is_active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  No categories yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first category using the form.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}