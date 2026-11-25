import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F6F5EF] px-5 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#E8EAE2] bg-white p-8 text-center shadow-[0_15px_60px_rgba(23,63,53,0.07)] sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
          <SearchX size={30} />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-[#78917F]">
          ERROR 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#173F35]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          The page you requested does not exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#245747]"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>
      </section>
    </main>
  );
}
