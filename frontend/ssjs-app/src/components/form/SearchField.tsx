import { Search } from "lucide-react";
import { useId } from "react";
import FormField from "./FormField";

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  className?: string;
}

export default function SearchField({
  label,
  value,
  onChange,
  placeholder,
  hideLabel,
  className,
}: SearchFieldProps) {
  const id = useId();

  return (
    <FormField label={label} htmlFor={id} hideLabel={hideLabel} className={className}>
      <div className="relative">
        <Search
          size={17}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="input pl-10"
        />
      </div>
    </FormField>
  );
}
