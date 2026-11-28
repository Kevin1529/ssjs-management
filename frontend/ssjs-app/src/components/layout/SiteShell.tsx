import SiteFooter from "./SiteFooter";

export default function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-canvas">
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
