export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

        {/* Logo */}
       <div className="text-center">
  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
    E-CR
  </h1>

  <p className="mt-2 text-sm font-medium text-slate-500">
    Electronic Class Representative
  </p>

  <h2 className="mt-8 text-2xl font-semibold text-slate-900">
    Welcome Back
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    Sign in to continue to your account
  </p>
</div>

        {/* Login Form */}
        <form className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center justify-between">
  <label className="flex items-center gap-2 text-sm text-slate-600">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300"
    />

    <span>Remember me</span>
  </label>

  <a
    href="#"
    className="text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    Forgot password?
  </a>
</div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
          >
            Login
          </button>

        </form>

      </div>
    </main>
  );
}