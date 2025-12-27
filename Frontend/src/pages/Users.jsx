import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { getUser } from "../auth/auth";

export default function Users() {
  const currentUser = getUser();

  const [users, setUsers] = useState([]);

  // create user form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ---------- CREATE USER ---------- */
  const createUser = async () => {
    if (!email || !password || !fullName) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/users", {
        email,
        password,
        fullName,
        role: "user",
      });

      setEmail("");
      setPassword("");
      setFullName("");
      toast.success("User created successfully");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  /* ---------- EDIT USER ---------- */
  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      fullName: u.full_name,
      role: u.role,
      isActive: u.is_active ? "true" : "false",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (userId) => {
    try {
      await api.put(`/users/${userId}`, {
        fullName: form.fullName,
        role:
          currentUser.role === "tenant_admin" ? form.role : undefined,
        isActive:
          currentUser.role === "tenant_admin" &&
          currentUser.userId !== userId
            ? form.isActive === "true"
            : undefined,
      });

      toast.success("User updated successfully");
      setEditingId(null);
      loadUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Update failed (tenant admins cannot deactivate themselves)"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 mt-1">
            Manage users in your organization
          </p>
        </div>

        {/* CREATE USER */}
        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-xl">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              Add New User
            </h2>

            <div className="flex gap-3 mb-3">
              <input
                className="border rounded-lg p-2 flex-1"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                className="border rounded-lg p-2 flex-1"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <input
              className="border rounded-lg p-2 w-full mb-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={createUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              Create User
            </button>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Name</th>
                <th className="p-3 text-left text-sm font-semibold">Email</th>
                <th className="p-3 text-left text-sm font-semibold">Role</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const isSelf = currentUser.userId === u.id;
                const canEdit =
                  currentUser.role === "tenant_admin" || isSelf;

                return (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    {/* Name */}
                    <td className="p-3">
                      {editingId === u.id ? (
                        <input
                          className="border rounded p-1 w-full"
                          value={form.fullName}
                          onChange={(e) =>
                            setForm({ ...form, fullName: e.target.value })
                          }
                        />
                      ) : (
                        <span className="font-medium">{u.full_name}</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-3 text-slate-600">{u.email}</td>

                    {/* Role */}
                    <td className="p-3">
                      {editingId === u.id &&
                      currentUser.role === "tenant_admin" ? (
                        <select
                          value={form.role}
                          onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                          }
                        >
                          <option value="user">User</option>
                          <option value="tenant_admin">Tenant Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              u.role === "tenant_admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {editingId === u.id &&
                      currentUser.role === "tenant_admin" &&
                      !isSelf ? (
                        <select
                          value={form.isActive}
                          onChange={(e) =>
                            setForm({ ...form, isActive: e.target.value })
                          }
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              u.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      {canEdit && editingId !== u.id && (
                        <button
                          onClick={() => startEdit(u)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}

                      {editingId === u.id && (
                        <>
                          <button
                            onClick={() => saveEdit(u.id)}
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
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
