import { Clock3 } from "lucide-react";

export default function PendingApprovalBanner() {
  return (
    <section className="rounded-3xl border border-[#E9D8B6] bg-[#FFF9ED] p-7 sm:p-10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7E9C9] text-[#98702E]">
        <Clock3 size={28} aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold tracking-widest text-[#98702E]">
        APPLICATION UNDER REVIEW
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[#4D402A]">
        Your application is in good hands.
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#806E50]">
        We&apos;ve received your details. Our team will review your application and
        update your membership status here.
      </p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#806E50]">
        <Clock3 size={16} aria-hidden="true" />
        Pending approval
      </div>
    </section>
  );
}
