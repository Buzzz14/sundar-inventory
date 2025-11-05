import type { FormEvent } from "react";
import { useState } from "react";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await registerUser({ email, password, name }).unwrap();
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      // Notify app about token change so UserProvider reacts immediately
      window.dispatchEvent(new Event("auth:token-changed"));
      navigate("/items", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4"
        aria-describedby={error ? "register-error" : undefined}
      >
        <h1 className="text-2xl font-semibold">Create account</h1>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="register-name">
            Name
          </label>
          <Input
            id="register-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="register-email">
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="register-password">
            Password
          </label>
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={!!error || undefined}
          />
        </div>
        {error && (
          <div
            id="register-error"
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </div>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Register"}
        </Button>
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
