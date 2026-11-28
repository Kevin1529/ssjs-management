import { CalendarDays } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import EventCard from "@/components/site/EventCard";
import Eyebrow from "@/components/ui/Eyebrow";
import { EVENTS } from "@/data/site-content";

export default function EventsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <Eyebrow>MAKE A LITTLE TIME FOR YOU</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-strong sm:text-6xl">
          Gather, explore, belong.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500">
          Come as you are. There’s always something good happening at Mosaic.
        </p>

        <div className="mt-12 grid gap-5">
          {EVENTS.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-sm text-gray-400">
          <CalendarDays size={16} aria-hidden="true" />
          Event details may change. Members receive the latest updates.
        </p>
      </section>
    </SiteShell>
  );
}
