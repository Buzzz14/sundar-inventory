import { Routes, Route } from "react-router-dom";
import Items from "@/pages/Items";
import Categories from "@/pages/Categories";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default AppRoutes;
