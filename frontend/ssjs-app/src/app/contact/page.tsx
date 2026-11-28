import SiteShell from "@/components/layout/SiteShell";
import ContactCard from "@/components/site/ContactCard";
import Eyebrow from "@/components/ui/Eyebrow";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-28">
        <div>
          <Eyebrow>WE’RE HERE FOR YOU</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink-strong sm:text-6xl">
            Let’s start a conversation.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-500">
            Have a question about membership, an upcoming event, or just want to say
            hello? We’d love to hear from you.
          </p>
        </div>

        <ContactCard />
      </section>
    </SiteShell>
  );
}
