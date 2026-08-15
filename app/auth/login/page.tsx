import { login } from "./actions";

export default function LoginPage() {
  return (
    <main>
      <h1>Login to Geethvarnam</h1>

      <form action={login}>
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
            required
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Do not have an account?
      </p>

      <a href="/auth/register">
        Create an account
      </a>
    </main>
  );
}