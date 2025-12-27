import { useState } from "react";
import api from "../api/api";
import { saveAuth } from "../auth/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSubdomain, setTenantSubdomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        tenantSubdomain: tenantSubdomain || undefined,
      });

      saveAuth(res.data.data.token, res.data.data.user);
      const user = res.data.data.user;

      if (user.role === "super_admin") {
        window.location.href = "/tenants";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Login to your workspace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Tenant Subdomain */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Tenant Subdomain
          </label>
          <input
            className="border border-slate-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave empty for Super Admin"
            value={tenantSubdomain}
            onChange={(e) => setTenantSubdomain(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-sm mt-6 text-center text-slate-600">
          New organization?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
