import { Routes, Route, Navigate } from "react-router-dom";
import Items from "@/pages/Items";
import Categories from "@/pages/Categories";
import Users from "@/pages/Users";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
