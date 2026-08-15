import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-rose-700">
          Women&apos;s Ethnic Fashion
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold text-gray-950">
          Geethvarnam
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Elegant sarees and ethnic wear curated for modern celebrations.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            View Products
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
