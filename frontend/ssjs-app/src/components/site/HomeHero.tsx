import Link from "next/link";
import { ArrowRight, CalendarDays, HeartHandshake, Sparkles } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -bottom-48 left-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-light/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-light">
            <Sparkles size={15} aria-hidden="true" />
            A COMMUNITY THAT FEELS LIKE HOME
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Belong to something{" "}
            <span className="font-serif italic text-brand-light">meaningful.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
            Mosaic brings people together through shared experiences, thoughtful
            gatherings, and a community that makes room for everyone.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-light px-6 py-3.5 font-semibold text-brand transition hover:bg-white"
            >
              Join the community <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/events"
              className="rounded-xl border border-white/25 px-6 py-3.5 font-medium text-white transition hover:bg-white/10"
            >
              Explore events
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-8 backdrop-blur-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <HeartHandshake size={28} aria-hidden="true" />
          </div>
          <p className="mt-8 text-sm font-semibold tracking-[0.16em] text-brand-light">
            MORE THAN A MEMBERSHIP
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Find your people.</h2>
          <p className="mt-4 leading-7 text-white/65">
            Make meaningful connections, discover new interests, and share moments that
            stay with you.
          </p>
          <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/75">
            <CalendarDays size={18} className="text-brand-light" aria-hidden="true" />
            New experiences, all year round
          </div>
        </div>
      </div>
    </section>
  );
}
