import { api } from "../api";
import type { User } from "@/types";

type AuthResponse = { token: string; user: User };

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: build.mutation<AuthResponse, { email: string; password: string; name?: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    me: build.query<{ user: User }, void>({
      query: () => ({ url: "/auth/me" }),
    }),
    getAllUsers: build.query<{ users: User[] }, void>({
      query: () => ({ url: "/auth/users" }),
    }),
    updateUserRole: build.mutation<{ message: string; user: User }, { userId: string; role: string }>({
      query: ({ userId, role }) => ({ 
        url: `/auth/users/${userId}/role`, 
        method: "PATCH", 
        body: { role } 
      }),
    }),
    deleteUser: build.mutation<{ message: string }, { userId: string }>({
      query: ({ userId }) => ({ 
        url: `/auth/users/${userId}`, 
        method: "DELETE" 
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useMeQuery, 
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation
} = authApi;


