import { Heart, Sparkles, Users } from "lucide-react";
import SiteShell from "@/components/SiteShell";

const values = [
  {
    icon: Users,
    title: "Connection",
    description:
      "We create opportunities for people to meet, share ideas, and build genuine friendships.",
  },
  {
    icon: Heart,
    title: "Belonging",
    description:
      "Everyone deserves a welcoming place to show up as themselves and feel included.",
  },
  {
    icon: Sparkles,
    title: "Discovery",
    description:
      "We make it easy to try something new, learn from one another, and grow together.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#78917F]">
          ABOUT MOSAIC
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#193B32] sm:text-6xl">
          A little more connected makes a world of difference.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
          Mosaic is a membership community built around the simple idea that
          life is richer when we experience it together. We bring people and
          possibilities closer, one gathering at a time.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-[#E5EAE2] bg-white p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#47765C]">
                <Icon size={22} />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-[#193B32]">
                {title}
              </h2>
              <p className="mt-3 leading-7 text-gray-500">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
