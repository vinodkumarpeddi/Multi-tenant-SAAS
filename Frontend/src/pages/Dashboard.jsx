import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { getUser } from "../auth/auth";
import { FolderKanban, Users } from "lucide-react";

export default function Dashboard() {
  const user = getUser();

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const projectsRes = await api.get("/projects");

        let usersCount = 0;
        if (user.role === "tenant_admin") {
          const usersRes = await api.get("/users");
          usersCount = usersRes.data.data.length;
        }

        setStats({
          projects: projectsRes.data.data.length,
          users: usersCount,
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, [user.role]);

  return (
    <>
      <Navbar />

      {/* Page Wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Here’s an overview of your workspace
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          {/* Projects Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FolderKanban size={28} />
            </div>

            <div>
              <h2 className="text-sm font-medium text-slate-500">
                Total Projects
              </h2>
              <p className="text-3xl font-bold text-slate-800">
                {stats.projects}
              </p>
            </div>
          </div>

          {/* Users Card (Only for Tenant Admin) */}
          {user.role === "tenant_admin" && (
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Users size={28} />
              </div>

              <div>
                <h2 className="text-sm font-medium text-slate-500">
                  Total Users
                </h2>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.users}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
