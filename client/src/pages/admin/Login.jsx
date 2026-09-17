import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(
        formData.email.trim(),
        formData.password
      );

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACK TO WEBSITE */}

      <div className="absolute left-6 top-6 z-10 md:left-10 md:top-8">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to website
        </button>
      </div>

      {/* MAIN */}

      <main className="flex min-h-screen items-center justify-center px-6 py-20">

        <div className="w-full max-w-md">

          {/* BRAND */}

          <div className="text-center">

            <p className="text-sm font-semibold tracking-[0.2em]">
              ESTATE
              <span className="text-white/40">
                CRM
              </span>
            </p>

            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/30">
              Admin Portal
            </p>

            <h1 className="mt-6 text-4xl font-medium tracking-tight md:text-5xl">
              Welcome back.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Sign in to manage your properties,
              customers and leads.
            </p>

          </div>

          {/* LOGIN CARD */}

          <div className="mt-10 rounded-3xl border border-white/10 bg-[#0d0d0d] p-7 md:p-9">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@estatecrm.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-white/30 focus:bg-white/[0.07]"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-white/30 focus:bg-white/[0.07]"
                />
              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p className="text-xs leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

          </div>

          {/* FOOTER */}

          <p className="mt-8 text-center text-xs text-white/20">
            EstateCRM • Secure Admin Access
          </p>

        </div>

      </main>
    </div>
  );
}

export default Login;