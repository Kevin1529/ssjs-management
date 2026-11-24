import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

const events = [
  {
    date: "06",
    month: "DEC",
    title: "The Sunday Table",
    description:
      "An easygoing afternoon of good food and new conversations.",
    location: "The Garden House",
    type: "COMMUNITY LUNCH",
  },
  {
    date: "13",
    month: "DEC",
    title: "Make Something Together",
    description:
      "A beginner-friendly creative session. Bring your curiosity; we’ll bring the supplies.",
    location: "Mosaic Studio",
    type: "CREATIVE WORKSHOP",
  },
  {
    date: "20",
    month: "DEC",
    title: "A Walk, Then Coffee",
    description:
      "A relaxed neighborhood walk with a warm drink and even warmer company.",
    location: "Riverside Meeting Point",
    type: "OUTDOOR MEETUP",
  },
];

export default function EventsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#78917F]">
          MAKE A LITTLE TIME FOR YOU
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#193B32] sm:text-6xl">
          Gather, explore, belong.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500">
          Come as you are. There’s always something good happening at Mosaic.
        </p>

        <div className="mt-12 grid gap-5">
          {events.map((event) => (
            <article
              key={event.title}
              className="grid gap-6 rounded-3xl border border-[#E5EAE2] bg-white p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"
            >
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
                <span className="text-2xl font-semibold leading-none">
                  {event.date}
                </span>
                <span className="mt-1 text-xs font-semibold tracking-widest">
                  {event.month}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#78917F]">
                  {event.type}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#193B32]">
                  {event.title}
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-gray-500">
                  {event.description}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {event.location}
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-semibold text-[#47765C] hover:text-[#173F35]"
              >
                Join us <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-gray-400">
          <CalendarDays size={16} />
          Event details may change. Members receive the latest updates.
        </p>
      </section>
    </SiteShell>
  );
}
