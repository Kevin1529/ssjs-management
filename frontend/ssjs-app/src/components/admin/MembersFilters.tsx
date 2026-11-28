import SearchField from "@/components/form/SearchField";
import StatusFilterField from "@/components/form/StatusFilterField";
import type { StatusFilter } from "@/types/admin";

interface MembersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
}

export default function MembersFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: MembersFiltersProps) {
  return (
    <section className="mb-6 rounded-2xl border border-line bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <SearchField
          label="Search members"
          value={search}
          onChange={onSearchChange}
          placeholder="Name, email, mobile or membership ID"
        />
        <StatusFilterField value={status} onChange={onStatusChange} />
      </div>
    </section>
  );
}
