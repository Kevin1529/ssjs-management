import type { AboutValue } from "@/data/site-content";

export default function ValueCard({ icon: Icon, title, description }: AboutValue) {
  return (
    <article className="rounded-3xl border border-line bg-white p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand-accent">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-xl font-semibold text-ink-strong">{title}</h2>
      <p className="mt-3 leading-7 text-gray-500">{description}</p>
    </article>
  );
}
