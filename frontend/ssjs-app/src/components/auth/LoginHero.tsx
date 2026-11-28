import BrandLogo from "@/components/ui/BrandLogo";
import { SITE } from "@/constants/site";
import LoginIllustration from "./LoginIllustration";

/** Left-hand brand panel on the login page (desktop only). */
export default function LoginHero() {
  return (
    <section className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 text-white lg:flex xl:p-14">
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -bottom-36 -left-28 h-[500px] w-[500px] rounded-full border border-white/10" />
      <div className="absolute right-10 top-1/3 h-48 w-48 rounded-full bg-brand-light/10 blur-3xl" />

      <div className="relative z-10">
        <BrandLogo tone="onDark" size="md" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <div className="mb-8">
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs tracking-widest text-brand-light">
            YOUR JOURNEY STARTS HERE
          </span>
          <h1 className="mt-7 text-5xl font-medium leading-[1.12] tracking-tight xl:text-6xl">
            Belong to
            <br />
            something
            <br />
            <span className="font-serif italic text-brand-light">meaningful.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/65">
            One community. Shared experiences. A membership that brings people closer
            together.
          </p>
        </div>

        <div className="relative mx-auto max-w-[390px]">
          <LoginIllustration />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs text-white/45">
        <span>{SITE.copyright}</span>
        <span>{SITE.motto}</span>
      </div>
    </section>
  );
}
