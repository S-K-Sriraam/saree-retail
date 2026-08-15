import Link from "next/link";
import { register } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-700">Geethvarnam</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Register to start shopping and managing your account.
          </p>
        </div>

        {params.success === "check-email" && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
            <h2 className="font-semibold">Account created successfully!</h2>

            <p className="mt-2">
              We have sent a confirmation link to your email address.
            </p>

            <p className="mt-2">
              Please verify your email and then log in.
            </p>

            <Link
              href="/auth/login"
              className="mt-4 inline-flex rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Go to Login
            </Link>
          </div>
        )}

        {params.error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Registration failed: {params.error}
          </div>
        )}

        {!params.success && (
          <form action={register} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-950 shadow-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              />
            </div>

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
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-950 shadow-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>
        )}

        {!params.success && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-gray-950">
              Login
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
