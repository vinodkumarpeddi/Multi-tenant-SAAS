import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Tenants from "./pages/Tenants";
import TenantSettings from "./pages/TenantSettings";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/projects"
          element={
            <ProtectedRoute roles={["tenant_admin", "user"]}>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute roles={["tenant_admin", "user"]}>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["tenant_admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["tenant_admin"]}>
              <TenantSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenants"
          element={
            <ProtectedRoute roles={["super_admin"]}>
              <Tenants />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
