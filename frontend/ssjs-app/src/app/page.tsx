import FeatureCard from "@/components/site/FeatureCard";
import HomeHero from "@/components/site/HomeHero";
import SiteShell from "@/components/layout/SiteShell";
import { HOME_FEATURES } from "@/data/site-content";

export default function Home() {
  return (
    <SiteShell>
      <HomeHero />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-10 md:grid-cols-3 lg:px-12">
        {HOME_FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} index={index} {...feature} />
        ))}
      </section>
    </SiteShell>
  );
}
