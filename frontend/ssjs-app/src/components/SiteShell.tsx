import Link from "next/link";

export default function SiteShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#F6F5EF]">
      <main>{children}</main>

      <footer className="border-t border-[#E5EAE2] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
          <p>© 2026 Mosaic Membership. Made for belonging.</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-[#173F35]">
              About
            </Link>
            <Link href="/events" className="hover:text-[#173F35]">
              Events
            </Link>
            <Link href="/contact" className="hover:text-[#173F35]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
