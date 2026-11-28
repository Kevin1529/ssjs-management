interface ProfileFormShellProps {
  /** Content above the card (logo or back link). */
  above: React.ReactNode;
  /** Content of the dark green card header. */
  hero: React.ReactNode;
  children: React.ReactNode;
}

/** Page chrome shared by the create-profile and edit-profile pages. */
export default function ProfileFormShell({ above, hero, children }: ProfileFormShellProps) {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {above}

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_60px_rgba(23,63,53,0.07)]">
          <header className="bg-brand px-6 py-8 text-white sm:px-10">{hero}</header>
          {children}
        </section>
      </div>
    </main>
  );
}
