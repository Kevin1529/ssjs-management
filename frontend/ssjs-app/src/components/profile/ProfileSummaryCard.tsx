import ProfilePhoto from "@/components/ui/ProfilePhoto";
import StatusBadge from "@/components/ui/StatusBadge";
import type { User } from "@/types/user";

interface ProfileSummaryCardProps {
  user: User;
  /** Used in the photo's alt text when the user has no name yet. */
  fallbackName: string;
  /** Lines shown under the name (email, IDs...). */
  children?: React.ReactNode;
}

export default function ProfileSummaryCard({
  user,
  fallbackName,
  children,
}: ProfileSummaryCardProps) {
  const name = user.fullName || fallbackName;

  return (
    <section className="mb-7 rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProfilePhoto src={user.profilePhoto} alt={`${name} profile`} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-brand">{user.fullName || "Name not provided"}</h2>
            <StatusBadge status={user.status} format="raw" />
          </div>
          {children}
          {user.uniqueUserId && (
            <p className="mt-2 text-sm font-semibold text-brand-accent">
              Membership ID: {user.uniqueUserId}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
