import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { SiteEvent } from "@/data/site-content";

export default function EventCard({ day, month, title, description, location, type }: SiteEvent) {
  return (
    <article className="grid gap-6 rounded-3xl border border-line bg-white p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-brand-tint text-brand">
        <span className="text-2xl font-semibold leading-none">{day}</span>
        <span className="mt-1 text-xs font-semibold tracking-widest">{month}</span>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-brand-muted">{type}</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink-strong">{title}</h2>
        <p className="mt-2 max-w-2xl leading-7 text-gray-500">{description}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} aria-hidden="true" />
          {location}
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 font-semibold text-brand-accent hover:text-brand"
      >
        Join us <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}
