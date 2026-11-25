"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LoaderCircle, Sparkles } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminService.login(email, password);

      // The backend sets the HttpOnly adminToken cookie.
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF] p-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#173F35] p-10 text-white md:flex">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5E6D7] text-[#173F35]">
              <Sparkles size={24} />
            </div>
            <h1 className="mt-14 text-4xl font-semibold leading-tight">
              Membership
              <br />
              administration,
              <br />
              <span className="font-serif italic text-[#D5E6D7]">
                made thoughtful.
              </span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Review applications, manage members and build a community where
              every detail matters.
            </p>
          </div>
          <p className="text-xs text-white/40">MOSAIC · ADMINISTRATION</p>
          <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-white/10" />
        </section>

        <section className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
              <LockKeyhole size={23} />
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-[#78917F]">
              ADMINISTRATOR ACCESS
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#173F35]">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Sign in to manage membership applications.
            </p>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#29473D]">
                  Email address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#29473D]">
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] font-medium text-white hover:bg-[#245747] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign in to dashboard"
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
