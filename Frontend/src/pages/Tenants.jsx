import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const loadTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data.data);
    } catch {
      setError("Failed to load tenants");
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const startEdit = (tenant) => {
    setEditingTenantId(tenant.id);
    setForm({
      name: tenant.name,
      status: tenant.status,
      subscriptionPlan: tenant.subscription_plan,
      maxUsers: tenant.max_users,
      maxProjects: tenant.max_projects,
    });
  };

  const cancelEdit = () => {
    setEditingTenantId(null);
    setForm({});
  };

  const saveEdit = async (tenantId) => {
    try {
      await api.put(`/tenants/${tenantId}`, form);
      toast.success("Tenant updated successfully");
      setEditingTenantId(null);
      loadTenants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update tenant");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Tenants</h1>
          <p className="text-slate-500 mt-1">
            Manage organizations and their subscriptions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Company</th>
                <th className="p-3 text-left text-sm font-semibold">Subdomain</th>
                <th className="p-3 text-left text-sm font-semibold">Plan</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Max Users
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  Max Projects
                </th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tenants.map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  {/* Company */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className="font-medium">{t.name}</span>
                    )}
                  </td>

                  {/* Subdomain */}
                  <td className="p-3 text-slate-600">{t.subdomain}</td>

                  {/* Plan */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <select
                        className="border rounded p-1"
                        value={form.subscriptionPlan}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            subscriptionPlan: e.target.value,
                          })
                        }
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            t.subscription_plan === "enterprise"
                              ? "bg-purple-100 text-purple-700"
                              : t.subscription_plan === "pro"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {t.subscription_plan}
                      </span>
                    )}
                  </td>

                  {/* Max Users */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-20"
                        value={form.maxUsers}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            maxUsers: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      t.max_users
                    )}
                  </td>

                  {/* Max Projects */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-20"
                        value={form.maxProjects}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            maxProjects: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      t.max_projects
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <select
                        className="border rounded p-1"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            t.status === "active"
                              ? "bg-green-100 text-green-700"
                              : t.status === "trial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {t.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    {editingTenantId === t.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="text-green-600 hover:underline mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(t)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
