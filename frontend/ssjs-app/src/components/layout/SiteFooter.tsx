import Link from "next/link";
import { FOOTER_NAV } from "@/constants/navigation";
import { SITE } from "@/constants/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
        <p>
          {SITE.copyright}. {SITE.motto}
        </p>
        <nav aria-label="Footer" className="flex gap-5">
          {FOOTER_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
