import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [tenantName, setTenantName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/auth/register-tenant", {
        tenantName,
        subdomain,
        adminFullName: adminName,
        adminEmail: email,
        adminPassword: password,
      });

      setMessage("Organization registered successfully. Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Register Organization 🚀
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create your workspace and admin account
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Company Name
          </label>
          <input
            className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Your company name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
        </div>

        {/* Subdomain */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Subdomain
          </label>
          <input
            className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="company-name"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />
          <p className="text-xs text-slate-400 mt-1">
            Example: company-name.app.com
          </p>
        </div>

        {/* Admin Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Admin Full Name
          </label>
          <input
            className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="Admin full name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
        </div>

        {/* Admin Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Admin Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Admin Password
          </label>
          <input
            type="password"
            className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          Register Organization
        </button>

        {/* Footer */}
        <p className="text-sm mt-6 text-center text-slate-600">
          Already registered?{" "}
          <a
            href="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
