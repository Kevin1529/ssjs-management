import AdminLoginForm from "@/components/auth/AdminLoginForm";
import AdminLoginHero from "@/components/auth/AdminLoginHero";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <AdminLoginHero />
        <section className="flex items-center justify-center p-8 sm:p-12">
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
