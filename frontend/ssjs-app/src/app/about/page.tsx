import SiteShell from "@/components/layout/SiteShell";
import ValueCard from "@/components/site/ValueCard";
import Eyebrow from "@/components/ui/Eyebrow";
import { ABOUT_VALUES } from "@/data/site-content";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <Eyebrow>ABOUT MOSAIC</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink-strong sm:text-6xl">
          A little more connected makes a world of difference.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
          Mosaic is a membership community built around the simple idea that life is
          richer when we experience it together. We bring people and possibilities
          closer, one gathering at a time.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ABOUT_VALUES.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
