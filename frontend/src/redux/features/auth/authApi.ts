import { api } from "../api";

type User = { id: string; email: string; name?: string; role: string };
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
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;


