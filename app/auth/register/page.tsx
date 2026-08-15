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
    <main>
      <h1>Create your Geethvarnam account</h1>

      {params.success === "check-email" && (
        <div>
          <h2>Account created successfully!</h2>

          <p>
            We have sent a confirmation link to your email address.
          </p>

          <p>
            Please verify your email and then log in.
          </p>

          <a href="/auth/login">
            Go to Login
          </a>
        </div>
      )}

      {params.error && (
        <div>
          <p>
            Registration failed: {params.error}
          </p>
        </div>
      )}

      {!params.success && (
        <form action={register}>
          <div>
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
            />
          </div>

          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>

          <button type="submit">
            Create Account
          </button>
        </form>
      )}

      {!params.success && (
        <p>
          Already have an account?{" "}
          <a href="/auth/login">
            Login
          </a>
        </p>
      )}
    </main>
  );
}