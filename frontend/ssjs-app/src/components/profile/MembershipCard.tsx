import { BadgeCheck } from "lucide-react";

export default function MembershipCard({ membershipId }: { membershipId?: string }) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl bg-brand p-7 text-white shadow-xl sm:p-10">
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-brand-light">
            <BadgeCheck size={20} aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest">OFFICIAL MEMBER</span>
          </div>
          <h2 className="mt-5 font-serif text-3xl italic sm:text-4xl">Welcome to Mosaic.</h2>
          <p className="mt-3 text-sm text-white/65">Your application has been approved.</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:min-w-56">
          <p className="text-xs tracking-widest text-white/60">MEMBERSHIP ID</p>
          <p className="mt-3 text-2xl font-semibold tracking-wider">
            {membershipId || "Not assigned"}
          </p>
          <p className="mt-2 text-xs text-brand-light">Verified membership</p>
        </div>
      </div>
    </section>
  );
}
