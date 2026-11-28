import { RefreshCw, ShieldAlert } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";

export default function RejectedBanner({ reason }: { reason?: string }) {
  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-7 sm:p-10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <ShieldAlert size={28} aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold tracking-widest text-red-700">ACTION REQUIRED</p>
      <h3 className="mt-3 text-2xl font-semibold text-red-950">
        Your application needs an update.
      </h3>
      <p className="mt-3 text-sm leading-6 text-red-800">
        {reason || "Please review and update your profile."}
      </p>
      <ButtonLink href="/profile" className="mt-7 px-6">
        Update and resubmit
        <RefreshCw size={16} aria-hidden="true" />
      </ButtonLink>
    </section>
  );
}
