import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-28">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#78917F]">
            WE’RE HERE FOR YOU
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#193B32] sm:text-6xl">
            Let’s start a conversation.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-500">
            Have a question about membership, an upcoming event, or just want
            to say hello? We’d love to hear from you.
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-[#E5EAE2] bg-white p-8 sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#47765C]">
            <Mail size={22} />
          </div>
          <h2 className="text-2xl font-semibold text-[#193B32]">
            Get in touch
          </h2>
          <p className="leading-7 text-gray-500">
            Send our community team a note and we’ll get back to you soon.
          </p>
          <a
            href="mailto:hello@mosaic.community"
            className="inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 font-medium text-white transition hover:bg-[#245747]"
          >
            <MessageCircle size={18} />
            hello@mosaic.community
          </a>
          <div className="border-t border-[#EDF0EA] pt-5 text-sm text-gray-500">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#47765C] hover:text-[#173F35]"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
