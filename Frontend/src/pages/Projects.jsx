import { useEffect, useState } from "react";
import api from "../api/api";
import { getUser } from "../auth/auth";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Projects() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [projects, setProjects] = useState([]);

  // create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  /* ---------- LOAD PROJECTS ---------- */
  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------- CREATE PROJECT ---------- */
  const createProject = async () => {
    if (!name) {
      toast.error("Project name is required");
      return;
    }

    try {
      await api.post("/projects", { name, description });
      setName("");
      setDescription("");
      toast.success("Project created");
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  /* ---------- EDIT PROJECT ---------- */
  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      status: p.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (projectId) => {
    try {
      await api.put(`/projects/${projectId}`, {
        name: form.name,
        description: form.description,
        status: form.status,
      });

      toast.success("Project updated");
      setEditingId(null);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  /* ---------- DELETE PROJECT ---------- */
  const deleteProject = async (projectId) => {
    if (!window.confirm("Delete this project? All tasks will be removed.")) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted");
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">
            Manage and track all your projects
          </p>
        </div>

        {/* CREATE PROJECT */}
        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-xl">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">
              Create New Project
            </h2>

            <input
              className="border rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border rounded-lg p-2 w-full mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={createProject}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Add Project
            </button>
          </div>
        )}

        {/* PROJECT LIST */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3 text-sm font-semibold">Name</th>
                <th className="text-left p-3 text-sm font-semibold">
                  Description
                </th>
                <th className="text-left p-3 text-sm font-semibold">Status</th>
                <th className="text-left p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => {
                const canEdit =
                  currentUser.role === "tenant_admin" ||
                  currentUser.userId === p.created_by;

                return (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    {/* NAME */}
                    <td className="p-3">
                      {editingId === p.id ? (
                        <input
                          className="border rounded p-1 w-full"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      ) : (
                        <span
                          className="text-blue-600 font-medium cursor-pointer hover:underline"
                          onClick={() => navigate(`/projects/${p.id}`)}
                        >
                          {p.name}
                        </span>
                      )}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="p-3 text-slate-600">
                      {editingId === p.id ? (
                        <input
                          className="border rounded p-1 w-full"
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.description || "—"
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      {editingId === p.id ? (
                        <select
                          className="border rounded p-1"
                          value={form.status}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              p.status === "active"
                                ? "bg-green-100 text-green-700"
                                : p.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {p.status}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3">
                      {canEdit && editingId !== p.id && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(p)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {editingId === p.id && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
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
