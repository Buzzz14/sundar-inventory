import React, { createContext, useContext, type ReactNode } from "react";
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
  const { data, isLoading, error } = useMeQuery();

  const user = data?.user || null;
  const isAuthenticated = Boolean(user && !error);

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




