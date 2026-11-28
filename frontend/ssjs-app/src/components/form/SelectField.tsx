import { useId } from "react";
import FormField from "./FormField";

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
}

export default function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SelectFieldProps<T>) {
  const id = useId();

  return (
    <FormField label={label} htmlFor={id} className={className}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
