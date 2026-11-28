import { Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/date-format";
import type { User } from "@/types/user";

const columns = ["Member", "Membership ID", "Mobile", "Status", "Registered"];

export default function MembersTable({
  users,
  onView,
}: {
  users: User[];
  onView: (user: User) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-surface-muted text-xs text-gray-500">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-6 py-4 font-medium">
                {column}
              </th>
            ))}
            <th scope="col" className="px-6 py-4 text-right font-medium">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-line-soft">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-surface-muted">
              <td className="px-6 py-4">
                <p className="font-medium text-brand">{user.fullName || "Name not provided"}</p>
                <p className="mt-1 text-xs text-gray-500">{user.email || "-"}</p>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.uniqueUserId || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.mobileNumber}</td>
              <td className="px-6 py-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDateTime(user.createdAt) || "-"}
              </td>
              <td className="px-6 py-4 text-right">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onView(user)}
                  icon={<Eye size={15} />}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
