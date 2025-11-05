import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
const Items = lazy(() => import("@/pages/Items"));
const Categories = lazy(() => import("@/pages/Categories"));
const Users = lazy(() => import("@/pages/Users"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={["superadmin"]}>
              <Users />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
