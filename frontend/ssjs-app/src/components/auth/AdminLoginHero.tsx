import { Sparkles } from "lucide-react";

export default function AdminLoginHero() {
  return (
    <section className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 text-white md:flex">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Sparkles size={24} aria-hidden="true" />
        </div>
        <h1 className="mt-14 text-4xl font-semibold leading-tight">
          Membership
          <br />
          administration,
          <br />
          <span className="font-serif italic text-brand-light">made thoughtful.</span>
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
          Review applications, manage members and build a community where every detail
          matters.
        </p>
      </div>
      <p className="text-xs text-white/40">MOSAIC · ADMINISTRATION</p>
      <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-white/10" />
    </section>
  );
}
