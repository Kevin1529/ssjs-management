import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { SITE } from "@/constants/site";

export default function ContactCard() {
  return (
    <div className="space-y-5 rounded-3xl border border-line bg-white p-8 sm:p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand-accent">
        <Mail size={22} aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-ink-strong">Get in touch</h2>
      <p className="leading-7 text-gray-500">
        Send our community team a note and we’ll get back to you soon.
      </p>
      <a
        href={`mailto:${SITE.contactEmail}`}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-hover"
      >
        <MessageCircle size={18} aria-hidden="true" />
        {SITE.contactEmail}
      </a>
      <div className="border-t border-line-soft pt-5 text-sm text-gray-500">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-brand-accent hover:text-brand">
          Sign in to your account
        </Link>
      </div>
    </div>
  );
}
