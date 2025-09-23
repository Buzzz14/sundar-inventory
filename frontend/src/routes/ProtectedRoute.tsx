import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";

const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token"));
};

export default function ProtectedRoute({ children }: PropsWithChildren) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


