import Link from "next/link";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-700">Geethvarnam</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">
            Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your account.
          </p>
        </div>

        {params.error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Login failed: {params.error}
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-950 shadow-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-950 shadow-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Do not have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-gray-950">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
