"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import EmailField from "@/components/form/EmailField";
import PasswordField from "@/components/form/PasswordField";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { setActiveRole } from "@/lib/active-role";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services/admin.service";

export default function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminService.login(email, password);

      // The backend sets the HttpOnly adminToken cookie.
      setActiveRole("admin");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Admin login failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
        <LockKeyhole size={23} aria-hidden="true" />
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] text-brand-muted">
        ADMINISTRATOR ACCESS
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-brand">Welcome back.</h2>
      <p className="mt-3 text-sm text-gray-500">Sign in to manage membership applications.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <EmailField
          required
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert plain>{error}</Alert>}

        <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Signing in...">
          Sign in to dashboard
        </Button>
      </form>
    </div>
  );
}
