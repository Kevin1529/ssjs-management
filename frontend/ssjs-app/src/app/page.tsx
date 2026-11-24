import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import SiteShell from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[#173F35] text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-48 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#D5E6D7]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#D5E6D7]">
              <Sparkles size={15} />
              A COMMUNITY THAT FEELS LIKE HOME
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Belong to something{" "}
              <span className="font-serif italic text-[#D5E6D7]">
                meaningful.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
              Mosaic brings people together through shared experiences,
              thoughtful gatherings, and a community that makes room for
              everyone.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D5E6D7] px-6 py-3.5 font-semibold text-[#173F35] transition hover:bg-white"
              >
                Join the community <ArrowRight size={18} />
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D5E6D7] text-[#173F35]">
              <HeartHandshake size={28} />
            </div>
            <p className="mt-8 text-sm font-semibold tracking-[0.16em] text-[#D5E6D7]">
              MORE THAN A MEMBERSHIP
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Find your people.</h2>
            <p className="mt-4 leading-7 text-white/65">
              Make meaningful connections, discover new interests, and share
              moments that stay with you.
            </p>
            <div className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/75">
              <CalendarDays size={18} className="text-[#D5E6D7]" />
              New experiences, all year round
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-10 md:grid-cols-3 lg:px-12">
        {[
          {
            title: "Meet your community",
            description:
              "Get to know people who share your curiosity and enthusiasm.",
          },
          {
            title: "Make time for experiences",
            description:
              "From relaxed get-togethers to new adventures, find something for you.",
          },
          {
            title: "Feel at home",
            description:
              "A welcoming space where every member can take part and belong.",
          },
        ].map((item, index) => (
          <article
            key={item.title}
            className="rounded-3xl border border-[#E5EAE2] bg-white p-8"
          >
            <span className="text-sm font-semibold tracking-widest text-[#78917F]">
              0{index + 1}
            </span>
            <h2 className="mt-5 text-xl font-semibold text-[#193B32]">
              {item.title}
            </h2>
            <p className="mt-3 leading-7 text-gray-500">{item.description}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
