import { ArrowLeft, SearchX } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import Eyebrow from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-canvas px-5 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-[0_15px_60px_rgba(23,63,53,0.07)] sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-tint text-brand">
          <SearchX size={30} aria-hidden="true" />
        </div>
        <Eyebrow className="mt-6 tracking-[0.2em]">ERROR 404</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold text-brand">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          The page you requested does not exist or may have moved.
        </p>
        <ButtonLink href="/" className="mt-7">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to home
        </ButtonLink>
      </section>
    </main>
  );
}
