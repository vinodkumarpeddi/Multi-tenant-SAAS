import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getUser } from "../auth/auth";
import { toast } from "react-toastify";

export default function Tasks() {
  const { projectId } = useParams();
  const currentUser = getUser();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  /* ---------- CREATE FORM ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  /* ---------- EDIT STATE ---------- */
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  /* ---------- LOAD ---------- */
  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data.filter((u) => u.is_active));
    } catch {}
  };

  useEffect(() => {
    loadTasks();
    if (currentUser.role === "tenant_admin") {
      loadUsers();
    }
  }, [projectId]);

  /* ---------- CREATE TASK ---------- */
  const createTask = async () => {
    if (!title) {
      toast.error("Task title is required");
      return;
    }

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      });

      toast.success("Task created");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo("");
      setDueDate("");
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  /* ---------- EDIT TASK ---------- */
  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedTo || "",
      dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || null,
      });

      toast.success("Task updated");
      setEditingId(null);
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Project Tasks</h1>
          <p className="text-slate-500 mt-1">
            Track and manage tasks for this project
          </p>
        </div>

        {/* ---------- CREATE TASK ---------- */}
        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-xl">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">
              Add New Task
            </h2>

            <input
              className="border rounded-lg p-2 w-full mb-3"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="border rounded-lg p-2 w-full mb-3"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="border rounded-lg p-2 w-full mb-3"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              className="border rounded-lg p-2 w-full mb-3"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border rounded-lg p-2 w-full mb-4"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              onClick={createTask}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Create Task
            </button>
          </div>
        )}

        {/* ---------- TASK TABLE ---------- */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3 text-sm font-semibold">Title</th>
                <th className="text-left p-3 text-sm font-semibold">Status</th>
                <th className="text-left p-3 text-sm font-semibold">Priority</th>
                <th className="text-left p-3 text-sm font-semibold">
                  Assigned To
                </th>
                <th className="text-left p-3 text-sm font-semibold">Due Date</th>
                {currentUser.role === "tenant_admin" && (
                  <th className="text-left p-3 text-sm font-semibold">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-3 font-medium">{t.title}</td>

                  {/* STATUS */}
                  <td className="p-3">
                    {editingId === t.id ? (
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            t.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : t.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {t.status}
                      </span>
                    )}
                  </td>

                  {/* PRIORITY */}
                  <td className="p-3">
                    {editingId === t.id ? (
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value })
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            t.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : t.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {t.priority}
                      </span>
                    )}
                  </td>

                  {/* ASSIGNED */}
                  <td className="p-3 text-slate-600">
                    {editingId === t.id ? (
                      <select
                        value={form.assignedTo}
                        onChange={(e) =>
                          setForm({ ...form, assignedTo: e.target.value })
                        }
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.full_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      t.assignedToName || "—"
                    )}
                  </td>

                  {/* DUE DATE */}
                  <td className="p-3">
                    {editingId === t.id ? (
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) =>
                          setForm({ ...form, dueDate: e.target.value })
                        }
                      />
                    ) : t.dueDate ? (
                      new Date(t.dueDate).toLocaleDateString()
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* ACTION */}
                  {currentUser.role === "tenant_admin" && (
                    <td className="p-3">
                      {editingId !== t.id ? (
                        <button
                          onClick={() => startEdit(t)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => saveEdit(t.id)}
                            className="text-green-600 mr-3 hover:underline"
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
