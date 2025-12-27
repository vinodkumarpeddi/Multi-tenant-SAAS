import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function TenantSettings() {
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTenant() {
      try {
        const res = await api.get("/tenants/me");

        if (!res?.data?.data) {
          throw new Error("No tenant data");
        }

        setTenant(res.data.data);
        setName(res.data.data.name || "");
      } catch (err) {
        console.error("Tenant load error:", err);
        setError("Unable to load organization settings");
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, []);

  const updateName = async () => {
    if (!tenant) {
      toast.error("Tenant not loaded");
      return;
    }

    if (!name.trim()) {
      toast.error("Company name cannot be empty");
      return;
    }

    try {
      await api.put(`/tenants/${tenant.id}`, { name });
      toast.success("Company name updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">
          Organization Settings
        </h1>

        <input
          className="border p-2 w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={updateName}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <div className="mt-6 text-sm">
          <p>Plan: {tenant.subscription_plan}</p>
          <p>Status: {tenant.status}</p>
          <p>Max Users: {tenant.max_users}</p>
          <p>Max Projects: {tenant.max_projects}</p>
        </div>
      </div>
    </>
  );
}
