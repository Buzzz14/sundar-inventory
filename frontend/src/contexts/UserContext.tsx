import React, { createContext, useContext, type ReactNode, useEffect, useState } from "react";
import { useMeQuery } from "@/redux/features/auth/authApi";
import { type User, type UserRole } from "@/types";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(
    typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
  );

  // React to token changes via storage events and custom dispatch
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue || undefined);
      }
    };
    const handleAuthEvent = () => {
      const current = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined;
      setToken(current);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth:token-changed", handleAuthEvent as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth:token-changed", handleAuthEvent as EventListener);
    };
  }, []);

  // Pass token as a parameter so the query refires when token changes
  const { data, isLoading, error } = useMeQuery(token, { skip: !token });

  const user = data?.user || null;
  const isAuthenticated = Boolean(token && user && !error);

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const isSuperAdmin = hasRole("superadmin");
  const isAdmin = hasRole(["admin", "superadmin"]);
  const isUser = hasRole("user");

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};




