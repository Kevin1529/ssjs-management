import { STATUS_FILTER_OPTIONS } from "@/constants/status";
import type { StatusFilter } from "@/types/admin";
import SelectField from "./SelectField";

interface StatusFilterFieldProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export default function StatusFilterField({ value, onChange }: StatusFilterFieldProps) {
  return (
    <SelectField
      label="Filter by status"
      value={value}
      options={STATUS_FILTER_OPTIONS}
      onChange={onChange}
    />
  );
}
