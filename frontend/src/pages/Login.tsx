import type { FormEvent } from "react";
import { useState } from "react";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password }).unwrap();
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      // Notify app about token change so UserProvider reacts immediately
      window.dispatchEvent(new Event("auth:token-changed"));
      navigate("/items", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4" aria-describedby={error ? "login-error" : undefined}>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="login-email">Email</label>
          <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="login-password">Password</label>
          <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-invalid={!!error || undefined} />
        </div>
        {error && <div id="login-error" className="text-sm text-red-600" role="alert">{error}</div>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-sm text-center">
          No account? <Link to="/register" className="underline">Create one</Link>
        </div>
      </form>
    </div>
  );
}


